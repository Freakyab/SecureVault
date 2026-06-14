import { useRouter } from 'expo-router';
import { Copy, Minus, Plus, RefreshCw, ShieldCheck, Wand2 } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav, GlassCard, PrimaryButton, ScreenBackground, Toggle } from '@/components/vault';
import { VaultType } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';
import { useToast } from '@/contexts/toast-context';
import { useNavigationLock } from '@/hooks/use-navigation-lock';
import { copyToClipboard, hapticSuccess, hapticWarning } from '@/services/feedback';
import {
  DEFAULT_GENERATOR_OPTIONS,
  GeneratorOptions,
  generatePassword,
  scorePasswordStrength,
} from '@/services/password-generator';

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
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const strengthColor: Record<string, string> = {
    Weak: c.danger,
    Fair: c.warning,
    Strong: c.success,
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
      hapticWarning();
      showToast('Keep at least one character type on', 'info');
      return;
    }
    updateOptions({ [key]: !options[key] } as Partial<GeneratorOptions>);
  }

  async function handleCopy() {
    if (!password) return;
    await copyToClipboard(password);
    hapticSuccess();
    showToast('Password copied to clipboard', 'success');
  }

  function handleRegenerate() {
    if (noCharSet) {
      hapticWarning();
      showToast('Select at least one character type', 'info');
      return;
    }
    regenerate(options);
    hapticSuccess();
  }

  function handleSave() {
    if (!password) {
      hapticWarning();
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
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 120 },
        ]}>
        <View style={styles.headerRow}>
          <View style={styles.brandIcon}>
            <Wand2 size={20} color={c.accent} strokeWidth={2} />
          </View>
          <View>
            <Text style={styles.title}>Generator</Text>
            <Text style={styles.subtitle}>Create a strong, unique password</Text>
          </View>
        </View>

        <GlassCard style={styles.displayCard}>
          <Text style={styles.displayLabel}>GENERATED PASSWORD</Text>
          <Text style={styles.password} selectable numberOfLines={2}>
            {password || 'Select a character type'}
          </Text>
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
                <Copy size={18} color={c.accent} strokeWidth={2} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Regenerate password"
                hitSlop={8}
                onPress={handleRegenerate}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
                <RefreshCw size={18} color={c.accent} strokeWidth={2} />
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
              <Minus size={18} color={c.heading} strokeWidth={2.5} />
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
              <Plus size={18} color={c.heading} strokeWidth={2.5} />
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
          <PrimaryButton label="SAVE SECURE PASSWORD" onPress={handleSave} />
          <View style={styles.footerMeta}>
            <ShieldCheck size={12} color={c.placeholder} strokeWidth={1.75} />
            <Text style={styles.footerMetaText}>Generated on-device — nothing leaves your phone</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="generator" />
    </ScreenBackground>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.accentSoft,
    borderWidth: 1,
    borderColor: c.accent + '55',
  },
  title: {
    ...VaultType.title,
    color: c.heading,
  },
  subtitle: {
    fontSize: 14,
    color: c.muted,
    marginTop: 2,
  },
  displayCard: {
    marginTop: 24,
    gap: 16,
  },
  displayLabel: {
    ...VaultType.label,
    color: c.accent,
    opacity: 0.8,
  },
  password: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: c.heading,
  },
  displayActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  strengthRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  strengthTrack: {
    flex: 1,
    height: 6,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  strengthFill: {
    height: 6,
    borderRadius: 9999,
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 48,
  },
  iconButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.accentSoft,
  },
  pressed: {
    opacity: 0.8,
  },
  optionCard: {
    marginTop: 16,
    gap: 16,
  },
  lengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: c.heading,
  },
  lengthValue: {
    fontSize: 22,
    fontWeight: '700',
    color: c.accent,
  },
  lengthControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glassBackground,
  },
  lengthTrack: {
    flex: 1,
    height: 6,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  lengthFill: {
    height: 6,
    borderRadius: 9999,
    backgroundColor: c.accent,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    minWidth: 48,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: c.glassBorder,
    backgroundColor: c.glassBackground,
  },
  presetChipActive: {
    borderColor: c.accent,
    backgroundColor: c.accentSoft,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.muted,
  },
  presetTextActive: {
    color: c.accent,
  },
  divider: {
    height: 1,
    backgroundColor: c.glassBorder,
    marginVertical: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: c.heading,
  },
  toggleHint: {
    fontSize: 12,
    color: c.muted,
    marginTop: 2,
  },
  save: {
    marginTop: 28,
    gap: 16,
    alignItems: 'center',
  },
  footerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerMetaText: {
    fontSize: 12,
    fontWeight: '500',
    color: c.placeholder,
  },
  });
}
