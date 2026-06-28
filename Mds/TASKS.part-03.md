
> _Continued from [TASKS.md](./TASKS.md) — Part 2._

## TASK-013: UX feedback polish

| Field | Value |
|-------|--------|
| **ID** | TASK-013 |
| **Type** | Pending task / Polish |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | UX / Feedback |
| **Reported** | 2026-05-17 |
| **Roadmap** | 5.2, 5.3, 5.4, 5.6 |

### Description

Improve production polish with haptics, loading/skeleton states, toast/snackbar feedback, and complete empty / skip / logout flows.

### Expected

- Copy, save, delete, and key success/error actions provide consistent feedback.
- Long-running screens show loading or skeleton states.
- Empty states are useful across Dashboard, Vault, Health, and Search.
- Onboarding skip/logout flows behave intentionally.

### Related files

- `app/(tabs)/index.tsx`
- `app/(tabs)/vault.tsx`
- `app/(tabs)/health.tsx`
- `app/entry/[id].tsx`
- `contexts/auth-context.tsx`

### Suggested fix

1. Add a shared feedback pattern before duplicating alerts.
2. Use `expo-haptics` where available and safe.
3. Audit empty/loading/error states screen by screen.

### Resolution

1. Added `ToastProvider` + `useToast()`, `feedback.ts` (clipboard + haptics), and wired copy/save/delete feedback across Dashboard, Main Vault, Edit Credential, and Add Credential screens.

---

<a id="task-014"></a>


## TASK-014: Accessibility and dynamic type pass

| Field | Value |
|-------|--------|
| **ID** | TASK-014 |
| **Type** | Pending task / Accessibility |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Accessibility / UI |
| **Reported** | 2026-05-17 |
| **Roadmap** | 5.5 |

### Description

Run an accessibility pass for labels, contrast, touch targets, screen-reader behavior, and dynamic type support where possible.

### Expected

- Interactive controls have useful accessibility labels and roles.
- Touch targets meet mobile accessibility expectations.
- Text remains readable with larger system font settings.
- Light/dark mode contrast is checked.

### Related files

- `components/ui/*`
- `components/navigation/pill-tab-bar.tsx`
- `app/(tabs)/*`
- `app/(auth)/*`
- `app/entry/[id].tsx`

### Suggested fix

1. Start with shared UI primitives.
2. Audit every main screen with screen-reader semantics in mind.
3. Fix contrast and text scaling issues using existing theme tokens.

---

<a id="task-015"></a>


## TASK-015: Security hardening pass

| Field | Value |
|-------|--------|
| **ID** | TASK-015 |
| **Type** | Pending task / Security |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Security / Privacy |
| **Reported** | 2026-05-17 |
| **Roadmap** | 5.7, 5.8, 5.9 |

### Description

Complete a security hardening pass before beta, including screenshot policy, clipboard auto-clear, and a documented review checklist.

### Expected

- Copied passwords are cleared after a short timeout where platform APIs allow it.
- Screenshot / screen-capture policy is decided and implemented if in scope.
- Security review checklist covers crypto, storage, logging, clipboard, and network behavior.

### Related files

- `app/entry/[id].tsx`
- `app/(tabs)/generator.tsx`
- `services/crypto/vault-crypto.ts`
- `services/vault-storage.ts`
- `README.md`

### Suggested fix

1. Implement clipboard auto-clear first because passwords are copied today.
2. Decide whether to add `expo-screen-capture`.
3. Document the security checklist and mark known tradeoffs.

---

<a id="task-016"></a>


## TASK-016: Release readiness and store assets

| Field | Value |
|-------|--------|
| **ID** | TASK-016 |
| **Type** | Pending task / Release |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Release / Store prep |
| **Reported** | 2026-05-17 |
| **Roadmap** | 5.12, 5.13, 5.14, 5.15, 5.16 |

### Description

Prepare the app for internal/beta distribution with assets, legal docs, EAS profiles, testing tracks, and store listing copy.

### Expected

- App icon, splash screen, and store screenshots are ready.
- Privacy policy and terms exist.
- EAS build profiles support development, preview, and production.
- TestFlight / internal testing track setup is documented.
- Store listing copy is drafted.

### Related files

- `app.json`
- `README.md`
- `assets/*`
- `package.json`

### Suggested fix

1. Update Expo config for final assets.
2. Add EAS configuration if missing.
3. Document release commands and beta checklist.

---

<a id="task-017"></a>


## TASK-017: Backend and cloud sync (optional)

| Field | Value |
|-------|--------|
| **ID** | TASK-017 |
| **Type** | Pending task / Optional backend |
| **Priority** | P3 — Low / Optional |
| **Status** | open |
| **Area** | Backend / Sync |
| **Reported** | 2026-05-17 |
| **Roadmap** | 6.1–6.8 |

### Description

Plan and implement optional multi-device cloud sync only if the product moves beyond offline-first v1.

### Expected

- API structure follows project backend rules.
- Auth model is documented.
- Server stores encrypted vault blobs, preferably zero-knowledge.
- Conflict strategy is documented.
- Mobile app uses a clear sync status and offline queue.

### Related files

- `.cursor/rules/backend-mongodb.mdc`
- `contexts/vault-context.tsx`
- `services/vault-storage.ts`
- `ROADMAP.md`

### Suggested fix

1. Resolve whether cloud sync is in scope.
2. Document auth/session and conflict strategy before coding.
3. Keep local encrypted vault behavior working offline.

---

<a id="task-018"></a>


## TASK-018: Credential sharing (optional)

| Field | Value |
|-------|--------|
| **ID** | TASK-018 |
| **Type** | Pending task / Optional feature |
| **Priority** | P3 — Low / Optional |
| **Status** | open |
| **Area** | Sharing / Security |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 0 nice-to-have |

### Description

Explore secure credential sharing for a future release.

### Expected

- Sharing model is designed before implementation.
- Permissions, expiration, revocation, and audit behavior are documented.
- No plaintext credential sharing is introduced.

### Related files

- `ROADMAP.md`
- `types/credential.ts`
- `services/crypto/vault-crypto.ts`

### Suggested fix

1. Defer until cloud/account model is decided.
2. Write a threat model before adding UI.
3. Prototype only after encryption and revocation approach is clear.

---

<a id="task-019"></a>


## TASK-019: Browser extension (optional)

| Field | Value |
|-------|--------|
| **ID** | TASK-019 |
| **Type** | Pending task / Optional platform |
| **Priority** | P3 — Low / Optional |
| **Status** | open |
| **Area** | Browser extension / Autofill |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 0 nice-to-have |

### Description

Track a future browser extension for autofill and desktop workflows.

### Expected

- Extension is scoped separately from the mobile v1 app.
- Security model covers vault unlock, local storage, and page injection risks.
- Sync dependency is understood before implementation.

### Related files

- `ROADMAP.md`

### Suggested fix

1. Keep deferred until backend/sync direction is clear.
2. Define supported browsers and autofill UX.
3. Build a separate implementation plan before coding.

---

<a id="task-020"></a>


## TASK-020: Optional fingerprint unlock for vault access

| Field | Value |
|-------|--------|
| **ID** | TASK-020 |
| **Type** | Pending task / Security feature |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Auth / Vault unlock / Biometrics |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 5 security hardening |

### Description

Add a fingerprint/biometric unlock option so users do not need to enter the master password every time they open the app. This should only be available when the user explicitly enables fingerprint unlock while creating the master password.

### Expected

- Master password setup includes an optional **Enable fingerprint unlock** choice.
- If enabled, the unlock screen lets the user open the vault with fingerprint/biometric authentication.
- If not enabled, the app continues to require the master password.
- Biometric unlock never bypasses initial master password creation.
- Users can disable fingerprint unlock later from settings/security.

### Current risk

- Adding biometrics without an explicit opt-in could weaken user trust.
- The app must still handle devices without biometric hardware, disabled biometrics, or changed biometric enrollment.
- The encrypted vault key handling needs a security review before implementation.

### Current state (diagnosed 2026-06-13)

Fingerprint/Face ID unlock **does not work because it was never implemented** — it is only a UI placeholder:

- The fingerprint button on `src/components/screens/unlock-vault.tsx` (lines ~50–56) only fires `Alert.alert('Biometrics unavailable', 'Use your master password for now.')`. It never calls any biometric API.
- `expo-local-authentication` is **not installed** (absent from `package.json`), so there is no native biometric capability wired up at all.
- The Settings "biometric" toggle and `setupMasterPassword(password, biometricEnabled)` only persist a `biometricEnabled` flag via `updateSettings`/storage. Nothing ever reads that flag to trigger a scan.

### Related files

- `src/components/screens/unlock-vault.tsx` (button is a stub)
- `src/components/setup-master-password.tsx`
- `src/components/screens/settings.tsx` (toggle stores flag only)
- `src/contexts/vault-context.tsx`
- `src/services/vault-storage.ts`
- `package.json` (missing `expo-local-authentication`)

### Suggested fix

1. Install `expo-local-authentication` and add a persisted opt-in flag during master password setup (the flag already exists; wire it to real behavior).
2. On the unlock screen, check `hasHardwareAsync()` + `isEnrolledAsync()`; when `settings.biometricEnabled` is on, call `authenticateAsync()` to unlock the vault (auto-prompt on mount and on button tap).
3. Store any biometric unlock metadata securely and never store the raw master password.
4. Show/enable the fingerprint button only when the user opted in and the device supports it; hide/disable it otherwise, and gate the Settings toggle on hardware availability.
5. Add fallback to master password when biometric auth fails or is unavailable.

### Resolution (Run 3)

1. Installed `expo-local-authentication`; new `services/biometric.ts` wraps `hasHardwareAsync` / `isEnrolledAsync` / `supportedAuthenticationTypesAsync` / `authenticateAsync` with safe web + error fallbacks and a friendly method label.
2. Setup screen opt-in (BUG-012) persists `settings.biometricEnabled`. The unlock screen now auto-prompts the scanner on mount when enabled+available, and the fingerprint button calls `authenticateWithBiometrics` → `unlockWithBiometrics()`.
3. `unlockWithBiometrics` uses `touchVaultUnlock()` (records `lastUnlockedAt` without re-entering the password); raw master password is never stored.
4. The fingerprint button is shown only when the user opted in and the device supports it; master-password entry always remains as fallback.

---

<a id="task-021"></a>


## TASK-021: Favorite and archive accounts on SecureVault page

| Field | Value |
|-------|--------|
| **ID** | TASK-021 |
| **Type** | Pending task / Feature |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Vault / Account organization / UX |
| **Reported** | 2026-05-17 |

### Description

Add favorite and archive actions for saved accounts on the SecureVault/Vault page so users can keep important credentials easy to find and hide old or inactive accounts without deleting them.

### Expected

- Users can mark/unmark a credential as **favorite** from the Vault account row or detail screen.
- Users can **archive** a credential without deleting it.
- Archived credentials are hidden from the default Vault list but remain recoverable from an archive filter/view.
- Favorite credentials are visually marked and can be filtered or sorted near the top.
- Dashboard and Health behavior for archived credentials is defined before implementation.

### Current risk

- Archiving should not be confused with deleting; the UI needs clear labels and confirmation where appropriate.
- Health metrics may become confusing if archived credentials still count as weak/reused.
- Data model changes should remain backward-compatible with existing vault entries.

### Related files

- `types/credential.ts`
- `contexts/vault-context.tsx`
- `app/(tabs)/vault.tsx`
- `app/entry/[id].tsx`
- `components/vault/credential-list-item.tsx`

### Suggested fix

1. Add `isFavorite` and `isArchived` fields to credentials with safe defaults.
2. Add favorite/archive actions to Vault rows and/or credential detail.
3. Add Vault filters for **Favorites** and **Archived**.
4. Decide whether archived credentials count in Dashboard and Health metrics.
5. Add manual QA for favorite, archive, unarchive, search, and category filtering.

### Resolution

1. `isFavorite`/`isArchived` fields + `toggleFavorite`/`toggleArchive` already exist in `vault-context`; Edit Credential exposes both toggles.
2. Main Vault now has primary **Active / Favorites / Archived** view pills plus the existing category chips (`src/components/screens/main-vault.tsx`). Active hides archived, Favorites shows starred non-archived, Archived recovers hidden items.
3. Each row shows a star toggle (`onToggleFavorite`) with toast feedback; favorites are visually marked via the filled star in `CredentialRow`.
4. Archived credentials are excluded from Dashboard counts/recents and the security-pulse alert is hidden in the Archived view.

---

<a id="task-022"></a>


## TASK-022: Google login for account creation

| Field | Value |
|-------|--------|
| **ID** | TASK-022 |
| **Type** | Pending task / Auth feature |
| **Priority** | P3 — Low / Optional |
| **Status** | open |
| **Area** | Auth / Account creation / Backend |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 9 backend & sync |

### Description

Add **Continue with Google** support so users can create a SecureVault account using their Google account instead of entering email/password manually.

### Expected

- Account creation screen includes a **Continue with Google** option.
- Google login creates or links a SecureVault user account.
- Existing local vault security still requires the master password / vault unlock flow.
- Auth state is persisted safely and supports logout.
- Google auth setup works for Android, iOS, and Expo development builds.

### Current risk

- Google login requires backend account/session handling and OAuth configuration.
- Account login must not weaken vault encryption or replace the master password by default.
- Cloud account identity and encrypted vault sync need clear separation.

### Related files

- `app/(auth)/onboarding.tsx`
- `app/(auth)/setup-master-password.tsx`
- `contexts/auth-context.tsx`
- `contexts/vault-context.tsx`
- `ROADMAP.md`

### Suggested fix

1. Choose the auth provider flow for Expo Google sign-in.
2. Add backend account creation/linking before enabling Google login in production.
3. Add a Google sign-in button to the auth/account creation flow.
4. Keep master password setup required for vault encryption after account creation.
5. Add logout and account unlinking behavior.

---

<a id="task-023"></a>


## TASK-023: Modify edit credential page

| Field | Value |
|-------|--------|
| **ID** | TASK-023 |
| **Type** | Pending task / UX improvement |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Entry / Edit credential / UX |
| **Reported** | 2026-05-17 |

### Description

Improve the edit credential page so updating saved accounts feels clearer, safer, and easier to use.

### Expected

- Edit mode has a clear page title, close/cancel action, and save action.
- Existing credential details are easy to review and modify.
- Important actions like copy password, show/hide password, favorite/archive, and delete are placed consistently.
- Validation errors are visible near the relevant fields.
- Unsaved changes are handled safely before closing.

### Current risk

- The add/edit flow can become crowded as more account actions are added.
- Users may accidentally lose changes if navigation or close behavior is unclear.
- Favorite/archive work should fit this page without duplicating Vault row actions.

### Related files

- `app/entry/[id].tsx`
- `components/ui/input.tsx`
- `components/ui/password-input.tsx`
- `contexts/vault-context.tsx`
- `types/credential.ts`

### Suggested fix

1. Review current add/edit layout and separate create vs edit-specific actions where needed.
2. Improve header, save/cancel placement, and destructive action grouping.
3. Add unsaved-change handling before dismissing edited credentials.
4. Ensure the page supports upcoming favorite/archive fields cleanly.
5. Test editing website, URL, username, password, category, and notes.

### Resolution

1. Full rewrite of `edit-credential.tsx`: loads credential by `id`, sectioned form, favorite/archive toggles, password history (reveal/copy/restore), save/delete with toast + haptic feedback.

---

<a id="task-024"></a>


## TASK-024: Copy passwords and show usernames on Home/Vault

| Field | Value |
|-------|--------|
| **ID** | TASK-024 |
| **Type** | Pending task / UX improvement |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Home / Vault / Credential actions |
| **Reported** | 2026-05-17 |

### Description

Add a clear way to copy saved passwords, and remove the blur from usernames on the Home and Vault pages so users can identify accounts without opening each credential.

### Expected

- Users can copy a credential password from the relevant row/detail action.
- Copy action gives visible feedback, such as toast/snackbar or button state.
- Usernames are readable on Home and Vault pages.
- Passwords remain masked/blurred by default unless explicitly revealed or copied.
- Copy behavior works for grouped multiple-account entries.

### Current risk

- Copy actions can expose sensitive data through the clipboard if not paired with clear feedback and future clipboard auto-clear.
- Removing username blur should not accidentally reveal passwords.
- Grouped duplicate-site rows need a clear account selection before copying.

### Related files

- `app/(tabs)/index.tsx`
- `app/(tabs)/vault.tsx`
- `app/entry/[id].tsx`
- `components/vault/credential-list-item.tsx`
- `contexts/vault-context.tsx`

### Suggested fix

1. Add password copy affordance to credential rows or detail actions.
2. Use platform clipboard APIs with success feedback.
3. Remove username blur styling on Home and Vault list rows.
4. Keep password masking intact by default.
5. Verify behavior for single credentials and grouped same-site credentials.

### Resolution

1. `CredentialRow` shows a copy button (`onCopy`) wired on both Dashboard and Main Vault to `copyToClipboard` (`expo-clipboard`) + haptic + a toast ("&lt;site&gt; password copied").
2. Usernames render in clear text (`detail={credential.username || 'No username'}`); passwords are never shown in rows, only copied to clipboard.

---

<a id="task-025"></a>


## TASK-025: Delete all local data and master password from storage

| Field | Value |
|-------|--------|
| **ID** | TASK-025 |
| **Type** | Pending task / Security feature |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Settings / Vault storage / Auth reset |
| **Reported** | 2026-05-17 |

### Description

Add a destructive reset option that deletes all local vault data, local app data, stored vault metadata, and any master-password-related storage so the app returns to a fresh setup state.

### Expected

- User can choose a **Delete all local data** / **Reset SecureVault** action.
- Action clears encrypted vault data, local credential cache, onboarding/auth state if needed, vault metadata, biometric opt-in, and master-password-derived storage.
- App locks/logs out immediately and returns to onboarding or master password setup.
- User must confirm the destructive action before deletion.
- The reset action is clearly labeled as irreversible for local data.

### Current risk

- Partial deletion could leave the app in a broken initialized-but-unusable state.
- Accidentally exposing this action without confirmation could cause data loss.
- Secure storage and AsyncStorage keys must be cleared together.

### Related files

- `contexts/auth-context.tsx`
- `contexts/vault-context.tsx`
- `services/vault-storage.ts`
- `services/crypto/vault-crypto.ts`
- `app/(auth)/setup-master-password.tsx`
- `app/(auth)/unlock.tsx`

### Suggested fix

1. Add a single reset helper that clears all vault/auth storage keys.
2. Wire a guarded UI action behind confirmation.
3. Clear in-memory vault state after storage deletion.
4. Redirect user to the fresh app setup flow.
5. Manually test reset after setup, unlock, imported data, and failed setup states.

### Resolution

1. Settings **Delete Everything** button calls `resetVault()` behind a destructive `Alert`, clears AsyncStorage, and routes to `/` with toast feedback (`src/components/screens/settings.tsx`).

---

<a id="task-026"></a>


## TASK-026: Settings page for vault and app controls

| Field | Value |
|-------|--------|
| **ID** | TASK-026 |
| **Type** | Pending task / Feature |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Settings / Security / Preferences |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 5 polish & release prep |

### Description

Add a Settings page that centralizes important vault and app controls, including changing the master password, disabling biometrics, resetting local data, selecting app theme, and configuring auto-lock timeout.

### Expected

- Settings page is reachable from the app shell or Home menu.
- User can change master password after confirming the current password.
- User can disable biometric unlock if it is enabled.
- User can reset local data from a clearly destructive action.
- User can choose app theme preference if app-level theme override is supported.
- User can configure auto-lock timeout.

### Current risk

- Settings will gather security-sensitive actions and needs careful confirmation UX.
- Master password change must re-encrypt the vault without data loss.
- Theme and lock settings need safe defaults and persistence.

### Related files

- `app/(tabs)/index.tsx`
- `app/(auth)/unlock.tsx`
- `contexts/auth-context.tsx`
- `contexts/vault-context.tsx`
- `contexts/securevault-theme-context.tsx`
- `services/vault-storage.ts`

### Suggested fix

1. Add a Settings route/screen.
2. Group actions into Security, Appearance, and Data sections.
3. Reuse existing biometric disable and reset-local-data helpers.
4. Add master-password-change flow with vault re-encryption.
5. Persist theme and auto-lock preferences.

### Resolution

1. Settings screen wired to `useVault()` settings: biometric toggle, dark mode, password history recording, export/import stubs, and destructive reset — all persisted via `updateSettings()`.

---

<a id="task-027"></a>


## TASK-027: App lock controls and configurable auto-lock

| Field | Value |
|-------|--------|
| **ID** | TASK-027 |
| **Type** | Pending task / Security feature |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | App lock / Security / Settings |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 5 security hardening |

### Description

Add explicit app lock controls, including a manual lock button and configurable auto-lock timeout, so users can decide when SecureVault requires re-authentication.

### Expected

- User can manually lock the vault from a clear **Lock vault** action.
- Auto-lock timeout can be configured from Settings.
- Timeout options use safe presets, such as immediately, 1 minute, 5 minutes, 15 minutes, and never only if allowed.
- App consistently locks after background/inactivity according to the selected timeout.

### Current risk

- Lock controls can conflict with the current Home menu icon behavior.
- Too-long timeout options may weaken security.
- Configurable lock state must work with biometric unlock fallback.

### Related files

- `contexts/vault-context.tsx`
- `app/(tabs)/index.tsx`
- `app/(auth)/unlock.tsx`
- `services/vault-storage.ts`

### Suggested fix

1. Replace ambiguous lock/menu actions with an explicit lock control.
2. Move auto-lock duration to persisted settings.
3. Use configured timeout in app-state lock logic.
4. Validate manual lock behavior with master password and biometric unlock.

### Resolution

1. Added **Lock Vault Now** action (calls `lockVault()` → `/unlock`) and expandable auto-lock preset chips using `AUTO_LOCK_PRESETS`, persisted via `updateSettings()`.

---

<a id="task-028"></a>


## TASK-028: AI-assisted vault folders and tags

| Field | Value |
|-------|--------|
| **ID** | TASK-028 |
| **Type** | Pending task / Organization feature |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Vault organization / AI / Tags |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 3 local vault & security |

### Description

Add folders/tags beyond fixed categories, with optional AI-assisted suggestions to help organize credentials automatically.

### Expected

- Credentials can have user-managed folders and tags.
- Vault can filter/search by folder and tag.
- AI suggestions can propose tags/folders from website/domain/account label.
- User approves suggested organization before it is applied.
- Local/offline behavior remains usable even if AI is unavailable.

### Current risk

- AI features may require network access and privacy review.
- Tags/folders must not leak sensitive vault data.
- Data model changes need migrations for existing credentials.

### Related files

- `types/credential.ts`
- `contexts/vault-context.tsx`
- `app/(tabs)/vault.tsx`
- `app/entry/[id].tsx`

### Suggested fix

1. Add folder/tag fields to credential model.
2. Build manual folder/tag management first.
3. Add AI suggestions as an optional layer with explicit user confirmation.
4. Document what data, if any, leaves the device.

---

<a id="task-029"></a>


## TASK-029: Advanced vault search improvements

| Field | Value |
|-------|--------|
| **ID** | TASK-029 |
| **Type** | Pending task / UX improvement |
| **Priority** | P1 — High |
| **Status** | done |
| **Area** | Vault / Search / Filtering |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 3 local vault & security |

### Description

Improve search so users can find credentials by website, username, notes, category, and account label.

### Expected

- Search checks website, URL/domain, username, notes, category, and account label.
- Search results remain fast for local vault data.
- Matching duplicate-site accounts remain distinguishable.
- Search works consistently on Vault, Home/recent lists, and any account picker.

### Current risk

- Notes search may expose more sensitive context in results.
- Search logic can become duplicated across screens.
- Account labels and grouped credentials need consistent matching.

### Related files

- `app/(tabs)/vault.tsx`
- `app/(tabs)/index.tsx`
- `components/vault/credential-list-item.tsx`
- `contexts/vault-context.tsx`
- `types/credential.ts`

### Suggested fix

1. Create a shared credential search helper.
2. Include all supported fields in normalized search text.
3. Reuse the helper across Vault, Home, and grouped account picker.
4. Add manual QA for each searchable field.

### Resolution

1. Shared `src/services/credential-search.ts` (`buildCredentialSearchText`, `matchesCredentialQuery`, `filterCredentials`) normalizes website, url, username, category, accountLabel, notes, folder, and tags into a token-AND search.
2. Both Dashboard and Main Vault now use `filterCredentials` instead of bespoke inline filters, so search matches identical fields everywhere.

---

<a id="task-030"></a>


## TASK-030: Credential password history

| Field | Value |
|-------|--------|
| **ID** | TASK-030 |
| **Type** | Pending task / Security feature |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Vault / Credential history / Security |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 3 local vault & security |

### Description

Track previous passwords for a credential so users can review password changes and avoid accidentally reusing old passwords for the same account.

### Expected

- When a credential password changes, the previous password is stored in encrypted vault data.
- History is visible from the credential detail/edit page.
- Password history remains masked by default.
- User can clear history for a credential if desired.
- Health checks can optionally warn when a password was reused from history.

### Current risk

- Storing old passwords increases sensitive data retained in the vault.
- UI must explain why history exists and how to clear it.
- Import/migration logic must initialize history safely.

### Related files

- `types/credential.ts`
- `contexts/vault-context.tsx`
- `app/entry/[id].tsx`
- `services/health-checks.ts`

### Suggested fix

1. Add an encrypted password history field to credentials.
2. Append previous password only when password changes.
3. Add masked history UI in credential detail.
4. Add clear-history action with confirmation.

### Resolution

1. `updateCredential` appends prior password to `passwordHistory` (capped at 10) when password changes; Edit Credential shows masked history with reveal/copy/restore actions.

---

<a id="task-031"></a>


## TASK-031: Stronger duplicate password warnings

| Field | Value |
|-------|--------|
| **ID** | TASK-031 |
| **Type** | Pending task / Health enhancement |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Password Health / Reuse warnings |
| **Reported** | 2026-05-17 |
| **Roadmap** | Phase 4 password health |

### Description

Improve reused-password detection UX so duplicate password warnings are clearer, more actionable, and easier to resolve.

### Expected

- Health page groups accounts that share the same password.
- Vault rows show stronger reused-password indicators.
- User can tap a duplicate warning to see all affected accounts.
- Duplicate warnings explain why reuse is risky without exposing passwords.
- Resolution flow points users toward editing or generating a new password.

### Current risk

- Current reused-password checks may be technically correct but not actionable enough.
- Grouping duplicate passwords must not reveal the password value.
- Warnings should avoid noisy false urgency for intentionally duplicated test/demo entries.

### Related files

- `services/health-checks.ts`
- `app/(tabs)/health.tsx`
- `app/(tabs)/vault.tsx`
- `components/vault/credential-list-item.tsx`

### Suggested fix

1. Group reused-password findings by password hash/comparison key in memory.
2. Add a clear affected-accounts view.
3. Improve copy and severity labels for duplicate-password warnings.
4. Link each affected row to edit/generate a new password.

---

<a id="task-032"></a>


## TASK-032: Inline weak/reused/old badges on credential rows

| Field | Value |
|-------|--------|
| **ID** | TASK-032 |
| **Type** | Pending task / Health enhancement |
| **Priority** | P2 — Medium |
| **Status** | done |
| **Area** | Vault / Dashboard / Password Health |
| **Reported** | 2026-06-13 |
| **Roadmap** | 4.8 |

### Description

Surface password risk inline on credential rows (Dashboard + Vault) so users can spot weak, reused, or old passwords without opening Password Health.

### Resolution (Run 3)

1. `CredentialRow` accepts an optional `badges` prop (`weak` / `reused` / `old` / `breached`) and renders the single highest-severity pill next to the name with matching theme color + an accessibility hint.
2. Dashboard and Main Vault build `weakIds` / `reusedIds` / `oldIds` sets from `computeHealthMetrics` and pass per-row membership.

---

<a id="task-033"></a>


---

**Navigation:** [← Part 2](./TASKS.part-02.md) · **Part 3 of 5** · [Part 4 →](./TASKS.part-04.md)
