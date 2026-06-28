import { ChevronRight, Copy, LucideIcon, Star } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';

import { CredentialAvatar } from './credential-avatar';

export interface CredentialRowBadges {
  weak?: boolean;
  reused?: boolean;
  old?: boolean;
  breached?: boolean;
}

interface CredentialRowProps {
  name: string;
  detail: string;
  icon: LucideIcon;
  accent?: string;
  /** Brand-logo resolution inputs (TASK-006 / TASK-007). */
  website?: string;
  url?: string;
  customLogoUri?: string;
  /** Inline health indicators (TASK-032). */
  badges?: CredentialRowBadges;
  onPress?: () => void;
  onCopy?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  disabled?: boolean;
}

// Highest-severity first; we only show the top issue to keep rows clean.
const BADGE_ORDER: (keyof CredentialRowBadges)[] = ['breached', 'reused', 'weak', 'old'];

export function CredentialRow({
  name,
  detail,
  icon,
  accent,
  website,
  url,
  customLogoUri,
  badges,
  onPress,
  onCopy,
  onToggleFavorite,
  isFavorite = false,
  disabled = false,
}: CredentialRowProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const resolvedAccent = accent ?? theme.colors.accent;

  const badgeMetaByKey = useMemo<Record<keyof CredentialRowBadges, { label: string; color: string }>>(
    () => ({
      breached: { label: 'Breached', color: theme.colors.error },
      reused: { label: 'Reused', color: theme.colors.error },
      weak: { label: 'Weak', color: theme.colors.warning },
      old: { label: 'Old', color: theme.colors.accent },
    }),
    [theme],
  );

  const hasActions = Boolean(onCopy || onToggleFavorite);
  const topBadge = badges ? BADGE_ORDER.find((key) => badges[key]) : undefined;
  const badgeMeta = topBadge ? badgeMetaByKey[topBadge] : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityHint={badgeMeta ? `${badgeMeta.label} password. ${detail}` : detail}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, disabled && styles.disabled]}>
      <View style={styles.left}>
        <CredentialAvatar
          icon={icon}
          accent={resolvedAccent}
          website={website}
          url={url}
          customLogoUri={customLogoUri}
        />
        <View style={styles.text}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {badgeMeta ? (
              <View style={[styles.badge, { backgroundColor: badgeMeta.color + '22', borderColor: badgeMeta.color + '55' }]}>
                <Text style={[styles.badgeText, { color: badgeMeta.color }]}>{badgeMeta.label}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.detail} numberOfLines={1}>
            {detail}
          </Text>
        </View>
      </View>

      {hasActions ? (
        <View style={styles.actions}>
          {onCopy ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Copy ${name} password`}
              hitSlop={10}
              onPress={onCopy}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Copy size={18} color={theme.colors.textMuted} strokeWidth={1.75} />
            </Pressable>
          ) : null}
          {onToggleFavorite ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? `Unfavorite ${name}` : `Favorite ${name}`}
              accessibilityState={{ selected: isFavorite }}
              hitSlop={10}
              onPress={onToggleFavorite}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Star
                size={18}
                color={isFavorite ? theme.colors.accent : theme.colors.textMuted}
                fill={isFavorite ? theme.colors.accent : 'transparent'}
                strokeWidth={1.75}
              />
            </Pressable>
          ) : null}
        </View>
      ) : (
        <ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />
      )}
    </Pressable>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: t.spacing.md,
      paddingHorizontal: t.spacing.lg,
      borderRadius: t.radius.card,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    pressed: {
      opacity: 0.8,
    },
    disabled: {
      opacity: 0.5,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.lg,
      flexShrink: 1,
    },
    text: {
      flexShrink: 1,
      gap: 2,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      flexShrink: 1,
    },
    name: {
      ...t.typography.body,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.text,
      flexShrink: 1,
    },
    badge: {
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 2,
      borderRadius: t.radius.full,
      borderWidth: 1,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: t.fontWeight.bold,
      letterSpacing: 0.3,
    },
    detail: {
      ...t.typography.caption,
      fontSize: 12,
      color: t.colors.textMuted,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.xs + 2,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
