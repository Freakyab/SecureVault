import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { VaultColors } from '@/constants/vault-theme';

interface ScreenBackgroundProps {
  children: ReactNode;
}

/**
 * Base dark canvas with the design's ambient aurora glows positioned in the
 * top-left and bottom-right corners.
 */
export function ScreenBackground({ children }: ScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={styles.auroraTopLeft} />
      <View pointerEvents="none" style={styles.auroraBottomRight} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: VaultColors.background,
  },
  auroraTopLeft: {
    position: 'absolute',
    top: -120,
    left: -60,
    width: 200,
    height: 360,
    borderRadius: 9999,
    backgroundColor: 'rgba(222,183,255,0.12)',
  },
  auroraBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: 220,
    height: 440,
    borderRadius: 9999,
    backgroundColor: 'rgba(123,44,191,0.18)',
  },
});
