import { Pressable, StyleSheet, View } from 'react-native';

import { VaultColors } from '@/constants/vault-theme';

interface ToggleProps {
  value: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}

export function Toggle({ value, onChange, label = 'Toggle' }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={8}
      onPress={() => onChange(!value)}
      style={[styles.track, value && styles.trackOn]}>
      <View style={[styles.knob, value && styles.knobOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 24,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 2,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: VaultColors.accentStrong,
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
