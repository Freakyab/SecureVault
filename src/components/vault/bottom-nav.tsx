import { useRouter } from 'expo-router';
import { Activity, LayoutGrid, LucideIcon, Settings, Shield, Wand2 } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

export type VaultTab = 'dashboard' | 'vault' | 'generator' | 'health' | 'settings';

interface NavItem {
  key: VaultTab;
  icon: LucideIcon;
  route: '/dashboard' | '/vault' | '/generator' | '/health' | '/settings';
  label: string;
}

const ITEMS: NavItem[] = [
  { key: 'dashboard', icon: Shield, route: '/dashboard', label: 'Dashboard' },
  { key: 'vault', icon: LayoutGrid, route: '/vault', label: 'Vault' },
  { key: 'generator', icon: Wand2, route: '/generator', label: 'Generator' },
  { key: 'health', icon: Activity, route: '/health', label: 'Health' },
  { key: 'settings', icon: Settings, route: '/settings', label: 'Settings' },
];

interface BottomNavProps {
  active: VaultTab;
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    bar: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 66,
      borderRadius: 9999,
      backgroundColor: c.headerBackground,
      borderWidth: 1,
      borderColor: c.glassBorder,
      paddingHorizontal: 8,
    },
    item: {
      flex: 1,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrap: {
      width: 44,
      height: 40,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapActive: {
      backgroundColor: c.accentStrong,
    },
  });
}

export function BottomNav({ active }: BottomNavProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.row}>
        {ITEMS.map((item) => {
          const isActive = item.key === active;
          const Icon = item.icon;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
              onPress={() => router.replace(item.route)}
              style={styles.item}>
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Icon
                  size={22}
                  color={isActive ? c.heading : c.muted}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
