/**
 * Phase 7 — modern UI presets (the "make it look premium" recipes).
 *
 * This is the ONE file to reach for when restyling a screen. It turns the raw
 * design tokens (colors, glass, gradients, spacing, radius, typography, shadows)
 * into ready-to-use, named style objects that mirror the redesigned Dashboard —
 * so every page gets the same premium, CRED-style look without re-deriving it.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * HOW TO RESTYLE A PAGE
 * ──────────────────────────────────────────────────────────────────────────
 *   import { LinearGradient } from 'expo-linear-gradient';
 *   import { useTheme } from '@/hooks/use-theme';
 *   import { useThemePresets } from '@/theme/presets';
 *
 *   function MyScreen() {
 *     const theme = useTheme();          // raw tokens (colors, gradients, ...)
 *     const p = useThemePresets();       // ready-made style recipes
 *
 *     return (
 *       <View style={p.screen}>
 *         <ScrollView contentContainerStyle={p.screenContent}>
 *           <Text style={p.eyebrow}>WELCOME BACK</Text>
 *           <Text style={p.display}>Hello</Text>
 *
 *           <View style={p.searchBar}>{/* ... *\/}</View>
 *
 *           <View style={p.card}>{/* any content on a glass card *\/}</View>
 *
 *           {/* gradient surfaces: wrap with LinearGradient + a preset *\/}
 *           <LinearGradient colors={theme.gradients.hero} style={p.heroCard}>
 *             ...
 *           </LinearGradient>
 *         </ScrollView>
 *       </View>
 *     );
 *   }
 *
 * RULES: never hardcode colors/spacing/radius in a screen — spread a preset or
 * read a token from `useTheme()`. To change the whole app's look, edit the
 * tokens in `src/theme/*`, not the screens.
 */

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import type { Theme } from './index';

/** Build the full preset stylesheet for a resolved theme. */
export function makePresets(t: Theme) {
  return StyleSheet.create({
    // ── Layout ──────────────────────────────────────────────────────────
    /** Root screen container (full-bleed token background). */
    screen: {
      flex: 1,
      backgroundColor: t.colors.background,
    },
    /** ScrollView/content padding for a screen body. */
    screenContent: {
      paddingHorizontal: t.layout.screenPadding,
      paddingTop: t.spacing.sm,
    },
    /** Standard space between major sections. */
    section: {
      marginTop: t.layout.sectionSpacingLarge,
    },
    /** Row that puts a title on the left and an action on the right. */
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    // ── Surfaces ────────────────────────────────────────────────────────
    /** Glass card — the default elevated surface (radius 20, soft shadow). */
    card: {
      borderRadius: t.radius.card,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
      padding: t.layout.cardPadding,
      ...t.shadows.sm,
    },
    /** Larger glass card for hero / primary surfaces (radius 24, more padding). */
    cardLarge: {
      borderRadius: t.radius.sheet,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
      padding: t.layout.cardPaddingLarge,
      ...t.shadows.sm,
    },
    /** View-style half of a gradient hero (wrap with LinearGradient + gradients.hero). */
    heroCard: {
      borderRadius: t.radius.sheet,
      borderWidth: 1,
      borderColor: t.glass.border,
      padding: t.layout.cardPaddingLarge,
      gap: t.spacing.md,
      overflow: 'hidden',
    },
    /** Thin vertical divider between inline stats. */
    divider: {
      width: 1,
      height: 32,
      backgroundColor: t.glass.border,
    },

    // ── Controls / chrome ───────────────────────────────────────────────
    /** Square glass icon button (header actions, toolbars). */
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: t.radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.glass.fill,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    /** Circular avatar ring (wrap a LinearGradient inner with gradients.accent). */
    avatarRing: {
      width: 42,
      height: 42,
      borderRadius: t.radius.full,
      padding: 2,
      backgroundColor: t.glass.fillStrong,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    avatarInner: {
      flex: 1,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Glass search bar row. */
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      height: 56,
      paddingHorizontal: t.spacing.lg,
      borderRadius: t.radius.card,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: t.colors.text,
      padding: 0,
    },
    /** Small rounded pill / chip (counts, tags, keyboard hints). */
    chip: {
      paddingHorizontal: t.spacing.sm,
      paddingVertical: t.spacing.xs,
      borderRadius: t.radius.chip,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fillStrong,
    },
    chipText: {
      fontSize: 12,
      fontWeight: '600',
      color: t.colors.textMuted,
    },
    /** Accent-tinted count badge (e.g. category counts). */
    countBadge: {
      minWidth: 28,
      height: 24,
      paddingHorizontal: t.spacing.sm,
      borderRadius: t.radius.chip,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.accentSoft,
    },
    countBadgeText: {
      fontSize: 13,
      fontWeight: '700',
      color: t.colors.accent,
    },
    /** Pill button (view-style half; wrap with LinearGradient + gradients.accent). */
    pillButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.xs,
      alignSelf: 'flex-start',
      paddingLeft: t.spacing.lg,
      paddingRight: t.spacing.md,
      paddingVertical: t.spacing.md - 2,
      borderRadius: t.radius.full,
    },
    pillButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: t.colors.onAccent,
    },
    /** Floating action button shell (wrap a LinearGradient inner with gradients.accent). */
    fab: {
      position: 'absolute',
      right: t.spacing.xl,
      width: 58,
      height: 58,
      borderRadius: t.radius.full,
      ...t.shadows.lg,
    },
    fabInner: {
      width: 58,
      height: 58,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    /** Gradient icon medallion (wrap with LinearGradient + gradients.glow). */
    medallion: {
      width: 48,
      height: 48,
      borderRadius: t.radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: t.glass.border,
    },

    // ── Text ────────────────────────────────────────────────────────────
    /** Tiny uppercase accent label above a heading. */
    eyebrow: {
      ...t.typography.label,
      color: t.colors.accent,
      letterSpacing: 2,
      marginBottom: t.spacing.sm,
    },
    /** Large serif hero heading. */
    display: {
      ...t.typography.displaySerif,
      color: t.colors.text,
    },
    /** Serif section/heading. */
    heading: {
      ...t.typography.headingSerif,
      color: t.colors.text,
    },
    /** Serif card title. */
    title: {
      ...t.typography.titleSerif,
      color: t.colors.text,
    },
    /** Default body copy (secondary text color). */
    body: {
      ...t.typography.body,
      fontSize: 14,
      lineHeight: 20,
      color: t.colors.textSecondary,
    },
    /** Muted caption. */
    caption: {
      ...t.typography.caption,
      color: t.colors.textMuted,
    },
    /** Uppercase accent section header (e.g. "MANAGE PASSWORDS"). */
    sectionTitle: {
      ...t.typography.label,
      color: t.colors.accent,
      letterSpacing: 1.4,
      opacity: 0.85,
    },
    /** Right-aligned section action ("View All"). */
    sectionAction: {
      fontSize: 12,
      fontWeight: '600',
      color: t.colors.accent,
    },
    /** Big serif stat number (summary cards). */
    statValue: {
      ...t.typography.headingSerif,
      fontSize: 24,
      color: t.colors.text,
    },
    /** Uppercase stat label under a stat value. */
    statLabel: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: t.colors.textMuted,
    },
  });
}

export type ThemePresets = ReturnType<typeof makePresets>;

/** Hook: memoized presets for the active (dark-first) theme. */
export function useThemePresets(): ThemePresets {
  const theme = useTheme();
  return useMemo(() => makePresets(theme), [theme]);
}
