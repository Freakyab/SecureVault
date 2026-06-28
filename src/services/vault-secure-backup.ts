import { encryptJson, decryptJson, deriveKey, generateSaltHex } from '@/services/crypto/vault-crypto';
import { serializeVaultBackup, parseVaultBackup } from '@/services/vault-backup';
import { Credential } from '@/types/credential';

export interface EncryptedBackup {
  salt: string;
  payload: {
    iv: string;
    data: string;
  };
}

/**
 * Encrypts the vault credentials using a password-derived key.
 */
export async function createEncryptedBackup(credentials: Credential[], password: string): Promise<string> {
  const salt = await generateSaltHex();
  const key = await deriveKey(password, salt);
  
  const backupData = serializeVaultBackup(credentials);
  const encrypted = await encryptJson(key, backupData);
  
  const finalBackup: EncryptedBackup = {
    salt,
    payload: encrypted,
  };
  
  return JSON.stringify(finalBackup);
}

/**
 * Decrypts a backup string using the provided password.
 */
export async function decryptBackup(encryptedRaw: string, password: string): Promise<Credential[]> {
  const backup: EncryptedBackup = JSON.parse(encryptedRaw);
  const key = await deriveKey(password, backup.salt);
  
  const decryptedRaw = decryptJson<string>(key, backup.payload);
  return parseVaultBackup(decryptedRaw);
}
