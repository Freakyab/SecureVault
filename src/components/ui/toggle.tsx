import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';

interface ToggleProps {
  value: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
}

function makeStyles(t: Theme) {
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
      backgroundColor: t.colors.accent,
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
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

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
