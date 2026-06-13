import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { AddCredentialScreen } from '@/components/screens/add-credential';
import { useVault } from '@/contexts/vault-context';

export default function AddCredential() {
  const { isInitialized, isLoading, isUnlocked } = useVault();

  if (isLoading) return <View />;
  if (!isInitialized) return <Redirect href="/" />;
  if (!isUnlocked) return <Redirect href="/unlock" />;

  return <AddCredentialScreen />;
}
