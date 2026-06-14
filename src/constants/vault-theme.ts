import { Platform } from 'react-native';

import { SerifFont } from '@/constants/theme';
import { COLOR_THEMES, DEFAULT_COLOR_THEME_ID, type VaultColorsShape } from '@/theme/color-themes';

/**
 * Static default palette (blue). Prefer `useVaultColors()` for runtime theme switching.
 * Module-level StyleSheet.create still reads this — migrate to makeStyles + hook for live updates.
 */
export const VaultColors: VaultColorsShape = COLOR_THEMES[DEFAULT_COLOR_THEME_ID].vault;

export type { VaultColorsShape };

export const VaultRadii = {
  sm: 12,
  md: 20,
  lg: 32,
  pill: 9999,
} as const;

export const VaultSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const VaultType = {
  brand: { fontFamily: SerifFont.semibold, fontSize: 24, letterSpacing: -0.4 },
  title: { fontFamily: SerifFont.semibold, fontSize: 28, lineHeight: 36 },
  /** Serif section title matching the Figma reference (Playfair Display). */
  sectionHeading: { fontFamily: SerifFont.semibold, fontSize: 22, letterSpacing: -0.2 },
  heading: { fontSize: 18, fontWeight: '600' as const, letterSpacing: 0.2 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 1.2 },
  caption: { fontSize: 12, fontWeight: '500' as const },
} as const;

export function vaultShadow(accentStrong: string) {
  return Platform.select({
    ios: {
      shadowColor: accentStrong,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.55,
      shadowRadius: 22,
    },
    android: { elevation: 14 },
    default: {},
  });
}

/** @deprecated Use `vaultShadow(colors.accentStrong)` for theme-aware shadows. */
export const vaultShadowLegacy = vaultShadow(VaultColors.accentStrong);
