import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { VaultType } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  secureToggle?: boolean;
  leadingIcon?: LucideIcon;
}

export function InputField({ label, secureToggle = false, leadingIcon: LeadingIcon, ...inputProps }: InputFieldProps) {
  const [hidden, setHidden] = useState(secureToggle);
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        {LeadingIcon ? <LeadingIcon size={20} color={c.body} strokeWidth={1.75} /> : null}
        <TextInput
          placeholderTextColor={c.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={secureToggle ? hidden : inputProps.secureTextEntry}
          style={styles.input}
          {...inputProps}
        />
        {secureToggle ? (
          <Pressable
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={12}
            onPress={() => setHidden((prev) => !prev)}>
            {hidden ? (
              <Eye size={20} color={c.body} strokeWidth={1.75} />
            ) : (
              <EyeOff size={20} color={c.body} strokeWidth={1.75} />
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
    field: {
      gap: 8,
    },
    label: {
      ...VaultType.label,
      color: c.accent,
      opacity: 0.7,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.inputUnderline,
      paddingVertical: 8,
    },
    input: {
      flex: 1,
      fontSize: 18,
      color: c.heading,
      padding: 0,
    },
  });
}
