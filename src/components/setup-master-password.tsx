import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  ShieldCheck,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { BiometricAvailability, canUseBiometrics, getBiometricAvailability } from '@/services/biometric';

const palette = {
  background: '#190e27',
  headerBackground: 'rgba(25,14,39,0.85)',
  headerBorder: 'rgba(76,67,83,0.4)',
  heading: '#eedcff',
  body: '#cfc2d5',
  accent: '#deb7ff',
  accentStrong: '#7b2cbf',
  glassBackground: 'rgba(255,255,255,0.03)',
  glassBorder: 'rgba(192,192,192,0.2)',
  placeholder: 'rgba(207,194,213,0.4)',
  inputUnderline: 'rgba(192,192,192,0.2)',
  buttonText: '#2d0050',
  avatarBackground: '#30253f',
  avatarBorder: 'rgba(76,67,83,0.3)',
};

interface SetupMasterPasswordScreenProps {
  onCreate?: (password: string, biometricEnabled: boolean) => void;
}

export function SetupMasterPasswordScreen({ onCreate }: SetupMasterPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometric, setBiometric] = useState<BiometricAvailability | null>(null);

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

  function handleBiometricToggle() {
    if (!biometricSupported) {
      Alert.alert(
        'Biometrics unavailable',
        biometric?.hasHardware
          ? 'Add a fingerprint or face scan in your device settings, then re-open SecureVault to enable biometric unlock.'
          : 'This device does not support biometric unlock. You can still unlock with your master password.',
      );
      return;
    }
    setBiometricEnabled((prev) => !prev);
  }

  function handleCreate() {
    if (password.length < 12) {
      Alert.alert('Use a stronger password', 'Your master password must be at least 12 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Confirm your master password before creating the vault.');
      return;
    }

    onCreate?.(password, biometricEnabled);
  }

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}>
        {/* Lock badge */}
        <View style={styles.lockBadgeWrapper}>
          <View style={styles.lockBadgeGlow} />
          <View style={styles.lockBadge}>
            <Lock size={32} color={palette.heading} strokeWidth={1.75} />
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
                placeholderTextColor={palette.placeholder}
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
                  <EyeOff size={20} color={palette.body} strokeWidth={1.75} />
                ) : (
                  <Eye size={20} color={palette.body} strokeWidth={1.75} />
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
                placeholderTextColor={palette.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
          </View>

          {/* Biometric card */}
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: biometricEnabled, disabled: !biometricSupported }}
            accessibilityLabel="Enable biometric unlock"
            accessibilityHint={biometricSubtitle}
            onPress={handleBiometricToggle}
            style={[styles.biometricCard, !biometricSupported && styles.biometricCardDisabled]}>
            <View style={styles.biometricInfo}>
              <View style={styles.biometricIcon}>
                <Fingerprint size={24} color={palette.accent} strokeWidth={1.75} />
              </View>
              <View style={styles.biometricText}>
                <Text style={styles.biometricTitle}>Enable Biometric Unlock</Text>
                <Text style={styles.biometricSubtitle}>{biometricSubtitle}</Text>
              </View>
            </View>
            <View
              style={[
                styles.toggleTrack,
                biometricEnabled && styles.toggleTrackOn,
                !biometricSupported && styles.toggleTrackDisabled,
              ]}>
              <View style={[styles.toggleKnob, biometricEnabled && styles.toggleKnobOn]} />
            </View>
          </Pressable>

          {/* Caution note */}
          <View style={styles.cautionNote}>
            <AlertTriangle size={16} color={palette.accent} strokeWidth={1.75} />
            <Text style={styles.cautionText}>
              I understand that SecureVault uses zero-knowledge encryption and my password is never
              stored on any server.
            </Text>
          </View>

          {/* Action button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create Vault"
            onPress={handleCreate}
            style={({ pressed }) => [styles.actionButtonWrapper, pressed && styles.pressed]}>
            <LinearGradient
              colors={[palette.accentStrong, palette.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionButton}>
              <Text style={styles.actionButtonText}>CREATE VAULT</Text>
              <ArrowRight size={14} color={palette.buttonText} strokeWidth={2.5} />
            </LinearGradient>
          </Pressable>

          {/* Footer meta */}
          <View style={styles.footerMeta}>
            <ShieldCheck size={12} color={palette.placeholder} strokeWidth={1.75} />
            <Text style={styles.footerMetaText}>AES-256 Military Grade Encryption</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(222,183,255,0.12)',
    opacity: 0.9,
  },
  auroraBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: 220,
    height: 440,
    borderRadius: 9999,
    backgroundColor: 'rgba(123,44,191,0.18)',
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
    backgroundColor: 'rgba(123,44,191,0.4)',
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
    backgroundColor: 'rgba(123,44,191,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(222,183,255,0.2)',
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
  toggleTrack: {
    width: 48,
    height: 24,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackOn: {
    backgroundColor: palette.accentStrong,
  },
  toggleTrackDisabled: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    backgroundColor: '#ffffff',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
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
    color: 'rgba(207,194,213,0.8)',
  },
  actionButtonWrapper: {
    borderRadius: 9999,
    ...Platform.select({
      ios: {
        shadowColor: palette.accentStrong,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  pressed: {
    opacity: 0.85,
  },
  actionButton: {
    height: 56,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: palette.buttonText,
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
