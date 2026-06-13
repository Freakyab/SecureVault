import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface BiometricAvailability {
  /** Device exposes biometric hardware (sensor present). */
  hasHardware: boolean;
  /** User has enrolled at least one biometric (face/finger/iris). */
  isEnrolled: boolean;
  /** Friendly label for the strongest available method. */
  label: string;
}

/** Biometric unlock can only be offered when hardware exists AND is enrolled. */
export function canUseBiometrics(availability: BiometricAvailability | null): boolean {
  return Boolean(availability?.hasHardware && availability?.isEnrolled);
}

function labelForTypes(types: LocalAuthentication.AuthenticationType[]): string {
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'Face ID';
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) return 'Iris';
  return 'Biometrics';
}

/**
 * Reads the device's biometric capability. Never throws — on web or any
 * unexpected failure it reports the feature as unavailable so callers can fall
 * back to the master password.
 */
export async function getBiometricAvailability(): Promise<BiometricAvailability> {
  if (Platform.OS === 'web') {
    return { hasHardware: false, isEnrolled: false, label: 'Biometrics' };
  }

  try {
    const [hasHardware, isEnrolled, types] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync(),
    ]);

    return { hasHardware, isEnrolled, label: labelForTypes(types) };
  } catch {
    return { hasHardware: false, isEnrolled: false, label: 'Biometrics' };
  }
}

/**
 * Prompts the device biometric scanner. Returns `true` only on a successful
 * scan. Falls back gracefully (returns `false`) on web, cancellation, or error.
 */
export async function authenticateWithBiometrics(promptMessage = 'Unlock SecureVault'): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Use master password',
      fallbackLabel: 'Use master password',
      disableDeviceFallback: false,
    });
    return result.success;
  } catch {
    return false;
  }
}
