import { Credential } from '@/types/credential';

export const BACKUP_VERSION = 1;

export interface VaultBackup {
  format: 'securevault-backup';
  version: number;
  exportedAt: string;
  credentials: Credential[];
}

/**
 * Serializes the vault into a portable JSON backup string.
 *
 * NOTE: credentials are stored in plaintext today (no AES layer yet — see
 * TASK-015), so this backup is also plaintext. Callers must warn the user to
 * keep the exported text private.
 */
export function serializeVaultBackup(credentials: Credential[]): string {
  const backup: VaultBackup = {
    format: 'securevault-backup',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    credentials,
  };
  return JSON.stringify(backup, null, 2);
}

export function parseVaultBackup(raw: string): Credential[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Backup is not valid JSON.');
  }

  const backup = parsed as Partial<VaultBackup>;
  if (!backup || backup.format !== 'securevault-backup' || !Array.isArray(backup.credentials)) {
    throw new Error('This does not look like a SecureVault backup.');
  }

  return backup.credentials.map(normalizeCredential);
}

function normalizeCredential(raw: Partial<Credential>): Credential {
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
    isFavorite: raw.isFavorite ?? false,
    isArchived: raw.isArchived ?? false,
    passwordHistory: raw.passwordHistory ?? [],
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? now,
  };
}

/** Stable identity for dedupe: same website + username = same account. */
function identityKey(credential: Credential) {
  return `${credential.website.trim().toLowerCase()}::${credential.username.trim().toLowerCase()}`;
}

export interface MergeResult {
  merged: Credential[];
  added: number;
  skipped: number;
}

/**
 * Merges incoming credentials into the existing vault, skipping entries that
 * already exist by website+username identity so re-importing the same backup
 * never creates duplicates.
 */
export function mergeCredentials(existing: Credential[], incoming: Credential[]): MergeResult {
  const seen = new Set(existing.map(identityKey));
  const additions: Credential[] = [];
  let skipped = 0;

  incoming.forEach((credential) => {
    const key = identityKey(credential);
    if (seen.has(key)) {
      skipped += 1;
      return;
    }
    seen.add(key);
    additions.push(credential);
  });

  return {
    merged: [...additions, ...existing],
    added: additions.length,
    skipped,
  };
}
