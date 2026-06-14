import { Redirect } from 'expo-router';

import { PasswordHealthScreen } from '@/components/screens/password-health';
import { RouteFallback } from '@/components/vault';
import { useVault } from '@/contexts/vault-context';

export default function Health() {
  const { isInitialized, isLoading, isUnlocked } = useVault();

  if (isLoading) return <RouteFallback />;
  if (!isInitialized) return <Redirect href="/" />;
  if (!isUnlocked) return <Redirect href="/unlock" />;

  return <PasswordHealthScreen />;
}
