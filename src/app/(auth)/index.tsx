import { Redirect, useRouter } from 'expo-router';
import { View } from 'react-native';

import { OnboardingScreen } from '@/components/screens/onboarding';
import { useVault } from '@/contexts/vault-context';

export default function Index() {
  const router = useRouter();
  const { isInitialized, isLoading, isUnlocked } = useVault();

  if (isLoading) return <View />;
  if (isInitialized && isUnlocked) return <Redirect href="/dashboard" />;
  if (isInitialized) return <Redirect href="/unlock" />;

  return <OnboardingScreen onFinish={() => router.replace('/setup')} />;
}
