import { ReactNode, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedBlobs } from '@/components/ui/animated-blobs';
import { useColorTheme } from '@/contexts/color-theme-context';
import { COLOR_THEMES } from '@/theme/color-themes';

interface ScreenBackgroundProps {
  children: ReactNode;
}

/**
 * Base dark canvas with slow-roaming ambient aurora blobs.
 * Blob palette follows the active color theme (blue / purple / gold).
 */
export function ScreenBackground({ children }: ScreenBackgroundProps) {
  const { colorThemeId, vaultColors } = useColorTheme();
  const blobColors = COLOR_THEMES[colorThemeId].blob;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: vaultColors.background,
          overflow: 'hidden',
        },
      }),
    [vaultColors.background],
  );

  return (
    <View style={styles.root}>
      <AnimatedBlobs colors={blobColors} />
      {children}
    </View>
  );
}
