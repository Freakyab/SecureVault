import { computeHealthMetrics, isOldCredential, isWeakPassword } from '@/services/health-checks';
import { Credential } from '@/types/credential';

function makeCredential(overrides: Partial<Credential> = {}): Credential {
  const now = new Date().toISOString();
  return {
    id: Math.random().toString(36).slice(2),
    website: 'example.com',
    url: 'https://example.com',
    username: 'user@example.com',
    password: 'Abcdef1!ghijklmn',
    category: 'Login',
    tags: [],
    isFavorite: false,
    isArchived: false,
    passwordHistory: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('isWeakPassword', () => {
  it('flags short passwords', () => {
    expect(isWeakPassword('Ab1!')).toBe(true);
  });

  it('flags long passwords with too little variety', () => {
    expect(isWeakPassword('aaaaaaaaaaaaaaaa')).toBe(true);
  });

  it('accepts long varied passwords', () => {
    expect(isWeakPassword('Abcdef1!ghijklmn')).toBe(false);
  });
});

describe('isOldCredential', () => {
  it('returns true for credentials older than the threshold', () => {
    const old = makeCredential({ updatedAt: new Date('2024-01-01').toISOString() });
    expect(isOldCredential(old, new Date('2026-01-01').getTime())).toBe(true);
  });

  it('returns false for recently updated credentials', () => {
    const fresh = makeCredential({ updatedAt: new Date('2026-01-01').toISOString() });
    expect(isOldCredential(fresh, new Date('2026-01-05').getTime())).toBe(false);
  });
});

describe('computeHealthMetrics', () => {
  it('returns a perfect score for an empty vault', () => {
    const metrics = computeHealthMetrics([]);
    expect(metrics.score).toBe(100);
    expect(metrics.total).toBe(0);
  });

  it('excludes archived credentials from metrics', () => {
    const metrics = computeHealthMetrics([
      makeCredential({ isArchived: true, password: 'weak' }),
      makeCredential(),
    ]);
    expect(metrics.total).toBe(1);
  });

  it('detects reused passwords and groups them', () => {
    const metrics = computeHealthMetrics([
      makeCredential({ password: 'Repeated1!repeated' }),
      makeCredential({ password: 'Repeated1!repeated' }),
      makeCredential({ password: 'Unique9!uniquepass' }),
    ]);
    expect(metrics.reused).toBe(2);
    expect(metrics.reusedGroups).toHaveLength(1);
    expect(metrics.reusedGroups[0].credentialIds).toHaveLength(2);
  });

  it('counts weak passwords and reduces the score', () => {
    const metrics = computeHealthMetrics([makeCredential({ password: 'weak' })]);
    expect(metrics.weak).toBe(1);
    expect(metrics.score).toBeLessThan(100);
  });
});
