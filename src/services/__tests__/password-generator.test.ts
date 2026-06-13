import {
  buildCharPool,
  DEFAULT_GENERATOR_OPTIONS,
  generatePassword,
  scorePasswordStrength,
} from '@/services/password-generator';

describe('buildCharPool', () => {
  it('includes only the selected character sets', () => {
    const pool = buildCharPool({
      length: 12,
      uppercase: true,
      lowercase: false,
      numbers: false,
      symbols: false,
    });
    expect(pool).toBe('ABCDEFGHJKLMNPQRSTUVWXYZ');
  });

  it('returns an empty pool when nothing is selected', () => {
    const pool = buildCharPool({
      length: 12,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
    });
    expect(pool).toBe('');
  });
});

describe('generatePassword', () => {
  it('respects the requested length', () => {
    const password = generatePassword({ ...DEFAULT_GENERATOR_OPTIONS, length: 24 });
    expect(password).toHaveLength(24);
  });

  it('clamps length into the 4..128 range', () => {
    expect(generatePassword({ ...DEFAULT_GENERATOR_OPTIONS, length: 1 })).toHaveLength(4);
    expect(generatePassword({ ...DEFAULT_GENERATOR_OPTIONS, length: 999 })).toHaveLength(128);
  });

  it('only uses characters from the active pool', () => {
    const options = {
      length: 40,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
    };
    const password = generatePassword(options);
    expect(password).toMatch(/^[23456789]+$/);
  });

  it('is deterministic when given a fixed random source', () => {
    const password = generatePassword(DEFAULT_GENERATOR_OPTIONS, () => 0);
    const pool = buildCharPool(DEFAULT_GENERATOR_OPTIONS);
    expect(password).toBe(pool[0].repeat(DEFAULT_GENERATOR_OPTIONS.length));
  });

  it('throws when no character types are selected', () => {
    expect(() =>
      generatePassword({
        length: 12,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
      }),
    ).toThrow('Select at least one character type.');
  });
});

describe('scorePasswordStrength', () => {
  it('treats empty passwords as weak', () => {
    expect(scorePasswordStrength('')).toEqual({ score: 0, label: 'Weak' });
  });

  it('labels short simple passwords as weak', () => {
    expect(scorePasswordStrength('abc').label).toBe('Weak');
  });

  it('labels long varied passwords as strong', () => {
    expect(scorePasswordStrength('Abcdef1!ghijklmn').label).toBe('Strong');
  });
});
