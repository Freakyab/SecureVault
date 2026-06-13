import { Redirect, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { SetupMasterPasswordScreen } from '@/components/setup-master-password';
import { useVault } from '@/contexts/vault-context';

export default function Setup() {
  const router = useRouter();
  const { isInitialized, isLoading, isUnlocked, setupMasterPassword } = useVault();

  async function handleCreate(password: string, biometricEnabled: boolean) {
    try {
      await setupMasterPassword(password, biometricEnabled);
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert(
        'Could not create vault',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  }

  if (isLoading) return <View />;
  if (isInitialized && isUnlocked) return <Redirect href="/dashboard" />;
  if (isInitialized) return <Redirect href="/unlock" />;

  return <SetupMasterPasswordScreen onCreate={handleCreate} />;
}
