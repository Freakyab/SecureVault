/**
 * Jira Task Description Fix Script
 *
 * Reads the actual task files from docs/tasks/ and updates
 * the already-created Jira issues (KAN-17 to KAN-66) with
 * correct descriptions. Then deletes the migrated files.
 *
 * Usage:
 *   node scripts/jira-fix-descriptions.js
 */

// ── Config ────────────────────────────────────────────────────────────────────
const JIRA_PROJECT_KEY = "KAN";
const TASK_DIR = "docs/tasks";
const JIRA_KEYS = [
  "KAN-17",
  "KAN-18",
  "KAN-19",
  "KAN-20",
  "KAN-21",
  "KAN-22",
  "KAN-23",
  "KAN-24",
  "KAN-25",
  "KAN-26",
  "KAN-27",
  "KAN-28",
  "KAN-29",
  "KAN-30",
  "KAN-31",
  "KAN-32",
  "KAN-33",
  "KAN-34",
  "KAN-35",
  "KAN-36",
  "KAN-37",
  "KAN-38",
  "KAN-39",
  "KAN-40",
  "KAN-41",
  "KAN-42",
  "KAN-43",
  "KAN-44",
  "KAN-45",
  "KAN-46",
  "KAN-47",
  "KAN-48",
  "KAN-49",
  "KAN-50",
  "KAN-51",
  "KAN-52",
  "KAN-53",
  "KAN-54",
  "KAN-55",
  "KAN-56",
  "KAN-57",
  "KAN-58",
  "KAN-59",
  "KAN-60",
  "KAN-61",
  "KAN-62",
  "KAN-63",
  "KAN-64",
  "KAN-65",
  "KAN-66",
];

const TASK_IDS = Array.from(
  { length: 50 },
  (_, i) => `TASK-${String(i + 1).padStart(3, "0")}`,
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const fs = require("fs");
const path = require("path");

function getCredentials() {
  const configPath = path.join(
    process.env.APPDATA,
    "Code",
    "User",
    "globalStorage",
    "saoudrizwan.claude-dev",
    "settings",
    "cline_mcp_settings.json",
  );
  const raw = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(raw);
  const server = config.mcpServers?.["github.com/pashpashpash/mcp-atlassian"];
  if (!server) throw new Error("Atlassian MCP server not found in config");
  return {
    jiraUrl: server.env.JIRA_URL,
    email: server.env.JIRA_USERNAME,
    token: server.env.JIRA_API_TOKEN,
  };
}

function basicAuth(email, token) {
  const encoded = Buffer.from(`${email}:${token}`).toString("base64");
  return `Basic ${encoded}`;
}

async function jiraRequest(url, options = {}) {
  const { jiraUrl, email, token } = getCredentials();
  const response = await fetch(`${jiraUrl}${url}`, {
    ...options,
    headers: {
      Authorization: basicAuth(email, token),
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Jira API error ${response.status}: ${body}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function toAdf(text) {
  const lines = text.split("\n").filter((l) => l.trim());
  const adjustedContent = lines.map((line) => {
    if (line.startsWith("### ")) {
      return {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: line.replace("### ", ""),
            marks: [{ type: "strong" }],
          },
        ],
      };
    }
    if (line.startsWith("## ")) {
      return {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: line.replace("## ", "## "),
            marks: [{ type: "strong" }],
          },
        ],
      };
    }
    if (line.startsWith("|")) {
      return {
        type: "paragraph",
        content: [{ type: "text", text: line }],
      };
    }
    return {
      type: "paragraph",
      content: [{ type: "text", text: line }],
    };
  });

  return {
    type: "doc",
    version: 1,
    content: adjustedContent,
  };
}

function parseTaskFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  // Extract title from first line
  const titleLine = lines[0]?.replace("## ", "").trim() || "No title";
  const descStart = content.indexOf("### Description");
  const descEnd =
    content.indexOf("### Steps to reproduce") !== -1
      ? content.indexOf("### Steps to reproduce")
      : content.indexOf("### Expected") !== -1
        ? content.indexOf("### Expected")
        : content.indexOf("### Related files") !== -1
          ? content.indexOf("### Related files")
          : content.indexOf("### Suggested fix") !== -1
            ? content.indexOf("### Suggested fix")
            : content.indexOf("### Resolution") !== -1
              ? content.indexOf("### Resolution")
              : content.length;

  // Extract remaining sections for a full description
  const fullText = content
    .split("\n")
    .filter(
      (l) =>
        l.trim() &&
        !l.startsWith("## ") &&
        !l.startsWith("|") &&
        !l.startsWith("---"),
    )
    .join("\n")
    .trim();

  return { title: titleLine, fullText };
}

async function updateJiraDescription(issueKey, description) {
  const body = {
    fields: {
      description: toAdf(description),
    },
  };
  console.log(`   Updating ${issueKey} description...`);
  await jiraRequest(`/rest/api/3/issue/${issueKey}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  console.log(`   ✅ ${issueKey} description updated`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("   Fix Jira Task Descriptions");
  console.log("═══════════════════════════════════════════════════════");

  const credentials = getCredentials();
  console.log(`   Jira: ${credentials.jiraUrl}`);
  console.log(`   Reading from: ${TASK_DIR}/`);
  console.log("───────────────────────────────────────────────────────");

  const results = [];
  for (let i = 0; i < TASK_IDS.length; i++) {
    const taskId = TASK_IDS[i];
    const jiraKey = JIRA_KEYS[i];
    const filePath = path.join(process.cwd(), TASK_DIR, `${taskId}.md`);

    if (!fs.existsSync(filePath)) {
      console.log(`   ⚠️  ${taskId} file not found at ${filePath}, skipping`);
      results.push({ taskId, jiraKey, status: "skipped" });
      continue;
    }

    try {
      const { title, fullText } = parseTaskFile(filePath);
      const description = `${title}\n\n${fullText}`;

      // Update Jira issue description
      await updateJiraDescription(jiraKey, description);

      // Delete the local file after successful update
      fs.unlinkSync(filePath);
      console.log(`   🗑️  Deleted ${filePath}`);

      results.push({ taskId, jiraKey, status: "updated" });
    } catch (err) {
      console.error(
        `   ❌ FAILED to update ${taskId} / ${jiraKey}: ${err.message}`,
      );
      results.push({ taskId, jiraKey, status: "failed", error: err.message });
    }
  }

  // Summary
  console.log("───────────────────────────────────────────────────────");
  console.log("   SUMMARY");
  console.log("───────────────────────────────────────────────────────");
  const updated = results.filter((r) => r.status === "updated");
  const failed = results.filter((r) => r.status === "failed");
  const skipped = results.filter((r) => r.status === "skipped");
  console.log(`   Updated: ${updated.length}`);
  console.log(`   Failed: ${failed.length}`);
  console.log(`   Skipped: ${skipped.length}`);
  if (failed.length > 0) {
    console.log("\n   Failed:");
    failed.forEach((f) =>
      console.log(`      ${f.taskId} / ${f.jiraKey}: ${f.error}`),
    );
  }
  console.log("───────────────────────────────────────────────────────");
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
