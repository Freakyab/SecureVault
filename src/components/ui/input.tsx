import { ReactNode, useState, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.xs,
    },
    label: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    input: {
      minHeight: 52,
      borderRadius: theme.radius.button,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.lg,
      ...theme.typography.body,
    },
    inputFocus: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.surfaceAlt,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.error,
      marginLeft: 4,
    },
  });
}

export function Input({ label, error, style, containerStyle, ...inputProps }: InputProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          isFocused && styles.inputFocus,
          error && styles.inputError,
          style,
        ]}
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
