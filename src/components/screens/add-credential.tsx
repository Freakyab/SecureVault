import { useRouter } from 'expo-router';
import { CreditCard, Eye, EyeOff, FileText, Globe, KeyRound, RefreshCw } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton, ScreenBackground, VaultHeader } from '@/components/vault';
import { VaultColors, VaultType } from '@/constants/vault-theme';
import { useToast } from '@/contexts/toast-context';
import { useVault } from '@/contexts/vault-context';
import { hapticSuccess, hapticWarning } from '@/services/feedback';
import { generatePassword as generateSecurePassword } from '@/services/password-generator';

const QUICK_SITES = [
  { label: 'Google', url: 'https://google.com' },
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Apple', url: 'https://apple.com' },
];
const CATEGORIES = [
  { label: 'Login', icon: KeyRound },
  { label: 'Card', icon: CreditCard },
  { label: 'Note', icon: FileText },
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
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={VaultColors.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

export function AddCredentialScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const { addCredential } = useVault();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState('Login');

  function applyQuickSite(site: (typeof QUICK_SITES)[number]) {
    setName(site.label);
    setUrl(site.url);
  }

  function generatePassword() {
    setPassword(generateSecurePassword());
    showToast('Strong password generated', 'info');
  }

  async function handleSave() {
    if (!name.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Website, username, and password are required.');
      hapticWarning();
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
      hapticSuccess();
      showToast(`${name.trim()} saved to vault`, 'success');
      router.replace('/vault');
    } catch (error) {
      hapticWarning();
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
              <Globe size={16} color={VaultColors.accent} strokeWidth={1.75} />
              <Text style={styles.quickText}>{site.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.form}>
          <BoxedField
            label="Website Name"
            placeholder="e.g. My Secure Portfolio"
            value={name}
            onChangeText={setName}
          />
          <BoxedField label="Website URL" placeholder="https://" value={url} onChangeText={setUrl} />
          <BoxedField
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
                placeholderTextColor={VaultColors.placeholder}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
              />
              <Pressable
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                hitSlop={8}
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.generate}>
                {showPassword ? (
                  <EyeOff size={18} color={VaultColors.accent} strokeWidth={2} />
                ) : (
                  <Eye size={18} color={VaultColors.accent} strokeWidth={2} />
                )}
              </Pressable>
              <Pressable
                accessibilityLabel="Generate password"
                hitSlop={8}
                onPress={generatePassword}
                style={styles.generate}>
                <RefreshCw size={18} color={VaultColors.accent} strokeWidth={2} />
              </Pressable>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((item) => {
                const active = item.label === category;
                const Icon = item.icon;
                return (
                  <Pressable
                    key={item.label}
                    accessibilityRole="button"
                    accessibilityLabel={`Set category to ${item.label}`}
                    accessibilityState={{ selected: active }}
                    onPress={() => setCategory(item.label)}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}>
                    <Icon
                      size={16}
                      color={active ? VaultColors.accent : VaultColors.muted}
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
        </View>

        <View style={styles.save}>
          <PrimaryButton label="SAVE CREDENTIAL" onPress={handleSave} />
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  eyebrow: {
    ...VaultType.label,
    color: VaultColors.accent,
    opacity: 0.8,
    marginBottom: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  quickText: {
    fontSize: 13,
    fontWeight: '600',
    color: VaultColors.heading,
  },
  form: {
    marginTop: 32,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: VaultColors.muted,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
    fontSize: 15,
    color: VaultColors.heading,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: VaultColors.heading,
    padding: 0,
  },
  generate: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VaultColors.accentSoft,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
    backgroundColor: VaultColors.glassBackground,
  },
  categoryChipActive: {
    borderColor: VaultColors.accent,
    backgroundColor: VaultColors.accentSoft,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: VaultColors.muted,
  },
  categoryTextActive: {
    color: VaultColors.accent,
  },
  save: {
    marginTop: 40,
  },
});
