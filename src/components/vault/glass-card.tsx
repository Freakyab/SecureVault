import { ReactNode, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useVaultColors } from '@/contexts/color-theme-context';
import { VaultRadii } from '@/constants/vault-theme';
import type { VaultColorsShape } from '@/theme/color-themes';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  strong?: boolean;
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    card: {
      borderRadius: VaultRadii.lg,
      borderWidth: 1,
      borderColor: c.glassBorder,
      backgroundColor: c.glassBackground,
      padding: 20,
    },
    strong: {
      backgroundColor: c.glassBackgroundStrong,
    },
  });
}

/** Glassmorphic surface used throughout the design for cards and tiles. */
export function GlassCard({ children, style, strong = false }: GlassCardProps) {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return <View style={[styles.card, strong && styles.strong, style]}>{children}</View>;
}
