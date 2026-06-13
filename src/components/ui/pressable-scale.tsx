import { ReactNode } from 'react';
import {
  type AccessibilityRole,
  type GestureResponderEvent,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { hapticSelection } from '@/services/feedback';
import { motion } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  /** Scale applied while pressed (default 0.97). */
  scaleTo?: number;
  /** Fire a light selection haptic on press in (default true). */
  haptic?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  hitSlop?: number;
}

/**
 * Premium tactile wrapper: scales down on press and springs back on release,
 * with an optional light haptic. Keeps press feedback consistent and under the
 * 350ms motion budget. Reusable base for buttons and pressable cards.
 */
export function PressableScale({
  children,
  onPress,
  style,
  disabled = false,
  scaleTo = 0.97,
  haptic = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  hitSlop,
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={hitSlop}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(scaleTo, { duration: motion.duration.tap });
        if (haptic) hapticSelection();
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.spring.press);
      }}
      style={[style, animatedStyle]}>
      {children}
    </AnimatedPressable>
  );
}
