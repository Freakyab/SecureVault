# SecureVault — Test Scenarios

Manual and exploratory test scenarios for **all features implemented to date** (Phases 2–5 + Phase 7 PoC).

**Last updated:** 2026-06-14  
**Roadmap progress at time of writing:** 78 / 150 (52%)  
**Automated tests:** `npm test` — 19 tests in `src/services/__tests__/` (crypto, generator, health-checks)

---

## How to use this document

| Column | Meaning |
|--------|---------|
| **ID** | Unique scenario identifier (`TC-<area>-<nn>`) |
| **Priority** | P0 = release blocker · P1 = core flow · P2 = important edge case · P3 = polish / deferred |
| **Status** | ✅ Implemented · 🟡 Partial · ⬜ Not yet built |

Each scenario includes **Preconditions**, **Steps**, and **Expected result**.  
Run on **iOS + Android** (Expo Go or dev build) unless noted.

### Legend — feature coverage

| Phase | Area | Roadmap status |
|-------|------|----------------|
| 2 | Onboarding, Dashboard, Vault, Generator, Health UI | 🟡 61% |
| 3 | Vault CRUD, encryption, generator save, search, favorites/archive | 🟡 96% |
| 4 | Password health scoring, reuse, breach monitor | ✅ 100% |
| 5 | Settings, backup, haptics, clipboard, auto-lock | 🟡 61% |
| 7 | Premium tokens, Dashboard PoC, PressableScale | 🟡 27% |

---

## 1. First launch & vault setup

### TC-SETUP-01 — Fresh install routes to setup
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | App never opened, or vault reset from Settings |
| **Steps** | 1. Launch app |
| **Expected** | "Initialize Your Vault" screen appears; no tab bar visible |

### TC-SETUP-02 — Master password too short rejected
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | On setup screen |
| **Steps** | 1. Enter password `short123` (11 chars) in both fields<br>2. Tap **CREATE VAULT** |
| **Expected** | Alert: "Use a stronger password" — vault not created |

### TC-SETUP-03 — Password mismatch rejected
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | On setup screen |
| **Steps** | 1. Enter `MySecurePass12` and `MySecurePass13` in confirm<br>2. Tap **CREATE VAULT** |
| **Expected** | Alert: "Passwords do not match" |

### TC-SETUP-04 — Successful vault creation (happy path)
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Fresh install |
| **Steps** | 1. Enter matching passwords ≥ 12 chars<br>2. Leave biometric toggle as detected<br>3. Tap **CREATE VAULT** |
| **Expected** | Loading modal cycles messages ("Deriving…", "Applying AES-256…"); lands on Dashboard; vault unlocked; empty credential list |

### TC-SETUP-05 — Biometric toggle on unsupported device
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Device with no biometric hardware or no enrolled biometrics |
| **Steps** | 1. Try to enable biometric toggle |
| **Expected** | Alert explains biometrics unavailable; toggle stays off; vault still creatable with master password only |

### TC-SETUP-06 — Show/hide password on setup
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Preconditions** | On setup screen |
| **Steps** | 1. Type password<br>2. Tap eye icon<br>3. Tap again |
| **Expected** | Text toggles between masked and visible; accessibility label updates |

### TC-SETUP-07 — PBKDF2 derivation delay UX
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Preconditions** | Real device (not web) |
| **Steps** | 1. Create vault with strong password |
| **Expected** | Loading overlay visible up to ~15 s; UI not frozen; success navigates to app |

---

## 2. Unlock & lock

### TC-UNLOCK-01 — Correct master password unlocks
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Vault initialized; app locked (restart or manual lock) |
| **Steps** | 1. Enter correct master password<br>2. Submit |
| **Expected** | Dashboard loads; credentials visible |

### TC-UNLOCK-02 — Wrong master password rejected
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Vault initialized |
| **Steps** | 1. Enter incorrect password<br>2. Submit |
| **Expected** | Error: "Master password is incorrect."; vault stays locked; no credentials in memory |

### TC-UNLOCK-03 — Biometric unlock (device with biometrics)
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Biometrics enabled at setup; enrolled on device |
| **Steps** | 1. On unlock screen tap biometric / use system prompt |
| **Expected** | OS auth succeeds → vault unlocks without typing password |

### TC-UNLOCK-04 — Biometric unlock without stored key
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Biometrics enabled but SecureStore key missing (e.g. fresh emulator) |
| **Steps** | 1. Attempt biometric unlock |
| **Expected** | Error: "Biometric unlock is unavailable. Use your master password." |

### TC-UNLOCK-05 — Manual lock via Fingerprint FAB
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Vault unlocked on Main Vault tab |
| **Steps** | 1. Tap fingerprint FAB (bottom-right) |
| **Expected** | Vault locks immediately; redirect to `/unlock`; credentials cleared from UI |

### TC-UNLOCK-06 — Manual lock from Settings
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Vault unlocked |
| **Steps** | 1. Open Settings → tap **Lock vault** (or equivalent) |
| **Expected** | Same as TC-UNLOCK-05 |

### TC-UNLOCK-07 — Auto-lock: Immediately (0 min)
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Auto-lock set to **Immediately** in Settings |
| **Steps** | 1. Unlock vault<br>2. Background app (home button / app switch)<br>3. Return within seconds |
| **Expected** | Vault locked on return; unlock screen shown |

### TC-UNLOCK-08 — Auto-lock: 1 min preset
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Auto-lock = **1 min** (default) |
| **Steps** | 1. Unlock<br>2. Background app ≥ 1 minute<br>3. Foreground |
| **Expected** | Vault locked |

### TC-UNLOCK-09 — Auto-lock: Never (-1)
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Preconditions** | Auto-lock = **Never** |
| **Steps** | 1. Unlock<br>2. Background 10+ minutes<br>3. Return |
| **Expected** | Vault still unlocked (unless OS killed process) |

### TC-UNLOCK-10 — Legacy vault migration on first unlock
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Device has pre-encryption (legacy) vault blob |
| **Steps** | 1. Unlock with correct legacy master password |
| **Expected** | Credentials preserved; blob rewritten as AES-GCM v3; subsequent unlocks use encrypted path |

### TC-UNLOCK-11 — Corrupt vault blob handling
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | AsyncStorage vault JSON manually corrupted (dev only) |
| **Steps** | 1. Launch app<br>2. Attempt unlock |
| **Expected** | User-facing corruption message with reset guidance; data not silently wiped |

---

## 3. Onboarding

### TC-ONBOARD-01 — Onboarding UI renders
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ UI only |
| **Preconditions** | Route to onboarding (if wired) |
| **Steps** | 1. View onboarding screens |
| **Expected** | Hero, title, subtitle, step dots, primary CTA visible |

### TC-ONBOARD-02 — Onboarding completion persists
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ⬜ Not implemented |
| **Preconditions** | First launch |
| **Steps** | 1. Complete onboarding CTA<br>2. Kill and relaunch app |
| **Expected** | Onboarding skipped; user goes to setup or unlock — **currently fails: flag not persisted** |

### TC-ONBOARD-03 — Secondary "Log in" link
| | |
|---|---|
| **Priority** | P3 |
| **Status** | ⬜ Placeholder only |
| **Steps** | 1. Tap "Log in" on onboarding |
| **Expected** | Placeholder or future auth screen — cloud login deferred (TASK-022) |

---

## 4. Dashboard (Home)

### TC-DASH-01 — Header and greeting
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Vault unlocked with ≥ 1 credential |
| **Steps** | 1. Open Dashboard tab |
| **Expected** | SecureVault serif wordmark; notification bell; avatar; greeting "Hello, SecureVault" |

### TC-DASH-02 — Category stat cards reflect live counts
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Vault with credentials in multiple categories |
| **Steps** | 1. Note counts on 6 category tiles<br>2. Add a new Login credential<br>3. Return to Dashboard |
| **Expected** | Login count increments; archived credentials excluded from counts |

### TC-DASH-03 — Category tile navigation
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Vault with mixed categories |
| **Steps** | 1. Tap a category card (e.g. Login) |
| **Expected** | Navigates to Vault with category filter applied |

### TC-DASH-04 — Search filters recents
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | ≥ 3 credentials with distinct websites |
| **Steps** | 1. Type partial website name in search<br>2. Clear search |
| **Expected** | Recently Used section shows only matches; clearing restores full list |

### TC-DASH-05 — Security Health hero CTA
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Vault unlocked |
| **Steps** | 1. Tap Security Health gradient pill |
| **Expected** | Navigates to Password Health tab |

### TC-DASH-06 — Health score count-up animation
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ (Phase 7 PoC) |
| **Preconditions** | Vault with known health score |
| **Steps** | 1. Open Dashboard after unlock |
| **Expected** | Health score animates from 0 → computed value; matches Health screen score |

### TC-DASH-07 — FAB add credential
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Vault unlocked |
| **Steps** | 1. Tap **+** FAB |
| **Expected** | Navigates to Add Credential screen |

### TC-DASH-08 — Empty vault state
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | New vault, zero credentials |
| **Steps** | 1. Open Dashboard |
| **Expected** | Category cards show 0; empty/messaging for recents; no crash |

### TC-DASH-09 — Premium entrance animations
| | |
|---|---|
| **Priority** | P3 |
| **Status** | 🟡 Partial (Dashboard only) |
| **Steps** | 1. Navigate to Dashboard |
| **Expected** | Fade-in + staggered list entrances; PressableScale on interactive elements |

---

## 5. Main Vault

### TC-VAULT-01 — Header: brand row and NEW ITEM
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Vault unlocked |
| **Steps** | 1. Open Vault tab |
| **Expected** | Shield + SecureVault wordmark; upload/download icons; avatar; "Main Vault" title; "{n} Items Secured"; **+ NEW ITEM** pill |

### TC-VAULT-02 — Category-grouped list
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Credentials in ≥ 2 categories |
| **Steps** | 1. View vault list |
| **Expected** | Sections grouped by category (LOGIN, CARDS, etc.) in `CREDENTIAL_CATEGORIES` order; divider between sections |

### TC-VAULT-03 — Active / Favorites / Archived view chips
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Mix of normal, favorited, archived credentials |
| **Steps** | 1. Tap **Favorites** → only starred items<br>2. Tap **Archived** → only archived<br>3. Tap **Active** → non-archived |
| **Expected** | List filters correctly; empty state when no matches |

### TC-VAULT-04 — Filter panel (category + folder/tag)
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Credentials with folders/tags |
| **Steps** | 1. Tap **Filter** pill<br>2. Select category chip<br>3. Select folder/tag<br>4. Close panel |
| **Expected** | Filter pill shows active styling when non-default filter applied; list narrows accordingly |

### TC-VAULT-05 — Search across all fields
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Credential with notes `project alpha`, username `john@mail.com` |
| **Steps** | 1. Search `alpha`<br>2. Search `john mail`<br>3. Search `nonexistent` |
| **Expected** | Multi-token AND search; matches website, url, username, category, accountLabel, notes, folder, tags; empty results show empty state |

### TC-VAULT-06 — Security Pulse card
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Vault with weak or reused passwords |
| **Steps** | 1. View Security Pulse on Vault<br>2. Tap card |
| **Expected** | Purple accent styling (not red); Playfair title; navigates to Health |

### TC-VAULT-07 — Vault Health score display
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Known health metrics |
| **Steps** | 1. Compare Vault Health value with Health tab score |
| **Expected** | Same 0–100 score; serif accent typography |

### TC-VAULT-08 — Credential row: copy password
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | ≥ 1 credential |
| **Steps** | 1. Tap copy on a row |
| **Expected** | Toast confirmation; haptic success; password on clipboard; auto-clears after 30 s if unchanged |

### TC-VAULT-09 — Credential row: toggle favorite
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Active credential |
| **Steps** | 1. Tap star on row<br>2. Switch to Favorites view |
| **Expected** | Star fills accent purple; credential appears in Favorites |

### TC-VAULT-10 — Inline risk badges (weak / reused / old)
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Weak password (`abc`), reused password across 2 entries, password unchanged 180+ days |
| **Steps** | 1. View vault rows |
| **Expected** | Badge pills visible on affected rows matching Health metrics |

### TC-VAULT-11 — Circular logo avatar
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Preconditions** | Credential with website URL (favicon) or custom logo |
| **Steps** | 1. Inspect row avatar |
| **Expected** | Circular tile; favicon from Google API or custom image; fallback icon if load fails |

### TC-VAULT-12 — Navigate to edit credential
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | ≥ 1 credential |
| **Steps** | 1. Tap credential row |
| **Expected** | Opens Edit Credential for that `id` |

### TC-VAULT-13 — Empty vault empty state
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Zero credentials |
| **Steps** | 1. Open Vault |
| **Expected** | EmptyState with view-aware message; CTA to add item |

### TC-VAULT-14 — Multiple accounts same website
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Two Instagram logins, different usernames/passwords |
| **Steps** | 1. Add both<br>2. Search `instagram` |
| **Expected** | Both listed as separate rows; dedupe on import uses website+username identity |

---

## 6. Add / Edit credential

### TC-CRED-01 — Add credential (happy path)
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Vault unlocked |
| **Steps** | 1. Tap + NEW ITEM<br>2. Fill website, username, password, category<br>3. Save |
| **Expected** | Credential appears at top of vault; encrypted persist; Dashboard count updates |

### TC-CRED-02 — Add with generator prefill
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | On Generator tab |
| **Steps** | 1. Generate password<br>2. Tap **Save secure password** |
| **Expected** | Add Credential opens with password field prefilled |

### TC-CRED-03 — Edit credential fields
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Existing credential |
| **Steps** | 1. Open edit<br>2. Change website, username, notes, category<br>3. Save |
| **Expected** | Changes reflected in vault; `updatedAt` refreshed |

### TC-CRED-04 — Show/hide password in form
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Toggle visibility on password field |
| **Expected** | Mask toggles; a11y label correct |

### TC-CRED-05 — Delete credential with confirmation
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Existing credential |
| **Steps** | 1. Delete from edit screen<br>2. Confirm dialog |
| **Expected** | Credential removed; haptic feedback; persists after restart |

### TC-CRED-06 — Password history on update
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | `recordPasswordHistory` enabled (default) |
| **Steps** | 1. Edit credential; change password<br>2. Open password history section |
| **Expected** | Previous password listed with timestamp; max 10 entries |

### TC-CRED-07 — Password history disabled in settings
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Preconditions** | History recording turned off in Settings |
| **Steps** | 1. Change password on credential |
| **Expected** | No new history entry added |

### TC-CRED-08 — Restore password from history
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Credential with ≥ 1 history entry |
| **Steps** | 1. Reveal history entry<br>2. Restore |
| **Expected** | Current password replaced; old current moves to history |

### TC-CRED-09 — Custom logo upload
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Preconditions** | Device with photo library access |
| **Steps** | 1. Pick custom logo on add/edit<br>2. Save |
| **Expected** | Custom image overrides favicon in lists |

### TC-CRED-10 — Folder and tags
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Add folder `Work` and tags `urgent`, `client`<br>2. Filter by folder in Vault |
| **Expected** | Search and filter panel find credential by folder/tag |

### TC-CRED-11 — Save while locked rejected
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Vault locked (edge: deep link to add) |
| **Steps** | 1. Attempt save |
| **Expected** | Error: "Unlock your vault before saving credentials." |

### TC-CRED-12 — Trim whitespace on save
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Enter `"  GitHub  "` as website with trailing spaces<br>2. Save |
| **Expected** | Stored as `GitHub` (trimmed) |

### TC-CRED-13 — Entry detail view mode (standalone)
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ⬜ Partial — edit screen covers most flows |
| **Steps** | 1. Open read-only view mode |
| **Expected** | Dedicated view/edit toggle per roadmap 2.6 — verify if edit-only is acceptable |

---

## 7. Password Generator

### TC-GEN-01 — Default generation
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Generator tab |
| **Steps** | 1. Open Generator with defaults (len 18, all char types) |
| **Expected** | 18-char password; contains upper, lower, number, symbol; strength meter shows Strong/Fair |

### TC-GEN-02 — Length stepper and presets
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Set length to 12 via preset<br>2. Step to 32<br>3. Try below 4 / above 128 |
| **Expected** | Length clamped 4–128; generated string matches length |

### TC-GEN-03 — Charset toggles
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Disable all toggles → regenerate<br>2. Enable only lowercase |
| **Expected** | All off → error "Select at least one character type."; lowercase only → no upper/digit/symbol |

### TC-GEN-04 — Regenerate produces new password
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Note password<br>2. Tap regenerate 5 times |
| **Expected** | Values differ (statistically); length/charset rules respected |

### TC-GEN-05 — Copy generated password
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Tap copy |
| **Expected** | Clipboard populated; toast; haptic; 30 s auto-clear |

### TC-GEN-06 — Strength meter states
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Test data** | `abc` → Weak · `Abcdefgh1!` → Fair/Strong · 16+ mixed → Strong |
| **Expected** | Shield icon and label match `scorePasswordStrength` thresholds (80+ Strong, 50+ Fair) |

### TC-GEN-07 — Save to vault flow end-to-end
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Generate → Save → complete form → save |
| **Expected** | New vault entry with generated password |

---

## 8. Password Health

### TC-HEALTH-01 — Health score with empty vault
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Zero non-archived credentials |
| **Steps** | 1. Open Health tab |
| **Expected** | Score = 100; breakdown shows zeros |

### TC-HEALTH-02 — Weak password detection
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Test data** | Password `< 12 chars` OR `< 3 char varieties` |
| **Steps** | 1. Add weak credential<br>2. Check Health |
| **Expected** | Weak count +1; score drops by 12; credential id in weakIds |

### TC-HEALTH-03 — Reused password detection
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Add two credentials with identical password |
| **Expected** | Reused count = 2; reused group lists both ids; score −10 each |

### TC-HEALTH-04 — Old password warning (180 days)
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Credential with `updatedAt` > 180 days ago (dev: manipulate date) |
| **Steps** | 1. Open Health |
| **Expected** | Old count +1; score −4; listed in recommendations if reminders enabled |

### TC-HEALTH-05 — Archived credentials excluded
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Archive a weak credential<br>2. Refresh Health |
| **Expected** | Weak count decreases; score improves |

### TC-HEALTH-06 — Tap issue navigates to credential
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | At least one weak entry |
| **Steps** | 1. Tap weak-password row in Health |
| **Expected** | Opens Edit Credential for affected id |

### TC-HEALTH-07 — Reused password grouped drill-down
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Password reused across 3 accounts |
| **Steps** | 1. View reused group in Health<br>2. Tap affected account |
| **Expected** | Shows all 3 accounts; each navigates to edit |

### TC-HEALTH-08 — Score ring / large display
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Open Health with mixed-risk vault |
| **Expected** | Score ring animates; color reflects score band |

### TC-HEALTH-09 — Live update on vault change
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Note score<br>2. Fix weak password via edit<br>3. Return to Health |
| **Expected** | Score recalculates without app restart |

---

## 9. Breach Monitor (HIBP)

### TC-BREACH-01 — Scan with no network
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Airplane mode |
| **Steps** | 1. Run breach scan on Health |
| **Expected** | Error/offline state; no crash; raw password never sent |

### TC-BREACH-02 — Known breached password (test vector)
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Network available |
| **Test data** | Use HIBP test password `Password123` (known breached) |
| **Steps** | 1. Save credential with known breached password<br>2. Run scan |
| **Expected** | Credential flagged; exposure count > 0 |

### TC-BREACH-03 — Safe unique password
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Use long random generated password<br>2. Scan |
| **Expected** | Not flagged; checked count includes distinct passwords |

### TC-BREACH-04 — Reused password deduped in scan
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Same password on 3 credentials<br>2. Scan |
| **Expected** | Password queried once; all 3 ids flagged if breached |

### TC-BREACH-05 — k-anonymity privacy
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ (code review + proxy log) |
| **Steps** | 1. Monitor network during scan |
| **Expected** | Only 5-char SHA-1 prefix sent to `api.pwnedpasswords.com/range/`; full hash/password never transmitted |

### TC-BREACH-06 — Archived credentials skipped
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Archive breached credential<br>2. Scan |
| **Expected** | Not included in scan set |

---

## 10. Settings

### TC-SET-01 — Change master password
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Settings → Change master password<br>2. Enter current + new (≥ 12 chars)<br>3. Confirm |
| **Expected** | Unlock with new password works; old password fails; credentials intact; biometric key refreshed if enabled |

### TC-SET-02 — Change master password wrong current
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Enter wrong current password |
| **Expected** | Error: "Current master password is incorrect." |

### TC-SET-03 — Disable biometrics
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Toggle biometrics off<br>2. Lock and unlock |
| **Expected** | Biometric key cleared; only master password works |

### TC-SET-04 — App theme preference
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Switch theme: System / Light / Dark<br>2. Observe UI |
| **Expected** | Theme persists; colors update via `colorTheme` + vault theme |

### TC-SET-05 — Color theme (blue / purple / gold)
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Cycle accent palettes |
| **Expected** | Accent colors update app-wide; preference persisted |

### TC-SET-06 — Auto-lock timeout presets
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Set each preset: Immediately, 1 min, 5 min, 15 min, Never<br>2. Verify behavior (see TC-UNLOCK-07–09) |
| **Expected** | Each preset enforced on background→active |

### TC-SET-07 — Password age reminders toggle
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Enable reminders<br>2. View old password in Health |
| **Expected** | Reminder UI/surfacing when credential exceeds 180 days |

### TC-SET-08 — Reset local data
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Settings → Reset vault<br>2. Confirm destructive dialog |
| **Expected** | All credentials wiped; returns to setup; biometric key cleared |

### TC-SET-09 — Export backup (JSON)
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | ≥ 1 credential |
| **Steps** | 1. Export backup to clipboard |
| **Expected** | Valid JSON with `format: securevault-backup`, version, credentials array; user warned plaintext |

### TC-SET-10 — Import backup (happy path)
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Preconditions** | Valid backup JSON |
| **Steps** | 1. Import from clipboard |
| **Expected** | New credentials added; counts reported (added/skipped) |

### TC-SET-11 — Import dedupe
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Import same backup twice |
| **Expected** | Second import: added = 0, skipped = N; no duplicate rows |

### TC-SET-12 — Import invalid JSON
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Paste `{ invalid` |
| **Expected** | Error: "Backup is not valid JSON." |

### TC-SET-13 — Import wrong format
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Paste generic JSON without `securevault-backup` format |
| **Expected** | Error: "This does not look like a SecureVault backup." |

---

## 11. Encryption & data persistence

### TC-CRYPTO-01 — Data survives app restart
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Add credential<br>2. Kill app<br>3. Relaunch and unlock |
| **Expected** | Credential present; blob encrypted at rest (v3 AES-GCM) |

### TC-CRYPTO-02 — Locked state hides credentials
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Lock vault<br>2. Inspect in-memory state / UI |
| **Expected** | Credential list empty; encryption key ref cleared |

### TC-CRYPTO-03 — Wrong password GCM auth failure
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Attempt unlock with wrong password on encrypted vault |
| **Expected** | Decryption fails gracefully; no partial data leak |

### TC-CRYPTO-04 — Storage full error
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ (code path) |
| **Preconditions** | Simulate AsyncStorage write failure (dev) |
| **Steps** | 1. Save credential |
| **Expected** | Error: "Could not save to device storage. It may be full or unavailable." |

### TC-CRYPTO-05 — Unit tests pass
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Run `npm test` |
| **Expected** | All 19 tests green (generator, health-checks, crypto helpers) |

---

## 12. Navigation & shell

### TC-NAV-01 — Five-tab bottom navigation
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Steps** | 1. Tap Home, Vault, Generator, Health, Settings |
| **Expected** | Each tab loads; active tab has filled rounded-square highlight |

### TC-NAV-02 — Route guard when locked
| | |
|---|---|
| **Priority** | P0 |
| **Status** | ✅ |
| **Preconditions** | Vault locked |
| **Steps** | 1. Attempt deep link to `/vault` or `/add-credential` |
| **Expected** | Redirect to unlock/setup |

### TC-NAV-03 — Navigation lock during async ops
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Trigger slow save<br>2. Rapidly tap back/nav |
| **Expected** | No duplicate saves or orphaned routes (`useNavigationLock`) |

### TC-NAV-04 — Loading fallback on route transition
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Navigate between heavy screens |
| **Expected** | Branded RouteFallback spinner; no blank flash |

---

## 13. UX, accessibility & feedback

### TC-UX-01 — Toast on copy/save/error
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Copy password<br>2. Save credential<br>3. Trigger error |
| **Expected** | Toast/snackbar for each; appropriate duration |

### TC-UX-02 — Haptic feedback map
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Press buttons (light)<br>2. Copy (success)<br>3. Error action (error)<br>4. Expand card (selection) |
| **Expected** | Matching haptic per `useHaptics` / `feedback.ts`; no crash on unsupported devices |

### TC-UX-03 — Clipboard auto-clear does not clobber user copy
| | |
|---|---|
| **Priority** | P1 |
| **Status** | ✅ |
| **Steps** | 1. Copy password from vault<br>2. Within 30 s copy different text elsewhere<br>3. Wait 30 s |
| **Expected** | User's later clipboard content preserved |

### TC-UX-04 — Accessibility labels on icon buttons
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Enable VoiceOver / TalkBack<br>2. Focus copy, favorite, lock FAB |
| **Expected** | Meaningful accessibility labels announced |

### TC-UX-05 — Dynamic type / large text
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Enable largest system font size |
| **Expected** | Layout does not clip critical controls; readable |

### TC-UX-06 — Screen capture protection
| | |
|---|---|
| **Priority** | P2 |
| **Status** | 🟡 Disabled (`SCREEN_CAPTURE_PROTECTION_ENABLED = false`) |
| **Steps** | 1. Unlock vault<br>2. Attempt screenshot |
| **Expected** | **Currently:** screenshot allowed. When flag enabled: blocked while unlocked |

---

## 14. Site branding & logos

### TC-BRAND-01 — Favicon load for known domain
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Add credential website `github.com` with URL |
| **Expected** | Google favicon API logo in circular avatar |

### TC-BRAND-02 — Offline logo cache
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Load credential online<br>2. Go offline<br>3. Reopen list |
| **Expected** | Cached logo via expo-image disk cache |

### TC-BRAND-03 — Fallback icon on favicon failure
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Add credential with invalid/unresolvable domain |
| **Expected** | Category default icon shown; no broken image |

### TC-BRAND-04 — Quick-pick site chips (W.3)
| | |
|---|---|
| **Priority** | P3 |
| **Status** | ⬜ Not implemented |
| **Expected** | Popular site chips on add form — deferred |

### TC-BRAND-05 — Live vault preview before save (W.4)
| | |
|---|---|
| **Priority** | P3 |
| **Status** | ⬜ Not implemented |

---

## 15. Premium UI (Phase 7)

### TC-PREM-01 — Design tokens resolve per scheme
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Inspect `useTheme()` on Dashboard |
| **Expected** | colors, spacing, radius, typography, shadows, motion from `getTheme(scheme)`; no hardcoded values in Dashboard PoC |

### TC-PREM-02 — PressableScale micro-interaction
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Steps** | 1. Press interactive card/button on Dashboard |
| **Expected** | Scale to ~0.98 + spring return + light haptic |

### TC-PREM-03 — Dark-first theme on light device
| | |
|---|---|
| **Priority** | P2 |
| **Status** | ✅ |
| **Preconditions** | Device system theme = light |
| **Steps** | 1. Open Dashboard |
| **Expected** | Premium dark aubergine look preserved |

### TC-PREM-04 — Remaining screens not migrated
| | |
|---|---|
| **Priority** | P3 |
| **Status** | 🟡 |
| **Steps** | 1. Compare Vault, Generator, Health, Settings to Dashboard polish |
| **Expected** | Vault partially updated (Run 9); Generator/Health/Settings still on prior styling — track for 7.20 |

### TC-PREM-05 — UI kit components (7.5–7.12)
| | |
|---|---|
| **Priority** | P3 |
| **Status** | ⬜ |
| **Expected** | Shared Button, Card, GlassCard, Input, Avatar, AnimatedNumber, BottomSheet, SectionHeader, SkeletonLoader — not yet built |

---

## 16. Regression & edge-case matrix

Quick combinatorial checks after any release candidate:

| # | Scenario | Expected |
|---|----------|----------|
| R-01 | Add → edit → delete same session | CRUD consistent; no stale list |
| R-02 | Favorite → archive → restore | Flags mutually usable; Health excludes archived |
| R-03 | Change master password → biometric unlock | Biometric still works with new key |
| R-04 | Import 50 credentials | Performance acceptable; search works |
| R-05 | Generator save → immediate Health check | New password scored correctly |
| R-06 | Background during PBKDF2 unlock | No corrupt state |
| R-07 | Rotate device during add form | Form state preserved or gracefully reset |
| R-08 | Very long notes (10k chars) | Save/search without crash |
| R-09 | Unicode in username/password | Encrypt/decrypt round-trip correct |
| R-10 | Empty password credential | Allowed save; weak flagged in Health |

---

## 17. Not yet implemented — do not test as pass

These roadmap items are **open**; scenarios are listed for future QA when built:

| Roadmap ref | Feature | Planned scenarios |
|-------------|---------|-------------------|
| 0.4 | Extract securevault.zip locally | Design reference availability |
| 1.1–1.11 | Full design system shell | Theme provider, pill tab blur, shared UI primitives |
| 2.5 | Health static mock UI | N/A — superseded by live Phase 4 |
| 2.6 | Entry detail view mode | TC-CRED-13 |
| 3.20 | AI-assisted folders/tags | Suggest/apply tags via OpenAI with offline fallback |
| 5.9 | Security review checklist | Pen test sign-off |
| 5.13–5.16 | Store release | Privacy policy, EAS, TestFlight, store copy |
| 6.x | Cloud sync & auth API | Multi-device, offline queue, JWT auth |
| 7.5–7.12, 7.16–7.19, 7.22 | Premium UI remainder | UI kit, skeleton loading, nav transitions, QA audit |
| W.1–W.6 | Website branding v1.1 | Quick-pick chips, live preview, list blur |
| TASK-017/018/019/022 | Backend features | Sync, sharing, extension, Google login |

---

## 18. Test execution checklist

Use before each beta build:

```
[ ] TC-SETUP-04      First-time vault creation
[ ] TC-UNLOCK-01/02  Unlock happy + wrong password
[ ] TC-UNLOCK-05     Manual lock FAB
[ ] TC-UNLOCK-08     Auto-lock 1 min
[ ] TC-CRED-01/05    Add + delete credential
[ ] TC-GEN-07        Generator → save flow
[ ] TC-HEALTH-02/03  Weak + reused detection
[ ] TC-HEALTH-06     Navigate from issue to edit
[ ] TC-VAULT-05      Multi-field search
[ ] TC-VAULT-08      Copy + clipboard clear
[ ] TC-SET-01        Change master password
[ ] TC-SET-09/10     Export + import backup
[ ] TC-CRYPTO-01     Persistence after kill
[ ] TC-NAV-01/02     Tabs + route guard
[ ] TC-BREACH-05     HIBP privacy (network inspect)
[ ] npm test         Automated suite green
[ ] npm run lint     Zero errors
```

---

## Related files

| File | Purpose |
|------|---------|
| `Mds/ROADMAP.md` | Feature tracker & phase status |
| `Mds/TASKS.md` | Pending task backlog |
| `Mds/BUGS.md` | Bug tracker & potential-bug backlog |
| `Mds/SESSION-HANDOFF.md` | Latest implementation notes |
| `src/services/__tests__/` | Automated unit tests |
| `screenshots/` | Visual design reference |

---

*Update this document when new roadmap tasks are checked off or when behavior changes.*
