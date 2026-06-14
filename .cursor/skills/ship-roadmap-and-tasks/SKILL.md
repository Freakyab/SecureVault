---
name: ship-roadmap-and-tasks
description: Read ROADMAP.md, TASKS.md, and BUGS.md, then autonomously build every feature, task, and bug fix they describe, match any Figma design link passed in the command, verify each one, update the trackers whenever a feature is added, and loop without stopping until the project goal is fully met. Runs in an auto-compact mode that treats the markdown files as durable memory so long sessions survive context resets. Use when the user names this skill or asks to build/ship the roadmap and tasks until done.
disable-model-invocation: true
---

# Ship Roadmap and Tasks

Drive the project to a finished state from its two planning files. The user's intent:

> read @ROADMAP.md @TASKS.md @BUGS.md and start creating the feature according to the mention tasks. run it untill the goal is filled successfully in auto compact mode.

Build the features and fixes those files describe, **match the Figma design** when a link is provided, verify each, **update both trackers every time a feature is added**, and keep looping until the goal is met. Do **not** stop to ask for approval between items — only stop on the explicit stop conditions below.

## Step 0: Load both trackers (durable memory)

1. Read `ROADMAP.md` fully — note phases, the **Overall progress tracker**, phase tables, per-phase `- [ ]` tasks, **Open decisions**, and the **Progress log**.
2. Read `TASKS.md` fully — note the **Progress tracker** counts, **Recommended Fix Order**, the Pending/Completed Task indexes, per-item `#task-xxx` detail sections, and the **Resolution log**.
   Read `BUGS.md` fully — note the Active/Completed Bug indexes, **Potential Bug Backlog** (`POT-xxx`), per-item `#bug-xxx` detail sections, and its **Resolution log**.
3. Detect the stack once (here: Expo SDK 56 + React Native + TypeScript, expo-router, StyleSheet theming, `lucide-react-native`). Record the run/lint command. Read versioned Expo docs at https://docs.expo.dev/versions/v56.0.0/ before writing native code, per AGENTS.md.

These three files (`ROADMAP.md`, `TASKS.md`, `BUGS.md`) are the single source of truth and your persistent memory. Re-read them to resume — never re-scan the whole repo.

**Status values:** `open` · `in_progress` · `blocked` · `done` · `wont_fix`.

## Match the Figma design (when a link is in the command)

If the command includes a `figma.com` URL, that design is the visual source of truth — build every screen to match it pixel-close.

1. Read the project skill `.cursor/skills/figma-to-react-native/SKILL.md` and follow it for the design-to-code workflow.
2. Use the **user-figma** MCP server (check each tool's schema first):
   - Parse the URL for `fileKey` + `nodeId` (convert `-` to `:` in `node-id`).
   - Call `get_design_context` per node for reference code, screenshots, and hints; honor Code Connect snippets, design tokens (as CSS vars → theme tokens), and annotations.
   - Use `get_metadata` / `get_screenshot` to enumerate frames and verify visual match.
3. Map every Figma frame to a roadmap screen/feature; reuse existing components and `constants/vault-theme.ts` tokens instead of hardcoding. Adapt the React+Tailwind reference output to this repo's StyleSheet + RN conventions.
4. Verify each built screen against its Figma screenshot before marking the item `done`. If no Figma link is provided, follow the design tokens already in `ROADMAP.md`.

## Create a plan before executing

Before touching any code, turn the loaded trackers into an explicit execution plan:

1. Build the plan with the `TodoWrite` tool — one todo per queue item (bug/task/feature), ordered exactly as the work queue below. Keep only one item `in_progress` at a time and mark each `completed` as you finish it.
2. Mirror that plan into the trackers themselves so it survives a context reset: every planned item must be **mentioned** in `TASKS.md`, `BUGS.md`, and/or `ROADMAP.md` (see "Check or add the mention field").
3. Re-read the plan to resume; update it each loop so it always reflects remaining work.

## Check or add the mention field

A feature is only valid work if it is **mentioned** (tracked) in a file. For each planned item:

- **Check** that the item is mentioned — it has an entry/row (`TASK-xxx`, `BUG-xxx`, or a `ROADMAP.md` `- [ ]` task) with a Status field in its index table AND detail section.
- **Add** the missing mention if it is not there: when the Figma design or the goal requires work that is not yet listed, create a new tracked entry before building it — add it to the correct index table, write a detail section with acceptance criteria and affected files, set Status `open`, and bump the tracker counts. Never build untracked work.
- Keep every item's mention fields (Status, Priority, Last updated, related `POT-xxx`) accurate as you progress.

## Build the work queue

Combine items from both files into one ordered queue:

1. **`TASKS.md` and `BUGS.md` first**, in **Recommended Fix Order**, then by priority (P0 → P1 → P2 → P3). P0 items block core flows — clear them first.
2. **`ROADMAP.md` phases in order** (Phase 0 → 6). Respect the **Pre-Phase 3 gate**: do not start Phase 3 until Phases 0–2 are 100% (or record an explicit exception in the Progress log).
3. When a roadmap task and a bug/task item describe the same work, do it once and check both.

## The Loop

Repeat for each queue item until none remain:

1. **Pick** the next item from the plan (respect fix order, priority, and the Pre-Phase 3 gate). Set its plan todo `in_progress`.
2. **Mark `in_progress`** in its index/detail section and adjust tracker counts. If the item has no mention yet, add it first (see "Check or add the mention field").
3. **Check if it already exists** — search the codebase and read the item's acceptance criteria / affected files.
   - TASK/feature already implemented and working → skip building, go to step 6.
   - BUG already fixed → verify, go to step 6.
4. **Implement / fix** with the smallest change that fully satisfies the item:
   - **Feature/task missing** → build it end-to-end (logic + realistic, polished UI per workspace rules: `expo-ts.mdc`, `react-native-icons.mdc`, `react-native-ui.mdc`, and the Figma design if a link was given). No placeholder boxes.
   - **Bug** → reproduce from the description, find root cause, fix it.
5. **Verify** with the project's run/lint/typecheck/test command (`npm run lint`, then a build/smoke run). Fix failures using only the failing output and related files. After substantive edits, check lints on touched files. If a Figma link was given, confirm the screen matches its frame.
6. **Mark `done`** and immediately update `ROADMAP.md` plus the relevant tracker (`TASKS.md` for tasks, `BUGS.md` for bugs/`POT-xxx`) — see "Updating the trackers". **Every time a feature is added, the trackers must be updated** before moving on.
7. Repeat — immediately, without pausing.

**Stop conditions (only these):**
- Every queue item is `done` or justified `wont_fix` AND the project goal is met → report completion.
- The same error recurs 3 times on one item → set it `blocked`, record the blocker in the Resolution log, then continue with the next item.
- A genuine destructive/irreversible decision or an unresolved **Open decision** blocks all remaining work → surface it to the user.

## Updating the trackers

Keep every file internally consistent after every item:

**`TASKS.md`** (for `TASK-xxx`)
- Set Status in the index table AND detail section to `done`; move it to the Completed index/section.
- Recompute counts, priority breakdown, the `% resolved` bar, and the `Open / In progress / Done` header line.
- Refresh `Last updated:` and append a **Resolution log** row (ID + what changed).

**`BUGS.md`** (for `BUG-xxx` / `POT-xxx`)
- Set Status in the index table AND detail section to `done`; move it to the Completed Bug Index.
- Update any related `POT-xxx` (`Related item` column) status.
- Recompute counts, refresh `Last updated:`, and append a **Resolution log** row (ID + what changed).

**`ROADMAP.md`**
- Check the task box `[x]` and bump phase status emoji (⬜ → 🟡 → ✅).
- Recompute the **Overall progress tracker**, the **Pre-Phase 3 gate**, per-phase rows, milestone %, and the "Quick reference — update these numbers" table using the PowerShell count snippet in the file.
- Add a **Progress log** row when a phase or milestone completes.

## Auto-compact mode

Long autonomous runs will hit context limits — design for that:

- Treat `ROADMAP.md` + `TASKS.md` + `BUGS.md` as the only state that must survive. Persist progress to them **before** moving on, so any context reset can resume cleanly from the files alone.
- After each completed item, write a one-line Log/Resolution entry capturing what changed and where — this is your checkpoint.
- Read targeted files and line ranges, not whole files; read only failing output, not full logs.
- Prefer scoped lint/type checks over full rebuilds each cycle.
- On resume: re-read all three files, rebuild the queue from remaining `open`/`in_progress`/`blocked` items, and continue. Re-verify anything left `in_progress` since it may be partial.

## Completion criteria

- [ ] An execution plan was created (`TodoWrite`) and every todo is `completed`
- [ ] Every built feature is mentioned/tracked in a file with an accurate Status field
- [ ] Every `open`/`in_progress`/`blocked` item in `TASKS.md` and `BUGS.md` is `done` or justified `wont_fix`
- [ ] All `ROADMAP.md` phase tasks targeted by the goal are checked, with progress tables recomputed
- [ ] Each feature/fix is verified (builds, lints, typechecks, runs/tests pass)
- [ ] All trackers' counts, bars, indexes, and `Last updated` reflect reality
- [ ] Resolution log + Progress log have entries for the work done
