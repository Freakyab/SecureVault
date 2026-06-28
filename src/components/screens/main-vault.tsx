import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertTriangle,
  ArrowRight,
  Download,
  Inbox,
  KeyRound,
  Lock,
  Plus,
  Search,
  Shield,
  SlidersHorizontal,
  Upload,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale, GlassCard, Input } from '@/components/ui';
import { BottomNav, CredentialRow, EmptyState, ScreenBackground } from '@/components/vault';
import { CATEGORY_FILTERS, CREDENTIAL_CATEGORIES } from '@/constants/categories';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useHaptics } from '@/hooks/use-haptics';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { useTheme } from '@/hooks/use-theme';
import { filterCredentials } from '@/services/credential-search';
import { copySensitiveToClipboard } from '@/services/feedback';
import { computeHealthMetrics } from '@/services/health-checks';
import { type Theme } from '@/theme';

const VIEW_FILTERS = ['Active', 'Favorites', 'Archived'] as const;
type ViewFilter = (typeof VIEW_FILTERS)[number];

export function MainVaultScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { credentials, toggleFavorite, lockVault } = useVault();
  const { showToast } = useToast();
  const runLocked = useNavigationLock();
  const [view, setView] = useState<ViewFilter>('Active');
  const [category, setCategory] = useState(
    params.category && CATEGORY_FILTERS.includes(params.category) ? params.category : 'All',
  );
  const [folderTag, setFolderTag] = useState('All');
  const [query, setQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const health = useMemo(() => computeHealthMetrics(credentials), [credentials]);
  const weakIds = useMemo(() => new Set(health.weakIds), [health.weakIds]);
  const reusedIds = useMemo(() => new Set(health.reusedIds), [health.reusedIds]);
  const oldIds = useMemo(() => new Set(health.oldIds), [health.oldIds]);

  const viewCredentials = useMemo(() => {
    switch (view) {
      case 'Favorites':
        return credentials.filter((credential) => credential.isFavorite && !credential.isArchived);
      case 'Archived':
        return credentials.filter((credential) => credential.isArchived);
      case 'Active':
      default:
        return credentials.filter((credential) => !credential.isArchived);
    }
  }, [credentials, view]);

  // Folders + tags the user has actually assigned, surfaced as quick filters.
  const folderTagFilters = useMemo(() => {
    const values = new Set<string>();
    viewCredentials.forEach((credential) => {
      if (credential.folder?.trim()) values.add(credential.folder.trim());
      (credential.tags ?? []).forEach((tag) => tag.trim() && values.add(tag.trim()));
    });
    return ['All', ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [viewCredentials]);

  const filteredCredentials = useMemo(() => {
    const byCategory =
      category === 'All'
        ? viewCredentials
        : viewCredentials.filter((credential) => credential.category === category);
    const byFolderTag =
      folderTag === 'All'
        ? byCategory
        : byCategory.filter(
            (credential) =>
              credential.folder?.trim() === folderTag ||
              (credential.tags ?? []).some((tag) => tag.trim() === folderTag),
          );
    return filterCredentials(byFolderTag, query);
  }, [viewCredentials, category, folderTag, query]);

  // Group the filtered list by category, ordered to match CREDENTIAL_CATEGORIES,
  // so the vault reads as named sections (FINANCE, ENTERTAINMENT, …) like the design.
  const groupedCredentials = useMemo(() => {
    const order = CREDENTIAL_CATEGORIES.map((entry) => entry.id);
    const labelById = new Map(CREDENTIAL_CATEGORIES.map((entry) => [entry.id, entry.pluralLabel]));
    const buckets = new Map<string, typeof filteredCredentials>();
    filteredCredentials.forEach((credential) => {
      const key = credential.category?.trim() || 'Other';
      const bucket = buckets.get(key);
      if (bucket) bucket.push(credential);
      else buckets.set(key, [credential]);
    });
    return Array.from(buckets.keys())
      .sort((a, b) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
      })
      .map((key) => ({
        key,
        label: (labelById.get(key) ?? key).toUpperCase(),
        items: buckets.get(key) ?? [],
      }));
  }, [filteredCredentials]);

  const hasAlerts = health.weak > 0 || health.reused > 0;
  const hasAdvancedFilters = category !== 'All' || folderTag !== 'All';

  function openCredential(id: string) {
    runLocked(() => router.push({ pathname: '/entry/[id]', params: { id } }));
  }

  async function copyPassword(password: string, website: string) {
    await copySensitiveToClipboard(password);
    haptics.success();
    showToast(`${website} password copied — clears in 30s`, 'success');
  }

  async function onToggleFavorite(id: string, website: string, isFavorite: boolean) {
    haptics.selection();
    await toggleFavorite(id);
    showToast(isFavorite ? `${website} removed from favorites` : `${website} added to favorites`, 'info');
  }

  function clearFilters() {
    setQuery('');
    setCategory('All');
    setFolderTag('All');
    setView('Active');
  }

  function handleLockVault() {
    Alert.alert('Lock vault?', 'This clears the decrypted session and returns to unlock. Your encrypted vault stays on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Lock',
        style: 'destructive',
        onPress: () => {
          lockVault();
          haptics.success();
          showToast('Vault locked', 'info');
          router.replace('/unlock');
        },
      },
    ]);
  }

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 120 },
        ]}>
        <View style={styles.brandRow}>
          <View style={styles.brandLeading}>
            <Shield size={18} color={theme.colors.accent} strokeWidth={2} />
            <Text style={styles.brandWordmark}>SecureVault</Text>
          </View>
          <View style={styles.brandActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Export vault backup"
              hitSlop={10}
              onPress={() => {
                haptics.selection();
                showToast('Export feature coming soon', 'info');
              }}
              style={styles.brandIconButton}>
              <Upload size={18} color={theme.colors.text} strokeWidth={1.75} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Import vault backup"
              hitSlop={10}
              onPress={() => {
                haptics.selection();
                showToast('Import feature coming soon', 'info');
              }}
              style={styles.brandIconButton}>
              <Download size={18} color={theme.colors.text} strokeWidth={1.75} />
            </Pressable>
          </View>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.headerLeading}>
            <Text style={styles.title}>Main Vault</Text>
            <Text style={styles.subtitle}>{viewCredentials.length} Items Secured</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add new item"
            onPress={() => runLocked(() => router.push('/add-credential'))}
            style={({ pressed }) => pressed && styles.pressed}>
            <LinearGradient
            colors={[theme.colors.accentAlt, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.newItemButton}>
            <Plus size={16} color={theme.colors.onAccent} strokeWidth={2.5} />
              <Text style={styles.newItemText}>NEW ITEM</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <Input
          placeholder="Search your vault..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          containerStyle={{ marginTop: theme.spacing.xl }}
        />

        <View style={styles.viewFilters}>
          {VIEW_FILTERS.map((item) => {
            const active = item === view;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setView(item)}
                style={[styles.viewChip, active && styles.viewChipActive]}>
                <Text style={[styles.viewChipText, active && styles.viewChipTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFilterPanelOpen ? 'Hide vault filters' : 'Show vault filters'}
            accessibilityState={{ expanded: isFilterPanelOpen, selected: hasAdvancedFilters }}
            onPress={() => setIsFilterPanelOpen((open) => !open)}
            style={[
              styles.filterToggle,
              (isFilterPanelOpen || hasAdvancedFilters) && styles.filterToggleActive,
            ]}>
            <SlidersHorizontal
              size={15}
              color={isFilterPanelOpen || hasAdvancedFilters ? theme.colors.text : theme.colors.textMuted}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.filterToggleText,
                (isFilterPanelOpen || hasAdvancedFilters) && styles.filterToggleTextActive,
              ]}>
              Filter
            </Text>
          </Pressable>
        </View>

        {isFilterPanelOpen ? (
          <GlassCard style={styles.filterPanel}>
            <Text style={styles.filterPanelTitle}>Category</Text>
            <View style={styles.filters}>
              {CATEGORY_FILTERS.map((item) => {
                const active = item === category;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter by ${item} category`}
                    accessibilityState={{ selected: active }}
                    onPress={() => setCategory(item)}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>

            {folderTagFilters.length > 1 ? (
              <>
                <Text style={[styles.filterPanelTitle, styles.filterPanelSectionTitle]}>Folders & tags</Text>
                <View style={styles.filters}>
                  {folderTagFilters.map((item) => {
                    const active = item === folderTag;
                    return (
                      <Pressable
                        key={item}
                        accessibilityRole="button"
                        accessibilityLabel={item === 'All' ? 'Show all folders and tags' : `Filter by ${item}`}
                        accessibilityState={{ selected: active }}
                        onPress={() => setFolderTag(item)}
                        style={[styles.tagChip, active && styles.tagChipActive]}>
                        <Text style={[styles.tagChipText, active && styles.tagChipTextActive]}>
                          {item === 'All' ? 'All folders' : item}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : null}
          </GlassCard>
        ) : null}

        {hasAlerts && view !== 'Archived' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open password health report"
            onPress={() => router.push('/health')}
            style={({ pressed }) => pressed && styles.pressed}>
            <GlassCard style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <AlertTriangle size={18} color={theme.colors.accent} strokeWidth={2} />
                <Text style={styles.alertEyebrow}>SECURITY PULSE</Text>
              </View>
              <Text style={styles.alertTitle}>Review {health.weak + health.reused} password risks</Text>
              <Text style={styles.alertBody}>
                {health.weak} weak and {health.reused} reused passwords need attention.
              </Text>
              <View style={styles.alertButton}>
                <Text style={styles.alertButtonText}>View Health</Text>
                <ArrowRight size={15} color={theme.colors.accent} strokeWidth={2.5} />
              </View>
            </GlassCard>
          </Pressable>
        ) : null}

        <GlassCard style={styles.statsCard}>
          <Text style={styles.statsEyebrow}>VAULT HEALTH</Text>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[theme.colors.accentAlt, theme.colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${health.score}%` }]}
            />
          </View>
          <Text style={styles.statsValue}>{health.score}%</Text>
          <Text style={styles.statsCaption}>
            {credentials.length === 0
              ? 'Add your first credential to start tracking vault health.'
              : 'Health recalculates whenever you add or update credentials.'}
          </Text>
        </GlassCard>

        {filteredCredentials.length > 0 ? (
          groupedCredentials.map((group) => (
            <View key={group.key} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{group.label}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.groupList}>
                {group.items.map((credential, index) => (
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
                      onCopy={() => copyPassword(credential.password, credential.website)}
                      onToggleFavorite={() =>
                        onToggleFavorite(credential.id, credential.website, credential.isFavorite)
                      }
                    />
                  </Animated.View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.group}>
            <EmptyState
              icon={Inbox}
              title="Nothing here yet"
              description={emptyMessage(view, credentials.length, query)}
              actionLabel={credentials.length === 0 ? 'Add credential' : 'Clear filters'}
              onAction={() => {
                if (credentials.length === 0) {
                  runLocked(() => router.push('/add-credential'));
                  return;
                }
                clearFilters();
              }}
            />
          </View>
        )}
      </ScrollView>

      <PressableScale
        accessibilityLabel="Lock vault and return to unlock"
        onPress={handleLockVault}
        haptic
        style={[styles.fab, { bottom: insets.bottom + 90 }]}>
        <LinearGradient
          colors={[theme.colors.accentAlt, theme.colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabInner}>
          <Lock size={24} color={theme.colors.onAccent} strokeWidth={2.25} />
        </LinearGradient>
      </PressableScale>

      <BottomNav active="vault" />
    </ScreenBackground>
  );
}

function emptyMessage(view: ViewFilter, total: number, query: string): string {
  if (total === 0) return 'No credentials yet. Tap the plus button to save one.';
  if (query.trim()) return 'No credentials match this search.';
  if (view === 'Favorites') return 'No favorites yet. Tap the star on a credential to add one.';
  if (view === 'Archived') return 'No archived credentials.';
  return 'No active credentials in this category.';
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: t.layout.screenPadding,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    brandLeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
    },
    brandWordmark: {
      ...t.typography.headingSerif,
      fontSize: 24,
      color: t.colors.accent,
    },
    brandActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
    },
    brandIconButton: {
      width: 36,
      height: 36,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.glass.fill,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: t.spacing.xl,
    },
    headerLeading: {
      flexShrink: 1,
    },
    title: {
      ...t.typography.displaySerif,
      color: t.colors.text,
    },
    subtitle: {
      ...t.typography.caption,
      fontSize: 14,
      color: t.colors.textMuted,
      marginTop: 2,
    },
    newItemButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.lg + 2,
      paddingVertical: t.spacing.md,
      borderRadius: t.radius.full,
    },
    newItemText: {
      fontSize: 13,
      fontWeight: t.fontWeight.bold,
      letterSpacing: 0.6,
      color: t.colors.onAccent,
    },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      marginTop: t.spacing.xl,
      height: 50,
      paddingHorizontal: t.spacing.lg,
      borderRadius: t.radius.button,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: t.colors.text,
      padding: 0,
    },
    viewFilters: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: t.spacing.sm,
      marginTop: t.spacing.lg,
    },
    viewChip: {
      alignItems: 'center',
      paddingHorizontal: t.spacing.lg + 2,
      paddingVertical: t.spacing.sm + 2,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    viewChipActive: {
      backgroundColor: t.colors.accentAlt,
      borderColor: t.colors.accentAlt,
    },
    viewChipText: {
      fontSize: 13,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    viewChipTextActive: {
      color: t.colors.text,
    },
    filterToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.md + 2,
      paddingVertical: t.spacing.sm + 2,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    filterToggleActive: {
      backgroundColor: t.colors.accentSoft,
      borderColor: t.colors.accent,
    },
    filterToggleText: {
      fontSize: 13,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    filterToggleTextActive: {
      color: t.colors.text,
    },
    filterPanel: {
      marginTop: t.spacing.md,
      padding: t.spacing.lg,
      borderRadius: t.radius.sheet,
      gap: 0,
    },
    filterPanelTitle: {
      ...t.typography.label,
      color: t.colors.accent,
      opacity: 0.8,
    },
    filterPanelSectionTitle: {
      marginTop: t.spacing.lg,
    },
    filters: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.sm,
      marginTop: t.spacing.md,
    },
    chip: {
      paddingHorizontal: t.spacing.lg + 2,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    chipActive: {
      backgroundColor: t.colors.accentSoft,
      borderColor: t.colors.accent,
    },
    chipText: {
      fontSize: 13,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    chipTextActive: {
      color: t.colors.accent,
    },
    tagChip: {
      paddingHorizontal: t.spacing.md + 2,
      paddingVertical: t.spacing.xs + 2,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: 'transparent',
    },
    tagChipActive: {
      backgroundColor: t.colors.accentAlt,
      borderColor: t.colors.accentAlt,
    },
    tagChipText: {
      fontSize: 12,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    tagChipTextActive: {
      color: t.colors.text,
    },
    pressed: {
      opacity: 0.85,
    },
    alertCard: {
      marginTop: t.spacing.xl,
      gap: t.spacing.sm + 2,
      borderColor: t.colors.accentSoft,
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
    alertEyebrow: {
      ...t.typography.label,
      color: t.colors.accent,
    },
    alertTitle: {
      ...t.typography.headingSerif,
      color: t.colors.text,
    },
    alertBody: {
      ...t.typography.body,
      fontSize: 14,
      lineHeight: 20,
      color: t.colors.textSecondary,
    },
    alertButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.xs + 2,
      marginTop: t.spacing.xs,
    },
    alertButtonText: {
      fontSize: 14,
      fontWeight: t.fontWeight.bold,
      color: t.colors.accent,
    },
    statsCard: {
      marginTop: t.spacing.lg,
      gap: t.spacing.md,
    },
    statsEyebrow: {
      ...t.typography.label,
      color: t.colors.accent,
      opacity: 0.8,
    },
    progressTrack: {
      height: 4,
      borderRadius: t.radius.full,
      backgroundColor: t.glass.fillStrong,
      overflow: 'hidden',
    },
    progressFill: {
      height: 4,
      borderRadius: t.radius.full,
    },
    statsValue: {
      ...t.typography.displaySerif,
      fontSize: 44,
      lineHeight: 52,
      color: t.colors.accent,
    },
    statsCaption: {
      ...t.typography.body,
      fontSize: 14,
      color: t.colors.textSecondary,
    },
    group: {
      marginTop: t.spacing.xl,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.lg,
      marginBottom: t.spacing.lg,
    },
    groupTitle: {
      ...t.typography.label,
      color: t.colors.accent,
      opacity: 0.8,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: t.glass.border,
    },
    groupList: {
      gap: t.spacing.md,
    },
    fab: {
      position: 'absolute',
      right: t.spacing.xl,
      width: 56,
      height: 56,
      borderRadius: t.radius.full,
      ...t.shadows.lg,
    },
    fabInner: {
      width: 56,
      height: 56,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
