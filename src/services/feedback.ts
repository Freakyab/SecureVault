import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Haptics are best-effort: never let a missing module crash a user action. */
async function safeHaptic(run: () => Promise<void>) {
  if (Platform.OS === 'web') return;
  try {
    await run();
  } catch {
    // Ignore unsupported-device haptic errors.
  }
}

export function hapticSuccess() {
  void safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

export function hapticWarning() {
  void safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

export function hapticError() {
  void safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}

export function hapticSoft() {
  void safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft));
}

export function hapticSelection() {
  void safeHaptic(() => Haptics.selectionAsync());
}

export function hapticImpact() {
  void safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export async function copyToClipboard(value: string) {
  await Clipboard.setStringAsync(value);
  hapticSuccess();
}

/** Default window (ms) before a copied secret is wiped from the clipboard. */
export const CLIPBOARD_CLEAR_MS = 30_000;

let clearTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Copies a sensitive value (e.g. a password) and schedules an automatic
 * clipboard wipe so secrets do not linger after use. The clipboard is only
 * cleared if it still holds the copied value, to avoid clobbering whatever the
 * user copied next.
 */
export async function copySensitiveToClipboard(value: string, clearAfterMs = CLIPBOARD_CLEAR_MS) {
  await copyToClipboard(value);

  if (clearTimer) clearTimeout(clearTimer);

  clearTimer = setTimeout(async () => {
    try {
      const current = await Clipboard.getStringAsync();
      if (current === value) await Clipboard.setStringAsync('');
    } catch {
      // Best-effort: never let an auto-clear failure surface to the user.
    } finally {
      clearTimer = null;
    }
  }, clearAfterMs);
}
