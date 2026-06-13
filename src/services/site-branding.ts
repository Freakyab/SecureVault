import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Resolves a credential's website/URL to a domain and a cacheable favicon URL.
 * Logos are rendered with `expo-image` (which keeps an on-disk cache so they
 * survive restarts and load offline — TASK-006). On top of that we persist a
 * tiny per-domain status map so known-bad domains skip the network entirely and
 * fall back to the category icon without a flicker.
 */
const LOGO_CACHE_KEY = 'securevault.logo-cache.v1';

/** Common brand names → canonical domains for nicer quick-add matching. */
const KNOWN_DOMAINS: Record<string, string> = {
  google: 'google.com',
  gmail: 'google.com',
  youtube: 'youtube.com',
  github: 'github.com',
  apple: 'apple.com',
  icloud: 'icloud.com',
  instagram: 'instagram.com',
  facebook: 'facebook.com',
  meta: 'meta.com',
  twitter: 'twitter.com',
  x: 'x.com',
  linkedin: 'linkedin.com',
  amazon: 'amazon.com',
  netflix: 'netflix.com',
  spotify: 'spotify.com',
  microsoft: 'microsoft.com',
  outlook: 'outlook.com',
  dropbox: 'dropbox.com',
  slack: 'slack.com',
  discord: 'discord.com',
  reddit: 'reddit.com',
  paypal: 'paypal.com',
  notion: 'notion.so',
  figma: 'figma.com',
};

export type LogoStatus = 'ok' | 'fail';

/** Extracts a bare domain from a URL or free-text website name. */
export function resolveDomain(websiteOrUrl: string | undefined | null): string | null {
  if (!websiteOrUrl) return null;
  const raw = websiteOrUrl.trim().toLowerCase();
  if (!raw) return null;

  // Direct URL → host.
  const withProtocol = raw.includes('://') ? raw : `https://${raw}`;
  try {
    const host = new URL(withProtocol).hostname.replace(/^www\./, '');
    if (host.includes('.')) return host;
  } catch {
    // Not a parseable URL — fall through to brand-name matching.
  }

  const simpleName = raw.replace(/\s+/g, '').replace(/[^a-z0-9.]/g, '');
  if (KNOWN_DOMAINS[simpleName]) return KNOWN_DOMAINS[simpleName];
  if (simpleName.includes('.')) return simpleName.replace(/^www\./, '');

  return null;
}

/** Google favicon endpoint — returns a brand logo for the given domain. */
export function faviconUrl(domain: string, size = 64): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

async function readCache(): Promise<Record<string, LogoStatus>> {
  try {
    const raw = await AsyncStorage.getItem(LOGO_CACHE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, LogoStatus>) : {};
  } catch {
    return {};
  }
}

/** Returns the persisted load status for a domain, or `undefined` if unknown. */
export async function getLogoStatus(domain: string): Promise<LogoStatus | undefined> {
  const cache = await readCache();
  return cache[domain];
}

/** Persists whether a domain's favicon loaded so future renders skip retries. */
export async function setLogoStatus(domain: string, status: LogoStatus): Promise<void> {
  try {
    const cache = await readCache();
    if (cache[domain] === status) return;
    cache[domain] = status;
    await AsyncStorage.setItem(LOGO_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Cache writes are best-effort; failures must never break rendering.
  }
}
