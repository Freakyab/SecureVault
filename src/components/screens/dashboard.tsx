import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, KeyRound, type LucideIcon, Menu, Plus, Search, ShieldCheck, User } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedBlobs } from '@/components/ui/animated-blobs';
import { PressableScale } from '@/components/ui/pressable-scale';
import { BottomNav, CredentialRow, EmptyState } from '@/components/vault';
import { CREDENTIAL_CATEGORIES } from '@/constants/categories';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useTheme } from '@/hooks/use-theme';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { filterCredentials } from '@/services/credential-search';
import { computeHealthMetrics } from '@/services/health-checks';
import { type Theme } from '@/theme';
import { useThemePresets } from '@/theme/presets';

/** Smoothly counts from 0 → target with an ease-out curve on mount. */
function useCountUp(target: number, durationMs = 700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const tick = () => {
      const progress = Math.min(1, (Date.now() - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const p = useThemePresets();
  const s = useMemo(() => makeStyles(theme), [theme]);
  const { showToast } = useToast();
  const { credentials } = useVault();
  const runLocked = useNavigationLock();
  const [query, setQuery] = useState('');
  const searched = query.trim().length > 0;

  const activeCredentials = useMemo(
    () => credentials.filter((credential) => !credential.isArchived),
    [credentials],
  );
  const health = useMemo(() => computeHealthMetrics(credentials), [credentials]);
  const weakIds = useMemo(() => new Set(health.weakIds), [health.weakIds]);
  const reusedIds = useMemo(() => new Set(health.reusedIds), [health.reusedIds]);
  const oldIds = useMemo(() => new Set(health.oldIds), [health.oldIds]);
  const alerts = health.weak + health.reused;
  const animatedScore = useCountUp(health.score);

  const categories = useMemo(
    () =>
      CREDENTIAL_CATEGORIES.map((category) => ({
        ...category,
        count: activeCredentials.filter((credential) => credential.category === category.id).length,
      })),
    [activeCredentials],
  );
  const visibleCredentials = useMemo(() => {
    if (searched) return filterCredentials(activeCredentials, query);
    return activeCredentials.slice(0, 3);
  }, [activeCredentials, query, searched]);

  function openCredential(id: string) {
    runLocked(() => router.push({ pathname: '/edit-credential', params: { id } }));
  }

  return (
    <View style={p.screen}>
      <AnimatedBlobs colors={[theme.colors.accent, theme.colors.accentAlt, theme.colors.info]} />

      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <View style={s.headerLeading}>
          <PressableScale
            accessibilityLabel="Open settings menu"
            hitSlop={12}
            onPress={() => router.push('/settings')}
            style={p.iconButton}>
            <Menu size={20} color={theme.colors.accent} strokeWidth={2} />
          </PressableScale>
          <Text style={s.wordmark}>SecureVault</Text>
        </View>
        <View style={s.headerActions}>
          <PressableScale
            accessibilityLabel="Notifications"
            hitSlop={12}
            onPress={() => showToast('No new notifications', 'info')}
            style={p.iconButton}>
            <Bell size={20} color={theme.colors.accent} strokeWidth={1.75} />
          </PressableScale>
          <PressableScale
            accessibilityLabel="Open settings"
            onPress={() => router.push('/settings')}
            style={p.avatarRing}>
            <LinearGradient
              colors={theme.gradients.accent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={p.avatarInner}>
              <User size={18} color={theme.colors.onAccent} strokeWidth={2} />
            </LinearGradient>
          </PressableScale>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[p.screenContent, { paddingBottom: insets.bottom + 130 }]}>
        <Animated.View entering={FadeInDown.duration(theme.motion.duration.cardExpand)}>
          <Text style={p.eyebrow}>WELCOME BACK</Text>
          <Text style={p.display}>Hello, SecureVault</Text>
          <Text style={[p.body, { marginTop: theme.spacing.xs + 2 }]}>
            Your digital assets are protected by cosmic encryption.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(theme.motion.duration.cardExpand).delay(40)}>
          <View style={[p.searchBar, { marginTop: theme.spacing.xl }]}>
            <Search size={18} color={theme.colors.textMuted} strokeWidth={1.75} />
            <TextInput
              accessibilityLabel="Search credentials"
              placeholder="Search passwords, keys, or folders"
              placeholderTextColor={theme.colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              style={p.searchInput}
            />
            {searched ? null : (
              <View style={p.chip}>
                <Text style={p.chipText}>⌘K</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {searched ? null : (
          <Animated.View
            entering={FadeInDown.duration(theme.motion.duration.cardExpand).delay(80)}
            style={s.statsRow}>
            <View style={s.statCol}>
              <Text style={p.statValue}>{activeCredentials.length}</Text>
              <Text style={p.statLabel}>Secured</Text>
            </View>
            <View style={p.divider} />
            <View style={s.statCol}>
              <Text style={[p.statValue, { color: theme.colors.success }]}>{animatedScore}%</Text>
              <Text style={p.statLabel}>Health</Text>
            </View>
            <View style={p.divider} />
            <View style={s.statCol}>
              <Text style={[p.statValue, { color: alerts > 0 ? theme.colors.warning : theme.colors.text }]}>
                {alerts}
              </Text>
              <Text style={p.statLabel}>Alerts</Text>
            </View>
          </Animated.View>
        )}

        {searched ? null : (
          <>
            <View style={[p.rowBetween, p.section]}>
              <Text style={p.sectionTitle}>MANAGE PASSWORDS</Text>
              <Pressable hitSlop={8} onPress={() => router.push('/vault')}>
                <Text style={p.sectionAction}>View All</Text>
              </Pressable>
            </View>

            <View style={s.grid}>
              {categories.map((category, index) => (
                <Animated.View
                  key={category.id}
                  entering={FadeInDown.duration(theme.motion.duration.cardExpand).delay(
                    120 + index * theme.motion.stagger.list,
                  )}
                  style={s.gridItem}>
                  <CategoryTile
                    label={category.pluralLabel}
                    count={category.count}
                    icon={category.icon}
                    onPress={() => router.push({ pathname: '/vault', params: { category: category.id } })}
                  />
                </Animated.View>
              ))}
            </View>
          </>
        )}

        <Text style={[p.sectionTitle, { marginTop: theme.layout.sectionSpacingLarge, marginBottom: theme.spacing.lg }]}>
          {searched ? 'SEARCH RESULTS' : 'RECENTLY USED'}
        </Text>
        <View style={s.recentList}>
          {visibleCredentials.length > 0 ? (
            visibleCredentials.map((credential, index) => (
              <Animated.View
                key={credential.id}
                entering={FadeInDown.duration(theme.motion.duration.cardExpand).delay(
                  index * theme.motion.stagger.list,
                )}>
                <CredentialRow
                  name={credential.website}
                  detail={credential.username || 'No username'}
                  icon={KeyRound}
                  accent={theme.colors.accent}
                  website={credential.website}
                  url={credential.url}
                  customLogoUri={credential.customLogoUri}
                  badges={{
                    weak: weakIds.has(credential.id),
                    reused: reusedIds.has(credential.id),
                    old: oldIds.has(credential.id),
                  }}
                  isFavorite={credential.isFavorite}
                  onPress={() => openCredential(credential.id)}
                />
              </Animated.View>
            ))
          ) : (
            <EmptyState
              icon={searched ? Search : KeyRound}
              title={searched ? 'No matches found' : 'Your vault is empty'}
              description={
                searched
                  ? 'No credentials match your search. Try a different keyword.'
                  : 'Tap the plus button to save your first credential.'
              }
            />
          )}
        </View>

        <Animated.View entering={FadeIn.duration(theme.motion.duration.navigation).delay(120)}>
          <PressableScale
            accessibilityLabel="View security health report"
            accessibilityHint={`${health.weak} weak and ${health.reused} reused passwords`}
            onPress={() => router.push('/health')}
            scaleTo={0.985}>
            <LinearGradient
              colors={theme.gradients.hero}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[p.heroCard, { marginTop: theme.layout.sectionSpacingLarge }]}>
              <View style={s.bannerHeader}>
                <View style={[p.iconButton, { backgroundColor: theme.glass.fillStrong }]}>
                  <ShieldCheck size={20} color={theme.colors.accent} strokeWidth={2} />
                </View>
                <Text style={p.heading}>Security Health</Text>
              </View>
              <Text style={p.body}>
                {alerts > 0
                  ? `${health.weak} weak and ${health.reused} reused passwords need attention.`
                  : 'All passwords look strong. Keep it up.'}
              </Text>
              <LinearGradient
                colors={theme.gradients.accent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={p.pillButton}>
                <Text style={p.pillButtonText}>{alerts > 0 ? 'Resolve Now' : 'View Report'}</Text>
                <ChevronRight size={16} color={theme.colors.onAccent} strokeWidth={2.5} />
              </LinearGradient>
            </LinearGradient>
          </PressableScale>
        </Animated.View>
      </ScrollView>

      <PressableScale
        accessibilityLabel="Add credential"
        onPress={() => runLocked(() => router.push('/add-credential'))}
        haptic
        style={[p.fab, { bottom: insets.bottom + 96 }]}>
        <LinearGradient
          colors={theme.gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={p.fabInner}>
          <Plus size={24} color={theme.colors.onAccent} strokeWidth={2.5} />
        </LinearGradient>
      </PressableScale>

      <BottomNav active="dashboard" />
    </View>
  );
}

interface CategoryTileProps {
  label: string;
  count: number;
  icon: LucideIcon;
  onPress: () => void;
}

function CategoryTile({ label, count, icon: Icon, onPress }: CategoryTileProps) {
  const theme = useTheme();
  const p = useThemePresets();
  const s = useMemo(() => makeStyles(theme), [theme]);
  return (
    <PressableScale accessibilityLabel={`${label}, ${count} items`} onPress={onPress} style={s.tile}>
      <View style={s.tileTop}>
        <LinearGradient
          colors={theme.gradients.glow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={p.medallion}>
          <Icon size={22} color={theme.colors.accent} strokeWidth={1.75} />
        </LinearGradient>
        <View style={p.countBadge}>
          <Text style={p.countBadgeText}>{count}</Text>
        </View>
      </View>
      <Text style={s.tileLabel}>{label}</Text>
      <Text style={s.tileSub}>{count === 1 ? '1 item' : `${count} items`}</Text>
    </PressableScale>
  );
}

/** Screen-specific layout that isn't part of the shared preset vocabulary. */
function makeStyles(t: Theme) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: t.layout.screenPadding,
      paddingBottom: t.spacing.md,
    },
    headerLeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
    wordmark: {
      ...t.typography.headingSerif,
      fontSize: 22,
      color: t.colors.accent,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: t.spacing.lg,
      paddingVertical: t.spacing.lg,
      borderRadius: t.radius.card,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
      ...t.shadows.sm,
    },
    statCol: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: t.spacing.lg,
      gap: t.spacing.lg,
    },
    gridItem: {
      width: '47%',
      flexGrow: 1,
    },
    tile: {
      minHeight: 120,
      borderRadius: t.radius.sheet,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
      padding: t.spacing.lg,
      justifyContent: 'space-between',
      gap: t.spacing.md,
      ...t.shadows.sm,
    },
    tileTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    tileLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: t.colors.text,
    },
    tileSub: {
      fontSize: 12,
      fontWeight: '500',
      color: t.colors.textMuted,
      marginTop: -t.spacing.sm,
    },
    recentList: {
      gap: t.spacing.md,
    },
    bannerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
  });
}
