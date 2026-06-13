import { Redirect } from 'expo-router';

import { SettingsScreen } from '@/components/screens/settings';
import { RouteFallback } from '@/components/vault';
import { useVault } from '@/contexts/vault-context';

export default function Settings() {
  const { isInitialized, isLoading, isUnlocked } = useVault();

  if (isLoading) return <RouteFallback />;
  if (!isInitialized) return <Redirect href="/" />;
  if (!isUnlocked) return <Redirect href="/unlock" />;

  return <SettingsScreen />;
}
