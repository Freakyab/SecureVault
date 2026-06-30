import { useFonts } from "expo-font";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { ErrorBoundary } from "@/components/error-boundary";
import { VaultLoadingScreen } from "@/components/vault-loading-screen";
import { ColorThemeVaultSync } from "@/contexts/color-theme-context";
import { SecureVaultThemeProvider } from "@/contexts/securevault-theme-context";
import { ToastProvider } from "@/contexts/toast-context";
import { useTheme } from "@/hooks/use-theme";
import { VaultProvider, useVault } from "@/contexts/vault-context";

SplashScreen.preventAutoHideAsync();

function VaultThemeSync() {
  const { settings } = useVault();
  return <ColorThemeVaultSync colorThemeId={settings.colorTheme} />;
}

function AppNavigation() {
  const { isLoading } = useVault();
  const theme = useTheme();

  const navTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: theme.colors.background,
        card: theme.colors.background,
        text: theme.colors.text,
        primary: theme.colors.accent,
      },
    }),
    [theme.colors.accent, theme.colors.background, theme.colors.text],
  );

  if (isLoading) {
    return <VaultLoadingScreen />;
  }

  return (
    <ThemeProvider value={navTheme}>
      <ToastProvider>
        <StatusBar style={theme.scheme === "light" ? "dark" : "light"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
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
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_500Medium: require("../../assets/fonts/PlayfairDisplay_500Medium.ttf"),
    PlayfairDisplay_600SemiBold: require("../../assets/fonts/PlayfairDisplay_600SemiBold.ttf"),
    PlayfairDisplay_700Bold: require("../../assets/fonts/PlayfairDisplay_700Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (fontError) {
    throw fontError;
  }

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
