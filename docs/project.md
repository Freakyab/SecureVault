# SecureVault Project Documentation

SecureVault is a premium, security-focused mobile password manager built with Expo (React Native). It prioritizes a high-end "Fold-style" user experience, combined with robust local encryption to ensure user data remains private and secure.

## 🎯 Vision & Goals
A mobile password manager that balances uncompromising security with a delightful, premium UI.
- **Secure Storage:** Local-first encrypted vault using AES-GCM and PBKDF2.
- **Premium UX:** A "living" UI with physics-based animations, haptic feedback, and a clean, modern aesthetic inspired by Fold Money.
- **Password Health:** Proactive insights into password strength, reuse, and breaches.
- **Efficiency:** Fast credential generation and intuitive organization via categories.

## 🛠 Tech Stack
| Layer | Technology |
|-------|-------------|
| **Framework** | Expo SDK 54, React Native, TypeScript |
| **Routing** | `expo-router` (File-based) |
| **Styling** | `StyleSheet` + Custom Design Token System |
| **Icons** | `lucide-react-native` |
| **Security** | `expo-secure-store`, `expo-crypto`, `@noble/ciphers`, `@noble/hashes` |
| **Validation** | `zod` |
| **Backend (Optional)** | Express + MongoDB + Mongoose |
| **Data Fetching** | `@tanstack/react-query` (planned for sync) |

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
    - ✅ Initial migration to Premium UI (Phase 6) in progress.
- **Current Focus:** Completing the UI Kit and migrating remaining screens to the premium design tokens.

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
