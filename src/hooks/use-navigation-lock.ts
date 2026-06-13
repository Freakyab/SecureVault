import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * Guards against duplicate navigations from rapid taps (BUG-010). While a
 * navigation triggered through `runLocked` is in flight, further calls are
 * ignored until the screen regains focus or the timeout elapses.
 */
export function useNavigationLock(timeoutMs = 800) {
  const lockedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      lockedRef.current = false;
      return () => {
        lockedRef.current = false;
      };
    }, []),
  );

  return useCallback(
    (action: () => void) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      action();
      setTimeout(() => {
        lockedRef.current = false;
      }, timeoutMs);
    },
    [timeoutMs],
  );
}
