import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Copy, Edit3, Eye, EyeOff, KeyRound, Link, Tag, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditCredentialScreen } from '@/components/screens/edit-credential';
import { CredentialAvatar, GlassCard, PrimaryButton, ScreenBackground, VaultHeader } from '@/components/vault';
import { getCategory } from '@/constants/categories';
import { VaultType } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import { useVault } from '@/contexts/vault-context';
import { useToast } from '@/contexts/toast-context';
import { copySensitiveToClipboard, copyToClipboard } from '@/services/feedback';
import type { Credential } from '@/types/credential';
import type { VaultColorsShape } from '@/theme/color-themes';

function maskPassword(password: string) {
  return password ? '*'.repeat(Math.min(12, Math.max(8, password.length))) : 'No password';
}

export default function EntryDetail() {
  const { isInitialized, isLoading, isUnlocked, getCredential } = useVault();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  if (isLoading) return <View />;
  if (!isInitialized) return <Redirect href="/" />;
  if (!isUnlocked) return <Redirect href="/unlock" />;
  if (mode === 'edit') return <EditCredentialScreen />;

  const credential = id ? getCredential(id) : undefined;

  return <EntryReadOnlyView credential={credential} onEdit={() => setMode('edit')} />;
}

interface EntryReadOnlyViewProps {
  credential: Credential | undefined;
  onEdit: () => void;
}

function EntryReadOnlyView({ credential, onEdit }: EntryReadOnlyViewProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  if (!credential) {
    return (
      <ScreenBackground>
        <VaultHeader title="Credential" showBack onBack={() => router.back()} />
        <View style={styles.missing}>
          <Text style={styles.missingText}>This credential could not be found.</Text>
          <PrimaryButton label="BACK TO VAULT" onPress={() => router.replace('/vault')} />
        </View>
      </ScreenBackground>
    );
  }

  const category = getCategory(credential.category);
  const CategoryIcon = category?.icon ?? Tag;

  async function copyValue(label: string, value?: string, sensitive = false) {
    if (!value) return;
    if (sensitive) {
      await copySensitiveToClipboard(value);
      showToast(`${label} copied — clears in 30s`, 'success');
      return;
    }
    await copyToClipboard(value);
    showToast(`${label} copied`, 'success');
  }

  return (
    <ScreenBackground>
      <VaultHeader title="Credential" showBack onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.identity}>
          <CredentialAvatar
            icon={KeyRound}
            website={credential.website}
            url={credential.url}
            customLogoUri={credential.customLogoUri}
            size={76}
            iconSize={30}
          />
          <Text style={styles.identityName}>{credential.website || 'Credential'}</Text>
          {credential.accountLabel ? <Text style={styles.identityMeta}>{credential.accountLabel}</Text> : null}
        </View>

        <GlassCard style={styles.card}>
          <DetailRow
            icon={Link}
            label="Website"
            value={credential.website || 'Not set'}
            onCopy={() => copyValue('Website', credential.website)}
          />
          <View style={styles.divider} />
          <DetailRow
            icon={Link}
            label="URL"
            value={credential.url || 'Not set'}
            onCopy={credential.url ? () => copyValue('URL', credential.url) : undefined}
          />
          <View style={styles.divider} />
          <DetailRow
            icon={User}
            label="Username"
            value={credential.username || 'No username'}
            onCopy={() => copyValue('Username', credential.username)}
          />
          <View style={styles.divider} />
          <DetailRow
            icon={KeyRound}
            label="Password"
            value={showPassword ? credential.password : maskPassword(credential.password)}
            onCopy={() => copyValue('Password', credential.password, true)}
            trailing={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                hitSlop={8}
                onPress={() => setShowPassword((visible) => !visible)}>
                {showPassword ? (
                  <EyeOff size={17} color={c.muted} strokeWidth={1.75} />
                ) : (
                  <Eye size={17} color={c.muted} strokeWidth={1.75} />
                )}
              </Pressable>
            }
          />
          <View style={styles.divider} />
          <DetailRow icon={CategoryIcon} label="Category" value={category?.label ?? credential.category} />
        </GlassCard>

        {credential.notes ? (
          <>
            <Text style={styles.sectionTitle}>Notes</Text>
            <GlassCard style={styles.card}>
              <Text style={styles.notes}>{credential.notes}</Text>
            </GlassCard>
          </>
        ) : null}

        <PrimaryButton label="EDIT CREDENTIAL" icon={Edit3} onPress={onEdit} />
      </ScrollView>
    </ScreenBackground>
  );
}

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onCopy?: () => void;
  trailing?: ReactNode;
}

function DetailRow({ icon: Icon, label, value, onCopy, trailing }: DetailRowProps) {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon size={18} color={c.accent} strokeWidth={1.75} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
      <View style={styles.actions}>
        {trailing}
        {onCopy ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`Copy ${label}`} hitSlop={8} onPress={onCopy}>
            <Copy size={17} color={c.accent} strokeWidth={1.75} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: 20,
      gap: 18,
    },
    identity: {
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      marginBottom: 4,
    },
    identityName: {
      ...VaultType.title,
      color: c.heading,
      textAlign: 'center',
    },
    identityMeta: {
      fontSize: 13,
      color: c.muted,
      textAlign: 'center',
    },
    card: {
      gap: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 4,
    },
    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accentSoft,
    },
    rowText: {
      flex: 1,
      gap: 3,
    },
    rowLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: c.muted,
      textTransform: 'uppercase',
    },
    rowValue: {
      fontSize: 15,
      lineHeight: 21,
      color: c.heading,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    divider: {
      height: 1,
      marginVertical: 12,
      backgroundColor: c.hairline,
    },
    sectionTitle: {
      ...VaultType.label,
      color: c.muted,
      marginTop: 2,
    },
    notes: {
      fontSize: 14,
      lineHeight: 21,
      color: c.body,
    },
    missing: {
      flex: 1,
      justifyContent: 'center',
      gap: 20,
      paddingHorizontal: 24,
    },
    missingText: {
      ...VaultType.body,
      color: c.body,
      textAlign: 'center',
    },
  });
}
