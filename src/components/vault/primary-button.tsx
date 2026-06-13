import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { VaultColors, vaultShadow } from '@/constants/vault-theme';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

/** Gradient pill CTA used as the primary action across screens. */
export function PrimaryButton({ label, onPress, icon: Icon, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed, disabled && styles.disabled]}>
      <LinearGradient
        colors={[VaultColors.accentStrong, VaultColors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}>
        <Text style={styles.label}>{label}</Text>
        {Icon ? <Icon size={14} color={VaultColors.buttonText} strokeWidth={2.5} /> : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 9999,
    ...vaultShadow,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  button: {
    height: 56,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: VaultColors.buttonText,
  },
});
