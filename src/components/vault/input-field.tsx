import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { VaultColors, VaultType } from '@/constants/vault-theme';

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  secureToggle?: boolean;
  leadingIcon?: LucideIcon;
}

export function InputField({ label, secureToggle = false, leadingIcon: LeadingIcon, ...inputProps }: InputFieldProps) {
  const [hidden, setHidden] = useState(secureToggle);

  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        {LeadingIcon ? <LeadingIcon size={20} color={VaultColors.body} strokeWidth={1.75} /> : null}
        <TextInput
          placeholderTextColor={VaultColors.placeholder}
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
              <Eye size={20} color={VaultColors.body} strokeWidth={1.75} />
            ) : (
              <EyeOff size={20} color={VaultColors.body} strokeWidth={1.75} />
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    ...VaultType.label,
    color: VaultColors.accent,
    opacity: 0.7,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: VaultColors.inputUnderline,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: VaultColors.heading,
    padding: 0,
  },
});
