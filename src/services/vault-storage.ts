import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import {
  Credential,
  DEFAULT_VAULT_SETTINGS,
  VaultMetadata,
  VaultSettings,
  VaultState,
} from '@/types/credential';

const VAULT_STORAGE_KEY = 'securevault.local-vault.v1';
const VAULT_VERSION = 2;

interface StoredVault extends VaultState {
  salt: string;
  passwordHash: string;
}

export interface VaultSnapshot extends VaultState {
  isInitialized: boolean;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function createSalt() {
  return bytesToHex(await Crypto.getRandomBytesAsync(16));
}

async function hashPassword(password: string, salt: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

function createMetadata(now: string): VaultMetadata {
  return {
    version: VAULT_VERSION,
    createdAt: now,
    updatedAt: now,
    lastUnlockedAt: now,
  };
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

function migrateVault(vault: StoredVault): StoredVault {
  return {
    ...vault,
    metadata: { ...vault.metadata, version: VAULT_VERSION },
    settings: { ...DEFAULT_VAULT_SETTINGS, ...(vault.settings ?? {}) },
    credentials: (vault.credentials ?? []).map(migrateCredential),
  };
}

function toSnapshot(vault: StoredVault | null): VaultSnapshot {
  if (!vault) {
    return {
      isInitialized: false,
      metadata: createMetadata(new Date().toISOString()),
      settings: { ...DEFAULT_VAULT_SETTINGS },
      credentials: [],
    };
  }

  return {
    isInitialized: true,
    metadata: vault.metadata,
    settings: vault.settings,
    credentials: vault.credentials,
  };
}

async function readStoredVault() {
  const rawVault = await AsyncStorage.getItem(VAULT_STORAGE_KEY);
  if (!rawVault) return null;
  const parsed = JSON.parse(rawVault) as StoredVault;
  return migrateVault(parsed);
}

async function writeStoredVault(vault: StoredVault) {
  await AsyncStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
}

export async function loadVaultSnapshot() {
  return toSnapshot(await readStoredVault());
}

export async function setupStoredVault(masterPassword: string, settings: VaultSettings) {
  const now = new Date().toISOString();
  const salt = await createSalt();
  const passwordHash = await hashPassword(masterPassword, salt);
  const vault: StoredVault = {
    salt,
    passwordHash,
    metadata: createMetadata(now),
    settings,
    credentials: [],
  };

  await writeStoredVault(vault);
  return toSnapshot(vault);
}

export async function unlockStoredVault(masterPassword: string) {
  const vault = await readStoredVault();
  if (!vault) throw new Error('Create your vault before unlocking.');

  const passwordHash = await hashPassword(masterPassword, vault.salt);
  if (passwordHash !== vault.passwordHash) throw new Error('Master password is incorrect.');

  const now = new Date().toISOString();
  const nextVault: StoredVault = {
    ...vault,
    metadata: { ...vault.metadata, updatedAt: now, lastUnlockedAt: now },
  };

  await writeStoredVault(nextVault);
  return toSnapshot(nextVault);
}

/**
 * Records an unlock without re-validating the password — used by biometric
 * unlock, which has already authenticated the user via the device scanner.
 */
export async function touchVaultUnlock() {
  const vault = await readStoredVault();
  if (!vault) throw new Error('Create your vault before unlocking.');

  const now = new Date().toISOString();
  const nextVault: StoredVault = {
    ...vault,
    metadata: { ...vault.metadata, updatedAt: now, lastUnlockedAt: now },
  };

  await writeStoredVault(nextVault);
  return toSnapshot(nextVault);
}

export async function persistCredentials(credentials: Credential[]) {
  const vault = await readStoredVault();
  if (!vault) throw new Error('Vault is not initialized.');

  const now = new Date().toISOString();
  const nextVault: StoredVault = {
    ...vault,
    metadata: { ...vault.metadata, updatedAt: now },
    credentials,
  };

  await writeStoredVault(nextVault);
  return toSnapshot(nextVault);
}

export async function persistSettings(settings: VaultSettings) {
  const vault = await readStoredVault();
  if (!vault) throw new Error('Vault is not initialized.');

  const nextVault: StoredVault = {
    ...vault,
    metadata: { ...vault.metadata, updatedAt: new Date().toISOString() },
    settings,
  };

  await writeStoredVault(nextVault);
  return toSnapshot(nextVault);
}

export async function changeStoredMasterPassword(currentPassword: string, nextPassword: string) {
  const vault = await readStoredVault();
  if (!vault) throw new Error('Vault is not initialized.');

  const currentHash = await hashPassword(currentPassword, vault.salt);
  if (currentHash !== vault.passwordHash) throw new Error('Current master password is incorrect.');

  const salt = await createSalt();
  const passwordHash = await hashPassword(nextPassword, salt);
  const nextVault: StoredVault = {
    ...vault,
    salt,
    passwordHash,
    metadata: { ...vault.metadata, updatedAt: new Date().toISOString() },
  };

  await writeStoredVault(nextVault);
  return toSnapshot(nextVault);
}

export async function resetStoredVault() {
  await AsyncStorage.removeItem(VAULT_STORAGE_KEY);
}
