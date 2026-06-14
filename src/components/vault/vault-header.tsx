import { ArrowLeft, LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useVaultColors } from '@/contexts/color-theme-context';
import { VaultType } from '@/constants/vault-theme';
import type { VaultColorsShape } from '@/theme/color-themes';

interface VaultHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  trailingIcon?: LucideIcon;
  onTrailingPress?: () => void;
  showAvatar?: boolean;
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: c.headerBackground,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.headerBorder,
    },
    leading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.glassBackground,
      borderWidth: 1,
      borderColor: c.glassBorder,
    },
    brand: {
      ...VaultType.brand,
      color: c.accent,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 9999,
      backgroundColor: c.avatarBackground,
      borderWidth: 1,
      borderColor: c.avatarBorder,
    },
    trailingButton: {
      width: 40,
      height: 40,
      borderRadius: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.glassBackground,
      borderWidth: 1,
      borderColor: c.glassBorder,
    },
  });
}

export function VaultHeader({
  title = 'SecureVault',
  showBack = false,
  onBack,
  trailingIcon: TrailingIcon,
  onTrailingPress,
  showAvatar = false,
}: VaultHeaderProps) {
  const insets = useSafeAreaInsets();
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12, height: 64 + insets.top }]}>
      <View style={styles.leading}>
        {showBack ? (
          <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={20} color={c.heading} strokeWidth={1.75} />
          </Pressable>
        ) : null}
        <Text style={styles.brand}>{title}</Text>
      </View>

      {showAvatar ? <View style={styles.avatar} /> : null}
      {TrailingIcon ? (
        <Pressable
          accessibilityLabel="Header action"
          hitSlop={12}
          onPress={onTrailingPress}
          style={styles.trailingButton}>
          <TrailingIcon size={19} color={c.heading} strokeWidth={1.75} />
        </Pressable>
      ) : null}
    </View>
  );
}
