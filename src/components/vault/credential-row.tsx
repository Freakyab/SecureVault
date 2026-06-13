import { ChevronRight, Copy, LucideIcon, Star } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { VaultColors } from '@/constants/vault-theme';

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

const BADGE_META: Record<keyof CredentialRowBadges, { label: string; color: string }> = {
  breached: { label: 'Breached', color: VaultColors.danger },
  reused: { label: 'Reused', color: VaultColors.danger },
  weak: { label: 'Weak', color: VaultColors.warning },
  old: { label: 'Old', color: VaultColors.accent },
};

// Highest-severity first; we only show the top issue to keep rows clean.
const BADGE_ORDER: (keyof CredentialRowBadges)[] = ['breached', 'reused', 'weak', 'old'];

export function CredentialRow({
  name,
  detail,
  icon,
  accent = VaultColors.accent,
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
  const hasActions = Boolean(onCopy || onToggleFavorite);
  const topBadge = badges ? BADGE_ORDER.find((key) => badges[key]) : undefined;
  const badgeMeta = topBadge ? BADGE_META[topBadge] : undefined;

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
          accent={accent}
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
              <Copy size={18} color={VaultColors.muted} strokeWidth={1.75} />
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
                color={isFavorite ? VaultColors.accent : VaultColors.muted}
                fill={isFavorite ? VaultColors.accent : 'transparent'}
                strokeWidth={1.75}
              />
            </Pressable>
          ) : null}
        </View>
      ) : (
        <ChevronRight size={18} color={VaultColors.muted} strokeWidth={2} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
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
    gap: 16,
    flexShrink: 1,
  },
  text: {
    flexShrink: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: VaultColors.heading,
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  detail: {
    fontSize: 12,
    fontWeight: '500',
    color: VaultColors.muted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
