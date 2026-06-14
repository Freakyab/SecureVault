import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  COLOR_THEMES,
  COLOR_THEME_IDS,
  DEFAULT_COLOR_THEME_ID,
  getColorThemePreset,
  isColorThemeId,
  type ColorThemeId,
  type VaultColorsShape,
} from '@/theme/color-themes';

const STORAGE_KEY = 'securevault:color-theme';

interface ColorThemeContextValue {
  colorThemeId: ColorThemeId;
  vaultColors: VaultColorsShape;
  setColorTheme: (id: ColorThemeId) => Promise<void>;
}

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);

export function ColorThemeProvider({ children }: PropsWithChildren) {
  const [colorThemeId, setColorThemeId] = useState<ColorThemeId>(DEFAULT_COLOR_THEME_ID);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && isColorThemeId(stored)) {
          setColorThemeId(stored);
        }
      } catch {
        /* keep default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setColorTheme = useCallback(async (id: ColorThemeId) => {
    setColorThemeId(id);
    await AsyncStorage.setItem(STORAGE_KEY, id);
  }, []);

  const vaultColors = useMemo(() => getColorThemePreset(colorThemeId).vault, [colorThemeId]);

  const value = useMemo(
    () => ({
      colorThemeId,
      vaultColors,
      setColorTheme,
    }),
    [colorThemeId, vaultColors, setColorTheme],
  );

  return <ColorThemeContext.Provider value={value}>{children}</ColorThemeContext.Provider>;
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useColorTheme must be used within ColorThemeProvider');
  }
  return context;
}

/** Runtime vault palette — use inside components instead of the static `VaultColors` export. */
export function useVaultColors(): VaultColorsShape {
  return useColorTheme().vaultColors;
}

/** Sync vault settings → color theme when settings load or change. */
export function ColorThemeVaultSync({ colorThemeId }: { colorThemeId?: ColorThemeId }) {
  const { setColorTheme } = useColorTheme();

  useEffect(() => {
    if (colorThemeId) {
      void setColorTheme(colorThemeId);
    }
  }, [colorThemeId, setColorTheme]);

  return null;
}

export { COLOR_THEMES, COLOR_THEME_IDS, type ColorThemeId };
