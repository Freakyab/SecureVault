/**
 * Phase 7 — premium (CRED-style blend) design tokens: color system.
 *
 * A deep aubergine-black canvas with violet accents, glassy elevated surfaces,
 * and subtle gradient glows — CRED-level polish kept usable for a password
 * manager. The accent still reads as the SecureVault violet and should occupy
 * < 10% of any screen.
 *
 * The app ships dark-only to maintain its premium aesthetic.
 *
 * Never hardcode raw hex in screens — read from here.
 */

/** Premium blue accent for the dark scheme (foreground sky-blue + solid fill). */
export const brandDark = {
  accent: '#7FB0FF',
  accentAlt: '#2D6CF6',
  accentSoft: 'rgba(45, 108, 246, 0.22)',
  onAccent: '#FFFFFF',
} as const;

/** Semantic status colors (shared across schemes). */
export const semantic = {
  success: '#2ECC71',
  warning: '#F4B400',
  error: '#FF4D4F',
  info: '#4A90E2',
} as const;

export interface ColorScheme {
  /** App background — the lowest surface in the stack. */
  background: string;
  /** Default elevated surface (cards, sheets). */
  surface: string;
  /** Secondary surface for nested / inset elements. */
  surfaceAlt: string;
  /** Hairline border / divider color. */
  border: string;

  /** Primary text. */
  text: string;
  /** Secondary text (supporting copy). */
  textSecondary: string;
  /** Muted text (captions, disabled, placeholders). */
  textMuted: string;

  /** Brand accent + its companions (mirrors `brandDark`). */
  accent: string;
  accentAlt: string;
  accentSoft: string;
  onAccent: string;

  /** Semantic status colors (mirrors `semantic`). */
  success: string;
  warning: string;
  error: string;
  info: string;
}

const dark: ColorScheme = {
  background: '#0A1020',
  surface: '#121A2E',
  surfaceAlt: '#1A2640',
  border: 'rgba(160, 180, 220, 0.16)',

  text: '#EAF1FF',
  textSecondary: '#B7C4DC',
  textMuted: 'rgba(183, 196, 220, 0.6)',

  ...brandDark,
  ...semantic,
};

export const colors = { dark } as const;

export type ColorSchemeName = keyof typeof colors;

/**
 * Glassmorphic surface tokens per scheme — translucent fills + hairline borders
 * for elevated cards, search bars, and floating elements.
 */
export const glass = {
  dark: {
    fill: 'rgba(255, 255, 255, 0.04)',
    fillStrong: 'rgba(255, 255, 255, 0.07)',
    border: 'rgba(160, 180, 220, 0.16)',
    highlight: 'rgba(255, 255, 255, 0.06)',
  },
} as const;

/**
 * Multi-stop gradients (as `readonly string[]` tuples) for premium depth:
 * accent fills, hero washes, glass surfaces, and ambient glows. Pair with
 * `expo-linear-gradient`.
 */
export const gradients = {
  dark: {
    accent: ['#2D6CF6', '#7FB0FF'],
    hero: ['rgba(45, 108, 246, 0.38)', 'rgba(127, 176, 255, 0.08)'],
    surface: ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)'],
    glow: ['rgba(127, 176, 255, 0.18)', 'rgba(45, 108, 246, 0.0)'],
  },
} as const;
