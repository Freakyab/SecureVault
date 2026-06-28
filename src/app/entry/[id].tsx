import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Copy, Edit3, Eye, EyeOff, KeyRound, Link, Tag, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Animated, { FadeInDown } from 'react-native-reanimated';

import { EditCredentialScreen } from '@/components/screens/edit-credential';
import { CredentialAvatar, ScreenBackground, VaultHeader } from '@/components/vault';
import { GlassCard, Button } from '@/components/ui';
import { getCategory } from '@/constants/categories';
import { useVault } from '@/contexts/vault-context';
import { useToast } from '@/contexts/toast-context';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import { copySensitiveToClipboard, copyToClipboard } from '@/services/feedback';
import { type Theme } from '@/theme';
import type { Credential } from '@/types/credential';

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
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  if (!credential) {
    return (
      <ScreenBackground>
        <VaultHeader title="Credential" showBack onBack={() => router.back()} />
        <View style={styles.missing}>
          <Text style={styles.missingText}>This credential could not be found.</Text>
          <Button onPress={() => router.replace('/vault')}>BACK TO VAULT</Button>
        </View>
      </ScreenBackground>
    );
  }

  const category = getCategory(credential.category);
  const CategoryIcon = category?.icon ?? Tag;

  async function copyValue(label: string, value?: string, sensitive = false) {
    if (!value) return;
    haptics.success();
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
        <Animated.View
          entering={FadeInDown.duration(theme.motion.duration.cardExpand)}
          style={styles.identity}>
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
        </Animated.View>

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
                  <EyeOff size={17} color={theme.colors.textMuted} strokeWidth={1.75} />
                ) : (
                  <Eye size={17} color={theme.colors.textMuted} strokeWidth={1.75} />
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

        <Button onPress={onEdit}>EDIT CREDENTIAL</Button>
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
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon size={18} color={theme.colors.accent} strokeWidth={1.75} />
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
            <Copy size={17} color={theme.colors.accent} strokeWidth={1.75} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: t.layout.screenPadding,
      gap: t.spacing.lg + 2,
    },
    identity: {
      alignItems: 'center',
      gap: t.spacing.sm,
      marginTop: t.spacing.md,
      marginBottom: t.spacing.xs,
    },
    identityName: {
      ...t.typography.titleSerif,
      color: t.colors.text,
      textAlign: 'center',
    },
    identityMeta: {
      fontSize: 13,
      color: t.colors.textMuted,
      textAlign: 'center',
    },
    card: {
      gap: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      paddingVertical: t.spacing.xs,
    },
    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: t.radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.accentSoft,
    },
    rowText: {
      flex: 1,
      gap: 3,
    },
    rowLabel: {
      fontSize: 11,
      fontWeight: t.fontWeight.bold,
      letterSpacing: 0.8,
      color: t.colors.textMuted,
      textTransform: 'uppercase',
    },
    rowValue: {
      ...t.typography.body,
      fontSize: 15,
      lineHeight: 21,
      color: t.colors.text,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
    divider: {
      height: 1,
      marginVertical: t.spacing.md,
      backgroundColor: t.glass.border,
    },
    sectionTitle: {
      ...t.typography.label,
      color: t.colors.textMuted,
      marginTop: 2,
    },
    notes: {
      ...t.typography.body,
      fontSize: 14,
      lineHeight: 21,
      color: t.colors.textSecondary,
    },
    missing: {
      flex: 1,
      justifyContent: 'center',
      gap: t.spacing.xl,
      paddingHorizontal: t.spacing.xl,
    },
    missingText: {
      ...t.typography.body,
      color: t.colors.textSecondary,
      textAlign: 'center',
    },
  });
}
