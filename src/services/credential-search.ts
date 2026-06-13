import { Credential } from '@/types/credential';

/**
 * Build a single normalized, lowercased haystack from every searchable field on
 * a credential. Centralizing this keeps Home, Vault, and any account picker in
 * sync so search behaves identically everywhere (TASK-029).
 */
export function buildCredentialSearchText(credential: Credential): string {
  return [
    credential.website,
    credential.url,
    credential.username,
    credential.category,
    credential.accountLabel,
    credential.notes,
    credential.folder,
    ...(credential.tags ?? []),
  ]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(' ')
    .toLowerCase();
}

export function matchesCredentialQuery(credential: Credential, rawQuery: string): boolean {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;

  const haystack = buildCredentialSearchText(credential);
  return query.split(/\s+/).every((token) => haystack.includes(token));
}

export function filterCredentials(credentials: Credential[], rawQuery: string): Credential[] {
  const query = rawQuery.trim();
  if (!query) return credentials;
  return credentials.filter((credential) => matchesCredentialQuery(credential, query));
}
