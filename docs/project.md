# SecureVault Project Documentation

SecureVault is a premium, security-focused mobile password manager built with Expo (React Native). It prioritizes a high-end "Fold-style" user experience, combined with robust local encryption to ensure user data remains private and secure.

## 🎯 Vision & Goals

A mobile password manager that balances uncompromising security with a delightful, premium UI.

- **Secure Storage:** Local-first encrypted vault using AES-GCM and PBKDF2.
- **Premium UX:** A "living" UI with physics-based animations, haptic feedback, and a clean, modern aesthetic inspired by Fold Money.
- **Password Health:** Proactive insights into password strength, reuse, and breaches.
- **Efficiency:** Fast credential generation and intuitive organization via categories.

## 🛠 Tech Stack

| Layer                  | Technology                                                            |
| ---------------------- | --------------------------------------------------------------------- |
| **Framework**          | Expo SDK 54, React Native, TypeScript                                 |
| **Routing**            | `expo-router` (File-based)                                            |
| **Styling**            | `StyleSheet` + Custom Design Token System                             |
| **Icons**              | `lucide-react-native`                                                 |
| **Security**           | `expo-secure-store`, `expo-crypto`, `@noble/ciphers`, `@noble/hashes` |
| **Validation**         | `zod`                                                                 |
| **Backend (Optional)** | Express + MongoDB + Mongoose                                          |
| **Data Fetching**      | `@tanstack/react-query` (planned for sync)                            |

## 🏗 Architecture

### Directory Structure

- `app/`: Route groups for `(auth)`, `(tabs)`, and dynamic `entry/[id]` screens.
- `components/`: Split into `ui/` (primitives), `vault/` (domain-specific), and `navigation/`.
- `services/`: Logic for `crypto`, `vault-storage`, `password-generator`, and `health-checks`.
- `theme/`: Centralized design tokens (spacing, radius, typography, animations).
- `hooks/` & `contexts/`: State management for auth and the decrypted vault cache.

## 🎨 Design System (Fold-Style)

The app follows a premium design language:

- **Palette:** Brand Purple (`#5F61F6`) as the primary accent, with a soft neutral background (`#F7F8FA`).
- **Layout:** Managed via `spacing.ts`, `radius.ts`, and `typography.ts` (8-pt scale, large border radii).
- **Motion:** All animations < 350ms, utilizing `react-native-reanimated` and `animations.ts` for 60fps UI-thread performance.
- **Feedback:** Integrated haptic feedback map for every key interaction.

## 📈 Current Status

- **Overall Progress:** ~62%
- **Key Accomplishments:**
  - ✅ Foundation & Design System established.
  - ✅ Fully functional Local Vault with AES-GCM encryption.
  - ✅ Password Generator & Health Monitoring implemented.
  - ✅ Phase 6 Premium UI Foundation complete (design tokens, spacing/radius/typography scales, `useTheme` and `useHaptics` hooks, centralized `theme/animations.ts`).
  - ✅ 10 screen migrations to Phase 6 tokens/hooks: Onboarding, Setup Master Password, Unlock Vault, Main Vault (incl. shared vault components), My Vault, Generator, Password Health, Settings, Add Credential, Entry Detail / Edit Credential.
  - ✅ Haptic feedback system integrated (`useHaptics()` replacing legacy helpers across migrated screens).
- **Current Focus:** Completing remaining Phase 6 UI kit components, Phase 6 & 7 animations, and Phase 5 release items.

## 🗺 Roadmap Summary

- **M1 (Walkable UI):** Completed.
- **M2 (Private Beta):** Completed (Local vault & security).
- **M3 (Store Beta):** In Progress (Polish & Release prep).
- **M4 (Cloud):** Optional/Deferred (Backend & Sync).
- **M5 (Premium UI):** Active (Fold-style overhaul).
- **M6 (Living UI):** Planned (Advanced gesture-driven motion).

## ⚖️ Critical Decisions

- **Storage:** Offline-only for v1 to maximize privacy and speed.
- **Unlock:** Master password as primary gate; biometrics as secondary.
- **State:** React Context for vault management.
- **Styling:** Native `StyleSheet` for maximum performance and control.

## 🚧 Open Work & Pending

### Active Bugs (16)

Refer to [`Mds/BUGS.md`](../Mds/BUGS.md) and individual files in [`docs/bug/`](../docs/bug/).

| ID      | Title                                                              | Priority |
| ------- | ------------------------------------------------------------------ | -------- |
| BUG-022 | Export backup is plaintext and uses the non-clearing clipboard     | P1       |
| BUG-024 | "Quick Fix All" button in Password Health is a no-op               | P1       |
| BUG-027 | Generated passwords don't guarantee selected character types       | P2       |
| BUG-028 | Auto-lock "Immediately" fires during legit OS prompts              | P2       |
| BUG-029 | Credential writes use stale closures / no serialization (race)     | P2       |
| BUG-030 | Generator password copy does not auto-clear the clipboard          | P2       |
| BUG-031 | Backup import/export drops `customLogoUri`                         | P3       |
| BUG-032 | Breach result wording mixes accounts vs passwords                  | P3       |
| BUG-033 | Health stat cards can sum to more than total (weak/reused overlap) | P3       |
| BUG-034 | `autoLockLabel` has an unreachable "Never" branch                  | P3       |
| BUG-035 | Onboarding completion not persisted on web                         | P3       |
| BUG-036 | `useNavigationLock` lacks try/finally around the action            | P3       |
| BUG-037 | Edit "back" skips the read-only credential detail view             | P3       |

### Pending Tasks

| ID       | Description                                                | Phase / Area              | Priority |
| -------- | ---------------------------------------------------------- | ------------------------- | -------- |
| TASK-061 | Migrate Change Password to Phase 6 tokens/hooks            | Phase 6 — Auth            | P1       |
| TASK-062 | Swipe-to-action vault rows (copy/edit/delete)              | Phase 7 — Vault           | P2       |
| TASK-063 | Long-press context menu + drag-to-reorder favorites        | Phase 7 — Vault           | P2       |
| TASK-064 | Custom branded pull-to-refresh                             | Phase 7 — Vault/Dashboard | P2       |
| TASK-065 | Velocity-aware bottom sheet gestures                       | Phase 7 — Sheets          | P2       |
| TASK-066 | Shared-element transition: vault row → entry detail        | Phase 7 — Nav             | P2       |
| TASK-067 | Scroll-driven collapsing headers + parallax hero           | Phase 7 — Headers         | P2       |
| TASK-068 | Spatial continuity between Dashboard and Health            | Phase 7 — Nav             | P2       |
| TASK-069 | Lottie / Reanimated success states                         | Phase 7 — Feedback        | P2       |
| TASK-070 | Animated empty-state illustrations                         | Phase 7 — Empty states    | P2       |
| TASK-071 | Generator strength meter spring fill + color interpolation | Phase 7 — Generator       | P2       |
| TASK-072 | Health score ring draw-on synced with count-up             | Phase 7 — Health          | P2       |
| TASK-073 | Celebratory moment on health-score milestone               | Phase 7 — Health          | P2       |
| TASK-074 | Perf-budgeted animated gradient/glow backdrops             | Phase 7 — Ambient         | P2       |
| TASK-075 | Shimmer skeleton → content morph                           | Phase 7 — Loading         | P2       |
| TASK-076 | Spring-animated tab bar                                    | Phase 7 — Nav             | P2       |
| TASK-077 | Reduced-motion variants (`useReducedMotion`)               | Phase 7 — A11y            | P2       |
| TASK-078 | 60fps worklet budget + perf profiling                      | Phase 7 — Perf            | P2       |
| TASK-079 | Motion consistency audit via `theme/animations.ts`         | Phase 7 — QA              | P2       |

Full task definitions and acceptance criteria are available in [`docs/tasks/TASK-XXX.md`](../docs/tasks/).
