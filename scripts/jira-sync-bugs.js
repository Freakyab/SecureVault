/**
 * Jira Bug Sync Script
 *
 * Bulk-creates all active SecureVault bugs as Jira issues
 * in the SECUREVLT project.
 *
 * Usage:
 *   node scripts/jira-sync-bugs.js
 */

// ── Active bugs from Mds/BUGS.md (status: open) ──────────────────────────────
const BUGS = [
  {
    id: 'BUG-022',
    summary: 'Export backup is plaintext and uses the non-clearing clipboard',
    priority: 'High',
    description: `h3. Description\nExport backup writes credentials in plaintext and does not clear the clipboard, leaving sensitive data exposed.\n\nh3. Steps to reproduce\n1. Open the vault\n2. Go to Settings → Export Backup\n3. Export the backup\n4. Check the clipboard content\n\nh3. Expected\nBackup should be encrypted and clipboard auto-cleared.\n\nh3. Actual\nBackup is in plaintext and clipboard persists indefinitely.\n\nh3. Priority\nP1 — High`,
  },
  {
    id: 'BUG-024',
    summary: '"Quick Fix All" button in Password Health is a no-op',
    priority: 'High',
    description: `h3. Description\nThe "Quick Fix All" button in Password Health does nothing when tapped.\n\nh3. Steps to reproduce\n1. Open Password Health\n2. Tap "Quick Fix All"\n3. Nothing happens\n\nh3. Expected\nButton should trigger a bulk fix action.\n\nh3. Actual\nButton is a no-op — no action is dispatched.\n\nh3. Priority\nP1 — High`,
  },
  {
    id: 'BUG-027',
    summary: "Generated passwords don't guarantee selected character types",
    priority: 'Medium',
    description: `h3. Description\nGenerated passwords may not include all selected character types (uppercase, lowercase, digits, symbols).\n\nh3. Steps to reproduce\n1. Open Generator tab\n2. Select all character types\n3. Generate a password\n4. Inspect the result\n\nh3. Expected\nPassword should contain at least one character from each selected type.\n\nh3. Actual\nSome selected types may be missing.\n\nh3. Priority\nP2 — Medium`,
  },
  {
    id: 'BUG-028',
    summary: 'Auto-lock "Immediately" fires during legit OS prompts',
    priority: 'Medium',
    description: `h3. Description\nWith auto-lock set to "Immediately", the vault locks during legitimate OS prompts (biometric dialogs, permission requests).\n\nh3. Steps to reproduce\n1. Set auto-lock to "Immediately"\n2. Trigger an OS prompt\n3. Vault locks during the prompt\n\nh3. Expected\nAuto-lock should not fire during active OS prompts.\n\nh3. Actual\nVault locks immediately even during legitimate OS interactions.\n\nh3. Priority\nP2 — Medium`,
  },
  {
    id: 'BUG-029',
    summary: 'Credential writes use stale closures / no serialization (race)',
    priority: 'Medium',
    description: 'h3. Description\nConcurrent credential writes use stale closures due to lack of serialization, causing race conditions and data loss.\n\nh3. Steps to reproduce\n1. Rapidly save multiple credentials\n2. Some writes may be lost\n\nh3. Expected\nWrites should be serialized with fresh state.\n\nh3. Actual\nRace conditions occur from stale closures in async writes.\n\nh3. Priority\nP2 — Medium',
  },
  {
    id: 'BUG-030',
    summary: 'Generator password copy does not auto-clear the clipboard',
    priority: 'Medium',
    description: 'h3. Description\nCopying a generated password does not auto-clear the clipboard, leaving the password exposed.\n\nh3. Steps to reproduce\n1. Generate a password\n2. Tap "Copy"\n3. Check clipboard after 30 seconds\n\nh3. Expected\nClipboard should be auto-cleared after a timeout.\n\nh3. Actual\nPassword remains on the clipboard indefinitely.\n\nh3. Priority\nP2 — Medium',
  },
  {
    id: 'BUG-031',
    summary: 'Backup import/export drops customLogoUri',
    priority: 'Low',
    description: 'h3. Description\nWhen exporting and re-importing a backup, the customLogoUri field is lost.\n\nh3. Steps to reproduce\n1. Add a credential with a custom logo\n2. Export backup\n3. Import backup\n4. Check the credential logo\n\nh3. Expected\ncustomLogoUri should be preserved.\n\nh3. Actual\ncustomLogoUri is dropped during the round-trip.\n\nh3. Priority\nP3 — Low',
  },
  {
    id: 'BUG-032',
    summary: 'Breach result wording mixes accounts vs passwords',
    priority: 'Low',
    description: 'h3. Description\nBreach check results confusingly mix "accounts" and "passwords" terminology.\n\nh3. Steps to reproduce\n1. Run a breach check\n2. Read the result message\n\nh3. Expected\nClear distinction between breached accounts and exposed passwords.\n\nh3. Actual\nWording is ambiguous.\n\nh3. Priority\nP3 — Low',
  },
  {
    id: 'BUG-033',
    summary: 'Health stat cards can sum to more than total (weak/reused overlap)',
    priority: 'Low',
    description: 'h3. Description\nPassword Health stat cards can sum to more than the total due to category overlap.\n\nh3. Steps to reproduce\n1. Open Password Health with overlapping credentials\n2. Sum the stat card values\n3. Compare to total\n\nh3. Expected\nCards should account for overlap or display as "X of Y".\n\nh3. Actual\nCards sum to more than the total.\n\nh3. Priority\nP3 — Low',
  },
  {
    id: 'BUG-034',
    summary: 'autoLockLabel has an unreachable "Never" branch',
    priority: 'Low',
    description: 'h3. Description\nautoLockLabel function contains a "Never" branch that is unreachable.\n\nh3. Steps to reproduce\n1. Review auto-lock label rendering code\n2. Trace the "Never" branch\n\nh3. Expected\nDead code should be removed or a "Never" option should exist.\n\nh3. Actual\nThe "Never" branch can never be reached.\n\nh3. Priority\nP3 — Low',
  },
  {
    id: 'BUG-035',
    summary: 'Onboarding completion not persisted on web',
    priority: 'Low',
    description: 'h3. Description\nOn web, completing onboarding does not persist the completion state.\n\nh3. Steps to reproduce\n1. Open app on web\n2. Complete onboarding\n3. Refresh the page\n4. Onboarding shows again\n\nh3. Expected\nOnboarding completion should persist across sessions.\n\nh3. Actual\nOn web, state is lost on refresh.\n\nh3. Priority\nP3 — Low',
  },
  {
    id: 'BUG-036',
    summary: 'useNavigationLock lacks try/finally around the action',
    priority: 'Low',
    description: 'h3. Description\nuseNavigationLock hook does not wrap the locked action in try/finally.\n\nh3. Steps to reproduce\n1. Trigger a navigation-locked action\n2. Action throws an error\n3. Navigation remains locked\n\nh3. Expected\nLock should always be released via finally.\n\nh3. Actual\nIf the action throws, the lock persists indefinitely.\n\nh3. Priority\nP3 — Low',
  },
  {
    id: 'BUG-037',
    summary: 'Edit "back" skips the read-only credential detail view',
    priority: 'Low',
    description: 'h3. Description\nWhen pressing "back" from the edit screen, user is returned to the list instead of the read-only detail view.\n\nh3. Steps to reproduce\n1. Open a credential (read-only detail)\n2. Tap "Edit"\n3. Tap "Back"\n4. User is taken to credential list\n\nh3. Expected\n"Back" should return to the read-only credential detail view.\n\nh3. Actual\n"Back" skips the detail view.\n\nh3. Priority\nP3 — Low',
  },
];

// ── Config ────────────────────────────────────────────────────────────────────
const JIRA_PROJECT_KEY = 'KAN';
const ISSUE_TYPE_NAME = 'Bug';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCredentials() {
  const fs = require('fs');
  const path = require('path');
  const configPath = path.join(
    process.env.APPDATA,
    'Code',
    'User',
    'globalStorage',
    'saoudrizwan.claude-dev',
    'settings',
    'cline_mcp_settings.json'
  );
  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(raw);
  const server = config.mcpServers?.['github.com/pashpashpash/mcp-atlassian'];
  if (!server) throw new Error('Atlassian MCP server not found in config');
  return {
    jiraUrl: server.env.JIRA_URL,
    email: server.env.JIRA_USERNAME,
    token: server.env.JIRA_API_TOKEN,
  };
}

function basicAuth(email, token) {
  const encoded = Buffer.from(`${email}:${token}`).toString('base64');
  return `Basic ${encoded}`;
}

async function jiraRequest(url, options = {}) {
  const { jiraUrl, email, token } = getCredentials();
  const response = await fetch(`${jiraUrl}${url}`, {
    ...options,
    headers: {
      Authorization: basicAuth(email, token),
      'Content-Type': 'application/json',
      Accept: 'application/json',
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
    const project = await jiraRequest(`/rest/api/3/project/${JIRA_PROJECT_KEY}`);
    console.log(`   ✅ Project found: "${project.name}" (${project.key})`);
    return project;
  } catch {
    const creds = getCredentials();
    console.log(`   ❌ Project "${JIRA_PROJECT_KEY}" not found.`);
    console.log(`\n   ⚠️  Create it manually at:\n      ${creds.jiraUrl}/secure/project/SelectProjectThemeDefault.jspa`);
    console.log(`   Then re-run this script.\n`);
    process.exit(1);
  }
}

async function getIssueType(project) {
  const issueTypes = await jiraRequest(`/rest/api/3/issuetype/project?projectId=${project.id}`);
  const bugType = issueTypes.find(
    (t) => t.name.toLowerCase() === ISSUE_TYPE_NAME.toLowerCase()
  );
  if (!bugType) {
    throw new Error(`No "${ISSUE_TYPE_NAME}" issue type found in project ${JIRA_PROJECT_KEY}`);
  }
  console.log(`   Using issue type: "${bugType.name}" (id: ${bugType.id})`);
  return bugType;
}

function toAdf(text) {
  const lines = text.split('\n').filter((l) => l.trim());
  const adjustedContent = lines.map((line) => {
    if (line.startsWith('h3. ')) {
      return {
        type: 'paragraph',
        content: [{ type: 'text', text: line.replace('h3. ', ''), marks: [{ type: 'strong' }] }],
      };
    }
    return {
      type: 'paragraph',
      content: [{ type: 'text', text: line }],
    };
  });

  return {
    type: 'doc',
    version: 1,
    content: adjustedContent,
  };
}

function mapPriority(priority) {
  const map = { High: 'High', Medium: 'Medium', Low: 'Low' };
  return map[priority] || 'Medium';
}

async function createIssue(bug, issueTypeId) {
  const creds = getCredentials();
  const priorityName = mapPriority(bug.priority);
  const body = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      issuetype: { id: issueTypeId },
      summary: `[${bug.id}] ${bug.summary}`,
      description: toAdf(bug.description),
      priority: { name: priorityName },
      labels: ['securevault', 'bug', bug.id.toLowerCase()],
      components: [{ name: 'Bugs' }],
    },
  };
  console.log(`   Creating ${bug.id}: "${bug.summary}"...`);
  const result = await jiraRequest('/rest/api/3/issue', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  console.log(`   Created: ${creds.jiraUrl}/browse/${result.key}`);
  return result;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   SecureVault -> Jira Bug Sync');
  console.log('═══════════════════════════════════════════════════════');

  const credentials = getCredentials();
  console.log(`   Jira: ${credentials.jiraUrl}`);
  console.log(`   User: ${credentials.email}`);
  console.log(`   Project: ${JIRA_PROJECT_KEY}`);
  console.log(`   Bugs to create: ${BUGS.length}`);
  console.log('───────────────────────────────────────────────────────');

  // Step 1: Verify project exists
  const project = await ensureProjectExists();

  // Step 2: Get issue type
  const issueType = await getIssueType(project);
  console.log('───────────────────────────────────────────────────────');

  // Step 3: Create issues
  const results = [];
  for (const bug of BUGS) {
    try {
      const issue = await createIssue(bug, issueType.id);
      results.push({
        bug: bug.id,
        key: issue.key,
        url: `${credentials.jiraUrl}/browse/${issue.key}`,
      });
    } catch (err) {
      console.error(`   FAILED to create ${bug.id}: ${err.message}`);
      results.push({ bug: bug.id, key: null, error: err.message });
    }
  }

  // Step 4: Summary
  console.log('───────────────────────────────────────────────────────');
  console.log('   SUMMARY');
  console.log('───────────────────────────────────────────────────────');
  const succeeded = results.filter((r) => r.key);
  const failed = results.filter((r) => !r.key);
  console.log(`   Created: ${succeeded.length}/${BUGS.length}`);
  if (failed.length > 0) {
    console.log(`   Failed: ${failed.length}/${BUGS.length}`);
    failed.forEach((f) => console.log(`      - ${f.bug}: ${f.error}`));
  }
  console.log('');
  console.log('   Created Issues:');
  succeeded.forEach((r) => console.log(`      ${r.key} - ${r.url}`));
  console.log('');
  console.log('   Next steps:');
  console.log('   1. Update Mds/BUGS.md status from "open" to "in-progress" as you work');
  console.log('   2. Use the Jira MCP in Cline for future bug reporting');
  console.log('───────────────────────────────────────────────────────');
}

main().catch((err) => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});


