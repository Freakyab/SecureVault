import { useColorTheme } from '@/contexts/color-theme-context';
import { getTheme, type ColorSchemeName } from '@/theme';

export function useTheme() {
  const { colorThemeId } = useColorTheme();
  const themeScheme: ColorSchemeName = 'dark';

  return getTheme(themeScheme, colorThemeId);
}
