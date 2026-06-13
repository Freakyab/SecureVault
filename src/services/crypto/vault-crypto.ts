import { gcm } from '@noble/ciphers/aes.js';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import * as Crypto from 'expo-crypto';

/**
 * Vault cryptography (Roadmap 3.5–3.7).
 *
 * - Key derivation: PBKDF2-SHA256, 120k iterations → 256-bit key.
 * - Encryption at rest: AES-256-GCM (authenticated) via @noble/ciphers.
 *
 * The master password and derived key are never written to disk in plaintext;
 * only the random salt, the GCM nonce, and the ciphertext are persisted. A
 * wrong password yields a key that fails GCM authentication on decrypt, so we
 * never need to store a separate password verifier.
 */

export const PBKDF2_ITERATIONS = 120_000;
const KEY_BYTES = 32; // AES-256
const IV_BYTES = 12; // GCM standard nonce length
const SALT_BYTES = 16;

export interface EncryptedPayload {
  /** Hex-encoded GCM nonce. */
  iv: string;
  /** Hex-encoded ciphertext (includes the GCM auth tag). */
  data: string;
}

export class VaultDecryptionError extends Error {
  constructor(message = 'Master password is incorrect, or your vault data is corrupted.') {
    super(message);
    this.name = 'VaultDecryptionError';
  }
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) hex += bytes[i].toString(16).padStart(2, '0');
  return hex;
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new VaultDecryptionError();
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    const byte = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) throw new VaultDecryptionError();
    bytes[i] = byte;
  }
  return bytes;
}

// Self-contained UTF-8 codec so we never rely on TextEncoder/TextDecoder being
// present in the JS engine (Hermes ships these inconsistently).
function utf8ToBytes(text: string): Uint8Array {
  const out: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    let code = text.charCodeAt(i);
    if (code < 0x80) {
      out.push(code);
    } else if (code < 0x800) {
      out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code >= 0xd800 && code <= 0xdbff) {
      const high = code;
      const low = text.charCodeAt(i + 1);
      i += 1;
      code = 0x10000 + ((high - 0xd800) << 10) + (low - 0xdc00);
      out.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      );
    } else {
      out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return new Uint8Array(out);
}

function bytesToUtf8(bytes: Uint8Array): string {
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const byte = bytes[i];
    i += 1;
    if (byte < 0x80) {
      out += String.fromCharCode(byte);
    } else if (byte < 0xe0) {
      out += String.fromCharCode(((byte & 0x1f) << 6) | (bytes[i] & 0x3f));
      i += 1;
    } else if (byte < 0xf0) {
      out += String.fromCharCode(
        ((byte & 0x0f) << 12) | ((bytes[i] & 0x3f) << 6) | (bytes[i + 1] & 0x3f),
      );
      i += 2;
    } else {
      const codePoint =
        ((byte & 0x07) << 18) |
        ((bytes[i] & 0x3f) << 12) |
        ((bytes[i + 1] & 0x3f) << 6) |
        (bytes[i + 2] & 0x3f);
      i += 3;
      const offset = codePoint - 0x10000;
      out += String.fromCharCode(0xd800 + (offset >> 10), 0xdc00 + (offset & 0x3ff));
    }
  }
  return out;
}

export async function generateSaltHex(): Promise<string> {
  return bytesToHex(await Crypto.getRandomBytesAsync(SALT_BYTES));
}

/** Ensures expo-crypto / PBKDF2 outputs are plain Uint8Arrays for @noble/ciphers. */
function toBytes(bytes: ArrayLike<number> & { length: number }): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

/** Derives the 256-bit AES key from the master password and salt. */
export async function deriveKey(
  masterPassword: string,
  saltHex: string,
  iterations: number = PBKDF2_ITERATIONS,
): Promise<Uint8Array> {
  const derived = await pbkdf2Async(sha256, utf8ToBytes(masterPassword), hexToBytes(saltHex), {
    c: iterations,
    dkLen: KEY_BYTES,
  });
  return toBytes(derived);
}

export function keyToHex(key: Uint8Array): string {
  return bytesToHex(key);
}

export function hexToKey(hex: string): Uint8Array {
  return hexToBytes(hex);
}

/** Encrypts a JSON-serializable value into an authenticated AES-GCM payload. */
export async function encryptJson(key: Uint8Array, value: unknown): Promise<EncryptedPayload> {
  const iv = toBytes(await Crypto.getRandomBytesAsync(IV_BYTES));
  const safeKey = toBytes(key);
  const plaintext = utf8ToBytes(JSON.stringify(value));
  const ciphertext = gcm(safeKey, iv).encrypt(plaintext);
  return { iv: bytesToHex(iv), data: bytesToHex(ciphertext) };
}

/**
 * Decrypts an AES-GCM payload back into a parsed value. Throws
 * `VaultDecryptionError` when the key is wrong or the data is tampered/corrupt.
 */
export function decryptJson<T>(key: Uint8Array, payload: EncryptedPayload): T {
  try {
    const iv = hexToBytes(payload.iv);
    const plaintext = gcm(key, iv).decrypt(hexToBytes(payload.data));
    return JSON.parse(bytesToUtf8(plaintext)) as T;
  } catch (error) {
    if (error instanceof VaultDecryptionError) throw error;
    throw new VaultDecryptionError();
  }
}
