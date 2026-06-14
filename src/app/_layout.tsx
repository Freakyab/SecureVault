import {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  useFonts,
} from '@expo-google-fonts/playfair-display';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ColorThemeProvider, ColorThemeVaultSync, useVaultColors } from '@/contexts/color-theme-context';
import { ToastProvider } from '@/contexts/toast-context';
import { VaultProvider, useVault } from '@/contexts/vault-context';

SplashScreen.preventAutoHideAsync();

function VaultThemeSync() {
  const { settings } = useVault();
  return <ColorThemeVaultSync colorThemeId={settings.colorTheme} />;
}

function AppNavigation() {
  const colors = useVaultColors();

  const navTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: colors.background,
        card: colors.background,
        text: colors.heading,
        primary: colors.accent,
      },
    }),
    [colors],
  );

  return (
    <ThemeProvider value={navTheme}>
      <ToastProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="dashboard" options={{ animation: 'none' }} />
          <Stack.Screen name="vault" options={{ animation: 'none' }} />
          <Stack.Screen name="generator" options={{ animation: 'none' }} />
          <Stack.Screen name="health" options={{ animation: 'none' }} />
          <Stack.Screen name="settings" options={{ animation: 'none' }} />
        </Stack>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ColorThemeProvider>
        <VaultProvider>
          <VaultThemeSync />
          <AppNavigation />
        </VaultProvider>
      </ColorThemeProvider>
    </SafeAreaProvider>
  );
}
