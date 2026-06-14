import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface BlobConfig {
  /** Unique, SVG-safe id used for the radial gradient reference. */
  id: string;
  /** Solid color for the blob (radial fade to transparent). */
  color: string;
  /** Peak opacity at the blob center. */
  opacity: number;
  /** Diameter in px. */
  size: number;
  /** Resting position as a fraction (0–1) of screen width / height. */
  baseX: number;
  baseY: number;
  /** Horizontal / vertical travel distance in px across the loop. */
  travelX: number;
  travelY: number;
  /** Loop durations (ms) — different per axis so the path wanders. */
  durationX: number;
  durationY: number;
  /** Start offset so blobs fall out of sync. */
  delay: number;
}

function Blob({ id, color, opacity, size, baseX, baseY, travelX, travelY, durationX, durationY, delay }: BlobConfig) {
  'use no memo'; // React Compiler must not memoize the useAnimatedStyle worklet, or the blob freezes.
  const { width, height } = useWindowDimensions();
  const progressX = useSharedValue(0);
  const progressY = useSharedValue(0);

  useEffect(() => {
    progressX.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: durationX, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    progressY.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: durationY, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [progressX, progressY, durationX, durationY, delay]);

  const originX = baseX * width - size / 2;
  const originY = baseY * height - size / 2;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: originX + travelX * (progressX.value - 0.5) },
      { translateY: originY + travelY * (progressY.value - 0.5) },
      { scale: 0.9 + 0.25 * progressX.value },
    ],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.blob, { width: size, height: size }, animatedStyle]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="35%" stopColor={color} stopOpacity={opacity * 0.55} />
            <Stop offset="70%" stopColor={color} stopOpacity={opacity * 0.18} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

/** A center → edge color triplet for the three roaming blobs. */
export type BlobPalette = readonly [string, string, string];

/**
 * Reusable palettes. `blue` is the app-wide default (matches the global blue
 * color scheme); `violet` is kept for one-off use.
 */
export const BLOB_PALETTES = {
  blue: ['#7FB0FF', '#2D6CF6', '#4A90E2'],
  purple: ['#deb7ff', '#b06af0', '#7b2cbf'],
  gold: ['#F5ECD2', '#E8C879', '#C9A227'],
  /** @deprecated Use `purple` — kept for backwards compatibility. */
  violet: ['#deb7ff', '#b06af0', '#7b2cbf'],
} as const satisfies Record<string, BlobPalette>;

interface AnimatedBlobsProps {
  /** Three colors for the blobs (center → edges). Defaults to the blue palette. */
  colors?: BlobPalette;
  /** Speed multiplier — >1 is faster, <1 is slower. Defaults to 1. */
  speed?: number;
  /** Opacity multiplier — lower it behind dense content. Defaults to 1. */
  intensity?: number;
}

/**
 * Drifting, soft gradient blobs that roam the screen background.
 *
 * Drop it in as the first child of a screen's root `View` (behind content).
 * Works with React Compiler enabled — see the `"use no memo"` note in `Blob`.
 */
export function AnimatedBlobs({ colors = BLOB_PALETTES.blue, speed = 1, intensity = 1 }: AnimatedBlobsProps) {
  const blobs: BlobConfig[] = [
    {
      id: 'blob-a',
      color: colors[0],
      opacity: 0.22 * intensity,
      size: 460,
      baseX: 0.08,
      baseY: 0.05,
      travelX: 200,
      travelY: 150,
      durationX: 4800 / speed,
      durationY: 6200 / speed,
      delay: 0,
    },
    {
      id: 'blob-b',
      color: colors[1],
      opacity: 0.2 * intensity,
      size: 420,
      baseX: 0.95,
      baseY: 0.22,
      travelX: -220,
      travelY: 170,
      durationX: 5600 / speed,
      durationY: 4200 / speed,
      delay: 600,
    },
    {
      id: 'blob-c',
      color: colors[2],
      opacity: 0.18 * intensity,
      size: 440,
      baseX: 0.5,
      baseY: 0.95,
      travelX: 220,
      travelY: -160,
      durationX: 6400 / speed,
      durationY: 5200 / speed,
      delay: 1100,
    },
  ];

  return (
    <View pointerEvents="none" style={styles.container}>
      {blobs.map((blob) => (
        <Blob key={blob.id} {...blob} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
