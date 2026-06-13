import { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { VaultColors, VaultType } from '@/constants/vault-theme';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

/** Friendly empty-state block used across Vault, Dashboard, and search (TASK-036). */
export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <View accessibilityRole="summary" style={styles.root}>
      <View style={styles.iconTile}>
        <Icon size={26} color={VaultColors.accent} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.accentSoft,
    borderWidth: 1,
    borderColor: VaultColors.accent + '40',
  },
  title: {
    ...VaultType.heading,
    color: VaultColors.heading,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: VaultColors.muted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
