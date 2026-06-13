import { useRouter } from 'expo-router';
import { Activity, LayoutGrid, LucideIcon, Settings, Shield } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VaultColors } from '@/constants/vault-theme';

export type VaultTab = 'dashboard' | 'vault' | 'health' | 'settings';

interface NavItem {
  key: VaultTab;
  icon: LucideIcon;
  route: '/dashboard' | '/vault' | '/health' | '/settings';
  label: string;
}

const ITEMS: NavItem[] = [
  { key: 'dashboard', icon: Shield, route: '/dashboard', label: 'Dashboard' },
  { key: 'vault', icon: LayoutGrid, route: '/vault', label: 'Vault' },
  { key: 'health', icon: Activity, route: '/health', label: 'Health' },
  { key: 'settings', icon: Settings, route: '/settings', label: 'Settings' },
];

interface BottomNavProps {
  active: VaultTab;
}

export function BottomNav({ active }: BottomNavProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
              <Icon
                size={22}
                color={isActive ? VaultColors.accent : VaultColors.muted}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              {isActive ? <View style={styles.activeDot} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(25,14,39,0.92)',
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    paddingHorizontal: 8,
  },
  item: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 9999,
    backgroundColor: VaultColors.accent,
  },
});
