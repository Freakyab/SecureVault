
> _Continued from [TASKS.md](./TASKS.md) — Part 1._

## TASK-066: Shared-element transition — vault row → entry detail

| Field | Value |
|-------|--------|
| **ID** | TASK-066 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Navigation |
| **Reported** | 2026-06-14 |

### Description

Tapping a row routes to `/entry/[id]` with no shared element. Add a shared-element transition so the logo + title morph in place into the detail screen. (ROADMAP 7.5)

### Scope

- Use Reanimated shared element transitions / `expo-router` transitions.
- Morph credential logo + title from the row into the detail header.
- Reverse cleanly on back navigation.

### Related files

- `src/components/vault/credential-row.tsx`, `src/app/entry/[id].tsx`, `src/components/screens/edit-credential.tsx`
- `src/app/(tabs)/_layout.tsx` (transition config)

### Acceptance criteria

- Logo/title morph in/out on push/pop with spatial continuity at 60fps.
- Reduced-motion variant falls back to a crossfade.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.5. Deep scan: **not implemented**.

---

<a id="task-067"></a>


## TASK-067: Scroll-driven collapsing headers + parallax hero

| Field | Value |
|-------|--------|
| **ID** | TASK-067 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Headers |
| **Reported** | 2026-06-14 |

### Description

Screens use normal `ScrollView` with no scroll-driven motion. Add collapsing headers with a parallax hero (header shrinks/blurs as content scrolls). (ROADMAP 7.6)

### Scope

- Drive header height/opacity/blur from `useAnimatedScrollHandler` + `interpolate`.
- Parallax hero on Dashboard / Health; keep work on the UI thread.

### Related files

- `src/components/screens/dashboard.tsx`, `src/components/screens/password-health.tsx`, `src/components/screens/main-vault.tsx`
- `src/theme/animations.ts`

### Acceptance criteria

- Header collapses/blurs smoothly with scroll; hero parallaxes at 60fps.
- Reduced-motion variant respected; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.6. Deep scan: **not implemented**.

---

<a id="task-068"></a>


## TASK-068: Spatial continuity between Dashboard and Health

| Field | Value |
|-------|--------|
| **ID** | TASK-068 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Navigation |
| **Reported** | 2026-06-14 |

### Description

Dashboard has an animated health card but navigates to `/health` via `router.push` with no shared/spatial transition (tab transitions are disabled). Make the score/number morph across screens for spatial continuity. (ROADMAP 7.7)

### Scope

- Morph the health score/number from the Dashboard card into the Health screen ring.
- Coordinate with TASK-066 transition approach and TASK-072 ring animation.

### Related files

- `src/components/screens/dashboard.tsx`, `src/components/screens/password-health.tsx`
- `src/app/(tabs)/_layout.tsx`, `src/theme/animations.ts`

### Acceptance criteria

- Score/number visually carries between Dashboard and Health at 60fps.
- Reduced-motion variant respected; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.7. Deep scan: **partial** (animated card exists; no shared/spatial transition).

---

<a id="task-069"></a>


## TASK-069: Lottie / Reanimated success states

| Field | Value |
|-------|--------|
| **ID** | TASK-069 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Feedback |
| **Reported** | 2026-06-14 |

### Description

Success feedback is mostly toast + haptics. Add animated success states (animated checkmark on save, copy-confirm pulse) via Lottie or Reanimated. (ROADMAP 7.8)

### Scope

- Animated checkmark on save; copy-confirm pulse on copy actions.
- Either add `lottie-react-native` or build with Reanimated/SVG.
- Reuse across add/edit credential, generator, settings.

### Related files

- New `src/components/ui/success-check.tsx`
- `src/components/screens/add-credential.tsx`, `src/components/screens/edit-credential.tsx`, `src/components/screens/generator.tsx`
- `package.json` (optional `lottie-react-native`)

### Acceptance criteria

- Save shows an animated success; copy shows a confirm pulse; < 350ms / tasteful.
- Reduced-motion variant falls back to static; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.8. Deep scan: **partial** (toast/haptics only; no dedicated animation).

---

<a id="task-070"></a>


## TASK-070: Animated empty-state illustrations

| Field | Value |
|-------|--------|
| **ID** | TASK-070 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Empty states |
| **Reported** | 2026-06-14 |

### Description

`empty-state.tsx` is static icon + text. Add subtle looping motion to empty-state illustrations (reduce-motion safe). (ROADMAP 7.9)

### Scope

- Add a subtle, low-cost looping animation to the empty-state illustration.
- Pause when offscreen; provide a static reduced-motion variant.

### Related files

- `src/components/vault/empty-state.tsx`
- `src/theme/animations.ts`, `src/hooks` (reduced-motion)

### Acceptance criteria

- Empty states animate subtly and loop without jank; pause offscreen.
- Reduced-motion variant is static; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.9. Deep scan: **not implemented**.

---

<a id="task-071"></a>


## TASK-071: Generator strength meter spring fill + color interpolation

| Field | Value |
|-------|--------|
| **ID** | TASK-071 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Generator |
| **Reported** | 2026-06-14 |

### Description

The generator strength meter changes width/color instantly via styles. Animate the fill with `withSpring` and interpolate color as strength changes. (ROADMAP 7.10)

### Scope

- Spring-animate the meter fill width; `interpolateColor` between weak→strong colors.
- Drive from the strength score; source spring config from `theme/animations.ts`.

### Related files

- `src/components/screens/generator.tsx`
- `src/theme/animations.ts`

### Acceptance criteria

- Meter fill springs and color interpolates smoothly with strength; 60fps.
- Reduced-motion variant snaps instantly; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.10. Deep scan: **not implemented**.

---

<a id="task-072"></a>


## TASK-072: Health score ring draw-on synced with count-up

| Field | Value |
|-------|--------|
| **ID** | TASK-072 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Health |
| **Reported** | 2026-06-14 |

### Description

`ScoreRing` renders the SVG dash offset statically; the Health screen ring does not draw on or sync with a count-up. Animate the ring draw-on synced with the number count-up. (ROADMAP 7.11)

### Scope

- Animate SVG `strokeDashoffset` draw-on with Reanimated; sync to the count-up number.
- Reuse the `AnimatedNumber` pattern (Phase 6 7.9) for the count-up.

### Related files

- `src/components/vault/score-ring.tsx`, `src/components/screens/password-health.tsx`
- `src/theme/animations.ts`

### Acceptance criteria

- Ring draws on in sync with the count-up number at 60fps.
- Reduced-motion variant renders final state instantly; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.11. Deep scan: **partial** (static ring; Dashboard has a JS count-up only).

---

<a id="task-073"></a>


## TASK-073: Celebratory moment on health-score milestone

| Field | Value |
|-------|--------|
| **ID** | TASK-073 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Health |
| **Reported** | 2026-06-14 |

### Description

No milestone celebration exists. Add a subtle, tasteful, dismissible celebratory moment (light confetti / glow) when the health score crosses a milestone. (ROADMAP 7.12)

### Scope

- Trigger on crossing a milestone threshold (e.g. reaching a target score).
- Light confetti / glow; dismissible; success haptic; not repeated annoyingly.

### Related files

- `src/components/screens/password-health.tsx`
- `src/hooks/use-haptics.ts`, `src/theme/animations.ts`

### Acceptance criteria

- Celebration fires once per milestone crossing; tasteful and dismissible.
- Reduced-motion variant degrades gracefully; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.12. Deep scan: **not implemented**.

---

<a id="task-074"></a>


## TASK-074: Perf-budgeted animated gradient/glow backdrops

| Field | Value |
|-------|--------|
| **ID** | TASK-074 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Ambient |
| **Reported** | 2026-06-14 |

### Description

`AnimatedBlobs` loops ambient blobs but never pauses offscreen or caps resource use. Make animated gradient/glow backdrops perf-budgeted (slow drift, paused when offscreen). (ROADMAP 7.13)

### Scope

- Pause/cancel the loop when the screen is unfocused / blobs are offscreen (`useIsFocused`).
- Slow drift only; cap GPU/CPU cost; resume on focus.

### Related files

- `src/components/ui/animated-blobs.tsx`, `src/components/vault/screen-background.tsx`
- `src/theme/animations.ts`

### Acceptance criteria

- Backdrops pause when offscreen/unfocused and resume on focus; no wasted frames.
- Reduced-motion variant is static; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.13. Deep scan: **partial** (loops, but no offscreen pause).

---

<a id="task-075"></a>


## TASK-075: Shimmer skeleton → content morph

| Field | Value |
|-------|--------|
| **ID** | TASK-075 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Loading |
| **Reported** | 2026-06-14 |

### Description

No skeleton/shimmer exists; loading uses `RouteFallback`. Add shimmer skeletons that morph into content via Reanimated layout animations (no hard pop-in). (ROADMAP 7.14)

### Scope

- Build a `SkeletonLoader` (Phase 6 7.12) shimmer; morph skeleton → content with layout animations.
- Apply to list/detail loading states; never blank-screen or pop-in.

### Related files

- New `src/components/ui/skeleton-loader.tsx`
- `src/components/vault/route-fallback.tsx`, list/detail screens
- `src/theme/animations.ts`

### Acceptance criteria

- Loading shows shimmer that fades/morphs into content (~200ms); no pop-in.
- Reduced-motion variant crossfades; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.14 (depends on Phase 6 7.12). Deep scan: **not implemented**.

---

<a id="task-076"></a>


## TASK-076: Spring-animated tab bar

| Field | Value |
|-------|--------|
| **ID** | TASK-076 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Navigation |
| **Reported** | 2026-06-14 |

### Description

`bottom-nav.tsx` uses static active styling. Add a spring-animated active pill that slides between tabs, with icon morph/scale on selection. (ROADMAP 7.15)

### Scope

- Reanimated spring for the active pill slide; icon scale/morph on selection.
- Selection haptic; source spring config from `theme/animations.ts`.

### Related files

- `src/components/vault/bottom-nav.tsx`
- `src/hooks/use-haptics.ts`, `src/theme/animations.ts`

### Acceptance criteria

- Active pill slides with spring; selected icon scales/morphs; selection haptic fires.
- Reduced-motion variant snaps; 60fps; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.15. Deep scan: **partial** (static active styling only).

---

<a id="task-077"></a>


## TASK-077: Reduced-motion variants (`useReducedMotion`)

| Field | Value |
|-------|--------|
| **ID** | TASK-077 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Accessibility |
| **Reported** | 2026-06-14 |

### Description

No reduced-motion handling exists. Respect `useReducedMotion()` and provide crossfade/instant variants for every Phase 7 animation; nothing should convey meaning by motion alone. (ROADMAP 7.16)

### Scope

- Add a reduced-motion hook/wrapper; branch each animation (TASK-062–076) to a crossfade/instant variant.
- Verify no information is conveyed by motion alone.

### Related files

- New `src/hooks/use-reduced-motion.ts`
- All Phase 7 animated components/screens

### Acceptance criteria

- With Reduce Motion enabled, every animation has a verified static/crossfade variant.
- No meaning lost; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.16 (cross-cutting). Deep scan: **not implemented**.

---

<a id="task-078"></a>


## TASK-078: 60fps worklet budget + perf profiling

| Field | Value |
|-------|--------|
| **ID** | TASK-078 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Performance |
| **Reported** | 2026-06-14 |

### Description

No perf profiling / FPS instrumentation exists. Ensure all animation runs on the UI thread (Reanimated worklets), avoid JS layout thrash, and profile on a mid-range device. (ROADMAP 7.17)

### Scope

- Audit Phase 7 animations for UI-thread execution; remove JS-driven/layout-thrash paths.
- Profile with the perf monitor on a mid-range device; record results.

### Related files

- All Phase 7 animated components/screens
- `src/theme/animations.ts`

### Acceptance criteria

- All animations hold 60fps on a mid-range device; no JS-thread bottlenecks.
- Profiling results recorded; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.17. Deep scan: **partial** (worklet-capable libs present; no profiling).

---

<a id="task-079"></a>


## TASK-079: Motion consistency audit via `theme/animations.ts`

| Field | Value |
|-------|--------|
| **ID** | TASK-079 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / QA |
| **Reported** | 2026-06-14 |

### Description

Final audit: all springs/durations must source from `theme/animations.ts`; fine-tune timing + easing and run design QA. (ROADMAP 7.18)

### Scope

- Sweep all animated code for hardcoded durations/springs; route them through `theme/animations.ts`.
- Final timing/easing fine-tune; design QA (visual, motion, code, UX) per migrated screen.

### Related files

- All Phase 7 animated components/screens
- `src/theme/animations.ts`

### Acceptance criteria

- No hardcoded motion values remain; all sourced from `theme/animations.ts`.
- Design QA checklist passes; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.18 (final, after TASK-062–078). Deep scan: **partial** (tokens exist; not enforced).

---

<a id="task-001"></a>


## TASK-001: Onboarding same content on all 3 steps

| Field | Value |
|-------|--------|
| **ID** | TASK-001 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Onboarding / UX |
| **Reported** | 2026-05-16 |

### Description

The starting (onboarding) flow shows the **same hero image and copy** on every step. Only the step dots and button label change (`Continue` → `Get started`). Users expect **different display info** per step (e.g. security, vault, sync).

### Steps to reproduce

1. Fresh install or reset onboarding.
2. Open app → onboarding.
3. Tap **Continue** twice.
4. Observe: same Unsplash image, title *“Enhance safety with Total security”*, and subtitle each time.

### Expected

- Step 1–3 each show **unique** illustration and/or title + body text aligned with the feature being introduced.

### Actual

- One image (`ONBOARDING_IMAGE`) and one text block for all steps; `step` state only updates dot indicators.

### Likely cause

- `app/(auth)/onboarding.tsx` — no per-step content map; single `Image` + static strings.

### Related files

- `app/(auth)/onboarding.tsx`

### Suggested fix

- Add `ONBOARDING_STEPS: { title, subtitle, image? }[]` and render by `step` index.

### Resolution

1. `OnboardingScreen` uses a `SLIDES` array with three distinct icons, badges, titles, and descriptions (`src/components/screens/onboarding.tsx`).

---

<a id="task-002"></a>


## TASK-002: Password inputs missing show/hide toggle

| Field | Value |
|-------|--------|
| **ID** | TASK-002 |
| **Type** | Pending task / UI improvement |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | UI components / Forms |
| **Reported** | 2026-05-16 |

### Description

Password fields across the app use plain `Input` with `secureTextEntry` only. There is **no consistent “show password” (eye) control** to reveal or hide text. Users expect a **see password** button on every password input (master password, unlock, confirm password, credential password, etc.).

### Steps to reproduce

1. Open **Create master password** — Master password and Confirm fields: masked only, no eye icon.
2. Open **Unlock SecureVault** — Master password field: masked only, no eye icon.
3. Open **Add credential** — Password field has eye toggle (partial); other screens do not.
4. Compare: only `app/entry/[id].tsx` implements manual `Eye` / `EyeOff` via `rightIcon`; setup/unlock do not.

### Expected

- All password inputs use the **same UI pattern**: text field + **eye button** to toggle visibility.
- Accessible label (e.g. “Show password” / “Hide password”).
- Works in light and dark theme.

### Actual

- Most password boxes are always hidden with no toggle.
- `components/ui/input.tsx` supports `rightIcon` but has no built-in password mode.
- Inconsistent UX: Add credential has custom toggle; auth screens do not.

### Affected screens

| Screen | File | Has eye toggle? |
|--------|------|-----------------|
| Create master password | `app/(auth)/setup-master-password.tsx` | No |
| Confirm master password | `app/(auth)/setup-master-password.tsx` | No |
| Unlock vault | `app/(auth)/unlock.tsx` | No |
| Add / edit credential password | `app/entry/[id].tsx` | Yes (custom `rightIcon`) |
| Generator (display) | `app/(tabs)/generator.tsx` | N/A (plain `Text`, always visible) |

### Likely cause

- No shared `PasswordInput` component; each screen wires `secureTextEntry` ad hoc.
- Base `Input` does not expose `isPassword` / `showToggle` prop.

### Related files

- `components/ui/input.tsx`
- `app/(auth)/setup-master-password.tsx`
- `app/(auth)/unlock.tsx`
- `app/entry/[id].tsx` (refactor to use shared component)

### Suggested fix

1. Add `components/ui/password-input.tsx` (or extend `Input` with `variant="password"`):
   - Internal `showPassword` state
   - `secureTextEntry={!showPassword}`
   - `Pressable` with `Eye` / `EyeOff` from `lucide-react-native`
2. Replace all master/password fields with `PasswordInput`.
3. Remove duplicated toggle logic from `entry/[id].tsx`.

---

<a id="task-003"></a>


## TASK-003: Support multiple credentials for the same account

| Field | Value |
|-------|--------|
| **ID** | TASK-003 |
| **Type** | Pending task / Feature |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Vault / Data model / UX |
| **Reported** | 2026-05-17 |

### Description

Users should be able to save **multiple credentials for the same account or website**. For example, Instagram can have two saved passwords/logins, such as personal and business accounts, without overwriting or hiding either entry.

### Expected

- Vault supports more than one credential with the same `website` / domain.
- Entries are distinguishable by username, label, notes, or account name.
- Search, category filters, Dashboard, and Health treat each saved credential as a separate vault item.

### Current risk

- Current UI may make duplicate website entries look identical if they share the same logo/title.
- Any future duplicate detection should not block legitimate multi-account saves.

### Related files

- `types/credential.ts`
- `contexts/vault-context.tsx`
- `app/entry/[id].tsx`
- `app/(tabs)/vault.tsx`
- `components/vault/credential-list-item.tsx`

### Suggested fix

1. Add an optional display label or account label to credentials.
2. Ensure add/update logic uses unique credential IDs, not website/domain uniqueness.
3. Update list rows and search to show enough context for duplicate websites.
4. Add tests or manual QA for two Instagram entries with different usernames/passwords.

---

<a id="task-004"></a>


## TASK-004: Reference UI for Password Health

| Field | Value |
|-------|--------|
| **ID** | TASK-004 |
| **Type** | Pending task / UI improvement |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Password Health / Dashboard / UI |
| **Reported** | 2026-05-17 |

### Description

Update the **Password Health** experience to better match the provided reference UI: bold card-based layout, strong visual hierarchy, rounded panels, category chips, password strength/health summary, and a polished mobile-first dashboard feel.

### Reference

- User-provided reference image in chat (2026-05-17): three mobile screens showing dashboard, password generator, and password detail styling.

### Expected

- Password Health screen has a richer visual layout inspired by the reference design.
- Health summary cards clearly show total passwords, safe/reused/weak/compromised counts, or equivalent app-supported metrics.
- Styling remains consistent with SecureVault theme colors, dark/light mode, typography, and safe-area behavior.
- UI is responsive on common mobile screen sizes.

### Current risk

- Existing health screen may feel visually inconsistent with the desired app direction.
- Metrics should not imply security checks that are not implemented yet; any unavailable checks should be labeled clearly or omitted.

### Related files

- `app/(tabs)/health.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `constants/securevault-theme.ts`
- `services/health-checks.ts`
- `types/credential.ts`

### Suggested fix

1. Audit the current Password Health screen and available health metrics.
2. Create a reference-inspired layout using existing theme tokens and reusable UI components.
3. Add summary cards/chips for supported metrics only.
4. Verify light/dark mode and small-screen behavior.

---

<a id="task-005"></a>


## TASK-005: Foundation docs and project process

| Field | Value |
|-------|--------|
| **ID** | TASK-005 |
| **Type** | Pending task / Project setup |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Foundation / Docs / Process |
| **Reported** | 2026-05-17 |
| **Roadmap** | 0.4, 0.5, 0.6 |

### Description

Finish the remaining Phase 0 foundation work from `ROADMAP.md`: extract the design reference safely, document v1 scope, and define a lightweight branch / issue-label strategy if GitHub is used.

### Expected

- `securevault.zip` is extracted locally as a read-only reference without committing generated or dependency files.
- V1 must-have vs nice-to-have scope is documented in project docs.
- Branch naming and issue labels are documented for future work.

### Related files

- `ROADMAP.md`
- `README.md`
- `securevault.zip`

### Suggested fix

1. Extract only useful reference assets/screens and ignore dependency/build artifacts.
2. Add a concise v1 scope section to docs.
3. Document branch names and label conventions in `README.md` or a contributor note.

---

<a id="task-006"></a>


## TASK-006: Cache site logos offline

| Field | Value |
|-------|--------|
| **ID** | TASK-006 |
| **Type** | Pending task / Enhancement |
| **Priority** | P3 — Low / Optional |
| **Status** | done |
| **Area** | Website branding / Performance |
| **Reported** | 2026-05-17 |
| **Roadmap** | W.7 |

### Description

Cache fetched website logos/favicons so credential lists load faster and remain useful offline.

### Expected

- Site logo lookups avoid unnecessary repeated network requests.
- Cached logos survive app restarts where practical.
- Failure to fetch a logo falls back gracefully to initials or category styling.

### Related files

- `services/site-branding.ts`
- `components/vault/credential-avatar.tsx`
- `components/vault/credential-list-item.tsx`

### Suggested fix

1. Choose a cache mechanism compatible with Expo.
2. Cache logos by resolved domain.
3. Keep fallback rendering for cache misses and offline mode.

### Resolution (Run 3)

1. New `services/site-branding.ts` resolves a credential's website/URL to a domain (with a `KNOWN_DOMAINS` brand map) and a Google favicon URL.
2. New `components/vault/credential-avatar.tsx` renders favicons via `expo-image` with `cachePolicy="disk"` (offline-friendly, survives restarts) and falls back to the category icon on error.
3. A persisted per-domain status map (`getLogoStatus` / `setLogoStatus` in AsyncStorage) means known-bad domains skip the network and render the icon immediately with no flicker.

---

<a id="task-007"></a>


## TASK-007: Custom logo upload per credential

| Field | Value |
|-------|--------|
| **ID** | TASK-007 |
| **Type** | Pending task / Enhancement |
| **Priority** | P3 — Low / Optional |
| **Status** | done |
| **Area** | Credential branding / Entry form |
| **Reported** | 2026-05-17 |
| **Roadmap** | W.8 |

### Description

Allow users to attach a custom logo/image to a credential when the automatic favicon is missing or inaccurate.

### Expected

- Credential model can reference an optional custom logo asset.
- Entry form lets the user pick, replace, or remove the logo.
- Vault rows prefer custom logo over fetched favicon.

### Related files

- `types/credential.ts`
- `app/entry/[id].tsx`
- `components/vault/credential-avatar.tsx`
- `services/vault-storage.ts`

### Suggested fix

1. Add optional logo metadata to credentials.
2. Use Expo image picker / file APIs if this moves into active scope.
3. Store local asset references safely and handle missing files.

### Resolution (Run 3)

1. Added optional `customLogoUri` to the `Credential` type (migration-safe default in `vault-storage.ts`) and a `setCredentialLogo(id, uri?)` action in `vault-context`.
2. Edit Credential shows a pressable avatar with an edit badge; tapping opens a Choose Photo / Remove Logo sheet via `expo-image-picker` (`launchImageLibraryAsync`, square crop) with permission handling.
3. `CredentialAvatar` prefers `customLogoUri` over the fetched favicon across Dashboard, Vault, and Edit rows.

---

<a id="task-008"></a>


## TASK-008: Vault metadata and last unlocked timestamp

| Field | Value |
|-------|--------|
| **ID** | TASK-008 |
| **Type** | Pending task / Data model |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Vault / Storage / Security |
| **Reported** | 2026-05-17 |
| **Roadmap** | 3.3 |

### Description

Add explicit vault metadata, including encrypted blob versioning and `lastUnlockedAt`, so future migrations and security UI have stable data to read.

### Expected

- Vault blob includes a schema/version field.
- Unlock flow records `lastUnlockedAt`.
- Existing vault data migrates safely.

### Related files

- `types/credential.ts`
- `contexts/vault-context.tsx`
- `services/vault-storage.ts`
- `services/crypto/vault-crypto.ts`

### Suggested fix

1. Define a versioned vault payload interface.
2. Add migration logic for existing unversioned payloads.
3. Update setup/unlock paths to persist `lastUnlockedAt`.

### Resolution

1. `VaultMetadata` includes `version`, `createdAt`, `updatedAt`, and `lastUnlockedAt`; setup/unlock persist `lastUnlockedAt` via `vault-storage.ts` (v2 blob with migration).

---

<a id="task-009"></a>


## TASK-009: Unit tests for generator and crypto

| Field | Value |
|-------|--------|
| **ID** | TASK-009 |
| **Type** | Pending task / Testing |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Quality / Crypto / Generator |
| **Reported** | 2026-05-17 |
| **Roadmap** | 3.17 |

### Description

Add focused unit tests for password generation and crypto helpers to reduce risk around security-critical behavior.

### Expected

- Generator tests cover length, character options, and edge cases.
- Crypto tests cover key derivation, encrypt/decrypt roundtrip, wrong password behavior, and malformed payload handling.
- Test command is documented and runnable locally.

### Related files

- `services/password-generator.ts`
- `services/crypto/vault-crypto.ts`
- `package.json`

### Suggested fix

1. Confirm the project test runner setup or add Jest for Expo.
2. Mock Expo randomness where deterministic tests need it.
3. Keep tests small and deterministic.

---

<a id="task-010"></a>


## TASK-010: Password age warnings and notifications

| Field | Value |
|-------|--------|
| **ID** | TASK-010 |
| **Type** | Pending task / Health enhancement |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Password Health |
| **Reported** | 2026-05-17 |
| **Roadmap** | 4.4 |

### Description

Add an “old password” heuristic so Password Health can warn when a credential has not been updated recently, including optional user notifications/reminders.

### Expected

- Health metrics can identify old credentials using `updatedAt`.
- Threshold is documented and easy to tune.
- UI labels avoid overstating risk; age should be a recommendation, not a breach signal.
- Health page shows old-password warnings clearly.
- Optional notification/reminder behavior is configurable and not spammy.

### Related files

- `services/health-checks.ts`
- `app/(tabs)/health.tsx`
- `types/credential.ts`

### Suggested fix

1. Add an age threshold constant.
2. Extend health metrics with old-password counts/items.
3. Surface the recommendation in Health and affected credential rows if appropriate.
4. Add optional reminder/notification behavior for old credentials.

---

<a id="task-011"></a>


## TASK-011: Breach monitoring via HIBP

| Field | Value |
|-------|--------|
| **ID** | TASK-011 |
| **Type** | Pending task / Optional security feature |
| **Priority** | P3 — Low / Optional |
| **Status** | done |
| **Area** | Password Health / Privacy |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 0 nice-to-have, Phase 4+ future |

### Description

Investigate and optionally implement breach checking using the Have I Been Pwned k-anonymity API.

### Expected

- Privacy review documents exactly what leaves the device.
- Checks use k-anonymity, never raw passwords.
- UI clearly distinguishes breach findings from local weak/reused password checks.

### Related files

- `services/health-checks.ts`
- `app/(tabs)/health.tsx`
- `ROADMAP.md`

### Suggested fix

1. Resolve the roadmap decision for breach API in v1.
2. Add a small service for k-anonymity hash-prefix lookup if approved.
3. Add clear loading/error/offline states.

### Resolution (Run 3)

1. New `services/breach-check.ts` implements the HIBP "Pwned Passwords" range API using k-anonymity — only the first 5 chars of the SHA-1 hash (via `expo-crypto`) leave the device; the raw password never does. `Add-Padding` header is sent to mask response size.
2. `scanCredentialsForBreaches` de-duplicates by password so a reused password is queried once.
3. Password Health gained a **Breach Monitor** card with idle / scanning (spinner) / error / done states; breached accounts are listed and tap through to Edit Credential. Privacy note documented inline and resolves Open decision D6 (k-anonymity only).

---

<a id="task-012"></a>


## TASK-012: Import/export and encrypted backups

| Field | Value |
|-------|--------|
| **ID** | TASK-012 |
| **Type** | Pending task / Data portability |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Import / Export / Backups |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 0 nice-to-have, 5.10, 5.11 |

### Description

Add import/export support for encrypted backups, with CSV import considered separately if it remains in scope.

### Expected

- Users can export an encrypted backup file.
- Users can import a compatible encrypted backup.
- CSV import, if added, validates fields and warns about plaintext handling.

### Related files

- `services/vault-storage.ts`
- `contexts/vault-context.tsx`
- `types/credential.ts`
- `app/(tabs)/vault.tsx`

### Suggested fix

1. Define a backup file format and version.
2. Reuse existing encryption primitives.
3. Add restore validation and conflict/overwrite UX.

---

<a id="task-013"></a>


---

**Navigation:** [← Part 1](./TASKS.part-01.md) · **Part 2 of 5** · [Part 3 →](./TASKS.part-03.md)
