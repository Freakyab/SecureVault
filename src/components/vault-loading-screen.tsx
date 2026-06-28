import { View, StyleSheet } from 'react-native';
import { AnimatedIcon } from '@/components/animated-icon';
import { useVaultColors } from '@/contexts/color-theme-context';

/**
 * A full-screen loading indicator shown while the vault is hydrating from storage.
 * Uses the current vault theme colors for a seamless transition.
 */
export function VaultLoadingScreen() {
  const colors = useVaultColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(StyleSheet.absoluteFill as any),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
});
