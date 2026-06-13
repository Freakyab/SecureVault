import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { VaultColors } from '@/constants/vault-theme';

interface CategoryCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  onPress?: () => void;
}

export function CategoryCard({ label, count, icon: Icon, onPress }: CategoryCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${count} items`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Icon size={20} color={VaultColors.accent} strokeWidth={1.75} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.count}>{count} items</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 108,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.accentSoft,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: VaultColors.heading,
  },
  count: {
    fontSize: 11,
    fontWeight: '500',
    color: VaultColors.muted,
  },
});
