/**
 * Phase 7 — Fold-style design tokens: elevation / shadows.
 *
 * Very light, neutral shadows — depth comes from subtle elevation, never heavy
 * drop shadows. iOS uses `shadow*` props; Android uses `elevation`. Each level
 * is a ready-to-spread `ViewStyle`.
 */

import { Platform, type ViewStyle } from 'react-native';

const shadowColor = '#101317';

function elevation(
  level: number,
  height: number,
  radius: number,
  opacity: number,
): ViewStyle {
  return (
    Platform.select<ViewStyle>({
      ios: {
        shadowColor,
        shadowOffset: { width: 0, height },
        shadowOpacity: opacity,
        shadowRadius: radius,
      },
      android: { elevation: level, shadowColor },
      default: {},
    }) ?? {}
  );
}

export const shadows = {
  /** Flat — no elevation. */
  none: {} as ViewStyle,
  /** Resting cards and inputs. */
  sm: elevation(2, 2, 6, 0.06),
  /** Raised cards, popovers. */
  md: elevation(6, 6, 14, 0.08),
  /** Floating nav, FABs, bottom sheets. */
  lg: elevation(12, 12, 24, 0.1),
} as const;

export type ShadowToken = keyof typeof shadows;
