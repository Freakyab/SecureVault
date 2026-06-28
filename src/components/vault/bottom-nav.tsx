import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Activity, LayoutGrid, LucideIcon, Settings, Shield, Wand2 } from 'lucide-react-native';
import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';

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

function makeStyles(t: Theme) {
  return StyleSheet.create({
    bar: {
      position: 'absolute',
      left: t.spacing.lg,
      right: t.spacing.lg,
      bottom: 0,
    },
    navFrame: {
      height: 66,
    },
    surface: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: t.radius.full,
      overflow: 'hidden',
      // iOS layers a BlurView behind a thin translucent tint; Android uses the
      // themed solid fill since blur there is costly and less reliable.
      backgroundColor: Platform.OS === 'ios' ? t.glass.fillStrong : t.colors.surface,
      borderWidth: 1,
      borderColor: t.glass.border,
    },
    row: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: t.spacing.sm,
    },
    item: {
      flex: 1,
      height: 66,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrap: {
      width: 44,
      height: 40,
      borderRadius: t.radius.button,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapActive: {
      width: 56,
      height: 56,
      borderRadius: t.radius.floating,
      borderWidth: 1.5,
      borderColor: t.glass.border,
      backgroundColor: t.colors.background,
      transform: [{ translateY: -18 }],
      shadowColor: t.colors.accentAlt,
      shadowOpacity: 0.55,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 10,
    },
  });
}

export function BottomNav({ active }: BottomNavProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: insets.bottom + theme.spacing.sm,
          paddingTop: 18,
        },
      ]}>
      <View style={styles.navFrame}>
        <View style={styles.surface}>
          {Platform.OS === 'ios' && (
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          )}
        </View>
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
              onPress={() => {
                if (!isActive) router.navigate(item.route);
              }}
              style={styles.item}>
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Icon
                  size={isActive ? 24 : 22}
                  color={isActive ? theme.colors.accent : theme.colors.textMuted}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </View>
            </Pressable>
          );
        })}
        </View>
      </View>
    </View>
  );
}
