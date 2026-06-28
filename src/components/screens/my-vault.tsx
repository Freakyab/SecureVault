import { useRouter } from 'expo-router';
import { Globe, KeyRound, type LucideIcon, Search, ShieldAlert, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CredentialRow, ScreenBackground, VaultHeader } from '@/components/vault';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';

const CHIP_ROWS = [
  { key: 'view', label: 'View', options: ['List', 'Grid'] },
  { key: 'category', label: 'Category', options: ['All', 'Logins', 'Cards', 'Notes', 'Keys'] },
  { key: 'group', label: 'Group', options: ['None', 'By site', 'Recent'] },
];

interface GroupItem {
  name: string;
  detail: string;
  icon: LucideIcon;
  accent: 'success' | 'accent';
}

const GROUPS: { title: string; count: string; items: GroupItem[] }[] = [
  {
    title: 'Google',
    count: '3 accounts',
    items: [
      { name: 'Google Workspace', detail: 'alex@email.com', icon: Globe, accent: 'success' },
      { name: 'Gmail Personal', detail: 'alex.personal@gmail.com', icon: Sparkles, accent: 'accent' },
    ],
  },
  {
    title: 'Developer',
    count: '2 accounts',
    items: [{ name: 'GitHub', detail: 'alex_dev_aurora', icon: KeyRound, accent: 'accent' }],
  },
];

export function MyVaultScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, string>>({
    view: 'List',
    category: 'All',
    group: 'By site',
  });

  function selectChip(key: string, option: string) {
    haptics.selection();
    setSelected((prev) => ({ ...prev, [key]: option }));
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
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => selectChip(row.key, option)}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ))}

        <View style={[styles.alert, { backgroundColor: theme.glass.fill, borderColor: theme.glass.border, borderRadius: theme.radius.card }]}>
          <View style={styles.alertIcon}>
            <ShieldAlert size={18} color={theme.colors.warning} strokeWidth={2} />
          </View>
          <View style={styles.alertText}>
            <Text style={styles.alertTitle}>Action Recommended</Text>
            <Text style={styles.alertBody}>4 accounts have weak or reused passwords.</Text>
          </View>
        </View>

        {GROUPS.map((group, groupIndex) => (
          <View key={group.title} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <Text style={styles.groupCount}>{group.count}</Text>
            </View>
            <View style={styles.groupList}>
              {group.items.map((item, index) => (
                <Animated.View
                  key={item.name}
                  entering={FadeInDown.duration(theme.motion.duration.cardExpand).delay(
                    (groupIndex * 2 + index) * theme.motion.stagger.list,
                  )}>
                  <CredentialRow
                    name={item.name}
                    detail={item.detail}
                    icon={item.icon}
                    accent={item.accent === 'success' ? theme.colors.success : theme.colors.accent}
                    onPress={() => router.push('/vault')}
                  />
                </Animated.View>
              ))}
            </View>
          </View>
        ))}
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
