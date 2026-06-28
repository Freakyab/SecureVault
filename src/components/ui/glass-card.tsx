import { ReactNode, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  strong?: boolean;
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    card: {
      borderRadius: t.radius.sheet,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
      padding: t.layout.cardPadding,
    },
    strong: {
      backgroundColor: t.glass.fillStrong,
    },
  });
}

/** Glassmorphic surface used throughout the design for cards and tiles. */
export function GlassCard({ children, style, strong = false }: GlassCardProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return <View style={[styles.card, strong && styles.strong, style]}>{children}</View>;
}
