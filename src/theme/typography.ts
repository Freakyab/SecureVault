/**
 * Phase 7 — Fold-style design tokens: typography.
 *
 * One font family, at most three weights (Regular / Medium / SemiBold + Bold for
 * Display). The scale is fixed — screens pick a named variant rather than
 * setting font sizes/weights directly.
 *
 * Reference (Phase 7): Display 32/Bold · Heading 24/SemiBold · Title 20/SemiBold ·
 * Body 16/Regular · Caption 13/Medium · Label 11/Medium.
 */

import type { TextStyle } from 'react-native';

import { Fonts } from '@/constants/theme';

/** Single app font family (system sans by default). */
export const fontFamily = Fonts.sans;

/**
 * Serif display family (Plus Jakarta-style premium headings). Uses the
 * Playfair Display weights loaded in `app/_layout.tsx`. Reserved for large
 * display / hero headings — body copy stays on the sans family.
 */
export const serifFont = {
  medium: 'PlayfairDisplay_500Medium',
  semibold: 'PlayfairDisplay_600SemiBold',
  bold: 'PlayfairDisplay_700Bold',
} as const;

/** Allowed font weights — keep to this set to preserve visual rhythm. */
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type FontWeightToken = keyof typeof fontWeight;

type TypeVariant = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'
>;

export const typography = {
  display: {
    fontFamily,
    fontSize: 32,
    fontWeight: fontWeight.bold,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heading: {
    fontFamily,
    fontSize: 24,
    fontWeight: fontWeight.semibold,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  title: {
    fontFamily,
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: fontWeight.regular,
    lineHeight: 24,
  },
  caption: {
    fontFamily,
    fontSize: 13,
    fontWeight: fontWeight.medium,
    lineHeight: 18,
  },
  label: {
    fontFamily,
    fontSize: 11,
    fontWeight: fontWeight.medium,
    lineHeight: 14,
    letterSpacing: 0.4,
  },

  /** Premium serif headings (used by the modern card-based screens). */
  displaySerif: {
    fontFamily: serifFont.bold,
    fontSize: 30,
    fontWeight: fontWeight.bold,
    lineHeight: 38,
    letterSpacing: -0.4,
  },
  headingSerif: {
    fontFamily: serifFont.semibold,
    fontSize: 22,
    fontWeight: fontWeight.semibold,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  titleSerif: {
    fontFamily: serifFont.semibold,
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
} satisfies Record<string, TypeVariant>;

export type TypographyToken = keyof typeof typography;
