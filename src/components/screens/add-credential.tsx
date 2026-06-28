import { useLocalSearchParams, useRouter } from 'expo-router';
import { Eye, EyeOff, Globe, RefreshCw } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Input } from '@/components/ui';
import { ScreenBackground, VaultHeader } from '@/components/vault';
import { CREDENTIAL_CATEGORIES, DEFAULT_CATEGORY } from '@/constants/categories';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import { generatePassword as generateSecurePassword } from '@/services/password-generator';
import { suggestCategory } from '@/services/ai-categorization';
import { type Theme } from '@/theme';

const QUICK_SITES = [
  { label: 'Google', url: 'https://google.com' },
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Apple', url: 'https://apple.com' },
];

function BoxedField({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

export function AddCredentialScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const haptics = useHaptics();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const params = useLocalSearchParams<{ password?: string }>();
  const { showToast } = useToast();
  const { addCredential } = useVault();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  // Prefill when arriving from the Generator's "Save secure password" CTA (3.15).
  const [password, setPassword] = useState(params.password ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  // AI Categorization: Debounce name/url changes to suggest a category.
  useEffect(() => {
    if (!name.trim() && !url.trim()) return;

    const timer = setTimeout(async () => {
      const suggestion = await suggestCategory(name, url);
      if (suggestion && suggestion !== category) {
        setCategory(suggestion);
        haptics.selection();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [name, url]);

  function applyQuickSite(site: (typeof QUICK_SITES)[number]) {
    haptics.selection();
    setName(site.label);
    setUrl(site.url);
  }

  function generatePassword() {
    haptics.success();
    setPassword(generateSecurePassword());
    showToast('Strong password generated', 'info');
  }

  async function handleSave() {
    if (!name.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Website, username, and password are required.');
      haptics.warning();
      return;
    }

    try {
      await addCredential({
        website: name,
        url,
        username,
        password,
        category,
      });
      haptics.success();
      showToast(`${name.trim()} saved to vault`, 'success');
      router.replace('/vault');
    } catch (error) {
      haptics.warning();
      Alert.alert(
        'Could not save credential',
        error instanceof Error ? error.message : 'Please unlock your vault and try again.',
      );
    }
  }

  return (
    <ScreenBackground>
      <VaultHeader title="Add Credential" showBack onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={styles.eyebrow}>QUICK SITE</Text>
        <View style={styles.quickRow}>
          {QUICK_SITES.map((site) => (
            <Pressable
              key={site.label}
              accessibilityRole="button"
              accessibilityLabel={`Use ${site.label} website details`}
              onPress={() => applyQuickSite(site)}
              style={styles.quickChip}>
              <Globe size={16} color={theme.colors.accent} strokeWidth={1.75} />
              <Text style={styles.quickText}>{site.label}</Text>
            </Pressable>
          ))}
        </View>

        <Animated.View
          entering={FadeInDown.duration(theme.motion.duration.cardExpand)}
          style={styles.form}>
          <Input
            label="Website Name"
            placeholder="e.g. My Secure Portfolio"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="Website URL"
            placeholder="https://"
            value={url}
            onChangeText={setUrl}
          />
          <Input
            label="Username / Email"
            placeholder="you@email.com"
            value={username}
            onChangeText={setUsername}
          />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter or generate"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
              />
              <Pressable
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                hitSlop={8}
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.generate}>
                {showPassword ? (
                  <EyeOff size={18} color={theme.colors.accent} strokeWidth={2} />
                ) : (
                  <Eye size={18} color={theme.colors.accent} strokeWidth={2} />
                )}
              </Pressable>
              <Pressable
                accessibilityLabel="Generate password"
                hitSlop={8}
                onPress={generatePassword}
                style={styles.generate}>
                <RefreshCw size={18} color={theme.colors.accent} strokeWidth={2} />
              </Pressable>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {CREDENTIAL_CATEGORIES.map((item) => {
                const active = item.id === category;
                const Icon = item.icon;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Set category to ${item.label}`}
                    accessibilityState={{ selected: active }}
                    onPress={() => {
                      haptics.selection();
                      setCategory(item.id);
                    }}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}>
                    <Icon
                      size={16}
                      color={active ? theme.colors.accent : theme.colors.textMuted}
                      strokeWidth={1.75}
                    />
                    <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Animated.View>

        <View style={styles.save}>
          <Button onPress={handleSave}>SAVE CREDENTIAL</Button>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: t.layout.screenPadding,
      paddingTop: t.spacing.lg,
    },
    eyebrow: {
      ...t.typography.label,
      color: t.colors.accent,
      opacity: 0.8,
      marginBottom: t.spacing.md,
    },
    quickRow: {
      flexDirection: 'row',
      gap: t.spacing.sm + 2,
    },
    quickChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.sm + 2,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    quickText: {
      fontSize: 13,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.text,
    },
    form: {
      marginTop: t.spacing.xxl,
      gap: t.spacing.xl,
    },
    field: {
      gap: t.spacing.sm,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: t.fontWeight.semibold,
      letterSpacing: 0.4,
      color: t.colors.textMuted,
    },
    input: {
      height: 52,
      paddingHorizontal: t.spacing.lg,
      borderRadius: t.radius.button,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
      fontSize: 15,
      color: t.colors.text,
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      height: 52,
      paddingHorizontal: t.spacing.lg,
      borderRadius: t.radius.button,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    passwordInput: {
      flex: 1,
      fontSize: 15,
      color: t.colors.text,
      padding: 0,
    },
    generate: {
      width: 32,
      height: 32,
      borderRadius: t.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.accentSoft,
    },
    categoryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.sm + 2,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.sm + 2,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: t.glass.border,
      backgroundColor: t.glass.fill,
    },
    categoryChipActive: {
      borderColor: t.colors.accent,
      backgroundColor: t.colors.accentSoft,
    },
    categoryText: {
      fontSize: 13,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textMuted,
    },
    categoryTextActive: {
      color: t.colors.accent,
    },
    save: {
      marginTop: t.spacing.xxxl,
    },
  });
}
