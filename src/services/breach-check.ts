import * as Crypto from 'expo-crypto';

import { Credential } from '@/types/credential';

/**
 * Have I Been Pwned "Pwned Passwords" range API using k-anonymity:
 * only the first 5 characters of the SHA-1 hash ever leave the device, and the
 * raw password is never transmitted. The API returns every breached suffix that
 * shares that prefix, and we match the remaining suffix locally.
 *
 * Privacy note (see ROADMAP D6): no password, username, or account leaves the
 * device — only an anonymized 5-char hash prefix.
 */
const HIBP_RANGE_URL = 'https://api.pwnedpasswords.com/range/';

export interface BreachScanResult {
  /** Distinct passwords checked against the breach corpus. */
  checkedPasswords: number;
  /** Credential ids whose password appears in a known breach. */
  breachedIds: string[];
  /** Highest single exposure count seen, for messaging. */
  maxExposures: number;
}

async function sha1Hex(value: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, value);
  return digest.toUpperCase();
}

/**
 * Returns how many times a single password appears in known breaches.
 * `0` means it was not found. Throws if the network/service is unavailable so
 * the caller can surface an offline/error state.
 */
export async function checkPasswordExposure(password: string): Promise<number> {
  if (!password) return 0;

  const hash = await sha1Hex(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const response = await fetch(`${HIBP_RANGE_URL}${prefix}`, {
    headers: { 'Add-Padding': 'true' },
  });

  if (!response.ok) throw new Error(`Breach service unavailable (${response.status}).`);

  const body = await response.text();
  for (const line of body.split('\n')) {
    const [lineSuffix, countText] = line.trim().split(':');
    if (lineSuffix === suffix) return Number.parseInt(countText, 10) || 0;
  }

  return 0;
}

/**
 * Scans every distinct (non-archived) credential password for breach exposure.
 * Passwords are de-duplicated so a reused password is only queried once.
 */
export async function scanCredentialsForBreaches(credentials: Credential[]): Promise<BreachScanResult> {
  const passwordToIds = new Map<string, string[]>();
  credentials
    .filter((credential) => !credential.isArchived && credential.password)
    .forEach((credential) => {
      const ids = passwordToIds.get(credential.password) ?? [];
      ids.push(credential.id);
      passwordToIds.set(credential.password, ids);
    });

  const breachedIds: string[] = [];
  let maxExposures = 0;

  for (const [password, ids] of passwordToIds) {
    const exposures = await checkPasswordExposure(password);
    if (exposures > 0) {
      breachedIds.push(...ids);
      maxExposures = Math.max(maxExposures, exposures);
    }
  }

  return { checkedPasswords: passwordToIds.size, breachedIds, maxExposures };
}
