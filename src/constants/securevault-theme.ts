import { colors, type ColorScheme } from '@/theme/colors';

export interface SecureVaultThemePalettes {
  light: ColorScheme;
  dark: ColorScheme;
}

/**
 * Phase 1 app-shell palettes. Keep this as a compatibility entry point while
 * the richer token system in `src/theme` remains the source of truth.
 */
export const SecureVaultTheme = {
  dark: colors.dark,
} as const satisfies { dark: ColorScheme };

export const SecureVaultDarkPalette = SecureVaultTheme.dark;
