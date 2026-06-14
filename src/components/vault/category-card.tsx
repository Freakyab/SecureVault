import { LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

interface CategoryCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryCard({ label, count, icon: Icon, active = false, onPress }: CategoryCardProps) {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);

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
          color={active ? c.heading : c.accent}
          strokeWidth={1.75}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    card: {
      flex: 1,
      minHeight: 108,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: c.glassBorder,
      backgroundColor: c.glassBackground,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 12,
    },
    cardActive: {
      borderColor: c.accentStrong,
    },
    pressed: {
      opacity: 0.8,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accentSoft,
    },
    iconWrapActive: {
      backgroundColor: c.accentStrong,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: c.heading,
    },
  });
}
