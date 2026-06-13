---
name: figma-to-react-native
description: >-
  Autonomously translate a Figma design into a React Native (Expo + TypeScript)
  app by mapping every frame, extracting design tokens, reusing existing
  components, and building screens until 100% of the design is implemented and
  visually verified. Use when the user provides a Figma URL or asks to convert,
  implement, or build a Figma design in React Native / Expo.
---

# Figma → React Native (Expo) Autonomous Builder

## Purpose

Translate a Figma design into a React Native (Expo + TypeScript) application using reusable components, existing project architecture, centralized design tokens, and continuous implementation until **100% of the Figma design has been built and verified**.

---

# Inputs

The user provides a Figma URL.

Example:

```text
https://figma.com/design/:fileKey/:name?node-id=1-2
```

Extract:

* `fileKey` from the URL
* `nodeId` from the `node-id` parameter

Convert:

```text
0-1 → 0:1
```

If no `node-id` exists:

* Ask the user for a node-specific Figma URL.
* Do not proceed until a valid node is supplied.

---

# Continuous Execution Rule

The agent must continue executing until:

* Every Figma frame has been implemented.
* Every reusable component has been created or updated.
* Navigation has been wired.
* Visual verification is completed.
* No unchecked item remains in the progress checklist.

Never stop after generating a single screen.

---

# Progress Checklist

```text
Figma → RN Progress

- [ ] 1. Parse Figma URL
- [ ] 2. Map all pages and frames
- [ ] 3. Extract design tokens
- [ ] 4. Scan existing codebase
- [ ] 5. Discover reusable components
- [ ] 6. Build/update shared components
- [ ] 7. Build all screens
- [ ] 8. Wire navigation
- [ ] 9. Verify visually against Figma
- [ ] 10. Refactor duplicate UI
- [ ] 11. Final optimization pass
```

Additionally maintain:

```text
Frames Progress

- [ ] Frame 1
- [ ] Frame 2
- [ ] Frame 3
...
```

The task is complete only when all checkboxes are checked.

---

# Step 1 — Map the Design

Call:

```text
get_metadata(fileKey)
```

Enumerate:

* Pages
* Top-level frames
* Components
* Component sets
* Variants

Then call:

```text
get_metadata(nodeId)
```

for every frame discovered.

Build:

```text
screens[]
components[]
tokens[]
```

This list becomes the source of truth for completion.

---

# Step 2 — Extract Design Tokens

Call:

```text
get_variable_defs
```

Extract:

* Colors
* Typography
* Font weights
* Font sizes
* Border radius
* Shadows
* Opacity
* Spacing
* Elevation

Generate:

```text
theme/tokens.ts
```

Never hardcode:

* Hex values
* Font sizes
* Margins
* Padding
* Radius values

Always consume theme tokens.

---

# Step 3 — Analyze Existing Codebase First

Before generating any code:

Recursively scan:

```text
app/
src/
components/
ui/
shared/
features/
screens/
```

Search for:

* Existing buttons
* Existing cards
* Existing inputs
* Existing headers
* Existing avatars
* Existing list items
* Existing modals
* Existing navigation components

For every Figma component:

### If an existing component exists

Reuse it.

Update it if necessary.

Do not create duplicates.

### If no component exists

Create a new reusable component.

Priority:

```text
Reuse Existing Component
        ↓
Modify Existing Component
        ↓
Create New Component
```

---

# Step 4 — Build Shared Component Library

Before screens, build reusable primitives.

Examples:

```text
Button
Input
Card
Header
Avatar
SearchBar
TabBar
BottomSheet
Badge
Chip
ListItem
ProfileCard
```

Rules:

* One component per file.
* Functional components only.
* TypeScript only.
* Interface-based props.
* Reusable and configurable.
* Theme driven.

Never create screen-specific duplicate components.

---

# Step 5 — Build Each Screen

For every frame:

Call:

```text
get_design_context
```

Parameters:

```text
fileKey
nodeId
clientFrameworks="react"
clientLanguages="typescript"
```

Treat returned code as:

```text
Reference Only
```

Convert into:

```text
React Native + Expo
```

Compose using:

```text
Shared Components
```

not raw duplicated UI.

---

# Step 6 — Navigation

Detect flow from Figma.

Use existing project navigation.

Examples:

```text
expo-router
@react-navigation/native
```

Create routes only if missing.

Maintain existing navigation patterns.

---

# Step 7 — Visual Verification

Call:

```text
get_screenshot
```

for every frame.

Compare:

* Alignment
* Typography
* Colors
* Spacing
* Sizing
* Radius
* Shadows

Adjust until visually matched.

Only then mark frame complete.

---

# Step 8 — Refactor Loop

After each screen:

Search for repeated UI.

If repeated:

```text
Extract Component
Replace Duplicates
Reuse Shared Component
```

Example:

If 5 screens contain the same card:

```text
Create components/Card.tsx
Replace all implementations
```

---

# Step 9 — Autonomous Completion Loop

Continue executing:

```typescript
while (
  unbuiltFrames.length > 0 ||
  unbuiltComponents.length > 0
) {
  scanExistingCodebase();

  discoverReusableComponents();

  buildOrUpdateComponents();

  buildNextScreen();

  verifyAgainstFigma();

  refactorDuplicates();

  updateProgress();
}
```

The agent must never stop after a single screen.

Continue until:

```text
unbuiltFrames.length === 0
AND
unbuiltComponents.length === 0
```

---

# React Native Adaptation Rules

| Web    | React Native    |
| ------ | --------------- |
| div    | View            |
| span   | Text            |
| img    | Image           |
| button | Pressable       |
| CSS    | StyleSheet      |
| Grid   | Flexbox         |
| px     | Unitless values |

Requirements:

* SafeAreaView for all screens.
* Expo compatible code only.
* TypeScript only.
* Functional components only.
* Accessibility labels on Pressables.
* Use existing icon library.

---

# Folder Structure

```text
app/

components/
  Button/
  Input/
  Card/
  Header/
  Avatar/

screens/

navigation/

theme/
  tokens.ts

hooks/

utils/
```

Follow existing project conventions before introducing new folders.

---

# MCP Tool Usage

### Design Mapping

```text
get_metadata
```

### Design Tokens

```text
get_variable_defs
```

### Screen Context

```text
get_design_context
```

### Verification

```text
get_screenshot
```

### Design System Search

```text
search_design_system
```

Always read tool descriptors before use.

Never guess node IDs.

Always use actual IDs returned by Figma.

---

# Completion Criteria

The task is complete only when:

* ✅ Every Figma frame is implemented.
* ✅ Every reusable component is built or updated.
* ✅ Existing project components have been reused whenever possible.
* ✅ Navigation is connected.
* ✅ Theme tokens are centralized.
* ✅ Visual verification is completed.
* ✅ Duplicate UI has been refactored.
* ✅ No unchecked item remains in the progress checklist.

## Core Workflow

```text
Parse Figma
    ↓
Map All Frames
    ↓
Extract Tokens
    ↓
Scan Existing Codebase
    ↓
Reuse Existing Components
    ↓
Create Missing Components
    ↓
Build Screen
    ↓
Verify Against Screenshot
    ↓
Refactor Duplicates
    ↓
Repeat Until No Frames Remain
```

**Golden Rule:** Never generate a screen in isolation. Always inspect the existing project first, reuse components whenever possible, and continue building until the entire Figma design has been implemented.
