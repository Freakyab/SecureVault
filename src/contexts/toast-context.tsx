import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, Info, type LucideIcon, TriangleAlert } from 'lucide-react-native';

import { VaultColors } from '@/constants/vault-theme';

type ToastTone = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICON: Record<ToastTone, LucideIcon> = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
};

const TONE_COLOR: Record<ToastTone, string> = {
  success: VaultColors.success,
  error: VaultColors.danger,
  info: VaultColors.accent,
};

export function ToastProvider({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setToast({ message, tone });
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      ]).start();

      hideTimer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 20, duration: 220, useNativeDriver: true }),
        ]).start(() => setToast(null));
      }, 2200);
    },
    [opacity, translateY],
  );

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const Icon = toast ? TONE_ICON[toast.tone] : Info;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          accessibilityLiveRegion="polite"
          style={[
            styles.toast,
            { bottom: insets.bottom + 96, opacity, transform: [{ translateY }] },
          ]}>
          <Icon size={18} color={TONE_COLOR[toast.tone]} strokeWidth={2} />
          <Text style={styles.message} numberOfLines={2}>
            {toast.message}
          </Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider.');
  return context;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(33,20,52,0.97)',
    borderWidth: 1,
    borderColor: VaultColors.glassBorder,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: VaultColors.heading,
  },
});
