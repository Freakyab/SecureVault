import * as Crypto from 'expo-crypto';

export interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  lowercase: 'abcdefghijkmnopqrstuvwxyz',
  numbers: '23456789',
  symbols: '!@#$%^&*()-_=+[]{}',
};

export const DEFAULT_GENERATOR_OPTIONS: GeneratorOptions = {
  length: 18,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

export function buildCharPool(options: GeneratorOptions) {
  let pool = '';
  if (options.uppercase) pool += CHAR_SETS.uppercase;
  if (options.lowercase) pool += CHAR_SETS.lowercase;
  if (options.numbers) pool += CHAR_SETS.numbers;
  if (options.symbols) pool += CHAR_SETS.symbols;
  return pool;
}

export function generatePassword(
  options: GeneratorOptions = DEFAULT_GENERATOR_OPTIONS,
  randomInt: (max: number) => number = secureRandomInt,
): string {
  const pool = buildCharPool(options);
  if (!pool) throw new Error('Select at least one character type.');

  const safeLength = Math.max(4, Math.min(options.length, 128));
  return Array.from({ length: safeLength }, () => pool[randomInt(pool.length)]).join('');
}

function secureRandomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0) throw new Error('Random bound must be a positive integer.');

  // Rejection sampling avoids modulo bias when max does not divide 2^32.
  const limit = 0x1_0000_0000 - (0x1_0000_0000 % max);
  const bucket = new Uint32Array(1);

  do {
    Crypto.getRandomValues(bucket);
  } while (bucket[0] >= limit);

  return bucket[0] % max;
}

export interface PasswordStrength {
  score: number;
  label: 'Weak' | 'Fair' | 'Strong';
}

export function scorePasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: 'Weak' };

  const checks = [
    password.length >= 12,
    password.length >= 16,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const passed = checks.filter(Boolean).length;
  const score = Math.round((passed / checks.length) * 100);

  if (score >= 80) return { score, label: 'Strong' };
  if (score >= 50) return { score, label: 'Fair' };
  return { score, label: 'Weak' };
}
