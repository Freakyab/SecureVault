import { Stack } from 'expo-router';

import { useVaultColors } from '@/contexts/color-theme-context';

export default function AuthLayout() {
  const colors = useVaultColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
