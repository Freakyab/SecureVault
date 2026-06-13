import { Platform } from 'react-native';

import { Fonts } from '@/constants/theme';

/**
 * Design tokens for the SecureVault interface, derived from the Figma
 * "Pass-code" design. The design uses a dark aubergine base with violet
 * accents, glassmorphic surfaces, and ambient aurora glows.
 */
export const VaultColors = {
  background: '#190e27',
  backgroundDeep: '#120a1c',
  headerBackground: 'rgba(25,14,39,0.85)',
  headerBorder: 'rgba(76,67,83,0.4)',

  heading: '#eedcff',
  body: '#cfc2d5',
  muted: 'rgba(207,194,213,0.6)',
  placeholder: 'rgba(207,194,213,0.4)',

  accent: '#deb7ff',
  accentStrong: '#7b2cbf',
  accentSoft: 'rgba(123,44,191,0.2)',

  glassBackground: 'rgba(255,255,255,0.03)',
  glassBackgroundStrong: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(192,192,192,0.2)',
  inputUnderline: 'rgba(192,192,192,0.2)',

  buttonText: '#2d0050',
  avatarBackground: '#30253f',
  avatarBorder: 'rgba(76,67,83,0.3)',

  success: '#7ee0b8',
  warning: '#ffd479',
  danger: '#ff8a8a',
} as const;

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
  brand: { fontFamily: Fonts.serif, fontSize: 24, fontWeight: '500' as const, letterSpacing: -0.6 },
  title: { fontFamily: Fonts.serif, fontSize: 28, fontWeight: '600' as const, lineHeight: 36 },
  heading: { fontSize: 18, fontWeight: '600' as const, letterSpacing: 0.2 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 1.2 },
  caption: { fontSize: 12, fontWeight: '500' as const },
} as const;

export const vaultShadow = Platform.select({
  ios: {
    shadowColor: VaultColors.accentStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  android: { elevation: 8 },
  default: {},
});
