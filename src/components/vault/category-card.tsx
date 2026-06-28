import { LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';

interface CategoryCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryCard({ label, count, icon: Icon, active = false, onPress }: CategoryCardProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${count} items`}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, active && styles.cardActive, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
        <Icon
          size={20}
          color={active ? theme.colors.text : theme.colors.accent}
          strokeWidth={1.75}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    card: {
      flex: 1,
      minHeight: 108,
      borderRadius: t.radius.floating,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: t.spacing.lg,
      gap: t.spacing.md,
    },
    cardActive: {
      borderColor: t.colors.accentAlt,
    },
    pressed: {
      opacity: 0.8,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.accentSoft,
    },
    iconWrapActive: {
      backgroundColor: t.colors.accentAlt,
    },
    label: {
      ...t.typography.caption,
      fontSize: 14,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.text,
    },
  });
}
