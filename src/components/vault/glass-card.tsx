import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { VaultColors, VaultRadii } from '@/constants/vault-theme';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  strong?: boolean;
}

/** Glassmorphic surface used throughout the design for cards and tiles. */
export function GlassCard({ children, style, strong = false }: GlassCardProps) {
  return (
    <View style={[styles.card, strong && styles.strong, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: VaultRadii.lg,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
    padding: 20,
  },
  strong: {
    backgroundColor: VaultColors.glassBackgroundStrong,
  },
});
