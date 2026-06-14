import { LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { VaultType } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Friendly empty-state block used across Vault, Dashboard, and search (TASK-036). */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View accessibilityRole="summary" style={styles.root}>
      <View style={styles.iconTile}>
        <Icon size={26} color={c.accent} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    root: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 32,
      paddingHorizontal: 24,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.glassBorder,
      backgroundColor: c.glassBackground,
    },
    iconTile: {
      width: 56,
      height: 56,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accentSoft,
      borderWidth: 1,
      borderColor: c.accent + '40',
    },
    title: {
      ...VaultType.heading,
      color: c.heading,
      textAlign: 'center',
    },
    description: {
      fontSize: 13,
      lineHeight: 19,
      color: c.muted,
      textAlign: 'center',
      maxWidth: 280,
    },
    action: {
      marginTop: 4,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 9999,
      backgroundColor: c.accent,
    },
    actionText: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
      color: c.buttonText,
      textTransform: 'uppercase',
    },
    pressed: {
      opacity: 0.75,
    },
  });
}
