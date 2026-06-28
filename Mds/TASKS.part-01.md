# SecureVault — Pending Tasks

Track pending feature/engineering work not yet done. Update **Status** and **Progress** as items are fixed.
Bugs and suspected issues are tracked separately in [BUGS.md](./BUGS.md).

**Last updated:** 2026-06-14 (TASK-051–TASK-060 done — Phase 6 page migrations to theme tokens/hooks)  
**Open:** 24 · **In progress:** 0 · **Done:** 55

> **Status (2026-06-14, Run 6):** Migrated 10 screens off the legacy `useVaultColors` /
> `VaultType` / hardcoded-style system onto the Phase 6 foundation (`useTheme`, `useHaptics`,
> `theme.spacing/radius/typography/glass/motion`) with Reanimated entrance animations:
> Onboarding, Setup Master Password, Unlock, Main Vault (+ shared vault components), My Vault,
> Generator, Password Health, Settings, Add Credential, and Entry detail/Edit Credential
> (TASK-051–TASK-060). Only TASK-061 (Change Password) remains in the Phase 6 migration block.
> Typecheck clean on all touched files.

> **Status (2026-06-14, Run 5):** No task items changed — the 4 open items remain backend-gated
> (out of scope for offline-first v1). This run verified the ROADMAP Phase 2 Dashboard and Vault
> UI tasks (10 of them) against the shipped, data-wired screens and checked them off in
> `ROADMAP.md` (Phase 2 → 61%, overall → 56%). See the ROADMAP Progress log for details.
>
> **Status (2026-06-13, Run 4):** Credentials are encrypted at rest with AES-256-GCM
> (PBKDF2-SHA256, 120k iterations via `@noble/ciphers` / `@noble/hashes`). Legacy plaintext
> vaults migrate on first unlock. The Generator tab is live. Categories are centralized in
> `constants/categories.ts`. Biometric unlock uses SecureStore for the derived key.

---


## Progress tracker

| Status | Count |
|--------|-------|
| Open | 24 |
| In progress | 0 |
| Blocked | 0 |
| Done | 55 |
| **Total** | **79** |

```
[██████████████░░░░░░] 70% resolved
```

| Priority | Open |
|----------|------|
| P0 — Critical | 0 |
| P1 — High | 1 |
| P2 — Medium | 19 |
| P3 — Low / Optional | 4 |

4 of the open items (TASK-017 backend/cloud sync, TASK-018 sharing, TASK-019 browser
extension, TASK-022 Google login) depend on a backend that is **out of scope** for the
offline-first v1 (Open decision D1 = *Offline only*). The remaining offline open item
is TASK-050 (EAS Build profiles), which is Phase 5 work that can ship offline.

**TASK-051–TASK-061 (P1)** are the **Phase 6 page migrations**: each remaining screen
must move off the legacy `useVaultColors` / `VaultType` / hardcoded-style system onto the
completed Phase 6 foundation (`useTheme`, `useThemePresets`, `theme.spacing/radius/typography`,
`theme.motion`, and `useHaptics`). Dashboard is already migrated (reference). Do these in
order, **onboarding first**.

**TASK-062–TASK-079 (P2)** are the **Phase 7 — Modern Animation & UX** track (ROADMAP 7.1–7.18):
advanced, gesture-driven, physics-based motion (swipe rows, drag-to-reorder, bottom sheets,
shared-element transitions, delight/celebration animations, ambient motion, reduced-motion +
60fps pass). This is a **second polish track and not a v1 blocker** — it builds on the Phase 6
tokens/UI kit. A deep code scan found it largely unimplemented; the few partials (Dashboard
entrances, `PressableScale`, `AnimatedBlobs`, motion tokens) are noted per task.

---


## Recommended Fix Order

✅ done: TASK-009 → … → TASK-036 → TASK-037 → TASK-038 → TASK-039 → TASK-040 → TASK-041 → TASK-042 → TASK-043 → TASK-044 → TASK-045 → TASK-046 → TASK-049 → TASK-048 → TASK-047
⏳ remaining (offline, do first): TASK-050 (EAS Build profiles)
⏳ Phase 6 page migrations (P1, do onboarding first): TASK-051 (Onboarding) → TASK-052 (Setup master password) → TASK-053 (Unlock) → TASK-054 (Main Vault) → TASK-055 (My Vault) → TASK-056 (Generator) → TASK-057 (Password Health) → TASK-058 (Settings) → TASK-059 (Add Credential) → TASK-060 (Entry detail/Edit) → TASK-061 (Change Password)
⏳ Phase 7 animation track (P2, after Phase 6 migrations; foundation first): TASK-074 (ambient backdrops) → TASK-076 (spring tab bar) → TASK-062 (swipe rows) → TASK-065 (bottom sheets) → TASK-063 (drag-to-reorder) → TASK-064 (pull-to-refresh) → TASK-066 (shared element) → TASK-067 (collapsing headers) → TASK-068 (Dashboard↔Health) → TASK-069 (success states) → TASK-070 (empty states) → TASK-071 (strength meter) → TASK-072 (health ring) → TASK-073 (milestone) → TASK-075 (skeleton morph) → TASK-077 (reduced-motion) → TASK-078 (60fps perf) → TASK-079 (motion audit)
⏳ remaining (backend-gated): TASK-017 → TASK-022 → TASK-018 → TASK-019

---


## How to use this file

1. Pick items **P0 first** (they block core flows).
2. Set status to `in_progress` when you start work.
3. When fixed, set status to `done` and add a row under **Resolution log**.
4. Link PRs or commits in the resolution notes.

**Status values:** `open` · `in_progress` · `blocked` · `done` · `wont_fix`

---


## Pending Tasks Index

| ID | Title | Priority | Status |
|----|-------|----------|--------|
| [TASK-061](#task-061) | Migrate Change Password to Phase 6 tokens/hooks | P1 | open |
| [TASK-062](#task-062) | Swipe-to-action vault rows (copy/edit/delete) | P2 | open |
| [TASK-063](#task-063) | Long-press context menu + drag-to-reorder favorites | P2 | open |
| [TASK-064](#task-064) | Custom branded pull-to-refresh | P2 | open |
| [TASK-065](#task-065) | Velocity-aware bottom sheet gestures | P2 | open |
| [TASK-066](#task-066) | Shared-element transition: vault row → entry detail | P2 | open |
| [TASK-067](#task-067) | Scroll-driven collapsing headers + parallax hero | P2 | open |
| [TASK-068](#task-068) | Spatial continuity between Dashboard and Health | P2 | open |
| [TASK-069](#task-069) | Lottie / Reanimated success states | P2 | open |
| [TASK-070](#task-070) | Animated empty-state illustrations | P2 | open |
| [TASK-071](#task-071) | Generator strength meter spring fill + color interpolation | P2 | open |
| [TASK-072](#task-072) | Health score ring draw-on synced with count-up | P2 | open |
| [TASK-073](#task-073) | Celebratory moment on health-score milestone | P2 | open |
| [TASK-074](#task-074) | Perf-budgeted animated gradient/glow backdrops | P2 | open |
| [TASK-075](#task-075) | Shimmer skeleton → content morph | P2 | open |
| [TASK-076](#task-076) | Spring-animated tab bar | P2 | open |
| [TASK-077](#task-077) | Reduced-motion variants (`useReducedMotion`) | P2 | open |
| [TASK-078](#task-078) | 60fps worklet budget + perf profiling | P2 | open |
| [TASK-079](#task-079) | Motion consistency audit via `theme/animations.ts` | P2 | open |
| [TASK-050](#task-050) | EAS Build profiles (development, preview, production) | P2 | open |
| [TASK-017](#task-017) | Backend and cloud sync | P3 | open |
| [TASK-018](#task-018) | Credential sharing | P3 | open |
| [TASK-019](#task-019) | Browser extension | P3 | open |
| [TASK-022](#task-022) | Google login for account creation | P3 | open |

<details closed>
<summary>Completed Tasks</summary>

| ID | Title | Priority | Status |
|----|-------|----------|--------|
| [TASK-051](#task-051) | Migrate Onboarding to Phase 6 tokens/hooks | P1 | done |
| [TASK-052](#task-052) | Migrate Setup Master Password to Phase 6 tokens/hooks | P1 | done |
| [TASK-053](#task-053) | Migrate Unlock Vault to Phase 6 tokens/hooks | P1 | done |
| [TASK-054](#task-054) | Migrate Main Vault to Phase 6 tokens/hooks | P1 | done |
| [TASK-055](#task-055) | Migrate My Vault to Phase 6 tokens/hooks | P1 | done |
| [TASK-056](#task-056) | Migrate Generator to Phase 6 tokens/hooks | P1 | done |
| [TASK-057](#task-057) | Migrate Password Health to Phase 6 tokens/hooks | P1 | done |
| [TASK-058](#task-058) | Migrate Settings to Phase 6 tokens/hooks | P1 | done |
| [TASK-059](#task-059) | Migrate Add Credential to Phase 6 tokens/hooks | P1 | done |
| [TASK-060](#task-060) | Migrate Entry detail / Edit Credential to Phase 6 tokens/hooks | P1 | done |
| [TASK-047](#task-047) | Read-only credential View mode (entry detail) | P2 | done |
| [TASK-048](#task-048) | Empty states, onboarding skip & logout/lock flows | P2 | done |
| [TASK-049](#task-049) | Security review checklist completed | P1 | done |
| [TASK-037](#task-037) | PBKDF2-SHA256 key derivation | P0 | done |
| [TASK-038](#task-038) | AES-GCM encrypt vault at rest | P0 | done |
| [TASK-039](#task-039) | Encrypted blob + salt storage | P0 | done |
| [TASK-040](#task-040) | In-memory decrypted cache while unlocked | P1 | done |
| [TASK-041](#task-041) | Categories enum/map | P2 | done |
| [TASK-042](#task-042) | Wire category chips to filter state | P2 | done |
| [TASK-043](#task-043) | Generator screen + bottom nav | P1 | done |
| [TASK-044](#task-044) | Wire password generator service to screen | P1 | done |
| [TASK-045](#task-045) | Save generated password to vault entry | P1 | done |
| [TASK-046](#task-046) | Vault error handling (wrong password, corrupt, storage full) | P1 | done |
| [TASK-001](#task-001) | Onboarding same image/content on all 3 steps | P1 | done |
| [TASK-002](#task-002) | Password inputs missing show/hide (eye) | P1 | done |
| [TASK-003](#task-003) | Support multiple credentials for the same account | P1 | done |
| [TASK-008](#task-008) | Vault metadata and last unlocked timestamp | P1 | done |
| [TASK-013](#task-013) | UX feedback polish | P1 | done |
| [TASK-021](#task-021) | Favorite and archive accounts on SecureVault page | P2 | done |
| [TASK-023](#task-023) | Modify edit credential page | P2 | done |
| [TASK-024](#task-024) | Copy passwords and show usernames on Home/Vault | P2 | done |
| [TASK-025](#task-025) | Delete all local data and master password from storage | P1 | done |
| [TASK-026](#task-026) | Settings page for vault and app controls | P1 | done |
| [TASK-027](#task-027) | App lock controls and configurable auto-lock | P1 | done |
| [TASK-029](#task-029) | Advanced vault search improvements | P1 | done |
| [TASK-030](#task-030) | Credential password history | P2 | done |
| [TASK-004](#task-004) | Reference UI for Password Health | P2 | done |
| [TASK-005](#task-005) | Foundation docs and project process | P2 | done |
| [TASK-009](#task-009) | Unit tests for generator and crypto | P1 | done |
| [TASK-010](#task-010) | Password age warnings and notifications | P2 | done |
| [TASK-012](#task-012) | Import/export and encrypted backups | P2 | done |
| [TASK-014](#task-014) | Accessibility and dynamic type pass | P1 | done |
| [TASK-015](#task-015) | Security hardening pass | P1 | done |
| [TASK-016](#task-016) | Release readiness and store assets | P1 | done |
| [TASK-028](#task-028) | AI-assisted vault folders and tags | P2 | done |
| [TASK-031](#task-031) | Stronger duplicate password warnings | P2 | done |
| [TASK-006](#task-006) | Cache site logos offline | P3 | done |
| [TASK-007](#task-007) | Custom logo upload per credential | P3 | done |
| [TASK-011](#task-011) | Breach monitoring via HIBP | P3 | done |
| [TASK-020](#task-020) | Optional fingerprint unlock for vault access | P1 | done |
| [TASK-032](#task-032) | Inline weak/reused/old badges on credential rows | P2 | done |
| [TASK-033](#task-033) | Auto-lock on background / inactivity | P1 | done |
| [TASK-034](#task-034) | Master password change flow | P1 | done |
| [TASK-035](#task-035) | Screenshot / screen-capture protection | P2 | done |
| [TASK-036](#task-036) | Loading and empty-state polish | P2 | done |

</details>

---

<a id="task-051"></a>


## TASK-051: Migrate Onboarding to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-051 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Onboarding |
| **Reported** | 2026-06-14 |

### Description

Onboarding still uses the legacy `useVaultColors` + `VaultType` system with hardcoded spacing/radius/rgba. Migrate it onto the completed Phase 6 foundation so it matches the Dashboard reference. **Do this page first.**

### Scope

- Replace `useVaultColors()` with `useTheme()` (and `useThemePresets()` where it removes duplication).
- Replace `VaultType.*` text styles with `theme.typography.*`.
- Replace hardcoded spacing/radius/colors with `theme.spacing`, `theme.radius`, `theme.colors`.
- Drive slide transitions / entrances with `theme.motion` durations + easing (Reanimated); keep under 350ms.
- Add `useHaptics()` feedback on **Continue / Get started** instead of old helpers.

### Related files

- `src/components/screens/onboarding.tsx`
- `src/hooks/use-theme.ts`, `src/theme/presets.ts`, `src/hooks/use-haptics.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / hardcoded colors/spacing/radius/font sizes remain in the screen.
- Light + dark schemes resolve through `useTheme()`.
- Primary actions give haptic + motion feedback; animations < 350ms.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 (screen migration) + 6.4 / 6.13 / 6.15.

---

<a id="task-052"></a>


## TASK-052: Migrate Setup Master Password to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-052 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Auth — Setup |
| **Reported** | 2026-06-14 |

### Description

Setup Master Password uses `useVaultColors`, `Fonts`, hardcoded rgba/spacing/radius/typography, and a `Modal animationType="fade"` rather than motion tokens. Migrate it onto the Phase 6 foundation.

### Scope

- Replace `useVaultColors()` / `Fonts` with `useTheme()` + `theme.typography.*`.
- Replace hardcoded spacing/radius/colors with `theme.spacing`, `theme.radius`, `theme.colors`.
- Replace the creating-vault modal’s `animationType="fade"` with a `theme.motion`-driven transition.
- Add `useHaptics()` feedback on create / success / validation error.

### Related files

- `src/components/setup-master-password.tsx`
- `src/hooks/use-theme.ts`, `src/theme/presets.ts`, `src/hooks/use-haptics.ts`

### Acceptance criteria

- No `useVaultColors` / `Fonts` / hardcoded styles remain; tokens resolve via `useTheme()`.
- Modal/transition uses motion tokens; animations < 350ms.
- Create + validation states give haptic feedback.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.13 / 6.15.

---

<a id="task-053"></a>


## TASK-053: Migrate Unlock Vault to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-053 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Auth — Unlock |
| **Reported** | 2026-06-14 |

### Description

Unlock Vault uses `useVaultColors` / `VaultType` with hardcoded values and has no local haptic feedback on unlock / biometric press. Migrate it onto the Phase 6 foundation.

### Scope

- Replace `useVaultColors()` / `VaultType.*` with `useTheme()` + `theme.typography.*`.
- Replace hardcoded spacing/radius/colors with `theme.spacing`, `theme.radius`, `theme.colors`.
- Add `useHaptics()` feedback on unlock press, biometric press, success, and wrong-password error.
- Use `theme.motion` for any entrance / error-shake animation; keep under 350ms.

### Related files

- `src/components/screens/unlock-vault.tsx`
- `src/hooks/use-theme.ts`, `src/theme/presets.ts`, `src/hooks/use-haptics.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / hardcoded styles remain.
- Unlock, biometric, success, and error states give haptic feedback.
- Animations use motion tokens; < 350ms.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.13 / 6.15.

---

<a id="task-054"></a>


## TASK-054: Migrate Main Vault to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-054 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Vault |
| **Reported** | 2026-06-14 |

### Description

Main Vault uses `useVaultColors`, `VaultType`, `vaultShadow`, `Fonts`, and many hardcoded spacing/radius/font values, with no Phase 6 motion. Migrate the screen — and the shared vault components it renders — onto the Phase 6 foundation.

### Scope

- Replace `useVaultColors()` / `VaultType.*` / `vaultShadow` with `useTheme()`, `theme.typography.*`, `theme.shadows.*`.
- Replace hardcoded spacing/radius/colors with `theme.spacing`, `theme.radius`, `theme.colors`.
- Migrate shared components used here (e.g. `credential-row`, `credential-avatar`, `category-card`, `vault-header`, `bottom-nav`) since they are shared app-wide.
- Add list stagger / row entrance via `theme.motion` and `PressableScale` + `useHaptics()` on row tap / copy.

### Related files

- `src/components/screens/main-vault.tsx`
- `src/components/vault/*` (shared components)
- `src/hooks/use-theme.ts`, `src/theme/presets.ts`, `src/hooks/use-haptics.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / `vaultShadow` / hardcoded styles remain in this screen.
- Shared vault components used here resolve through `useTheme()`.
- Row interactions give haptic + press feedback; list uses motion tokens; < 350ms.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.13 / 6.14 / 6.15.

---

<a id="task-055"></a>


## TASK-055: Migrate My Vault to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-055 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Vault |
| **Reported** | 2026-06-14 |

### Description

My Vault uses `useVaultColors` / `VaultType`, mock accent hex values, hardcoded layout/type values, and no motion or haptics. Migrate it onto the Phase 6 foundation (reuse the shared components migrated in TASK-054).

### Scope

- Replace `useVaultColors()` / `VaultType.*` with `useTheme()` + `theme.typography.*`.
- Replace mock accent hexes + hardcoded spacing/radius with `theme.colors` / `theme.spacing` / `theme.radius`.
- Add list/section entrance via `theme.motion` and `useHaptics()` + `PressableScale` on interactive rows.

### Related files

- `src/components/screens/my-vault.tsx`
- `src/components/vault/*` (shared components)
- `src/hooks/use-theme.ts`, `src/theme/presets.ts`, `src/hooks/use-haptics.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / mock hex / hardcoded styles remain.
- Interactions give haptic + press feedback; motion via tokens; < 350ms.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.13 / 6.14 / 6.15.

---

<a id="task-056"></a>


## TASK-056: Migrate Generator to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-056 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Generator |
| **Reported** | 2026-06-14 |

### Description

Generator uses `useVaultColors` / `VaultType` with many hardcoded style numbers and old `hapticSuccess` / `hapticWarning` helpers. Migrate it onto the Phase 6 foundation and `useHaptics()`.

### Scope

- Replace `useVaultColors()` / `VaultType.*` with `useTheme()` + `theme.typography.*`.
- Replace hardcoded spacing/radius/colors with `theme.spacing`, `theme.radius`, `theme.colors`.
- Replace `hapticSuccess` / `hapticWarning` with `useHaptics()` (copy → selection/success, error → error).
- Animate password regeneration / copy confirmation with `theme.motion`; < 350ms.

### Related files

- `src/components/screens/generator.tsx`
- `src/hooks/use-haptics.ts`, `src/hooks/use-theme.ts`, `src/theme/presets.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / hardcoded styles or direct `hapticSuccess`/`hapticWarning` calls remain.
- Copy / generate / error states use `useHaptics()`; motion via tokens; < 350ms.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.13 / 6.15.

---

<a id="task-057"></a>


## TASK-057: Migrate Password Health to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-057 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Password Health |
| **Reported** | 2026-06-14 |

### Description

Password Health uses `useVaultColors`, `VaultType`, `SerifFont`, and hardcoded typography/spacing/radius, with no haptics for scan/actions. Migrate it onto the Phase 6 foundation.

### Scope

- Replace `useVaultColors()` / `VaultType.*` / `SerifFont` with `useTheme()` + `theme.typography.*`.
- Replace hardcoded spacing/radius/colors with `theme.spacing`, `theme.radius`, `theme.colors`.
- Animate the score ring / count-up and list entrances with `theme.motion` (reuse `AnimatedNumber` pattern once 6.9 lands); < 350ms.
- Add `useHaptics()` feedback on scan / fix actions.

### Related files

- `src/components/screens/password-health.tsx`
- `src/components/vault/score-ring.tsx`
- `src/hooks/use-theme.ts`, `src/theme/presets.ts`, `src/hooks/use-haptics.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / `SerifFont` / hardcoded styles remain.
- Score + lists animate via motion tokens; actions give haptic feedback; < 350ms.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.9 / 6.13 / 6.15.

---

<a id="task-058"></a>


## TASK-058: Migrate Settings to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-058 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Settings |
| **Reported** | 2026-06-14 |

### Description

Settings uses `useVaultColors` / `VaultType`, hardcoded style values and rgba colors, and old `hapticSuccess` / `hapticWarning` helpers. Migrate it onto the Phase 6 foundation and `useHaptics()`.

### Scope

- Replace `useVaultColors()` / `VaultType.*` with `useTheme()` + `theme.typography.*`.
- Replace hardcoded spacing/radius/rgba with `theme.spacing`, `theme.radius`, `theme.colors`.
- Replace `hapticSuccess` / `hapticWarning` with `useHaptics()` on toggles / destructive actions (toggle → selection, success → success, warning → warning/error).
- Keep the existing color-theme picker working through the new token resolution.

### Related files

- `src/components/screens/settings.tsx`
- `src/hooks/use-haptics.ts`, `src/hooks/use-theme.ts`, `src/theme/presets.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / hardcoded styles or direct `hapticSuccess`/`hapticWarning` calls remain.
- Toggles / destructive actions use `useHaptics()`; < 350ms motion.
- Color-theme picker still applies correctly.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.13 / 6.15.

---

<a id="task-059"></a>


## TASK-059: Migrate Add Credential to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-059 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Add Credential |
| **Reported** | 2026-06-14 |

### Description

Add Credential uses `useVaultColors` / `VaultType` with hardcoded style values and old `hapticSuccess` / `hapticWarning` helpers. Migrate it onto the Phase 6 foundation and `useHaptics()`.

### Scope

- Replace `useVaultColors()` / `VaultType.*` with `useTheme()` + `theme.typography.*`.
- Replace hardcoded spacing/radius/colors with `theme.spacing`, `theme.radius`, `theme.colors`.
- Migrate the shared `input-field` component used here to tokens (focus/error states).
- Replace `hapticSuccess` / `hapticWarning` with `useHaptics()` on save / validation error.

### Related files

- `src/components/screens/add-credential.tsx`
- `src/components/vault/input-field.tsx`
- `src/hooks/use-haptics.ts`, `src/hooks/use-theme.ts`, `src/theme/presets.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / hardcoded styles or direct haptic-helper calls remain.
- Inputs use tokenized focus/error states; save/validation give `useHaptics()` feedback; < 350ms.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.7 / 6.13 / 6.15.

---

<a id="task-060"></a>


## TASK-060: Migrate Entry detail / Edit Credential to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-060 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Phase 6 UI overhaul / Entry detail |
| **Reported** | 2026-06-14 |

### Description

Entry detail / Edit Credential uses `useVaultColors` / `VaultType` with hardcoded style values and old haptic + clipboard helpers. Migrate it onto the Phase 6 foundation and `useHaptics()` (keep `copySensitiveToClipboard` behavior, route its haptic through the hook).

### Scope

- Replace `useVaultColors()` / `VaultType.*` with `useTheme()` + `theme.typography.*`.
- Replace hardcoded spacing/radius/colors with `theme.spacing`, `theme.radius`, `theme.colors`.
- Replace `hapticSuccess` / `hapticWarning` with `useHaptics()` on save / copy / delete-confirm / validation error.
- Animate card expand / save confirmation with `theme.motion`; < 350ms.

### Related files

- `src/components/screens/edit-credential.tsx`
- `src/hooks/use-haptics.ts`, `src/services/feedback.ts` (clipboard), `src/hooks/use-theme.ts`, `src/theme/presets.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / hardcoded styles or direct `hapticSuccess`/`hapticWarning` calls remain.
- Copy stays masked/secure; save / copy / delete give `useHaptics()` feedback; motion via tokens; < 350ms.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.13 / 6.15.

---

<a id="task-061"></a>


## TASK-061: Migrate Change Password to Phase 6 tokens/hooks

| Field | Value |
|-------|--------|
| **ID** | TASK-061 |
| **Type** | Pending task |
| **Priority** | P1 — High |
| **Status** | open |
| **Area** | Phase 6 UI overhaul / Auth — Change Password |
| **Reported** | 2026-06-14 |

### Description

Change Password uses `useVaultColors` / `VaultType` with hardcoded style values and old `hapticSuccess` / `hapticWarning` helpers. Migrate it onto the Phase 6 foundation and `useHaptics()`.

### Scope

- Replace `useVaultColors()` / `VaultType.*` with `useTheme()` + `theme.typography.*`.
- Replace hardcoded spacing/radius/colors with `theme.spacing`, `theme.radius`, `theme.colors`.
- Replace `hapticSuccess` / `hapticWarning` with `useHaptics()` on the validation branches and success.
- Use `theme.motion` for any error / success transition; < 350ms.

### Related files

- `src/components/screens/change-password.tsx`
- `src/hooks/use-haptics.ts`, `src/hooks/use-theme.ts`, `src/theme/presets.ts`

### Acceptance criteria

- No `useVaultColors` / `VaultType` / hardcoded styles or direct haptic-helper calls remain.
- Validation + success use `useHaptics()`; motion via tokens; < 350ms.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 6.20 + 6.4 / 6.13 / 6.15.

---

<a id="task-062"></a>


## TASK-062: Swipe-to-action vault rows (copy/edit/delete)

| Field | Value |
|-------|--------|
| **ID** | TASK-062 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Vault list |
| **Reported** | 2026-06-14 |

### Description

Vault rows are plain `Pressable` — no swipe actions. Add gesture-driven swipe-to-action (reveal copy / edit / delete) with spring snap, haptic detents, and a full-swipe shortcut. (ROADMAP 7.1)

### Scope

- Use `react-native-gesture-handler` + Reanimated for an interruptible, reversible swipe.
- Reveal copy / edit / delete actions; spring snap to open/closed; haptic detent at threshold.
- Full-swipe triggers the primary action; source spring/timing from `theme/animations.ts`.

### Related files

- `src/components/vault/credential-row.tsx`
- `src/theme/animations.ts`, `src/hooks/use-haptics.ts`

### Acceptance criteria

- Rows swipe with spring physics, are interruptible/reversible, and fire haptic detents.
- Full-swipe shortcut works; reduced-motion variant respected (see TASK-077).
- Runs on the UI thread at 60fps; lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.1. Deep scan: **not implemented**.

---

<a id="task-063"></a>


## TASK-063: Long-press context menu + drag-to-reorder favorites

| Field | Value |
|-------|--------|
| **ID** | TASK-063 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Vault list |
| **Reported** | 2026-06-14 |

### Description

Add long-press → context menu and drag-to-reorder for favorites. Requires a favorite-order field in the data model (currently only an `isFavorite` boolean). (ROADMAP 7.2)

### Scope

- Long-press opens a context menu (`react-native-gesture-handler`); drag-to-reorder via Reanimated layout animations.
- Add an explicit favorite order to `Credential` + persist via vault context.
- Haptic on long-press activation and drop.

### Related files

- `src/components/vault/credential-row.tsx`, `src/components/screens/my-vault.tsx`
- `src/types/credential.ts`, `src/contexts/vault-context.tsx`
- `src/hooks/use-haptics.ts`, `src/theme/animations.ts`

### Acceptance criteria

- Long-press menu works; favorites reorder by drag and persist across restarts.
- Reorder uses layout animations at 60fps; reduced-motion variant respected.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.2. Deep scan: **not implemented** (no favorite-order field).

---

<a id="task-064"></a>


## TASK-064: Custom branded pull-to-refresh

| Field | Value |
|-------|--------|
| **ID** | TASK-064 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Vault & Dashboard |
| **Reported** | 2026-06-14 |

### Description

No pull-to-refresh exists. Add a custom branded animated indicator (shield/progress) instead of the default spinner. (ROADMAP 7.3)

### Scope

- Gesture-driven pull with an animated shield/progress drawn via Reanimated/SVG.
- Soft haptic at the refresh threshold (map already has `pullToRefresh`).
- Apply on the scrollable list screens (Vault, Dashboard).

### Related files

- `src/components/screens/main-vault.tsx`, `src/components/screens/dashboard.tsx`
- `src/hooks/use-haptics.ts`, `src/theme/animations.ts`

### Acceptance criteria

- Custom indicator animates with the pull; soft haptic at threshold.
- No default spinner; reduced-motion variant respected; 60fps.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.3. Deep scan: **not implemented**.

---

<a id="task-065"></a>


## TASK-065: Velocity-aware bottom sheet gestures

| Field | Value |
|-------|--------|
| **ID** | TASK-065 |
| **Type** | Pending task |
| **Priority** | P2 — Medium |
| **Status** | open |
| **Area** | Phase 7 Animation / Sheets |
| **Reported** | 2026-06-14 |

### Description

No bottom sheet exists. Add velocity-aware sheets with snap points, fling-to-dismiss, and a backdrop that fades with drag. (ROADMAP 7.4)

### Scope

- Add `@gorhom/bottom-sheet` (or equivalent Reanimated sheet); configure snap points.
- Fling-to-dismiss honoring gesture velocity; backdrop opacity interpolates with drag.
- Use for contextual actions (e.g. row actions, filters).

### Related files

- New `src/components/ui/bottom-sheet.tsx` (UI kit)
- `package.json` (add `@gorhom/bottom-sheet`)
- `src/theme/animations.ts`

### Acceptance criteria

- Sheet snaps to points, flings to dismiss by velocity, backdrop fades with drag.
- Gestures interruptible/reversible at 60fps; reduced-motion variant respected.
- Lint clean; no new `tsc` errors.

### Related

- ROADMAP Phase 7.4. Deep scan: **not implemented** (no sheet dependency).

---

<a id="task-066"></a>


---

**Navigation:** [↑ Index](./TASKS.md) · **Part 1 of 5** · [Part 2 →](./TASKS.part-02.md)
