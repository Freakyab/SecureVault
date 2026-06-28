import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Copy,
  Eye,
  EyeOff,
  ImagePlus,
  KeyRound,
  RefreshCw,
  RotateCcw,
  Star,
  Trash2,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CredentialAvatar, ScreenBackground, VaultHeader } from '@/components/vault';
import { GlassCard, Button, Toggle } from '@/components/ui';
import { CREDENTIAL_CATEGORIES } from '@/constants/categories';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import { copySensitiveToClipboard, copyToClipboard } from '@/services/feedback';
import { generatePassword, scorePasswordStrength } from '@/services/password-generator';
import { type Theme } from '@/theme';

function formatAge(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months <= 1 ? '1 month ago' : `${months} months ago`;
}

export function EditCredentialScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getCredential, updateCredential, deleteCredential, toggleFavorite, toggleArchive, setCredentialLogo } =
    useVault();

  const credential = id ? getCredential(id) : undefined;

  const [website, setWebsite] = useState(credential?.website ?? '');
  const [url, setUrl] = useState(credential?.url ?? '');
  const [username, setUsername] = useState(credential?.username ?? '');
  const [password, setPassword] = useState(credential?.password ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [accountLabel, setAccountLabel] = useState(credential?.accountLabel ?? '');
  const [notes, setNotes] = useState(credential?.notes ?? '');
  const [folder, setFolder] = useState(credential?.folder ?? '');
  const [tagsText, setTagsText] = useState((credential?.tags ?? []).join(', '));
  const [category, setCategory] = useState(credential?.category ?? 'Login');
  const [revealedHistory, setRevealedHistory] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);

  const strength = useMemo(() => scorePasswordStrength(password), [password]);

  if (!credential) {
    return (
      <ScreenBackground>
        <VaultHeader title="Edit Credential" showBack onBack={() => router.back()} />
        <View style={styles.missing}>
          <Text style={styles.missingText}>This credential could not be found.</Text>
          <Button onPress={() => router.replace('/vault')}>BACK TO VAULT</Button>
        </View>
      </ScreenBackground>
    );
  }

  async function handleSave() {
    if (!website.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Website, username, and password are required.');
      haptics.warning();
      return;
    }

    setSaving(true);
    try {
      await updateCredential(credential!.id, {
        website,
        url,
        username,
        password,
        category,
        accountLabel: accountLabel || undefined,
        notes: notes || undefined,
        folder: folder || undefined,
        tags: tagsText
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      haptics.success();
      showToast('Credential updated', 'success');
      router.back();
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Please try again.');
      haptics.warning();
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    Alert.alert('Delete credential', `Remove ${credential!.website} from your vault? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCredential(credential!.id);
          haptics.success();
          showToast('Credential deleted', 'info');
          router.back();
        },
      },
    ]);
  }

  async function pickLogo() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Allow photo access to set a custom logo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (result.canceled || !result.assets.length) return;
      await setCredentialLogo(credential!.id, result.assets[0].uri);
      haptics.success();
      showToast('Custom logo updated', 'success');
    } catch {
      haptics.warning();
      Alert.alert('Could not set logo', 'Please try a different image.');
    }
  }

  function handleLogoPress() {
    const options: { text: string; style?: 'cancel' | 'destructive'; onPress?: () => void }[] = [
      { text: 'Choose Photo', onPress: () => void pickLogo() },
    ];
    if (credential!.customLogoUri) {
      options.push({
        text: 'Remove Logo',
        style: 'destructive',
        onPress: async () => {
          await setCredentialLogo(credential!.id, undefined);
          showToast('Custom logo removed', 'info');
        },
      });
    }
    options.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert('Credential logo', 'Use a custom image instead of the site favicon.', options);
  }

  async function handleCopy(label: string, value: string) {
    if (!value) return;
    haptics.success();
    if (label === 'Password') {
      await copySensitiveToClipboard(value);
      showToast('Password copied — clears in 30s', 'success');
      return;
    }
    await copyToClipboard(value);
    showToast(`${label} copied`, 'success');
  }

  return (
    <ScreenBackground>
      <VaultHeader title="Edit Credential" showBack onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.identity}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change credential logo"
            onPress={handleLogoPress}
            style={({ pressed }) => [styles.logoWrapper, pressed && styles.pressed]}>
            <CredentialAvatar
              icon={KeyRound}
              website={credential.website}
              url={credential.url}
              customLogoUri={credential.customLogoUri}
              size={72}
              iconSize={28}
            />
            <View style={styles.logoEditBadge}>
              <ImagePlus size={13} color={theme.colors.onAccent} strokeWidth={2.5} />
            </View>
          </Pressable>
          <Text style={styles.identityName}>{credential.website || 'Credential'}</Text>
          {credential.url ? <Text style={styles.identityUrl}>{credential.url}</Text> : null}
        </View>

        <Text style={styles.sectionTitle}>Essential</Text>
        <GlassCard style={styles.card}>
          <Field label="Website" value={website} onChangeText={setWebsite} placeholder="e.g. GitHub" />
          <View style={styles.divider} />
          <Field label="URL" value={url} onChangeText={setUrl} placeholder="https://" />
          <View style={styles.divider} />
          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Username</Text>
              <Pressable accessibilityLabel="Copy username" hitSlop={8} onPress={() => handleCopy('Username', username)}>
                <Copy size={16} color={theme.colors.accent} strokeWidth={1.75} />
              </Pressable>
            </View>
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.fieldActions}>
                <Pressable
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  hitSlop={8}
                  onPress={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <EyeOff size={16} color={theme.colors.textMuted} strokeWidth={1.75} />
                  ) : (
                    <Eye size={16} color={theme.colors.textMuted} strokeWidth={1.75} />
                  )}
                </Pressable>
                <Pressable accessibilityLabel="Copy password" hitSlop={8} onPress={() => handleCopy('Password', password)}>
                  <Copy size={16} color={theme.colors.accent} strokeWidth={1.75} />
                </Pressable>
                <Pressable
                  accessibilityLabel="Generate new password"
                  hitSlop={8}
                  onPress={() => {
                    haptics.success();
                    setPassword(generatePassword());
                  }}>
                  <RefreshCw size={16} color={theme.colors.accent} strokeWidth={1.75} />
                </Pressable>
              </View>
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, styles.mono]}
            />
            <View style={styles.strengthRow}>
              <View style={styles.strengthTrack}>
                <View style={[styles.strengthFill, { width: `${strength.score}%` }]} />
              </View>
              <Text style={styles.strengthLabel}>{strength.label}</Text>
            </View>
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Optional Details</Text>
        <GlassCard style={styles.card}>
          <Field
            label="Account Label"
            value={accountLabel}
            onChangeText={setAccountLabel}
            placeholder="e.g. Personal Workspace"
          />
          <View style={styles.divider} />
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Notes</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Add a note..."
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, styles.notes]}
            />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Organization</Text>
        <GlassCard style={styles.card}>
          <Field label="Folder" value={folder} onChangeText={setFolder} placeholder="e.g. Development Tools" />
          <View style={styles.divider} />
          <Field label="Tags" value={tagsText} onChangeText={setTagsText} placeholder="Separate by commas" />
          <View style={styles.divider} />
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {CREDENTIAL_CATEGORIES.map((item) => {
                const active = item.id === category;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => {
                      haptics.selection();
                      setCategory(item.id);
                    }}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}>
                    <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <Star
                size={18}
                color={credential.isFavorite ? theme.colors.warning : theme.colors.textMuted}
                fill={credential.isFavorite ? theme.colors.warning : 'transparent'}
                strokeWidth={1.75}
              />
              <Text style={styles.toggleText}>Mark as Favorite</Text>
            </View>
            <Toggle
              value={credential.isFavorite}
              onChange={() => toggleFavorite(credential.id)}
              label="Mark as favorite"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <Trash2 size={18} color={theme.colors.textMuted} strokeWidth={1.75} />
              <Text style={styles.toggleText}>Archive Credential</Text>
            </View>
            <Toggle
              value={credential.isArchived}
              onChange={() => toggleArchive(credential.id)}
              label="Archive credential"
            />
          </View>
        </GlassCard>

        {credential.passwordHistory.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Password History</Text>
            <GlassCard style={styles.card}>
              {credential.passwordHistory.map((entry, index) => {
                const revealed = revealedHistory[index];
                return (
                  <View key={`${entry.changedAt}-${index}`}>
                    {index > 0 ? <View style={styles.divider} /> : null}
                    <View style={styles.historyRow}>
                      <View style={styles.historyText}>
                        <Text style={[styles.historyValue, !revealed && styles.mono]} numberOfLines={1}>
                          {revealed ? entry.password : '••••••••••••'}
                        </Text>
                        <Text style={styles.historyAge}>Set {formatAge(entry.changedAt)}</Text>
                      </View>
                      <View style={styles.fieldActions}>
                        <Pressable
                          accessibilityLabel={revealed ? 'Hide previous password' : 'Reveal previous password'}
                          hitSlop={8}
                          onPress={() => setRevealedHistory((prev) => ({ ...prev, [index]: !prev[index] }))}>
                          {revealed ? (
                            <EyeOff size={16} color={theme.colors.textMuted} strokeWidth={1.75} />
                          ) : (
                            <Eye size={16} color={theme.colors.textMuted} strokeWidth={1.75} />
                          )}
                        </Pressable>
                        <Pressable
                          accessibilityLabel="Copy previous password"
                          hitSlop={8}
                          onPress={() => handleCopy('Password', entry.password)}>
                          <Copy size={16} color={theme.colors.accent} strokeWidth={1.75} />
                        </Pressable>
                        <Pressable
                          accessibilityLabel="Restore previous password"
                          hitSlop={8}
                          onPress={() => {
                            haptics.selection();
                            setPassword(entry.password);
                            showToast('Previous password restored to field', 'info');
                          }}>
                          <RotateCcw size={16} color={theme.colors.accent} strokeWidth={1.75} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })}
            </GlassCard>
          </>
        ) : null}

        <View style={styles.save}>
          <Button onPress={handleSave} disabled={saving}>
            {saving ? 'SAVING…' : 'UPDATE CREDENTIAL'}
          </Button>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete credential"
            onPress={handleDelete}
            style={({ pressed }) => [styles.delete, pressed && styles.pressed]}>
            <Trash2 size={16} color={theme.colors.error} strokeWidth={2} />
            <Text style={styles.deleteText}>Delete Credential</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: t.layout.screenPadding,
      paddingTop: t.spacing.lg,
    },
    missing: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.spacing.xl,
      paddingHorizontal: t.spacing.xxl,
    },
    missingText: {
      ...t.typography.body,
      color: t.colors.textSecondary,
      textAlign: 'center',
    },
    identity: {
      alignItems: 'center',
      gap: t.spacing.sm,
      marginBottom: t.spacing.xl,
    },
    logoWrapper: {
      width: 72,
      height: 72,
    },
    logoEditBadge: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 26,
      height: 26,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.accent,
      borderWidth: 2,
      borderColor: t.colors.background,
    },
    identityName: {
      ...t.typography.titleSerif,
      fontSize: 24,
      color: t.colors.text,
    },
    identityUrl: {
      fontSize: 13,
      color: t.colors.textMuted,
    },
    sectionTitle: {
      ...t.typography.titleSerif,
      color: t.colors.text,
      marginBottom: t.spacing.md,
    },
    card: {
      gap: t.spacing.xs,
      marginBottom: t.spacing.lg,
    },
    field: {
      gap: 6,
      paddingVertical: 6,
    },
    fieldHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: t.fontWeight.semibold,
      letterSpacing: 0.4,
      color: t.colors.textMuted,
    },
    fieldActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.lg,
    },
    input: {
      fontSize: 15,
      color: t.colors.text,
      padding: 0,
    },
    mono: {
      letterSpacing: 1.5,
    },
    notes: {
      minHeight: 48,
      textAlignVertical: 'top',
      lineHeight: 20,
    },
    divider: {
      height: 1,
      backgroundColor: t.glass.border,
      marginVertical: t.spacing.sm,
    },
    strengthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      marginTop: t.spacing.sm + 2,
    },
    strengthTrack: {
      flex: 1,
      height: 4,
      borderRadius: t.radius.full,
      backgroundColor: t.glass.fillStrong,
      overflow: 'hidden',
    },
    strengthFill: {
      height: 4,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.success,
    },
    strengthLabel: {
      fontSize: 12,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.success,
    },
    categoryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.sm + 2,
    },
    categoryChip: {
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    categoryChipActive: {
      borderColor: t.colors.accent,
      backgroundColor: t.colors.accentSoft,
    },
    categoryText: {
      fontSize: 13,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    categoryTextActive: {
      color: t.colors.accent,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: t.spacing.sm,
    },
    toggleLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
    toggleText: {
      ...t.typography.body,
      fontSize: 15,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.text,
    },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: t.spacing.md,
      paddingVertical: t.spacing.sm,
    },
    historyText: {
      flex: 1,
      gap: 2,
    },
    historyValue: {
      fontSize: 15,
      color: t.colors.text,
    },
    historyAge: {
      fontSize: 12,
      color: t.colors.textMuted,
    },
    save: {
      marginTop: t.spacing.xl,
      gap: t.spacing.lg,
      alignItems: 'center',
    },
    delete: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      paddingVertical: t.spacing.sm,
    },
    pressed: {
      opacity: 0.8,
    },
    deleteText: {
      fontSize: 14,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.error,
    },
  });
}
