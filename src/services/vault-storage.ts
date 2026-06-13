import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import {
  Credential,
  DEFAULT_VAULT_SETTINGS,
  VaultMetadata,
  VaultSettings,
} from '@/types/credential';
import {
  deriveKey,
  encryptJson,
  decryptJson,
  EncryptedPayload,
  generateSaltHex,
  PBKDF2_ITERATIONS,
  VaultDecryptionError,
} from '@/services/crypto/vault-crypto';

const VAULT_STORAGE_KEY = 'securevault.local-vault.v1';
const VAULT_VERSION = 3;

/** Encrypted vault as written to disk (Roadmap 3.7). */
interface EncryptedVault {
  version: 3;
  /** PBKDF2 salt (hex) for key derivation. */
  salt: string;
  /** PBKDF2 iteration count used for this vault. */
  kdfIterations: number;
  /** Non-secret metadata, readable without the master password. */
  metadata: VaultMetadata;
  /** Non-secret app/vault settings (needed before unlock, e.g. theme). */
  settings: VaultSettings;
  /** AES-GCM ciphertext of `{ credentials }`. */
  vault: EncryptedPayload;
}

/** Pre-encryption layout (salted SHA-256 gate, plaintext credentials at rest). */
interface LegacyVault {
  salt: string;
  passwordHash: string;
  metadata: VaultMetadata;
  settings: VaultSettings;
  credentials: Credential[];
}

interface EncryptedCredentials {
  credentials: Credential[];
}

export interface VaultSnapshot {
  isInitialized: boolean;
  metadata: VaultMetadata;
  settings: VaultSettings;
  /** Decrypted credentials — empty while the vault is locked. */
  credentials: Credential[];
}

export interface UnlockResult {
  snapshot: VaultSnapshot;
  /** In-memory AES key for the unlocked session (never persisted). */
  key: Uint8Array;
}

class CorruptVaultError extends Error {
  constructor() {
    super('Your vault data is corrupted and could not be read. You may need to reset the app.');
    this.name = 'CorruptVaultError';
  }
}

async function legacyHashPassword(password: string, salt: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

function createMetadata(now: string): VaultMetadata {
  return { version: VAULT_VERSION, createdAt: now, updatedAt: now, lastUnlockedAt: now };
}

function migrateCredential(raw: Partial<Credential>): Credential {
  const now = new Date().toISOString();
  return {
    id: raw.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    website: raw.website ?? '',
    url: raw.url ?? '',
    username: raw.username ?? '',
    password: raw.password ?? '',
    category: raw.category ?? 'Login',
    accountLabel: raw.accountLabel,
    notes: raw.notes,
    folder: raw.folder,
    tags: raw.tags ?? [],
    customLogoUri: raw.customLogoUri,
    isFavorite: raw.isFavorite ?? false,
    isArchived: raw.isArchived ?? false,
    passwordHistory: raw.passwordHistory ?? [],
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? now,
  };
}

function normalizeSettings(settings?: Partial<VaultSettings>): VaultSettings {
  return { ...DEFAULT_VAULT_SETTINGS, ...(settings ?? {}) };
}

type StoredVault =
  | ({ kind: 'encrypted' } & EncryptedVault)
  | ({ kind: 'legacy' } & LegacyVault);

async function readStoredVault(): Promise<StoredVault | null> {
  const rawVault = await AsyncStorage.getItem(VAULT_STORAGE_KEY);
  if (!rawVault) return null;

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawVault) as Record<string, unknown>;
  } catch {
    throw new CorruptVaultError();
  }

  if (parsed && typeof parsed === 'object' && 'vault' in parsed) {
    const vault = parsed as unknown as EncryptedVault;
    return {
      kind: 'encrypted',
      version: VAULT_VERSION,
      salt: vault.salt,
      kdfIterations: vault.kdfIterations ?? PBKDF2_ITERATIONS,
      metadata: vault.metadata,
      settings: normalizeSettings(vault.settings),
      vault: vault.vault,
    };
  }

  if (parsed && typeof parsed === 'object' && 'passwordHash' in parsed) {
    const legacy = parsed as unknown as LegacyVault;
    return {
      kind: 'legacy',
      salt: legacy.salt,
      passwordHash: legacy.passwordHash,
      metadata: legacy.metadata,
      settings: normalizeSettings(legacy.settings),
      credentials: (legacy.credentials ?? []).map(migrateCredential),
    };
  }

  throw new CorruptVaultError();
}

async function writeEncryptedVault(vault: EncryptedVault) {
  try {
    await AsyncStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
  } catch {
    throw new Error('Could not save to device storage. It may be full or unavailable.');
  }
}

async function encryptVault(
  key: Uint8Array,
  salt: string,
  metadata: VaultMetadata,
  settings: VaultSettings,
  credentials: Credential[],
): Promise<EncryptedVault> {
  const payload = await encryptJson(key, { credentials } satisfies EncryptedCredentials);
  return {
    version: VAULT_VERSION,
    salt,
    kdfIterations: PBKDF2_ITERATIONS,
    metadata,
    settings,
    vault: payload,
  };
}

export async function loadVaultSnapshot(): Promise<VaultSnapshot> {
  let stored: StoredVault | null;
  try {
    stored = await readStoredVault();
  } catch {
    // Corrupt blob: report as initialized so the user lands on unlock, where the
    // corruption error is surfaced with guidance — never silently wipe data.
    return {
      isInitialized: true,
      metadata: createMetadata(new Date().toISOString()),
      settings: { ...DEFAULT_VAULT_SETTINGS },
      credentials: [],
    };
  }

  if (!stored) {
    return {
      isInitialized: false,
      metadata: createMetadata(new Date().toISOString()),
      settings: { ...DEFAULT_VAULT_SETTINGS },
      credentials: [],
    };
  }

  // Credentials stay encrypted/empty until the vault is unlocked (Roadmap 3.8).
  return {
    isInitialized: true,
    metadata: stored.metadata,
    settings: stored.settings,
    credentials: [],
  };
}

export async function setupStoredVault(
  masterPassword: string,
  settings: VaultSettings,
): Promise<UnlockResult> {
  const now = new Date().toISOString();
  const salt = await generateSaltHex();
  const key = await deriveKey(masterPassword, salt);
  const metadata = createMetadata(now);
  const vault = await encryptVault(key, salt, metadata, settings, []);
  await writeEncryptedVault(vault);

  return {
    snapshot: { isInitialized: true, metadata, settings, credentials: [] },
    key,
  };
}

export async function unlockStoredVault(masterPassword: string): Promise<UnlockResult> {
  const stored = await readStoredVault();
  if (!stored) throw new Error('Create your vault before unlocking.');

  const now = new Date().toISOString();

  if (stored.kind === 'legacy') {
    const hash = await legacyHashPassword(masterPassword, stored.salt);
    if (hash !== stored.passwordHash) throw new Error('Master password is incorrect.');

    // Migrate the plaintext vault to the encrypted format on first unlock.
    const salt = await generateSaltHex();
    const key = await deriveKey(masterPassword, salt);
    const metadata: VaultMetadata = {
      ...stored.metadata,
      version: VAULT_VERSION,
      updatedAt: now,
      lastUnlockedAt: now,
    };
    const vault = await encryptVault(key, salt, metadata, stored.settings, stored.credentials);
    await writeEncryptedVault(vault);
    return {
      snapshot: { isInitialized: true, metadata, settings: stored.settings, credentials: stored.credentials },
      key,
    };
  }

  const key = await deriveKey(masterPassword, stored.salt, stored.kdfIterations);
  const { credentials } = decryptJson<EncryptedCredentials>(key, stored.vault);

  const metadata: VaultMetadata = { ...stored.metadata, updatedAt: now, lastUnlockedAt: now };
  await writeEncryptedVault({
    version: VAULT_VERSION,
    salt: stored.salt,
    kdfIterations: stored.kdfIterations,
    metadata,
    settings: stored.settings,
    vault: stored.vault,
  });

  return {
    snapshot: { isInitialized: true, metadata, settings: stored.settings, credentials },
    key,
  };
}

/**
 * Unlocks using a key already retrieved from the device keystore (biometric
 * unlock). The user has authenticated via the OS scanner before this runs.
 */
export async function unlockStoredVaultWithKey(key: Uint8Array): Promise<UnlockResult> {
  const stored = await readStoredVault();
  if (!stored) throw new Error('Create your vault before unlocking.');
  if (stored.kind === 'legacy') {
    throw new Error('Unlock once with your master password to finish upgrading your vault.');
  }

  const { credentials } = decryptJson<EncryptedCredentials>(key, stored.vault);
  const now = new Date().toISOString();
  const metadata: VaultMetadata = { ...stored.metadata, updatedAt: now, lastUnlockedAt: now };
  await writeEncryptedVault({
    version: VAULT_VERSION,
    salt: stored.salt,
    kdfIterations: stored.kdfIterations,
    metadata,
    settings: stored.settings,
    vault: stored.vault,
  });

  return {
    snapshot: { isInitialized: true, metadata, settings: stored.settings, credentials },
    key,
  };
}

export async function persistCredentials(
  credentials: Credential[],
  key: Uint8Array,
): Promise<VaultSnapshot> {
  const stored = await readStoredVault();
  if (!stored || stored.kind !== 'encrypted') throw new Error('Vault is not initialized.');

  const now = new Date().toISOString();
  const metadata: VaultMetadata = { ...stored.metadata, updatedAt: now };
  const vault = await encryptVault(key, stored.salt, metadata, stored.settings, credentials);
  await writeEncryptedVault(vault);

  return { isInitialized: true, metadata, settings: stored.settings, credentials };
}

export async function persistSettings(settings: VaultSettings): Promise<VaultSnapshot> {
  const stored = await readStoredVault();
  if (!stored || stored.kind !== 'encrypted') throw new Error('Vault is not initialized.');

  const now = new Date().toISOString();
  const metadata: VaultMetadata = { ...stored.metadata, updatedAt: now };
  // Settings live outside the ciphertext, so we never need the key here.
  await writeEncryptedVault({
    version: VAULT_VERSION,
    salt: stored.salt,
    kdfIterations: stored.kdfIterations,
    metadata,
    settings,
    vault: stored.vault,
  });

  return { isInitialized: true, metadata, settings, credentials: [] };
}

export async function changeStoredMasterPassword(
  currentPassword: string,
  nextPassword: string,
): Promise<UnlockResult> {
  const stored = await readStoredVault();
  if (!stored) throw new Error('Vault is not initialized.');

  let credentials: Credential[];
  let settings: VaultSettings;
  let metadata: VaultMetadata;

  if (stored.kind === 'legacy') {
    const hash = await legacyHashPassword(currentPassword, stored.salt);
    if (hash !== stored.passwordHash) throw new Error('Current master password is incorrect.');
    credentials = stored.credentials;
    settings = stored.settings;
    metadata = stored.metadata;
  } else {
    const currentKey = await deriveKey(currentPassword, stored.salt, stored.kdfIterations);
    try {
      credentials = decryptJson<EncryptedCredentials>(currentKey, stored.vault).credentials;
    } catch (error) {
      if (error instanceof VaultDecryptionError) throw new Error('Current master password is incorrect.');
      throw error;
    }
    settings = stored.settings;
    metadata = stored.metadata;
  }

  const now = new Date().toISOString();
  const salt = await generateSaltHex();
  const key = await deriveKey(nextPassword, salt);
  const nextMetadata: VaultMetadata = { ...metadata, version: VAULT_VERSION, updatedAt: now };
  const vault = await encryptVault(key, salt, nextMetadata, settings, credentials);
  await writeEncryptedVault(vault);

  return {
    snapshot: { isInitialized: true, metadata: nextMetadata, settings, credentials },
    key,
  };
}

export async function resetStoredVault() {
  await AsyncStorage.removeItem(VAULT_STORAGE_KEY);
}
