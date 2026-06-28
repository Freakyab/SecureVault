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
