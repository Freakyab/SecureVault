import { ReactNode, useMemo } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { PressableScale } from './pressable-scale';
import { type Theme } from '@/theme';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<any>;
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    button: {
      minHeight: 52,
      borderRadius: theme.radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    buttonPrimary: {
      backgroundColor: theme.colors.accent,
    },
    buttonSecondary: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonGhost: {
      backgroundColor: 'transparent',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.onAccent,
      textAlign: 'center',
    },
    labelSecondary: {
      color: theme.colors.text,
    },
    labelGhost: {
      color: theme.colors.accent,
    },
  });
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const isDisabled = disabled || loading;

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        isDisabled && styles.buttonDisabled,
        style,
      ]}>
      {loading ? (
        <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary, variant === 'ghost' && styles.labelGhost]}>
          Loading...
        </Text>
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'secondary' && styles.labelSecondary,
            variant === 'ghost' && styles.labelGhost,
            textStyle,
          ]}>
          {children}
        </Text>
      )}
    </PressableScale>
  );
}
