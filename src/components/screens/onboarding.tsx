import { Activity, LayoutGrid, LucideIcon, ShieldCheck } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconTile, PrimaryButton, ScreenBackground } from '@/components/vault';
import { VaultType } from '@/constants/vault-theme';
import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

interface Slide {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    icon: ShieldCheck,
    badge: 'ADVANCED SECURITY',
    title: 'Bank-Grade Security',
    description:
      'Your data is protected with AES-256 encryption and a zero-knowledge architecture only you can unlock.',
  },
  {
    icon: LayoutGrid,
    badge: 'SEAMLESS ORGANIZATION',
    title: 'Everything Organized',
    description:
      'Store passwords, payment cards, and secure notes together in one beautifully organized vault.',
  },
  {
    icon: Activity,
    badge: 'HEALTH & GENERATOR',
    title: 'Stay Protected',
    description:
      'Generate strong passwords and monitor your security health with real-time breach insights.',
  },
];

interface OnboardingScreenProps {
  onFinish?: () => void;
}

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  }

  function handleNext() {
    if (isLast) {
      onFinish?.();
      return;
    }
    scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
  }

  return (
    <ScreenBackground>
      <View style={[styles.skipRow, { paddingTop: insets.top + 12 }]}>
        <Pressable accessibilityRole="button" hitSlop={12} onPress={onFinish}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.carousel}>
        {SLIDES.map((slide) => (
          <View key={slide.title} style={[styles.slide, { width }]}>
            <IconTile icon={slide.icon} size={160} iconSize={72} color={c.accent} />
            <Text style={styles.badge}>{slide.badge}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {SLIDES.map((slide, dotIndex) => (
            <View
              key={slide.title}
              style={[styles.dot, dotIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        <PrimaryButton label={isLast ? 'GET STARTED' : 'NEXT'} onPress={handleNext} />

        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onFinish}>
            <Text style={styles.signInLink}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </ScreenBackground>
  );
}

function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({
  skipRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  skip: {
    fontSize: 14,
    fontWeight: '500',
    color: c.muted,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  badge: {
    ...VaultType.label,
    marginTop: 16,
    color: c.accent,
    opacity: 0.8,
  },
  title: {
    ...VaultType.title,
    color: c.heading,
    textAlign: 'center',
  },
  description: {
    ...VaultType.body,
    color: c.body,
    textAlign: 'center',
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: 20,
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 24,
    backgroundColor: c.accent,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  signInText: {
    fontSize: 14,
    color: c.muted,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
    color: c.accent,
  },
  });
}
