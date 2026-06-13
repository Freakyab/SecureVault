/**
 * Phase 7 — Fold-style design tokens: spacing.
 *
 * Strict 8-point scale. Use these tokens for padding, margins, and gaps — never
 * arbitrary pixel values. Composite tokens encode the layout conventions from
 * the Phase 7 reference (card padding 20–24, screen h-padding 20, section
 * v-spacing 24–32).
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingToken = keyof typeof spacing;

/** Common layout measurements derived from the 8-pt scale. */
export const layout = {
  /** Default card inner padding. */
  cardPadding: 20,
  /** Roomier card inner padding for hero / primary cards. */
  cardPaddingLarge: 24,
  /** Horizontal padding for full-screen content. */
  screenPadding: 20,
  /** Vertical spacing between major sections. */
  sectionSpacing: 24,
  /** Wider vertical spacing for clearly separated sections. */
  sectionSpacingLarge: 32,
} as const;
