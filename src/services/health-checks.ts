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

  const deductions = weak * 12 + reused * 10 + old * 4;
  const score = credentials.length === 0 ? 100 : Math.max(0, 100 - deductions);

  return {
    total: credentials.length,
    strong,
    weak,
    reused,
    old,
    score,
    weakIds,
    reusedIds,
    oldIds,
    reusedGroups,
  };
}
