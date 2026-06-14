import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';

import {
  changeStoredMasterPassword,
  loadVaultSnapshot,
  persistCredentials,
  persistSettings,
  resetStoredVault,
  setupStoredVault,
  unlockStoredVault,
  unlockStoredVaultWithKey,
} from '@/services/vault-storage';
import { mergeCredentials } from '@/services/vault-backup';
import { clearBiometricKey, getBiometricKey, storeBiometricKey } from '@/services/biometric-key';
import { hexToKey, keyToHex } from '@/services/crypto/vault-crypto';
import { clearOnboardingComplete } from '@/services/onboarding';
import {
  Credential,
  DEFAULT_VAULT_SETTINGS,
  PasswordHistoryEntry,
  VaultMetadata,
  VaultSettings,
} from '@/types/credential';

/** Temporarily off — set to `true` to block screenshots while unlocked (TASK-035). */
const SCREEN_CAPTURE_PROTECTION_ENABLED = false;

interface CredentialInput {
  website: string;
  url: string;
  username: string;
  password: string;
  category: string;
  accountLabel?: string;
  notes?: string;
  folder?: string;
  tags?: string[];
  customLogoUri?: string;
}

interface VaultContextValue {
  isLoading: boolean;
  isInitialized: boolean;
  isUnlocked: boolean;
  metadata: VaultMetadata | null;
  settings: VaultSettings;
  credentials: Credential[];
  setupMasterPassword: (password: string, biometricEnabled: boolean) => Promise<void>;
  unlockVault: (password: string) => Promise<void>;
  unlockWithBiometrics: () => Promise<void>;
  lockVault: () => void;
  addCredential: (input: CredentialInput) => Promise<Credential>;
  updateCredential: (id: string, input: CredentialInput) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
  setCredentialLogo: (id: string, customLogoUri?: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  importCredentials: (incoming: Credential[]) => Promise<{ added: number; skipped: number }>;
  getCredential: (id: string) => Credential | undefined;
  updateSettings: (partial: Partial<VaultSettings>) => Promise<void>;
  changeMasterPassword: (current: string, next: string) => Promise<void>;
  resetVault: () => Promise<void>;
}

const VaultContext = createContext<VaultContextValue | null>(null);

function createCredentialId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const MAX_HISTORY = 10;

export function VaultProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [metadata, setMetadata] = useState<VaultMetadata | null>(null);
  const [settings, setSettings] = useState<VaultSettings>({ ...DEFAULT_VAULT_SETTINGS });
  const [credentials, setCredentials] = useState<Credential[]>([]);

  // Refs keep the AppState listener reading the latest values without
  // re-subscribing on every state change.
  const isUnlockedRef = useRef(isUnlocked);
  const settingsRef = useRef(settings);
  const backgroundedAtRef = useRef<number | null>(null);
  isUnlockedRef.current = isUnlocked;
  settingsRef.current = settings;

  // The decrypted AES key lives only in memory for the unlocked session and is
  // cleared on lock so credentials cannot be re-encrypted/read once locked
  // (Roadmap 3.8).
  const encryptionKeyRef = useRef<Uint8Array | null>(null);

  function clearUnlockedSession() {
    encryptionKeyRef.current = null;
    setCredentials([]);
    setIsUnlocked(false);
  }

  useEffect(() => {
    let isMounted = true;

    async function hydrateVault() {
      try {
        const snapshot = await loadVaultSnapshot();
        if (!isMounted) return;
        setIsInitialized(snapshot.isInitialized);
        setMetadata(snapshot.metadata);
        setSettings(snapshot.settings);
        setCredentials(snapshot.credentials);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void hydrateVault();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-lock after backgrounding (Roadmap 3.9 / TASK-033). The configured
  // timeout decides how long the vault may stay unlocked while the app is away:
  // -1 = never, 0 = immediately, otherwise N minutes.
  useEffect(() => {
    function handleAppStateChange(next: AppStateStatus) {
      if (next === 'background' || next === 'inactive') {
        if (backgroundedAtRef.current === null) backgroundedAtRef.current = Date.now();
        return;
      }

      if (next === 'active') {
        const backgroundedAt = backgroundedAtRef.current;
        backgroundedAtRef.current = null;
        if (!isUnlockedRef.current) return;

        const minutes = settingsRef.current.autoLockMinutes;
        if (minutes < 0) return; // Never auto-lock.
        if (minutes === 0) {
          clearUnlockedSession();
          return;
        }
        if (backgroundedAt && Date.now() - backgroundedAt >= minutes * 60_000) {
          clearUnlockedSession();
        }
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Block OS screenshots / screen recording while the vault is unlocked
  // (Roadmap 5.7 / TASK-035). Best-effort: never let it crash the app.
  useEffect(() => {
    if (Platform.OS === 'web') return;

    async function applyCapturePolicy() {
      try {
        if (!SCREEN_CAPTURE_PROTECTION_ENABLED) {
          await ScreenCapture.allowScreenCaptureAsync('securevault-unlocked');
          return;
        }

        if (isUnlocked) {
          await ScreenCapture.preventScreenCaptureAsync('securevault-unlocked');
        } else {
          await ScreenCapture.allowScreenCaptureAsync('securevault-unlocked');
        }
      } catch {
        // Screen-capture protection is unavailable on some devices/emulators.
      }
    }

    void applyCapturePolicy();
  }, [isUnlocked]);

  function applySnapshot(snapshot: {
    isInitialized: boolean;
    metadata: VaultMetadata;
    settings: VaultSettings;
    credentials: Credential[];
  }) {
    setIsInitialized(snapshot.isInitialized);
    setMetadata(snapshot.metadata);
    setSettings(snapshot.settings);
    setCredentials(snapshot.credentials);
  }

  async function setupMasterPassword(password: string, biometricEnabled: boolean) {
    const { snapshot, key } = await setupStoredVault(password, {
      ...DEFAULT_VAULT_SETTINGS,
      biometricEnabled,
    });
    encryptionKeyRef.current = key;
    applySnapshot(snapshot);
    setIsUnlocked(true);
    // Never block vault creation on SecureStore — it can hang on some Expo Go /
    // emulator builds. Biometric unlock falls back to master password until
    // the key is persisted.
    if (biometricEnabled) void storeBiometricKey(keyToHex(key));
  }

  async function unlockVault(password: string) {
    const { snapshot, key } = await unlockStoredVault(password);
    encryptionKeyRef.current = key;
    applySnapshot(snapshot);
    setIsUnlocked(true);
    // Refresh the keystore copy so biometric unlock stays in sync (covers
    // legacy→encrypted migration and master-password changes).
    if (snapshot.settings.biometricEnabled) void storeBiometricKey(keyToHex(key));
  }

  async function unlockWithBiometrics() {
    const keyHex = await getBiometricKey();
    if (!keyHex) throw new Error('Biometric unlock is unavailable. Use your master password.');
    const { snapshot, key } = await unlockStoredVaultWithKey(hexToKey(keyHex));
    encryptionKeyRef.current = key;
    applySnapshot(snapshot);
    setIsUnlocked(true);
  }

  function lockVault() {
    clearUnlockedSession();
  }

  async function commitCredentials(nextCredentials: Credential[]) {
    const key = encryptionKeyRef.current;
    if (!key) throw new Error('Unlock your vault before saving changes.');
    setCredentials(nextCredentials);
    const snapshot = await persistCredentials(nextCredentials, key);
    setMetadata(snapshot.metadata);
    setCredentials(snapshot.credentials);
  }

  async function addCredential(input: CredentialInput) {
    if (!isUnlocked) throw new Error('Unlock your vault before saving credentials.');

    const now = new Date().toISOString();
    const credential: Credential = {
      id: createCredentialId(),
      website: input.website.trim(),
      url: input.url.trim(),
      username: input.username.trim(),
      password: input.password,
      category: input.category,
      accountLabel: input.accountLabel?.trim() || undefined,
      notes: input.notes?.trim() || undefined,
      folder: input.folder?.trim() || undefined,
      tags: input.tags ?? [],
      customLogoUri: input.customLogoUri,
      isFavorite: false,
      isArchived: false,
      passwordHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    await commitCredentials([credential, ...credentials]);
    return credential;
  }

  async function updateCredential(id: string, input: CredentialInput) {
    const existing = credentials.find((credential) => credential.id === id);
    if (!existing) throw new Error('Credential not found.');

    const now = new Date().toISOString();
    const passwordChanged = input.password !== existing.password;
    const history: PasswordHistoryEntry[] =
      passwordChanged && settings.recordPasswordHistory && existing.password
        ? [{ password: existing.password, changedAt: existing.updatedAt }, ...existing.passwordHistory].slice(
            0,
            MAX_HISTORY,
          )
        : existing.passwordHistory;

    const updated: Credential = {
      ...existing,
      website: input.website.trim(),
      url: input.url.trim(),
      username: input.username.trim(),
      password: input.password,
      category: input.category,
      accountLabel: input.accountLabel?.trim() || undefined,
      notes: input.notes?.trim() || undefined,
      folder: input.folder?.trim() || undefined,
      tags: input.tags ?? existing.tags ?? [],
      customLogoUri: input.customLogoUri ?? existing.customLogoUri,
      passwordHistory: history,
      updatedAt: now,
    };

    await commitCredentials(credentials.map((credential) => (credential.id === id ? updated : credential)));
  }

  async function deleteCredential(id: string) {
    await commitCredentials(credentials.filter((credential) => credential.id !== id));
  }

  async function setCredentialLogo(id: string, customLogoUri?: string) {
    await commitCredentials(
      credentials.map((credential) =>
        credential.id === id ? { ...credential, customLogoUri, updatedAt: new Date().toISOString() } : credential,
      ),
    );
  }

  async function toggleFavorite(id: string) {
    await commitCredentials(
      credentials.map((credential) =>
        credential.id === id ? { ...credential, isFavorite: !credential.isFavorite } : credential,
      ),
    );
  }

  async function toggleArchive(id: string) {
    await commitCredentials(
      credentials.map((credential) =>
        credential.id === id ? { ...credential, isArchived: !credential.isArchived } : credential,
      ),
    );
  }

  async function importCredentials(incoming: Credential[]) {
    if (!isUnlocked) throw new Error('Unlock your vault before importing credentials.');
    const { merged, added, skipped } = mergeCredentials(credentials, incoming);
    if (added > 0) await commitCredentials(merged);
    return { added, skipped };
  }

  function getCredential(id: string) {
    return credentials.find((credential) => credential.id === id);
  }

  async function updateSettings(partial: Partial<VaultSettings>) {
    const next = { ...settings, ...partial };
    setSettings(next);
    const snapshot = await persistSettings(next);
    setSettings(snapshot.settings);

    // Keep the biometric keystore copy in sync with the opt-in.
    if (partial.biometricEnabled === false) {
      await clearBiometricKey();
    } else if (partial.biometricEnabled === true && encryptionKeyRef.current) {
      void storeBiometricKey(keyToHex(encryptionKeyRef.current));
    }
  }

  async function changeMasterPassword(current: string, next: string) {
    const { snapshot, key } = await changeStoredMasterPassword(current, next);
    encryptionKeyRef.current = key;
    applySnapshot(snapshot);
    setIsUnlocked(true);
    if (snapshot.settings.biometricEnabled) void storeBiometricKey(keyToHex(key));
  }

  async function resetVault() {
    await resetStoredVault();
    await clearBiometricKey();
    await clearOnboardingComplete();
    encryptionKeyRef.current = null;
    setIsInitialized(false);
    setIsUnlocked(false);
    setCredentials([]);
    setSettings({ ...DEFAULT_VAULT_SETTINGS });
    setMetadata(null);
  }

  const value: VaultContextValue = {
    isLoading,
    isInitialized,
    isUnlocked,
    metadata,
    settings,
    credentials,
    setupMasterPassword,
    unlockVault,
    unlockWithBiometrics,
    lockVault,
    addCredential,
    updateCredential,
    deleteCredential,
    setCredentialLogo,
    toggleFavorite,
    toggleArchive,
    importCredentials,
    getCredential,
    updateSettings,
    changeMasterPassword,
    resetVault,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) throw new Error('useVault must be used inside VaultProvider.');
  return context;
}
