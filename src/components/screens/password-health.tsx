import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Clock,
  Copy,
  KeyRound,
  Lightbulb,
  RotateCw,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BottomNav,
  CredentialAvatar,
  EmptyState,
  ScoreRing,
  ScreenBackground,
  VaultHeader,
} from '@/components/vault';
import { GlassCard } from '@/components/ui';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useHaptics } from '@/hooks/use-haptics';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { useTheme } from '@/hooks/use-theme';
import { scanCredentialsForBreaches } from '@/services/breach-check';
import { computeHealthMetrics } from '@/services/health-checks';
import { type Theme } from '@/theme';

type BreachState =
  | { status: 'idle' }
  | { status: 'scanning' }
  | { status: 'error'; message: string }
  | { status: 'done'; breachedIds: string[]; checked: number; maxExposures: number };

const TIPS = [
  'Use a unique password for every account.',
  'Enable two-factor authentication where available.',
  'Rotate passwords that are older than six months.',
];

type IssueKind = 'weak' | 'reused' | 'old';

interface AttentionItem {
  id: string;
  website: string;
  username: string;
  kind: IssueKind;
}

export function PasswordHealthScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const ISSUE_META: Record<
    IssueKind,
    { label: string; action: string; color: string; icon: LucideIcon }
  > = {
    weak: { label: 'Weak password', action: 'Strengthen', color: theme.colors.warning, icon: ShieldAlert },
    reused: { label: 'Reused password', action: 'Change', color: theme.colors.error, icon: Copy },
    old: { label: 'Old password', action: 'Rotate', color: theme.colors.accent, icon: Clock },
  };
  const router = useRouter();
  const { showToast } = useToast();
  const { credentials } = useVault();
  const runLocked = useNavigationLock();
  const metrics = useMemo(() => computeHealthMetrics(credentials), [credentials]);
  const [breach, setBreach] = useState<BreachState>({ status: 'idle' });
  const [showAllAttention, setShowAllAttention] = useState(false);

  async function runBreachScan() {
    if (metrics.total === 0) {
      haptics.warning();
      showToast('Add credentials before scanning for breaches', 'info');
      return;
    }
    haptics.selection();
    setBreach({ status: 'scanning' });
    try {
      const result = await scanCredentialsForBreaches(credentials);
      setBreach({
        status: 'done',
        breachedIds: result.breachedIds,
        checked: result.checkedPasswords,
        maxExposures: result.maxExposures,
      });
      if (result.breachedIds.length > 0) haptics.warning();
      else haptics.success();
    } catch (error) {
      haptics.error();
      setBreach({
        status: 'error',
        message: error instanceof Error ? error.message : 'Could not reach the breach service.',
      });
    }
  }

  const breachedAccounts = useMemo(() => {
    if (breach.status !== 'done') return [];
    const ids = new Set(breach.breachedIds);
    return credentials.filter((credential) => ids.has(credential.id));
  }, [breach, credentials]);

  const stats: { value: string; label: string; color: string; icon: LucideIcon }[] = [
    { value: String(metrics.strong), label: 'Safe', color: theme.colors.success, icon: ShieldCheck },
    { value: String(metrics.reused), label: 'Reused', color: theme.colors.error, icon: Copy },
    { value: String(metrics.weak), label: 'Weak', color: theme.colors.warning, icon: AlertTriangle },
    { value: String(metrics.old), label: 'Old', color: theme.colors.accent, icon: RotateCw },
  ];

  // Each credential surfaces its highest-priority issue: reused > weak > old.
  const attention = useMemo<AttentionItem[]>(() => {
    const weak = new Set(metrics.weakIds);
    const reused = new Set(metrics.reusedIds);
    const old = new Set(metrics.oldIds);
    return credentials
      .filter((credential) => !credential.isArchived)
      .filter((credential) => weak.has(credential.id) || reused.has(credential.id) || old.has(credential.id))
      .map((credential) => {
        const kind: IssueKind = reused.has(credential.id)
          ? 'reused'
          : weak.has(credential.id)
            ? 'weak'
            : 'old';
        return {
          id: credential.id,
          website: credential.website || 'Untitled',
          username: credential.username || 'No username',
          kind,
        };
      });
  }, [credentials, metrics.weakIds, metrics.reusedIds, metrics.oldIds]);

  const visibleAttention = showAllAttention ? attention : attention.slice(0, 3);

  const reusedGroups = useMemo(
    () =>
      metrics.reusedGroups.map((group) => ({
        ...group,
        members: group.credentialIds
          .map((id) => credentials.find((credential) => credential.id === id))
          .filter((credential): credential is NonNullable<typeof credential> => Boolean(credential)),
      })),
    [metrics.reusedGroups, credentials],
  );

  function openCredential(id: string) {
    runLocked(() => router.push({ pathname: '/entry/[id]', params: { id } }));
  }

  function rescan() {
    haptics.success();
    showToast(`Vault re-scanned — health ${metrics.score}%`, 'info');
  }

  const tier =
    metrics.score >= 90
      ? {
          color: theme.colors.success,
          word: 'FORTIFIED',
          blurb:
            'Your overall password security is fortified. Keep rotating credentials to stay ahead.',
        }
      : metrics.score >= 60
        ? {
            color: theme.colors.accent,
            word: 'GOOD',
            blurb:
              'Your overall password security is strong, but a few critical optimizations are recommended to reach Fortified status.',
          }
        : metrics.score >= 40
          ? {
              color: theme.colors.warning,
              word: 'FAIR',
              blurb:
                'Your vault is in fair shape, but a few critical optimizations are recommended below.',
            }
          : {
              color: theme.colors.error,
              word: 'AT RISK',
              blurb:
                'Your vault needs attention. Resolve the weak and reused passwords below to harden it.',
            };

  return (
    <ScreenBackground>
      <VaultHeader title="Password Health" showBack onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}>
        <Animated.View
          entering={FadeIn.duration(theme.motion.duration.navigation)}
          style={styles.scoreWrapper}>
          <View
            accessibilityRole="image"
            accessibilityLabel={`Vault health score ${metrics.score} percent, ${tier.word}`}>
            <ScoreRing score={metrics.score} statusLabel={tier.word} color={tier.color} />
          </View>
          <Text style={styles.scoreHeadline}>Vault Security Health</Text>
          <Text style={styles.scoreBlurb}>
            {metrics.total === 0
              ? 'Add credentials to start your personalized health report.'
              : tier.blurb}
          </Text>
        </Animated.View>

        <View
          accessibilityRole="summary"
          accessibilityLabel={`${metrics.strong} safe, ${metrics.reused} reused, ${metrics.weak} weak, ${metrics.old} old`}
          style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Animated.View
                key={stat.label}
                entering={FadeInDown.duration(theme.motion.duration.cardExpand).delay(
                  index * theme.motion.stagger.list,
                )}
                style={[
                  styles.statCard,
                  { borderColor: stat.color + '33', backgroundColor: stat.color + '12' },
                ]}>
                <View style={styles.statCardTop}>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '22' }]}>
                    <Icon size={18} color={stat.color} strokeWidth={2} />
                  </View>
                </View>
                <Text style={styles.statLabel}>{stat.label.toUpperCase()}</Text>
              </Animated.View>
            );
          })}
        </View>

        <Text style={styles.subsectionTitle}>Breach Monitor</Text>
        <GlassCard style={styles.breachCard}>
          <View style={styles.breachHeader}>
            <View style={styles.breachIcon}>
              <ScanSearch size={18} color={theme.colors.accent} strokeWidth={2} />
            </View>
            <Text style={styles.breachLead}>
              Check your passwords against known data breaches. Only an anonymized hash prefix leaves
              your device — never your passwords.
            </Text>
          </View>

          {breach.status === 'done' ? (
            breachedAccounts.length > 0 ? (
              <>
                <Text style={[styles.breachResult, { color: theme.colors.error }]}>
                  {breachedAccounts.length} of {breach.checked} password
                  {breach.checked === 1 ? '' : 's'} found in breaches. Change them now.
                </Text>
                <View style={styles.breachList}>
                  {breachedAccounts.map((account) => (
                    <Pressable
                      key={account.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${account.website} to change its breached password`}
                      onPress={() => openCredential(account.id)}
                      style={({ pressed }) => [styles.reusedMember, pressed && styles.pressed]}>
                      <ShieldAlert size={15} color={theme.colors.error} strokeWidth={1.75} />
                      <Text style={styles.reusedMemberText} numberOfLines={1}>
                        {account.website} · {account.username || 'No username'}
                      </Text>
                      <ChevronRight size={15} color={theme.colors.textMuted} strokeWidth={2} />
                    </Pressable>
                  ))}
                </View>
              </>
            ) : (
              <Text style={[styles.breachResult, { color: theme.colors.success }]}>
                Good news — none of your {breach.checked} checked password
                {breach.checked === 1 ? '' : 's'} appeared in known breaches.
              </Text>
            )
          ) : null}

          {breach.status === 'error' ? (
            <Text style={[styles.breachResult, { color: theme.colors.warning }]}>{breach.message}</Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Scan passwords for breaches"
            disabled={breach.status === 'scanning'}
            onPress={runBreachScan}
            style={({ pressed }) => [
              styles.breachButton,
              pressed && styles.pressed,
              breach.status === 'scanning' && styles.disabled,
            ]}>
            {breach.status === 'scanning' ? (
              <>
                <ActivityIndicator size="small" color={theme.colors.accent} />
                <Text style={styles.breachButtonText}>Checking…</Text>
              </>
            ) : (
              <>
                <ScanSearch size={16} color={theme.colors.accent} strokeWidth={2} />
                <Text style={styles.breachButtonText}>
                  {breach.status === 'idle' ? 'Check for breaches' : 'Re-check breaches'}
                </Text>
              </>
            )}
          </Pressable>
        </GlassCard>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, styles.sectionTitleInline]}>Needs Attention</Text>
          {attention.length > 3 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showAllAttention ? 'Show fewer items' : 'View all items needing attention'}
              hitSlop={8}
              onPress={() => setShowAllAttention((value) => !value)}>
              <Text style={styles.viewAll}>{showAllAttention ? 'Show Less' : 'View All'}</Text>
            </Pressable>
          ) : null}
        </View>
        {attention.length > 0 ? (
          <View style={styles.attentionList}>
            {visibleAttention.map((item) => {
              const meta = ISSUE_META[item.kind];
              const IssueIcon = meta.icon;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${meta.label} on ${item.website}. ${meta.action} this credential.`}
                  onPress={() => openCredential(item.id)}
                  style={({ pressed }) => [pressed && styles.pressed]}>
                  <GlassCard style={styles.attentionCard}>
                    <View style={[styles.attentionIcon, { backgroundColor: meta.color + '22' }]}>
                      <IssueIcon size={18} color={meta.color} strokeWidth={2} />
                    </View>
                    <View style={styles.attentionText}>
                      <Text style={styles.attentionName} numberOfLines={1}>
                        {item.website}
                      </Text>
                      <Text style={styles.attentionMeta} numberOfLines={1}>
                        {meta.label.toUpperCase()}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.actionPill,
                        { backgroundColor: meta.color + '22', borderColor: meta.color + '55' },
                      ]}>
                      <Text style={[styles.actionPillText, { color: meta.color }]}>{meta.action}</Text>
                    </View>
                  </GlassCard>
                </Pressable>
              );
            })}
          </View>
        ) : metrics.total === 0 ? (
          <EmptyState
            icon={KeyRound}
            title="No passwords to review"
            description="Add your first credential to unlock health scoring, breach checks, and security recommendations."
            actionLabel="Add credential"
            onAction={() => router.push('/add-credential')}
          />
        ) : (
          <GlassCard style={styles.safeCard}>
            <ShieldCheck size={20} color={theme.colors.success} strokeWidth={2} />
            <Text style={styles.safeText}>
              {metrics.total === 0
                ? 'No credentials saved yet.'
                : 'Every saved password looks healthy. Nice work!'}
            </Text>
          </GlassCard>
        )}

        {reusedGroups.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Reused Groups</Text>
            <View style={styles.attentionList}>
              {reusedGroups.map((group, index) => (
                <GlassCard key={`reused-${index}`} style={styles.reusedCard}>
                  <View style={styles.reusedTitleRow}>
                    <Text style={styles.reusedTitle}>Shared Secret #{index + 1}</Text>
                    <View style={styles.riskBadge}>
                      <Text style={styles.riskBadgeText}>High Risk</Text>
                    </View>
                  </View>
                  <Text style={styles.reusedBody}>
                    These {group.members.length} accounts use an identical password. Change one to
                    improve health.
                  </Text>
                  <View style={styles.reusedAvatars}>
                    {group.members.slice(0, 5).map((member, memberIndex) => (
                      <Pressable
                        key={member.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${member.website} to change its reused password`}
                        onPress={() => openCredential(member.id)}
                        style={({ pressed }) => [
                          styles.reusedAvatarButton,
                          memberIndex > 0 && styles.reusedAvatarOverlap,
                          pressed && styles.pressed,
                        ]}>
                        <CredentialAvatar
                          icon={KeyRound}
                          website={member.website}
                          url={member.url}
                          customLogoUri={member.customLogoUri}
                          size={38}
                          iconSize={16}
                          accent={theme.colors.accent}
                        />
                      </Pressable>
                    ))}
                    {group.members.length > 5 ? (
                      <View style={[styles.reusedAvatarMore, styles.reusedAvatarOverlap]}>
                        <Text style={styles.reusedAvatarMoreText}>+{group.members.length - 5}</Text>
                      </View>
                    ) : null}
                  </View>
                </GlassCard>
              ))}
            </View>
          </>
        ) : null}

        {metrics.old > 0 ? (
          <GlassCard style={styles.oldCard}>
            <Clock size={18} color={theme.colors.accent} strokeWidth={1.75} />
            <Text style={styles.oldText}>
              {metrics.old} password{metrics.old === 1 ? '' : 's'} are older than 6 months. Rotating
              them keeps your vault fresh.
            </Text>
          </GlassCard>
        ) : null}

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, styles.sectionTitleInline]}>Secure Tips</Text>
          <Lightbulb size={20} color={theme.colors.textMuted} strokeWidth={1.75} />
        </View>
        <View style={styles.tips}>
          <GlassCard style={styles.tipsCard}>
            {TIPS.map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <CheckCircle2 size={18} color={theme.colors.success} strokeWidth={1.75} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </GlassCard>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quick fix all password issues"
          onPress={rescan}
          style={({ pressed }) => [styles.rescanWrapper, pressed && styles.pressed]}>
          <LinearGradient
            colors={[theme.colors.accentAlt, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rescan}>
            <Text style={styles.rescanText}>Quick Fix All</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      <BottomNav active="health" />
    </ScreenBackground>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: t.layout.screenPadding,
      paddingTop: t.spacing.lg,
    },
    scoreWrapper: {
      alignItems: 'center',
      gap: t.spacing.md,
      marginTop: t.spacing.lg,
    },
    scoreHeadline: {
      ...t.typography.headingSerif,
      color: t.colors.text,
      textAlign: 'center',
      marginTop: t.spacing.sm,
    },
    scoreBlurb: {
      ...t.typography.body,
      fontSize: 14,
      lineHeight: 21,
      color: t.colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: t.spacing.md,
      maxWidth: 320,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.md,
      marginTop: t.spacing.xxl,
    },
    statCard: {
      flexBasis: '47%',
      flexGrow: 1,
      borderRadius: t.radius.card,
      borderWidth: 1,
      padding: t.spacing.lg,
      gap: t.spacing.sm,
    },
    statCardTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: t.radius.chip,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statValue: {
      ...t.typography.displaySerif,
      fontSize: 32,
      lineHeight: 36,
    },
    statLabel: {
      fontSize: 11,
      fontWeight: t.fontWeight.semibold,
      letterSpacing: 1.2,
      color: t.colors.textMuted,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: t.spacing.xxl,
      marginBottom: t.spacing.lg,
    },
    sectionTitle: {
      ...t.typography.headingSerif,
      color: t.colors.text,
      marginTop: t.spacing.xxl,
      marginBottom: t.spacing.lg,
    },
    sectionTitleInline: {
      marginTop: 0,
      marginBottom: 0,
    },
    subsectionTitle: {
      ...t.typography.titleSerif,
      color: t.colors.text,
      marginTop: t.spacing.xxl,
      marginBottom: t.spacing.lg,
    },
    viewAll: {
      fontSize: 13,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.accent,
    },
    breachCard: {
      gap: t.spacing.md + 2,
    },
    breachHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: t.spacing.md,
    },
    breachIcon: {
      width: 40,
      height: 40,
      borderRadius: t.radius.chip,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.accentSoft,
    },
    breachLead: {
      flex: 1,
      ...t.typography.caption,
      lineHeight: 19,
      color: t.colors.textSecondary,
    },
    breachResult: {
      fontSize: 14,
      fontWeight: t.fontWeight.semibold,
      lineHeight: 20,
    },
    breachList: {
      gap: t.spacing.sm + 2,
    },
    breachButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.spacing.sm,
      height: 48,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.colors.accentSoft,
      backgroundColor: t.colors.accentSoft,
    },
    breachButtonText: {
      fontSize: 14,
      fontWeight: t.fontWeight.bold,
      color: t.colors.accent,
    },
    disabled: {
      opacity: 0.6,
    },
    attentionList: {
      gap: t.spacing.md,
    },
    attentionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md + 2,
    },
    attentionIcon: {
      width: 40,
      height: 40,
      borderRadius: t.radius.chip,
      alignItems: 'center',
      justifyContent: 'center',
    },
    attentionText: {
      flex: 1,
      gap: 2,
    },
    attentionName: {
      ...t.typography.body,
      fontSize: 15,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.text,
    },
    attentionMeta: {
      fontSize: 11,
      fontWeight: t.fontWeight.semibold,
      letterSpacing: 0.8,
      color: t.colors.textMuted,
    },
    actionPill: {
      paddingHorizontal: t.spacing.md + 2,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radius.full,
      borderWidth: 1,
    },
    actionPillText: {
      fontSize: 12,
      fontWeight: t.fontWeight.bold,
    },
    safeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
    safeText: {
      flex: 1,
      ...t.typography.body,
      fontSize: 14,
      lineHeight: 20,
      color: t.colors.textSecondary,
    },
    reusedCard: {
      gap: t.spacing.md,
      borderColor: t.colors.error + '4d',
    },
    reusedTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: t.spacing.md,
    },
    reusedTitle: {
      ...t.typography.body,
      fontSize: 15,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.text,
      flex: 1,
    },
    riskBadge: {
      paddingHorizontal: t.spacing.sm + 2,
      paddingVertical: t.spacing.xs,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.accentSoft,
      borderWidth: 1,
      borderColor: t.colors.accentSoft,
    },
    riskBadgeText: {
      fontSize: 11,
      fontWeight: t.fontWeight.bold,
      color: t.colors.accent,
      letterSpacing: 0.3,
    },
    reusedBody: {
      ...t.typography.caption,
      lineHeight: 19,
      color: t.colors.textMuted,
    },
    reusedAvatars: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 2,
    },
    reusedAvatarButton: {
      borderRadius: t.radius.full,
      borderWidth: 2,
      borderColor: t.glass.fillStrong,
    },
    reusedAvatarOverlap: {
      marginLeft: -10,
    },
    reusedAvatarMore: {
      width: 38,
      height: 38,
      borderRadius: t.radius.full,
      borderWidth: 2,
      borderColor: t.glass.fillStrong,
      backgroundColor: t.colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reusedAvatarMoreText: {
      fontSize: 12,
      fontWeight: t.fontWeight.bold,
      color: t.colors.accent,
    },
    reusedMember: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm + 2,
      paddingVertical: t.spacing.sm + 2,
      paddingHorizontal: t.spacing.md,
      borderRadius: t.radius.button,
      backgroundColor: t.glass.fill,
    },
    reusedMemberText: {
      flex: 1,
      ...t.typography.caption,
      color: t.colors.text,
    },
    oldCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      marginTop: t.spacing.xl,
    },
    oldText: {
      flex: 1,
      ...t.typography.body,
      fontSize: 14,
      lineHeight: 20,
      color: t.colors.textSecondary,
    },
    tips: {
      gap: t.spacing.md,
    },
    tipsCard: {
      gap: t.spacing.md + 2,
    },
    tipRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: t.spacing.md,
    },
    tipText: {
      flex: 1,
      ...t.typography.body,
      fontSize: 14,
      lineHeight: 20,
      color: t.colors.textSecondary,
    },
    rescanWrapper: {
      marginTop: t.spacing.xxl,
      borderRadius: t.radius.full,
    },
    pressed: {
      opacity: 0.85,
    },
    rescan: {
      height: 56,
      borderRadius: t.radius.full,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.spacing.sm,
    },
    rescanText: {
      fontSize: 15,
      fontWeight: t.fontWeight.bold,
      color: t.colors.onAccent,
    },
  });
}
