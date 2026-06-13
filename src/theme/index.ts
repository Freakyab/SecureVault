/**
 * Phase 7 — Fold-style design token system.
 *
 * Single entry point for the premium UI overhaul tokens: colors, spacing,
 * radius, typography, shadows, and motion. Consume these via the `useTheme`
 * hook (Phase 7.4) — screens must never hardcode colors, spacing, or radius.
 */

import { duration, easing, spring, stagger } from './animations';
import { colors, glass, gradients, type ColorScheme, type ColorSchemeName } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { layout, spacing } from './spacing';
import { fontFamily, fontWeight, typography } from './typography';

export * from './animations';
export * from './colors';
export * from './radius';
export * from './shadows';
export * from './spacing';
export * from './typography';

const motion = { duration, easing, spring, stagger } as const;

/** Resolved theme for a single color scheme: scheme colors + shared tokens. */
export interface Theme {
  scheme: ColorSchemeName;
  colors: ColorScheme;
  glass: (typeof glass)[ColorSchemeName];
  gradients: (typeof gradients)[ColorSchemeName];
  spacing: typeof spacing;
  layout: typeof layout;
  radius: typeof radius;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  fontWeight: typeof fontWeight;
  shadows: typeof shadows;
  motion: typeof motion;
}

/** Build a resolved theme object for the given color scheme. */
export function getTheme(scheme: ColorSchemeName): Theme {
  return {
    scheme,
    colors: colors[scheme],
    glass: glass[scheme],
    gradients: gradients[scheme],
    spacing,
    layout,
    radius,
    typography,
    fontFamily,
    fontWeight,
    shadows,
    motion,
  };
}

export { motion };
