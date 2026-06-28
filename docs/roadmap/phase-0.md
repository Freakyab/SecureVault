# Phase 0 — Foundation

**Goal:** Align on scope and prepare the codebase before UI work.

### Tasks
- [x] **0.1** Confirm product scope for v1 → **offline-only** for v1
- [x] **0.2** Choose styling approach → **StyleSheet + `securevault-theme.ts`**
- [x] **0.3** Choose icon library → **lucide-react-native**
- [x] **0.4** Use the [`screenshots/`](../screenshots) folder as the read-only design reference
- [x] **0.5** Document v1 feature list (must-have vs nice-to-have)
- [x] **0.6** Set up branch strategy / issue labels if using GitHub

### v1 feature checklist

**Must-have**
- [x] Onboarding (first launch) — UI + persist flag
- [x] Dashboard with category summary — mock data
- [x] Vault list + search + category filters — mock data
- [x] Add / edit / delete credential
- [x] Password generator + save to vault *(Generator tab + Add Credential prefill)*
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
