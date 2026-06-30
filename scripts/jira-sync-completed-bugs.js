// ── Sync Completed Bugs to Jira (as Done) ──────────────────────────────────
// Run: node scripts/jira-sync-completed-bugs.js

const JIRA_PROJECT_KEY = 'KAN';
const COMPONENT_NAME = 'Bugs';
const ISSUE_TYPE_NAME = 'Bug';
const PROJECT_ROOT = require("path").resolve(__dirname, "..");
const BUGS_DIR = require('path').join(PROJECT_ROOT, 'docs', 'bug');
const BUGS_MD = require('path').join(PROJECT_ROOT, 'Mds', 'BUGS.md');

const COMPLETED_BUGS = [
  { id: 'BUG-020', summary: 'Password generator uses Math.random() instead of CSPRNG', priority: 'P0', resolved: '2026-06-14' },
  { id: 'BUG-021', summary: 'Biometric vault key not bound to biometric auth in keystore', priority: 'P0', resolved: '2026-06-14' },
  { id: 'BUG-002', summary: 'No master password after onboarding', priority: 'P0', resolved: '2026-06-13' },
  { id: 'BUG-005', summary: 'Save credential fails with error', priority: 'P0', resolved: '2026-06-13' },
  { id: 'BUG-006', summary: 'Create vault / master password fails', priority: 'P0', resolved: '2026-06-13' },
  { id: 'BUG-015', summary: 'Create Vault button does not work on setup screen', priority: 'P0', resolved: '2026-06-14' },
  { id: 'BUG-003', summary: 'No close button on Add Credential screen', priority: 'P1', resolved: '2026-06-13' },
  { id: 'BUG-007', summary: 'Home menu icon locks app with master password', priority: 'P1', resolved: '2026-06-13' },
  { id: 'BUG-010', summary: 'Multiple Edit Credential dialogs open', priority: 'P1', resolved: '2026-06-14' },
  { id: 'BUG-011', summary: 'Health score does not update after add/delete', priority: 'P1', resolved: '2026-06-14' },
  { id: 'BUG-012', summary: 'Biometric enable switch cannot be toggled', priority: 'P1', resolved: '2026-06-14' },
  { id: 'BUG-013', summary: 'Onboarding back swipe exposes SecureVault before setup', priority: 'P1', resolved: '2026-06-13' },
  { id: 'BUG-016', summary: 'Biometric unlock switch not working (setup + settings)', priority: 'P1', resolved: '2026-06-14' },
  { id: 'BUG-017', summary: 'Tab switch feels frozen / janky before navigating', priority: 'P1', resolved: '2026-06-14' },
  { id: 'BUG-023', summary: 'Dark Mode toggle does nothing', priority: 'P1', resolved: '2026-06-14' },
  { id: 'BUG-025', summary: 'My Vault screen renders hardcoded mock data', priority: 'P1', resolved: '2026-06-14' },
  { id: 'BUG-004', summary: 'Website suggestion buttons do not update URL', priority: 'P2', resolved: '2026-06-13' },
  { id: 'BUG-008', summary: 'Vault header icon is on wrong side', priority: 'P2', resolved: '2026-06-13' },
  { id: 'BUG-009', summary: 'Security alerts are not clickable', priority: 'P2', resolved: '2026-06-14' },
  { id: 'BUG-014', summary: 'White screen flash when switching tabs', priority: 'P2', resolved: '2026-06-14' },
  { id: 'BUG-018', summary: 'White screen flash when pressing back', priority: 'P2', resolved: '2026-06-14' },
  { id: 'BUG-026', summary: 'Placeholder actions (Dashboard bell, Vault import/export icons)', priority: 'P2', resolved: '2026-06-14' },
  { id: 'BUG-019', summary: 'Active tab indicator is clipped at the top', priority: 'P3', resolved: '2026-06-14' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_MAP = { P0: 'Highest', P1: 'High', P2: 'Medium', P3: 'Low' };

function getCredentials() {
  const fs = require('fs');
  const path = require('path');
  const configPath = path.join(
    process.env.APPDATA,
    'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'
  );
  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(raw);
  const server = config.mcpServers?.['github.com/pashpashpash/mcp-atlassian'];
  if (!server) throw new Error('Atlassian MCP server not found in config');
  return { jiraUrl: server.env.JIRA_URL, email: server.env.JIRA_USERNAME, token: server.env.JIRA_API_TOKEN };
}

function basicAuth(email, token) {
  const encoded = Buffer.from(`${email}:${token}`).toString('base64');
  return `Basic ${encoded}`;
}

function toAdf(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const adjustedContent = lines.map(line => {
    if (line.startsWith('h3. ')) {
      return { type: 'paragraph', content: [{ type: 'text', text: line.replace('h3. ', ''), marks: [{ type: 'strong' }] }] };
    }
    return { type: 'paragraph', content: [{ type: 'text', text: line }] };
  });
  return { type: 'doc', version: 1, content: adjustedContent };
}

function mapPriority(priority) {
  return PRIORITY_MAP[priority] || 'Medium';
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
  const bugType = issueTypes.find(t => t.name.toLowerCase() === ISSUE_TYPE_NAME.toLowerCase());
  if (!bugType) {
    throw new Error(`No "${ISSUE_TYPE_NAME}" issue type found in project ${JIRA_PROJECT_KEY}`);
  }
  console.log(`   Using issue type: "${bugType.name}" (id: ${bugType.id})`);
  return bugType;
}

async function findExistingIssue(bugId) {
  const jql = `project = ${JIRA_PROJECT_KEY} AND summary ~ "[${bugId}]" ORDER BY created DESC`;
  try {
    const result = await jiraRequest(`/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=1`);
    if (result.issues && result.issues.length > 0) {
      return result.issues[0];
    }
  } catch (err) {
    console.log(`      ⚠️  JQL search failed: ${err.message}`);
  }
  return null;
}

async function transitionToDone(issueKey) {
  const transitions = await jiraRequest(`/rest/api/3/issue/${issueKey}/transitions`);
  const doneTransition = transitions.transitions.find(
    t => t.name.toLowerCase() === 'done' || t.to?.statusCategory?.key === 'done'
  );
  if (!doneTransition) {
    console.log(`      ⚠️  No "Done" transition found for ${issueKey} (already done?)`);
    return;
  }
  await jiraRequest(`/rest/api/3/issue/${issueKey}/transitions`, {
    method: 'POST',
    body: JSON.stringify({ transition: { id: doneTransition.id } }),
  });
  console.log(`      ✅ Transitioned to Done`);
}

async function assignComponent(issueKey) {
  try {
    // Verify component exists in Jira
    const components = await jiraRequest(`/rest/api/3/project/${JIRA_PROJECT_KEY}/components`);
    const bugComponent = components.find(c => c.name === COMPONENT_NAME);
    if (!bugComponent) {
      console.log(`      ⚠️  Component "${COMPONENT_NAME}" not found in project — creating it...`);
      await jiraRequest(`/rest/api/3/component`, {
        method: 'POST',
        body: JSON.stringify({ project: JIRA_PROJECT_KEY, name: COMPONENT_NAME }),
      });
      console.log(`      ✅ Component "${COMPONENT_NAME}" created`);
    }
    // Assign component to issue
    await jiraRequest(`/rest/api/3/issue/${issueKey}`, {
      method: 'PUT',
      body: JSON.stringify({ fields: { components: [{ name: COMPONENT_NAME }] } }),
    });
    console.log(`      ✅ Component "${COMPONENT_NAME}" assigned`);
  } catch (err) {
    console.log(`      ⚠️  Component assignment skipped: ${err.message}`);
  }
}

function deleteBugFile(bugId) {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(PROJECT_ROOT, 'docs', 'bug');
  if (!fs.existsSync(dir)) {
    console.log(`      ⚠️  Bug directory not found: ${dir}`);
    return false;
  }
  const files = fs.readdirSync(dir);
  const match = files.find(f => f.startsWith(`${bugId}-`) && f.endsWith('.md'));
  if (!match) {
    console.log(`      ⚠️  No file found for ${bugId} in docs/bug/`);
    return false;
  }
  const filePath = path.join(dir, match);
  fs.unlinkSync(filePath);
  console.log(`      ✅ Deleted docs/bug/${match}`);
  return true;
}

function removeFromBugIndex(bugId, jiraKey) {
  const fs = require('fs');
  if (!fs.existsSync(BUGS_MD)) {
    console.log(`      ⚠️  BUGS.md not found at ${BUGS_MD}`);
    return;
  }
  let content = fs.readFileSync(BUGS_MD, 'utf-8');
  const lines = content.split('\n');
  const filtered = lines.filter(line => {
    // Remove table rows that start with | BUG-{id} |
    const trimmed = line.trim();
    return !trimmed.startsWith(`| ${bugId} |`);
  });
  if (filtered.length === lines.length) {
    console.log(`      ⚠️  Row for ${bugId} not found in BUGS.md (may already be removed)`);
    return;
  }
  content = filtered.join('\n');
  fs.writeFileSync(BUGS_MD, content, 'utf-8');
  console.log(`      ✅ Removed ${bugId} row from BUGS.md`);
}

async function createJiraIssue(bug, issueTypeId) {
  const creds = getCredentials();
  const priorityName = mapPriority(bug.priority);
  const body = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      issuetype: { id: issueTypeId },
      summary: `[${bug.id}] ${bug.summary}`,
      description: toAdf(`h3. Description\nBug ${bug.id} has been resolved.\n\nh3. Resolved\n${bug.resolved}\n\nh3. Priority\n${bug.priority}`),
      priority: { name: priorityName },
      labels: ['securevault', 'bug', bug.id.toLowerCase()],
      components: [{ name: COMPONENT_NAME }],
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
  console.log('   SecureVault -> Jira Completed Bug Sync');
  console.log('═══════════════════════════════════════════════════════');

  const credentials = getCredentials();
  console.log(`   Jira: ${credentials.jiraUrl}`);
  console.log(`   User: ${credentials.email}`);
  console.log(`   Project: ${JIRA_PROJECT_KEY}`);
  console.log(`   Completed bugs to sync: ${COMPLETED_BUGS.length}`);
  console.log('───────────────────────────────────────────────────────');

  // Step 1: Verify project exists
  const project = await ensureProjectExists();

  // Step 2: Get issue type
  const issueType = await getIssueType(project);
  console.log('───────────────────────────────────────────────────────');

  // Step 3: Process each completed bug
  const results = [];
  for (const bug of COMPLETED_BUGS) {
    console.log(`\n📦 Processing ${bug.id}...`);
    try {
      // 3a. Find or create the issue
      let issue = await findExistingIssue(bug.id);
      if (issue) {
        console.log(`   🔍 Found existing: ${credentials.jiraUrl}/browse/${issue.key}`);
      } else {
        issue = await createJiraIssue(bug, issueType.id);
      }

      // 3b. Transition to Done
      await transitionToDone(issue.key);

      // 3c. Assign Bugs component
      await assignComponent(issue.key);

      // 3d. Delete the individual bug file
      deleteBugFile(bug.id);

      // 3e. Remove from BUGS.md
      removeFromBugIndex(bug.id, issue.key);

      results.push({
        bug: bug.id,
        summary: bug.summary,
        key: issue.key,
        url: `${credentials.jiraUrl}/browse/${issue.key}`,
      });
    } catch (err) {
      console.error(`   ❌ FAILED to process ${bug.id}: ${err.message}`);
      results.push({ bug: bug.id, summary: bug.summary, key: null, error: err.message });
    }
  }

  // Step 4: Summary
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  const succeeded = results.filter(r => r.key);
  const failed = results.filter(r => !r.key);
  console.log(`   Synced: ${succeeded.length}/${COMPLETED_BUGS.length}`);
  console.log(`   Failed: ${failed.length}/${COMPLETED_BUGS.length}`);
  if (succeeded.length > 0) {
    console.log('');
    console.log('   Migrated Bugs (Bug ID → Jira Key):');
    console.log('');
    succeeded.forEach(r => {
      console.log(`      ${r.bug} → ${r.key}  ${r.url}`);
    });
  }
  if (failed.length > 0) {
    console.log('');
    console.log('   Failed Bugs:');
    failed.forEach(f => console.log(`      ${f.bug}: ${f.error}`));
  }

  console.log('');
  console.log('   Next steps:');
  console.log('   1. Update BUGS.md to add the migration record (adds bug name ↔ Jira key table)');
  console.log('   2. Verify Jira issues are marked as Done with Bugs component');
  console.log('   3. Commit the changes');
  console.log('───────────────────────────────────────────────────────');
}

main().catch(err => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});
