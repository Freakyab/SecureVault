import {
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  ShieldCheck,
} from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  InteractionManager,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton, Toggle } from '@/components/vault';
import { Fonts } from '@/constants/theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';
import { BiometricAvailability, canUseBiometrics, getBiometricAvailability } from '@/services/biometric';

interface SetupMasterPasswordScreenProps {
  onCreate?: (password: string, biometricEnabled: boolean) => void | Promise<void>;
}

export function SetupMasterPasswordScreen({ onCreate }: SetupMasterPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometric, setBiometric] = useState<BiometricAvailability | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Preparing your vault…');

  // Detect real device capability (BUG-012). Default the opt-in ON only when
  // biometrics are actually available and enrolled; otherwise keep it off.
  useEffect(() => {
    let active = true;
    void getBiometricAvailability().then((availability) => {
      if (!active) return;
      setBiometric(availability);
      setBiometricEnabled(canUseBiometrics(availability));
    });
    return () => {
      active = false;
    };
  }, []);

  const biometricSupported = canUseBiometrics(biometric);
  const biometricSubtitle = !biometric
    ? 'Checking device…'
    : biometricSupported
      ? `Use ${biometric.label} to unlock`
      : biometric.hasHardware
        ? 'No biometrics enrolled on this device'
        : 'Not available on this device';

  function handleBiometricChange(next: boolean) {
    if (next && !biometricSupported) {
      Alert.alert(
        'Biometrics unavailable',
        biometric?.hasHardware
          ? 'Add a fingerprint or face scan in your device settings, then re-open SecureVault to enable biometric unlock.'
          : 'This device does not support biometric unlock. You can still unlock with your master password.',
      );
      return;
    }
    setBiometricEnabled(next);
  }

  async function yieldToUi() {
    await new Promise<void>((resolve) => {
      InteractionManager.runAfterInteractions(() => resolve());
    });
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  async function handleCreate() {
    if (isCreating) return;

    if (password.length < 12) {
      Alert.alert('Use a stronger password', 'Your master password must be at least 12 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Confirm your master password before creating the vault.');
      return;
    }

    setIsCreating(true);
    setCreateError(null);
    setLoadingMessage('Preparing your vault…');

    try {
      await yieldToUi();
      setLoadingMessage('Deriving your encryption key…');
      await yieldToUi();
      await onCreate?.(password, biometricEnabled);
      setLoadingMessage('Opening your vault…');
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Could not create vault. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    if (!isCreating) return;

    const messages = [
      'Deriving your encryption key…',
      'Applying AES-256 encryption…',
      'Securing your vault locally…',
    ];
    let index = 0;
    setLoadingMessage(messages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingMessage(messages[index]);
    }, 2200);

    return () => clearInterval(interval);
  }, [isCreating]);

  return (
    <View style={styles.root}>
      {/* Ambient aurora glows */}
      <View pointerEvents="none" style={styles.auroraTopLeft} />
      <View pointerEvents="none" style={styles.auroraBottomRight} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, height: 64 + insets.top }]}>
        <Text style={styles.brand}>SecureVault</Text>
        <View style={styles.avatar} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}>
        {/* Lock badge */}
        <View style={styles.lockBadgeWrapper}>
          <View style={styles.lockBadgeGlow} />
          <View style={styles.lockBadge}>
            <Lock size={32} color={c.heading} strokeWidth={1.75} />
          </View>
        </View>

        {/* Headlines */}
        <Text style={styles.title}>Initialize Your Vault</Text>
        <Text style={styles.subtitle}>
          This master password is the only key to your encrypted data. If lost, it cannot be
          recovered.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Master password */}
          <View style={styles.field}>
            <Text style={styles.label}>MASTER PASSWORD</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 12 characters"
                placeholderTextColor={c.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
              <Pressable
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                hitSlop={12}
                onPress={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <EyeOff size={20} color={c.body} strokeWidth={1.75} />
                ) : (
                  <Eye size={20} color={c.body} strokeWidth={1.75} />
                )}
              </Pressable>
            </View>
          </View>

          {/* Confirm password */}
          <View style={styles.field}>
            <Text style={styles.label}>CONFIRM PASSWORD</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                placeholderTextColor={c.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
          </View>

          {/* Biometric card */}
          <View style={[styles.biometricCard, !biometricSupported && styles.biometricCardDisabled]}>
            <View style={styles.biometricInfo}>
              <View style={styles.biometricIcon}>
                <Fingerprint size={24} color={c.accent} strokeWidth={1.75} />
              </View>
              <View style={styles.biometricText}>
                <Text style={styles.biometricTitle}>Enable Biometric Unlock</Text>
                <Text style={styles.biometricSubtitle}>{biometricSubtitle}</Text>
              </View>
            </View>
            <Toggle
              value={biometricEnabled}
              onChange={handleBiometricChange}
              disabled={!biometricSupported}
              label="Enable biometric unlock"
            />
          </View>

          {/* Caution note */}
          <View style={styles.cautionNote}>
            <AlertTriangle size={16} color={c.accent} strokeWidth={1.75} />
            <Text style={styles.cautionText}>
              I understand that SecureVault uses zero-knowledge encryption and my password is never
              stored on any server.
            </Text>
          </View>

          {/* Action button */}
          {createError ? <Text style={styles.createError}>{createError}</Text> : null}
          <PrimaryButton
            label={isCreating ? 'CREATING VAULT…' : 'CREATE VAULT'}
            icon={isCreating ? undefined : ArrowRight}
            onPress={() => void handleCreate()}
            disabled={isCreating}
            loading={isCreating}
          />

          {/* Footer meta */}
          <View style={styles.footerMeta}>
            <ShieldCheck size={12} color={c.placeholder} strokeWidth={1.75} />
            <Text style={styles.footerMetaText}>AES-256 Military Grade Encryption</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={isCreating} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <View style={styles.loadingBadge}>
              <Lock size={28} color={c.heading} strokeWidth={1.75} />
            </View>
            <ActivityIndicator color={c.accent} size="large" />
            <Text style={styles.loadingTitle}>Creating your vault</Text>
            <Text style={styles.loadingSubtitle}>{loadingMessage}</Text>
            <Text style={styles.loadingHint}>This secure step can take up to 15 seconds.</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function makeStyles(palette: VaultColorsShape) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.background,
  },
  auroraTopLeft: {
    position: 'absolute',
    top: -120,
    left: -60,
    width: 200,
    height: 360,
    borderRadius: 9999,
    backgroundColor: 'rgba(127,176,255,0.12)',
    opacity: 0.9,
  },
  auroraBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: 220,
    height: 440,
    borderRadius: 9999,
    backgroundColor: 'rgba(45,108,246,0.18)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: palette.headerBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.headerBorder,
  },
  brand: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: -0.6,
    color: palette.accent,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: palette.avatarBackground,
    borderWidth: 1,
    borderColor: palette.avatarBorder,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  lockBadgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  lockBadgeGlow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 9999,
    backgroundColor: 'rgba(45,108,246,0.4)',
    opacity: 0.5,
  },
  lockBadge: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.glassBackground,
    borderWidth: 1,
    borderColor: palette.glassBorder,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    color: palette.heading,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: palette.body,
    textAlign: 'center',
    maxWidth: 320,
  },
  form: {
    marginTop: 40,
    width: '100%',
    gap: 32,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: palette.accent,
    opacity: 0.7,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.inputUnderline,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: palette.heading,
    padding: 0,
  },
  biometricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    backgroundColor: palette.glassBackground,
  },
  biometricCardDisabled: {
    opacity: 0.6,
  },
  biometricInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexShrink: 1,
  },
  biometricIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45,108,246,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(127,176,255,0.2)',
  },
  biometricText: {
    flexShrink: 1,
  },
  biometricTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: palette.heading,
  },
  biometricSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: palette.body,
    opacity: 0.6,
  },
  cautionNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 8,
  },
  cautionText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: 'rgba(183,196,220,0.8)',
  },
  createError: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: '#ff8a8a',
    textAlign: 'center',
  },
  loadingOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(18,26,46,0.92)',
  },
  loadingCard: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    backgroundColor: palette.glassBackground,
  },
  loadingBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45,108,246,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(127,176,255,0.2)',
  },
  loadingTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '600',
    color: palette.heading,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: palette.body,
    textAlign: 'center',
  },
  loadingHint: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: palette.placeholder,
    textAlign: 'center',
  },
  footerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerMetaText: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.placeholder,
  },
  });
}
