export interface PasswordHistoryEntry {
  password: string;
  changedAt: string;
}

export interface Credential {
  id: string;
  website: string;
  url: string;
  username: string;
  password: string;
  category: string;
  accountLabel?: string;
  notes?: string;
  folder?: string;
  tags?: string[];
  /** Optional user-supplied logo (local image URI) overriding the fetched favicon. */
  customLogoUri?: string;
  isFavorite: boolean;
  isArchived: boolean;
  passwordHistory: PasswordHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export type AppThemePreference = 'system' | 'light' | 'dark';

export type ColorThemePreference = 'blue' | 'purple' | 'gold';

export interface VaultSettings {
  biometricEnabled: boolean;
  themePreference: AppThemePreference;
  /** Accent palette: blue (default), purple, or obsidian gold. */
  colorTheme: ColorThemePreference;
  autoLockMinutes: number;
  recordPasswordHistory: boolean;
  passwordAgeReminders: boolean;
}

export interface VaultMetadata {
  version: number;
  createdAt: string;
  updatedAt: string;
  lastUnlockedAt?: string;
}

export interface VaultState {
  metadata: VaultMetadata;
  settings: VaultSettings;
  credentials: Credential[];
}

export const DEFAULT_VAULT_SETTINGS: VaultSettings = {
  biometricEnabled: true,
  themePreference: 'dark',
  colorTheme: 'blue',
  autoLockMinutes: 1,
  recordPasswordHistory: true,
  passwordAgeReminders: false,
};

export const AUTO_LOCK_PRESETS = [
  { label: 'Immediately', minutes: 0 },
  { label: '1 min', minutes: 1 },
  { label: '5 min', minutes: 5 },
  { label: '15 min', minutes: 15 },
  { label: 'Never', minutes: -1 },
] as const;
