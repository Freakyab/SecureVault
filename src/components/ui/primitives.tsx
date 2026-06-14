import { ReactNode, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/theme';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

interface CardProps {
  children: ReactNode;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}

interface ProgressProps {
  value: number;
  max?: number;
}

interface ScreenProps {
  children: ReactNode;
  edges?: Edge[];
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
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
    buttonLabel: {
      ...theme.typography.label,
      color: theme.colors.onAccent,
      textTransform: 'uppercase',
    },
    buttonLabelSecondary: {
      color: theme.colors.text,
    },
    card: {
      borderRadius: theme.radius.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.xl,
    },
    cardElevated: {
      ...theme.shadows.card,
    },
    field: {
      gap: theme.spacing.sm,
    },
    label: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
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
    inputError: {
      borderColor: theme.colors.error,
    },
    error: {
      ...theme.typography.caption,
      color: theme.colors.error,
    },
    badge: {
      alignSelf: 'flex-start',
      borderRadius: theme.radius.chip,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.surfaceAlt,
    },
    badgeText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    progressTrack: {
      height: 8,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceAlt,
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: theme.colors.accent,
    },
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    screenPadded: {
      paddingHorizontal: theme.spacing.xl,
    },
  });
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const isSecondary = variant !== 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        (pressed || isDisabled) && styles.buttonDisabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isSecondary ? theme.colors.text : theme.colors.onAccent} />
      ) : (
        <Text style={[styles.buttonLabel, isSecondary && styles.buttonLabelSecondary]}>{children}</Text>
      )}
    </Pressable>
  );
}

export function Card({ children, elevated = false, style }: CardProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return <View style={[styles.card, elevated && styles.cardElevated, style]}>{children}</View>;
}

export function Input({ label, error, style, ...inputProps }: InputProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, error && styles.inputError, style]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const toneColor = {
    neutral: theme.colors.textSecondary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.error,
    info: theme.colors.info,
  }[tone];

  return (
    <View style={styles.badge}>
      <Text style={[styles.badgeText, { color: toneColor }]}>{children}</Text>
    </View>
  );
}

export function Progress({ value, max = 100 }: ProgressProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const ratio = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max));

  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max, now: value }} style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
    </View>
  );
}

export function Screen({ children, edges = ['top', 'bottom'], padded = true, style }: ScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <SafeAreaView edges={edges} style={[styles.screen, padded && styles.screenPadded, style]}>
      {children}
    </SafeAreaView>
  );
}
