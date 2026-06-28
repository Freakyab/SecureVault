import { CREDENTIAL_CATEGORIES } from "@/constants/categories";

// ── Vertex AI configuration ────────────────────────────────────────────────
// These are read from Expo build-time env vars set in your .env file.
// In production the service account key should be managed server-side.
const PROJECT_ID = process.env.EXPO_PUBLIC_VERTEX_PROJECT_ID || "";
const LOCATION = process.env.EXPO_PUBLIC_VERTEX_LOCATION || "us-central1";
const MODEL_ID = process.env.EXPO_PUBLIC_VERTEX_GEMMA_MODEL || "gemma3";
const SA_KEY_B64 = process.env.EXPO_PUBLIC_VERTEX_SA_KEY || "";

const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:generateContent`;

const IS_VERTEX_CONFIGURED = Boolean(PROJECT_ID && SA_KEY_B64);

if (!IS_VERTEX_CONFIGURED) {
  console.warn(
    "AI Categorization: EXPO_PUBLIC_VERTEX_PROJECT_ID and EXPO_PUBLIC_VERTEX_SA_KEY must be set in .env. " +
      "SA_KEY should be the base-64 encoded JSON of a GCP service account key with Vertex AI User role.",
  );
}

// ── Polyfills / Guards for Hermes compatibility ────────────────────────────

/**
 * Base64 decode with Hermes-compatible fallback.
 * Uses `atob` if available, otherwise implements it in pure JS.
 */
function base64Decode(str: string): string {
  if (typeof atob !== "undefined") {
    return atob(str);
  }
  // Hermes polyfill: decode base64 using Buffer or manual decoding
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  str = str.replace(/[^A-Za-z0-9+/=]/g, "");
  for (let i = 0; i < str.length; i += 4) {
    const a = chars.indexOf(str[i]);
    const b = chars.indexOf(str[i + 1]);
    const c = chars.indexOf(str[i + 2]);
    const d = chars.indexOf(str[i + 3]);
    output += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== 64) output += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d !== 64) output += String.fromCharCode(((c & 3) << 6) | d);
  }
  return output;
}

/**
 * Base64 encode with Hermes-compatible fallback.
 * Uses `btoa` if available, otherwise implements it in pure JS.
 */
function base64Encode(str: string): string {
  if (typeof btoa !== "undefined") {
    return btoa(str);
  }
  // Hermes polyfill
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";
  const bytes = new TextEncoder().encode(str);
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    output += chars[b1 >> 2];
    output += chars[((b1 & 3) << 4) | (b2 >> 4)];
    if (i + 1 < bytes.length) output += chars[((b2 & 15) << 2) | (b3 >> 6)];
    if (i + 2 < bytes.length) output += chars[b3 & 63];
  }
  const padding = 3 - (bytes.length % 3);
  if (padding !== 3) {
    for (let i = 0; i < padding; i++) output += "=";
  }
  return output;
}

/**
 * URL-safe base64 encode (no padding, URL-safe alphabet).
 */
function b64urlEncode(data: string): string {
  return base64Encode(data).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Decodes a base64url-encoded string (supports both standard and URL-safe alphabets).
 */
function b64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return base64Decode(base64);
}

// ── Fetch with timeout helper ──────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 10_000; // 10 seconds

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number },
): Promise<Response> {
  const timeout = options.timeout ?? FETCH_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal ?? controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// ── JWT helpers for service‑account auth ───────────────────────────────────

let cachedToken: { value: string; expiresAt: number } | null = null;

/**
 * Returns an OAuth2 access token for the Vertex AI service account using
 * a self-signed JWT assertion (client credentials grant without a server).
 */
async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60 s buffer)
  if (cachedToken && now < cachedToken.expiresAt - 60) {
    return cachedToken.value;
  }

  if (!IS_VERTEX_CONFIGURED) {
    throw new Error(
      "Vertex AI is not configured. Set EXPO_PUBLIC_VERTEX_PROJECT_ID and EXPO_PUBLIC_VERTEX_SA_KEY.",
    );
  }

  // Parse the service account key
  const saKey = JSON.parse(b64urlDecode(SA_KEY_B64));
  const { client_email: clientEmail, private_key: privateKey } = saKey;

  // Create JWT header & payload
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const b64 = (obj: Record<string, unknown>) =>
    b64urlEncode(JSON.stringify(obj));

  const message = `${b64(header)}.${b64(payload)}`;

  // Sign the JWT with the private key using the Web Crypto API
  const signature = await signJwt(message, privateKey);

  const jwt = `${message}.${signature}`;

  // Exchange JWT for an access token
  const tokenRes = await fetchWithTimeout("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Token exchange failed: ${tokenRes.status} ${errText}`);
  }

  const tokenData = await tokenRes.json();
  cachedToken = {
    value: tokenData.access_token,
    expiresAt: now + tokenData.expires_in,
  };

  return cachedToken.value;
}

/**
 * Signs a string with an RSA private key using Web Crypto API (subtle).
 * Supports PKCS#8 PEM-encoded keys.
 * Falls back gracefully if crypto.subtle is not available (Hermes).
 */
async function signJwt(message: string, pemKey: string): Promise<string> {
  // Check if crypto.subtle is available (not available on Hermes)
  if (
    typeof crypto === "undefined" ||
    typeof crypto.subtle === "undefined"
  ) {
    console.warn(
      "AI Categorization: Web Crypto API (crypto.subtle) is not available. " +
        "This is expected on React Native Hermes. AI categorization requires token signing.",
    );
    throw new Error("crypto.subtle not available on this platform");
  }

  // Strip PEM header/footer and decode base64
  const pemBody = pemKey
    .replace(/-----BEGIN [\w ]+-----\n?/, "")
    .replace(/-----END [\w ]+-----\n?/, "")
    .replace(/\n/g, "");

  const binaryDer = Uint8Array.from(base64Decode(pemBody), (c: string) =>
    c.charCodeAt(0),
  );

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    cryptoKey,
    new TextEncoder().encode(message),
  );

  return b64urlEncode(
    String.fromCharCode(...new Uint8Array(signature)),
  );
}

// ── Vertex AI helper ───────────────────────────────────────────────────────

/**
 * Sends a prompt to the Gemma model on Vertex AI and returns the text response.
 */
async function generateContent(
  prompt: string,
  jsonMode = false,
): Promise<string> {
  const token = await getAccessToken();

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 256,
      ...(jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };

  const res = await fetchWithTimeout(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Vertex AI API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

// ── Public API (same signatures as before) ──────────────────────────────────

/**
 * Suggests a category for a credential based on its website name and URL.
 * It first tries to match against existing canonical categories.
 * If no match is found, it suggests a new category name.
 */
export async function suggestCategory(
  name: string,
  url: string,
): Promise<string> {
  if (!name.trim() && !url.trim()) {
    return "";
  }

  if (!IS_VERTEX_CONFIGURED) {
    console.warn(
      "AI Categorization: Vertex AI not configured. Skipping suggestion.",
    );
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

    const text = await generateContent(prompt);
    return text;
  } catch (error) {
    console.error("AI Categorization Error:", error);
    return "";
  }
}

/**
 * Suggests categories for a batch of credentials.
 * Returns a map of { [id]: categoryId }.
 */
export async function suggestCategoriesBulk(
  items: { id: string; name: string; url: string }[],
): Promise<Record<string, string>> {
  if (items.length === 0) return {};

  if (!IS_VERTEX_CONFIGURED) {
    console.warn(
      "AI Categorization: Vertex AI not configured. Skipping bulk suggestion.",
    );
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
      
      Example Output:
      {
        "0": "Login",
        "1": "Finance",
        "2": "Social"
      }
    `;

    const responseText = await generateContent(prompt, true);
    const suggestions = JSON.parse(responseText);

    const resultMap: Record<string, string> = {};
    items.forEach((item, index) => {
      const suggestion = suggestions[index];
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