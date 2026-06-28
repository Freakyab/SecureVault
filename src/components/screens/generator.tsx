import { useRouter } from 'expo-router';
import { Copy, Minus, Plus, RefreshCw, ShieldCheck, Wand2 } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav, ScreenBackground } from '@/components/vault';
import { GlassCard, Button, Toggle } from '@/components/ui';
import { useToast } from '@/contexts/toast-context';
import { useHaptics } from '@/hooks/use-haptics';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { useTheme } from '@/hooks/use-theme';
import { copyToClipboard } from '@/services/feedback';
import {
  DEFAULT_GENERATOR_OPTIONS,
  GeneratorOptions,
  generatePassword,
  scorePasswordStrength,
} from '@/services/password-generator';
import { type Theme } from '@/theme';

const MIN_LENGTH = 8;
const MAX_LENGTH = 48;
const LENGTH_PRESETS = [12, 16, 20, 24, 32];

type CharOption = Exclude<keyof GeneratorOptions, 'length'>;

const CHAR_OPTIONS: { key: CharOption; label: string; hint: string }[] = [
  { key: 'uppercase', label: 'Uppercase', hint: 'A–Z' },
  { key: 'lowercase', label: 'Lowercase', hint: 'a–z' },
  { key: 'numbers', label: 'Numbers', hint: '0–9' },
  { key: 'symbols', label: 'Symbols', hint: '!@#$' },
];

export function GeneratorScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const strengthColor: Record<string, string> = {
    Weak: theme.colors.error,
    Fair: theme.colors.warning,
    Strong: theme.colors.success,
  };
  const router = useRouter();
  const { showToast } = useToast();
  const runLocked = useNavigationLock();
  const [options, setOptions] = useState<GeneratorOptions>({ ...DEFAULT_GENERATOR_OPTIONS });
  const [password, setPassword] = useState('');

  const regenerate = useCallback((next: GeneratorOptions) => {
    try {
      setPassword(generatePassword(next));
    } catch {
      // No character set selected — leave the previous value and warn.
      setPassword('');
    }
  }, []);

  useEffect(() => {
    regenerate(DEFAULT_GENERATOR_OPTIONS);
  }, [regenerate]);

  const strength = useMemo(() => scorePasswordStrength(password), [password]);
  const noCharSet = !options.uppercase && !options.lowercase && !options.numbers && !options.symbols;

  function updateOptions(partial: Partial<GeneratorOptions>) {
    const next = { ...options, ...partial };
    setOptions(next);
    if (!next.uppercase && !next.lowercase && !next.numbers && !next.symbols) {
      setPassword('');
      return;
    }
    regenerate(next);
  }

  function setLength(length: number) {
    const clamped = Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, length));
    updateOptions({ length: clamped });
  }

  function toggleChar(key: CharOption) {
    const enabledCount = CHAR_OPTIONS.filter((option) => options[option.key]).length;
    // Keep at least one character set selected.
    if (options[key] && enabledCount <= 1) {
      haptics.warning();
      showToast('Keep at least one character type on', 'info');
      return;
    }
    haptics.selection();
    updateOptions({ [key]: !options[key] } as Partial<GeneratorOptions>);
  }

  async function handleCopy() {
    if (!password) return;
    await copyToClipboard(password);
    haptics.success();
    showToast('Password copied to clipboard', 'success');
  }

  function handleRegenerate() {
    if (noCharSet) {
      haptics.warning();
      showToast('Select at least one character type', 'info');
      return;
    }
    regenerate(options);
    haptics.success();
  }

  function handleSave() {
    if (!password) {
      haptics.warning();
      showToast('Generate a password first', 'info');
      return;
    }
    runLocked(() => router.push({ pathname: '/add-credential', params: { password } }));
  }

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + theme.spacing.xl, paddingBottom: insets.bottom + 120 },
        ]}>
        <View style={styles.headerRow}>
          <View style={styles.brandIcon}>
            <Wand2 size={20} color={theme.colors.accent} strokeWidth={2} />
          </View>
          <View>
            <Text style={styles.title}>Generator</Text>
            <Text style={styles.subtitle}>Create a strong, unique password</Text>
          </View>
        </View>

        <GlassCard style={styles.displayCard}>
          <Text style={styles.displayLabel}>GENERATED PASSWORD</Text>
          <Animated.Text
            key={password}
            entering={FadeIn.duration(theme.motion.duration.button)}
            style={styles.password}
            selectable
            numberOfLines={2}>
            {password || 'Select a character type'}
          </Animated.Text>
          <View style={styles.displayActions}>
            <View style={styles.strengthRow}>
              <View style={styles.strengthTrack}>
                <View
                  style={[
                    styles.strengthFill,
                    { width: `${strength.score}%`, backgroundColor: strengthColor[strength.label] },
                  ]}
                />
              </View>
              <Text style={[styles.strengthLabel, { color: strengthColor[strength.label] }]}>
                {strength.label}
              </Text>
            </View>
            <View style={styles.iconButtons}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Copy password"
                hitSlop={8}
                onPress={handleCopy}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
                <Copy size={18} color={theme.colors.accent} strokeWidth={2} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Regenerate password"
                hitSlop={8}
                onPress={handleRegenerate}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
                <RefreshCw size={18} color={theme.colors.accent} strokeWidth={2} />
              </Pressable>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.optionCard}>
          <View style={styles.lengthHeader}>
            <Text style={styles.optionTitle}>Length</Text>
            <Text style={styles.lengthValue}>{options.length}</Text>
          </View>
          <View style={styles.lengthControls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Decrease length"
              onPress={() => setLength(options.length - 1)}
              style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}>
              <Minus size={18} color={theme.colors.text} strokeWidth={2.5} />
            </Pressable>
            <View style={styles.lengthTrack}>
              <View
                style={[
                  styles.lengthFill,
                  {
                    width: `${((options.length - MIN_LENGTH) / (MAX_LENGTH - MIN_LENGTH)) * 100}%`,
                  },
                ]}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Increase length"
              onPress={() => setLength(options.length + 1)}
              style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}>
              <Plus size={18} color={theme.colors.text} strokeWidth={2.5} />
            </Pressable>
          </View>
          <View style={styles.presetRow}>
            {LENGTH_PRESETS.map((preset) => {
              const active = preset === options.length;
              return (
                <Pressable
                  key={preset}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Set length to ${preset}`}
                  onPress={() => setLength(preset)}
                  style={[styles.presetChip, active && styles.presetChipActive]}>
                  <Text style={[styles.presetText, active && styles.presetTextActive]}>{preset}</Text>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        <GlassCard style={styles.optionCard}>
          <Text style={styles.optionTitle}>Character Types</Text>
          {CHAR_OPTIONS.map((option, index) => (
            <View key={option.key}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.toggleRow}>
                <View>
                  <Text style={styles.toggleLabel}>{option.label}</Text>
                  <Text style={styles.toggleHint}>{option.hint}</Text>
                </View>
                <Toggle
                  value={options[option.key]}
                  onChange={() => toggleChar(option.key)}
                  label={option.label}
                />
              </View>
            </View>
          ))}
        </GlassCard>

        <View style={styles.save}>
          <Button onPress={handleSave}>SAVE SECURE PASSWORD</Button>
          <View style={styles.footerMeta}>
            <ShieldCheck size={12} color={theme.colors.textMuted} strokeWidth={1.75} />
            <Text style={styles.footerMetaText}>Generated on-device — nothing leaves your phone</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="generator" />
    </ScreenBackground>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: t.layout.screenPadding,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
    brandIcon: {
      width: 44,
      height: 44,
      borderRadius: t.radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.accentSoft,
      borderWidth: 1,
      borderColor: t.colors.accentSoft,
    },
    title: {
      ...t.typography.displaySerif,
      color: t.colors.text,
    },
    subtitle: {
      ...t.typography.caption,
      fontSize: 14,
      color: t.colors.textMuted,
      marginTop: 2,
    },
    displayCard: {
      marginTop: t.spacing.xl,
      gap: t.spacing.lg,
    },
    displayLabel: {
      ...t.typography.label,
      color: t.colors.accent,
      opacity: 0.8,
    },
    password: {
      ...t.typography.headingSerif,
      fontSize: 22,
      letterSpacing: 1.5,
      color: t.colors.text,
    },
    displayActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: t.spacing.lg,
    },
    strengthRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
    },
    strengthTrack: {
      flex: 1,
      height: 6,
      borderRadius: t.radius.full,
      backgroundColor: t.glass.fillStrong,
      overflow: 'hidden',
    },
    strengthFill: {
      height: 6,
      borderRadius: t.radius.full,
    },
    strengthLabel: {
      fontSize: 13,
      fontWeight: t.fontWeight.bold,
      minWidth: 48,
    },
    iconButtons: {
      flexDirection: 'row',
      gap: t.spacing.sm + 2,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.accentSoft,
    },
    pressed: {
      opacity: 0.8,
    },
    optionCard: {
      marginTop: t.spacing.lg,
      gap: t.spacing.lg,
    },
    lengthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionTitle: {
      ...t.typography.body,
      fontWeight: t.fontWeight.bold,
      color: t.colors.text,
    },
    lengthValue: {
      ...t.typography.headingSerif,
      fontSize: 22,
      color: t.colors.accent,
    },
    lengthControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.lg,
    },
    stepButton: {
      width: 40,
      height: 40,
      borderRadius: t.radius.chip,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    lengthTrack: {
      flex: 1,
      height: 6,
      borderRadius: t.radius.full,
      backgroundColor: t.glass.fillStrong,
      overflow: 'hidden',
    },
    lengthFill: {
      height: 6,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.accent,
    },
    presetRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.sm,
    },
    presetChip: {
      minWidth: 48,
      alignItems: 'center',
      paddingHorizontal: t.spacing.md + 2,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    presetChipActive: {
      borderColor: t.colors.accent,
      backgroundColor: t.colors.accentSoft,
    },
    presetText: {
      fontSize: 13,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    presetTextActive: {
      color: t.colors.accent,
    },
    divider: {
      height: 1,
      backgroundColor: t.glass.border,
      marginVertical: t.spacing.xs,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: t.spacing.xs + 2,
    },
    toggleLabel: {
      ...t.typography.body,
      fontSize: 15,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.text,
    },
    toggleHint: {
      ...t.typography.caption,
      fontSize: 12,
      color: t.colors.textMuted,
      marginTop: 2,
    },
    save: {
      marginTop: t.spacing.xxl,
      gap: t.spacing.lg,
      alignItems: 'center',
    },
    footerMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
    },
    footerMetaText: {
      ...t.typography.label,
      fontSize: 12,
      color: t.colors.textMuted,
    },
  });
}
