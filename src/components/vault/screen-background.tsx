import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedBlobs } from '@/components/ui/animated-blobs';
import { VaultColors } from '@/constants/vault-theme';

interface ScreenBackgroundProps {
  children: ReactNode;
}

/** Violet blob palette matching the design's ambient aurora. */
const BLOB_COLORS = ['#deb7ff', VaultColors.accent, VaultColors.accentStrong] as const;

/**
 * Base dark canvas with slow-roaming ambient aurora blobs that bring the
 * background to life.
 */
export function ScreenBackground({ children }: ScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <AnimatedBlobs colors={BLOB_COLORS} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: VaultColors.background,
    overflow: 'hidden',
  },
});
