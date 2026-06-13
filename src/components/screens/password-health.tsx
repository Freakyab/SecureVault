import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronRight,
  Clock,
  Copy,
  KeyRound,
  Lightbulb,
  RefreshCw,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav, GlassCard, ScreenBackground, VaultHeader } from '@/components/vault';
import { VaultColors, VaultType } from '@/constants/vault-theme';
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

const ISSUE_META: Record<IssueKind, { label: string; action: string; color: string }> = {
  weak: { label: 'Weak password', action: 'Strengthen', color: VaultColors.warning },
  reused: { label: 'Reused password', action: 'Change', color: VaultColors.danger },
  old: { label: 'Old password', action: 'Rotate', color: VaultColors.accent },
};

export function PasswordHealthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const { credentials } = useVault();
  const runLocked = useNavigationLock();
  const metrics = useMemo(() => computeHealthMetrics(credentials), [credentials]);
  const [breach, setBreach] = useState<BreachState>({ status: 'idle' });

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

  const stats = [
    { value: String(metrics.strong), label: 'Safe', color: VaultColors.success },
    { value: String(metrics.reused), label: 'Reused', color: VaultColors.danger },
    { value: String(metrics.weak), label: 'Weak', color: VaultColors.warning },
    { value: String(metrics.old), label: 'Old', color: VaultColors.accent },
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
    runLocked(() => router.push({ pathname: '/edit-credential', params: { id } }));
  }

  function rescan() {
    showToast(`Vault re-scanned — health ${metrics.score}%`, 'info');
  }

  const scoreColor =
    metrics.score >= 80
      ? VaultColors.success
      : metrics.score >= 50
        ? VaultColors.warning
        : VaultColors.danger;

  return (
    <ScreenBackground>
      <VaultHeader title="Password Health" showBack onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}>
        <View style={styles.scoreWrapper}>
          <View style={[styles.scoreRing, { borderColor: scoreColor }]}>
            <Text style={styles.scoreValue}>{metrics.score}</Text>
            <Text style={styles.scoreUnit}>/ 100</Text>
          </View>
          <Text
            accessibilityRole="text"
            accessibilityLabel={`Vault health score ${metrics.score} out of 100`}
            style={styles.scoreLabel}>
            {metrics.total === 0
              ? 'Add credentials to start your health report'
              : 'Your vault health updates live'}
          </Text>
        </View>

        <View
          accessibilityRole="summary"
          accessibilityLabel={`${metrics.strong} safe, ${metrics.reused} reused, ${metrics.weak} weak, ${metrics.old} old`}
          style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Breach Monitor</Text>
        <GlassCard style={styles.breachCard}>
          <View style={styles.breachHeader}>
            <View style={styles.breachIcon}>
              <ScanSearch size={18} color={VaultColors.accent} strokeWidth={2} />
            </View>
            <Text style={styles.breachLead}>
              Check your passwords against known data breaches. Only an anonymized hash prefix leaves
              your device — never your passwords.
            </Text>
          </View>

          {breach.status === 'done' ? (
            breachedAccounts.length > 0 ? (
              <>
                <Text style={[styles.breachResult, { color: VaultColors.danger }]}>
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
                      <ShieldAlert size={15} color={VaultColors.danger} strokeWidth={1.75} />
                      <Text style={styles.reusedMemberText} numberOfLines={1}>
                        {account.website} · {account.username || 'No username'}
                      </Text>
                      <ChevronRight size={15} color={VaultColors.muted} strokeWidth={2} />
                    </Pressable>
                  ))}
                </View>
              </>
            ) : (
              <Text style={[styles.breachResult, { color: VaultColors.success }]}>
                Good news — none of your {breach.checked} checked password
                {breach.checked === 1 ? '' : 's'} appeared in known breaches.
              </Text>
            )
          ) : null}

          {breach.status === 'error' ? (
            <Text style={[styles.breachResult, { color: VaultColors.warning }]}>{breach.message}</Text>
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
                <ActivityIndicator size="small" color={VaultColors.accent} />
                <Text style={styles.breachButtonText}>Checking…</Text>
              </>
            ) : (
              <>
                <ScanSearch size={16} color={VaultColors.accent} strokeWidth={2} />
                <Text style={styles.breachButtonText}>
                  {breach.status === 'idle' ? 'Check for breaches' : 'Re-check breaches'}
                </Text>
              </>
            )}
          </Pressable>
        </GlassCard>

        <Text style={styles.sectionTitle}>Needs Attention</Text>
        {attention.length > 0 ? (
          <View style={styles.attentionList}>
            {attention.map((item) => {
              const meta = ISSUE_META[item.kind];
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${meta.label} on ${item.website}. ${meta.action} this credential.`}
                  onPress={() => openCredential(item.id)}
                  style={({ pressed }) => [pressed && styles.pressed]}>
                  <GlassCard style={styles.attentionCard}>
                    <View style={[styles.attentionIcon, { backgroundColor: meta.color + '22' }]}>
                      <ShieldAlert size={18} color={meta.color} strokeWidth={2} />
                    </View>
                    <View style={styles.attentionText}>
                      <Text style={styles.attentionName} numberOfLines={1}>
                        {item.website}
                      </Text>
                      <Text style={styles.attentionMeta} numberOfLines={1}>
                        {meta.label} · {item.username}
                      </Text>
                    </View>
                    <View style={styles.attentionAction}>
                      <Text style={[styles.attentionActionText, { color: meta.color }]}>{meta.action}</Text>
                      <ChevronRight size={16} color={VaultColors.muted} strokeWidth={2} />
                    </View>
                  </GlassCard>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <GlassCard style={styles.safeCard}>
            <ShieldCheck size={20} color={VaultColors.success} strokeWidth={2} />
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
                  <View style={styles.reusedHeader}>
                    <View style={styles.reusedIcon}>
                      <Copy size={18} color={VaultColors.danger} strokeWidth={2} />
                    </View>
                    <Text style={styles.reusedBody}>
                      {group.members.length} accounts share one password. Change all but one.
                    </Text>
                  </View>
                  {group.members.map((member) => (
                    <Pressable
                      key={member.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${member.website} to change its reused password`}
                      onPress={() => openCredential(member.id)}
                      style={({ pressed }) => [styles.reusedMember, pressed && styles.pressed]}>
                      <KeyRound size={15} color={VaultColors.accent} strokeWidth={1.75} />
                      <Text style={styles.reusedMemberText} numberOfLines={1}>
                        {member.website} · {member.username || 'No username'}
                      </Text>
                      <ChevronRight size={15} color={VaultColors.muted} strokeWidth={2} />
                    </Pressable>
                  ))}
                </GlassCard>
              ))}
            </View>
          </>
        ) : null}

        {metrics.old > 0 ? (
          <GlassCard style={styles.oldCard}>
            <Clock size={18} color={VaultColors.accent} strokeWidth={1.75} />
            <Text style={styles.oldText}>
              {metrics.old} password{metrics.old === 1 ? '' : 's'} are older than 6 months. Rotating
              them keeps your vault fresh.
            </Text>
          </GlassCard>
        ) : null}

        <Text style={styles.sectionTitle}>Secure Tips</Text>
        <View style={styles.tips}>
          {TIPS.map((tip) => (
            <GlassCard key={tip} style={styles.tipCard}>
              <Lightbulb size={18} color={VaultColors.accent} strokeWidth={1.75} />
              <Text style={styles.tipText}>{tip}</Text>
            </GlassCard>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Re-scan vault health"
          onPress={rescan}
          style={({ pressed }) => [styles.rescanWrapper, pressed && styles.pressed]}>
          <LinearGradient
            colors={[VaultColors.accentStrong, VaultColors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rescan}>
            <RefreshCw size={16} color={VaultColors.buttonText} strokeWidth={2.5} />
            <Text style={styles.rescanText}>RE-SCAN VAULT</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      <BottomNav active="health" />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scoreWrapper: {
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  scoreRing: {
    width: 160,
    height: 160,
    borderRadius: 9999,
    borderWidth: 8,
    borderColor: VaultColors.accentStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.glassBackground,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: VaultColors.heading,
  },
  scoreUnit: {
    fontSize: 14,
    color: VaultColors.muted,
  },
  scoreLabel: {
    ...VaultType.body,
    color: VaultColors.body,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: VaultColors.muted,
  },
  sectionTitle: {
    ...VaultType.heading,
    color: VaultColors.heading,
    marginTop: 32,
    marginBottom: 16,
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
    backgroundColor: VaultColors.accentSoft,
  },
  breachLead: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: VaultColors.body,
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
    borderColor: VaultColors.accent + '55',
    backgroundColor: VaultColors.accentSoft,
  },
  breachButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: VaultColors.accent,
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
    color: VaultColors.heading,
  },
  attentionMeta: {
    fontSize: 12,
    color: VaultColors.muted,
  },
  attentionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attentionActionText: {
    fontSize: 13,
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
    color: VaultColors.body,
  },
  reusedCard: {
    gap: 12,
    borderColor: 'rgba(255,138,138,0.3)',
  },
  reusedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reusedIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,138,138,0.15)',
  },
  reusedBody: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: VaultColors.body,
  },
  reusedMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: VaultColors.glassBackground,
  },
  reusedMemberText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: VaultColors.heading,
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
    color: VaultColors.body,
  },
  tips: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: VaultColors.body,
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
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: VaultColors.buttonText,
  },
});
