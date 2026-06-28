
> _Continued from [BUGS.md](./BUGS.md) — Part 2._

## Resolution log

> **Archived (2026-06-13):** The entries below describe work done on the previous codebase, which
> was replaced by the current UI-only rebuild. They are retained for historical context only and do
> **not** reflect functionality currently present in `src/`. All items above are reset to **open**.

| Date | ID | Resolution | By |
|------|-----|------------|-----|
| 2026-06-15 | BUG-020–037 | Deep audit of security services, vault context, routing, and screens — 18 new open bugs filed (crypto, biometrics, theme, mock screens, clipboard, races). | Cursor |
| 2026-06-14 | BUG-017 | Replaced tab stack route swaps with hidden Expo Router tabs and changed BottomNav to navigate between existing tab routes without re-triggering the active tab. | Cursor |
| 2026-06-14 | BUG-018 | Added themed scene backgrounds to nested auth/tab navigators so back transitions no longer reveal the default white surface. | Cursor |
| 2026-06-14 | BUG-019 | Split BottomNav into a clipped surface layer and non-clipping item layer, giving the raised active indicator room to render cleanly. | Cursor |
| 2026-06-14 | BUG-015 | Follow-up: stop awaiting SecureStore biometric key write (was hanging setup on Android); state-driven navigation after unlock. | Cursor |
| 2026-06-14 | BUG-016 | Biometric toggles: shared `Toggle` on setup, `SettingsRow` no longer wraps toggles in dead `Pressable`, `Toggle.disabled` prop. | Cursor |
| 2026-06-13 | BUG-012 | Setup biometric toggle wired to real `expo-local-authentication` availability with context-aware messaging; defaults on only when supported+enrolled. | Cursor |
| 2026-06-13 | POT-008 | Mitigated: per-domain logo status cache + icon fallback prevents wrong/again-fetched brand icons for uncommon domains. | Cursor |
| 2026-06-13 | POT-002 | Mitigated by `mergeCredentials` identity-key dedupe on import. | Cursor |
| 2026-06-13 | BUG-007 | Dashboard menu icon routes to `/settings` instead of locking the vault (`dashboard.tsx`). | Cursor |
| 2026-06-13 | BUG-008 | Rebuilt Main Vault header with a left-aligned shield icon + "Main Vault" title + password count (`main-vault.tsx`). | Cursor |
| 2026-06-13 | BUG-009 | Made the Main Vault "Security Pulse" alert card a pressable that opens `/health` (Dashboard banner already pressable). | Cursor |
| 2026-06-13 | BUG-010 | Main Vault rows now open edit via `useNavigationLock` + `{ params: { id } }`, preventing duplicate edit screens and fixing untargeted edits. | Cursor |
| 2026-06-13 | POT-003 | Mitigated by `useNavigationLock` + id-based edit routing on Home and Vault rows, preventing stale-account navigation on rapid taps. | Cursor |
| 2026-06-13 | BUG-002 | Root routing now sends new users through onboarding to master-password setup, and initialized users to unlock/dashboard based on vault state. | Cursor |
| 2026-06-13 | BUG-006 | Added AsyncStorage-backed vault setup with salted master-password hash, metadata, and unlocked session state after creation. | Cursor |
| 2026-06-13 | BUG-005 | Add Credential now validates and persists credentials through `VaultContext`, then shows saved entries in the Vault list. | Cursor |
| 2026-06-13 | BUG-003 | Confirmed Add Credential uses a back/close header control via `VaultHeader showBack`, preserving a cancel path before save. | Cursor |
| 2026-06-13 | BUG-004 | Quick-site chips now set both website name and canonical URL every time they are tapped. | Cursor |
| 2026-06-13 | BUG-011 | Health metrics now derive from live credentials in shared context and update on Dashboard, Vault, and Health after saves. | Cursor |
| 2026-06-13 | BUG-013 | Added protected route guards across setup, unlock, dashboard, vault, health, settings, my-vault, add, and edit routes. | Cursor |
| 2026-06-13 | POT-004 | Mitigated by deriving health counts from current `credentials` state instead of static mock values. | Cursor |
| 2026-05-17 | BUG-002 | Onboarding now returns to the root auth gate, which redirects uninitialized users to master password setup. | Cursor |
| 2026-05-17 | BUG-006 | Vault setup/unlock metadata now uses local AsyncStorage persistence instead of SecureStore for the current app build. | Cursor |
| 2026-05-17 | BUG-003 | Added an accessible close button to the credential editor header so users can dismiss add/edit credential without saving. | Cursor |
| 2026-05-17 | BUG-004 | Website suggestion chips now always set the matching canonical URL using the shared site-domain resolver. | Cursor |
| 2026-05-17 | BUG-005 | Save credential flow is resolved by the BUG-006 vault setup/storage fix, which allows the vault to initialize and unlock before persisting credentials. | Cursor |
| 2026-05-17 | BUG-007 | Home menu icon now opens a side navigation panel; locking the vault is an explicit labeled action inside the menu. | Cursor |
| 2026-05-17 | BUG-008 | Moved the vault icon/title to the left header and replaced the old right vault action with dedicated Import CSV and Export CSV controls. | Cursor |
| 2026-05-17 | BUG-010 | Added an edit-navigation lock in Home and Vault lists plus disabled row actions during route transition, preventing duplicate `entry/[id]` screens/dialogs from repeated taps. | Cursor |
| 2026-05-17 | BUG-011 | Made vault persistence optimistic (with rollback on failure) so credential mutations update in-memory state immediately, keeping Health/Home/Vault metrics in sync after add/edit/delete/import. | Cursor |
| 2026-05-17 | BUG-012 | Fixed biometric setup toggle UX by replacing silent disabled gating with explicit availability feedback, making the row pressable, and defaulting supported devices to biometric enabled. | Cursor |
| 2026-05-17 | BUG-009 | Security alert cards are now pressable and open an affected-accounts dialog (weak/reused/old) with direct account actions to open credential details. | Cursor |
| 2026-05-17 | BUG-013 | Added auth-route hard guards and disabled auth-stack back gestures so onboarding/setup cannot be bypassed via swipe-back, history, or direct access to tabs/settings/entry before unlock. | Cursor |
| 2026-05-17 | POT-001 | Mitigated auto-lock vs save race by tracking in-flight persists, deferring lock until save completion, and preventing stale rollback after a lock session change. | Cursor |
| 2026-05-17 | POT-002 | Verified CSV import dedupe already blocks re-import duplicates using normalized domain+username identity keys from existing and incoming credentials. | Cursor |
| 2026-05-17 | POT-003 | Switched grouped-account dialog selection to key-based live lookup in Home and Vault, preventing stale account routing after rapid search/filter updates. | Cursor |
| 2026-05-17 | POT-004 | Verified bulk CSV import writes through optimistic `persist`, and Home/Vault/Health badges recalculate from current `credentials` via shared health metrics without delayed refresh drift. | Cursor |

---


## Related docs

- [TASKS.md](./TASKS.md) — pending feature/engineering tasks
- [ROADMAP.md](./ROADMAP.md) — feature phases and overall progress
- [README.md](./README.md) — run instructions

---

*When closing a bug, update the counts above and add a row to the Resolution log.*


---

**Navigation:** [← Part 2](./BUGS.part-02.md) · **Part 3 of 3** · [↑ Index](./BUGS.md)
