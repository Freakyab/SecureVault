import {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  useFonts,
} from "@expo-google-fonts/playfair-display";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { ErrorBoundary } from "@/components/error-boundary";
import { VaultLoadingScreen } from "@/components/vault-loading-screen";
import {
  ColorThemeVaultSync,
  useVaultColors,
} from "@/contexts/color-theme-context";
import { SecureVaultThemeProvider } from "@/contexts/securevault-theme-context";
import { ToastProvider } from "@/contexts/toast-context";
import { VaultProvider, useVault } from "@/contexts/vault-context";

SplashScreen.preventAutoHideAsync();

function VaultThemeSync() {
  const { settings } = useVault();
  return <ColorThemeVaultSync colorThemeId={settings.colorTheme} />;
}

function AppNavigation() {
  const { isLoading } = useVault();
  const colors = useVaultColors();

  if (isLoading) {
    return <VaultLoadingScreen />;
  }

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
            animation: "slide_from_right",
          }}>
          <Stack.Screen name="(auth)" options={{ animation: "none" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
        </Stack>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts([
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  ]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <SecureVaultThemeProvider>
          <VaultProvider>
            <AnimatedSplashOverlay />
            <VaultThemeSync />
            <AppNavigation />
          </VaultProvider>
        </SecureVaultThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
