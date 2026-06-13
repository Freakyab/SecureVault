import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Download,
  Fingerprint,
  KeyRound,
  Lock,
  LucideIcon,
  Moon,
  Timer,
  Trash2,
  Upload,
} from 'lucide-react-native';
import { ReactNode, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as Clipboard from 'expo-clipboard';

import { BottomNav, GlassCard, ScreenBackground, Toggle, VaultHeader } from '@/components/vault';
import { VaultColors, VaultType } from '@/constants/vault-theme';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { BiometricAvailability, canUseBiometrics, getBiometricAvailability } from '@/services/biometric';
import { copyToClipboard, hapticSuccess, hapticWarning } from '@/services/feedback';
import { parseVaultBackup, serializeVaultBackup } from '@/services/vault-backup';
import { AUTO_LOCK_PRESETS } from '@/types/credential';

interface RowProps {
  icon: LucideIcon;
  label: string;
  detail?: string;
  trailing?: ReactNode;
  danger?: boolean;
  onPress?: () => void;
}

function SettingsRow({ icon: Icon, label, detail, trailing, danger, onPress }: RowProps) {
  const tint = danger ? VaultColors.danger : VaultColors.accent;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
          <Icon size={18} color={tint} strokeWidth={1.75} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
          {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
        </View>
      </View>
      {trailing ?? <ChevronRight size={18} color={VaultColors.muted} strokeWidth={2} />}
    </Pressable>
  );
}

function autoLockLabel(minutes: number) {
  const preset = AUTO_LOCK_PRESETS.find((item) => item.minutes === minutes);
  if (preset) return preset.label;
  if (minutes <= 0) return 'Immediately';
  if (minutes < 0) return 'Never';
  return `${minutes} min`;
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const { settings, credentials, updateSettings, lockVault, resetVault, importCredentials } = useVault();
  const [showAutoLockPicker, setShowAutoLockPicker] = useState(false);
  const [biometric, setBiometric] = useState<BiometricAvailability | null>(null);

  useEffect(() => {
    void getBiometricAvailability().then(setBiometric);
  }, []);

  const biometricSupported = canUseBiometrics(biometric);

  async function handleBiometricChange(enabled: boolean) {
    if (enabled && !biometricSupported) {
      hapticWarning();
      Alert.alert(
        'Biometrics unavailable',
        biometric?.hasHardware
          ? 'Enrol a fingerprint or face scan in your device settings to use biometric unlock.'
          : 'This device does not support biometric unlock.',
      );
      return;
    }
    await updateSettings({ biometricEnabled: enabled });
    showToast(enabled ? 'Biometric unlock enabled' : 'Biometric unlock disabled', 'info');
  }

  async function handleThemeChange(enabled: boolean) {
    await updateSettings({ themePreference: enabled ? 'dark' : 'light' });
    showToast(enabled ? 'Dark mode enabled' : 'Light mode enabled', 'info');
  }

  async function handleAutoLockSelect(minutes: number) {
    await updateSettings({ autoLockMinutes: minutes });
    setShowAutoLockPicker(false);
    showToast(`Auto-lock set to ${autoLockLabel(minutes)}`, 'info');
  }

  function handleLockVault() {
    Alert.alert('Lock vault', 'SecureVault will require your master password to open again.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Lock Now',
        style: 'destructive',
        onPress: () => {
          lockVault();
          hapticSuccess();
          showToast('Vault locked', 'info');
          router.replace('/unlock');
        },
      },
    ]);
  }

  async function handleExport() {
    if (credentials.length === 0) {
      showToast('No credentials to export yet', 'info');
      return;
    }
    Alert.alert(
      'Export vault backup',
      `Copy a backup of ${credentials.length} credentials to your clipboard. The backup is plaintext — paste it somewhere private.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy Backup',
          onPress: async () => {
            await copyToClipboard(serializeVaultBackup(credentials));
            showToast('Backup copied to clipboard', 'success');
          },
        },
      ],
    );
  }

  async function handleImport() {
    Alert.alert(
      'Import vault backup',
      'Paste a SecureVault backup into your clipboard first, then confirm. Existing accounts are kept; duplicates are skipped.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            try {
              const raw = await Clipboard.getStringAsync();
              if (!raw.trim()) {
                hapticWarning();
                showToast('Clipboard is empty', 'error');
                return;
              }
              const incoming = parseVaultBackup(raw);
              const { added, skipped } = await importCredentials(incoming);
              hapticSuccess();
              showToast(`Imported ${added} · skipped ${skipped} duplicates`, 'success');
            } catch (error) {
              hapticWarning();
              Alert.alert(
                'Import failed',
                error instanceof Error ? error.message : 'Could not read the backup.',
              );
            }
          },
        },
      ],
    );
  }

  function handleChangeMasterPassword() {
    router.push('/change-password');
  }

  function handleDeleteAllData() {
    Alert.alert(
      'Delete all local data?',
      'This permanently removes all credentials, settings, and your master password from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetVault();
              hapticSuccess();
              showToast('All local data deleted', 'info');
              router.replace('/');
            } catch (error) {
              hapticWarning();
              Alert.alert(
                'Reset failed',
                error instanceof Error ? error.message : 'Please try again.',
              );
            }
          },
        },
      ],
    );
  }

  return (
    <ScreenBackground>
      <VaultHeader title="Settings" showAvatar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}>
        <Text style={styles.subtitle}>Manage your security and preferences</Text>

        <Text style={styles.sectionLabel}>SECURITY</Text>
        <GlassCard style={styles.group}>
          <SettingsRow icon={KeyRound} label="Change Master Password" onPress={handleChangeMasterPassword} />
          <View style={styles.separator} />
          <SettingsRow
            icon={Fingerprint}
            label="Biometric Unlock"
            detail={
              biometricSupported
                ? `Use ${biometric?.label ?? 'Face ID / Touch ID'}`
                : 'Not available on this device'
            }
            trailing={
              <Toggle
                value={settings.biometricEnabled && biometricSupported}
                onChange={handleBiometricChange}
                label="Biometric unlock"
              />
            }
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={Lock}
            label="Lock Vault Now"
            detail="Require master password again"
            onPress={handleLockVault}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={Timer}
            label="Auto-Lock"
            detail={`After ${autoLockLabel(settings.autoLockMinutes).toLowerCase()}`}
            onPress={() => setShowAutoLockPicker((prev) => !prev)}
          />
          {showAutoLockPicker ? (
            <View style={styles.presetRow}>
              {AUTO_LOCK_PRESETS.map((preset) => {
                const active = preset.minutes === settings.autoLockMinutes;
                return (
                  <Pressable
                    key={preset.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => handleAutoLockSelect(preset.minutes)}
                    style={[styles.presetChip, active && styles.presetChipActive]}>
                    <Text style={[styles.presetText, active && styles.presetTextActive]}>
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </GlassCard>

        <Text style={styles.sectionLabel}>APPEARANCE</Text>
        <GlassCard style={styles.group}>
          <SettingsRow
            icon={Moon}
            label="Dark Mode"
            trailing={
              <Toggle
                value={settings.themePreference === 'dark'}
                onChange={handleThemeChange}
                label="Dark mode"
              />
            }
          />
        </GlassCard>

        <Text style={styles.sectionLabel}>DATA</Text>
        <GlassCard style={styles.group}>
          <SettingsRow
            icon={Download}
            label="Export Vault"
            detail="Copy a backup to clipboard"
            onPress={handleExport}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={Upload}
            label="Import Data"
            detail="Paste a backup from clipboard"
            onPress={handleImport}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={Trash2}
            label="Password History"
            detail={settings.recordPasswordHistory ? 'Recording enabled' : 'Recording disabled'}
            trailing={
              <Toggle
                value={settings.recordPasswordHistory}
                onChange={(enabled) => updateSettings({ recordPasswordHistory: enabled })}
                label="Record password history"
              />
            }
          />
        </GlassCard>

        <GlassCard style={styles.dangerCard}>
          <View style={styles.dangerHeader}>
            <Trash2 size={18} color={VaultColors.danger} strokeWidth={2} />
            <Text style={styles.dangerTitle}>Delete All Data</Text>
          </View>
          <Text style={styles.dangerBody}>
            This action will permanently delete all encrypted records stored on this device. This
            cannot be undone.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete all local data"
            onPress={handleDeleteAllData}
            style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}>
            <Text style={styles.dangerButtonText}>Delete Everything</Text>
          </Pressable>
        </GlassCard>
      </ScrollView>

      <BottomNav active="settings" />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  subtitle: {
    ...VaultType.body,
    color: VaultColors.body,
  },
  sectionLabel: {
    ...VaultType.label,
    color: VaultColors.accent,
    opacity: 0.8,
    marginTop: 32,
    marginBottom: 12,
  },
  group: {
    padding: 8,
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexShrink: 1,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.accentSoft,
  },
  rowIconDanger: {
    backgroundColor: 'rgba(255,138,138,0.15)',
  },
  rowText: {
    flexShrink: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: VaultColors.heading,
  },
  rowLabelDanger: {
    color: VaultColors.danger,
  },
  rowDetail: {
    fontSize: 12,
    color: VaultColors.muted,
  },
  separator: {
    height: 1,
    backgroundColor: VaultColors.glassBorder,
    marginHorizontal: 12,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  presetChipActive: {
    borderColor: VaultColors.accent,
    backgroundColor: VaultColors.accentSoft,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: VaultColors.muted,
  },
  presetTextActive: {
    color: VaultColors.accent,
  },
  dangerCard: {
    marginTop: 32,
    gap: 12,
    borderColor: 'rgba(255,138,138,0.3)',
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: VaultColors.danger,
  },
  dangerBody: {
    fontSize: 13,
    lineHeight: 19,
    color: VaultColors.body,
  },
  dangerButton: {
    marginTop: 4,
    height: 48,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,138,138,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,138,138,0.4)',
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: VaultColors.danger,
  },
});
