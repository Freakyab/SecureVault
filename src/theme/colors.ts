/**
 * Phase 7 — premium (CRED-style blend) design tokens: color system.
 *
 * A deep aubergine-black canvas with violet accents, glassy elevated surfaces,
 * and subtle gradient glows — CRED-level polish kept usable for a password
 * manager. The accent still reads as the SecureVault violet and should occupy
 * < 10% of any screen.
 *
 * Two schemes (`light` / `dark`) share the same token names so screens can read
 * tokens through `useTheme()` without branching on color scheme. The app ships
 * dark-first, so the `dark` scheme carries the premium look; `light` keeps a
 * calm neutral fallback.
 *
 * Never hardcode raw hex in screens — read from here.
 */

/** SecureVault brand accent for the light scheme. */
export const brand = {
  /** Primary accent (buttons, active states, focus rings). */
  accent: '#5F61F6',
  /** Slightly lighter brand tint for gradients / pressed states. */
  accentAlt: '#6568F7',
  /** Low-opacity accent wash for subtle highlights / selected surfaces. */
  accentSoft: 'rgba(95, 97, 246, 0.12)',
  /** Foreground color to use on top of the solid accent. */
  onAccent: '#FFFFFF',
} as const;

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

  /** Brand accent + its companions (mirrors `brand`). */
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

const light: ColorScheme = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F3F5',
  border: '#E9ECEF',

  text: '#121212',
  textSecondary: '#6C757D',
  textMuted: '#ADB5BD',

  ...brand,
  ...semantic,
};

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

export const colors = { light, dark } as const;

export type ColorSchemeName = keyof typeof colors;

/**
 * Glassmorphic surface tokens per scheme — translucent fills + hairline borders
 * for elevated cards, search bars, and floating elements.
 */
export const glass = {
  light: {
    fill: 'rgba(18, 18, 18, 0.04)',
    fillStrong: 'rgba(18, 18, 18, 0.06)',
    border: 'rgba(18, 18, 18, 0.08)',
    highlight: 'rgba(255, 255, 255, 0.6)',
  },
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
  light: {
    accent: ['#6568F7', '#5F61F6'],
    hero: ['rgba(95, 97, 246, 0.16)', 'rgba(95, 97, 246, 0.02)'],
    surface: ['rgba(255, 255, 255, 0.9)', 'rgba(245, 246, 250, 0.7)'],
    glow: ['rgba(95, 97, 246, 0.14)', 'rgba(95, 97, 246, 0.0)'],
  },
  dark: {
    accent: ['#2D6CF6', '#7FB0FF'],
    hero: ['rgba(45, 108, 246, 0.38)', 'rgba(127, 176, 255, 0.08)'],
    surface: ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)'],
    glow: ['rgba(127, 176, 255, 0.18)', 'rgba(45, 108, 246, 0.0)'],
  },
} as const;
