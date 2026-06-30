# SecureVault — Development Roadmap

**Last updated:** 2026-06-14  
**Overall status:** 🟡 In progress — **62%** project-wide

---

## Vision

A mobile password manager that lets users:

- Store and organize credentials by category
- Generate strong passwords with configurable rules
- See password health (strength, reuse, breaches)
- Keep data secure with local encryption (and optional cloud sync later)

## Design reference

| Source                           | Purpose                                                |
| -------------------------------- | ------------------------------------------------------ |
| [`screenshots/`](../screenshots) | Screen layouts, colors, typography, component patterns |

---

## Tech stack (target)

| Layer                 | Choice                                          |
| --------------------- | ----------------------------------------------- |
| App                   | Expo SDK 54, React Native, TypeScript           |
| Routing               | expo-router (file-based)                        |
| Styling               | `StyleSheet` + `constants/securevault-theme.ts` |
| Icons                 | `lucide-react-native`                           |
| Dark mode             | System-driven                                   |
| Local secrets         | expo-secure-store, expo-crypto                  |
| Validation            | zod                                             |
| API (later)           | Express + MongoDB + Mongoose                    |
| Data fetching (later) | @tanstack/react-query                           |

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

---

## Overall progress tracker

Counts every `- [ ]` / `- [x]` task in the phase sections below.

### Project-wide (Phases 0–10)

| Metric               | Value             |
| -------------------- | ----------------- |
| Tasks completed      | **103** / **167** |
| **Overall progress** | **62%**           |

```
[████████████░░░░░░░░] 62%
```

| Phase                                                                   | Done | Total | Progress | Status |
| ----------------------------------------------------------------------- | ---- | ----- | -------- | ------ |
| [0 — Foundation](#phase-0--foundation)                                  | 24   | 24    | 100%     | ✅     |
| [1 — Design system & shell](#phase-1--design-system--app-shell)         | 11   | 11    | 100%     | ✅     |
| [2 — UI (mock data)](#phase-2--ui-screens-mock-data)                    | 30   | 30    | 100%     | ✅     |
| [3 — Local vault & security](#phase-3--local-vault--security)           | 22   | 22    | 100%     | ✅     |
| [4 — Password health](#phase-4--password-health)                        | 10   | 10    | 100%     | ✅     |
| [5 — Polish & release](#phase-5--polish--release-prep)                  | 13   | 15    | 87%      | 🟡     |
| [6 — Premium UI (Fold-style)](#phase-6--premium-ui-overhaul-fold-style) | 7    | 22    | 32%      | 🟡     |
| [7 — Modern Animation & UX](#phase-7--modern-animation--ux)             | 0    | 18    | 0%       | ⬜     |
| [8 — Testing](#phase-8--testing)                                        | 0    | 1     | 0%       | ⬜     |
| [9 — Backend & sync (optional)](#phase-9--backend--sync-optional)       | 0    | 10    | 0%       | ⬜     |
| [10 — Maintenance](#phase-10--maintenance)                              | 0    | 1     | 0%       | ⬜     |
| [11 — Optional Advancement](#phase-11--optional-advancement)            | 0    | 1     | —        | ⬜     |

### Pre-Phase 3 gate (Phases 0–2 only)

**Start Phase 3** when this reaches **100%**.

| Metric                   | Value           |
| ------------------------ | --------------- |
| Tasks completed          | **46** / **47** |
| **Pre-Phase 3 progress** | **98%**         |

```
[████████████████████] 98%
```

---

## Milestones

| Milestone             | Phases | User-visible outcome                             |
| --------------------- | ------ | ------------------------------------------------ |
| **M0 — Kickoff**      | 0      | Scope and stack decided                          |
| **M1 — Walkable UI**  | 1–2    | Full app navigable with mock data                |
| **M2 — Private beta** | 3–4    | Real vault, generator, health offline            |
| **M3 — Store beta**   | 5      | Polished build on TestFlight / internal track    |
| **M4 — Cloud**        | 9      | Account + sync (if in scope)                     |
| **M5 — Premium UI**   | 6      | Calm, responsive, Fold-style premium experience  |
| **M6 — Living UI**    | 7      | Gesture-driven, physics-based, delightful motion |

---

## Decisions & Risks

### Open decisions

| #   | Decision         | Options                                  | Chosen                          | Date       |
| --- | ---------------- | ---------------------------------------- | ------------------------------- | ---------- |
| D1  | v1 storage model | Offline only / Cloud day one             | **Offline only**                | 2026-05-16 |
| D2  | Unlock method    | Master password / Biometrics / Both      | **Master password**             | 2026-05-16 |
| D5  | State management | Context + useReducer / Zustand           | **React Context**               | 2026-05-16 |
| D3  | Styling          | NativeWind / StyleSheet                  | **StyleSheet**                  | 2026-05-16 |
| D4  | Icons            | lucide-react-native / @expo/vector-icons | **lucide-react-native**         | 2026-05-16 |
| D7  | Dark mode timing | Phase 1 with UI / Phase 5 later          | **Phase 1 with UI**             | 2026-05-16 |
| D6  | Breach API in v1 | Yes / No                                 | **Yes — HIBP k-anonymity only** | 2026-06-13 |

### Risks & mitigations

| Risk                     | Impact                | Mitigation                                              |
| ------------------------ | --------------------- | ------------------------------------------------------- |
| Weak custom crypto       | Critical              | Use well-reviewed libraries; security review in Phase 5 |
| Scope creep (sync early) | Delays MVP            | Ship Phases 1–5 offline-first; Phase 9 optional         |
| Expo Go limitations      | Blocks native modules | Plan EAS dev build before Phase 3                       |
| Prototype ≠ mobile UX    | Rework                | Skip DeviceFrame; use native patterns from Phase 1      |

---

## Fold-style design tokens (Phase 6)

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

# Phase 0 — Foundation

**Goal:** Align on scope and prepare the codebase before UI work.

### Tasks

- [x] **0.1** Confirm product scope for v1 → **offline-only** for v1
- [x] **0.2** Choose styling approach → **StyleSheet + `securevault-theme.ts`**
- [x] **0.3** Choose icon library → **lucide-react-native**
- [x] **0.4** Use the `screenshots/` folder as the read-only design reference
- [x] **0.5** Document v1 feature list (must-have vs nice-to-have)
- [x] **0.6** Set up branch strategy / issue labels if using GitHub

### v1 feature checklist

**Must-have**

- [x] Onboarding (first launch) — UI + persist flag
- [x] Dashboard with category summary — mock data
- [x] Vault list + search + category filters — mock data
- [x] Add / edit / delete credential
- [x] Password generator + save to vault _(Generator tab + Add Credential prefill)_
- [x] Basic health score (weak + reused passwords)
- [x] Local encrypted storage (AES-GCM + PBKDF2, AsyncStorage + SecureStore)
- [x] Master password (setup + unlock screens; biometrics deferred)

**Website branding & credential preview (v1.1)**

- [x] **W.1** `website` field on credential + optional URL for domain
- [x] **W.2** Favicon/logo in avatar via Google favicon API
- [x] **W.3** Quick-pick chips for popular sites on entry form
- [x] **W.4** Live **vault preview** before save on entry screen
- [x] **W.5** Vault / Home / Health lists use `CredentialListItem`
- [x] **W.6** Migrate older vault entries (`title` → `website` on unlock)
- [x] **W.7** Cache logos offline for faster load
- [x] **W.8** Custom logo upload per credential

**Nice-to-have (defer)**

- [x] Breach monitoring (Have I Been Pwned API)
- [x] Import / export vault
- [x] Cloud sync
- [x] Sharing credentials
- [x] Browser extension

### Definition of done

- Decisions recorded in **Open decisions** are filled in
- Team agrees on v1 scope

---

# Phase 1 — Design system & app shell

**Goal:** Replace Expo starter with SecureVault structure, theme, and navigation—screens can be placeholders.

### Tasks

- [x] **1.1** Add `constants/securevault-theme.ts` with **light + dark** palettes
- [x] **1.2** Load app fonts via `expo-font` (system sans + Playfair Display)
- [x] **1.3** Update root `app/_layout.tsx` (theme provider, fonts, splash)
- [x] **1.4** Create route groups: `(auth)`, `(tabs)` + `entry/[id]`
- [x] **1.5** Implement auth gate (onboarding flag in `expo-secure-store`)
- [x] **1.6** Build custom **pill tab bar**
- [x] **1.7** Wire tab routes: Home, Vault, Generator, Health, Settings
- [x] **1.8** Create shared UI primitives: `Button`, `Card`, `Input`, `Badge`, `Progress`, `Screen`
- [x] **1.9** Remove default Expo Explore tab
- [x] **1.10** Configure status bar / safe areas
- [x] **1.11** `SecureVaultThemeProvider` — all screens use `useSecureVaultTheme()`

### Definition of done

- App launches into onboarding or tabs based on auth state
- All five main areas are reachable via navigation
- Theme matches prototype purple palette on all shells

---

# Phase 2 — UI screens (mock data)

**Goal:** Pixel-close layouts using static data—no real vault yet.

### 2.1 Onboarding

- [x] Hero illustration / image area
- [x] Title, subtitle, step indicator dots
- [x] Primary CTA ("Get started" / multi-step)
- [x] Persist "onboarding complete" on CTA

### 2.2 Dashboard (Home)

- [x] Header with greeting / user area
- [x] Category stat cards (6 categories, theme-aware tints)
- [x] "Manage password" + Recently Used sections
- [x] Floating pill tab bar integrated with tabs layout

### 2.3 Vault

- [x] "My Vault" header + shield branding
- [x] Search input (UI only)
- [x] Category chips: All, Social, Mail, Design, Finance
- [x] Credential list rows (title, username, category, icon)
- [x] Security alerts section (compromised, reused)
- [x] "Import vault" entry point (UI stub)
- [x] Empty state when no items

### 2.4 Generator

- [x] Generated password display + copy button
- [x] Length slider
- [x] Toggles: uppercase, lowercase, numbers, symbols
- [x] Strength meter (weak → strong) with shield icon states
- [x] Regenerate control
- [x] "Save secure password" CTA (wired to vault)

### 2.5 Health

- [x] "Password Health" header
- [x] Health score ring or large score display
- [x] Breakdown cards: Safe, Reused, Weak, Old + Breach Monitor
- [x] Recommendations list
- [x] Actionable list linking to affected entries

### 2.6 Entry detail

- [x] View mode: site, username, password (masked), notes, category — **read-only detail view**
- [x] Edit mode with form validation (UI)
- [x] Show / hide password, copy actions
- [x] Delete with confirmation dialog

### Definition of done

- Every screen in the prototype has a React Native equivalent
- Mock data lives in `constants/mock-data.ts` or similar
- No crashes on iOS and Android

---

# Phase 3 — Local vault & security

**Goal:** Real data persistence and cryptography—app is usable offline.

### Data model

- [x] **3.1** Define `Credential` type
- [x] **3.2** Define categories enum/map
- [x] **3.3** Vault metadata (version in blob; `lastUnlockedAt` on setup/unlock)

### Storage & crypto

- [x] **3.4** Master password flow (`setup-master-password`, `unlock`)
- [x] **3.5** Key derivation (PBKDF2-SHA256, 120k iterations)
- [x] **3.6** Encrypt vault blob at rest (AES-GCM)
- [x] **3.7** Store encrypted blob + salt (AsyncStorage + SecureStore)
- [x] **3.8** In-memory decrypted cache only while app is unlocked
- [x] **3.9** Auto-lock after 5 min backgrounding (configurable)

### CRUD & generator

- [x] **3.10** `VaultContext` for credentials
- [x] **3.11** Create, read, update, delete credentials
- [x] **3.12** Wire Vault screen to real list + search
- [x] **3.13** Wire category chips to filter state
- [x] **3.14** Implement password generator service
- [x] **3.15** Save generated password to new or existing entry
- [x] **3.16** Wire Dashboard counts from real data
- [x] **3.19** Support multiple credentials for the same account/site
- [x] **3.21** Advanced search by website, URL/domain, username, notes, category, and account label
- [x] **3.22** Credential password history for tracking previous passwords per account
- [x] **3.23** Favorite/archive account organization with dedicated My Space view

### Quality

- [x] **3.17** Unit tests for generator and crypto helpers
- [x] **3.18** Error handling: wrong master password, corrupt vault, storage full

### Definition of done

- User can unlock vault, add credentials, see them on Dashboard and Vault
- Data survives app restart (encrypted)
- Generator produces passwords matching selected rules

---

# Phase 4 — Password health

**Goal:** Meaningful health score and actionable insights.

### Tasks

- [x] **4.1** Password strength algorithm
- [x] **4.2** Detect reused passwords (in-memory compare while unlocked)
- [x] **4.3** Flag weak passwords below threshold
- [x] **4.4** Password age / "old password" warnings with optional user notifications
- [x] **4.5** Compute overall health score (0–100)
- [x] **4.6** Wire Health screen to live metrics
- [x] **4.7** Tap health issue → navigate to affected credential
- [x] **4.8** Show inline warnings on Vault rows (reused, weak)
- [x] **4.9** Stronger duplicate-password warnings with grouped affected accounts

### Future (Phase 4+)

- [x] Breach check via HIBP k-anonymity API (network, privacy review)

### Definition of done

- Health score updates when vault changes
- User can fix issues from health list via entry screen

---

# Phase 5 — Polish & release prep

**Goal:** Production-quality UX and store readiness.

### UX & accessibility

- [x] **5.2** Haptic feedback on copy, save, delete
- [x] **5.3** Loading and skeleton states
- [x] **5.4** Toast / snackbar for copy confirmation and errors
- [x] **5.5** Accessibility labels, contrast checks, dynamic type
- [x] **5.6** Empty states and onboarding skip / logout flows
- [x] **5.17** Settings page: change master password, disable biometrics, reset local data, app theme, auto-lock timeout

### Security hardening

- [x] **5.7** Screenshot / screen capture policy (`expo-screen-capture`)
- [x] **5.8** Clipboard auto-clear for copied passwords
- [x] **5.9** Security review checklist completed
- [x] **5.18** App lock controls: manual lock button and configurable auto-lock timeout

### Import / export (optional for v1)

- [x] **5.10** Export encrypted backup file
- [x] **5.11** Import from CSV or encrypted backup
- [x] **5.19** Import from **Google Password Manager** exported CSV

### Release

- [ ] **5.12** App icon, splash screen, store screenshots
- [x] **5.14** EAS Build profiles (development, preview, production)

### Definition of done

- App passes internal QA on physical devices
- Ready for beta distribution via EAS

---

# Phase 6 — Premium UI overhaul (Fold-style)

**Goal:** Upgrade the existing app into a calm, responsive, premium experience inspired by Fold Money. Adopt a centralized design-token system, a reusable UI kit, and a Reanimated-based motion + haptics layer.

**Core principle:** A premium app is defined by how effortlessly the user moves through it — prefer simplicity over complexity, consistency over novelty, smoothness over speed, clarity over decoration. All animations < 350ms.

### 6.1 Foundation — design tokens & theme

- [x] **6.1** Build the design-token system under `theme/`
- [x] **6.2** 8-point spacing scale and radius scale
- [x] **6.3** Typography scale
- [x] **6.4** `useTheme` and `useHaptics` hooks

### 6.2 Core components (reusable UI kit)

- [ ] **6.5** `Button`
- [ ] **6.6** `Card` + `GlassCard`
- [ ] **6.7** `Input`
- [ ] **6.8** `Avatar`
- [ ] **6.9** `AnimatedNumber`
- [ ] **6.10** `BottomSheet`
- [ ] **6.11** `SectionHeader`
- [ ] **6.12** `SkeletonLoader`

### 6.3 Motion design system

- [x] **6.13** Centralized animation durations in `theme/animations.ts`
- [ ] **6.14** Reanimated micro-interactions (button press, card fade+slide-up, list stagger)
- [x] **6.15** Haptic feedback map
- [ ] **6.16** Skeleton → fade-in loading transitions

### 6.4 Navigation experience

- [ ] **6.17** Floating rounded bottom navigation
- [ ] **6.18** Sticky headers that collapse slightly on scroll
- [ ] **6.19** Fade + slide screen transitions with shared visual continuity

### 6.5 Screen migration & polish

- [x] **6.20** Migrate screens one at a time to card-based layout + design tokens
- [ ] **6.21** Background & depth pass: soft neutral background, subtle hero gradients
- [ ] **6.22** Final UI consistency audit + animation-timing fine-tune

### Suggested libraries

- Animation: `react-native-reanimated`, `react-native-gesture-handler`, `moti`
- Visual effects: `expo-blur`, `expo-linear-gradient`
- UI / sheets: `@gorhom/bottom-sheet`, `react-native-svg`, `lucide-react-native`
- Interaction: `expo-haptics`

### Definition of done

- All buttons, cards, and inputs use shared UI-kit components and design tokens.
- Every interactive element gives immediate feedback (animation + haptic); animations < 350ms.
- Loading uses skeletons/shimmer with fade-in; no spinners or blank screens.
- Bottom nav, headers, and screen transitions follow the navigation experience spec.
- Design QA checklist passes for each migrated screen.

---

# Phase 7 — Modern Animation & UX

**Goal:** Take the app from "polished" to "alive" using advanced, gesture-driven, physics-based motion and micro-interactions.

**Core principles**

- **Gesture-first:** prefer interruptible, gesture-driven motion over tap-then-wait animations.
- **Physics over timers:** use spring/decay physics for finger-touch interactions.
- **Purposeful delight:** animation must communicate state, hierarchy, or spatial continuity.
- **Accessible by default:** every animation has a reduced-motion variant.
- **Always 60fps:** all animation runs on the UI thread (Reanimated worklets).

### 7.1 Gesture-driven interactions

- [ ] **7.1** Swipe-to-action vault rows (reveal copy / edit / delete)
- [ ] **7.2** Long-press → context menu + drag-to-reorder favorites
- [ ] **7.3** Custom branded pull-to-refresh
- [ ] **7.4** Velocity-aware bottom sheet gestures

### 7.2 Shared element & screen transitions

- [ ] **7.5** Shared-element transition: vault row → entry detail
- [ ] **7.6** Scroll-driven collapsing headers with parallax hero
- [ ] **7.7** Spatial continuity between Dashboard and Health

### 7.3 Delight & feedback animations

- [ ] **7.8** Lottie / Reanimated success states
- [ ] **7.9** Animated empty-state illustrations
- [ ] **7.10** Generator strength meter: spring fill + color interpolation
- [ ] **7.11** Health score ring draw-on animation synced with count-up
- [ ] **7.12** Subtle celebratory moment on health-score milestone

### 7.4 Continuous & ambient motion

- [ ] **7.13** Perf-budgeted animated gradient / glow backdrops
- [ ] **7.14** Shimmer skeleton → content morph
- [ ] **7.15** Spring-animated tab bar

### 7.5 Accessibility & performance

- [ ] **7.16** Respect `useReducedMotion()`
- [ ] **7.17** 60fps budget: worklet-driven UI-thread animation
- [ ] **7.18** Motion consistency audit via `theme/animations.ts`

### Suggested libraries

- Gestures & physics: `react-native-gesture-handler`, `react-native-reanimated`
- Shared transitions: Reanimated shared element transitions / `expo-router` transitions
- Vector / Lottie: `lottie-react-native`, `react-native-svg`
- Sheets: `@gorhom/bottom-sheet`
- Effects: `expo-blur`, `expo-linear-gradient`
- Feedback: `expo-haptics`

### Definition of done

- Core lists and sheets are gesture-driven with spring physics and haptic detents.
- Navigating into and out of an entry uses a shared-element / spatial-continuity transition.
- Success, loading, and empty states use purposeful animation instead of static UI.
- Every animation has a verified reduced-motion variant.
- All animations hold 60fps on a mid-range device.

---

# Phase 8 — Testing

**Goal:** Validate the app with real users on real hardware before public launch.

### Beta distribution

- [ ] **8.1** TestFlight / internal testing track: upload a production build to App Store Connect / Play Console and invite testers.

### Definition of done

- A beta build is installable by invited testers on iOS and/or Android, with a feedback loop in place.

---

# Phase 9 — Backend & sync (optional)

**Goal:** Multi-device vault and user accounts.

### Backend (Express + MongoDB)

- [ ] **9.1** API folder structure per `backend-mongodb.mdc` rules
- [ ] **9.2** User registration / login
- [ ] **9.3** Store **encrypted** vault blob server-side
- [ ] **9.4** Sync conflict strategy (last-write-wins vs merge)
- [ ] **9.5** Rate limiting, HTTPS, input validation (zod)

### Mobile integration

- [ ] **9.6** Auth screens wired to API
- [ ] **9.7** react-query for sync status and background refresh
- [ ] **9.8** Offline queue for changes
- [ ] **9.9** Secondary "Log in" link on onboarding
- [ ] **9.10** AI-assisted folders/tags for vault organization

### Definition of done

- User can sign in on two devices and see the same vault.

---

# Phase 10 — Maintenance

**Goal:** Ongoing legal, compliance, and upkeep work.

### Legal & compliance

- [ ] **10.1** Privacy policy & terms: write a Privacy Policy and Terms of Service, host at a public URL, and link in-app.

### Definition of done

- Legal documents are published, linked, and kept current with each release.

---

# Phase 11 — Optional Advancement

**Goal:** Nice-to-have, go-to-market, and growth work. (Excluded from overall progress calculations).

### Store presence & growth

- [ ] **11.1** Play Store / App Store listing copy: app name, descriptions, keywords, and polished store screenshots.

### Definition of done

- Optional items are shipped as capacity allows; none block the core release.
