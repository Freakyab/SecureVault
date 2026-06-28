import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { OnboardingScreen } from '@/components/screens/onboarding';
import { useVault } from '@/contexts/vault-context';
import { getOnboardingComplete, setOnboardingComplete } from '@/services/onboarding';
import { useTheme } from '@/hooks/use-theme';
import { useHaptics } from '@/hooks/use-haptics';

export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const { isInitialized, isLoading, isUnlocked } = useVault();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOnboardingState() {
      try {
        const completed = await getOnboardingComplete();
        if (isMounted) setHasCompletedOnboarding(completed);
      } finally {
        if (isMounted) setIsOnboardingLoading(false);
      }
    }

    void loadOnboardingState();

    return () => {
      isMounted = false;
    };
  }, []);

  async function finishOnboarding() {
    try {
      await setOnboardingComplete();
      haptics.success();
    } catch (error) {
      console.error('Failed to persist onboarding state:', error);
    } finally {
      setHasCompletedOnboarding(true);
      router.replace('/setup');
    }
  }

  if (isLoading || isOnboardingLoading) return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  if (isInitialized && isUnlocked) return <Redirect href="/dashboard" />;
  if (isInitialized) return <Redirect href="/unlock" />;
  if (hasCompletedOnboarding) return <Redirect href="/setup" />;

  return <OnboardingScreen onFinish={() => void finishOnboarding()} />;
}
