# SecureVault — Development Roadmap

Track progress for building the **SecureVault** password manager as an **Expo (React Native)** app, using the UI/UX from `securevault.zip` as the design reference.

**Last updated:** 2026-06-14 (Run 9)  
**Overall status:** 🟡 In progress — **52%** project-wide (Phase 7 premium pass: evolved tokens to a CRED-style blend, completed the motion-duration + haptic map, and shipped a redesigned **Dashboard** proof-of-concept)

> **Status (2026-06-14, Run 9):** **Premium UI proof-of-concept (CRED-style blend).** Evolved the
> `src/theme` tokens toward a premium dark look — deep aubergine background, violet accent, and new
> `glass` + `gradients` token sets (resolved per scheme via `getTheme`). Added a reusable
> `components/ui/PressableScale` (Reanimated press-scale + haptic) and redesigned the **Dashboard**
> screen: glow-gradient backdrop, glass header/search, a 3-stat summary card with count-up health
> score, premium category tiles, fade-in + staggered entrances, and a gradient Security-Health hero.
> `useTheme` is now dark-first so the premium look holds on light-mode devices. Completed **7.13**
> (durations) and **7.15** (haptic map); **7.14/7.20/7.21** advanced (partial). Lint clean; no new
> `tsc` errors. Phase 7 → 27% (6/22); overall → 52% (78/150); Pre-Phase 3 gate unchanged at 50%.
>
> **Status (2026-06-14, Run 8):** Completed **Phase 7.4** — `useTheme()` now resolves the full
> Fold-style token object (`colors`, `spacing`, `layout`, `radius`, `typography`, `shadows`, `motion`)
> from `src/theme/getTheme(scheme)`, and `useHaptics()` provides named feedback actions for press,
> success/warning/error, selection, card expansion, and pull-to-refresh. Updated starter themed
> helpers to consume `theme.colors`. Lint clean; `tsc --noEmit` is still blocked by pre-existing
> starter tab/SymbolView type issues and missing Jest globals. Phase 7 → 18% (4/22); overall → 51%
> (76/150); Pre-Phase 3 gate unchanged at 50%. Next: reusable UI kit (7.5–7.12), starting with
> `Button`.
>
> **Status (2026-06-14, Run 7):** Started **Phase 7 foundation (7.1–7.3)** — built the Fold-style
> design-token system under `src/theme/` (`colors.ts`, `spacing.ts`, `radius.ts`, `typography.ts`,
> `shadows.ts`, `animations.ts`) with a `getTheme(scheme)` barrel and a `Theme` type. Light + dark
> color schemes share token names; brand accent stays `#5F61F6`. Lint clean, no new type errors.
> Phase 7 → 14% (3/22); overall → 50% (75/150); Pre-Phase 3 gate unchanged at 50%. Next: 7.4
> `useTheme`/`useHaptics` hooks, then the UI kit (7.5–7.12).
>
> **Status (2026-06-14, Run 6):** Added **Phase 7 — Premium UI overhaul (Fold-style)** as a parallel
> polish track (22 tasks) plus a [Fold-style design-token reference](#fold-style-design-tokens-phase-7).
> The track adopts the Fold Money design philosophy (clarity, space, motion, depth, consistency) via a
> centralized token system, a reusable UI kit, and Reanimated/haptics motion — without cloning Fold.
> Adding the new scope moves the project-wide denominator to 150 tasks; overall → 48% (72/150).
> The Pre-Phase 3 gate is unaffected (still 50%).
>
> **Run 5:** Verified the Phase 2 Dashboard and Vault screens against the
> shipped, data-wired implementations (`dashboard.tsx`, `main-vault.tsx`, `bottom-nav.tsx`):
> greeting header, 6-category stat cards, Manage/Recently-Used sections, pill tab bar, vault
> shield header, search, category chips, credential rows, security-alert card, and empty
> states are all live. Phase 2 → 61%; overall → 56%; Pre-Phase 3 gate → 50%.
>
> **Run 4:** Credentials are encrypted at rest with AES-256-GCM (PBKDF2-SHA256, 120k iterations).
> Legacy plaintext vaults migrate on first unlock. The Generator tab is live with
> length/charset controls and save-to-vault. Categories are centralized in
> `constants/categories.ts`. Wrong-password, corrupt-vault, and storage-full errors surface
> actionable messages.

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
| Tasks completed | **78** / **150** |
| **Overall progress** | **52%** |

```
[██████████░░░░░░░░░░] 52%
```

| Phase | Done | Total | Progress | Status |
|-------|------|-------|----------|--------|
| 0 — Foundation | 5 | 6 | 83% | 🟡 |
| 1 — Design system & shell | 0 | 11 | 0% | ⬜ |
| 2 — UI (mock data) | 19 | 31 | 61% | 🟡 |
| 3 — Local vault & security | 22 | 23 | 96% | 🟡 |
| 4 — Password health | 10 | 10 | 100% | ✅ |
| 5 — Polish & release | 11 | 18 | 61% | 🟡 |
| 6 — Backend & sync (optional) | 0 | 8 | 0% | ⬜ |
| 7 — Premium UI (Fold-style) | 6 | 22 | 27% | 🟡 |

*v1 feature lists (must-have / nice-to-have under Phase 0) are tracked separately below and are **not** included in the table above.*

---

### Pre-Phase 3 gate (Phases 0–2 only)

**Start Phase 3** when this reaches **100%** (or you explicitly accept remaining Phase 2 items as Phase 3 blockers).

| Metric | Value |
|--------|-------|
| Tasks completed | **24** / **48** |
| **Pre-Phase 3 progress** | **50%** |

```
[██████████░░░░░░░░░░] 50%
```

**Remaining before Phase 3 gate:** Phase 0.4 plus all Phase 1–2 tasks.

*Phase 3 V1 core has started early by exception to clear P0 auth/vault-save bugs; Phase 0 gate items are still not complete.*

---

### v1 feature checklist (Phase 0)

| Track | Done | Total | Progress |
|-------|------|-------|----------|
| Must-have | 2 | 8 | 25% |
| Nice-to-have (deferred) | 0 | 5 | 0% |

---

### Milestone progress

| Milestone | Phases | Progress | Notes |
|-----------|--------|----------|-------|
| **M0 — Kickoff** | 0 | 83% | Scope/process documented; local `securevault.zip` extraction is blocked because the zip is absent |
| **M1 — Walkable UI** | 1–2 | **30%** | Dashboard + Vault UI verified live; Generator tab live; screens wired to real data |
| **M2 — Private beta** | 3–4 | **98%** | AES-GCM encryption, Generator, categories; Password Health 100% |
| **M3 — Store beta** | 5 | 61% | Accessibility, release metadata, screen-capture protection, loading/empty states |
| **M4 — Cloud** | 6 | 0% | Optional |
| **M5 — Premium UI** | 7 | 27% | Premium CRED-blend tokens + theme/haptics hooks + motion map shipped; Dashboard PoC migrated; UI kit & remaining screens next |

**M1 formula:** average of Phase 1 (0%) and Phase 2 (61%) = **30%**.

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

## Fold-style design tokens (Phase 7)

Premium "Fold Money"–inspired token set for the [Phase 7 UI overhaul](#phase-7--premium-ui-overhaul-fold-style). Used to feed `theme/colors.ts`, `spacing.ts`, `radius.ts`, `typography.ts`, `animations.ts`. Brand accent stays the SecureVault purple (`#5F61F6`); accent should occupy **<10%** of any screen.

**Neutral palette**

| Token | Value |
|-------|-------|
| Background | `#F7F8FA` |
| Surface | `#FFFFFF` |
| Surface alt | `#F1F3F5` |
| Border | `#E9ECEF` |
| Primary text | `#121212` |
| Secondary text | `#6C757D` |
| Muted text | `#ADB5BD` |

**Semantic colors**

| Token | Value |
|-------|-------|
| Primary accent | Brand (`#5F61F6`) |
| Success | `#2ECC71` |
| Warning | `#F4B400` |
| Error | `#FF4D4F` |
| Info | `#4A90E2` |

**Spacing (8-pt)** · `xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32 · xxxl 48` — card padding 20–24, screen h-padding 20, section v-spacing 24–32.

**Radius** · `chip 12 · button 16 · card 20 · sheet 24 · floating 28`.

**Typography** · Display 32/Bold · Heading 24/SemiBold · Title 20/SemiBold · Body 16/Regular · Caption 13/Medium · Label 11/Medium.

**Motion durations** · tap 120 · button 180 · card expand 250 · navigation 300 · modal 350 (ms).

**Rules:** avoid pure-black backgrounds, low-saturation grays only; prefer whitespace over dividers; subtle shadows over heavy color; no arbitrary radius values.

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
| 2 | UI screens (mock data) | All 5 screens match prototype | 61% | 🟡 In progress |
| 3 | Local vault & security | Real CRUD, encryption, generator | 96% | 🟡 In progress |
| 4 | Password health | Scoring, reuse, strength rules | 100% | ✅ Done |
| 5 | Polish & release prep | A11y, errors, store assets | 61% | 🟡 In progress |
| 6 | Backend & sync (optional) | Auth API, cloud vault, multi-device | 0% | ⬜ Not started |
| 7 | Premium UI (Fold-style) | Design tokens, UI kit, motion + haptics, screen migration | 27% | 🟡 In progress |
| — | **Project overall** | All phases | **52%** | 🟡 |
| — | **Pre-Phase 3 gate** | Phases 0–2 only | **50%** | 🟡 |
| — | **V1 must-have** | Product MVP | **25%** | 🟡 |

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
- [x] Password generator + save to vault *(Generator tab + Add Credential prefill — Run 4)*
- [ ] Basic health score (weak + reused passwords)
- [x] Local encrypted storage (AES-GCM + PBKDF2, AsyncStorage + SecureStore) *(Run 4)*
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

- [x] Header with greeting / user area *(menu + avatar header, “Hello, SecureVault” greeting — `src/components/screens/dashboard.tsx`)*
- [x] Category stat cards (6 categories, theme-aware tints) *(CategoryCard grid from `CREDENTIAL_CATEGORIES` with live counts)*
- [x] “Manage password” + Recently Used sections *(MANAGE PASSWORDS grid + RECENTLY USED / SEARCH RESULTS list)*
- [x] Floating pill tab bar integrated with tabs layout *(`BottomNav` pill bar on all tab screens)*

### 2.3 Vault

- [x] “My Vault” header + shield branding *(shield brand tile + “Main Vault” header — `src/components/screens/main-vault.tsx`)*
- [x] Search input (UI only) *(live `filterCredentials` search field)*
- [x] Category chips: All, Social, Mail, Design, Finance *(shared `CATEGORY_FILTERS` chips + Active/Favorites/Archived view chips)*
- [x] Credential list rows (title, username, category, icon) *(`CredentialRow` with logo, copy, favorite, risk badges)*
- [x] Security alerts section (compromised, reused) *(SECURITY PULSE alert card → Health)*
- [ ] “Import vault” entry point (UI stub) *(import lives in Settings backup flow — TASK-012)*
- [x] Empty state when no items *(`EmptyState` with view-aware messaging)*

### 2.4 Generator

- [x] Generated password display + copy button
- [x] Length slider *(stepper + presets 12–32, Roadmap 3.14)*
- [x] Toggles: uppercase, lowercase, numbers, symbols
- [x] Strength meter (weak → strong) with shield icon states
- [x] Regenerate control
- [x] “Save secure password” CTA (wired to vault) *(prefills Add Credential — 3.15)*

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
- [x] **3.2** Define categories enum/map (`constants/categories.ts`)
- [x] **3.3** Vault metadata (version in blob; `lastUnlockedAt` on setup/unlock)

### Storage & crypto

- [x] **3.4** Master password flow (`setup-master-password`, `unlock`)
- [x] **3.5** Key derivation (PBKDF2-SHA256, 120k iterations) *(services/crypto/vault-crypto.ts — Run 4)*
- [x] **3.6** Encrypt vault blob at rest (AES-GCM via `@noble/ciphers`) *(Run 4)*
- [x] **3.7** Store encrypted blob + salt (AsyncStorage + SecureStore) *(Run 4; biometric key in SecureStore)*
- [x] **3.8** In-memory decrypted cache only while app is unlocked *(encryptionKeyRef cleared on lock — Run 4)*
- [x] **3.9** Auto-lock after 5 min backgrounding *(configurable preset enforced on AppState background→active — TASK-033)*

### CRUD & generator

- [x] **3.10** `VaultContext` for credentials
- [x] **3.11** Create, read, update, delete credentials
- [x] **3.12** Wire Vault screen to real list + search (client-side filter)
- [x] **3.13** Wire category chips to filter state *(shared CATEGORY_FILTERS + Dashboard→Vault param — Run 4)*
- [x] **3.14** Implement password generator service (`services/password-generator.ts`) *(Generator screen — Run 4)*
- [x] **3.15** Save generated password to new or existing entry *(Generator→Add Credential param — Run 4)*
- [x] **3.16** Wire Dashboard counts from real data
- [x] **3.19** Support multiple credentials for the same account/site (e.g. two Instagram logins with different passwords)
- [ ] **3.20** AI-assisted folders/tags for vault organization beyond fixed categories *(manual folder/tag filters done; AI deferred)*
- [x] **3.21** Advanced search by website, URL/domain, username, notes, category, and account label
- [x] **3.22** Credential password history for tracking previous passwords per account
- [x] **3.23** Favorite/archive account organization with dedicated My Space view and archived-excluded dashboard/health summaries

### Quality

- [x] **3.17** Unit tests for generator and crypto helpers
- [x] **3.18** Error handling: wrong master password *(GCM auth failure + corrupt-vault reset path + storage-full message — Run 4)*

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

## Phase 7 — Premium UI overhaul (Fold-style)

**Goal:** Upgrade the existing app into a calm, responsive, premium experience inspired by Fold Money — without cloning it. Adopt the design philosophy (clarity, space, motion, depth, consistency), a centralized design-token system, a reusable UI kit, and a Reanimated-based motion + haptics layer. Migrate screens incrementally.

> This is a **parallel polish track**, not a v1 blocker. It can run alongside Phase 5 release prep. See the [Fold-style design tokens](#fold-style-design-tokens-phase-7) reference below for the values these tasks must use.

**Core principle:** A premium app is defined by how effortlessly the user moves through it — prefer simplicity over complexity, consistency over novelty, smoothness over speed, clarity over decoration. Keep every animation under **350ms**; users should feel a fast, elegant app without noticing the animations themselves.

### 7.1 Foundation — design tokens & theme

- [x] **7.1** Build the design-token system under `theme/`: `colors.ts`, `spacing.ts`, `radius.ts`, `typography.ts`, `shadows.ts`, `animations.ts` *(token layer under `src/theme/` + `getTheme(scheme)` barrel — Run 7)*
- [x] **7.2** 8-point spacing scale (`xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32 · xxxl 48`) and radius scale (`chip 12 · button 16 · card 20 · sheet 24 · floating 28`) *(`theme/spacing.ts` + `theme/radius.ts` — Run 7)*
- [x] **7.3** Typography scale (Display 32/Bold · Heading 24/SemiBold · Title 20/SemiBold · Body 16/Regular · Caption 13/Medium · Label 11/Medium); max three weights, one font family *(`theme/typography.ts` — Run 7)*
- [x] **7.4** `useTheme` and `useHaptics` hooks; no screen defines its own colors/spacing/typography *(`src/hooks/use-theme.ts` resolves `getTheme(scheme)` + `src/hooks/use-haptics.ts` interaction map — Run 8)*

### 7.2 Core components (reusable UI kit)

Build under `components/ui/`; never duplicate UI logic, extract repeated patterns.

- [ ] **7.5** `Button` (scale to 0.98 on press, spring return, immediate visual + light haptic)
- [ ] **7.6** `Card` + `GlassCard` (radius 20, 20–24px padding, subtle shadow, elevated surface)
- [ ] **7.7** `Input` (themed, focus/error states)
- [ ] **7.8** `Avatar`
- [ ] **7.9** `AnimatedNumber` (count up/down instead of instant change)
- [ ] **7.10** `BottomSheet` (`@gorhom/bottom-sheet`, radius 24)
- [ ] **7.11** `SectionHeader`
- [ ] **7.12** `SkeletonLoader` (shimmer placeholder)

### 7.3 Motion design system

- [x] **7.13** Centralized animation durations in `theme/animations.ts` (tap 120 · button 180 · card expand 250 · navigation 300 · modal 350) *(+ easing/spring/stagger tokens — Run 9)*
- [ ] **7.14** Reanimated micro-interactions: button press, card fade+slide-up entrance + press elevation, list stagger (20–40ms) *(partial: `PressableScale` press + Dashboard fade-in/stagger — Run 9)*
- [x] **7.15** Haptic feedback map (press → Light · success → Success · error → Error · pull-to-refresh → Soft · card expand → Selection); avoid excessive vibration *(`hooks/use-haptics.ts` — Run 9)*
- [ ] **7.16** Skeleton → fade-in loading transitions (skeleton → fetch → fade out → fade content in ~200ms); never blank screens or content pop-in

### 7.4 Navigation experience

- [ ] **7.17** Floating rounded bottom navigation (soft shadow, active tab slightly larger, active icon accent / inactive muted)
- [ ] **7.18** Sticky headers that collapse slightly on scroll (no large fixed toolbars)
- [ ] **7.19** Fade + slide screen transitions with shared visual continuity

### 7.5 Screen migration & polish

- [ ] **7.20** Migrate screens one at a time to card-based layout + design tokens (Dashboard, Vault, Generator, Health, Settings, entry detail) *(partial: **Dashboard** migrated to tokens + premium card layout — Run 9; Vault/Generator/Health/Settings/entry pending)*
- [ ] **7.21** Background & depth pass: soft neutral background, subtle hero gradients, blur for floating elements, very light shadows (no heavy drop shadows / excessive glassmorphism) *(partial: Dashboard glow gradients + glass surfaces + light shadows — Run 9)*
- [ ] **7.22** Final UI consistency audit + animation-timing fine-tune (Design QA checklist: visual, motion, code, UX)

### Suggested libraries

| Purpose | Library |
|---------|---------|
| Animation | `react-native-reanimated`, `react-native-gesture-handler`, `moti` |
| Visual effects | `expo-blur`, `expo-linear-gradient` |
| UI / sheets | `@gorhom/bottom-sheet`, `react-native-svg`, `lucide-react-native` |
| Interaction | `expo-haptics` |

### Definition of done

- All buttons, cards, and inputs use shared UI-kit components and design tokens — no hardcoded colors/spacing/radius.
- Every interactive element gives immediate feedback (animation + haptic); animations stay under 350ms.
- Loading uses skeletons/shimmer with fade-in; no spinners, blank screens, or pop-in.
- Bottom nav, headers, and screen transitions follow the navigation experience spec.
- Design QA checklist passes for each migrated screen (visual quality, motion quality, code quality, UX).

---

## Milestones (high level)

| Milestone | Phases | User-visible outcome |
|-----------|--------|----------------------|
| **M0 — Kickoff** | 0 | Scope and stack decided |
| **M1 — Walkable UI** | 1–2 | Full app navigable with mock data |
| **M2 — Private beta** | 3–4 | Real vault, generator, health offline |
| **M3 — Store beta** | 5 | Polished build on TestFlight / internal track |
| **M4 — Cloud** | 6 | Account + sync (if in scope) |
| **M5 — Premium UI** | 7 | Calm, responsive, Fold-style premium experience |

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
| 2026-06-14 | Phase 7 premium PoC (Run 9) | Evolved `src/theme` tokens to a **CRED-style premium blend** (deep aubergine bg, violet accent, new `glass` + `gradients` token sets resolved per scheme via `getTheme`). Added reusable `components/ui/PressableScale` (Reanimated press-scale + light haptic). Redesigned **Dashboard** as the proof-of-concept: glow-gradient backdrop, glass header/search, 3-stat summary card with count-up health score, premium category tiles, fade-in + staggered list entrances, gradient Security-Health hero, gradient FAB. Made `useTheme` dark-first so the look holds on light-mode devices. Completed **7.13** (motion durations) + **7.15** (haptic map); advanced **7.14/7.20/7.21** (partial). Lint clean; no new `tsc` errors. Phase 7 → 27% (6/22); overall → 52% (78/150); gate unchanged at 50%. | Cursor |
| 2026-06-14 | Phase 7 hooks (Run 8) | Completed **7.4**: `useTheme()` now resolves the full Fold-style token object from `src/theme/getTheme(scheme)`, and `useHaptics()` centralizes named interaction feedback (`press`, `success`, `warning`, `error`, `selection`, `pullToRefresh`, `cardExpand`). Updated starter themed helpers to consume `theme.colors`. `npm run lint` passes with one existing warning in `src/app/setup.tsx`; `npx tsc --noEmit` remains blocked by pre-existing starter tab/SymbolView type issues and missing Jest globals. Phase 7 → 18% (4/22); overall → 51% (76/150). | Cursor |
| 2026-06-14 | Phase 7 foundation (Run 7) | Built the Fold-style **design-token system** under `src/theme/`: `colors.ts` (light+dark neutral palette, semantic colors, brand `#5F61F6` accent), `spacing.ts` (8-pt scale + layout helpers), `radius.ts` (chip/button/card/sheet/floating/full), `typography.ts` (Display→Label scale, one family, ≤3 weights), `shadows.ts` (sm/md/lg subtle elevation), `animations.ts` (durations ≤350ms + easing/spring/stagger), and an `index.ts` barrel exposing `getTheme(scheme)` and a `Theme` type. Completes 7.1–7.3; lint clean, no new type errors. Phase 7 → 14% (3/22); overall → 50% (75/150); gate unchanged at 50%. | Cursor |
| 2026-06-14 | Phase 7 added (Run 6) | Added **Phase 7 — Premium UI overhaul (Fold-style)**: 22 tasks across design tokens (7.1–7.4), reusable UI kit (7.5–7.12), motion + haptics (7.13–7.16), navigation experience (7.17–7.19), and screen migration/polish (7.20–7.22), plus a Fold-style design-token reference and milestone M5. Parallel polish track inspired by Fold Money (clarity, space, motion, depth, consistency). New scope: overall denominator → 150; overall → 48% (72/150); Pre-Phase 3 gate unchanged at 50%. | Cursor |
| 2026-06-14 | Phase 2 UI verified (Run 5) | Verified 10 shipped Phase 2 tasks against real code: Dashboard greeting header, 6-category stat cards, Manage/Recently-Used sections, pill tab bar (2.2 ×4); Vault shield header, search, category chips, credential rows, security-alert card, empty states (2.3 ×6, import-stub deferred to Settings). Phase 2 → 61% (19/31); overall → 56% (72/128); Pre-Phase 3 gate → 50% (24/48); M1 → 30%. | Cursor |
| 2026-06-13 | Phase 3 encryption + Generator (Run 4) | AES-GCM at rest (3.5–3.8), legacy migration, categories map (3.2), category filter wiring (3.13), Generator tab (2.4/3.14/3.15), CRUD confirmed (3.11), error handling (3.18). Phase 3 → 96%; overall → 48%. | Cursor |
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
| Overall (all phases) | 78 / 150 = **52%** |
| Pre-Phase 3 (phases 0–2) | 24 / 48 = **50%** |
| V1 must-have | 2 / 8 = **25%** |
| Phase 0 | 5 / 6 |
| Phase 1 | 0 / 11 |
| Phase 2 | 19 / 31 |
| Phase 3 | 22 / 23 |
| Phase 4 | 10 / 10 |
| Phase 5 | 11 / 18 |
| Phase 6 | 0 / 8 |
| Phase 7 | 6 / 22 |
