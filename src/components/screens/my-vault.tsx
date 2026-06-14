import { useRouter } from 'expo-router';
import { Globe, KeyRound, Search, ShieldAlert, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CredentialRow, GlassCard, ScreenBackground, VaultHeader } from '@/components/vault';
import { VaultType } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

const CHIP_ROWS = [
  { key: 'view', label: 'View', options: ['List', 'Grid'] },
  { key: 'category', label: 'Category', options: ['All', 'Logins', 'Cards', 'Notes', 'Keys'] },
  { key: 'group', label: 'Group', options: ['None', 'By site', 'Recent'] },
];

const GROUPS = [
  {
    title: 'Google',
    count: '3 accounts',
    items: [
      { name: 'Google Workspace', detail: 'alex@email.com', icon: Globe, accent: '#7ee0b8' },
      { name: 'Gmail Personal', detail: 'alex.personal@gmail.com', icon: Sparkles, accent: '#7FB0FF' },
    ],
  },
  {
    title: 'Developer',
    count: '2 accounts',
    items: [
      { name: 'GitHub', detail: 'alex_dev_aurora', icon: KeyRound, accent: '#7FB0FF' },
    ],
  },
];

export function MyVaultScreen() {
  const insets = useSafeAreaInsets();
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, string>>({
    view: 'List',
    category: 'All',
    group: 'By site',
  });

  return (
    <ScreenBackground>
      <VaultHeader title="My Vault" showBack onBack={() => router.back()} showAvatar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.search}>
          <Search size={18} color={c.muted} strokeWidth={1.75} />
          <TextInput
            placeholder="Search accounts..."
            placeholderTextColor={c.placeholder}
            style={styles.searchInput}
          />
        </View>

        {CHIP_ROWS.map((row) => (
          <View key={row.key} style={styles.chipRow}>
            <Text style={styles.chipRowLabel}>{row.label}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {row.options.map((option) => {
                const active = selected[row.key] === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setSelected((prev) => ({ ...prev, [row.key]: option }))}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ))}

        <GlassCard style={styles.alert}>
          <View style={styles.alertIcon}>
            <ShieldAlert size={18} color={c.warning} strokeWidth={2} />
          </View>
          <View style={styles.alertText}>
            <Text style={styles.alertTitle}>Action Recommended</Text>
            <Text style={styles.alertBody}>4 accounts have weak or reused passwords.</Text>
          </View>
        </GlassCard>

        {GROUPS.map((group) => (
          <View key={group.title} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <Text style={styles.groupCount}>{group.count}</Text>
            </View>
            <View style={styles.groupList}>
              {group.items.map((item) => (
                <CredentialRow
                  key={item.name}
                  name={item.name}
                  detail={item.detail}
                  icon={item.icon}
                  accent={item.accent}
                  onPress={() => router.push('/vault')}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 20,
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
  chipRow: {
    marginTop: 16,
    gap: 8,
  },
  chipRowLabel: {
    ...VaultType.label,
    fontSize: 11,
    color: c.muted,
  },
  chips: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glassBackground,
  },
  chipActive: {
    borderColor: c.accent,
    backgroundColor: c.accentSoft,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.muted,
  },
  chipTextActive: {
    color: c.accent,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 24,
    borderColor: 'rgba(255,212,121,0.3)',
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,212,121,0.15)',
  },
  alertText: {
    flex: 1,
    gap: 2,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: c.heading,
  },
  alertBody: {
    fontSize: 13,
    color: c.body,
  },
  group: {
    marginTop: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: c.heading,
  },
  groupCount: {
    fontSize: 12,
    color: c.muted,
  },
  groupList: {
    gap: 12,
  },
  });
}
