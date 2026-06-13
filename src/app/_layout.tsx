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
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { VaultColors } from '@/constants/vault-theme';
import { ToastProvider } from '@/contexts/toast-context';
import { VaultProvider } from '@/contexts/vault-context';

SplashScreen.preventAutoHideAsync();

const VaultNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: VaultColors.background,
    card: VaultColors.background,
    text: VaultColors.heading,
    primary: VaultColors.accent,
  },
};

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
      <VaultProvider>
        <ThemeProvider value={VaultNavTheme}>
          <ToastProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: VaultColors.background },
                animation: 'slide_from_right',
              }}>
              {/* Tab routes swap instantly so the slide transition never
                  reveals the white native window root (BUG-014). */}
              <Stack.Screen name="dashboard" options={{ animation: 'none' }} />
              <Stack.Screen name="vault" options={{ animation: 'none' }} />
              <Stack.Screen name="generator" options={{ animation: 'none' }} />
              <Stack.Screen name="health" options={{ animation: 'none' }} />
              <Stack.Screen name="settings" options={{ animation: 'none' }} />
            </Stack>
          </ToastProvider>
        </ThemeProvider>
      </VaultProvider>
    </SafeAreaProvider>
  );
}
