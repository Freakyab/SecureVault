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
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedBlobs } from '@/components/ui/animated-blobs';
import { IconTile } from '@/components/vault';
import { Button } from '@/components/ui';
import { useColorTheme } from '@/contexts/color-theme-context';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import { type Theme } from '@/theme';
import { COLOR_THEMES } from '@/theme/color-themes';
import { useThemePresets } from '@/theme/presets';

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
  const theme = useTheme();
  const p = useThemePresets();
  const haptics = useHaptics();
  const { colorThemeId } = useColorTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  }

  function finish() {
    haptics.success();
    onFinish?.();
  }

  function handleNext() {
    if (isLast) {
      finish();
      return;
    }
    haptics.selection();
    scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
  }

  return (
    <View style={p.screen}>
      <AnimatedBlobs colors={COLOR_THEMES[colorThemeId].blob} />

      <View style={[styles.skipRow, { paddingTop: insets.top + 12 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding and set up vault"
          hitSlop={12}
          onPress={finish}>
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
            <IconTile icon={slide.icon} size={160} iconSize={72} color={theme.colors.accent} />
            <Animated.Text
              entering={FadeIn.duration(theme.motion.duration.cardExpand)}
              style={styles.badge}>
              {slide.badge}
            </Animated.Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing.xl }]}>
        <View style={styles.dots}>
          {SLIDES.map((slide, dotIndex) => (
            <View
              key={slide.title}
              style={[styles.dot, dotIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        <Button onPress={handleNext}>
          {isLast ? 'GET STARTED' : 'NEXT'}
        </Button>

        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign in or continue to vault setup"
            hitSlop={8}
            onPress={finish}>
            <Text style={styles.signInLink}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function makeStyles(t: Theme) {
  return StyleSheet.create({
    skipRow: {
      alignItems: 'flex-end',
      paddingHorizontal: t.layout.screenPadding,
      paddingBottom: t.spacing.sm,
    },
    skip: {
      ...t.typography.body,
      fontSize: 14,
      fontWeight: t.fontWeight.medium,
      color: t.colors.textMuted,
    },
    carousel: {
      flex: 1,
    },
    slide: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: t.spacing.xxl,
      gap: t.spacing.lg,
    },
    badge: {
      ...t.typography.label,
      letterSpacing: 2,
      marginTop: t.spacing.lg,
      color: t.colors.accent,
      opacity: 0.8,
    },
    title: {
      ...t.typography.displaySerif,
      color: t.colors.text,
      textAlign: 'center',
    },
    description: {
      ...t.typography.body,
      color: t.colors.textSecondary,
      textAlign: 'center',
      maxWidth: 320,
    },
    footer: {
      paddingHorizontal: t.layout.screenPadding,
      gap: t.spacing.xl,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: t.spacing.sm,
    },
    dot: {
      width: t.spacing.sm,
      height: t.spacing.sm,
      borderRadius: t.radius.full,
      backgroundColor: t.glass.border,
    },
    dotActive: {
      width: t.spacing.xl,
      backgroundColor: t.colors.accent,
    },
    signInRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: t.spacing.xs + 2,
    },
    signInText: {
      ...t.typography.body,
      fontSize: 14,
      color: t.colors.textMuted,
    },
    signInLink: {
      ...t.typography.body,
      fontSize: 14,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.accent,
    },
  });
}
