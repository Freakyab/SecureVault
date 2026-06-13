import { Redirect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { UnlockVaultScreen } from '@/components/screens/unlock-vault';
import { RouteFallback } from '@/components/vault';
import { useVault } from '@/contexts/vault-context';
import {
  authenticateWithBiometrics,
  BiometricAvailability,
  canUseBiometrics,
  getBiometricAvailability,
} from '@/services/biometric';

export default function Unlock() {
  const router = useRouter();
  const { isInitialized, isLoading, isUnlocked, settings, unlockVault, unlockWithBiometrics } = useVault();
  const [biometric, setBiometric] = useState<BiometricAvailability | null>(null);
  const promptedRef = useRef(false);

  useEffect(() => {
    void getBiometricAvailability().then(setBiometric);
  }, []);

  const biometricReady = Boolean(settings.biometricEnabled && canUseBiometrics(biometric));

  const runBiometricUnlock = useCallback(async () => {
    if (!biometricReady) return;
    const success = await authenticateWithBiometrics('Unlock SecureVault');
    if (!success) return;
    try {
      await unlockWithBiometrics();
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert(
        'Could not unlock vault',
        error instanceof Error ? error.message : 'Please use your master password.',
      );
    }
  }, [biometricReady, router, unlockWithBiometrics]);

  // Auto-prompt the scanner once when the screen opens and biometrics are ready.
  useEffect(() => {
    if (biometricReady && !promptedRef.current) {
      promptedRef.current = true;
      void runBiometricUnlock();
    }
  }, [biometricReady, runBiometricUnlock]);

  async function handleUnlock(password: string) {
    try {
      await unlockVault(password);
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert(
        'Could not unlock vault',
        error instanceof Error ? error.message : 'Please check your password.',
      );
    }
  }

  if (isLoading) return <RouteFallback />;
  if (!isInitialized) return <Redirect href="/" />;
  if (isUnlocked) return <Redirect href="/dashboard" />;

  return (
    <UnlockVaultScreen
      onUnlock={handleUnlock}
      onBiometricUnlock={() => void runBiometricUnlock()}
      biometricAvailable={biometricReady}
      biometricLabel={biometric?.label ?? 'Face ID'}
    />
  );
}
