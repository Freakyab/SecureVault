import { useRouter } from 'expo-router';
import { Inbox, KeyRound, Search, ShieldAlert } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CredentialRow, EmptyState, ScreenBackground, VaultHeader } from '@/components/vault';
import { CREDENTIAL_CATEGORIES } from '@/constants/categories';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useHaptics } from '@/hooks/use-haptics';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { useTheme } from '@/hooks/use-theme';
import { filterCredentials } from '@/services/credential-search';
import { copySensitiveToClipboard } from '@/services/feedback';
import { computeHealthMetrics } from '@/services/health-checks';
import { type Theme } from '@/theme';

const VIEW_OPTIONS = ['Active', 'Favorites', 'Archived'] as const;
const GROUP_OPTIONS = ['None', 'By site', 'Recent'] as const;

type ViewOption = (typeof VIEW_OPTIONS)[number];
type GroupOption = (typeof GROUP_OPTIONS)[number];

export function MyVaultScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const { showToast } = useToast();
  const runLocked = useNavigationLock();
  const { credentials, settings, toggleFavorite } = useVault();

  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewOption>('Active');
  const [category, setCategory] = useState<string>('All');
  const [groupBy, setGroupBy] = useState<GroupOption>('By site');

  const health = useMemo(
    () => computeHealthMetrics(credentials, Date.now(), { includeOldPasswords: settings.passwordAgeReminders }),
    [credentials, settings.passwordAgeReminders],
  );
  const weakIds = useMemo(() => new Set(health.weakIds), [health.weakIds]);
  const reusedIds = useMemo(() => new Set(health.reusedIds), [health.reusedIds]);
  const oldIds = useMemo(() => new Set(health.oldIds), [health.oldIds]);

  const categoryOptions = useMemo(() => ['All', ...CREDENTIAL_CATEGORIES.map((item) => item.id)], []);

  const viewCredentials = useMemo(() => {
    switch (view) {
      case 'Favorites':
        return credentials.filter((item) => item.isFavorite && !item.isArchived);
      case 'Archived':
        return credentials.filter((item) => item.isArchived);
      case 'Active':
      default:
        return credentials.filter((item) => !item.isArchived);
    }
  }, [credentials, view]);

  const filteredCredentials = useMemo(() => {
    const byCategory =
      category === 'All' ? viewCredentials : viewCredentials.filter((item) => item.category === category);
    return filterCredentials(byCategory, query);
  }, [viewCredentials, category, query]);

  const groupedCredentials = useMemo(() => {
    const sorted = [...filteredCredentials].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    if (groupBy === 'None') {
      return [{ title: 'All Accounts', count: sorted.length, items: sorted }];
    }

    if (groupBy === 'Recent') {
      const now = Date.now();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      const recent = sorted.filter((item) => now - new Date(item.updatedAt).getTime() <= sevenDaysMs);
      const older = sorted.filter((item) => now - new Date(item.updatedAt).getTime() > sevenDaysMs);
      return [
        { title: 'Updated This Week', count: recent.length, items: recent },
        { title: 'Older Entries', count: older.length, items: older },
      ].filter((group) => group.items.length > 0);
    }

    const bySite = new Map<string, typeof sorted>();
    sorted.forEach((item) => {
      const key = item.website.trim() || 'Unknown Site';
      const existing = bySite.get(key);
      if (existing) existing.push(item);
      else bySite.set(key, [item]);
    });

    return Array.from(bySite.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([title, items]) => ({ title, count: items.length, items }));
  }, [filteredCredentials, groupBy]);

  function selectChip<T extends string>(option: T, setter: (value: T) => void) {
    haptics.selection();
    setter(option);
  }

  function openCredential(id: string) {
    runLocked(() => router.push({ pathname: '/entry/[id]', params: { id } }));
  }

  async function copyPassword(password: string, website: string) {
    await copySensitiveToClipboard(password);
    haptics.success();
    showToast(`${website} password copied - clears in 30s`, 'success');
  }

  async function handleToggleFavorite(id: string, website: string, isFavorite: boolean) {
    await toggleFavorite(id);
    showToast(isFavorite ? `${website} removed from favorites` : `${website} added to favorites`, 'info');
  }

  function emptyMessage() {
    if (credentials.length === 0) return 'No credentials yet. Add one to start your vault.';
    if (query.trim()) return 'No credentials match this search.';
    if (view === 'Favorites') return 'No favorites yet. Star credentials to see them here.';
    if (view === 'Archived') return 'No archived credentials.';
    return 'No credentials found for this category.';
  }

  return (
    <ScreenBackground>
      <VaultHeader title="My Vault" showBack onBack={() => router.back()} showAvatar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + theme.spacing.xxl }]}>
        <View style={styles.search}>
          <Search size={18} color={theme.colors.textMuted} strokeWidth={1.75} />
          <TextInput
            placeholder="Search accounts..."
            placeholderTextColor={theme.colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.chipRow}>
          <Text style={styles.chipRowLabel}>View</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {VIEW_OPTIONS.map((option) => {
              const active = option === view;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => selectChip(option, setView)}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.chipRow}>
          <Text style={styles.chipRowLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {categoryOptions.map((option) => {
              const active = option === category;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => selectChip(option, setCategory)}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.chipRow}>
          <Text style={styles.chipRowLabel}>Group</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {GROUP_OPTIONS.map((option) => {
              const active = option === groupBy;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => selectChip(option, setGroupBy)}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View
          style={[
            styles.alert,
            { backgroundColor: theme.glass.fill, borderColor: theme.glass.border, borderRadius: theme.radius.card },
          ]}>
          <View style={styles.alertIcon}>
            <ShieldAlert size={18} color={theme.colors.warning} strokeWidth={2} />
          </View>
          <View style={styles.alertText}>
            <Text style={styles.alertTitle}>Action Recommended</Text>
            <Text style={styles.alertBody}>
              {health.weak + health.reused > 0
                ? `${health.weak + health.reused} accounts have weak or reused passwords.`
                : 'No weak or reused passwords detected.'}
            </Text>
          </View>
        </View>

        {filteredCredentials.length === 0 ? (
          <View style={styles.group}>
            <EmptyState
              icon={Inbox}
              title="Nothing here yet"
              description={emptyMessage()}
              actionLabel={credentials.length === 0 ? 'Add credential' : 'Open vault'}
              onAction={() => {
                if (credentials.length === 0) {
                  runLocked(() => router.push('/add-credential'));
                  return;
                }
                runLocked(() => router.push('/vault'));
              }}
            />
          </View>
        ) : (
          groupedCredentials.map((group, groupIndex) => (
            <View key={group.title} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                <Text style={styles.groupCount}>
                  {group.count} {group.count === 1 ? 'account' : 'accounts'}
                </Text>
              </View>
              <View style={styles.groupList}>
                {group.items.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInDown.duration(theme.motion.duration.cardExpand).delay(
                      (groupIndex * 2 + index) * theme.motion.stagger.list,
                    )}>
                    <CredentialRow
                      name={item.website || 'Untitled'}
                      detail={item.username || 'No username'}
                      icon={KeyRound}
                      accent={theme.colors.accent}
                      website={item.website}
                      url={item.url}
                      customLogoUri={item.customLogoUri}
                      badges={{
                        weak: weakIds.has(item.id),
                        reused: reusedIds.has(item.id),
                        old: oldIds.has(item.id),
                      }}
                      isFavorite={item.isFavorite}
                      onPress={() => openCredential(item.id)}
                      onCopy={() => copyPassword(item.password, item.website || 'Credential')}
                      onToggleFavorite={() => handleToggleFavorite(item.id, item.website, item.isFavorite)}
                    />
                  </Animated.View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: t.layout.screenPadding,
      paddingTop: t.spacing.lg,
    },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      height: 56,
      paddingHorizontal: t.spacing.lg,
      borderRadius: t.radius.card,
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
    chipRow: {
      marginTop: t.spacing.lg,
      gap: t.spacing.sm,
    },
    chipRowLabel: {
      ...t.typography.label,
      color: t.colors.textMuted,
    },
    chips: {
      gap: t.spacing.sm,
      paddingRight: t.spacing.sm,
    },
    chip: {
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    chipActive: {
      borderColor: t.colors.accent,
      backgroundColor: t.colors.accentSoft,
    },
    chipText: {
      fontSize: 13,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    chipTextActive: {
      color: t.colors.accent,
    },
    alert: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md + 2,
      marginTop: t.spacing.xl,
      borderColor: t.colors.warning + '4d',
      padding: t.spacing.md,
    },
    alertIcon: {
      width: 40,
      height: 40,
      borderRadius: t.radius.chip,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.warning + '26',
    },
    alertText: {
      flex: 1,
      gap: 2,
    },
    alertTitle: {
      ...t.typography.body,
      fontSize: 15,
      fontWeight: t.fontWeight.bold,
      color: t.colors.text,
    },
    alertBody: {
      ...t.typography.caption,
      color: t.colors.textSecondary,
    },
    group: {
      marginTop: t.spacing.xl,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: t.spacing.md,
      paddingHorizontal: t.spacing.sm,
    },
    groupTitle: {
      ...t.typography.body,
      fontWeight: t.fontWeight.bold,
      color: t.colors.text,
    },
    groupCount: {
      ...t.typography.caption,
      fontSize: 12,
      color: t.colors.textMuted,
    },
    groupList: {
      gap: t.spacing.md,
    },
  });
}
