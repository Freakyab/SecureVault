---
name: resolve-bugs-and-tasks
description: Find BUGS-AND-TASKS.md, then for every feature/task and bug in it, check whether it already exists in the codebase, build any missing feature, fix any bug, and update the file's statuses, indices, and resolution log. Loops until every item is fully implemented and marked done. Use when the user names this skill or asks to work through, resolve, or build out the bugs-and-tasks file.
disable-model-invocation: true
---

# Resolve Bugs and Tasks

Drive `BUGS-AND-TASKS.md` to a fully-resolved state. For each `TASK-xxx` and `BUG-xxx`: confirm whether it already exists in the code, build it if missing, fix it if broken, verify, then update the file. Loop until every open item is `done`.

## Step 0: Locate and read the tracker

1. Find the file (root or nested): search for `BUGS-AND-TASKS.md`.
2. Read it fully. It is the single source of truth. Note its structure:
   - **Progress tracker** + counts (Open / In progress / Blocked / Done / Total) and the progress bar.
   - **Recommended Fix Order** — work items in this order unless a dependency forces otherwise.
   - **Active Bug Index** / **Completed Bug Index** / **Pending Tasks Index** / **Completed Tasks** tables.
   - **Potential Bug Backlog** (`POT-xxx`).
   - Per-item detail sections anchored as `#task-xxx` / `#bug-xxx`.
   - **Resolution log** at the bottom.
3. Build the work queue from every item whose status is `open`, `in_progress`, or `blocked`, ordered by **Recommended Fix Order**, then by priority (P0 → P3).

**Status values:** `open` · `in_progress` · `blocked` · `done` · `wont_fix`.

## The Loop

Repeat for each item in the work queue until none remain:

1. **Pick** the next item (respect Recommended Fix Order and priority).
2. **Mark `in_progress`** — update its status in the index table and detail section, and adjust the tracker counts.
3. **Check if it already exists** — search the codebase for the feature/fix. Read the item's detail section for acceptance criteria and affected files.
   - If a TASK is already fully implemented and working → skip building; go to step 6.
   - If a BUG is already fixed → verify, then go to step 6.
4. **Implement / fix** the smallest change that fully satisfies the item:
   - **TASK (feature)** missing → build it end-to-end (logic + realistic, polished UI per project conventions and the workspace rules).
   - **BUG** → reproduce from the description, find root cause, fix it.
5. **Verify** with the project's run/build/lint/test command. Fix failures from only the failing output and related files before continuing.
6. **Mark `done`** and update the file (see "Updating the tracker").
7. Repeat.

**Stop conditions:** every queue item is `done` (or justified `wont_fix`), OR the same error recurs 3 times — then set the item `blocked`, record the blocker in the Resolution log, and surface it to the user.

## Updating the tracker

After each item, edit `BUGS-AND-TASKS.md` so it stays internally consistent:

- Set the item's **Status** in its index table AND its detail section to `done`.
- Move it from the active index to the **Completed** index/section (e.g. Active Bug Index → Completed Bug Index; Pending Tasks Index → Completed Tasks).
- If a `POT-xxx` in **Potential Bug Backlog** maps to the item (`Related item` column), update its status (e.g. `potential_done`).
- Recompute the **Progress tracker** counts, the priority breakdown, the `X% resolved` bar, and the `**Open:** / In progress: / Done:` line near the top.
- Refresh `**Last updated:**`.
- Append a row to the **Resolution log** with the ID, what changed, and the commit/PR if any.

## Completion criteria

- [ ] Every `open`/`in_progress`/`blocked` item is now `done` or justified `wont_fix`
- [ ] Each feature/fix is verified (builds, lints, runs/tests pass)
- [ ] Index tables, tracker counts, progress bar, and `Last updated` all reflect reality
- [ ] Resolution log has an entry per resolved item

## Context / memory notes

- Treat `BUGS-AND-TASKS.md` as durable memory — re-read it to resume; don't re-scan the whole repo.
- Read each item's detail section for scope before coding; read targeted files/line ranges, not whole files.
- Prefer scoped checks over full rebuilds each cycle.
- Follow the workspace rules (Expo/TS, React Native icons) for any UI you build.
