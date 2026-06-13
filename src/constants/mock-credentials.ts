import { Credential } from '@/types/credential';

/**
 * Sample vault data for development/demos. Intentionally covers every category
 * plus a realistic mix of password health states (strong/unique, weak, reused,
 * and stale) so the Dashboard, Vault, and Password Health screens all have
 * something meaningful to render. Loaded on demand from Settings → "Load Sample
 * Data" and routed through `importCredentials`, so it is encrypted and deduped
 * like any real entry.
 */

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

interface MockSeed {
  website: string;
  url: string;
  username: string;
  password: string;
  category: string;
  accountLabel?: string;
  notes?: string;
  tags?: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
  /** Age of the entry in days; drives createdAt/updatedAt. */
  ageDays?: number;
}

const SEEDS: MockSeed[] = [
  {
    website: 'GitHub',
    url: 'https://github.com',
    username: 'ada.lovelace',
    password: 'gH7$mK2!pX9vRq4w',
    category: 'Login',
    accountLabel: 'Personal',
    tags: ['dev', 'work'],
    isFavorite: true,
    ageDays: 12,
  },
  {
    website: 'Google',
    url: 'https://accounts.google.com',
    username: 'ada.lovelace@gmail.com',
    password: 'Tz3#wL8qN1!sJ6dY',
    category: 'Login',
    accountLabel: 'Primary',
    isFavorite: true,
    ageDays: 30,
  },
  {
    website: 'Netflix',
    url: 'https://netflix.com',
    username: 'ada.lovelace@gmail.com',
    password: 'netflix123',
    category: 'Login',
    notes: 'Family plan — 4 screens.',
    ageDays: 60,
  },
  {
    website: 'Amazon',
    url: 'https://amazon.com',
    username: 'ada.lovelace@gmail.com',
    password: 'Tz3#wL8qN1!sJ6dY',
    category: 'Login',
    notes: 'Reuses the Google password — flagged by health checks.',
    ageDays: 45,
  },
  {
    website: 'Spotify',
    url: 'https://spotify.com',
    username: 'adalove',
    password: 'spotify2024',
    category: 'Login',
    ageDays: 200,
  },
  {
    website: 'Visa Signature',
    url: '',
    username: '4111 1111 1111 1111',
    password: '4242',
    category: 'Card',
    accountLabel: 'Exp 08/28 · CVV 932',
    notes: 'Primary travel card.',
    isFavorite: true,
    ageDays: 90,
  },
  {
    website: 'Chase Debit',
    url: '',
    username: '5500 0000 0000 0004',
    password: '7781',
    category: 'Card',
    accountLabel: 'Exp 03/27 · CVV 118',
    ageDays: 150,
  },
  {
    website: 'Passport Recovery Codes',
    url: '',
    username: '',
    password: 'p4ssphrase-correct-horse-battery-staple',
    category: 'Note',
    notes: 'Backup recovery codes:\n8392-1183\n2245-9981\n7720-3344',
    ageDays: 20,
  },
  {
    website: 'Ada Lovelace',
    url: '',
    username: 'ada.lovelace@gmail.com',
    password: 'AL-1815-12-10',
    category: 'Identity',
    accountLabel: 'SSN ···-··-4821 · DOB 1815-12-10',
    notes: 'Phone: +1 (555) 018-1842',
    ageDays: 220,
  },
  {
    website: 'Home Wi-Fi',
    url: '',
    username: 'Analytical-Engine-5G',
    password: 'B@bbage#1843$Diff',
    category: 'Wi-Fi',
    accountLabel: 'WPA3',
    isFavorite: true,
    ageDays: 8,
  },
  {
    website: 'Office Guest Wi-Fi',
    url: '',
    username: 'Guest',
    password: 'welcome1',
    category: 'Wi-Fi',
    ageDays: 5,
  },
  {
    website: 'OpenAI API',
    url: 'https://platform.openai.com',
    username: 'sk-proj',
    password: 'sk-proj-9aF2kLmQ7xR4tV8nWcZ1bH6yJ3dG5sP',
    category: 'API Keys',
    accountLabel: 'Production',
    notes: 'Rotate quarterly.',
    tags: ['dev'],
    ageDays: 14,
  },
  {
    website: 'AWS Access Key',
    url: 'https://console.aws.amazon.com',
    username: 'AKIA4XAMPLE7KEYID',
    password: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    category: 'API Keys',
    accountLabel: 'IAM · deploy-bot',
    tags: ['dev', 'work'],
    ageDays: 240,
  },
  {
    website: 'Old Forum Account',
    url: 'https://oldforum.example.com',
    username: 'ada99',
    password: 'forum123',
    category: 'Login',
    notes: 'Archived — no longer used.',
    isArchived: true,
    ageDays: 400,
  },
];

function createId(index: number): string {
  return `mock-${index}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildMockCredentials(): Credential[] {
  return SEEDS.map((seed, index) => {
    const timestamp = daysAgo(seed.ageDays ?? 30);
    return {
      id: createId(index),
      website: seed.website,
      url: seed.url,
      username: seed.username,
      password: seed.password,
      category: seed.category,
      accountLabel: seed.accountLabel,
      notes: seed.notes,
      tags: seed.tags ?? [],
      isFavorite: seed.isFavorite ?? false,
      isArchived: seed.isArchived ?? false,
      passwordHistory: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
}
