import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import { SetupMasterPasswordScreen } from '@/components/setup-master-password';
import { RouteFallback } from '@/components/vault';
import { useVault } from '@/contexts/vault-context';

export default function Setup() {
  const router = useRouter();
  const { isInitialized, isLoading, isUnlocked, setupMasterPassword } = useVault();
  const [pendingNavigation, setPendingNavigation] = useState(false);

  // Navigate only after vault context state has flushed to this route. Calling
  // router.replace immediately after setupMasterPassword can race React's state
  // batch and land on /dashboard before isUnlocked is true.
  useEffect(() => {
    if (!pendingNavigation || !isInitialized || !isUnlocked) return;
    setPendingNavigation(false);
    router.replace('/dashboard');
  }, [pendingNavigation, isInitialized, isUnlocked, router]);

  async function handleCreate(password: string, biometricEnabled: boolean) {
    try {
      await setupMasterPassword(password, biometricEnabled);
      setPendingNavigation(true);
    } catch (error) {
      Alert.alert(
        'Could not create vault',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  }

  if (isLoading) return <RouteFallback />;
  if (isInitialized && !isUnlocked) return <Redirect href="/unlock" />;
  if (pendingNavigation || (isInitialized && isUnlocked)) return <RouteFallback />;

  return <SetupMasterPasswordScreen onCreate={handleCreate} />;
}
