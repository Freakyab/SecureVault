import { PropsWithChildren } from 'react';

import { ColorThemeProvider } from '@/contexts/color-theme-context';
import { useTheme } from '@/hooks/use-theme';

export function SecureVaultThemeProvider({ children }: PropsWithChildren) {
  return <ColorThemeProvider>{children}</ColorThemeProvider>;
}

export function useSecureVaultTheme() {
  return useTheme();
}
