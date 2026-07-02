import { useRouter } from "expo-router";
import {
  ChevronRight,
  Download,
  FileText,
  Fingerprint,
  KeyRound,
  Lock,
  LucideIcon,
  Moon,
  Palette,
  Sparkles,
  Timer,
  Trash2,
  Upload,
} from "lucide-react-native";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as Clipboard from "expo-clipboard";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";

import { Button, GlassCard } from "@/components/ui";
import {
  BottomNav,
  ScreenBackground,
  Toggle,
  VaultHeader,
} from "@/components/vault";
import { buildMockCredentials } from "@/constants/mock-credentials";
import {
  COLOR_THEMES,
  COLOR_THEME_IDS,
  useColorTheme,
} from "@/contexts/color-theme-context";
import { useToast } from "@/contexts/toast-context";
import { useVault } from "@/contexts/vault-context";
import { useHaptics } from "@/hooks/use-haptics";
import { useTheme } from "@/hooks/use-theme";
import { suggestCategoriesBulk } from "@/services/ai-categorization";
import {
  BiometricAvailability,
  canUseBiometrics,
  getBiometricAvailability,
} from "@/services/biometric";
import { copySensitiveToClipboard } from "@/services/feedback";
import { parseGoogleCSV } from "@/services/google-csv-import";
import { exportVaultToFile } from "@/services/vault-export";
import {
  createEncryptedBackup,
  decryptBackup,
} from "@/services/vault-secure-backup";
import { type Theme } from "@/theme";
import {
  AUTO_LOCK_PRESETS,
  type AppThemePreference,
  type ColorThemePreference,
} from "@/types/credential";

interface RowProps {
  icon: LucideIcon;
  label: string;
  detail?: string;
  trailing?: ReactNode;
  danger?: boolean;
  onPress?: () => void;
}

function SettingsRow({
  icon: Icon,
  label,
  detail,
  trailing,
  danger,
  onPress,
}: RowProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const tint = danger ? theme.colors.error : theme.colors.accent;
  const content = (
    <>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
          <Icon size={18} color={tint} strokeWidth={1.75} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>
            {label}
          </Text>
          {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
        </View>
      </View>
      {trailing ?? (
        <ChevronRight
          size={18}
          color={theme.colors.textMuted}
          strokeWidth={2}
        />
      )}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

function autoLockLabel(minutes: number) {
  const preset = AUTO_LOCK_PRESETS.find((item) => item.minutes === minutes);
  if (preset) return preset.label;
  if (minutes <= 0) return "Immediately";
  if (minutes < 0) return "Never";
  return `${minutes} min`;
}

function themePreferenceLabel(preference: AppThemePreference) {
  if (preference === "light") return "Light";
  if (preference === "system") return "System";
  return "Dark";
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const { showToast } = useToast();
  const { setColorTheme } = useColorTheme();
  const {
    settings,
    credentials,
    updateSettings,
    lockVault,
    resetVault,
    importCredentials,
    bulkUpdateCategories,
  } = useVault();
  const [showAutoLockPicker, setShowAutoLockPicker] = useState(false);
  const [showThemePreferencePicker, setShowThemePreferencePicker] =
    useState(false);
  const [biometric, setBiometric] = useState<BiometricAvailability | null>(
    null,
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  useEffect(() => {
    void getBiometricAvailability().then(setBiometric);
  }, []);

  const biometricSupported = canUseBiometrics(biometric);

  async function handleBiometricChange(enabled: boolean) {
    if (enabled && !biometricSupported) {
      haptics.warning();
      Alert.alert(
        "Biometrics unavailable",
        biometric?.hasHardware
          ? "Enrol a fingerprint or face scan in your device settings to use biometric unlock."
          : "This device does not support biometric unlock.",
      );
      return;
    }
    await updateSettings({ biometricEnabled: enabled });
    showToast(
      enabled ? "Biometric unlock enabled" : "Biometric unlock disabled",
      "info",
    );
  }

  async function handleColorThemeChange(id: ColorThemePreference) {
    await updateSettings({ colorTheme: id });
    await setColorTheme(id);
    showToast(`Theme set to ${COLOR_THEMES[id].label}`, "info");
  }

  async function handleAutoLockSelect(minutes: number) {
    await updateSettings({ autoLockMinutes: minutes });
    setShowAutoLockPicker(false);
    showToast(`Auto-lock set to ${autoLockLabel(minutes)}`, "info");
  }

  async function handleThemePreferenceSelect(preference: AppThemePreference) {
    await updateSettings({ themePreference: preference });
    setShowThemePreferencePicker(false);
    showToast(`Theme mode set to ${themePreferenceLabel(preference)}`, "info");
  }

  function handleLockVault() {
    Alert.alert(
      "Lock vault",
      "SecureVault will require your master password to open again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Lock Now",
          style: "destructive",
          onPress: () => {
            lockVault();
            haptics.success();
            showToast("Vault locked", "info");
            router.replace("/unlock");
          },
        },
      ],
    );
  }

  async function handleExport() {
    if (credentials.length === 0) {
      showToast("No credentials to export yet", "info");
      return;
    }
    Alert.prompt(
      "Backup Password",
      `Enter a password to encrypt your backup of ${credentials.length} credentials for clipboard. You will need this password to restore later.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Copy Encrypted Backup",
          onPress: async (password?: string) => {
            if (!password || password.trim().length < 4) {
              Alert.alert(
                "Invalid Password",
                "Please enter a password of at least 4 characters.",
              );
              return;
            }
            setIsExporting(true);
            setExportMessage("Encrypting your vault backup…");
            try {
              const encrypted = await createEncryptedBackup(
                credentials,
                password,
              );
              setExportMessage("Copying to clipboard…");
              await copySensitiveToClipboard(encrypted);
              showToast(
                "Encrypted backup copied — auto-clears in 30s",
                "success",
              );
            } catch (error) {
              Alert.alert(
                "Export failed",
                error instanceof Error
                  ? error.message
                  : "Could not encrypt backup.",
              );
            } finally {
              setIsExporting(false);
              setExportMessage("");
            }
          },
        },
      ],
      "secure-text",
    );
  }

  async function handleExportToFile() {
    if (credentials.length === 0) {
      showToast("No credentials to export yet", "info");
      return;
    }

    Alert.prompt(
      "Backup Password",
      "Enter a password to encrypt your backup file. You will need this password to restore the data later.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Export",
          onPress: async (password?: string) => {
            if (!password || password.trim().length < 4) {
              Alert.alert(
                "Invalid Password",
                "Please enter a password of at least 4 characters.",
              );
              return;
            }
            setIsExporting(true);
            setExportMessage("Encrypting your vault backup…");
            try {
              await exportVaultToFile(credentials, password);
              showToast("Encrypted vault backup exported", "success");
            } catch (error) {
              haptics.warning();
              Alert.alert(
                "Export failed",
                error instanceof Error
                  ? error.message
                  : "Could not save the backup file.",
              );
            } finally {
              setIsExporting(false);
              setExportMessage("");
            }
          },
        },
      ],
      "secure-text",
    );
  }

  async function handleImportFromFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "text/json"],
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const content = await FileSystem.readAsStringAsync(file.uri);

      Alert.prompt(
        "Restore Backup",
        "Enter the password used to encrypt this backup file.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Restore",
            onPress: async (password?: string) => {
              if (!password || password.trim().length < 4) {
                Alert.alert(
                  "Invalid Password",
                  "Please enter the correct backup password.",
                );
                return;
              }
              setIsExporting(true);
              setExportMessage("Decrypting and restoring backup…");
              try {
                const incoming = await decryptBackup(content, password);
                const { added, skipped } = await importCredentials(incoming);
                haptics.success();
                showToast(
                  `Restored ${added} · skipped ${skipped} duplicates from file`,
                  "success",
                );
              } catch (error) {
                haptics.warning();
                Alert.alert(
                  "Restore failed",
                  error instanceof Error
                    ? error.message
                    : "Could not decrypt the backup file. Please check your password.",
                );
              } finally {
                setIsExporting(false);
                setExportMessage("");
              }
            },
          },
        ],
        "secure-text",
      );
    } catch (error) {
      console.error(
        "[VaultImportFileError] Failed to import backup from file:",
        error,
      );
      haptics.warning();
      Alert.alert(
        "Import failed",
        error instanceof Error
          ? error.message
          : "Could not read the selected file.",
      );
    }
  }

  async function handleImport() {
    Alert.prompt(
      "Import vault backup",
      "Paste a SecureVault backup into your clipboard first, then enter the backup password to decrypt. Existing accounts are kept; duplicates are skipped.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decrypt & Import",
          onPress: async (password?: string) => {
            if (!password || password.trim().length < 4) {
              Alert.alert(
                "Invalid Password",
                "Please enter the correct backup password.",
              );
              return;
            }
            setIsExporting(true);
            setExportMessage("Decrypting and importing backup…");
            try {
              const raw = await Clipboard.getStringAsync();
              if (!raw.trim()) {
                haptics.warning();
                showToast("Clipboard is empty", "error");
                return;
              }
              const incoming = await decryptBackup(raw, password);
              const { added, skipped } = await importCredentials(incoming);
              haptics.success();
              showToast(
                `Imported ${added} · skipped ${skipped} duplicates`,
                "success",
              );
            } catch (error) {
              console.error(
                "[VaultImportError] Failed to import backup from clipboard:",
                error,
              );
              haptics.warning();
              Alert.alert(
                "Import failed",
                error instanceof Error
                  ? error.message
                  : "Could not decrypt the backup. Please check your password.",
              );
            } finally {
              setIsExporting(false);
              setExportMessage("");
            }
          },
        },
      ],
      "secure-text",
    );
  }

  async function handleAICategorize() {
    Alert.alert(
      "AI Categorization",
      "This will analyze your vault and automatically suggest categories for your passwords. Some may be updated to new categories.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Categorize Now",
          onPress: async () => {
            try {
              const toCategorize = credentials
                .filter((c) => c.category === "Login")
                .map((c) => ({ id: c.id, name: c.website, url: c.url }));

              if (toCategorize.length === 0) {
                showToast("No passwords need categorization", "info");
                return;
              }

              showToast(
                `Analyzing ${toCategorize.length} passwords...`,
                "info",
              );

              // Batch processing to avoid Gemini limits (50 per request)
              const batchSize = 50;
              let totalUpdated = 0;
              const allUpdates: Record<string, string> = {};

              for (let i = 0; i < toCategorize.length; i += batchSize) {
                const batch = toCategorize.slice(i, i + batchSize);
                const results = await suggestCategoriesBulk(batch);
                Object.assign(allUpdates, results);
              }

              const { updated } = await bulkUpdateCategories(allUpdates);
              totalUpdated = updated;

              haptics.success();
              showToast(`AI updated ${totalUpdated} passwords`, "success");
            } catch (error) {
              console.error(
                "[AICategorizeError] Bulk categorization failed:",
                error,
              );
              haptics.warning();
              Alert.alert(
                "Categorization failed",
                "Could not update categories. Please try again.",
              );
            }
          },
        },
      ],
    );
  }

  async function handleGoogleCSVImport() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "application/vnd.ms-excel", "text/*"],
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const content = await FileSystem.readAsStringAsync(file.uri);
      const incoming = parseGoogleCSV(content);

      if (incoming.length === 0) {
        haptics.warning();
        showToast("No valid credentials found in CSV", "error");
        return;
      }

      const { added, skipped } = await importCredentials(incoming);
      haptics.success();
      showToast(
        `Imported ${added} · skipped ${skipped} duplicates from Google`,
        "success",
      );
    } catch (error) {
      console.error("[GoogleCSVImportError] Failed to import Google CSV:", {
        error,
        timestamp: new Date().toISOString(),
      });
      haptics.warning();
      Alert.alert(
        "CSV Import failed",
        error instanceof Error ? error.message : "Could not read the CSV file.",
      );
    }
  }

  async function handleLoadSampleData() {
    Alert.alert(
      "Load sample data",
      "Adds a set of demo credentials covering every category so you can explore the app. Existing accounts are kept; duplicates are skipped.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Load Samples",
          onPress: async () => {
            try {
              const { added, skipped } = await importCredentials(
                buildMockCredentials(),
              );
              haptics.success();
              showToast(
                added > 0
                  ? `Added ${added} sample credentials · skipped ${skipped}`
                  : "Sample data already loaded",
                added > 0 ? "success" : "info",
              );
            } catch (error) {
              console.error(
                "[SampleDataError] Failed to load mock credentials:",
                error,
              );
              haptics.warning();
              Alert.alert(
                "Could not load samples",
                error instanceof Error ? error.message : "Please try again.",
              );
            }
          },
        },
      ],
    );
  }

  function handleChangeMasterPassword() {
    router.push("/change-password");
  }

  function handleDeleteAllData() {
    Alert.alert(
      "Delete all local data?",
      "This permanently removes all credentials, settings, and your master password from this device. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            try {
              await resetVault();
              haptics.success();
              showToast("All local data deleted", "info");
              router.replace("/");
            } catch (error) {
              haptics.warning();
              Alert.alert(
                "Reset failed",
                error instanceof Error ? error.message : "Please try again.",
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
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}>
        <Text style={styles.subtitle}>
          Manage your security and preferences
        </Text>

        <Text style={styles.sectionLabel}>SECURITY</Text>
        <GlassCard style={styles.group}>
          <SettingsRow
            icon={KeyRound}
            label="Change Master Password"
            onPress={handleChangeMasterPassword}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={Fingerprint}
            label="Biometric Unlock"
            detail={
              biometricSupported
                ? `Use ${biometric?.label ?? "Face ID / Touch ID"}`
                : "Not available on this device"
            }
            trailing={
              <Toggle
                value={settings.biometricEnabled && biometricSupported}
                onChange={handleBiometricChange}
                disabled={!biometricSupported}
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
                    style={[
                      styles.presetChip,
                      active && styles.presetChipActive,
                    ]}>
                    <Text
                      style={[
                        styles.presetText,
                        active && styles.presetTextActive,
                      ]}>
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
          <View style={styles.separator} />
          <SettingsRow
            icon={Timer}
            label="Password Age Reminders"
            detail={
              settings.passwordAgeReminders
                ? "Enabled in health checks"
                : "Hidden in health checks"
            }
            trailing={
              <Toggle
                value={settings.passwordAgeReminders}
                onChange={(enabled) =>
                  updateSettings({ passwordAgeReminders: enabled })
                }
                label="Password age reminders"
              />
            }
          />
        </GlassCard>

        <Text style={styles.sectionLabel}>APPEARANCE</Text>
        <GlassCard style={styles.group}>
          <SettingsRow
            icon={Moon}
            label="Theme Mode"
            detail={themePreferenceLabel(settings.themePreference)}
            onPress={() => setShowThemePreferencePicker((prev) => !prev)}
          />
          {showThemePreferencePicker ? (
            <View style={styles.presetRow}>
              {(["system", "dark", "light"] as const).map((item) => {
                const active = settings.themePreference === item;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => handleThemePreferenceSelect(item)}
                    style={[
                      styles.presetChip,
                      active && styles.presetChipActive,
                    ]}>
                    <Text
                      style={[
                        styles.presetText,
                        active && styles.presetTextActive,
                      ]}>
                      {themePreferenceLabel(item)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
          <View style={styles.separator} />
          <View style={styles.colorThemeRow}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Palette
                  size={18}
                  color={theme.colors.accent}
                  strokeWidth={1.75}
                />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Color Theme</Text>
                <Text style={styles.rowDetail}>
                  {COLOR_THEMES[settings.colorTheme].label}
                </Text>
              </View>
            </View>
            <View style={styles.swatchRow}>
              {COLOR_THEME_IDS.map((id) => {
                const preset = COLOR_THEMES[id];
                const active = settings.colorTheme === id;
                return (
                  <Pressable
                    key={id}
                    accessibilityRole="button"
                    accessibilityLabel={`Use ${preset.label} color theme`}
                    accessibilityState={{ selected: active }}
                    onPress={() => handleColorThemeChange(id)}
                    style={[
                      styles.swatchChip,
                      active && {
                        borderColor: theme.colors.accent,
                        backgroundColor: theme.colors.accentSoft,
                      },
                    ]}>
                    <View
                      style={[
                        styles.swatchDot,
                        { backgroundColor: preset.swatch },
                      ]}
                    />
                    <Text
                      style={[
                        styles.swatchLabel,
                        active && styles.swatchLabelActive,
                      ]}>
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </GlassCard>

        <Text style={styles.sectionLabel}>DATA</Text>
        <GlassCard style={styles.group}>
          <SettingsRow
            icon={Download}
            label="Export to Clipboard"
            detail="Quick copy of your backup"
            onPress={handleExport}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={FileText}
            label="Export to File"
            detail="Save backup as .json file"
            onPress={handleExportToFile}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={Upload}
            label="Import from Clipboard"
            detail="Paste a backup from clipboard"
            onPress={handleImport}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={FileText}
            label="Import from File"
            detail="Restore from .json backup"
            onPress={handleImportFromFile}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={Sparkles}
            label="AI Categorize Vault"
            detail="Automatically organize existing passwords"
            onPress={handleAICategorize}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={FileText}
            label="Import Google CSV"
            detail="Upload Google Password Manager CSV"
            onPress={handleGoogleCSVImport}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={Sparkles}
            label="Load Sample Data"
            detail="Fill the vault with demo credentials"
            onPress={handleLoadSampleData}
          />
          <View style={styles.separator} />
          <SettingsRow
            icon={Trash2}
            label="Password History"
            detail={
              settings.recordPasswordHistory
                ? "Recording enabled"
                : "Recording disabled"
            }
            trailing={
              <Toggle
                value={settings.recordPasswordHistory}
                onChange={(enabled) =>
                  updateSettings({ recordPasswordHistory: enabled })
                }
                label="Record password history"
              />
            }
          />
        </GlassCard>

        <GlassCard style={styles.dangerCard}>
          <View style={styles.dangerHeader}>
            <Trash2 size={18} color={theme.colors.error} strokeWidth={2} />
            <Text style={styles.dangerTitle}>Delete All Data</Text>
          </View>
          <Text style={styles.dangerBody}>
            This action will permanently delete all encrypted records stored on
            this device. This cannot be undone.
          </Text>
          <Button
            variant="secondary"
            onPress={handleDeleteAllData}
            style={[styles.dangerButton, { backgroundColor: "transparent" }]}
            textStyle={{ color: theme.colors.error, fontWeight: "bold" }}>
            Delete Everything
          </Button>
        </GlassCard>
      </ScrollView>

      <BottomNav active="settings" />

      {/* Loading overlay for export/import operations */}
      <Modal visible={isExporting} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
            <Text style={styles.loadingText}>{exportMessage}</Text>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: t.layout.screenPadding,
      paddingTop: t.spacing.sm,
    },
    subtitle: {
      ...t.typography.body,
      color: t.colors.textSecondary,
    },
    sectionLabel: {
      ...t.typography.label,
      color: t.colors.accent,
      opacity: 0.8,
      marginTop: t.spacing.xxl,
      marginBottom: t.spacing.md,
    },
    group: {
      padding: t.spacing.sm,
      gap: 0,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.md + 2,
    },
    pressed: {
      opacity: 0.8,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.md + 2,
      flexShrink: 1,
    },
    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: t.radius.chip,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.colors.accentSoft,
    },
    rowIconDanger: {
      backgroundColor: t.colors.error + "26",
    },
    rowText: {
      flexShrink: 1,
      gap: 2,
    },
    rowLabel: {
      ...t.typography.body,
      fontSize: 15,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.text,
    },
    rowLabelDanger: {
      color: t.colors.error,
    },
    rowDetail: {
      fontSize: 12,
      color: t.colors.textMuted,
    },
    separator: {
      height: 1,
      backgroundColor: t.glass.border,
      marginHorizontal: t.spacing.md,
    },
    presetRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.md,
      paddingBottom: t.spacing.md,
    },
    presetChip: {
      paddingHorizontal: t.spacing.md + 2,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    presetChipActive: {
      borderColor: t.colors.accent,
      backgroundColor: t.colors.accentSoft,
    },
    presetText: {
      fontSize: 12,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    presetTextActive: {
      color: t.colors.accent,
    },
    dangerCard: {
      marginTop: t.spacing.xxl,
      gap: t.spacing.md,
      borderColor: t.colors.error + "4d",
    },
    dangerHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.md,
    },
    dangerTitle: {
      ...t.typography.body,
      fontSize: 16,
      fontWeight: t.fontWeight.bold,
      color: t.colors.error,
    },
    dangerBody: {
      ...t.typography.caption,
      lineHeight: 19,
      color: t.colors.textSecondary,
    },
    dangerButton: {
      marginTop: t.spacing.xs,
      height: 48,
      borderRadius: t.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.colors.error + "26",
      borderWidth: 1,
      borderColor: t.colors.error + "66",
    },
    dangerButtonText: {
      fontSize: 14,
      fontWeight: t.fontWeight.bold,
      color: t.colors.error,
    },
    colorThemeRow: {
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.md + 2,
      gap: t.spacing.md + 2,
    },
    swatchRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: t.spacing.sm,
    },
    swatchChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.md + 2,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    swatchDot: {
      width: 16,
      height: 16,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.25)",
    },
    swatchLabel: {
      fontSize: 12,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    swatchLabelActive: {
      color: t.colors.accent,
    },
    loadingOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    loadingCard: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radius.card,
      paddingVertical: t.spacing.xl,
      paddingHorizontal: t.spacing.xxl,
      alignItems: "center",
      gap: t.spacing.md,
      minWidth: 200,
    },
    loadingText: {
      ...t.typography.body,
      color: t.colors.textSecondary,
      fontSize: 14,
      textAlign: "center",
    },
  });
}
