import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { EditCredentialScreen } from '@/components/screens/edit-credential';
import { useVault } from '@/contexts/vault-context';

export default function EntryDetail() {
  const { isInitialized, isLoading, isUnlocked } = useVault();

  if (isLoading) return <View />;
  if (!isInitialized) return <Redirect href="/" />;
  if (!isUnlocked) return <Redirect href="/unlock" />;

  return <EditCredentialScreen />;
}
