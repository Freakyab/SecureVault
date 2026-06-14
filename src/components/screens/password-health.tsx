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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BottomNav,
  CredentialAvatar,
  GlassCard,
  ScoreRing,
  ScreenBackground,
  VaultHeader,
} from '@/components/vault';
import { SerifFont } from '@/constants/theme';
import { VaultType } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { scanCredentialsForBreaches } from '@/services/breach-check';
import { computeHealthMetrics } from '@/services/health-checks';

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
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const ISSUE_META: Record<
    IssueKind,
    { label: string; action: string; color: string; icon: LucideIcon }
  > = {
    weak: { label: 'Weak password', action: 'Strengthen', color: c.warning, icon: ShieldAlert },
    reused: { label: 'Reused password', action: 'Change', color: c.danger, icon: Copy },
    old: { label: 'Old password', action: 'Rotate', color: c.accent, icon: Clock },
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
      showToast('Add credentials before scanning for breaches', 'info');
      return;
    }
    setBreach({ status: 'scanning' });
    try {
      const result = await scanCredentialsForBreaches(credentials);
      setBreach({
        status: 'done',
        breachedIds: result.breachedIds,
        checked: result.checkedPasswords,
        maxExposures: result.maxExposures,
      });
    } catch (error) {
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
    { value: String(metrics.strong), label: 'Safe', color: c.success, icon: ShieldCheck },
    { value: String(metrics.reused), label: 'Reused', color: c.danger, icon: Copy },
    { value: String(metrics.weak), label: 'Weak', color: c.warning, icon: AlertTriangle },
    { value: String(metrics.old), label: 'Old', color: c.accent, icon: RotateCw },
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
    showToast(`Vault re-scanned — health ${metrics.score}%`, 'info');
  }

  const tier =
    metrics.score >= 90
      ? {
          color: c.success,
          word: 'FORTIFIED',
          blurb:
            'Your overall password security is fortified. Keep rotating credentials to stay ahead.',
        }
      : metrics.score >= 60
        ? {
            color: c.accent,
            word: 'GOOD',
            blurb:
              'Your overall password security is strong, but a few critical optimizations are recommended to reach Fortified status.',
          }
        : metrics.score >= 40
          ? {
              color: c.warning,
              word: 'FAIR',
              blurb:
                'Your vault is in fair shape, but a few critical optimizations are recommended below.',
            }
          : {
              color: c.danger,
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
        <View style={styles.scoreWrapper}>
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
        </View>

        <View
          accessibilityRole="summary"
          accessibilityLabel={`${metrics.strong} safe, ${metrics.reused} reused, ${metrics.weak} weak, ${metrics.old} old`}
          style={styles.statsGrid}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <View
                key={stat.label}
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
              </View>
            );
          })}
        </View>

        <Text style={styles.subsectionTitle}>Breach Monitor</Text>
        <GlassCard style={styles.breachCard}>
          <View style={styles.breachHeader}>
            <View style={styles.breachIcon}>
              <ScanSearch size={18} color={c.accent} strokeWidth={2} />
            </View>
            <Text style={styles.breachLead}>
              Check your passwords against known data breaches. Only an anonymized hash prefix leaves
              your device — never your passwords.
            </Text>
          </View>

          {breach.status === 'done' ? (
            breachedAccounts.length > 0 ? (
              <>
                <Text style={[styles.breachResult, { color: c.danger }]}>
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
                      <ShieldAlert size={15} color={c.danger} strokeWidth={1.75} />
                      <Text style={styles.reusedMemberText} numberOfLines={1}>
                        {account.website} · {account.username || 'No username'}
                      </Text>
                      <ChevronRight size={15} color={c.muted} strokeWidth={2} />
                    </Pressable>
                  ))}
                </View>
              </>
            ) : (
              <Text style={[styles.breachResult, { color: c.success }]}>
                Good news — none of your {breach.checked} checked password
                {breach.checked === 1 ? '' : 's'} appeared in known breaches.
              </Text>
            )
          ) : null}

          {breach.status === 'error' ? (
            <Text style={[styles.breachResult, { color: c.warning }]}>{breach.message}</Text>
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
                <ActivityIndicator size="small" color={c.accent} />
                <Text style={styles.breachButtonText}>Checking…</Text>
              </>
            ) : (
              <>
                <ScanSearch size={16} color={c.accent} strokeWidth={2} />
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
        ) : (
          <GlassCard style={styles.safeCard}>
            <ShieldCheck size={20} color={c.success} strokeWidth={2} />
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
                          accent={c.accent}
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
            <Clock size={18} color={c.accent} strokeWidth={1.75} />
            <Text style={styles.oldText}>
              {metrics.old} password{metrics.old === 1 ? '' : 's'} are older than 6 months. Rotating
              them keeps your vault fresh.
            </Text>
          </GlassCard>
        ) : null}

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, styles.sectionTitleInline]}>Secure Tips</Text>
          <Lightbulb size={20} color={c.muted} strokeWidth={1.75} />
        </View>
        <View style={styles.tips}>
          <GlassCard style={styles.tipsCard}>
            {TIPS.map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <CheckCircle2 size={18} color={c.success} strokeWidth={1.75} />
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
            colors={[c.accentStrong, c.accent]}
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

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scoreWrapper: {
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  scoreHeadline: {
    ...VaultType.sectionHeading,
    color: c.heading,
    textAlign: 'center',
    marginTop: 8,
  },
  scoreBlurb: {
    fontSize: 14,
    lineHeight: 21,
    color: c.muted,
    textAlign: 'center',
    paddingHorizontal: 12,
    maxWidth: 320,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 28,
  },
  statCard: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  statCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: SerifFont.bold,
    fontSize: 32,
    lineHeight: 36,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: c.muted,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    ...VaultType.sectionHeading,
    color: c.heading,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitleInline: {
    marginTop: 0,
    marginBottom: 0,
  },
  subsectionTitle: {
    ...VaultType.heading,
    color: c.heading,
    marginTop: 32,
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: c.accent,
  },
  breachCard: {
    gap: 14,
  },
  breachHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  breachIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.accentSoft,
  },
  breachLead: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: c.body,
  },
  breachResult: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  breachList: {
    gap: 10,
  },
  breachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: c.accent + '55',
    backgroundColor: c.accentSoft,
  },
  breachButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: c.accent,
  },
  disabled: {
    opacity: 0.6,
  },
  attentionList: {
    gap: 12,
  },
  attentionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  attentionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionText: {
    flex: 1,
    gap: 2,
  },
  attentionName: {
    fontSize: 15,
    fontWeight: '600',
    color: c.heading,
  },
  attentionMeta: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: c.muted,
  },
  actionPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  safeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  safeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: c.body,
  },
  reusedCard: {
    gap: 12,
    borderColor: 'rgba(255,138,138,0.3)',
  },
  reusedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  reusedTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: c.heading,
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: c.accentSoft,
    borderWidth: 1,
    borderColor: c.accent + '55',
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: c.accent,
    letterSpacing: 0.3,
  },
  reusedBody: {
    fontSize: 13,
    lineHeight: 19,
    color: c.muted,
  },
  reusedAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
  },
  reusedAvatarButton: {
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: c.glassBackgroundStrong,
  },
  reusedAvatarOverlap: {
    marginLeft: -10,
  },
  reusedAvatarMore: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: c.glassBackgroundStrong,
    backgroundColor: c.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reusedAvatarMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: c.accent,
  },
  reusedMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: c.glassBackground,
  },
  reusedMemberText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: c.heading,
  },
  oldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  oldText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: c.body,
  },
  tips: {
    gap: 12,
  },
  tipsCard: {
    gap: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: c.body,
  },
  rescanWrapper: {
    marginTop: 32,
    borderRadius: 9999,
  },
  pressed: {
    opacity: 0.85,
  },
  rescan: {
    height: 56,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rescanText: {
    fontSize: 15,
    fontWeight: '700',
    color: c.buttonText,
  },
  });
}
