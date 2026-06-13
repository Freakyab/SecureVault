import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/contexts/toast-context';
import { VaultProvider } from '@/contexts/vault-context';

const VaultNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#190e27',
    card: '#190e27',
    text: '#eedcff',
    primary: '#deb7ff',
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <VaultProvider>
        <ThemeProvider value={VaultNavTheme}>
          <ToastProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#190e27' },
                animation: 'slide_from_right',
              }}>
              {/* Tab routes swap instantly so the slide transition never
                  reveals the white native window root (BUG-014). */}
              <Stack.Screen name="dashboard" options={{ animation: 'none' }} />
              <Stack.Screen name="vault" options={{ animation: 'none' }} />
              <Stack.Screen name="health" options={{ animation: 'none' }} />
              <Stack.Screen name="settings" options={{ animation: 'none' }} />
            </Stack>
          </ToastProvider>
        </ThemeProvider>
      </VaultProvider>
    </SafeAreaProvider>
  );
}
