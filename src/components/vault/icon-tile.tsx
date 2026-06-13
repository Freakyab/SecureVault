import { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { VaultColors } from '@/constants/vault-theme';

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
  color = VaultColors.heading,
  glow = true,
}: IconTileProps) {
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
        <Icon size={iconSize} color={color} strokeWidth={1.75} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(123,44,191,0.4)',
    opacity: 0.5,
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.glassBackground,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
  },
});
