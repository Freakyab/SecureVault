import { Redirect } from 'expo-router';

import { GeneratorScreen } from '@/components/screens/generator';
import { RouteFallback } from '@/components/vault';
import { useVault } from '@/contexts/vault-context';

export default function Generator() {
  const { isInitialized, isLoading, isUnlocked } = useVault();

  if (isLoading) return <RouteFallback />;
  if (!isInitialized) return <Redirect href="/" />;
  if (!isUnlocked) return <Redirect href="/unlock" />;

  return <GeneratorScreen />;
}
