import { useColorTheme } from '@/contexts/color-theme-context';
import { useVault } from '@/contexts/vault-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTheme, type ColorSchemeName } from '@/theme';

export function useTheme() {
  const { colorThemeId } = useColorTheme();
  const { settings } = useVault();
  const systemScheme = useColorScheme();

  const themeScheme: ColorSchemeName =
    settings.themePreference === 'system'
      ? systemScheme === 'light'
        ? 'light'
        : 'dark'
      : settings.themePreference === 'light'
        ? 'light'
        : 'dark';

  return getTheme(themeScheme, colorThemeId);
}
