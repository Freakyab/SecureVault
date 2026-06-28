# SecureVault — Development Roadmap

Track progress for building the **SecureVault** password manager as an **Expo (React Native)** app, using the UI/UX in the [`screenshots/`](../screenshots) folder as the design reference.

**Last updated:** 2026-06-14 (TASK-047 / Roadmap 2.6 read-only entry detail completed)  
**Overall status:** 🟡 In progress — **61%** project-wide (entry detail now defaults to read-only view mode)

> **Status (2026-06-14, Run 14):** Added **Phase 8 — Modern Animation & UX** as a second polish track
> (18 tasks) that extends Phase 7's token + motion foundation toward a best-in-class feel: gesture-driven
> list/sheet interactions (swipe actions, drag-to-reorder, velocity-aware sheets), shared-element + scroll-
> driven screen transitions, delight/feedback animations (Lottie success, animated rings/strength meters,
> celebratory moments), ambient motion (animated gradients, shimmer→content morphs, spring tab bar), and a
> dedicated accessibility + performance pass (reduce-motion variants, 60fps UI-thread budget, timing audit).
> Adding the new scope moves the project-wide denominator to **168** tasks; overall → **49%** (82/168).
> The Pre-Phase 3 gate is unaffected (still 58%). New milestone **M6 — Living UI** tracks the track.
>
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
> polish track (22 tasks) plus a [Fold-style design-token reference](#fold-style-design-tokens-phase-6).
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
| Tasks completed | **103** / **167** |
| **Overall progress** | **62%** |

```
[████████████░░░░░░░░] 62%
```

| Phase | Done | Total | Progress | Status |
|-------|------|-------|----------|--------|
| 0 — Foundation | 6 | 6 | 100% | ✅ |
| 1 — Design system & shell | 11 | 11 | 100% | ✅ |
| 2 — UI (mock data) | 29 | 30 | 97% | 🟡 |
| 3 — Local vault & security | 22 | 22 | 100% | ✅ |
| 4 — Password health | 10 | 10 | 100% | ✅ |
| 5 — Polish & release | 13 | 15 | 87% | 🟡 |
| 6 — Premium UI (Fold-style) | 7 | 22 | 32% | 🟡 |
| 7 — Modern Animation & UX | 0 | 18 | 0% | ⬜ |
| 8 — Testing | 0 | 1 | 0% | ⬜ |
| 9 — Backend & sync (optional) | 0 | 10 | 0% | ⬜ |
| 10 — Maintenance | 0 | 1 | 0% | ⬜ |
| 11 — Optional Advancement *(not counted)* | 0 | 1 | — | ⬜ |

*v1 feature lists (must-have / nice-to-have under Phase 0) are tracked separately below and are **not** included in the table above. **Phase 11 — Optional Advancement is also excluded** from the overall totals/denominator.*

---

### Pre-Phase 3 gate (Phases 0–2 only)

**Start Phase 3** when this reaches **100%** (or you explicitly accept remaining Phase 2 items as Phase 3 blockers).

| Metric | Value |
|--------|-------|
| Tasks completed | **46** / **47** |
| **Pre-Phase 3 progress** | **98%** |

```
[████████████████████] 98%
```

**Remaining before Phase 3 gate:** 1 Phase 2 task.

*Phase 3 V1 core has started early by exception to clear P0 auth/vault-save bugs; Phase 0 is now complete.*

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
| **M0 — Kickoff** | 0 | 100% | Scope/process documented; design reference now lives in the `screenshots/` folder |
| **M1 — Walkable UI** | 1–2 | **99%** | Phase 1 app shell complete; Dashboard + Vault UI verified live; Generator tab live; screens wired to real data; Password Health screen verified live; entry detail read-only view plus edit/copy/delete flow verified live; app fonts loaded; route groups `(auth)`/`(tabs)` + `entry/[id]`; starter Explore tab removed |
| **M2 — Private beta** | 3–4 | **98%** | AES-GCM encryption, Generator, categories; Password Health 100% |
| **M3 — Store beta** | 5 | 87% | Accessibility, release metadata, screen-capture protection, loading/empty states, security review checklist, lock/logout polish |
| **M4 — Cloud** | 9 | 0% | Optional |
| **M5 — Premium UI** | 6 | 32% | Premium CRED-blend tokens + theme/haptics hooks + motion map shipped; 11 screens migrated to tokens/hooks (TASK-051–060); UI kit & Change Password next |
| **M6 — Living UI** | 7 | 0% | Advanced motion: gesture interactions, shared-element transitions, delight animations, reduce-motion + 60fps pass |

**M1 formula:** average of Phase 1 (100%) and Phase 2 (97%) = **99%**.

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
| [`screenshots/`](../screenshots) | Screen layouts, colors, typography, component patterns |
| Screenshot set | Onboarding, Unlock/Setup Master Password, Dashboard, Vault (Main/My), Add/Edit Credential, Password Health, Settings |

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
| Font (body) | System sans (`system-ui` / platform default) |
| Font (headings) | Playfair Display (serif, via `@expo-google-fonts/playfair-display`) |

**Note:** The zip’s multi-phone `DeviceFrame` layout is for web marketing only. The mobile app uses **full-screen native screens**, not device chrome.

---


## Fold-style design tokens (Phase 6)

Premium "Fold Money"–inspired token set for the [Phase 6 UI overhaul](#phase-6--premium-ui-overhaul-fold-style). Used to feed `theme/colors.ts`, `spacing.ts`, `radius.ts`, `typography.ts`, `animations.ts`. Brand accent stays the SecureVault purple (`#5F61F6`); accent should occupy **<10%** of any screen.

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
| 0 | Foundation | Repo ready, decisions documented | 100% | ✅ Done |
| 1 | Design system & shell | Theme, navigation, dark mode, UI kit | 100% | ✅ Done |
| 2 | UI screens (mock data) | All 5 screens match prototype | 97% | 🟡 In progress |
| 3 | Local vault & security | Real CRUD, encryption, generator | 100% | ✅ Done |
| 4 | Password health | Scoring, reuse, strength rules | 100% | ✅ Done |
| 5 | Polish & release prep | A11y, errors, store assets | 87% | 🟡 In progress |
| 6 | Premium UI (Fold-style) | Design tokens, UI kit, motion + haptics, screen migration | 32% | 🟡 In progress |
| 7 | Modern Animation & UX | Gestures, shared transitions, delight motion, reduce-motion + 60fps | 0% | ⬜ Not started |
| 8 | Testing | Beta distribution, real-device QA | 0% | ⬜ Not started |
| 9 | Backend & sync (optional) | Auth API, cloud vault, multi-device | 0% | ⬜ Not started |
| 10 | Maintenance | Legal/compliance docs, ongoing upkeep | 0% | ⬜ Not started |
| 11 | Optional Advancement *(not counted)* | Store listing copy, growth — excluded from totals | — | ⬜ Not started |
| — | **Project overall** | All phases *(excl. Phase 11)* | **61%** | 🟡 |
| — | **Pre-Phase 3 gate** | Phases 0–2 only | **98%** | 🟡 |
| — | **V1 must-have** | Product MVP | **25%** | 🟡 |

**Legend:** ⬜ Not started · 🟡 In progress · ✅ Done

---


## Phase 0 — Foundation

**Goal:** Align on scope and prepare the codebase before UI work.

### Tasks

- [x] **0.1** Confirm product scope for v1 → **offline-only** for v1
- [x] **0.2** Choose styling approach → **StyleSheet + `securevault-theme.ts`**
- [x] **0.3** Choose icon library → **lucide-react-native**
- [x] **0.4** Use the [`screenshots/`](../screenshots) folder as the read-only design reference
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

- [x] **1.1** Add `constants/securevault-theme.ts` with **light + dark** palettes *(`src/constants/securevault-theme.ts` bridges to `src/theme/colors.ts`)*
- [x] **1.2** Load app fonts via `expo-font` — **keep current fonts**: system sans for body + Playfair Display serif headings (`@expo-google-fonts/playfair-display` in `app/_layout.tsx`)
- [x] **1.3** Update root `app/_layout.tsx` (theme provider, fonts, splash) *(`src/app/_layout.tsx` wires fonts, splash, providers, navigation theme, and status bar)*
- [x] **1.4** Create route groups: `(auth)` (onboarding/unlock/setup), `(tabs)` (dashboard/vault/my-vault/generator/health/settings) + `entry/[id]` credential detail *(custom `BottomNav` kept; `add-credential`/`change-password` remain root routes)*
- [x] **1.5** Implement auth gate (onboarding flag in `expo-secure-store`) *(`src/services/onboarding.ts` + auth entry resume setup after onboarding)*
- [x] **1.6** Build custom **pill tab bar** (blur on iOS, themed on Android) *(`src/components/vault/bottom-nav.tsx`)*
- [x] **1.7** Wire tab routes: Home, Vault, Generator, Health *(Dashboard, Vault, Generator, Health, Settings wired via `(tabs)` routes + `BottomNav`)*
- [x] **1.8** Create shared UI primitives: `Button`, `Card`, `Input`, `Badge`, `Progress`, `Screen` *(`src/components/ui/primitives.tsx` + `src/components/ui/index.ts`)*
- [x] **1.9** Remove default Expo Explore tab *(deleted unused starter `components/app-tabs.tsx` + `app-tabs.web.tsx` with their Home/Explore triggers — app uses the custom `BottomNav`)*
- [x] **1.10** Configure status bar / safe areas (`Screen` + `SafeAreaView`) *(root `SafeAreaProvider`, `StatusBar`, safe-area-aware screens, and shared `Screen`)*
- [x] **1.11** `SecureVaultThemeProvider` — all screens use `useSecureVaultTheme()` *(`SecureVaultThemeProvider` wraps the existing theme context; `useSecureVaultTheme()` aliases the resolved token hook)*

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
- [x] Persist “onboarding complete” on CTA *(`setOnboardingComplete()` persists the SecureStore flag before routing to setup)*

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

- [x] “Password Health” header *(`VaultHeader title="Password Health"` — `src/components/screens/password-health.tsx`)*
- [x] Health score ring or large score display *(`ScoreRing` displays the live `computeHealthMetrics` score)*
- [x] Breakdown cards: Safe, Reused, Weak, Old + Breach Monitor for compromised passwords *(renamed from stale Safe/Risk/Compromised/Refused wording; “Refused” meant “Reused”)*
- [x] Recommendations list *(implemented as static “Secure Tips”)*
- [x] Actionable list linking to affected entries *(Needs Attention / reused groups / breach rows open `/entry/[id]`)*

### 2.6 Entry detail (new screen)

- [x] View mode: site, username, password (masked), notes, category — **read-only detail view** *(`/entry/[id]` now defaults to a static detail view with masked password reveal/copy and an explicit Edit affordance — TASK-047)*
- [x] Edit mode with form validation (UI) *(`EditCredentialScreen` edits website/URL/username/password/notes/folder/tags/category + favorite/archive/logo; requires website+username+password before save)* — *follow-up: inline field-level validation instead of a single `Alert`*
- [x] Show / hide password, copy actions *(`secureTextEntry` + Eye/EyeOff toggle; copy username + `copySensitiveToClipboard` for password with 30s auto-clear)*
- [x] Delete with confirmation dialog *(`handleDelete` → `Alert.alert` with Cancel + destructive Delete before `deleteCredential`)*

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

- [x] **5.2** Haptic feedback on copy, save, delete (expo-haptics)
- [x] **5.3** Loading and skeleton states *(branded RouteFallback spinner + EmptyState — TASK-036)*
- [x] **5.4** Toast / snackbar for copy confirmation and errors
- [x] **5.5** Accessibility labels, contrast checks, dynamic type where possible
- [x] **5.6** Empty states and onboarding skip / logout flows *(shared empty-state CTAs across Dashboard/Vault/Health, persisted Skip path verified, confirmed Lock flow routes to unlock — TASK-048)*
- [x] **5.17** Settings page: change master password, disable biometrics, reset local data, app theme, auto-lock timeout

### Security hardening

- [x] **5.7** Screenshot / screen capture policy (`expo-screen-capture` blocks capture while unlocked — TASK-035)
  - ⚠️ **PRODUCTION REMINDER:** currently **disabled for development** via `SCREEN_CAPTURE_PROTECTION_ENABLED = false` in `src/contexts/vault-context.tsx`. Set it back to `true` before any production/store build so screenshots are blocked while the vault is unlocked.
- [x] **5.8** Clipboard auto-clear for copied passwords
- [x] **5.9** Security review checklist completed *(`Mds/SECURITY-REVIEW.md` documents the code-verified checklist; screen-capture protection is enabled while unlocked — TASK-049)*
- [x] **5.18** App lock controls: manual lock button and configurable auto-lock timeout

### Import / export (optional for v1)

- [x] **5.10** Export encrypted backup file *(plaintext JSON backup v1; encryption pending)*
- [x] **5.11** Import from CSV or encrypted backup *(JSON backup import with dedupe)*
- [ ] **5.19** Import from **Google Password Manager** exported CSV *(current importer only accepts SecureVault JSON via clipboard — `parseVaultBackup`; add CSV support)*
  - Detect CSV vs JSON in the importer instead of assuming SecureVault JSON
  - Parse Google's CSV header `name,url,username,password,note` and map columns → `website` (`name`), `url`, `username`, `password`, `notes` (`note`)
  - Read from a file via `expo-document-picker` (CSV exports are files), in addition to the existing clipboard-paste path
  - Handle CSV edge cases: quoted fields with commas/newlines, empty/extra columns, UTF-8 BOM, and blank rows
  - Reuse `mergeCredentials` dedupe (website + username) so re-imports don't create duplicates
  - Surface clear errors for malformed CSV; show imported/skipped counts on success

### Release

- [x] **5.12** App icon, splash screen, store screenshots *(metadata + aubergine splash updated; store screenshots pending)*
- [ ] **5.14** EAS Build profiles (development, preview, production)

### Definition of done

- App passes internal QA on physical devices
- Ready for beta distribution via EAS

---


---

**Navigation:** [↑ Index](./ROADMAP.md) · **Part 1 of 3** · [Part 2 →](./ROADMAP.part-02.md)
