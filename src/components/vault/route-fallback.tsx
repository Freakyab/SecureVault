import { Shield } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { VaultColors } from '@/constants/vault-theme';

/**
 * Dark loading screen shown by route guards while the vault hydrates. Using the
 * app background (instead of a bare `<View />`) prevents a white flash during
 * route transitions (BUG-014), and the branded spinner gives a polished loading
 * state instead of a blank frame (TASK-036 / Roadmap 5.3).
 */
export function RouteFallback() {
  return (
    <View style={styles.root}>
      <View style={styles.badge}>
        <Shield size={28} color={VaultColors.accent} strokeWidth={1.75} />
      </View>
      <ActivityIndicator color={VaultColors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: VaultColors.background,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.glassBackground,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
  },
});
