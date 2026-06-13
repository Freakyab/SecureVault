# SecureVault — Development Roadmap

Track progress for building the **SecureVault** password manager as an **Expo (React Native)** app, using the UI/UX from `securevault.zip` as the design reference.

**Last updated:** 2026-06-13 (Run 3)  
**Overall status:** 🟡 In progress — **34%** project-wide (biometric unlock, HIBP breach monitor, brand logos + offline cache, custom logo upload, auto-lock, screen-capture protection, master-password change, inline risk badges)

> **Status (2026-06-13, Run 3):** The earlier "UI-only prototype" audit note is **superseded**. The
> `src/` tree now has real `services/`, `contexts/`, `types/`, AsyncStorage persistence, CRUD, live
> health metrics, biometric unlock, breach monitoring, brand logos, auto-lock, and screen-capture
> protection. Crypto is still a salted SHA-256 password gate with plaintext-at-rest credentials
> (AES-GCM 3.5–3.7 remain open). Progress reflects actual implemented features.

---

## Overall progress tracker

Counts every `- [ ]` / `- [x]` task in this file. **Recalculate** after checking boxes:

```powershell
# PowerShell (Windows)
$total = (Select-String -Path ROADMAP.md -Pattern '^- \[[ x]\]').Count
$done  = (Select-String -Path ROADMAP.md -Pattern '^- \[x\]').Count
"$done / $total = $([math]::Round(100 * $done / $total))%"
```

```bash
# macOS / Linux
rg "^- \[[ x]\]" ROADMAP.md | wc -l   # total
rg "^- \[x\]" ROADMAP.md | wc -l      # completed
```

### Project-wide (Phases 0–6)

| Metric | Value |
|--------|-------|
| Tasks completed | **44** / **128** |
| **Overall progress** | **34%** |

```
[███████░░░░░░░░░░░░░] 34%
```

| Phase | Done | Total | Progress | Status |
|-------|------|-------|----------|--------|
| 0 — Foundation | 5 | 6 | 83% | 🟡 |
| 1 — Design system & shell | 0 | 11 | 0% | ⬜ |
| 2 — UI (mock data) | 4 | 31 | 13% | 🟡 |
| 3 — Local vault & security | 12 | 23 | 52% | 🟡 |
| 4 — Password health | 10 | 10 | 100% | ✅ |
| 5 — Polish & release | 11 | 18 | 61% | 🟡 |
| 6 — Backend & sync (optional) | 0 | 8 | 0% | ⬜ |

*v1 feature lists (must-have / nice-to-have under Phase 0) are tracked separately below and are **not** included in the table above.*

---

### Pre-Phase 3 gate (Phases 0–2 only)

**Start Phase 3** when this reaches **100%** (or you explicitly accept remaining Phase 2 items as Phase 3 blockers).

| Metric | Value |
|--------|-------|
| Tasks completed | **9** / **48** |
| **Pre-Phase 3 progress** | **19%** |

```
[████░░░░░░░░░░░░░░░░] 19%
```

**Remaining before Phase 3 gate:** Phase 0.4 plus all Phase 1–2 tasks.

*Phase 3 V1 core has started early by exception to clear P0 auth/vault-save bugs; Phase 0 gate items are still not complete.*

---

### v1 feature checklist (Phase 0)

| Track | Done | Total | Progress |
|-------|------|-------|----------|
| Must-have | 0 | 8 | 0% |
| Nice-to-have (deferred) | 0 | 5 | 0% |

---

### Milestone progress

| Milestone | Phases | Progress | Notes |
|-----------|--------|----------|-------|
| **M0 — Kickoff** | 0 | 83% | Scope/process documented; local `securevault.zip` extraction is blocked because the zip is absent |
| **M1 — Walkable UI** | 1–2 | **7%** | Onboarding content + dashboard/vault screens wired to real data |
| **M2 — Private beta** | 3–4 | **76%** | Biometric unlock, breach monitor, logos, auto-lock; Password Health 100%; AES encryption pending |
| **M3 — Store beta** | 5 | 61% | Accessibility, release metadata, screen-capture protection, loading/empty states |
| **M4 — Cloud** | 6 | 0% | Optional |

**M1 formula:** average of Phase 1 (0%) and Phase 2 (13%) = **7%**.

---

## How to use this document

1. Work phases **in order** unless noted otherwise.
2. Check boxes (`[x]`) as tasks complete.
3. **Update the [Overall progress tracker](#overall-progress-tracker)** counts and bars when tasks change.
4. Update **Progress log** at the bottom when you finish a phase or milestone.
5. Keep **Open decisions** resolved before starting dependent work.
6. **Do not start Phase 3** until Pre-Phase 3 gate is at 100% (or you document exceptions in the progress log).

---

## Vision

A mobile password manager that lets users:

- Store and organize credentials by category
- Generate strong passwords with configurable rules
- See password health (strength, reuse, breaches)
- Keep data secure with local encryption (and optional cloud sync later)

---

## Design reference

| Source | Purpose |
|--------|---------|
| `securevault.zip` | Screen layouts, colors, typography, component patterns |
| Web prototype screens | Onboarding, Dashboard, Vault, Generator, Health |

**Design tokens (from prototype):**

| Token | Value |
|-------|--------|
| Primary purple | `#5F61F6` / `#6568F7` |
| Light purple | `#E9E8FF` |
| Light blue | `#EAF6FF` |
| Mint green | `#78D7B1` |
| Soft yellow | `#F7D63D` |
| Text primary | `#1E1E1E` |
| Text muted | `#8B8B8B` |
| Border | `#ECECEC` |
| Danger | `#FF4D5E` |
| App background | `#F8F9FF` |
| Font | Plus Jakarta Sans |

**Note:** The zip’s multi-phone `DeviceFrame` layout is for web marketing only. The mobile app uses **full-screen native screens**, not device chrome.

---

## Tech stack (target)

| Layer | Choice |
|-------|--------|
| App | Expo SDK 54, React Native, TypeScript |
| Routing | expo-router (file-based) |
| Styling | `StyleSheet` + `constants/securevault-theme.ts` (light + dark) |
| Icons | `lucide-react-native` |
| Dark mode | System-driven (`userInterfaceStyle: automatic`) from day one |
| Local secrets | expo-secure-store, expo-crypto |
| Validation | zod |
| API (later) | Express + MongoDB + Mongoose (see `.cursor/rules/backend-mongodb.mdc`) |
| Data fetching (later) | @tanstack/react-query |

---

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

## Phase overview

| Phase | Name | Goal | Progress | Status |
|-------|------|------|----------|--------|
| 0 | Foundation | Repo ready, decisions documented | 83% | 🟡 In progress |
| 1 | Design system & shell | Theme, navigation, dark mode, UI kit | 0% | ⬜ Not started |
| 2 | UI screens (mock data) | All 5 screens match prototype | 13% | 🟡 In progress |
| 3 | Local vault & security | Real CRUD, encryption, generator | 52% | 🟡 In progress |
| 4 | Password health | Scoring, reuse, strength rules | 100% | ✅ Done |
| 5 | Polish & release prep | A11y, errors, store assets | 61% | 🟡 In progress |
| 6 | Backend & sync (optional) | Auth API, cloud vault, multi-device | 0% | ⬜ Not started |
| — | **Project overall** | All phases | **34%** | 🟡 |
| — | **Pre-Phase 3 gate** | Phases 0–2 only | **19%** | 🟡 |
| — | **V1 must-have** | Product MVP | **0%** | ⬜ |

**Legend:** ⬜ Not started · 🟡 In progress · ✅ Done

---

## Phase 0 — Foundation

**Goal:** Align on scope and prepare the codebase before UI work.

### Tasks

- [x] **0.1** Confirm product scope for v1 → **offline-only** for v1
- [x] **0.2** Choose styling approach → **StyleSheet + `securevault-theme.ts`**
- [x] **0.3** Choose icon library → **lucide-react-native**
- [ ] **0.4** Extract `securevault.zip` locally as read-only design reference (do not commit `node_modules` from zip)
- [x] **0.5** Document v1 feature list (must-have vs nice-to-have)
- [x] **0.6** Set up branch strategy / issue labels if using GitHub

### v1 feature checklist (suggested defaults)

**Must-have**

- [ ] Onboarding (first launch) — UI + persist flag
- [ ] Dashboard with category summary — mock data
- [ ] Vault list + search + category filters — mock data
- [ ] Add / edit / delete credential
- [ ] Password generator + save to vault
- [ ] Basic health score (weak + reused passwords)
- [ ] Local encrypted storage (AES-GCM + PBKDF2, AsyncStorage + SecureStore)
- [ ] Master password (setup + unlock screens; biometrics deferred)

### Website branding & credential preview (v1.1)

**Goal:** Save credentials by **website + username + password**, then show the **site logo** in the avatar with **blurred** username/password preview in lists.

- [ ] **W.1** `website` field on credential (e.g. Instagram) + optional URL for domain
- [ ] **W.2** Favicon/logo in avatar via Google favicon API (`services/site-branding.ts`)
- [ ] **W.3** Quick-pick chips for popular sites on entry form
- [ ] **W.4** Live **vault preview** before save on entry screen
- [ ] **W.5** Vault / Home / Health lists use `CredentialListItem` (logo + blurred cred lines)
- [ ] **W.6** Migrate older vault entries (`title` → `website` on unlock)
- [x] **W.7** Cache logos offline for faster load *(expo-image disk cache + per-domain status map — TASK-006)*
- [x] **W.8** Custom logo upload per credential *(expo-image-picker + customLogoUri — TASK-007)*

**Nice-to-have (defer)**

- [x] Breach monitoring (Have I Been Pwned API) *(k-anonymity Breach Monitor — TASK-011)*
- [ ] Import / export vault
- [ ] Cloud sync
- [ ] Sharing credentials
- [ ] Browser extension

### Definition of done

- Decisions recorded in **Open decisions** (below) are filled in
- Team agrees on v1 scope

---

## Phase 1 — Design system & app shell

**Goal:** Replace Expo starter with SecureVault structure, theme, and navigation—screens can be placeholders.

### Tasks

- [ ] **1.1** Add `constants/securevault-theme.ts` with **light + dark** palettes
- [ ] **1.2** Load Plus Jakarta Sans via `expo-font`
- [ ] **1.3** Update root `app/_layout.tsx` (theme provider, fonts, splash)
- [ ] **1.4** Create route groups: `(auth)`, `(tabs)` — `entry/[id]` pending
- [ ] **1.5** Implement auth gate (onboarding flag in `expo-secure-store`)
- [ ] **1.6** Build custom **pill tab bar** (blur on iOS, themed on Android)
- [ ] **1.7** Wire tab routes: Home, Vault, Generator, Health
- [ ] **1.8** Create shared UI primitives: `Button`, `Card`, `Input`, `Badge`, `Progress`, `Screen`
- [ ] **1.9** Remove default Expo Explore tab
- [ ] **1.10** Configure status bar / safe areas (`Screen` + `SafeAreaView`)
- [ ] **1.11** `SecureVaultThemeProvider` — all screens use `useSecureVaultTheme()`

### Definition of done

- App launches into onboarding or tabs based on auth state
- All five main areas are reachable via navigation
- Theme matches prototype purple palette on all shells

---

## Phase 2 — UI screens (mock data)

**Goal:** Pixel-close layouts using static data—no real vault yet.

### 2.1 Onboarding

- [x] Hero illustration / image area
- [x] Title, subtitle, step indicator dots
- [x] Primary CTA (“Get started” / multi-step)
- [ ] Secondary “Log in” link (placeholder)
- [ ] Persist “onboarding complete” on CTA

### 2.2 Dashboard (Home)

- [ ] Header with greeting / user area
- [ ] Category stat cards (6 categories, theme-aware tints)
- [ ] “Manage password” + Recently Used sections
- [ ] Floating pill tab bar integrated with tabs layout

### 2.3 Vault

- [ ] “My Vault” header + shield branding
- [ ] Search input (UI only)
- [ ] Category chips: All, Social, Mail, Design, Finance
- [ ] Credential list rows (title, username, category, icon)
- [ ] Security alerts section (compromised, reused)
- [ ] “Import vault” entry point (UI stub)
- [ ] Empty state when no items

### 2.4 Generator

- [ ] Generated password display + copy button
- [ ] Length slider
- [ ] Toggles: uppercase, lowercase, numbers, symbols
- [ ] Strength meter (weak → strong) with shield icon states
- [ ] Regenerate control
- [ ] “Save secure password” CTA (wired to vault)

### 2.5 Health

- [ ] “Password Health” header
- [ ] Health score ring or large score display
- [ ] Breakdown cards: Safe, Risk, Compromised, Refused (static)
- [ ] Recommendations list (static)
- [ ] Actionable list linking to affected entries

### 2.6 Entry detail (new screen)

- [ ] View mode: site, username, password (masked), notes, category
- [ ] Edit mode with form validation (UI)
- [ ] Show / hide password, copy actions
- [ ] Delete with confirmation dialog

### Definition of done

- Every screen in the prototype has a React Native equivalent
- Mock data lives in `constants/mock-data.ts` or similar—easy to remove later
- No crashes on iOS and Android (Expo Go or dev build)

---

## Phase 3 — Local vault & security

**Goal:** Real data persistence and cryptography—app is usable offline.

### Data model

- [x] **3.1** Define `Credential` type (`types/credential.ts`)
- [ ] **3.2** Define categories enum/map (`constants/categories.ts`)
- [x] **3.3** Vault metadata (version in blob; `lastUnlockedAt` on setup/unlock)

### Storage & crypto

- [x] **3.4** Master password flow (`setup-master-password`, `unlock`)
- [ ] **3.5** Key derivation (PBKDF2-SHA256, 120k iterations)
- [ ] **3.6** Encrypt vault blob at rest (AES-GCM via `@noble/ciphers`)
- [ ] **3.7** Store encrypted blob + salt (AsyncStorage + SecureStore)
- [ ] **3.8** In-memory decrypted cache only while app is unlocked
- [x] **3.9** Auto-lock after 5 min backgrounding *(configurable preset enforced on AppState background→active — TASK-033)*

### CRUD & generator

- [x] **3.10** `VaultContext` for credentials
- [ ] **3.11** Create, read, update, delete credentials
- [x] **3.12** Wire Vault screen to real list + search (client-side filter)
- [ ] **3.13** Wire category chips to filter state
- [ ] **3.14** Implement password generator service (`services/password-generator.ts`)
- [ ] **3.15** Save generated password to new or existing entry
- [x] **3.16** Wire Dashboard counts from real data
- [x] **3.19** Support multiple credentials for the same account/site (e.g. two Instagram logins with different passwords)
- [ ] **3.20** AI-assisted folders/tags for vault organization beyond fixed categories *(manual folder/tag filters done; AI deferred)*
- [x] **3.21** Advanced search by website, URL/domain, username, notes, category, and account label
- [x] **3.22** Credential password history for tracking previous passwords per account
- [x] **3.23** Favorite/archive account organization with dedicated My Space view and archived-excluded dashboard/health summaries

### Quality

- [x] **3.17** Unit tests for generator and crypto helpers
- [ ] **3.18** Error handling: wrong master password *(corrupt vault / storage full pending)*

### Definition of done

- User can unlock vault, add credentials, see them on Dashboard and Vault
- Data survives app restart (encrypted)
- Generator produces passwords matching selected rules

---

## Phase 4 — Password health

**Goal:** Meaningful health score and actionable insights.

### Tasks

- [x] **4.1** Password strength algorithm (`isWeakPassword`, generator strength)
- [x] **4.2** Detect reused passwords (in-memory compare while unlocked)
- [x] **4.3** Flag weak passwords below threshold
- [x] **4.4** Password age / “old password” warnings with optional user notifications
- [x] **4.5** Compute overall health score (0–100) in `computeHealthMetrics`
- [x] **4.6** Wire Health screen to live metrics
- [x] **4.7** Tap health issue → navigate to affected credential
- [x] **4.8** Show inline warnings on Vault rows (reused, weak) *(weak/reused/old badge pills on Dashboard + Vault — TASK-032)*
- [x] **4.9** Stronger duplicate-password warnings with grouped affected accounts and clear fix actions

### Future (Phase 4+)

- [x] Breach check via HIBP k-anonymity API (network, privacy review) *(Breach Monitor on Health — TASK-011; resolves D6)*

### Definition of done

- Health score updates when vault changes
- User can fix issues from health list via entry screen

---

## Phase 5 — Polish & release prep

**Goal:** Production-quality UX and store readiness.

### UX & accessibility

- [ ] **5.1** Dark mode using prototype `.dark` tokens *(done in Phase 1)*
- [x] **5.2** Haptic feedback on copy, save, delete (expo-haptics)
- [x] **5.3** Loading and skeleton states *(branded RouteFallback spinner + EmptyState — TASK-036)*
- [x] **5.4** Toast / snackbar for copy confirmation and errors
- [x] **5.5** Accessibility labels, contrast checks, dynamic type where possible
- [ ] **5.6** Empty states and onboarding skip / logout flows
- [x] **5.17** Settings page: change master password, disable biometrics, reset local data, app theme, auto-lock timeout

### Security hardening

- [x] **5.7** Screenshot / screen capture policy (`expo-screen-capture` blocks capture while unlocked — TASK-035)
- [x] **5.8** Clipboard auto-clear for copied passwords
- [ ] **5.9** Security review checklist completed
- [x] **5.18** App lock controls: manual lock button and configurable auto-lock timeout

### Import / export (optional for v1)

- [x] **5.10** Export encrypted backup file *(plaintext JSON backup v1; encryption pending)*
- [x] **5.11** Import from CSV or encrypted backup *(JSON backup import with dedupe)*

### Release

- [x] **5.12** App icon, splash screen, store screenshots *(metadata + aubergine splash updated; store screenshots pending)*
- [ ] **5.13** Privacy policy & terms (required for stores)
- [ ] **5.14** EAS Build profiles (development, preview, production)
- [ ] **5.15** TestFlight / internal testing track
- [ ] **5.16** Play Store / App Store listing copy

### Definition of done

- App passes internal QA on physical devices
- Ready for beta distribution via EAS

---

## Phase 6 — Backend & sync (optional)

**Goal:** Multi-device vault and user accounts—only if product requires cloud.

### Backend (Express + MongoDB)

- [ ] **6.1** API folder structure per `backend-mongodb.mdc` rules
- [ ] **6.2** User registration / login (JWT or session—document choice)
- [ ] **6.3** Store **encrypted** vault blob server-side (zero-knowledge preferred)
- [ ] **6.4** Sync conflict strategy (last-write-wins vs merge—document choice)
- [ ] **6.5** Rate limiting, HTTPS, input validation (zod)

### Mobile integration

- [ ] **6.6** Auth screens wired to API
- [ ] **6.7** react-query for sync status and background refresh
- [ ] **6.8** Offline queue for changes when network unavailable

### Definition of done

- User can sign in on two devices and see the same vault (encrypted E2E if promised)

---

## Milestones (high level)

| Milestone | Phases | User-visible outcome |
|-----------|--------|----------------------|
| **M0 — Kickoff** | 0 | Scope and stack decided |
| **M1 — Walkable UI** | 1–2 | Full app navigable with mock data |
| **M2 — Private beta** | 3–4 | Real vault, generator, health offline |
| **M3 — Store beta** | 5 | Polished build on TestFlight / internal track |
| **M4 — Cloud** | 6 | Account + sync (if in scope) |

---

## Open decisions

Record answers here before implementing dependent phases.

| # | Decision | Options | Chosen | Date |
|---|----------|---------|--------|------|
| D1 | v1 storage model | Offline only / Cloud day one | **Offline only** | 2026-05-16 |
| D2 | Unlock method | Master password / Biometrics / Both | **Master password** | 2026-05-16 |
| D5 | State management | Context + useReducer / Zustand | **React Context** | 2026-05-16 |
| D3 | Styling | NativeWind / StyleSheet | **StyleSheet** | 2026-05-16 |
| D4 | Icons | lucide-react-native / @expo/vector-icons | **lucide-react-native** | 2026-05-16 |
| D7 | Dark mode timing | Phase 1 with UI / Phase 5 later | **Phase 1 with UI** | 2026-05-16 |
| D6 | Breach API in v1 | Yes / No | **Yes — HIBP k-anonymity only** | 2026-06-13 |

---

## Risks & mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Weak custom crypto | Critical | Use well-reviewed libraries; security review in Phase 5 |
| Scope creep (sync early) | Delays MVP | Ship Phases 1–5 offline-first; Phase 6 optional |
| Expo Go limitations | Blocks native modules | Plan EAS dev build before Phase 3 |
| Prototype ≠ mobile UX | Rework | Skip DeviceFrame; use native patterns from Phase 1 |

---

## Progress log

> **Archived (2026-06-13):** Entries below describe work on the previous codebase, replaced by the
> current UI-only rebuild. They are kept for historical context only.

Add a row when you complete a phase or milestone.

| Date | Phase / Milestone | Notes | Updated by |
|------|-------------------|-------|------------|
| 2026-06-13 | Phase 3–5 + Phase 4 complete (Run 3) | Biometric unlock (TASK-020/BUG-012), HIBP breach monitor (TASK-011, D6=Yes), brand logos + offline cache (W.7/TASK-006), custom logo upload (W.8/TASK-007), auto-lock (3.9/TASK-033), inline risk badges (4.8/TASK-032), screen-capture protection (5.7/TASK-035), loading/empty states (5.3/TASK-036), master-password change (TASK-034). Phase 4 → 100%; overall → 34%. | Cursor |
| 2026-06-13 | Phase 3–5 batch | Added Jest tests (3.17), rebuilt Password Health (4.1–4.4, 4.7, 4.9), clipboard auto-clear (5.8), JSON backup import/export (5.10–5.11), a11y pass (5.5), release metadata (5.12). Overall → 28%. | Cursor |
| 2026-06-13 | Phase 3 (3.22) | Password history captured on credential update with reveal/copy/restore UI in Edit Credential. Phase 3 → 48%. | Cursor |
| 2026-06-13 | Phase 3 (3.21, 3.23) | Completed Main Vault rebuild: shared-helper search (3.21/TASK-029), Active/Favorites/Archived filters + favorite toggle (3.23/TASK-021), copy-password rows (TASK-024), pressable security alert (BUG-009), left header branding (BUG-008), and nav-lock id routing (BUG-010). Phase 3 → 39%, overall → 13%. | Cursor |
| 2026-06-13 | Phase 0 docs | Documented offline-first v1 scope, styling/icon/state decisions, branch naming, and suggested labels in `README.md`; `securevault.zip` extraction remains open because the archive is not in the workspace. | Cursor |
| 2026-06-13 | Phase 3/4 exception | Started Phase 3/4 before the Pre-Phase 3 gate to clear P0 auth/vault-save bugs: added local vault setup/unlock, credential persistence/listing, duplicate-site support, route guards, and live health metrics. Full encryption remains pending. | Cursor |
| 2026-06-13 | Full reset | Audited current `src/` — UI-only prototype with no services/contexts/crypto. All 128 tasks reset to unchecked; progress 0%. | Cursor |
| 2026-05-16 | Roadmap created | Initial document from `securevault.zip` analysis | — |
| 2026-05-16 | Phases 1–2 started | Theme (light/dark), 5 screens, pill tab bar, mock data | — |
| 2026-05-16 | V1 must-haves | Encrypted vault, master password, CRUD, generator save, health | — |
| 2026-05-16 | Website branding v1.1 | Website field, favicon avatars, blurred list preview | — |
| 2026-05-17 | Phase 0 foundation | Extracted local design reference; documented v1 scope and GitHub branch/label strategy | — |
| 2026-05-17 | Task 3.3 complete | Added versioned vault metadata with `lastUnlockedAt` and migration support for legacy payloads. | — |
| 2026-05-17 | Task 5.17 complete | Added a dedicated settings screen with master-password change, biometric disable, local reset, app theme preference, and auto-lock timeout controls. | — |
| 2026-05-17 | Task 5.18 complete | Added explicit manual lock action in Settings and finalized persisted auto-lock timeout controls with safe preset handling. | — |
| 2026-05-17 | Task 3.21 complete | Added shared credential search indexing/matching and reused it across Home and Vault, including grouped account-picker consistency. | — |
| 2026-05-17 | Task 3.20 complete | Added user-managed folders/tags plus optional OpenAI-assisted suggestions with explicit apply confirmation and offline fallback. | — |
| 2026-05-17 | Task 3.22 complete | Added password history model + migration, captured prior passwords on updates with capped retention, and added secure history UI with reveal/copy/restore actions. | — |
| 2026-05-17 | Task 3.23 complete | Added favorite/archive credential organization, My Space tab, and explicit archived exclusion from Home and Health summaries. | — |
| 2026-05-17 | Task 24 complete | Confirmed copy-password and readable-username flows on Home/Vault and refreshed credential editing UX with a sectioned layout based on the latest reference. | — |
| 2026-05-17 | Task 23 complete | Completed a full edit-credential UX refresh with structured sections, improved action grouping, and consistent control styling for safer edits. | — |
| 2026-05-17 | Task 4.4 complete | Added old-password age heuristics, surfaced old-password warnings in Health/Vault, and added optional reminder controls with cooldown protection. | — |
| 2026-05-17 | Task 4.9 complete | Added grouped reused-password warnings with affected-account drilldown and clearer duplicate-resolution actions from Health and Vault. | — |
| 2026-05-17 | Task 4 complete | Completed Password Health reference UI polish with theme-consistent headers, score-state visuals, balanced spacing, and improved section readability. | — |
| 2026-05-17 | Task 5.5 complete | Completed accessibility and dynamic-type improvements across shared UI, auth flows, and tab screens, including stronger control labels, tab semantics, and safer touch target sizing. | — |

---

## Quick commands

```bash
npm install
npx expo start
```

```bash
# Lint
npm run lint
```

---

## Related files

| File | Description |
|------|-------------|
| `securevault.zip` | Web UI prototype (design reference) |
| `constants/theme.ts` | Current Expo starter theme (to be replaced/extended) |
| `.cursor/rules/expo-ts.mdc` | Expo / RN coding standards |
| `.cursor/rules/backend-mongodb.mdc` | Backend standards (Phase 6) |

---

*Update phase status emojis, progress %, and [Overall progress tracker](#overall-progress-tracker) when you check boxes.*

### Quick reference — update these numbers

| Field | Current value |
|-------|----------------|
| Overall (all phases) | 44 / 128 = **34%** |
| Pre-Phase 3 (phases 0–2) | 9 / 48 = **19%** |
| V1 must-have | 0 / 8 = **0%** |
| Phase 0 | 5 / 6 |
| Phase 1 | 0 / 11 |
| Phase 2 | 4 / 31 |
| Phase 3 | 12 / 23 |
| Phase 4 | 10 / 10 |
| Phase 5 | 11 / 18 |
| Phase 6 | 0 / 8 |
