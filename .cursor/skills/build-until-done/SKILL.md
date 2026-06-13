---
name: build-until-done
description: Detect the project type, autonomously plan and build complex features, research the web for UI references, build a realistic polished UI, track progress in a markdown file, and re-run a build-verify-fix loop until the target is achieved. Use when the user names this skill and provides a project topic to build.
disable-model-invocation: true
---

# Build Until Done

Drive a project to a working, verified state. The user provides a topic; sense the stack, propose complex features yourself, research real-world UI references, build a realistic UI, record everything in a markdown plan file, and loop build-verify-fix until the target is achieved.

## Step 0: Detect Project Type (do this first)

Inspect the repo before writing code:

1. **`package.json`** — check deps + `main`/`scripts`:
   - `electron` → Electron app. Entry = `main` field. Main process + `preload.js` + renderer (`index.html` + JS). Run `npx electron .`.
   - `expo`/`react-native` → Expo/RN. `app.json`, screens under `app/`. Run `expo start`.
   - `next` → Next.js. `react`+`vite` → Vite SPA. `express`/`fastify` → Node backend.
2. **Config files** — `vite.config.*`, `next.config.*`, `app.json`, `tsconfig.json`, `Cargo.toml`, `go.mod`, `requirements.txt`.
3. **Lockfile** — pick the right package manager.

If no project exists yet, choose a stack that fits the user's topic and scaffold it. State the detected/chosen type, file layout, and run command before building.

## Step 1: Plan Features in a Markdown File

Create `PROGRESS.md` at the repo root. Autonomously break the project into up to **10 complex, end-to-end features** for the detected stack.

```markdown
# Project Progress

**Topic:** <user-provided topic>
**Stack:** <detected type>  ·  **Run:** <command>
**Target:** <one-line definition of "done">

## Features
- [ ] 1. <feature> — <what it delivers> — files: <paths>
- [ ] 2. ...

## UI References
- <source/url> — <what to borrow: layout, palette, component>

## Log
- <iteration>: <what changed, what passed/failed>
```

This file is the single source of truth and the agent's persistent memory. Update it every loop.

## Step 2: Research UI on the Web

Before building screens, look up current, real-world references so the UI feels authentic — not generic:

1. Search for modern design patterns for the app's domain and stack (e.g. "Electron desktop app dashboard UI", "<domain> app design 2026", relevant component libraries).
2. Identify a concrete design direction: layout, color palette, typography, spacing, iconography, and key components.
3. Record sources and what to borrow in the **UI References** section of `PROGRESS.md`.
4. Prefer a proven UI library/design system for the stack (e.g. a component kit + icon set) over hand-rolling everything, while keeping the look distinctive.

If web access is unavailable, fall back to a named design system instead of blocking.

## Step 3: Build a Realistic UI

- Match platform conventions for the detected stack (desktop window chrome for Electron, native patterns for Expo, web layout for Next/Vite).
- Use real layout structure: navigation, headers, content regions, empty/loading/error states.
- Use realistic placeholder content and proper assets/icons, not "lorem ipsum" boxes.
- Implement responsive behavior, hover/focus/active states, and dark mode where appropriate.
- Ensure accessibility (semantic structure, ARIA/native a11y, keyboard navigation, contrast).

## The Loop

Repeat until every feature is checked off AND the target is met:

1. **Pick** the next unchecked feature from `PROGRESS.md`.
2. **Build** it fully (logic + realistic UI per Steps 2–3) using the detected stack's files.
3. **Verify** with the stack's run/build/test command.
4. **Diagnose** failures from only the failing output and related files.
5. **Fix** with the smallest change that resolves it.
6. **Recheck**; mark the feature `[x]` only when it builds and runs.
7. **Update `PROGRESS.md`** (checkbox + Log entry), then repeat.

Stop conditions: all features checked and target met, OR the same error recurs 3 times (record the blocker in the Log and surface it to the user).

## Success Criteria

- [ ] All planned features in `PROGRESS.md` are checked off
- [ ] UI follows researched references and looks realistic/polished
- [ ] Project builds/starts with no errors
- [ ] Lints / type checks pass
- [ ] A smoke run or tests succeed

## Context / Memory Optimization

- `PROGRESS.md` is durable memory — read it to resume, don't re-scan the whole repo.
- Detect the project type once; record it and UI references in `PROGRESS.md`.
- Read targeted files/line ranges and only failing output, not full logs.
- Prefer scoped checks over full rebuilds each cycle.
