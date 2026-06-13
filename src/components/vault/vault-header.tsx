import { ArrowLeft, LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VaultColors, VaultType } from '@/constants/vault-theme';

interface VaultHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  trailingIcon?: LucideIcon;
  onTrailingPress?: () => void;
  showAvatar?: boolean;
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

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12, height: 64 + insets.top }]}>
      <View style={styles.leading}>
        {showBack ? (
          <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={20} color={VaultColors.heading} strokeWidth={1.75} />
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
          <TrailingIcon size={19} color={VaultColors.heading} strokeWidth={1.75} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: VaultColors.headerBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: VaultColors.headerBorder,
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
    backgroundColor: VaultColors.glassBackground,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
  },
  brand: {
    ...VaultType.brand,
    color: VaultColors.accent,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: VaultColors.avatarBackground,
    borderWidth: 1,
    borderColor: VaultColors.avatarBorder,
  },
  trailingButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.glassBackground,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
  },
});
