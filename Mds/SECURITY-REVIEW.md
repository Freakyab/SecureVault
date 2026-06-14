# SecureVault Security Review

**Date:** 2026-06-14  
**Scope:** Offline-first vault security review for TASK-049 / Roadmap 5.9.  
**Result:** Passed with no open P0/P1 release blockers found in the reviewed scope.

## Summary

SecureVault stores credentials locally in an encrypted vault blob, keeps decrypted credentials and the derived AES key only in memory while unlocked, clears the unlocked session on explicit lock/reset and configured background auto-lock, and uses k-anonymity for breach checks. Screen-capture protection is enabled for unlocked vault sessions.

## Checklist

| Area | Item | Status | Evidence |
|------|------|--------|----------|
| Cryptography | AES-256-GCM protects the vault blob and authenticates decrypts. | Verified | `src/services/crypto/vault-crypto.ts` uses `@noble/ciphers` AES-GCM with a 32-byte key. `decryptJson()` wraps authentication/tamper failures as `VaultDecryptionError`. |
| Cryptography | PBKDF2-SHA256 uses a documented iteration count. | Verified | `PBKDF2_ITERATIONS = 120_000` and `deriveKey()` uses PBKDF2-SHA256 with a 32-byte output. |
| Cryptography | Unique random salt per vault and unique IV per encryption. | Verified | `generateSaltHex()` uses 16 random bytes for setup/master-password rotation. `encryptJson()` generates a fresh 12-byte random GCM IV for each encryption. |
| Cryptography | No key reuse across vaults or master-password changes. | Verified | New vault setup and master-password changes generate a new salt and derived key before encrypting. |
| Key/session | Derived key lives only in memory while unlocked and is cleared on lock/background. | Verified | `encryptionKeyRef` is a React ref only; `clearUnlockedSession()` nulls it and clears decrypted credentials. Auto-lock calls the same clear path. |
| Key/session | Biometric-derived key is stored only in SecureStore. | Verified | `src/services/biometric-key.ts` stores the derived key hex with `expo-secure-store`, `WHEN_UNLOCKED_THIS_DEVICE_ONLY`; no AsyncStorage use in that service. |
| Key/session | Reset clears vault data, onboarding flag, and biometric key. | Verified | `resetVault()` calls `clearUnlockedSession()`, `resetStoredVault()`, `clearBiometricKey()`, and `clearOnboardingComplete()`. |
| Storage | No plaintext credentials are persisted in the current vault format. | Verified | `vault-storage.ts` stores credentials only inside the AES-GCM `vault` payload; locked snapshots return empty credentials. |
| Storage | Legacy plaintext migration is safe. | Verified | Legacy blobs are only decrypted after password hash verification, then re-encrypted with a new salt/key on first unlock. |
| Clipboard/screen | Copied passwords auto-clear. | Verified | `copySensitiveToClipboard()` clears matching clipboard contents after `CLIPBOARD_CLEAR_MS = 30_000`. |
| Clipboard/screen | Screen-capture protection is enabled for production behavior. | Verified | `SCREEN_CAPTURE_PROTECTION_ENABLED` is `true`; unlocked native sessions call `preventScreenCaptureAsync()`. |
| Transport/network | HIBP breach checks use k-anonymity. | Verified | `breach-check.ts` sends only the first 5 SHA-1 hash chars to the HTTPS range API and matches suffixes locally. |
| Transport/network | No secrets are sent in query strings or analytics. | Verified | The only reviewed network call is HIBP range lookup with a hash prefix path segment and `Add-Padding`; no analytics client is present. |
| App hardening | Auto-lock is configurable and enforced. | Verified | `AUTO_LOCK_PRESETS` are persisted in settings; AppState background/inactive handling clears the unlocked session after the configured timeout. |
| App hardening | Navigation params do not carry secrets. | Verified | Entry navigation passes credential IDs only via `/entry/[id]`; passwords stay in context while unlocked. |
| App hardening | Credential and master-password forms validate required inputs. | Verified | Setup requires 12+ chars and confirmation match. Add/edit flows require website, username, and password before save. |

## Follow-Ups

- TASK-050 should validate the enabled screen-capture policy in development, preview, and production EAS builds on physical devices.
- Future cloud/sync work must add a separate transport, API, and account-auth security review before release.
