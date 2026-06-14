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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav, CredentialRow, EmptyState, GlassCard, ScreenBackground } from '@/components/vault';
import { CATEGORY_FILTERS, CREDENTIAL_CATEGORIES } from '@/constants/categories';
import { Fonts } from '@/constants/theme';
import { VaultType, vaultShadow } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { filterCredentials } from '@/services/credential-search';
import { copySensitiveToClipboard, hapticSuccess } from '@/services/feedback';
import { computeHealthMetrics } from '@/services/health-checks';

const VIEW_FILTERS = ['Active', 'Favorites', 'Archived'] as const;
type ViewFilter = (typeof VIEW_FILTERS)[number];

export function MainVaultScreen() {
  const insets = useSafeAreaInsets();
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
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
    showToast(`${website} password copied — clears in 30s`, 'success');
  }

  async function onToggleFavorite(id: string, website: string, isFavorite: boolean) {
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
          hapticSuccess();
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
            <Shield size={18} color={c.accent} strokeWidth={2} />
            <Text style={styles.brandWordmark}>SecureVault</Text>
          </View>
          <View style={styles.brandActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Export vault backup"
              hitSlop={10}
              onPress={() => router.push('/settings')}
              style={styles.brandIconButton}>
              <Upload size={18} color={c.heading} strokeWidth={1.75} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Import vault backup"
              hitSlop={10}
              onPress={() => router.push('/settings')}
              style={styles.brandIconButton}>
              <Download size={18} color={c.heading} strokeWidth={1.75} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              onPress={() => router.push('/settings')}
              style={styles.avatar}
            />
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
              colors={[c.accentStrong, c.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.newItemButton}>
              <Plus size={16} color={c.buttonText} strokeWidth={2.5} />
              <Text style={styles.newItemText}>NEW ITEM</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.search}>
          <Search size={17} color={c.muted} strokeWidth={1.75} />
          <TextInput
            placeholder="Search your vault..."
            placeholderTextColor={c.placeholder}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
        </View>

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
              color={isFilterPanelOpen || hasAdvancedFilters ? c.heading : c.muted}
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
                <AlertTriangle size={18} color={c.accent} strokeWidth={2} />
                <Text style={styles.alertEyebrow}>SECURITY PULSE</Text>
              </View>
              <Text style={styles.alertTitle}>Review {health.weak + health.reused} password risks</Text>
              <Text style={styles.alertBody}>
                {health.weak} weak and {health.reused} reused passwords need attention.
              </Text>
              <View style={styles.alertButton}>
                <Text style={styles.alertButtonText}>View Health</Text>
                <ArrowRight size={15} color={c.accent} strokeWidth={2.5} />
              </View>
            </GlassCard>
          </Pressable>
        ) : null}

        <GlassCard style={styles.statsCard}>
          <Text style={styles.statsEyebrow}>VAULT HEALTH</Text>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[c.accentStrong, c.accent]}
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
                {group.items.map((credential) => (
                  <CredentialRow
                    key={credential.id}
                    name={credential.website}
                    detail={credential.username || 'No username'}
                    icon={KeyRound}
                    accent={c.accent}
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

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Lock vault and return to unlock"
        onPress={handleLockVault}
        style={({ pressed }) => [styles.fab, { bottom: insets.bottom + 90 }, pressed && styles.pressed]}>
        <LinearGradient
          colors={[c.accentStrong, c.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabInner}>
          <Lock size={24} color={c.buttonText} strokeWidth={2.25} />
        </LinearGradient>
      </Pressable>

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

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandWordmark: {
    ...VaultType.brand,
    color: c.accent,
  },
  brandActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconButton: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.glassBackground,
    borderWidth: 1,
    borderColor: c.glassBorder,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    backgroundColor: c.avatarBackground,
    borderWidth: 1,
    borderColor: c.avatarBorder,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  headerLeading: {
    flexShrink: 1,
  },
  title: {
    ...VaultType.title,
    color: c.heading,
  },
  subtitle: {
    fontSize: 14,
    color: c.muted,
    marginTop: 2,
  },
  newItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  newItemText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: c.buttonText,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glassBackground,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: c.heading,
    padding: 0,
  },
  viewFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  viewChip: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glassBackground,
  },
  viewChipActive: {
    backgroundColor: c.accentStrong,
    borderColor: c.accentStrong,
  },
  viewChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.muted,
  },
  viewChipTextActive: {
    color: c.heading,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glassBackground,
  },
  filterToggleActive: {
    backgroundColor: c.accentSoft,
    borderColor: c.accent,
  },
  filterToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.muted,
  },
  filterToggleTextActive: {
    color: c.heading,
  },
  filterPanel: {
    marginTop: 12,
    padding: 16,
    borderRadius: 24,
    gap: 0,
  },
  filterPanelTitle: {
    ...VaultType.label,
    color: c.accent,
    opacity: 0.8,
  },
  filterPanelSectionTitle: {
    marginTop: 16,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glassBackground,
  },
  chipActive: {
    backgroundColor: c.accentSoft,
    borderColor: c.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.muted,
  },
  chipTextActive: {
    color: c.accent,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: 'transparent',
  },
  tagChipActive: {
    backgroundColor: c.accentStrong,
    borderColor: c.accentStrong,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: c.muted,
  },
  tagChipTextActive: {
    color: c.heading,
  },
  pressed: {
    opacity: 0.85,
  },
  alertCard: {
    marginTop: 24,
    gap: 10,
    borderColor: c.accent + '4d',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertEyebrow: {
    ...VaultType.label,
    color: c.accent,
  },
  alertTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    lineHeight: 30,
    color: c.heading,
  },
  alertBody: {
    fontSize: 14,
    lineHeight: 20,
    color: c.body,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: c.accent,
  },
  statsCard: {
    marginTop: 16,
    gap: 12,
  },
  statsEyebrow: {
    ...VaultType.label,
    color: c.accent,
    opacity: 0.8,
  },
  progressTrack: {
    height: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 9999,
  },
  statsValue: {
    fontFamily: Fonts.serif,
    fontSize: 44,
    lineHeight: 52,
    color: c.accent,
  },
  statsCaption: {
    fontSize: 14,
    color: c.body,
  },
  group: {
    marginTop: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  groupTitle: {
    ...VaultType.label,
    color: c.accent,
    opacity: 0.8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: c.glassBorder,
  },
  groupList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: c.body,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 9999,
    ...vaultShadow(c.accentStrong),
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  });
}
