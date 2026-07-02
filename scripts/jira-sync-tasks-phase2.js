/**
 * Jira Task Sync — Phase 2
 *
 * Migrates TASK-051 through TASK-079 to Jira under the Tasks component.
 * Done tasks are transitioned to Done; open tasks remain in To Do.
 *
 * Usage:
 *   node scripts/jira-sync-tasks-phase2.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// ── Config ──────────────────────────────────────────────────────────────────
const JIRA_URL = "https://aryanbhisikar02.atlassian.net";
const JIRA_PROJECT_KEY = "KAN";
const COMPONENT_NAME = "Tasks";
const ISSUE_TYPE_NAME = "Task";
const TASK_DIR = "docs/tasks";

// ── Tasks 051–079 ───────────────────────────────────────────────────────────
const TASKS = [
  {
    id: "TASK-051",
    phase: "6.20",
    summary: "Migrate Onboarding to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nOnboarding still uses the legacy useVaultColors + VaultType system with hardcoded spacing/radius/rgba. Migrate it onto the completed Phase 6 foundation so it matches the Dashboard reference.\n\nh3. Scope\n- Replace useVaultColors() with useTheme() (and useThemePresets() where it removes duplication).\n- Replace VaultType.* text styles with theme.typography.*.\n- Replace hardcoded spacing/radius/colors with theme.spacing, theme.radius, theme.colors.\n- Drive slide transitions / entrances with theme.motion durations + easing (Reanimated); keep under 350ms.\n- Add useHaptics() feedback on Continue / Get started instead of old helpers.\n\nh3. Phase\nPhase 6 — UI overhaul / Onboarding\n\nh3. Status\nDone",
  },
  {
    id: "TASK-052",
    phase: "6.20",
    summary: "Migrate Setup Master Password to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nSetup Master Password uses useVaultColors, Fonts, hardcoded rgba/spacing/radius/typography, and a Modal animationType='fade' rather than motion tokens. Migrate it onto the Phase 6 foundation.\n\nh3. Scope\n- Replace useVaultColors() / Fonts with useTheme() + theme.typography.*.\n- Replace hardcoded spacing/radius/colors with theme.spacing, theme.radius, theme.colors.\n- Replace the creating-vault modal's animationType='fade' with a theme.motion-driven transition.\n- Add useHaptics() feedback on create / success / validation error.\n\nh3. Phase\nPhase 6 — UI overhaul / Auth — Setup\n\nh3. Status\nDone",
  },
  {
    id: "TASK-053",
    phase: "6.20",
    summary: "Migrate Unlock Vault to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nUnlock Vault uses useVaultColors / VaultType with hardcoded values and has no local haptic feedback on unlock / biometric press. Migrate it onto the Phase 6 foundation.\n\nh3. Scope\n- Replace useVaultColors() / VaultType.* with useTheme() + theme.typography.*.\n- Replace hardcoded spacing/radius/colors with theme.spacing, theme.radius, theme.colors.\n- Add useHaptics() feedback on unlock press, biometric press, success, and wrong-password error.\n- Use theme.motion for any entrance / error-shake animation; keep under 350ms.\n\nh3. Phase\nPhase 6 — UI overhaul / Auth — Unlock\n\nh3. Status\nDone",
  },
  {
    id: "TASK-054",
    phase: "6.20",
    summary: "Migrate Main Vault to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nMain Vault uses useVaultColors, VaultType, vaultShadow, Fonts, and many hardcoded spacing/radius/font values, with no Phase 6 motion. Migrate the screen — and the shared vault components it renders — onto the Phase 6 foundation.\n\nh3. Scope\n- Replace useVaultColors() / VaultType.* / vaultShadow with useTheme(), theme.typography.*, theme.shadows.*.\n- Replace hardcoded spacing/radius/colors with theme.spacing, theme.radius, theme.colors.\n- Migrate shared components used here (e.g. credential-row, credential-avatar, category-card, vault-header, bottom-nav) since they are shared app-wide.\n- Add list stagger / row entrance via theme.motion and PressableScale + useHaptics() on row tap / copy.\n\nh3. Phase\nPhase 6 — UI overhaul / Vault\n\nh3. Status\nDone",
  },
  {
    id: "TASK-055",
    phase: "6.20",
    summary: "Migrate My Vault to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nMy Vault uses useVaultColors / VaultType, mock accent hex values, hardcoded layout/type values, and no motion or haptics. Migrate it onto the Phase 6 foundation (reuse the shared components migrated in TASK-054).\n\nh3. Scope\n- Replace useVaultColors() / VaultType.* with useTheme() + theme.typography.*.\n- Replace mock accent hexes + hardcoded spacing/radius with theme.colors / theme.spacing / theme.radius.\n- Add list/section entrance via theme.motion and useHaptics() + PressableScale on interactive rows.\n\nh3. Phase\nPhase 6 — UI overhaul / Vault\n\nh3. Status\nDone",
  },
  {
    id: "TASK-056",
    phase: "6.20",
    summary: "Migrate Generator to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nGenerator uses useVaultColors / VaultType with many hardcoded style numbers and old hapticSuccess / hapticWarning helpers. Migrate it onto the Phase 6 foundation and useHaptics().\n\nh3. Scope\n- Replace useVaultColors() / VaultType.* with useTheme() + theme.typography.*.\n- Replace hardcoded spacing/radius/colors with theme.spacing, theme.radius, theme.colors.\n- Replace hapticSuccess / hapticWarning with useHaptics() (copy → selection/success, error → error).\n- Animate password regeneration / copy confirmation with theme.motion; < 350ms.\n\nh3. Phase\nPhase 6 — UI overhaul / Generator\n\nh3. Status\nDone",
  },
  {
    id: "TASK-057",
    phase: "6.20",
    summary: "Migrate Password Health to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nPassword Health uses useVaultColors, VaultType, SerifFont, and hardcoded typography/spacing/radius, with no haptics for scan/actions. Migrate it onto the Phase 6 foundation.\n\nh3. Scope\n- Replace useVaultColors() / VaultType.* / SerifFont with useTheme() + theme.typography.*.\n- Replace hardcoded spacing/radius/colors with theme.spacing, theme.radius, theme.colors.\n- Animate the score ring / count-up and list entrances with theme.motion (reuse AnimatedNumber pattern once 6.9 lands); < 350ms.\n- Add useHaptics() feedback on scan / fix actions.\n\nh3. Phase\nPhase 6 — UI overhaul / Password Health\n\nh3. Status\nDone",
  },
  {
    id: "TASK-058",
    phase: "6.20",
    summary: "Migrate Settings to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nSettings uses useVaultColors / VaultType, hardcoded style values and rgba colors, and old hapticSuccess / hapticWarning helpers. Migrate it onto the Phase 6 foundation and useHaptics().\n\nh3. Scope\n- Replace useVaultColors() / VaultType.* with useTheme() + theme.typography.*.\n- Replace hardcoded spacing/radius/rgba with theme.spacing, theme.radius, theme.colors.\n- Replace hapticSuccess / hapticWarning with useHaptics() on toggles / destructive actions (toggle → selection, success → success, warning → warning/error).\n- Keep the existing color-theme picker working through the new token resolution.\n\nh3. Phase\nPhase 6 — UI overhaul / Settings\n\nh3. Status\nDone",
  },
  {
    id: "TASK-059",
    phase: "6.20",
    summary: "Migrate Add Credential to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nAdd Credential uses useVaultColors / VaultType with hardcoded style values and old hapticSuccess / hapticWarning helpers. Migrate it onto the Phase 6 foundation and useHaptics().\n\nh3. Scope\n- Replace useVaultColors() / VaultType.* with useTheme() + theme.typography.*.\n- Replace hardcoded spacing/radius/colors with theme.spacing, theme.radius, theme.colors.\n- Migrate the shared input-field component used here to tokens (focus/error states).\n- Replace hapticSuccess / hapticWarning with useHaptics() on save / validation error.\n\nh3. Phase\nPhase 6 — UI overhaul / Add Credential\n\nh3. Status\nDone",
  },
  {
    id: "TASK-060",
    phase: "6.20",
    summary: "Migrate Entry detail / Edit Credential to Phase 6 tokens/hooks",
    priority: "High",
    status: "done",
    description:
      "h3. Description\nEntry detail / Edit Credential uses useVaultColors / VaultType with hardcoded style values and old haptic + clipboard helpers. Migrate it onto the Phase 6 foundation and useHaptics() (keep copySensitiveToClipboard behavior, route its haptic through the hook).\n\nh3. Scope\n- Replace useVaultColors() / VaultType.* with useTheme() + theme.typography.*.\n- Replace hardcoded spacing/radius/colors with theme.spacing, theme.radius, theme.colors.\n- Replace hapticSuccess / hapticWarning with useHaptics() on save / copy / delete-confirm / validation error.\n- Animate card expand / save confirmation with theme.motion; < 350ms.\n\nh3. Phase\nPhase 6 — UI overhaul / Entry detail\n\nh3. Status\nDone",
  },
  {
    id: "TASK-061",
    phase: "6.20",
    summary: "Migrate Change Password to Phase 6 tokens/hooks",
    priority: "High",
    status: "open",
    description:
      "h3. Description\nChange Password uses useVaultColors / VaultType with hardcoded style values and old hapticSuccess / hapticWarning helpers. Migrate it onto the Phase 6 foundation and useHaptics().\n\nh3. Scope\n- Replace useVaultColors() / VaultType.* with useTheme() + theme.typography.*.\n- Replace hardcoded spacing/radius/colors with theme.spacing, theme.radius, theme.colors.\n- Replace hapticSuccess / hapticWarning with useHaptics() on the validation branches and success.\n- Use theme.motion for any error / success transition; < 350ms.\n\nh3. Phase\nPhase 6 — UI overhaul / Auth — Change Password\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-062",
    phase: "7.1",
    summary: "Swipe-to-action vault rows (copy/edit/delete)",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nVault rows are plain Pressable — no swipe actions. Add gesture-driven swipe-to-action (reveal copy / edit / delete) with spring snap, haptic detents, and a full-swipe shortcut.\n\nh3. Scope\n- Use react-native-gesture-handler + Reanimated for an interruptible, reversible swipe.\n- Reveal copy / edit / delete actions; spring snap to open/closed; haptic detent at threshold.\n- Full-swipe triggers the primary action; source spring/timing from theme/animations.ts.\n\nh3. Phase\nPhase 7 — Animation / Vault list\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-063",
    phase: "7.2",
    summary: "Long-press context menu + drag-to-reorder favorites",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nAdd long-press → context menu and drag-to-reorder for favorites. Requires a favorite-order field in the data model (currently only an isFavorite boolean).\n\nh3. Scope\n- Long-press opens a context menu (react-native-gesture-handler); drag-to-reorder via Reanimated layout animations.\n- Add an explicit favorite order to Credential + persist via vault context.\n- Haptic on long-press activation and drop.\n\nh3. Phase\nPhase 7 — Animation / Vault list\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-064",
    phase: "7.3",
    summary: "Custom branded pull-to-refresh",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nNo pull-to-refresh exists. Add a custom branded animated indicator (shield/progress) instead of the default spinner.\n\nh3. Scope\n- Gesture-driven pull with an animated shield/progress drawn via Reanimated/SVG.\n- Soft haptic at the refresh threshold (map already has pullToRefresh).\n- Apply on the scrollable list screens (Vault, Dashboard).\n\nh3. Phase\nPhase 7 — Animation / Vault & Dashboard\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-065",
    phase: "7.4",
    summary: "Velocity-aware bottom sheet gestures",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nNo bottom sheet exists. Add velocity-aware sheets with snap points, fling-to-dismiss, and a backdrop that fades with drag.\n\nh3. Scope\n- Add @gorhom/bottom-sheet (or equivalent Reanimated sheet); configure snap points.\n- Fling-to-dismiss honoring gesture velocity; backdrop opacity interpolates with drag.\n- Use for contextual actions (e.g. row actions, filters).\n\nh3. Phase\nPhase 7 — Animation / Sheets\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-066",
    phase: "7.5",
    summary: "Shared-element transition — vault row → entry detail",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nTapping a row routes to /entry/[id] with no shared element. Add a shared-element transition so the logo + title morph in place into the detail screen.\n\nh3. Scope\n- Use Reanimated shared element transitions / expo-router transitions.\n- Morph credential logo + title from the row into the detail header.\n- Reverse cleanly on back navigation.\n\nh3. Phase\nPhase 7 — Animation / Navigation\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-067",
    phase: "7.6",
    summary: "Scroll-driven collapsing headers + parallax hero",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nScreens use normal ScrollView with no scroll-driven motion. Add collapsing headers with a parallax hero (header shrinks/blurs as content scrolls).\n\nh3. Scope\n- Drive header height/opacity/blur from useAnimatedScrollHandler + interpolate.\n- Parallax hero on Dashboard / Health; keep work on the UI thread.\n\nh3. Phase\nPhase 7 — Animation / Headers\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-068",
    phase: "7.7",
    summary: "Spatial continuity between Dashboard and Health",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nDashboard has an animated health card but navigates to /health via router.push with no shared/spatial transition (tab transitions are disabled). Make the score/number morph across screens for spatial continuity.\n\nh3. Scope\n- Morph the health score/number from the Dashboard card into the Health screen ring.\n- Coordinate with TASK-066 transition approach and TASK-072 ring animation.\n\nh3. Phase\nPhase 7 — Animation / Navigation\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-069",
    phase: "7.8",
    summary: "Lottie / Reanimated success states",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nSuccess feedback is mostly toast + haptics. Add animated success states (animated checkmark on save, copy-confirm pulse) via Lottie or Reanimated.\n\nh3. Scope\n- Animated checkmark on save; copy-confirm pulse on copy actions.\n- Either add lottie-react-native or build with Reanimated/SVG.\n- Reuse across add/edit credential, generator, settings.\n\nh3. Phase\nPhase 7 — Animation / Feedback\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-070",
    phase: "7.9",
    summary: "Animated empty-state illustrations",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nempty-state.tsx is static icon + text. Add subtle looping motion to empty-state illustrations (reduce-motion safe).\n\nh3. Scope\n- Add a subtle, low-cost looping animation to the empty-state illustration.\n- Pause when offscreen; provide a static reduced-motion variant.\n\nh3. Phase\nPhase 7 — Animation / Empty states\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-071",
    phase: "7.10",
    summary: "Generator strength meter spring fill + color interpolation",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nThe generator strength meter changes width/color instantly via styles. Animate the fill with withSpring and interpolate color as strength changes.\n\nh3. Scope\n- Spring-animate the meter fill width; interpolateColor between weak→strong colors.\n- Drive from the strength score; source spring config from theme/animations.ts.\n\nh3. Phase\nPhase 7 — Animation / Generator\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-072",
    phase: "7.11",
    summary: "Health score ring draw-on synced with count-up",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nScoreRing renders the SVG dash offset statically; the Health screen ring does not draw on or sync with a count-up. Animate the ring draw-on synced with the number count-up.\n\nh3. Scope\n- Animate SVG strokeDashoffset draw-on with Reanimated; sync to the count-up number.\n- Reuse the AnimatedNumber pattern (Phase 6 7.9) for the count-up.\n\nh3. Phase\nPhase 7 — Animation / Health\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-073",
    phase: "7.12",
    summary: "Celebratory moment on health-score milestone",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nNo milestone celebration exists. Add a subtle, tasteful, dismissible celebratory moment (light confetti / glow) when the health score crosses a milestone.\n\nh3. Scope\n- Trigger on crossing a milestone threshold (e.g. reaching a target score).\n- Light confetti / glow; dismissible; success haptic; not repeated annoyingly.\n\nh3. Phase\nPhase 7 — Animation / Health\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-074",
    phase: "7.13",
    summary: "Perf-budgeted animated gradient/glow backdrops",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nAnimatedBlobs loops ambient blobs but never pauses offscreen or caps resource use. Make animated gradient/glow backdrops perf-budgeted (slow drift, paused when offscreen).\n\nh3. Scope\n- Pause/cancel the loop when the screen is unfocused / blobs are offscreen (useIsFocused).\n- Slow drift only; cap GPU/CPU cost; resume on focus.\n\nh3. Phase\nPhase 7 — Animation / Ambient\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-075",
    phase: "7.14",
    summary: "Shimmer skeleton → content morph",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nNo skeleton/shimmer exists; loading uses RouteFallback. Add shimmer skeletons that morph into content via Reanimated layout animations (no hard pop-in).\n\nh3. Scope\n- Build a SkeletonLoader (Phase 6 7.12) shimmer; morph skeleton → content with layout animations.\n- Apply to list/detail loading states; never blank-screen or pop-in.\n\nh3. Phase\nPhase 7 — Animation / Loading\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-076",
    phase: "7.15",
    summary: "Spring-animated tab bar",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nbottom-nav.tsx uses static active styling. Add a spring-animated active pill that slides between tabs, with icon morph/scale on selection.\n\nh3. Scope\n- Reanimated spring for the active pill slide; icon scale/morph on selection.\n- Selection haptic; source spring config from theme/animations.ts.\n\nh3. Phase\nPhase 7 — Animation / Navigation\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-077",
    phase: "7.16",
    summary: "Reduced-motion variants (useReducedMotion)",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nNo reduced-motion handling exists. Respect useReducedMotion() and provide crossfade/instant variants for every Phase 7 animation; nothing should convey meaning by motion alone.\n\nh3. Scope\n- Add a reduced-motion hook/wrapper; branch each animation (TASK-062–076) to a crossfade/instant variant.\n- Verify no information is conveyed by motion alone.\n\nh3. Phase\nPhase 7 — Animation / Accessibility\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-078",
    phase: "7.17",
    summary: "60fps worklet budget + perf profiling",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nNo perf profiling / FPS instrumentation exists. Ensure all animation runs on the UI thread (Reanimated worklets), avoid JS layout thrash, and profile on a mid-range device.\n\nh3. Scope\n- Audit Phase 7 animations for UI-thread execution; remove JS-driven/layout-thrash paths.\n- Profile with the perf monitor on a mid-range device; record results.\n\nh3. Phase\nPhase 7 — Animation / Performance\n\nh3. Status\nOpen",
  },
  {
    id: "TASK-079",
    phase: "7.18",
    summary: "Motion consistency audit via theme/animations.ts",
    priority: "Medium",
    status: "open",
    description:
      "h3. Description\nFinal audit: all springs/durations must source from theme/animations.ts; fine-tune timing + easing and run design QA.\n\nh3. Scope\n- Sweep all animated code for hardcoded durations/springs; route them through theme/animations.ts.\n- Final timing/easing fine-tune; design QA (visual, motion, code, UX) per migrated screen.\n\nh3. Phase\nPhase 7 — Animation / QA\n\nh3. Status\nOpen",
  },
];

// ── Credentials ─────────────────────────────────────────────────────────────
function getCredentials() {
  const settingsPath = path.join(
    process.env.APPDATA,
    "Code",
    "User",
    "globalStorage",
    "saoudrizwan.claude-dev",
    "settings",
    "cline_mcp_settings.json",
  );
  const raw = fs.readFileSync(settingsPath, "utf-8");
  const config = JSON.parse(raw);
  const server = config.mcpServers["github.com/pashpashpash/mcp-atlassian"];
  return {
    jiraUrl: server.env.JIRA_URL,
    email: server.env.JIRA_USERNAME,
    token: server.env.JIRA_API_TOKEN,
  };
}

// ── HTTP helpers ────────────────────────────────────────────────────────────
function jiraRequest(endpoint, options = {}) {
  const creds = getCredentials();
  const url = new URL(endpoint, creds.jiraUrl);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: options.method || "GET",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${creds.email}:${creds.token}`).toString("base64"),
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(options.headers || {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 400) {
              const msg =
                parsed.errorMessages?.join(", ") ||
                parsed.message ||
                `HTTP ${res.statusCode}`;
              reject(new Error(msg));
            } else {
              resolve(parsed);
            }
          } catch {
            reject(
              new Error(
                `Non-JSON response (${res.statusCode}): ${data.slice(0, 200)}`,
              ),
            );
          }
        });
      },
    );
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function toAdf(text) {
  const lines = text.split("\n").filter((l) => l.trim());
  const content = lines.map((line) => {
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
    return { type: "paragraph", content: [{ type: "text", text: line }] };
  });
  return { type: "doc", version: 1, content };
}

function mapPriority(p) {
  return { High: "High", Medium: "Medium", Low: "Low" }[p] || "Medium";
}

async function getTransitionId(issueKey, targetStatus) {
  const transitions = await jiraRequest(
    `/rest/api/3/issue/${issueKey}/transitions`,
  );
  const t = transitions.transitions.find(
    (t) => t.to.name.toLowerCase() === targetStatus.toLowerCase(),
  );
  return t ? t.id : null;
}

async function ensureProjectExists() {
  const project = await jiraRequest(`/rest/api/3/project/${JIRA_PROJECT_KEY}`);
  console.log(`   ✅ Project found: "${project.name}" (${project.key})`);
  return project;
}

async function getIssueType(project) {
  const issueTypes = await jiraRequest(
    `/rest/api/3/issuetype/project?projectId=${project.id}`,
  );
  const taskType = issueTypes.find(
    (t) => t.name.toLowerCase() === ISSUE_TYPE_NAME.toLowerCase(),
  );
  if (!taskType) throw new Error(`No "${ISSUE_TYPE_NAME}" issue type found`);
  console.log(`   Using issue type: "${taskType.name}" (id: ${taskType.id})`);
  return taskType;
}

async function ensureComponentExists() {
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

async function createIssue(task, issueTypeId, componentId) {
  const creds = getCredentials();
  const body = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      issuetype: { id: issueTypeId },
      summary: `[${task.id}] ${task.summary}`,
      description: toAdf(task.description),
      priority: { name: mapPriority(task.priority) },
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
  const doneId = await getTransitionId(issueKey, "Done");
  if (!doneId) {
    console.log(
      `   ⚠️  No "Done" transition found for ${issueKey} — trying "Closed"...`,
    );
    const closedId = await getTransitionId(issueKey, "Closed");
    if (!closedId) {
      console.log(`   ⚠️  No "Closed" transition found either. Skipping.`);
      return false;
    }
    await jiraRequest(`/rest/api/3/issue/${issueKey}/transitions`, {
      method: "POST",
      body: JSON.stringify({ transition: { id: closedId } }),
    });
    console.log(`   ✅ ${issueKey} transitioned to Closed`);
    return true;
  }
  await jiraRequest(`/rest/api/3/issue/${issueKey}/transitions`, {
    method: "POST",
    body: JSON.stringify({ transition: { id: doneId } }),
  });
  console.log(`   ✅ ${issueKey} transitioned to Done`);
  return true;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("══════════════════════════════════════════════════════");
  console.log("   SecureVault -> Jira Task Sync (Phase 2)");
  console.log("══════════════════════════════════════════════════════");

  const credentials = getCredentials();
  console.log(`   Jira: ${credentials.jiraUrl}`);
  console.log(`   Project: ${JIRA_PROJECT_KEY}`);
  console.log(`   Tasks to migrate: ${TASKS.length}`);
  console.log("──────────────────────────────────────────────────────");

  const project = await ensureProjectExists();
  const issueType = await getIssueType(project);
  const component = await ensureComponentExists();
  console.log("──────────────────────────────────────────────────────");

  const results = [];
  for (const task of TASKS) {
    try {
      const issue = await createIssue(task, issueType.id, component.id);

      if (task.status === "done") {
        await transitionToDone(issue.key);
      }

      results.push({
        task: task.id,
        key: issue.key,
        url: `${credentials.jiraUrl}/browse/${issue.key}`,
        status: task.status === "done" ? "Done" : "To Do",
      });
    } catch (err) {
      console.error(`   ❌ FAILED to migrate ${task.id}: ${err.message}`);
      results.push({ task: task.id, key: null, error: err.message });
    }
  }

  console.log("══════════════════════════════════════════════════════");
  console.log("   MIGRATION SUMMARY");
  console.log("══════════════════════════════════════════════════════");
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
    console.log(`      ${r.key} - ${r.url} (${r.status})`),
  );
  console.log("══════════════════════════════════════════════════════");
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
