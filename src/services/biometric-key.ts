import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Stores the derived AES vault key in the device keystore so biometric unlock
 * can decrypt the vault without re-deriving from the master password (which is
 * never stored). The key is only persisted while the user keeps biometric
 * unlock enabled, and is wiped on disable/reset/lock-change.
 */

const BIOMETRIC_KEY_STORAGE = 'securevault.biometric-key';

export async function storeBiometricKey(keyHex: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await SecureStore.setItemAsync(BIOMETRIC_KEY_STORAGE, keyHex, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch {
    // Secure storage may be unavailable on some emulators; biometric unlock
    // simply falls back to the master password in that case.
  }
}

export async function getBiometricKey(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  try {
    return await SecureStore.getItemAsync(BIOMETRIC_KEY_STORAGE);
  } catch {
    return null;
  }
}

export async function clearBiometricKey(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await SecureStore.deleteItemAsync(BIOMETRIC_KEY_STORAGE);
  } catch {
    // Ignore — nothing to clear or storage unavailable.
  }
}
