import { ArrowLeft, LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';

interface VaultHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  trailingIcon?: LucideIcon;
  onTrailingPress?: () => void;
  showAvatar?: boolean;
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: t.layout.screenPadding,
      paddingBottom: t.spacing.md,
      backgroundColor: t.colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: t.glass.border,
    },
    leading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.glass.fill,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    brand: {
      ...t.typography.headingSerif,
      fontSize: 24,
      color: t.colors.accent,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    trailingButton: {
      width: 40,
      height: 40,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.glass.fill,
      borderWidth: 1,
      borderColor: t.glass.border,
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
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12, height: 64 + insets.top }]}>
      <View style={styles.leading}>
        {showBack ? (
          <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={20} color={theme.colors.text} strokeWidth={1.75} />
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
          <TrailingIcon size={19} color={theme.colors.text} strokeWidth={1.75} />
        </Pressable>
      ) : null}
    </View>
  );
}
