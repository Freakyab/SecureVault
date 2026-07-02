/**
 * Global color-theme presets — single source of truth for runtime theme switching.
 *
 * Each preset supplies:
 * - `vault`   → VaultColors-shaped tokens (vault screens + shared components)
 * - `blob`    → AnimatedBlobs palette (aurora background)
 * - `dark`    → `@/theme` ColorScheme + glass + gradients (dashboard / presets)
 *
 * Switch via Settings → Appearance → Color Theme, or `setColorTheme(id)`.
 */

import type { BlobPalette } from '@/components/ui/animated-blobs';
import type { ColorScheme } from '@/theme/colors';

/** Vault screen color tokens (same keys everywhere). */
export interface VaultColorsShape {
  background: string;
  backgroundDeep: string;
  headerBackground: string;
  headerBorder: string;
  heading: string;
  body: string;
  muted: string;
  placeholder: string;
  textLabel: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  glassBackground: string;
  glassBackgroundStrong: string;
  glassBorder: string;
  inputUnderline: string;
  buttonText: string;
  avatarBackground: string;
  avatarBorder: string;
  success: string;
  warning: string;
  danger: string;
}

export interface ThemeGlassTokens {
  fill: string;
  fillStrong: string;
  border: string;
  highlight: string;
}

export interface ThemeGradientTokens {
  accent: readonly [string, string];
  hero: readonly [string, string];
  surface: readonly [string, string];
  glow: readonly [string, string];
}

export interface ColorThemePreset {
  id: ColorThemeId;
  label: string;
  swatch: string;
  vault: VaultColorsShape;
  blob: BlobPalette;
  dark: {
    colors: ColorScheme;
    glass: ThemeGlassTokens;
    gradients: ThemeGradientTokens;
  };
}

export const COLOR_THEME_IDS = ['blue', 'purple', 'gold'] as const;
export type ColorThemeId = (typeof COLOR_THEME_IDS)[number];

const sharedSemantic = {
  success: '#7ee0b8',
  warning: '#ffd479',
  danger: '#ff8a8a',
} as const;

export const COLOR_THEMES: Record<ColorThemeId, ColorThemePreset> = {
  blue: {
    id: 'blue',
    label: 'Ocean Blue',
    swatch: '#2D6CF6',
    vault: {
      background: '#0A1020',
      backgroundDeep: '#070C18',
      headerBackground: 'rgba(18,26,46,0.85)',
      headerBorder: 'rgba(160,180,220,0.22)',
      heading: '#EAF1FF',
      body: '#B7C4DC',
      muted: 'rgba(183,196,220,0.6)',
      placeholder: 'rgba(183,196,220,0.4)',
      textLabel: '#B7C4DC',
      accent: '#7FB0FF',
      accentStrong: '#2D6CF6',
      accentSoft: 'rgba(45,108,246,0.22)',
      glassBackground: 'rgba(255,255,255,0.04)',
      glassBackgroundStrong: 'rgba(255,255,255,0.07)',
      glassBorder: 'rgba(160,180,220,0.16)',
      inputUnderline: 'rgba(160,180,220,0.16)',
      buttonText: '#FFFFFF',
      avatarBackground: '#1A2640',
      avatarBorder: 'rgba(160,180,220,0.16)',
      ...sharedSemantic,
    },
    blob: ['#7FB0FF', '#2D6CF6', '#4A90E2'],
    dark: {
      colors: {
        background: '#0A1020',
        surface: '#121A2E',
        surfaceAlt: '#1A2640',
        border: 'rgba(160, 180, 220, 0.16)',
        text: '#EAF1FF',
        textSecondary: '#B7C4DC',
        textMuted: 'rgba(183, 196, 220, 0.6)',
        textLabel: '#B7C4DC',
        accent: '#7FB0FF',
        accentAlt: '#2D6CF6',
        accentSoft: 'rgba(45, 108, 246, 0.22)',
        onAccent: '#FFFFFF',
        success: '#2ECC71',
        warning: '#F4B400',
        error: '#FF4D4F',
        info: '#4A90E2',
      },
      glass: {
        fill: 'rgba(255, 255, 255, 0.04)',
        fillStrong: 'rgba(255, 255, 255, 0.07)',
        border: 'rgba(160, 180, 220, 0.16)',
        highlight: 'rgba(255, 255, 255, 0.06)',
      },
      gradients: {
        accent: ['#2D6CF6', '#7FB0FF'],
        hero: ['rgba(45, 108, 246, 0.38)', 'rgba(127, 176, 255, 0.08)'],
        surface: ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)'],
        glow: ['rgba(127, 176, 255, 0.18)', 'rgba(45, 108, 246, 0.0)'],
      },
    },
  },

  purple: {
    id: 'purple',
    label: 'Cosmic Violet',
    swatch: '#7b2cbf',
    vault: {
      background: '#140b20',
      backgroundDeep: '#0f0818',
      headerBackground: 'rgba(25,14,39,0.85)',
      headerBorder: 'rgba(76,67,83,0.4)',
      heading: '#eedcff',
      body: '#cfc2d5',
      muted: 'rgba(207,194,213,0.6)',
      placeholder: 'rgba(207,194,213,0.4)',
      textLabel: '#cfc2d5',
      accent: '#b06af0',
      accentStrong: '#7b2cbf',
      accentSoft: 'rgba(123,44,191,0.25)',
      glassBackground: 'rgba(255,255,255,0.03)',
      glassBackgroundStrong: 'rgba(255,255,255,0.06)',
      glassBorder: 'rgba(192,192,192,0.2)',
      inputUnderline: 'rgba(192,192,192,0.2)',
      buttonText: '#FFFFFF',
      avatarBackground: '#30253f',
      avatarBorder: 'rgba(76,67,83,0.3)',
      ...sharedSemantic,
    },
    blob: ['#deb7ff', '#b06af0', '#7b2cbf'],
    dark: {
      colors: {
        background: '#140b20',
        surface: '#1A1028',
        surfaceAlt: '#251535',
        border: 'rgba(192, 192, 192, 0.16)',
        text: '#eedcff',
        textSecondary: '#cfc2d5',
        textMuted: 'rgba(207, 194, 213, 0.6)',
        textLabel: '#cfc2d5',
        accent: '#b06af0',
        accentAlt: '#7b2cbf',
        accentSoft: 'rgba(123, 44, 191, 0.25)',
        onAccent: '#FFFFFF',
        success: '#2ECC71',
        warning: '#F4B400',
        error: '#FF4D4F',
        info: '#4A90E2',
      },
      glass: {
        fill: 'rgba(255, 255, 255, 0.04)',
        fillStrong: 'rgba(255, 255, 255, 0.07)',
        border: 'rgba(192, 192, 192, 0.16)',
        highlight: 'rgba(255, 255, 255, 0.06)',
      },
      gradients: {
        accent: ['#7b2cbf', '#b06af0'],
        hero: ['rgba(123, 44, 191, 0.38)', 'rgba(222, 183, 255, 0.08)'],
        surface: ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)'],
        glow: ['rgba(222, 183, 255, 0.18)', 'rgba(123, 44, 191, 0.0)'],
      },
    },
  },

  gold: {
    id: 'gold',
    label: 'Obsidian Gold',
    swatch: '#C9A227',
    vault: {
      background: '#0B0B0D',
      backgroundDeep: '#070708',
      headerBackground: 'rgba(16,14,10,0.92)',
      headerBorder: 'rgba(201,162,39,0.18)',
      heading: '#F5ECD2',
      body: '#CBC2A8',
      muted: 'rgba(203,194,168,0.6)',
      placeholder: 'rgba(203,194,168,0.4)',
      textLabel: '#CBC2A8',
      accent: '#E8C879',
      accentStrong: '#C9A227',
      accentSoft: 'rgba(201,162,39,0.22)',
      glassBackground: 'rgba(255,255,255,0.04)',
      glassBackgroundStrong: 'rgba(255,255,255,0.07)',
      glassBorder: 'rgba(201,162,39,0.14)',
      inputUnderline: 'rgba(201,162,39,0.14)',
      buttonText: '#1A1505',
      avatarBackground: '#1A1814',
      avatarBorder: 'rgba(201,162,39,0.16)',
      ...sharedSemantic,
    },
    blob: ['#F5ECD2', '#E8C879', '#C9A227'],
    dark: {
      colors: {
        background: '#0B0B0D',
        surface: '#141416',
        surfaceAlt: '#1C1C1F',
        border: 'rgba(201, 162, 39, 0.14)',
        text: '#F5ECD2',
        textSecondary: '#CBC2A8',
        textMuted: 'rgba(203, 194, 168, 0.6)',
        textLabel: '#CBC2A8',
        accent: '#E8C879',
        accentAlt: '#C9A227',
        accentSoft: 'rgba(201, 162, 39, 0.22)',
        onAccent: '#1A1505',
        success: '#2ECC71',
        warning: '#F4B400',
        error: '#FF4D4F',
        info: '#4A90E2',
      },
      glass: {
        fill: 'rgba(255, 255, 255, 0.04)',
        fillStrong: 'rgba(255, 255, 255, 0.07)',
        border: 'rgba(201, 162, 39, 0.14)',
        highlight: 'rgba(255, 255, 255, 0.06)',
      },
      gradients: {
        accent: ['#C9A227', '#E8C879'],
        hero: ['rgba(201, 162, 39, 0.32)', 'rgba(232, 200, 121, 0.08)'],
        surface: ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)'],
        glow: ['rgba(232, 200, 121, 0.16)', 'rgba(201, 162, 39, 0.0)'],
      },
    },
  },
};

export const DEFAULT_COLOR_THEME_ID: ColorThemeId = 'blue';

export function isColorThemeId(value: string | undefined | null): value is ColorThemeId {
  return COLOR_THEME_IDS.includes(value as ColorThemeId);
}

export function getColorThemePreset(id: ColorThemeId): ColorThemePreset {
  return COLOR_THEMES[id];
}
