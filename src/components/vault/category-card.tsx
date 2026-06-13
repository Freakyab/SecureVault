import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { VaultColors } from '@/constants/vault-theme';

interface CategoryCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryCard({ label, count, icon: Icon, active = false, onPress }: CategoryCardProps) {
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
          color={active ? VaultColors.heading : VaultColors.accent}
          strokeWidth={1.75}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 108,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  cardActive: {
    borderColor: VaultColors.accentStrong,
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
    backgroundColor: VaultColors.accentSoft,
  },
  iconWrapActive: {
    backgroundColor: VaultColors.accentStrong,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: VaultColors.heading,
  },
});
