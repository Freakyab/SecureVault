import { Redirect } from 'expo-router';

import { ChangePasswordScreen } from '@/components/screens/change-password';
import { RouteFallback } from '@/components/vault';
import { useVault } from '@/contexts/vault-context';

export default function ChangePassword() {
  const { isInitialized, isLoading, isUnlocked } = useVault();

  if (isLoading) return <RouteFallback />;
  if (!isInitialized) return <Redirect href="/" />;
  if (!isUnlocked) return <Redirect href="/unlock" />;

  return <ChangePasswordScreen />;
}
