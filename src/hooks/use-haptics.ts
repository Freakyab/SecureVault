import * as Haptics from 'expo-haptics';
import { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';

async function safeHaptic(run: () => Promise<void>) {
  if (Platform.OS === 'web') return;

  try {
    await run();
  } catch {
    // Haptics are best-effort and may be disabled or unsupported on a device.
  }
}

export function useHaptics() {
  const impactLight = useCallback(() => {
    void safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  }, []);

  const impactSoft = useCallback(() => {
    void safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft));
  }, []);

  const selection = useCallback(() => {
    void safeHaptic(() => Haptics.selectionAsync());
  }, []);

  const success = useCallback(() => {
    void safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  }, []);

  const warning = useCallback(() => {
    void safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
  }, []);

  const error = useCallback(() => {
    void safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
  }, []);

  return useMemo(
    () => ({
      press: impactLight,
      impactLight,
      impactSoft,
      selection,
      success,
      warning,
      error,
      pullToRefresh: impactSoft,
      cardExpand: selection,
    }),
    [error, impactLight, impactSoft, selection, success, warning],
  );
}
