/**
 * Jira Task Title Fix Script
 *
 * Updates the Jira issue titles to match the actual task titles
 * from the docs/tasks/ files (which were already read).
 *
 * Usage:
 *   node scripts/jira-fix-titles.js
 */

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

const REAL_TITLES = {
  "TASK-001": "Onboarding same content on all 3 steps",
  "TASK-002": "Password inputs missing show/hide toggle",
  "TASK-003": "Support multiple credentials for the same account",
  "TASK-004": "Reference UI for Password Health",
  "TASK-005": "Foundation docs and project process",
  "TASK-006": "Cache site logos offline",
  "TASK-007": "Custom logo upload per credential",
  "TASK-008": "Vault metadata and last unlocked timestamp",
  "TASK-009": "Unit tests for generator and crypto",
  "TASK-010": "Password age warnings and notifications",
  "TASK-011": "Breach monitoring via HIBP",
  "TASK-012": "Import/export and encrypted backups",
  "TASK-013": "UX feedback polish",
  "TASK-014": "Accessibility and dynamic type pass",
  "TASK-015": "Security hardening pass",
  "TASK-016": "Release readiness and store assets",
  "TASK-017": "Backend and cloud sync (optional)",
  "TASK-018": "Credential sharing (optional)",
  "TASK-019": "Browser extension (optional)",
  "TASK-020": "Optional fingerprint unlock for vault access",
  "TASK-021": "Favorite and archive accounts on SecureVault page",
  "TASK-022": "Google login for account creation",
  "TASK-023": "Modify edit credential page",
  "TASK-024": "Copy passwords and show usernames on Home/Vault",
  "TASK-025": "Delete all local data and master password from storage",
  "TASK-026": "Settings page for vault and app controls",
  "TASK-027": "App lock controls and configurable auto-lock",
  "TASK-028": "AI-assisted vault folders and tags",
  "TASK-029": "Advanced vault search improvements",
  "TASK-030": "Credential password history",
  "TASK-031": "Stronger duplicate password warnings",
  "TASK-032": "Inline weak/reused/old badges on credential rows",
  "TASK-033": "Auto-lock on background / inactivity",
  "TASK-034": "Master password change flow",
  "TASK-035": "Screenshot / screen-capture protection",
  "TASK-036": "Loading and empty-state polish",
  "TASK-037": "PBKDF2-SHA256 key derivation",
  "TASK-038": "AES-GCM encrypt vault at rest",
  "TASK-039": "Encrypted blob + salt storage",
  "TASK-040": "In-memory decrypted cache while unlocked",
  "TASK-041": "Categories enum/map",
  "TASK-042": "Wire category chips to filter state",
  "TASK-043": "Generator screen + bottom nav",
  "TASK-044": "Wire password generator service to screen",
  "TASK-045": "Save generated password to vault entry",
  "TASK-046": "Vault error handling (wrong password, corrupt, storage full)",
  "TASK-047": "Read-only credential View mode (entry detail)",
  "TASK-048": "Empty states, onboarding skip & logout/lock flows",
  "TASK-049": "Security review checklist completed",
  "TASK-050": "EAS Build profiles (development, preview, production)",
};

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

async function updateJiraTitle(issueKey, taskId, realTitle) {
  const summary = `[${taskId}] ${realTitle}`;
  const body = {
    fields: {
      summary: summary,
    },
  };
  console.log(`   Updating ${issueKey} title to: "${summary}"`);
  await jiraRequest(`/rest/api/3/issue/${issueKey}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  console.log(`   ✅ ${issueKey} title updated`);
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("   Fix Jira Task Titles");
  console.log("═══════════════════════════════════════════════════════");

  const TASK_IDS = Array.from(
    { length: 50 },
    (_, i) => `TASK-${String(i + 1).padStart(3, "0")}`,
  );

  const results = [];
  for (let i = 0; i < 50; i++) {
    const taskId = TASK_IDS[i];
    const jiraKey = JIRA_KEYS[i];
    const realTitle = REAL_TITLES[taskId];

    if (!realTitle) {
      console.log(`   ⚠️  No real title for ${taskId}, skipping`);
      results.push({ taskId, jiraKey, status: "skipped" });
      continue;
    }

    try {
      await updateJiraTitle(jiraKey, taskId, realTitle);
      results.push({ taskId, jiraKey, status: "updated" });
    } catch (err) {
      console.error(`   ❌ FAILED to update ${jiraKey}: ${err.message}`);
      results.push({ taskId, jiraKey, status: "failed", error: err.message });
    }
  }

  console.log("───────────────────────────────────────────────────────");
  console.log("   SUMMARY");
  console.log("───────────────────────────────────────────────────────");
  const updated = results.filter((r) => r.status === "updated");
  const failed = results.filter((r) => r.status === "failed");
  console.log(`   Updated: ${updated.length}/${JIRA_KEYS.length}`);
  if (failed.length > 0) {
    console.log(`   Failed: ${failed.length}`);
    failed.forEach((f) => console.log(`      ${f.jiraKey}: ${f.error}`));
  }
  console.log("───────────────────────────────────────────────────────");
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
