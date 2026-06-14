import { useMemo } from 'react';

import { useVaultColors } from '@/contexts/color-theme-context';
import type { VaultColorsShape } from '@/theme/color-themes';

/** Build theme-aware StyleSheets that update when the user switches color theme. */
export function useVaultStyles<T>(factory: (colors: VaultColorsShape) => T): T {
  const colors = useVaultColors();
  return useMemo(() => factory(colors), [colors, factory]);
}
