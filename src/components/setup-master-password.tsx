import {
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  ShieldCheck,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
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
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Toggle } from "@/components/ui";
import { AnimatedBlobs, BLOB_PALETTES } from "@/components/ui/animated-blobs";
import { useHaptics } from "@/hooks/use-haptics";
import { useTheme } from "@/hooks/use-theme";
import {
  BiometricAvailability,
  canUseBiometrics,
  getBiometricAvailability,
} from "@/services/biometric";
import { type Theme } from "@/theme";

interface SetupMasterPasswordScreenProps {
  onCreate?: (
    password: string,
    biometricEnabled: boolean,
  ) => void | Promise<void>;
}

export function SetupMasterPasswordScreen({
  onCreate,
}: SetupMasterPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometric, setBiometric] = useState<BiometricAvailability | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Preparing your vault…");

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
    ? "Checking device…"
    : biometricSupported
      ? `Use ${biometric.label} to unlock`
      : biometric.hasHardware
        ? "No biometrics enrolled on this device"
        : "Not available on this device";

  function handleBiometricChange(next: boolean) {
    if (next && !biometricSupported) {
      haptics.warning();
      Alert.alert(
        "Biometrics unavailable",
        biometric?.hasHardware
          ? "Add a fingerprint or face scan in your device settings, then re-open SecureVault to enable biometric unlock."
          : "This device does not support biometric unlock. You can still unlock with your master password.",
      );
      return;
    }
    haptics.selection();
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
      haptics.warning();
      Alert.alert(
        "Use a stronger password",
        "Your master password must be at least 12 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      haptics.warning();
      Alert.alert(
        "Passwords do not match",
        "Confirm your master password before creating the vault.",
      );
      return;
    }

    setIsCreating(true);
    setCreateError(null);
    setLoadingMessage("Preparing your vault…");

    try {
      await yieldToUi();
      setLoadingMessage("Deriving your encryption key…");
      await yieldToUi();
      await onCreate?.(password, biometricEnabled);
      setLoadingMessage("Opening your vault…");
      haptics.success();
    } catch (error) {
      haptics.error();
      setCreateError(
        error instanceof Error
          ? error.message
          : "Could not create vault. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    if (!isCreating) return;

    const messages = [
      "Deriving your encryption key…",
      "Applying AES-256 encryption…",
      "Securing your vault locally…",
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
      <AnimatedBlobs
        colors={
          theme.colors.accent === "#2D6CF6"
            ? BLOB_PALETTES.blue
            : theme.colors.accent === "#b06af0"
              ? BLOB_PALETTES.purple
              : BLOB_PALETTES.gold
        }
        intensity={0.8}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top, height: 64 + insets.top },
        ]}>
        <Text style={styles.brand}>SecureVault</Text>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + theme.spacing.xxl },
        ]}>
        {/* Lock badge */}
        <Animated.View
          entering={FadeIn.duration(theme.motion.duration.cardExpand)}
          style={styles.lockBadgeWrapper}>
          <View style={styles.lockBadge}>
            <Lock size={32} color={theme.colors.text} strokeWidth={1.75} />
          </View>
        </Animated.View>

        {/* Headlines */}
        <Text style={styles.title}>Initialize Your Vault</Text>
        <Text style={styles.subtitle}>
          This master password is the only key to your encrypted data. If lost,
          it cannot be recovered.
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
                placeholder="Master Password"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
              <Pressable
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
                hitSlop={12}
                onPress={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <EyeOff
                    size={20}
                    color={theme.colors.textSecondary}
                    strokeWidth={1.75}
                  />
                ) : (
                  <Eye
                    size={20}
                    color={theme.colors.textSecondary}
                    strokeWidth={1.75}
                  />
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
                placeholder="Confirm your master password"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
          </View>

          {/* Biometric card — keep as-is per user decision */}
          <View
            style={[
              styles.biometricCard,
              !biometricSupported && styles.biometricCardDisabled,
            ]}>
            <View style={styles.biometricInfo}>
              <View style={styles.biometricIcon}>
                <Fingerprint
                  size={24}
                  color={theme.colors.accent}
                  strokeWidth={1.75}
                />
              </View>
              <View style={styles.biometricText}>
                <Text style={styles.biometricTitle}>
                  Enable Biometric Unlock
                </Text>
                <Text style={styles.biometricSubtitle}>
                  {biometricSubtitle}
                </Text>
              </View>
            </View>
            <Toggle
              value={biometricEnabled}
              onChange={handleBiometricChange}
              disabled={!biometricSupported}
              label="Enable biometric unlock"
            />
          </View>

          {/* Action button */}
          {createError ? (
            <Text style={styles.createError}>{createError}</Text>
          ) : null}
          <Button
            onPress={() => void handleCreate()}
            disabled={isCreating}
            loading={isCreating}>
            {isCreating ? "CREATING VAULT…" : "CREATE VAULT"}
          </Button>

          {/* Footer meta */}
          <View style={styles.footerMeta}>
            <ShieldCheck
              size={12}
              color={theme.colors.textMuted}
              strokeWidth={1.75}
            />
            <Text style={styles.footerMetaText}>
              AES-256 Military Grade Encryption
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isCreating}
        transparent
        animationType="none"
        statusBarTranslucent>
        <View style={styles.loadingOverlay}>
          <Animated.View
            entering={FadeIn.duration(theme.motion.duration.modal)}
            style={styles.loadingCard}>
            <View style={styles.loadingBadge}>
              <Lock size={28} color={theme.colors.text} strokeWidth={1.75} />
            </View>
            <ActivityIndicator color={theme.colors.accent} size="large" />
            <Text style={styles.loadingTitle}>Creating your vault</Text>
            <Text style={styles.loadingSubtitle}>{loadingMessage}</Text>
            <Text style={styles.loadingHint}>
              This secure step can take up to 15 seconds.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: t.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      paddingHorizontal: t.layout.screenPadding,
      paddingBottom: t.spacing.md,
      backgroundColor: "rgba(25, 14, 39, 0.6)",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: t.glass.border,
    },
    brand: {
      ...t.typography.headingSerif,
      fontSize: 24,
      color: t.colors.accent,
    },
    scrollContent: {
      paddingHorizontal: t.layout.screenPadding,
      paddingTop: t.spacing.xxl + t.spacing.sm,
      alignItems: "center",
      alignSelf: "center",
    },
    lockBadgeWrapper: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: t.spacing.xl,
    },
    lockBadge: {
      width: 80,
      height: 80,
      borderRadius: t.radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      ...t.typography.displaySerif,
      color: t.colors.text,
      textAlign: "center",
    },
    subtitle: {
      ...t.typography.body,
      marginTop: t.spacing.md,
      color: t.colors.textSecondary,
      textAlign: "center",
      maxWidth: 320,
    },
    form: {
      marginTop: t.spacing.xxl + t.spacing.sm,
      width: 350,
      gap: t.spacing.xxl,
    },
    field: {
      gap: t.spacing.sm,
    },
    label: {
      ...t.typography.label,
      letterSpacing: 1.2,
      color: t.colors.textLabel,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: t.glass.border,
      paddingVertical: t.spacing.sm,
    },
    input: {
      flex: 1,
      ...t.typography.body,
      fontSize: 18,
      color: t.colors.text,
      padding: 0,
    },
    biometricCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: t.spacing.xl,
      borderRadius: t.radius.sheet,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    biometricCardDisabled: {
      opacity: 0.6,
    },
    biometricInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.lg,
      flexShrink: 1,
    },
    biometricIcon: {
      width: 48,
      height: 48,
      borderRadius: t.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.colors.accentSoft,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    biometricText: {
      flexShrink: 1,
    },
    biometricTitle: {
      ...t.typography.caption,
      fontSize: 14,
      fontWeight: t.fontWeight.semibold,
      letterSpacing: 0.7,
      color: t.colors.text,
    },
    biometricSubtitle: {
      ...t.typography.label,
      marginTop: t.spacing.xs,
      fontSize: 12,
      color: t.colors.textSecondary,
      opacity: 0.7,
    },
    createError: {
      ...t.typography.caption,
      color: t.colors.error,
      textAlign: "center",
    },
    loadingOverlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: t.spacing.xl,
      backgroundColor: "rgba(0,0,0,0.72)",
    },
    loadingCard: {
      width: "100%",
      maxWidth: 320,
      alignItems: "center",
      gap: t.spacing.lg,
      paddingHorizontal: t.spacing.xl,
      paddingVertical: t.spacing.xxl,
      borderRadius: t.radius.sheet,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.colors.surface,
    },
    loadingBadge: {
      width: 72,
      height: 72,
      borderRadius: t.radius.sheet,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.colors.accentSoft,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    loadingTitle: {
      ...t.typography.headingSerif,
      color: t.colors.text,
      textAlign: "center",
    },
    loadingSubtitle: {
      ...t.typography.body,
      fontSize: 14,
      color: t.colors.textSecondary,
      textAlign: "center",
    },
    loadingHint: {
      ...t.typography.label,
      fontSize: 12,
      lineHeight: 16,
      color: t.colors.textMuted,
      textAlign: "center",
    },
    footerMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: t.spacing.sm,
    },
    footerMetaText: {
      ...t.typography.label,
      fontSize: 12,
      color: t.colors.textMuted,
    },
  });
}
