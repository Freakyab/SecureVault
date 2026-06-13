import { Redirect } from 'expo-router';

import { DashboardScreen } from '@/components/screens/dashboard';
import { RouteFallback } from '@/components/vault';
import { useVault } from '@/contexts/vault-context';

export default function Dashboard() {
  const { isInitialized, isLoading, isUnlocked } = useVault();

  if (isLoading) return <RouteFallback />;
  if (!isInitialized) return <Redirect href="/" />;
  if (!isUnlocked) return <Redirect href="/unlock" />;

  return <DashboardScreen />;
}
