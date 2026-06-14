import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { SerifFont } from '@/constants/theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

interface ScoreRingProps {
  /** 0–100 health score, rendered as a percentage gauge. */
  score: number;
  /** Status word shown beneath the percentage (e.g. GOOD). */
  statusLabel: string;
  /** Arc color (status-driven). */
  color: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Circular progress gauge that mirrors the Figma "Password Health" hero ring:
 * a faint full-circle track, a glowing gradient arc for the score, and a
 * serif percentage with a status word centered inside.
 */
export function ScoreRing({
  score,
  statusLabel,
  color,
  size = 168,
  strokeWidth = 10,
}: ScoreRingProps) {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="scoreArc" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={c.accent} />
            <Stop offset="1" stopColor={color} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={c.glassBorder}
          strokeWidth={strokeWidth}
          strokeDasharray="2 7"
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#scoreArc)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.value}>{clamped}%</Text>
        <Text style={[styles.label, { color }]}>{statusLabel}</Text>
      </View>
    </View>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    center: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
    value: {
      fontFamily: SerifFont.bold,
      fontSize: 44,
      color: c.heading,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 2.5,
    },
  });
}
