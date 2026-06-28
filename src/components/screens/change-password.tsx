import { useRouter } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconTile, ScreenBackground, VaultHeader } from '@/components/vault';
import { Input, Button } from '@/components/ui';
import { VaultType } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { hapticSuccess, hapticWarning } from '@/services/feedback';

const MIN_LENGTH = 12;

export function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();
  const { showToast } = useToast();
  const { changeMasterPassword } = useVault();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (next.length < MIN_LENGTH) {
      hapticWarning();
      Alert.alert('Use a stronger password', `Your new master password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (next !== confirm) {
      hapticWarning();
      Alert.alert('Passwords do not match', 'Confirm your new master password before saving.');
      return;
    }
    if (next === current) {
      hapticWarning();
      Alert.alert('Choose a new password', 'The new master password must differ from your current one.');
      return;
    }

    setSaving(true);
    try {
      await changeMasterPassword(current, next);
      hapticSuccess();
      showToast('Master password updated', 'success');
      router.back();
    } catch (error) {
      hapticWarning();
      Alert.alert(
        'Could not change password',
        error instanceof Error ? error.message : 'Please check your current password and try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenBackground>
      <VaultHeader title="Master Password" showBack onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.badge}>
          <IconTile icon={KeyRound} size={84} iconSize={34} color={c.accent} />
        </View>

        <Text style={styles.title}>Change Master Password</Text>
        <Text style={styles.subtitle}>
          Re-encrypt your vault with a new master password. Your stored credentials stay intact.
        </Text>

        <View style={styles.form}>
          <Input
            label="CURRENT PASSWORD"
            placeholder="Enter current password"
            value={current}
            onChangeText={setCurrent}
          />
          <Input
            label="NEW PASSWORD"
            placeholder={`Minimum ${MIN_LENGTH} characters`}
            value={next}
            onChangeText={setNext}
          />
          <Input
            label="CONFIRM NEW PASSWORD"
            placeholder="Repeat new password"
            value={confirm}
            onChangeText={setConfirm}
          />
        </View>

        <View style={styles.cta}>
          <Button
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? 'UPDATING…' : 'UPDATE PASSWORD'}
          </Button>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'center',
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  badge: {
    marginBottom: 24,
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
    maxWidth: 320,
  },
  form: {
    marginTop: 40,
    width: '100%',
    gap: 28,
  },
  cta: {
    marginTop: 40,
    width: '100%',
  },
  });
}
