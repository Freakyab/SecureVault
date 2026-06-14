import { Shield } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

/**
 * Dark loading screen shown by route guards while the vault hydrates. Using the
 * app background (instead of a bare `<View />`) prevents a white flash during
 * route transitions (BUG-014), and the branded spinner gives a polished loading
 * state instead of a blank frame (TASK-036 / Roadmap 5.3).
 */
export function RouteFallback() {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={styles.root}>
      <View style={styles.badge}>
        <Shield size={28} color={c.accent} strokeWidth={1.75} />
      </View>
      <ActivityIndicator color={c.accent} />
    </View>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      backgroundColor: c.background,
    },
    badge: {
      width: 72,
      height: 72,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.glassBackground,
      borderWidth: 1,
      borderColor: c.glassBorder,
    },
  });
}
