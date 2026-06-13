/**
 * Phase 7 — Fold-style design tokens: corner radii.
 *
 * Named by component role so usage stays consistent. No arbitrary radius
 * values anywhere in the app — always reference a token below.
 */

export const radius = {
  /** Chips, small pills, inline tags. */
  chip: 12,
  /** Buttons, inputs, segmented controls. */
  button: 16,
  /** Cards and primary content surfaces. */
  card: 20,
  /** Bottom sheets and large modals. */
  sheet: 24,
  /** Floating elements (FAB, floating nav, tooltips). */
  floating: 28,
  /** Fully rounded (avatars, circular buttons). */
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
