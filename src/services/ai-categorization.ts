import { CREDENTIAL_CATEGORIES } from "@/constants/categories";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.EXPO_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_MODEL_FALLBACKS = (
  process.env.EXPO_PUBLIC_GEMINI_MODELS ||
  [
    GEMINI_MODEL,
    "gemini-2.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
  ].join(",")
)
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean)
  .filter((model, index, models) => models.indexOf(model) === index);

let hasLoggedMissingConfig = false;

if (!GEMINI_API_KEY && !hasLoggedMissingConfig) {
  hasLoggedMissingConfig = true;
  console.warn(
    "AI Categorization: Gemini API not configured. Set EXPO_PUBLIC_GEMINI_API_KEY in .env.",
  );
}

const FETCH_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number },
): Promise<Response> {
  const timeout = options.timeout ?? FETCH_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: options.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

type GeminiTextPart = { text?: string };

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: GeminiTextPart[];
    };
  }[];
};

type GeminiApiErrorPayload = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: {
      "@type"?: string;
      retryDelay?: string;
    }[];
  };
};

class GeminiRequestError extends Error {
  status: number;
  retryDelayMs?: number;
  model: string;

  constructor(message: string, status: number, model: string, retryDelayMs?: number) {
    super(message);
    this.name = "GeminiRequestError";
    this.status = status;
    this.model = model;
    this.retryDelayMs = retryDelayMs;
  }
}

function extractTextFromGeminiResponse(data: GeminiResponse): string {
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (typeof part.text === "string" && part.text.trim()) {
      return part.text.trim();
    }
  }
  return "";
}

function parseJsonFromModelResponse(text: string): Record<string, string> {
  const normalized = text.trim();
  const fencedMatch = normalized.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonText = fencedMatch?.[1]?.trim() || normalized;
  const attempts = [
    jsonText,
    jsonText.replace(/,\s*([}\]])/g, "$1"), // remove trailing commas
    jsonText.replace(/([{,]\s*)'([^']+?)'\s*:/g, '$1"$2":').replace(/:\s*'([^']*?)'/g, ': "$1"'),
  ];

  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        continue;
      }
      return Object.entries(parsed).reduce<Record<string, string>>((acc, [key, value]) => {
        if (typeof value === "string" && value.trim()) {
          acc[key] = value.trim();
        }
        return acc;
      }, {});
    } catch {
      // Try the next parse strategy.
    }
  }

  // Fallback: tolerate loose "index: category" lines.
  const loose: Record<string, string> = {};
  const lineMatches = jsonText.matchAll(/["']?(\d+)["']?\s*:\s*["']?([^,"\n\r}]+)["']?/g);
  for (const match of lineMatches) {
    const index = match[1];
    const value = match[2]?.trim();
    if (value) {
      loose[index] = value;
    }
  }
  return loose;
}

function getGeminiEndpoint(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

function parseRetryDelayMs(errText: string): number | undefined {
  try {
    const payload = JSON.parse(errText) as GeminiApiErrorPayload;
    const retryDelay = payload.error?.details?.find(
      (detail) => detail?.["@type"] === "type.googleapis.com/google.rpc.RetryInfo",
    )?.retryDelay;

    if (!retryDelay) {
      return undefined;
    }

    const seconds = Number.parseFloat(retryDelay.replace(/s$/i, ""));
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return undefined;
    }

    return Math.ceil(seconds * 1000);
  } catch {
    return undefined;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestGeminiContent(
  model: string,
  body: Record<string, unknown>,
): Promise<string> {
  const res = await fetchWithTimeout(
    `${getGeminiEndpoint(model)}?key=${encodeURIComponent(GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new GeminiRequestError(
      `Gemini API error for ${model}: ${res.status} ${errText}`,
      res.status,
      model,
      parseRetryDelayMs(errText),
    );
  }

  const data = (await res.json()) as GeminiResponse;
  return extractTextFromGeminiResponse(data);
}

async function generateContent(prompt: string, jsonMode = false): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "";
  }

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 256,
      ...(jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };

  let lastError: unknown;

  for (const model of GEMINI_MODEL_FALLBACKS) {
    try {
      return await requestGeminiContent(model, body);
    } catch (error) {
      lastError = error;

      if (!(error instanceof GeminiRequestError)) {
        break;
      }

      const retryDelayMs = error.retryDelayMs;
      const canRetrySameModel =
        error.status === 429 &&
        typeof retryDelayMs === "number" &&
        retryDelayMs > 0 &&
        retryDelayMs <= 15_000;

      if (canRetrySameModel) {
        await sleep(retryDelayMs);

        try {
          return await requestGeminiContent(model, body);
        } catch (retryError) {
          lastError = retryError;

          if (!(retryError instanceof GeminiRequestError)) {
            break;
          }
        }
      }

      const canTryNextModel =
        error.status === 429 ||
        error.status === 404 ||
        error.status === 400 ||
        error.status === 503;

      if (canTryNextModel) {
        continue;
      }

      break;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini API request failed for all configured models.");
}

export async function suggestCategory(
  name: string,
  url: string,
): Promise<string> {
  if (!name.trim() && !url.trim()) {
    return "";
  }

  if (!GEMINI_API_KEY) {
    return "";
  }

  try {
    const existingCategories = CREDENTIAL_CATEGORIES.map((c) => c.id).join(
      ", ",
    );

    const prompt = `
      You are a password manager assistant. Categorize this credential based on its website name and URL.

      Website Name: ${name}
      URL: ${url}

      Existing Categories: [${existingCategories}]

      Instructions:
      1. Check if any of the Existing Categories are a strong fit. If so, return ONLY the category ID from that list.
      2. If none of the existing categories fit well, suggest a new, concise category name (1-2 words, e.g., "Finance", "Shopping", "Social", "Health").
      3. Return ONLY the resulting category name/ID as a plain string. No explanations, no punctuation.
    `;

    return await generateContent(prompt);
  } catch (error) {
    console.error("AI Categorization Error:", error);
    return "";
  }
}

export async function suggestCategoriesBulk(
  items: { id: string; name: string; url: string }[],
): Promise<Record<string, string>> {
  if (items.length === 0) return {};

  if (!GEMINI_API_KEY) {
    return {};
  }

  try {
    const existingCategories = CREDENTIAL_CATEGORIES.map((c) => c.id).join(
      ", ",
    );
    const itemsList = items
      .map((item, index) => `${index}: ${item.name} (${item.url})`)
      .join("\n");

    const prompt = `
      You are a password manager assistant. Categorize the following list of credentials.

      Existing Categories: [${existingCategories}]

      List:
      ${itemsList}

      Instructions:
      1. For each item, check if an Existing Category is a strong fit. If so, use that ID.
      2. If no existing category fits, suggest a new concise category name (1-2 words).
      3. Return the result as a JSON object where keys are the indices (0, 1, 2...) and values are the suggested categories.
    `;

    const responseText = await generateContent(prompt, true);
    const suggestions = parseJsonFromModelResponse(responseText);

    const resultMap: Record<string, string> = {};
    items.forEach((item, index) => {
      const suggestion = suggestions[String(index)];
      if (suggestion) {
        resultMap[item.id] = suggestion;
      }
    });

    return resultMap;
  } catch (error) {
    console.error("AI Bulk Categorization Error:", error);
    return {};
  }
}
