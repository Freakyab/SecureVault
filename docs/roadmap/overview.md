# SecureVault — Development Roadmap Overview

Track progress for building the **SecureVault** password manager as an **Expo (React Native)** app, using the UI/UX in the [`screenshots/`](../screenshots) folder as the design reference.

**Last updated:** 2026-06-14 (TASK-047 / Roadmap 2.6 read-only entry detail completed)  
**Overall status:** 🟡 In progress — **61%** project-wide (entry detail now defaults to read-only view mode)

## Overall progress tracker

Counts every `- [ ]` / `- [x]` task in the phase files.

### Project-wide (Phases 0–10)

| Metric | Value |
|--------|-------|
| Tasks completed | **103** / **167** |
| **Overall progress** | **62%** |

```
[████████████░░░░░░░░] 62%
```

| Phase | Done | Total | Progress | Status |
|-------|------|-------|----------|--------|
| [0 — Foundation](./phase-0.md) | 24 | 24 | 100% | ✅ |
| [1 — Design system & shell](./phase-1.md) | 11 | 11 | 100% | ✅ |
| [2 — UI (mock data)](./phase-2.md) | 30 | 30 | 100% | ✅ |
| [3 — Local vault & security](./phase-3.md) | 22 | 22 | 100% | ✅ |
| [4 — Password health](./phase-4.md) | 10 | 10 | 100% | ✅ |
| [5 — Polish & release](./phase-5.md) | 13 | 15 | 87% | 🟡 |
| [6 — Premium UI (Fold-style)](./phase-6.md) | 7 | 22 | 32% | 🟡 |
| [7 — Modern Animation & UX](./phase-7.md) | 0 | 18 | 0% | ⬜ |
| [8 — Testing](./phase-8.md) | 0 | 1 | 0% | ⬜ |
| [9 — Backend & sync (optional)](./phase-9.md) | 0 | 10 | 0% | ⬜ |
| [10 — Maintenance](./phase-10.md) | 0 | 1 | 0% | ⬜ |
| [11 — Optional Advancement](./phase-11.md) | 0 | 1 | — | ⬜ |

### Pre-Phase 3 gate (Phases 0–2 only)

**Start Phase 3** when this reaches **100%**.

| Metric | Value |
|--------|-------|
| Tasks completed | **46** / **47** |
| **Pre-Phase 3 progress** | **98%** |

```
[████████████████████] 98%
```

---

## Vision

A mobile password manager that lets users:
- Store and organize credentials by category
- Generate strong passwords with configurable rules
- See password health (strength, reuse, breaches)
- Keep data secure with local encryption (and optional cloud sync later)

## Design reference

| Source | Purpose |
|--------|---------|
| [`screenshots/`](../screenshots) | Screen layouts, colors, typography, component patterns |

### Fold-style design tokens (Phase 6)
Premium "Fold Money"–inspired token set used to feed the theme system. Brand accent stays the SecureVault purple (`#5F61F6`).

**Neutral palette**
- Background: `#F7F8FA`
- Surface: `#FFFFFF`
- Surface alt: `#F1F3F5`
- Border: `#E9ECEF`
- Primary text: `#121212`
- Secondary text: `#6C757D`
- Muted text: `#ADB5BD`

**Semantic colors**
- Primary accent: Brand (`#5F61F6`)
- Success: `#2ECC71`
- Warning: `#F4B400`
- Error: `#FF4D4F`
- Info: `#4A90E2`

**Spacing (8-pt)**: `xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32 · xxxl 48`.
**Radius**: `chip 12 · button 16 · card 20 · sheet 24 · floating 28`.
**Typography**: Display 32/Bold · Heading 24/SemiBold · Title 20/SemiBold · Body 16/Regular · Caption 13/Medium · Label 11/Medium.
**Motion durations**: tap 120 · button 180 · card expand 250 · navigation 300 · modal 350 (ms).

---

## Tech stack (target)

| Layer | Choice |
|-------|--------|
| App | Expo SDK 54, React Native, TypeScript |
| Routing | expo-router (file-based) |
| Styling | `StyleSheet` + `constants/securevault-theme.ts` |
| Icons | `lucide-react-native` |
| Dark mode | System-driven |
| Local secrets | expo-secure-store, expo-crypto |
| Validation | zod |
| API (later) | Express + MongoDB + Mongoose |
| Data fetching (later) | @tanstack/react-query |

## Target architecture

```
app/
  _layout.tsx                 # Root: fonts, theme, auth gate
  (auth)/
    onboarding.tsx
    login.tsx                 # optional in v1
  (tabs)/
    _layout.tsx               # Custom pill tab bar
    index.tsx                 # Dashboard
    vault.tsx
    generator.tsx
    health.tsx
  entry/
    [id].tsx                  # View / edit credential
  modal.tsx                   # Reuse or replace as needed

constants/
  securevault-theme.ts        # Design tokens

components/
  ui/                         # Button, Card, Input, Badge, Progress…
  vault/                      # List rows, chips, health widgets
  navigation/
    pill-tab-bar.tsx

services/                     # Phase 3+
  crypto/
  vault-storage/
  password-generator/
  health-checks/

hooks/
contexts/                     # Auth, vault (Phase 3+)
```
