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

import { CredentialAvatar, GlassCard, PrimaryButton, ScreenBackground, Toggle, VaultHeader } from '@/components/vault';
import { VaultColors, VaultType } from '@/constants/vault-theme';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { copySensitiveToClipboard, copyToClipboard, hapticSuccess, hapticWarning } from '@/services/feedback';
import { generatePassword, scorePasswordStrength } from '@/services/password-generator';

const CATEGORIES = ['Login', 'Card', 'Note', 'Identity'];

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
          <PrimaryButton label="BACK TO VAULT" onPress={() => router.replace('/vault')} />
        </View>
      </ScreenBackground>
    );
  }

  async function handleSave() {
    if (!website.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Website, username, and password are required.');
      hapticWarning();
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
      showToast('Credential updated', 'success');
      router.back();
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Please try again.');
      hapticWarning();
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
          hapticSuccess();
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
      hapticSuccess();
      showToast('Custom logo updated', 'success');
    } catch {
      hapticWarning();
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
              <ImagePlus size={13} color={VaultColors.buttonText} strokeWidth={2.5} />
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
                <Copy size={16} color={VaultColors.accent} strokeWidth={1.75} />
              </Pressable>
            </View>
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={VaultColors.placeholder}
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
                    <EyeOff size={16} color={VaultColors.muted} strokeWidth={1.75} />
                  ) : (
                    <Eye size={16} color={VaultColors.muted} strokeWidth={1.75} />
                  )}
                </Pressable>
                <Pressable accessibilityLabel="Copy password" hitSlop={8} onPress={() => handleCopy('Password', password)}>
                  <Copy size={16} color={VaultColors.accent} strokeWidth={1.75} />
                </Pressable>
                <Pressable
                  accessibilityLabel="Generate new password"
                  hitSlop={8}
                  onPress={() => setPassword(generatePassword())}>
                  <RefreshCw size={16} color={VaultColors.accent} strokeWidth={1.75} />
                </Pressable>
              </View>
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={VaultColors.placeholder}
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
              placeholderTextColor={VaultColors.placeholder}
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
              {CATEGORIES.map((item) => {
                const active = item === category;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}>
                    <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{item}</Text>
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
                color={credential.isFavorite ? VaultColors.warning : VaultColors.muted}
                fill={credential.isFavorite ? VaultColors.warning : 'transparent'}
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
              <Trash2 size={18} color={VaultColors.muted} strokeWidth={1.75} />
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
                            <EyeOff size={16} color={VaultColors.muted} strokeWidth={1.75} />
                          ) : (
                            <Eye size={16} color={VaultColors.muted} strokeWidth={1.75} />
                          )}
                        </Pressable>
                        <Pressable
                          accessibilityLabel="Copy previous password"
                          hitSlop={8}
                          onPress={() => handleCopy('Password', entry.password)}>
                          <Copy size={16} color={VaultColors.accent} strokeWidth={1.75} />
                        </Pressable>
                        <Pressable
                          accessibilityLabel="Restore previous password"
                          hitSlop={8}
                          onPress={() => {
                            setPassword(entry.password);
                            showToast('Previous password restored to field', 'info');
                          }}>
                          <RotateCcw size={16} color={VaultColors.accent} strokeWidth={1.75} />
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
          <PrimaryButton label={saving ? 'SAVING…' : 'UPDATE CREDENTIAL'} onPress={handleSave} disabled={saving} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete credential"
            onPress={handleDelete}
            style={({ pressed }) => [styles.delete, pressed && styles.pressed]}>
            <Trash2 size={16} color={VaultColors.danger} strokeWidth={2} />
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
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={VaultColors.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 32,
  },
  missingText: {
    ...VaultType.body,
    color: VaultColors.body,
    textAlign: 'center',
  },
  identity: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
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
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.accent,
    borderWidth: 2,
    borderColor: VaultColors.background,
  },
  identityName: {
    ...VaultType.title,
    fontSize: 24,
    color: VaultColors.heading,
  },
  identityUrl: {
    fontSize: 13,
    color: VaultColors.muted,
  },
  sectionTitle: {
    ...VaultType.heading,
    color: VaultColors.heading,
    marginBottom: 12,
  },
  card: {
    gap: 4,
    marginBottom: 16,
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
    fontWeight: '600',
    letterSpacing: 0.4,
    color: VaultColors.muted,
  },
  fieldActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  input: {
    fontSize: 15,
    color: VaultColors.heading,
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
    backgroundColor: VaultColors.glassBorder,
    marginVertical: 8,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  strengthFill: {
    height: 4,
    borderRadius: 9999,
    backgroundColor: VaultColors.success,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: VaultColors.success,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  categoryChipActive: {
    borderColor: VaultColors.accent,
    backgroundColor: VaultColors.accentSoft,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: VaultColors.muted,
  },
  categoryTextActive: {
    color: VaultColors.accent,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: VaultColors.heading,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
  },
  historyText: {
    flex: 1,
    gap: 2,
  },
  historyValue: {
    fontSize: 15,
    color: VaultColors.heading,
  },
  historyAge: {
    fontSize: 12,
    color: VaultColors.muted,
  },
  save: {
    marginTop: 24,
    gap: 16,
    alignItems: 'center',
  },
  delete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: VaultColors.danger,
  },
});
