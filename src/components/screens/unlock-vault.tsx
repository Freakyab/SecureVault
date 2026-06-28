import { Fingerprint, Settings, Shield } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { IconTile, ScreenBackground, VaultHeader } from '@/components/vault';
import { Input, Button } from '@/components/ui';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';

interface UnlockVaultScreenProps {
  onUnlock?: (password: string) => void;
  onBiometricUnlock?: () => void;
  biometricAvailable?: boolean;
  biometricLabel?: string;
}

export function UnlockVaultScreen({
  onUnlock,
  onBiometricUnlock,
  biometricAvailable = false,
  biometricLabel = 'Face ID',
}: UnlockVaultScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [password, setPassword] = useState('');

  function handleUnlock() {
    if (!password.trim()) {
      haptics.warning();
      Alert.alert('Enter your master password', 'Your vault needs your master password to unlock.');
      return;
    }

    haptics.press();
    onUnlock?.(password);
  }

  function handleBiometric() {
    haptics.selection();
    onBiometricUnlock?.();
  }

  return (
    <ScreenBackground>
      <VaultHeader trailingIcon={Settings} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + theme.spacing.xxl }]}>
        <Animated.View
          entering={FadeInDown.duration(theme.motion.duration.cardExpand)}
          style={styles.shieldWrapper}>
          <AnimatedIcon />
        </Animated.View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your master password to unlock your secure vault.</Text>

        <View style={styles.form}>
          <Input
            label="MASTER PASSWORD"
            placeholder="••••••••••••"
            value={password}
            onChangeText={setPassword}
          />

          {biometricAvailable ? (
            <View style={styles.biometric}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Unlock with ${biometricLabel}`}
                onPress={handleBiometric}
                style={({ pressed }) => [styles.biometricButton, pressed && styles.pressed]}>
                <Fingerprint size={28} color={theme.colors.accent} strokeWidth={1.75} />
              </Pressable>
              <Text style={styles.biometricCaption}>Tap to unlock with {biometricLabel}</Text>
            </View>
          ) : null}

          <View style={styles.cta}>
            <Button onPress={handleUnlock}>
              UNLOCK
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: t.layout.screenPadding,
      paddingTop: t.spacing.xxl + t.spacing.xl,
      alignItems: 'center',
      maxWidth: 448,
      width: '100%',
      alignSelf: 'center',
    },
    shieldWrapper: {
      marginBottom: t.spacing.xxl,
    },
    title: {
      ...t.typography.displaySerif,
      color: t.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      ...t.typography.body,
      marginTop: t.spacing.md,
      color: t.colors.textSecondary,
      textAlign: 'center',
      maxWidth: 300,
    },
    form: {
      marginTop: t.spacing.xxl + t.spacing.lg,
      width: '100%',
      gap: t.spacing.xxl + t.spacing.sm,
    },
    biometric: {
      alignItems: 'center',
      gap: t.spacing.md,
    },
    biometricButton: {
      width: 64,
      height: 64,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.accentSoft,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    pressed: {
      opacity: 0.8,
    },
    biometricCaption: {
      ...t.typography.caption,
      color: t.colors.textMuted,
    },
    cta: {
      gap: t.spacing.lg,
      alignItems: 'center',
    },
  });
}
