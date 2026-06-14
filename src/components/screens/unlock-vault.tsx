import { Fingerprint, Settings, Shield } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconTile, InputField, PrimaryButton, ScreenBackground, VaultHeader } from '@/components/vault';
import { VaultType } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

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
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [password, setPassword] = useState('');

  function handleUnlock() {
    if (!password.trim()) {
      Alert.alert('Enter your master password', 'Your vault needs your master password to unlock.');
      return;
    }

    onUnlock?.(password);
  }

  return (
    <ScreenBackground>
      <VaultHeader trailingIcon={Settings} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.shieldWrapper}>
          <IconTile icon={Shield} size={96} iconSize={36} color={c.accent} />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your master password to unlock your secure vault.</Text>

        <View style={styles.form}>
          <InputField
            label="MASTER PASSWORD"
            placeholder="••••••••••••"
            value={password}
            onChangeText={setPassword}
            secureToggle
          />

          {biometricAvailable ? (
            <View style={styles.biometric}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Unlock with ${biometricLabel}`}
                onPress={() => onBiometricUnlock?.()}
                style={({ pressed }) => [styles.biometricButton, pressed && styles.pressed]}>
                <Fingerprint size={28} color={c.accent} strokeWidth={1.75} />
              </Pressable>
              <Text style={styles.biometricCaption}>Tap to unlock with {biometricLabel}</Text>
            </View>
          ) : null}

          <View style={styles.cta}>
            <PrimaryButton label="UNLOCK" onPress={handleUnlock} />
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    alignItems: 'center',
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  shieldWrapper: {
    marginBottom: 32,
  },
  title: {
    ...VaultType.title,
    color: c.heading,
    textAlign: 'center',
  },
  subtitle: {
    ...VaultType.body,
    marginTop: 12,
    color: c.body,
    textAlign: 'center',
    maxWidth: 300,
  },
  form: {
    marginTop: 48,
    width: '100%',
    gap: 40,
  },
  biometric: {
    alignItems: 'center',
    gap: 12,
  },
  biometricButton: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(127,176,255,0.2)',
  },
  pressed: {
    opacity: 0.8,
  },
  biometricCaption: {
    ...VaultType.caption,
    color: c.muted,
  },
  cta: {
    gap: 16,
    alignItems: 'center',
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    color: c.accent,
  },
  });
}
