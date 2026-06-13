import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTheme, type ColorSchemeName } from '@/theme';

export function useTheme() {
  const scheme = useColorScheme();
  // SecureVault ships dark-first: only an explicit light scheme opts out of the
  // premium dark tokens, so unspecified/null resolves to dark.
  const themeScheme: ColorSchemeName = scheme === 'light' ? 'light' : 'dark';

  return getTheme(themeScheme);
}
