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
  light: colors.light,
  dark: colors.dark,
} as const satisfies SecureVaultThemePalettes;

export const SecureVaultLightPalette = SecureVaultTheme.light;
export const SecureVaultDarkPalette = SecureVaultTheme.dark;
