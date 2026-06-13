import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CreditCard,
  FileText,
  KeyRound,
  Menu,
  Plus,
  Search,
  Server,
  User,
  Wifi,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav, CategoryCard, CredentialRow, EmptyState, ScreenBackground } from '@/components/vault';
import { VaultColors, VaultType, vaultShadow } from '@/constants/vault-theme';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { filterCredentials } from '@/services/credential-search';
import { copySensitiveToClipboard } from '@/services/feedback';
import { computeHealthMetrics } from '@/services/health-checks';

const CATEGORY_DEFS = [
  { label: 'Login', displayLabel: 'Logins', icon: KeyRound },
  { label: 'Card', displayLabel: 'Cards', icon: CreditCard },
  { label: 'Note', displayLabel: 'Notes', icon: FileText },
  { label: 'Identity', displayLabel: 'Identity', icon: User },
  { label: 'Wi-Fi', displayLabel: 'Wi-Fi', icon: Wifi },
  { label: 'API Keys', displayLabel: 'API Keys', icon: Server },
];

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const { credentials } = useVault();
  const runLocked = useNavigationLock();
  const [query, setQuery] = useState('');

  const activeCredentials = useMemo(
    () => credentials.filter((credential) => !credential.isArchived),
    [credentials],
  );
  const health = useMemo(() => computeHealthMetrics(credentials), [credentials]);
  const weakIds = useMemo(() => new Set(health.weakIds), [health.weakIds]);
  const reusedIds = useMemo(() => new Set(health.reusedIds), [health.reusedIds]);
  const oldIds = useMemo(() => new Set(health.oldIds), [health.oldIds]);
  const categories = useMemo(
    () =>
      CATEGORY_DEFS.map((category) => ({
        ...category,
        count: activeCredentials.filter((credential) => credential.category === category.label).length,
      })),
    [activeCredentials],
  );
  const visibleCredentials = useMemo(() => {
    if (query.trim()) return filterCredentials(activeCredentials, query);
    return activeCredentials.slice(0, 3);
  }, [activeCredentials, query]);

  function openCredential(id: string) {
    runLocked(() => router.push({ pathname: '/edit-credential', params: { id } }));
  }

  async function copyPassword(password: string, website: string) {
    await copySensitiveToClipboard(password);
    showToast(`${website} password copied — clears in 30s`, 'success');
  }

  return (
    <ScreenBackground>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeading}>
          <Pressable
            accessibilityLabel="Open settings menu"
            accessibilityRole="button"
            hitSlop={12}
            onPress={() => router.push('/settings')}
            style={styles.iconButton}>
            <Menu size={18} color={VaultColors.heading} strokeWidth={2} />
          </Pressable>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <Pressable
          accessibilityLabel="Open settings"
          accessibilityRole="button"
          onPress={() => router.push('/settings')}
          style={styles.avatar}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}>
        <Text style={styles.greeting}>Hello, SecureVault</Text>
        <Text style={styles.subGreeting}>Your digital assets are protected by cosmic encryption.</Text>

        <View style={styles.search}>
          <Search size={18} color={VaultColors.muted} strokeWidth={1.75} />
          <TextInput
            accessibilityLabel="Search credentials"
            placeholder="Search passwords, keys, or folders..."
            placeholderTextColor={VaultColors.placeholder}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
        </View>

        {query.trim() ? null : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>MANAGE PASSWORDS</Text>
              <Pressable hitSlop={8} onPress={() => router.push('/vault')}>
                <Text style={styles.sectionAction}>See all</Text>
              </Pressable>
            </View>

            <View style={styles.grid}>
              {categories.map((category) => (
                <View key={category.displayLabel} style={styles.gridItem}>
                  <CategoryCard
                    label={category.displayLabel}
                    count={category.count}
                    icon={category.icon}
                    onPress={() => router.push('/vault')}
                  />
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={[styles.sectionTitle, styles.recentTitle]}>
          {query.trim() ? 'SEARCH RESULTS' : 'RECENTLY USED'}
        </Text>
        <View style={styles.recentList}>
          {visibleCredentials.length > 0 ? (
            visibleCredentials.map((credential) => (
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
              />
            ))
          ) : (
            <EmptyState
              icon={query.trim() ? Search : KeyRound}
              title={query.trim() ? 'No matches found' : 'Your vault is empty'}
              description={
                query.trim()
                  ? 'No credentials match your search. Try a different keyword.'
                  : 'Tap the plus button to save your first credential.'
              }
            />
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View security health report"
          onPress={() => router.push('/health')}
          style={({ pressed }) => [pressed && styles.pressed]}>
          <LinearGradient
            colors={['rgba(123,44,191,0.35)', 'rgba(222,183,255,0.12)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}>
            <Text style={styles.bannerTitle}>Security Health</Text>
            <Text style={styles.bannerBody}>
              {health.weak} weak and {health.reused} reused passwords need attention. Review your
              health score.
            </Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Check Now</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      <Pressable
        accessibilityLabel="Add credential"
        onPress={() => runLocked(() => router.push('/add-credential'))}
        style={({ pressed }) => [styles.fab, { bottom: insets.bottom + 90 }, pressed && styles.pressed]}>
        <LinearGradient
          colors={[VaultColors.accentStrong, VaultColors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabInner}>
          <Plus size={22} color={VaultColors.buttonText} strokeWidth={2.5} />
        </LinearGradient>
      </Pressable>

      <BottomNav active="dashboard" />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...VaultType.title,
    fontSize: 22,
    color: VaultColors.heading,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    backgroundColor: VaultColors.avatarBackground,
    borderWidth: 1,
    borderColor: VaultColors.avatarBorder,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  greeting: {
    ...VaultType.title,
    color: VaultColors.heading,
  },
  subGreeting: {
    ...VaultType.body,
    marginTop: 6,
    color: VaultColors.body,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  sectionTitle: {
    ...VaultType.label,
    color: VaultColors.accent,
    opacity: 0.8,
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: '600',
    color: VaultColors.accent,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 16,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
  },
  recentTitle: {
    marginTop: 32,
    marginBottom: 16,
  },
  recentList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: VaultColors.body,
  },
  banner: {
    marginTop: 32,
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    gap: 12,
    overflow: 'hidden',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: VaultColors.heading,
  },
  bannerBody: {
    fontSize: 14,
    lineHeight: 20,
    color: VaultColors.body,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: VaultColors.heading,
  },
  bannerButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: VaultColors.buttonText,
  },
  pressed: {
    opacity: 0.85,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 9999,
    ...vaultShadow,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
