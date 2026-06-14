import { LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

interface IconTileProps {
  icon: LucideIcon;
  size?: number;
  iconSize?: number;
  color?: string;
  glow?: boolean;
}

/** Rounded glass tile with a soft glow behind a centered icon. */
export function IconTile({
  icon: Icon,
  size = 80,
  iconSize = 32,
  color,
  glow = true,
}: IconTileProps) {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const iconColor = color ?? c.heading;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {glow ? (
        <View
          pointerEvents="none"
          style={[
            styles.glow,
            { width: size * 1.2, height: size * 1.2, borderRadius: size },
          ]}
        />
      ) : null}
      <View style={[styles.tile, { width: size, height: size, borderRadius: size / 3.2 }]}>
        <Icon size={iconSize} color={iconColor} strokeWidth={1.75} />
      </View>
    </View>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    glow: {
      position: 'absolute',
      backgroundColor: c.accentSoft,
      opacity: 0.5,
    },
    tile: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.glassBackground,
      borderWidth: 1,
      borderColor: c.glassBorder,
    },
  });
}
