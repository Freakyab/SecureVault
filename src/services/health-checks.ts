import { Credential } from '@/types/credential';

export const OLD_PASSWORD_THRESHOLD_DAYS = 180;

export interface ReusedGroup {
  password: string;
  credentialIds: string[];
}

export interface HealthMetrics {
  total: number;
  strong: number;
  weak: number;
  reused: number;
  old: number;
  score: number;
  weakIds: string[];
  reusedIds: string[];
  oldIds: string[];
  reusedGroups: ReusedGroup[];
}

export function isWeakPassword(password: string) {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  return password.length < 12 || variety < 3;
}

export function isOldCredential(credential: Credential, now = Date.now()) {
  const updated = new Date(credential.updatedAt).getTime();
  if (Number.isNaN(updated)) return false;
  const ageDays = (now - updated) / (1000 * 60 * 60 * 24);
  return ageDays >= OLD_PASSWORD_THRESHOLD_DAYS;
}

export function computeHealthMetrics(allCredentials: Credential[], now = Date.now()): HealthMetrics {
  // Archived credentials are excluded from health summaries by design.
  const credentials = allCredentials.filter((credential) => !credential.isArchived);

  const passwordGroups = credentials.reduce<Record<string, string[]>>((groups, credential) => {
    if (!credential.password) return groups;
    groups[credential.password] = groups[credential.password] ?? [];
    groups[credential.password].push(credential.id);
    return groups;
  }, {});

  const reusedGroups: ReusedGroup[] = Object.entries(passwordGroups)
    .filter(([, ids]) => ids.length > 1)
    .map(([password, credentialIds]) => ({ password, credentialIds }));

  const reusedIds = reusedGroups.flatMap((group) => group.credentialIds);
  const weakIds = credentials
    .filter((credential) => isWeakPassword(credential.password))
    .map((credential) => credential.id);
  const oldIds = credentials
    .filter((credential) => isOldCredential(credential, now))
    .map((credential) => credential.id);

  const weak = weakIds.length;
  const reused = reusedIds.length;
  const old = oldIds.length;
  const riskyIds = new Set([...weakIds, ...reusedIds]);
  const strong = Math.max(credentials.length - riskyIds.size, 0);

  // Calculate score as a weighted percentage of the vault's overall health.
  // Instead of absolute deductions, we use the ratio of safe passwords, 
  // while still applying a small penalty for 'old' passwords.
  const safeRatio = credentials.length === 0 ? 1 : strong / credentials.length;
  const oldPenalty = credentials.length === 0 ? 0 : (old / credentials.length) * 0.2;
  const score = Math.round((safeRatio - oldPenalty) * 100);

  return {
    total: credentials.length,
    strong,
    weak,
    reused,
    old,
    score: Math.max(0, Math.min(100, score)),
    weakIds,
    reusedIds,
    oldIds,
    reusedGroups,
  };
}
