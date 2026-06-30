

/**
 * Jira Task Sync Script
 *
 * Bulk-creates completed SecureVault roadmap tasks as Jira issues
 * in the KAN project under the Tasks component, marks them Done,
 * and cleans up individual task files.
 *
 * Usage:
 *   node scripts/jira-sync-tasks.js
 */

// ── Completed tasks from roadmap phase files (first 50) ─────────────────────
const TASKS = [
  {
    id: "TASK-001",
    phase: "0.1",
    summary: "Confirm product scope for v1 — offline-only",
    priority: "High",
    description:
      "h3. Description\nConfirm product scope for v1. Decision: offline-only for v1.\n\nh3. Phase\nPhase 0 — Foundation\n\nh3. Status\nDone",
  },
  {
    id: "TASK-002",
    phase: "0.2",
    summary: "Choose styling approach — StyleSheet + securevault-theme.ts",
    priority: "High",
    description:
      "h3. Description\nChoose styling approach. Decision: StyleSheet + securevault-theme.ts\n\nh3. Phase\nPhase 0 — Foundation\n\nh3. Status\nDone",
  },
  {
    id: "TASK-003",
    phase: "0.3",
    summary: "Choose icon library — lucide-react-native",
    priority: "High",
    description:
      "h3. Description\nChoose icon library. Decision: lucide-react-native\n\nh3. Phase\nPhase 0 — Foundation\n\nh3. Status\nDone",
  },
  {
    id: "TASK-004",
    phase: "0.4",
    summary: "Use screenshots folder as the read-only design reference",
    priority: "Medium",
    description:
      "h3. Description\nUse the screenshots/ folder as the read-only design reference.\n\nh3. Phase\nPhase 0 — Foundation\n\nh3. Status\nDone",
  },
  {
    id: "TASK-005",
    phase: "0.5",
    summary: "Document v1 feature list (must-have vs nice-to-have)",
    priority: "Medium",
    description:
      "h3. Description\nDocument v1 feature list, separating must-have vs nice-to-have.\n\nh3. Phase\nPhase 0 — Foundation\n\nh3. Status\nDone",
  },
  {
    id: "TASK-006",
    phase: "0.6",
    summary: "Set up branch strategy / issue labels if using GitHub",
    priority: "Medium",
    description:
      "h3. Description\nSet up branch strategy and issue labels for GitHub.\n\nh3. Phase\nPhase 0 — Foundation\n\nh3. Status\nDone",
  },
  {
    id: "TASK-007",
    phase: "0.M1",
    summary: "Onboarding (first launch) — UI + persist flag",
    priority: "High",
    description:
      "h3. Description\nImplement onboarding flow for first launch with UI and persist completion flag.\n\nh3. Phase\nPhase 0 — Foundation (Must-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-008",
    phase: "0.M2",
    summary: "Dashboard with category summary — mock data",
    priority: "High",
    description:
      "h3. Description\nBuild Dashboard screen with category summary using mock data.\n\nh3. Phase\nPhase 0 — Foundation (Must-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-009",
    phase: "0.M3",
    summary: "Vault list + search + category filters — mock data",
    priority: "High",
    description:
      "h3. Description\nBuild Vault list with search and category filters using mock data.\n\nh3. Phase\nPhase 0 — Foundation (Must-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-010",
    phase: "0.M4",
    summary: "Add / edit / delete credential",
    priority: "High",
    description:
      "h3. Description\nImplement add, edit, and delete credential functionality.\n\nh3. Phase\nPhase 0 — Foundation (Must-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-011",
    phase: "0.M5",
    summary: "Password generator + save to vault",
    priority: "High",
    description:
      "h3. Description\nImplement password generator tab with save-to-vault functionality.\n\nh3. Phase\nPhase 0 — Foundation (Must-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-012",
    phase: "0.M6",
    summary: "Basic health score (weak + reused passwords)",
    priority: "High",
    description:
      "h3. Description\nImplement basic health score detecting weak and reused passwords.\n\nh3. Phase\nPhase 0 — Foundation (Must-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-013",
    phase: "0.M7",
    summary:
      "Local encrypted storage (AES-GCM + PBKDF2, AsyncStorage + SecureStore)",
    priority: "High",
    description:
      "h3. Description\nImplement local encrypted storage using AES-GCM + PBKDF2 with AsyncStorage and SecureStore.\n\nh3. Phase\nPhase 0 — Foundation (Must-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-014",
    phase: "0.M8",
    summary: "Master password (setup + unlock screens; biometrics deferred)",
    priority: "High",
    description:
      "h3. Description\nImplement master password setup and unlock screens. Biometrics deferred.\n\nh3. Phase\nPhase 0 — Foundation (Must-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-015",
    phase: "0.W1",
    summary: "Website field on credential + optional URL for domain",
    priority: "Medium",
    description:
      "h3. Description\nAdd website field on credential with optional URL for domain.\n\nh3. Phase\nPhase 0 — Foundation (Website branding v1.1)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-016",
    phase: "0.W2",
    summary: "Favicon/logo in avatar via Google favicon API",
    priority: "Medium",
    description:
      "h3. Description\nImplement favicon/logo in avatar via Google favicon API.\n\nh3. Phase\nPhase 0 — Foundation (Website branding v1.1)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-017",
    phase: "0.W3",
    summary: "Quick-pick chips for popular sites on entry form",
    priority: "Medium",
    description:
      "h3. Description\nAdd quick-pick chips for popular sites on entry form.\n\nh3. Phase\nPhase 0 — Foundation (Website branding v1.1)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-018",
    phase: "0.W4",
    summary: "Live vault preview before save on entry screen",
    priority: "Medium",
    description:
      "h3. Description\nImplement live vault preview before save on entry screen.\n\nh3. Phase\nPhase 0 — Foundation (Website branding v1.1)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-019",
    phase: "0.W5",
    summary: "Vault / Home / Health lists use CredentialListItem",
    priority: "Medium",
    description:
      "h3. Description\nEnsure Vault, Home, and Health lists use CredentialListItem component.\n\nh3. Phase\nPhase 0 — Foundation (Website branding v1.1)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-020",
    phase: "0.W6",
    summary: "Migrate older vault entries (title → website on unlock)",
    priority: "Medium",
    description:
      "h3. Description\nMigrate older vault entries from title to website field on unlock.\n\nh3. Phase\nPhase 0 — Foundation (Website branding v1.1)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-021",
    phase: "0.W7",
    summary: "Cache logos offline for faster load",
    priority: "Low",
    description:
      "h3. Description\nCache logos offline for faster load times.\n\nh3. Phase\nPhase 0 — Foundation (Website branding v1.1)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-022",
    phase: "0.W8",
    summary: "Custom logo upload per credential",
    priority: "Low",
    description:
      "h3. Description\nImplement custom logo upload per credential.\n\nh3. Phase\nPhase 0 — Foundation (Website branding v1.1)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-023",
    phase: "0.N1",
    summary: "Breach monitoring (Have I Been Pwned API)",
    priority: "Low",
    description:
      "h3. Description\nImplement breach monitoring via Have I Been Pwned k-anonymity API.\n\nh3. Phase\nPhase 0 — Foundation (Nice-to-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-024",
    phase: "0.N2",
    summary: "Import / export vault",
    priority: "Low",
    description:
      "h3. Description\nImplement vault import and export functionality.\n\nh3. Phase\nPhase 0 — Foundation (Nice-to-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-025",
    phase: "0.N3",
    summary: "Cloud sync",
    priority: "Low",
    description:
      "h3. Description\nImplement cloud sync for vault data.\n\nh3. Phase\nPhase 0 — Foundation (Nice-to-have)\n\nh3. Status\nDone",
  },
  {
    id: "TASK-026",
    phase: "1.1",
    summary: "Add theme constants with light + dark palettes",
    priority: "High",
    description:
      "h3. Description\nAdd constants/securevault-theme.ts with light and dark palettes.\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-027",
    phase: "1.2",
    summary: "Load app fonts via expo-font (system sans + Playfair Display)",
    priority: "High",
    description:
      "h3. Description\nLoad app fonts via expo-font: system sans + Playfair Display.\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-028",
    phase: "1.3",
    summary: "Update root app layout (theme provider, fonts, splash)",
    priority: "High",
    description:
      "h3. Description\nUpdate root app/_layout.tsx with theme provider, fonts, and splash screen.\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-029",
    phase: "1.4",
    summary: "Create route groups: (auth), (tabs) + entry/[id]",
    priority: "High",
    description:
      "h3. Description\nCreate route groups: (auth), (tabs), and entry/[id].\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-030",
    phase: "1.5",
    summary: "Implement auth gate (onboarding flag in expo-secure-store)",
    priority: "High",
    description:
      "h3. Description\nImplement auth gate using onboarding flag stored in expo-secure-store.\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-031",
    phase: "1.6",
    summary: "Build custom pill tab bar",
    priority: "High",
    description:
      "h3. Description\nBuild custom pill tab bar component for navigation.\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-032",
    phase: "1.7",
    summary: "Wire tab routes: Home, Vault, Generator, Health, Settings",
    priority: "High",
    description:
      "h3. Description\nWire tab routes for Home, Vault, Generator, Health, and Settings screens.\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-033",
    phase: "1.8",
    summary:
      "Create shared UI primitives: Button, Card, Input, Badge, Progress, Screen",
    priority: "High",
    description:
      "h3. Description\nCreate shared UI primitives: Button, Card, Input, Badge, Progress, Screen.\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-034",
    phase: "1.9",
    summary: "Remove default Expo Explore tab",
    priority: "Medium",
    description:
      "h3. Description\nRemove the default Expo starter Explore tab.\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-035",
    phase: "1.10",
    summary: "Configure status bar / safe areas",
    priority: "Medium",
    description:
      "h3. Description\nConfigure status bar and safe area handling.\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-036",
    phase: "1.11",
    summary: "SecureVaultThemeProvider — all screens use useSecureVaultTheme()",
    priority: "High",
    description:
      "h3. Description\nImplement SecureVaultThemeProvider so all screens use useSecureVaultTheme().\n\nh3. Phase\nPhase 1 — Design system & app shell\n\nh3. Status\nDone",
  },
  {
    id: "TASK-037",
    phase: "2.1a",
    summary: "Onboarding: Hero illustration / image area",
    priority: "Medium",
    description:
      "h3. Description\nAdd hero illustration and image area to onboarding screen.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.1 Onboarding\n\nh3. Status\nDone",
  },
  {
    id: "TASK-038",
    phase: "2.1b",
    summary: "Onboarding: Title, subtitle, step indicator dots",
    priority: "Medium",
    description:
      "h3. Description\nAdd title, subtitle, and step indicator dots to onboarding.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.1 Onboarding\n\nh3. Status\nDone",
  },
  {
    id: "TASK-039",
    phase: "2.1c",
    summary: 'Onboarding: Primary CTA ("Get started" / multi-step)',
    priority: "Medium",
    description:
      "h3. Description\nAdd primary CTA button to onboarding (Get started / multi-step).\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.1 Onboarding\n\nh3. Status\nDone",
  },
  {
    id: "TASK-040",
    phase: "2.1d",
    summary: 'Onboarding: Persist "onboarding complete" on CTA',
    priority: "Medium",
    description:
      "h3. Description\nPersist onboarding completion state when CTA is tapped.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.1 Onboarding\n\nh3. Status\nDone",
  },
  {
    id: "TASK-041",
    phase: "2.2a",
    summary: "Dashboard: Header with greeting / user area",
    priority: "Medium",
    description:
      "h3. Description\nAdd header with greeting and user area to Dashboard.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.2 Dashboard\n\nh3. Status\nDone",
  },
  {
    id: "TASK-042",
    phase: "2.2b",
    summary: "Dashboard: Category stat cards (6 categories, theme-aware tints)",
    priority: "Medium",
    description:
      "h3. Description\nAdd 6 category stat cards with theme-aware tints to Dashboard.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.2 Dashboard\n\nh3. Status\nDone",
  },
  {
    id: "TASK-043",
    phase: "2.2c",
    summary: 'Dashboard: "Manage password" + Recently Used sections',
    priority: "Medium",
    description:
      "h3. Description\nAdd Manage password and Recently Used sections to Dashboard.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.2 Dashboard\n\nh3. Status\nDone",
  },
  {
    id: "TASK-044",
    phase: "2.2d",
    summary: "Dashboard: Floating pill tab bar integrated with tabs layout",
    priority: "Medium",
    description:
      "h3. Description\nIntegrate floating pill tab bar with tabs layout on Dashboard.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.2 Dashboard\n\nh3. Status\nDone",
  },
  {
    id: "TASK-045",
    phase: "2.3a",
    summary: 'Vault: "My Vault" header + shield branding',
    priority: "Medium",
    description:
      "h3. Description\nAdd My Vault header with shield branding to Vault screen.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.3 Vault\n\nh3. Status\nDone",
  },
  {
    id: "TASK-046",
    phase: "2.3b",
    summary: "Vault: Search input (UI only)",
    priority: "Medium",
    description:
      "h3. Description\nAdd search input UI to Vault screen.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.3 Vault\n\nh3. Status\nDone",
  },
  {
    id: "TASK-047",
    phase: "2.3c",
    summary: "Vault: Category chips: All, Social, Mail, Design, Finance",
    priority: "Medium",
    description:
      "h3. Description\nAdd category chips (All, Social, Mail, Design, Finance) to Vault screen.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.3 Vault\n\nh3. Status\nDone",
  },
  {
    id: "TASK-048",
    phase: "2.3d",
    summary: "Vault: Credential list rows (title, username, category, icon)",
    priority: "Medium",
    description:
      "h3. Description\nAdd credential list rows with title, username, category, and icon.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.3 Vault\n\nh3. Status\nDone",
  },
  {
    id: "TASK-049",
    phase: "2.3e",
    summary: "Vault: Security alerts section (compromised, reused)",
    priority: "Medium",
    description:
      "h3. Description\nAdd security alerts section for compromised and reused passwords.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.3 Vault\n\nh3. Status\nDone",
  },
  {
    id: "TASK-050",
    phase: "2.3f",
    summary: 'Vault: "Import vault" entry point (UI stub)',
    priority: "Low",
    description:
      "h3. Description\nAdd Import vault entry point as UI stub on Vault screen.\n\nh3. Phase\nPhase 2 — UI screens (mock data) / 2.3 Vault\n\nh3. Status\nDone",
  },
];

// ── Config ────────────────────────────────────────────────────────────────────
const JIRA_PROJECT_KEY = "KAN";
const ISSUE_TYPE_NAME = "Task";
const COMPONENT_NAME = "Tasks";
const TASK_DIR = "docs/task";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCredentials() {
  const fs = require("fs");
  const path = require("path");
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

async function ensureProjectExists() {
  console.log(`\n🔍 Checking if project "${JIRA_PROJECT_KEY}" exists...`);
  try {
    const project = await jiraRequest(
      `/rest/api/3/project/${JIRA_PROJECT_KEY}`,
    );
    console.log(`   ✅ Project found: "${project.name}" (${project.key})`);
    return project;
  } catch {
    const creds = getCredentials();
    console.log(`   ❌ Project "${JIRA_PROJECT_KEY}" not found.`);
    console.log(
      `\n   ⚠️  Create it manually at:\n      ${creds.jiraUrl}/secure/project/SelectProjectThemeDefault.jspa`,
    );
    console.log(`   Then re-run this script.\n`);
    process.exit(1);
  }
}

async function getIssueType(project) {
  const issueTypes = await jiraRequest(
    `/rest/api/3/issuetype/project?projectId=${project.id}`,
  );
  const taskType = issueTypes.find(
    (t) => t.name.toLowerCase() === ISSUE_TYPE_NAME.toLowerCase(),
  );
  if (!taskType) {
    throw new Error(
      `No "${ISSUE_TYPE_NAME}" issue type found in project ${JIRA_PROJECT_KEY}`,
    );
  }
  console.log(`   Using issue type: "${taskType.name}" (id: ${taskType.id})`);
  return taskType;
}

async function ensureComponentExists(project) {
  console.log(`   Ensuring component "${COMPONENT_NAME}" exists...`);
  const components = await jiraRequest(
    `/rest/api/3/project/${JIRA_PROJECT_KEY}/components`,
  );
  let component = components.find((c) => c.name === COMPONENT_NAME);
  if (!component) {
    console.log(`   Creating component "${COMPONENT_NAME}"...`);
    component = await jiraRequest("/rest/api/3/component", {
      method: "POST",
      body: JSON.stringify({
        name: COMPONENT_NAME,
        project: JIRA_PROJECT_KEY,
        description: "Completed roadmap tasks migrated from local tracking",
      }),
    });
    console.log(
      `   ✅ Component created: "${component.name}" (id: ${component.id})`,
    );
  } else {
    console.log(
      `   ✅ Component found: "${component.name}" (id: ${component.id})`,
    );
  }
  return component;
}

function toAdf(text) {
  const lines = text.split("\n").filter((l) => l.trim());
  const adjustedContent = lines.map((line) => {
    if (line.startsWith("h3. ")) {
      return {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: line.replace("h3. ", ""),
            marks: [{ type: "strong" }],
          },
        ],
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

function mapPriority(priority) {
  const map = { High: "High", Medium: "Medium", Low: "Low" };
  return map[priority] || "Medium";
}

async function getTransitionId(issueKey, targetStatus) {
  const transitions = await jiraRequest(
    `/rest/api/3/issue/${issueKey}/transitions`,
  );
  const transition = transitions.transitions.find(
    (t) => t.to.name.toLowerCase() === targetStatus.toLowerCase(),
  );
  return transition ? transition.id : null;
}

async function createTaskFile(task) {
  const fs = require("fs");
  const path = require("path");
  const dir = path.join(process.cwd(), TASK_DIR);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, `${task.id}.md`);
  const content = `# ${task.id} — ${task.summary}

**Phase:** ${task.phase}
**Priority:** ${task.priority}
**Status:** Done

## Description
${task.description.replace(/h3\. /g, "**").replace(/\n/g, "\n")}

## Acceptance Criteria
- [x] Task completed and verified

## Migration
- Migrated to Jira: Yes
- Component: ${COMPONENT_NAME}
`;
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`   📄 Created ${filePath}`);
  return filePath;
}

async function deleteTaskFile(taskId) {
  const fs = require("fs");
  const path = require("path");
  const filePath = path.join(process.cwd(), TASK_DIR, `${taskId}.md`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`   🗑️  Deleted ${filePath}`);
    return true;
  }
  return false;
}

async function createIssue(task, issueTypeId, componentId) {
  const creds = getCredentials();
  const priorityName = mapPriority(task.priority);
  const body = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      issuetype: { id: issueTypeId },
      summary: `[${task.id}] ${task.summary}`,
      description: toAdf(task.description),
      priority: { name: priorityName },
      labels: [
        "securevault",
        "task",
        task.id.toLowerCase(),
        `phase-${task.phase.replace(/\./g, "-")}`,
      ],
      components: [{ id: componentId }],
    },
  };
  console.log(`   Creating ${task.id}: "${task.summary}"...`);
  const result = await jiraRequest("/rest/api/3/issue", {
    method: "POST",
    body: JSON.stringify(body),
  });
  console.log(`   ✅ Created: ${creds.jiraUrl}/browse/${result.key}`);
  return result;
}

async function transitionToDone(issueKey) {
  const doneTransitionId = await getTransitionId(issueKey, "Done");
  if (!doneTransitionId) {
    console.log(
      `   ⚠️  No "Done" transition found for ${issueKey} — trying "Closed"...`,
    );
    const closedTransitionId = await getTransitionId(issueKey, "Closed");
    if (!closedTransitionId) {
      console.log(
        `   ⚠️  No "Closed" transition found either. Skipping status update.`,
      );
      return false;
    }
    await jiraRequest(`/rest/api/3/issue/${issueKey}/transitions`, {
      method: "POST",
      body: JSON.stringify({ transition: { id: closedTransitionId } }),
    });
    console.log(`   ✅ ${issueKey} transitioned to Closed`);
    return true;
  }
  await jiraRequest(`/rest/api/3/issue/${issueKey}/transitions`, {
    method: "POST",
    body: JSON.stringify({ transition: { id: doneTransitionId } }),
  });
  console.log(`   ✅ ${issueKey} transitioned to Done`);
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("   SecureVault -> Jira Task Sync");
  console.log("═══════════════════════════════════════════════════════");

  const credentials = getCredentials();
  console.log(`   Jira: ${credentials.jiraUrl}`);
  console.log(`   User: ${credentials.email}`);
  console.log(`   Project: ${JIRA_PROJECT_KEY}`);
  console.log(`   Tasks to migrate: ${TASKS.length}`);
  console.log("───────────────────────────────────────────────────────");

  // Step 1: Verify project exists
  const project = await ensureProjectExists();

  // Step 2: Get issue type
  const issueType = await getIssueType(project);

  // Step 3: Ensure Tasks component exists
  const component = await ensureComponentExists(project);
  console.log("───────────────────────────────────────────────────────");

  // Step 4: Create issues, transition to Done, create local files, then delete
  const results = [];
  for (const task of TASKS) {
    try {
      // Create local task file first
      const filePath = await createTaskFile(task);

      // Create Jira issue
      const issue = await createIssue(task, issueType.id, component.id);

      // Transition to Done
      await transitionToDone(issue.key);

      // Delete local file after successful migration
      await deleteTaskFile(task.id);

      results.push({
        task: task.id,
        key: issue.key,
        url: `${credentials.jiraUrl}/browse/${issue.key}`,
        fileDeleted: true,
      });
    } catch (err) {
      console.error(`   ❌ FAILED to migrate ${task.id}: ${err.message}`);
      results.push({
        task: task.id,
        key: null,
        error: err.message,
        fileDeleted: false,
      });
    }
  }

  // Step 5: Summary
  console.log("───────────────────────────────────────────────────────");
  console.log("   MIGRATION SUMMARY");
  console.log("───────────────────────────────────────────────────────");
  const succeeded = results.filter((r) => r.key);
  const failed = results.filter((r) => !r.key);
  console.log(`   Migrated: ${succeeded.length}/${TASKS.length}`);
  if (failed.length > 0) {
    console.log(`   Failed: ${failed.length}/${TASKS.length}`);
    failed.forEach((f) => console.log(`      - ${f.task}: ${f.error}`));
  }
  console.log("");
  console.log("   Successfully Migrated:");
  succeeded.forEach((r) =>
    console.log(`      ${r.key} - ${r.url} (file deleted: ${r.fileDeleted})`),
  );
  console.log("");
  if (failed.length > 0) {
    console.log("   Failed Tasks (files NOT deleted — retry needed):");
    failed.forEach((f) => console.log(`      - ${f.task}`));
  }
  console.log("───────────────────────────────────────────────────────");
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
