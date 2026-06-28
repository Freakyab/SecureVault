
> _Continued from [ROADMAP.md](./ROADMAP.md) — Part 1._

## Phase 6 — Premium UI overhaul (Fold-style)

**Goal:** Upgrade the existing app into a calm, responsive, premium experience inspired by Fold Money — without cloning it. Adopt the design philosophy (clarity, space, motion, depth, consistency), a centralized design-token system, a reusable UI kit, and a Reanimated-based motion + haptics layer. Migrate screens incrementally.

> This is a **parallel polish track**, not a v1 blocker. It can run alongside Phase 5 release prep. See the [Fold-style design tokens](#fold-style-design-tokens-phase-6) reference below for the values these tasks must use.

**Core principle:** A premium app is defined by how effortlessly the user moves through it — prefer simplicity over complexity, consistency over novelty, smoothness over speed, clarity over decoration. Keep every animation under **350ms**; users should feel a fast, elegant app without noticing the animations themselves.

### 6.1 Foundation — design tokens & theme

- [x] **6.1** Build the design-token system under `theme/`: `colors.ts`, `spacing.ts`, `radius.ts`, `typography.ts`, `shadows.ts`, `animations.ts` *(token layer under `src/theme/` + `getTheme(scheme)` barrel — Run 7)*
- [x] **6.2** 8-point spacing scale (`xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32 · xxxl 48`) and radius scale (`chip 12 · button 16 · card 20 · sheet 24 · floating 28`) *(`theme/spacing.ts` + `theme/radius.ts` — Run 7)*
- [x] **6.3** Typography scale (Display 32/Bold · Heading 24/SemiBold · Title 20/SemiBold · Body 16/Regular · Caption 13/Medium · Label 11/Medium); max three weights, one font family *(`theme/typography.ts` — Run 7)*
- [x] **6.4** `useTheme` and `useHaptics` hooks; no screen defines its own colors/spacing/typography *(`src/hooks/use-theme.ts` resolves `getTheme(scheme)` + `src/hooks/use-haptics.ts` interaction map — Run 8)*

### 6.2 Core components (reusable UI kit)

Build under `components/ui/`; never duplicate UI logic, extract repeated patterns.

- [ ] **6.5** `Button` (scale to 0.98 on press, spring return, immediate visual + light haptic)
- [ ] **6.6** `Card` + `GlassCard` (radius 20, 20–24px padding, subtle shadow, elevated surface)
- [ ] **6.7** `Input` (themed, focus/error states)
- [ ] **6.8** `Avatar`
- [ ] **6.9** `AnimatedNumber` (count up/down instead of instant change)
- [ ] **6.10** `BottomSheet` (`@gorhom/bottom-sheet`, radius 24)
- [ ] **6.11** `SectionHeader`
- [ ] **6.12** `SkeletonLoader` (shimmer placeholder)

### 6.3 Motion design system

- [x] **6.13** Centralized animation durations in `theme/animations.ts` (tap 120 · button 180 · card expand 250 · navigation 300 · modal 350) *(+ easing/spring/stagger tokens — Run 9)*
- [ ] **6.14** Reanimated micro-interactions: button press, card fade+slide-up entrance + press elevation, list stagger (20–40ms) *(partial: `PressableScale` press + Dashboard fade-in/stagger — Run 9)*
- [x] **6.15** Haptic feedback map (press → Light · success → Success · error → Error · pull-to-refresh → Soft · card expand → Selection); avoid excessive vibration *(`hooks/use-haptics.ts` — Run 9)*
- [ ] **6.16** Skeleton → fade-in loading transitions (skeleton → fetch → fade out → fade content in ~200ms); never blank screens or content pop-in

### 6.4 Navigation experience

- [ ] **6.17** Floating rounded bottom navigation (soft shadow, active tab slightly larger, active icon accent / inactive muted)
- [ ] **6.18** Sticky headers that collapse slightly on scroll (no large fixed toolbars)
- [ ] **6.19** Fade + slide screen transitions with shared visual continuity

### 6.5 Screen migration & polish

- [x] **6.20** Migrate screens one at a time to card-based layout + design tokens (Dashboard, Vault, Generator, Health, Settings, entry detail) *(Dashboard — Run 9; Onboarding/Setup/Unlock/Main Vault + shared vault components/My Vault/Generator/Health/Settings/Add Credential/Entry detail+Edit migrated to `useTheme`/`useHaptics`/theme tokens with Reanimated entrances — Run 6 (TASK-051–TASK-060). Only Change Password (TASK-061) remains.)*
- [ ] **6.21** Background & depth pass: soft neutral background, subtle hero gradients, blur for floating elements, very light shadows (no heavy drop shadows / excessive glassmorphism) *(partial: Dashboard glow gradients + glass surfaces + light shadows — Run 9)*
- [ ] **6.22** Final UI consistency audit + animation-timing fine-tune (Design QA checklist: visual, motion, code, UX)

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


## Phase 7 — Modern Animation & UX

**Goal:** Take the app from "polished" to "alive." Where Phase 6 established the calm token + motion *foundation*, Phase 7 layers on the **advanced, gesture-driven, physics-based motion and micro-interactions** that define best-in-class apps (Things, Linear, Arc, Revolut). Every interaction should feel direct, responsive, and reversible — driven by gestures and spring physics rather than fixed timers — while staying fully accessible and running at 60fps.

> This is a **second polish track** that builds directly on [Phase 6](#phase-6--premium-ui-overhaul-fold-style). It depends on the Phase 6 design tokens (`theme/animations.ts`, `useTheme`, `useHaptics`) and UI kit, and reuses the [Fold-style design tokens](#fold-style-design-tokens-phase-6). Not a v1 blocker.

**Core principles**

- **Gesture-first:** prefer interruptible, gesture-driven motion (drag, swipe, fling) over tap-then-wait animations; users should be able to reverse a gesture mid-flight.
- **Physics over timers:** use spring/decay physics for anything the finger touches; reserve fixed durations for non-interactive transitions.
- **Purposeful delight:** animation must communicate state, hierarchy, or spatial continuity — never decoration for its own sake.
- **Accessible by default:** every animation has a reduced-motion variant; nothing relies solely on motion to convey meaning.
- **Always 60fps:** all animation runs on the UI thread (Reanimated worklets); never block JS or thrash layout.

### 7.1 Gesture-driven interactions

- [ ] **7.1** Swipe-to-action vault rows (reveal copy / edit / delete) with spring snap, haptic detents, and full-swipe shortcut
- [ ] **7.2** Long-press → context menu + drag-to-reorder favorites (`react-native-gesture-handler` + Reanimated layout)
- [ ] **7.3** Custom branded pull-to-refresh (animated shield/progress, not the default spinner)
- [ ] **7.4** Velocity-aware bottom sheet gestures (snap points, fling-to-dismiss, backdrop fade with drag)

### 7.2 Shared element & screen transitions

- [ ] **7.5** Shared-element transition: vault row → entry detail (logo + title morph in place)
- [ ] **7.6** Scroll-driven collapsing headers with parallax hero (header shrinks/blurs as content scrolls)
- [ ] **7.7** Spatial continuity between Dashboard and Health (score/number morphs across screens)

### 7.3 Delight & feedback animations

- [ ] **7.8** Lottie / Reanimated success states (animated checkmark on save, copy-confirm pulse)
- [ ] **7.9** Animated empty-state illustrations (subtle looping motion, reduce-motion safe)
- [ ] **7.10** Generator strength meter: spring fill + color interpolation as strength changes
- [ ] **7.11** Health score ring draw-on animation synced with the count-up number
- [ ] **7.12** Subtle celebratory moment on health-score milestone (light confetti / glow, tasteful, dismissible)

### 7.4 Continuous & ambient motion

- [ ] **7.13** Perf-budgeted animated gradient / glow backdrops (slow drift, paused when offscreen)
- [ ] **7.14** Shimmer skeleton → content morph using Reanimated layout animations (no hard pop-in)
- [ ] **7.15** Spring-animated tab bar: active pill slides with spring, icon morph/scale on selection

### 7.5 Accessibility & performance

- [ ] **7.16** Respect `useReducedMotion()` — provide crossfade/instant variants for every motion above
- [ ] **7.17** 60fps budget: worklet-driven UI-thread animation, avoid JS layout thrash, profile with the perf monitor on a mid-range device
- [ ] **7.18** Motion consistency audit: all springs/durations sourced from `theme/animations.ts`; final timing + easing fine-tune and design QA

### Suggested libraries

| Purpose | Library |
|---------|---------|
| Gestures & physics | `react-native-gesture-handler`, `react-native-reanimated` (springs, `withDecay`, layout animations) |
| Shared transitions | Reanimated shared element transitions / `expo-router` transitions |
| Vector / Lottie | `lottie-react-native`, `react-native-svg` (animated paths for rings/strength) |
| Sheets | `@gorhom/bottom-sheet` |
| Effects | `expo-blur`, `expo-linear-gradient` |
| Feedback | `expo-haptics` |

### Definition of done

- Core lists and sheets are gesture-driven with spring physics and haptic detents; gestures are interruptible and reversible.
- Navigating into and out of an entry uses a shared-element / spatial-continuity transition.
- Success, loading, and empty states use purposeful animation instead of static UI or spinners.
- Every animation has a verified reduced-motion variant and conveys no information by motion alone.
- All animations hold 60fps on a mid-range device and source their timing/spring config from `theme/animations.ts`.

---


## Phase 8 — Testing

**Goal:** Validate the app with real users on real hardware before public launch, and grow automated/manual test coverage.

### Beta distribution

- [ ] **8.1** TestFlight / internal testing track *(moved from Phase 5.15)* — beta distribution before public launch:
  - **TestFlight (iOS):** upload a production build to App Store Connect and invite testers via TestFlight to install and give feedback.
  - **Internal testing track (Android):** upload the AAB to the Play Console's internal/closed testing track and invite testers.
  - Catches device-specific bugs, crashes, and UX issues with real users on real hardware before the wide release.
  - **Done when:** a build is live on TestFlight and/or the Play internal track, and testers can install it.

### Definition of done

- A beta build is installable by invited testers on iOS and/or Android, with a feedback loop in place.

---


## Phase 9 — Backend & sync (optional)

**Goal:** Multi-device vault and user accounts—only if product requires cloud.

### Backend (Express + MongoDB)

- [ ] **9.1** API folder structure per `backend-mongodb.mdc` rules
- [ ] **9.2** User registration / login (JWT or session—document choice)
- [ ] **9.3** Store **encrypted** vault blob server-side (zero-knowledge preferred)
- [ ] **9.4** Sync conflict strategy (last-write-wins vs merge—document choice)
- [ ] **9.5** Rate limiting, HTTPS, input validation (zod)

### Mobile integration

- [ ] **9.6** Auth screens wired to API
- [ ] **9.7** react-query for sync status and background refresh
- [ ] **9.8** Offline queue for changes when network unavailable
- [ ] **9.9** Secondary “Log in” link on onboarding (placeholder) — wire to auth once backend exists *(moved from Phase 2.1 — needs backend/DB)*
- [ ] **9.10** AI-assisted folders/tags for vault organization beyond fixed categories *(moved from Phase 3.20 — manual folder/tag filters done; AI portion needs backend)*

### Definition of done

- User can sign in on two devices and see the same vault (encrypted E2E if promised)

---


## Phase 10 — Maintenance

**Goal:** Ongoing legal, compliance, and upkeep work that lives beyond the initial release and recurs over the app's lifetime.

### Legal & compliance

- [ ] **10.1** Privacy policy & terms (required for stores) *(moved from Phase 5.13)* — write a **Privacy Policy** (what data is collected — ideally "nothing leaves the device", local encrypted storage, HIBP breach-check sends only the k-anonymity SHA-1 prefix, and data-deletion details) and **Terms of Service** (usage terms, disclaimers, liability). Host both at a public URL and link them in-app (Settings) and in the store listings.
  - **Done when:** both documents exist, are hosted publicly, and are linked in-app + in store metadata. Keep them updated as data practices change.

### Definition of done

- Legal documents are published, linked, and kept current with each release.

---


## Phase 11 — Optional Advancement

**Goal:** Nice-to-have, go-to-market, and growth work that is **not required** for the core app to function. **Excluded from overall progress calculations** — tracked here so it isn't lost, but it does not count toward the project denominator.

> ⚠️ **Not counted:** tasks in this phase are intentionally left out of the Overall progress / quick-reference totals.

### Store presence & growth

- [ ] **11.1** Play Store / App Store listing copy *(moved from Phase 5.16)* — the marketing/metadata content shown on the store pages (not code):
  - App name & subtitle / short description
  - Full description — features, privacy/security selling points
  - Keywords (App Store) for search
  - Screenshots & preview — the polished store screenshots noted as still pending in 5.12
  - Category, age rating, support URL, promotional text
  - **Done when:** all listing text and assets are written and entered in App Store Connect + Google Play Console.

### Definition of done

- Optional items are shipped as capacity allows; none block the core release.

---


## Milestones (high level)

| Milestone | Phases | User-visible outcome |
|-----------|--------|----------------------|
| **M0 — Kickoff** | 0 | Scope and stack decided |
| **M1 — Walkable UI** | 1–2 | Full app navigable with mock data |
| **M2 — Private beta** | 3–4 | Real vault, generator, health offline |
| **M3 — Store beta** | 5 | Polished build on TestFlight / internal track |
| **M4 — Cloud** | 9 | Account + sync (if in scope) |
| **M5 — Premium UI** | 6 | Calm, responsive, Fold-style premium experience |
| **M6 — Living UI** | 7 | Gesture-driven, physics-based, delightful motion that stays accessible and 60fps |

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
| Scope creep (sync early) | Delays MVP | Ship Phases 1–5 offline-first; Phase 9 optional |
| Expo Go limitations | Blocks native modules | Plan EAS dev build before Phase 3 |
| Prototype ≠ mobile UX | Rework | Skip DeviceFrame; use native patterns from Phase 1 |

---


## Progress log

> **Archived (2026-06-13):** Entries below describe work on the previous codebase, replaced by the
> current UI-only rebuild. They are kept for historical context only.

Add a row when you complete a phase or milestone.

| Date | Phase / Milestone | Notes | Updated by |
|------|-------------------|-------|------------|
| 2026-06-14 | Phase 6 (6.20) screen migration | Completed Roadmap **6.20 / TASK-051–TASK-060** (Run 6): migrated 10 screens off legacy `useVaultColors`/`VaultType`/hardcoded styles onto the Phase 6 foundation (`useTheme`, `useHaptics`, `theme.spacing/radius/typography/glass/motion`) with Reanimated entrance animations — Onboarding, Setup Master Password, Unlock, Main Vault (+ shared `credential-row`/`credential-avatar`/`bottom-nav`/`category-card`/`vault-header`/`glass-card`/`score-ring`), My Vault, Generator, Password Health, Settings, Add Credential, Entry detail + Edit Credential. Only Change Password (TASK-061) remains in the migration block. Typecheck clean on touched files. Phase 6 → 7/22 (32%); overall → 103/167 (62%); TASKS → 55 done / 24 open. | Cursor |
| 2026-06-14 | Phase 2 (2.6) entry detail view mode | Completed Roadmap **2.6 / TASK-047**: `/entry/[id]` now lands on a read-only credential detail view with static website/URL/username/password/category/notes, masked password reveal, copy actions using sensitive clipboard auto-clear, and an explicit Edit action into the existing edit/delete flow. Phase 2 → 29/30 (97%); Pre-Phase 3 gate → 46/47 (98%); M1 → 99%; overall → 102/167 (61%). | Cursor |
| 2026-06-14 | Phase 5 (5.6) empty states / lock flow | Completed Roadmap **5.6 / TASK-048**: `EmptyState` now supports CTA actions, Dashboard/Vault/Health have actionable empty states, onboarding Skip persistence was verified and labeled for accessibility, and the Vault lock action now confirms, clears the unlocked session, shows feedback, and routes to unlock. Phase 5 → 13/15 (87%); overall → 101/167 (60%). | Cursor |
| 2026-06-14 | Phase 5 (5.9) security review | Completed Roadmap **5.9 / TASK-049**: added `Mds/SECURITY-REVIEW.md` with verified evidence for AES-GCM/PBKDF2, key/session clearing, SecureStore biometrics, encrypted storage, clipboard auto-clear, HIBP k-anonymity, auto-lock, ID-only navigation params, and input validation. Re-enabled screen-capture protection while the vault is unlocked. Phase 5 → 12/15 (80%); overall → 100/167 (60%). | Cursor |
| 2026-06-14 | Phases renumbered/reranked | Reranked the later phases for a more logical order. Mapping (old → new): **Premium UI 7 → 6**, **Modern Animation & UX 8 → 7**, **Testing 10 → 8**, **Backend & sync 6 → 9**, **Maintenance 9 → 10**; Optional Advancement stays 11. Renumbered all section headers, sub-headings, and task IDs (e.g. 7.x→6.x, 8.x→7.x, 6.x→9.x, 9.1→10.1, 10.1→8.1), reordered the body sections, and updated the progress/overview/milestone/quick-reference tables, the Fold-style token anchor (now `phase-6`), and risk/reference phase refs. Counts unchanged; overall still 99/167 = 59%. **Note:** earlier progress-log rows and dated status notes keep their original phase numbers as a historical record. | Cursor |
| 2026-06-14 | Phase 11 — Optional Advancement added (5.16 moved, not counted) | Created **Phase 11 — Optional Advancement** for nice-to-have/go-to-market work and moved **5.16 Play Store / App Store listing copy** there as **11.1**. Phase 11 is **excluded from overall progress calculations**. Phase 5 → 11/15 (73%, was 11/16); overall denominator → 167 (also reconciled the stale top metric that read 169 — both overall figures now 99/167 = 59%). | Cursor |
| 2026-06-14 | Phase 10 — Testing added (5.15 moved) | Created **Phase 10 — Testing** for real-device beta validation and QA, and moved **5.15 TestFlight / internal testing track** there as **10.1**. Phase 5 → 11/16 (69%, was 11/17); Phase 10 → 0/1. Overall scope unchanged (task moved, not removed): 99/168 = 59%. | Cursor |
| 2026-06-14 | Phase 9 — Maintenance added (5.13 moved) | Created **Phase 9 — Maintenance** for ongoing legal/compliance/upkeep work and moved **5.13 Privacy policy & terms** there as **9.1**. Phase 5 → 11/17 (65%, was 11/18); Phase 9 → 0/1. Overall scope unchanged (task moved, not removed): 99/168 = 59%. | Cursor |
| 2026-06-14 | Phase 5 (5.1 removed as duplicate) | Deleted **5.1 Dark mode using prototype `.dark` tokens** from Phase 5 — it duplicated already-completed Phase 1 work (1.1 light+dark palettes, 1.11 theme provider) and decision **D7** assigns dark-mode timing to "Phase 1 with UI". Phase 5 → 11/18 (61%, was 11/19); overall denominator → 168; overall 99/168 = 59%. Other Phase 5 ↔ Phase 7/8 overlaps (haptics, skeletons, a11y, empty states) kept since those are the separate premium-UI/animation polish tracks, not the same v1 tasks. | Cursor |
| 2026-06-14 | Phase 3 → 100% (3.20 moved) | Moved **3.20** (AI-assisted folders/tags for vault organization) from Phase 3 to **Phase 6 as 6.10**, since the AI portion depends on backend/cloud infrastructure (manual folder/tag filters already shipped). Phase 3 → 100% (22/22); Phase 6 denominator → 10 (0/10). Overall scope unchanged (task moved, not removed): 99/169 = 59%. | Cursor |
| 2026-06-14 | Phase 8 added (Run 14) | Added **Phase 8 — Modern Animation & UX**: 18 tasks across gesture-driven interactions (8.1–8.4), shared element & screen transitions (8.5–8.7), delight & feedback animations (8.8–8.12), continuous & ambient motion (8.13–8.15), and accessibility & performance (8.16–8.18), plus milestone **M6 — Living UI**. A second polish track that builds on Phase 7's tokens/UI kit toward gesture-first, physics-based, accessible 60fps motion. New scope: overall denominator → 168; overall → 49% (82/168); Pre-Phase 3 gate unchanged at 58%. | Cursor |
| 2026-06-14 | Phase 1 (1.9) remove Explore tab (Run 13) | Removed the default Expo starter **Explore tab** by deleting the unused `components/app-tabs.tsx` and `app-tabs.web.tsx` scaffolding (Home/Explore triggers + "Expo Starter" branding). No imports referenced them — the app uses the custom `BottomNav` — so no other code changed. Lint clean. Completed **1.9**. Phase 1 → 27% (3/11); overall → 55% (82/150); Pre-Phase 3 gate → 58% (28/48); M1 → 44%. | Cursor |
| 2026-06-14 | Phase 1 (1.4) route groups (Run 12) | Restructured `src/app/` routing to match the planned architecture: added **`(auth)`** group (onboarding `index` + `unlock` + `setup`), **`(tabs)`** group (dashboard/vault/my-vault/generator/health/settings with a nested no-animation stack `_layout`), and **`entry/[id]`** for credential detail/edit (replaces `/edit-credential`). Updated root `_layout.tsx` to reference the groups and repointed nav calls (`/edit-credential` → `/entry/[id]`). Route groups keep existing URLs, so the custom `BottomNav` and all `href`s still work; `add-credential`/`change-password` remain root routes. Completed **1.4**. Lint clean. Phase 1 → 18% (2/11); overall → 54% (81/150); Pre-Phase 3 gate → 56% (27/48); M1 → 40%. | Cursor |
| 2026-06-14 | Phase 1 (1.2) font decision (Run 11) | Decided to **keep the current fonts** instead of switching to Plus Jakarta Sans: system sans for body + **Playfair Display** serif headings (loaded via `@expo-google-fonts/playfair-display` in `app/_layout.tsx`). Updated the design-reference Font token and completed **1.2**. Phase 1 → 9% (1/11); overall → 53% (80/150); Pre-Phase 3 gate → 54% (26/48); M1 → 35%. | Cursor |
| 2026-06-14 | Phase 0 complete (Run 10) | Replaced the `securevault.zip` extraction task with the **`screenshots/`** folder as the read-only design reference (11 reference screens). Completed **0.4**; Phase 0 → 100% (6/6); overall → 53% (79/150); Pre-Phase 3 gate → 52% (25/48); M0 → 100%. | Cursor |
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


---

**Navigation:** [← Part 1](./ROADMAP.part-01.md) · **Part 2 of 3** · [Part 3 →](./ROADMAP.part-03.md)
