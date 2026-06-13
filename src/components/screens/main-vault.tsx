import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertTriangle,
  ArrowRight,
  Inbox,
  KeyRound,
  Search,
  Shield,
  SlidersHorizontal,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav, CredentialRow, EmptyState, GlassCard, ScreenBackground } from '@/components/vault';
import { VaultColors, VaultType } from '@/constants/vault-theme';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { filterCredentials } from '@/services/credential-search';
import { copySensitiveToClipboard } from '@/services/feedback';
import { computeHealthMetrics } from '@/services/health-checks';

const VIEW_FILTERS = ['Active', 'Favorites', 'Archived'] as const;
type ViewFilter = (typeof VIEW_FILTERS)[number];

const CATEGORY_FILTERS = ['All', 'Login', 'Card', 'Note', 'Identity'];

export function MainVaultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { credentials, toggleFavorite } = useVault();
  const { showToast } = useToast();
  const runLocked = useNavigationLock();
  const [view, setView] = useState<ViewFilter>('Active');
  const [category, setCategory] = useState('All');
  const [folderTag, setFolderTag] = useState('All');
  const [query, setQuery] = useState('');

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

  const hasAlerts = health.weak > 0 || health.reused > 0;

  function openCredential(id: string) {
    runLocked(() => router.push({ pathname: '/edit-credential', params: { id } }));
  }

  async function copyPassword(password: string, website: string) {
    await copySensitiveToClipboard(password);
    showToast(`${website} password copied — clears in 30s`, 'success');
  }

  async function onToggleFavorite(id: string, website: string, isFavorite: boolean) {
    await toggleFavorite(id);
    showToast(isFavorite ? `${website} removed from favorites` : `${website} added to favorites`, 'info');
  }

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 120 },
        ]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeading}>
            <View style={styles.brandIcon}>
              <Shield size={20} color={VaultColors.accent} strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.title}>Main Vault</Text>
              <Text style={styles.subtitle}>{viewCredentials.length} passwords</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sort credentials"
            style={styles.sortButton}>
            <SlidersHorizontal size={15} color={VaultColors.accent} strokeWidth={2} />
            <Text style={styles.sortText}>Sort by</Text>
          </Pressable>
        </View>

        <View style={styles.search}>
          <Search size={17} color={VaultColors.muted} strokeWidth={1.75} />
          <TextInput
            placeholder="Search your vault..."
            placeholderTextColor={VaultColors.placeholder}
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
        </View>

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
        ) : null}

        {hasAlerts && view !== 'Archived' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open password health report"
            onPress={() => router.push('/health')}
            style={({ pressed }) => pressed && styles.pressed}>
            <GlassCard style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <AlertTriangle size={18} color={VaultColors.danger} strokeWidth={2} />
                <Text style={styles.alertEyebrow}>SECURITY PULSE</Text>
              </View>
              <Text style={styles.alertTitle}>Review {health.weak + health.reused} password risks</Text>
              <Text style={styles.alertBody}>
                {health.weak} weak and {health.reused} reused passwords need attention.
              </Text>
              <View style={styles.alertButton}>
                <Text style={styles.alertButtonText}>View Health</Text>
                <ArrowRight size={15} color={VaultColors.danger} strokeWidth={2.5} />
              </View>
            </GlassCard>
          </Pressable>
        ) : null}

        <GlassCard style={styles.statsCard}>
          <Text style={styles.statsEyebrow}>VAULT HEALTH</Text>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[VaultColors.accentStrong, VaultColors.accent]}
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

        <View style={styles.group}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>{view.toUpperCase()} CREDENTIALS</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.groupList}>
            {filteredCredentials.length > 0 ? (
              filteredCredentials.map((credential) => (
                <CredentialRow
                  key={credential.id}
                  name={credential.website}
                  detail={credential.username || 'No username'}
                  icon={KeyRound}
                  accent={VaultColors.accent}
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
              ))
            ) : (
              <EmptyState icon={Inbox} title="Nothing here yet" description={emptyMessage(view, credentials.length, query)} />
            )}
          </View>
        </View>
      </ScrollView>

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

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.accentSoft,
    borderWidth: 1,
    borderColor: VaultColors.accent + '55',
  },
  title: {
    ...VaultType.title,
    color: VaultColors.heading,
  },
  subtitle: {
    fontSize: 14,
    color: VaultColors.muted,
    marginTop: 2,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    color: VaultColors.accent,
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
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: VaultColors.heading,
    padding: 0,
  },
  viewFilters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  viewChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  viewChipActive: {
    backgroundColor: VaultColors.accentStrong,
    borderColor: VaultColors.accentStrong,
  },
  viewChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: VaultColors.muted,
  },
  viewChipTextActive: {
    color: VaultColors.heading,
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
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  chipActive: {
    backgroundColor: VaultColors.accentSoft,
    borderColor: VaultColors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: VaultColors.muted,
  },
  chipTextActive: {
    color: VaultColors.accent,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: 'transparent',
  },
  tagChipActive: {
    backgroundColor: VaultColors.accentStrong,
    borderColor: VaultColors.accentStrong,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: VaultColors.muted,
  },
  tagChipTextActive: {
    color: VaultColors.heading,
  },
  pressed: {
    opacity: 0.85,
  },
  alertCard: {
    marginTop: 24,
    gap: 10,
    borderColor: 'rgba(255,138,138,0.3)',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertEyebrow: {
    ...VaultType.label,
    color: VaultColors.danger,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: VaultColors.heading,
  },
  alertBody: {
    fontSize: 14,
    lineHeight: 20,
    color: VaultColors.body,
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
    color: VaultColors.danger,
  },
  statsCard: {
    marginTop: 16,
    gap: 12,
  },
  statsEyebrow: {
    ...VaultType.label,
    color: VaultColors.accent,
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
    fontSize: 40,
    fontWeight: '700',
    color: VaultColors.heading,
  },
  statsCaption: {
    fontSize: 14,
    color: VaultColors.body,
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
    color: VaultColors.accent,
    opacity: 0.8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: VaultColors.glassBorder,
  },
  groupList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: VaultColors.body,
  },
});
