import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { MyVaultScreen } from '@/components/screens/my-vault';
import { useVault } from '@/contexts/vault-context';

export default function MyVault() {
  const { isInitialized, isLoading, isUnlocked } = useVault();

  if (isLoading) return <View />;
  if (!isInitialized) return <Redirect href="/" />;
  if (!isUnlocked) return <Redirect href="/unlock" />;

  return <MyVaultScreen />;
}
