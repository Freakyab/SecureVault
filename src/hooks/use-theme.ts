import { useColorScheme } from '@/hooks/use-color-scheme';
import { useColorTheme } from '@/contexts/color-theme-context';
import { getTheme, type ColorSchemeName } from '@/theme';

export function useTheme() {
  const { colorThemeId } = useColorTheme();
  const scheme = useColorScheme();
  const themeScheme: ColorSchemeName = scheme === 'light' ? 'light' : 'dark';

  return getTheme(themeScheme, colorThemeId);
}
