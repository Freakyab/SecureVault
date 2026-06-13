/**
 * Phase 7 — Fold-style design tokens: motion.
 *
 * Centralized durations and easing so every animation feels consistent and
 * stays under 350ms. Screens and the UI kit must read durations from here
 * rather than inlining magic numbers.
 *
 * Reference (Phase 7): tap 120 · button 180 · card expand 250 · navigation 300 ·
 * modal 350 (ms).
 */

import { Easing } from 'react-native-reanimated';

/** Motion durations in milliseconds. Keep everything <= 350ms. */
export const duration = {
  tap: 120,
  button: 180,
  cardExpand: 250,
  navigation: 300,
  modal: 350,
} as const;

export type DurationToken = keyof typeof duration;

/** Shared easing curves. */
export const easing = {
  /** Default ease for most transitions. */
  standard: Easing.out(Easing.cubic),
  /** Entrances (fade + slide-up). */
  entrance: Easing.out(Easing.ease),
  /** Exits. */
  exit: Easing.in(Easing.ease),
} as const;

/** Spring config for press feedback (button scale to 0.98, spring return). */
export const spring = {
  press: { damping: 18, stiffness: 320, mass: 0.6 },
} as const;

/** Stagger delay (ms) between items in a list entrance animation. */
export const stagger = {
  list: 30,
} as const;
