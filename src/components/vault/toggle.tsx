import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

interface ToggleProps {
  value: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    track: {
      width: 48,
      height: 24,
      borderRadius: 9999,
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: 2,
      justifyContent: 'center',
    },
    trackOn: {
      backgroundColor: c.accentStrong,
    },
    trackDisabled: {
      opacity: 0.5,
    },
    knob: {
      width: 20,
      height: 20,
      borderRadius: 9999,
      backgroundColor: '#ffffff',
    },
    knobOn: {
      alignSelf: 'flex-end',
    },
  });
}

export function Toggle({ value, onChange, label = 'Toggle', disabled = false }: ToggleProps) {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onChange(!value)}
      style={[styles.track, value && styles.trackOn, disabled && styles.trackDisabled]}>
      <View style={[styles.knob, value && styles.knobOn]} />
    </Pressable>
  );
}
