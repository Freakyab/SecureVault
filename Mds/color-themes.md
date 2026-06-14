# Global Color Themes

Runtime theme switching for the whole app: **Ocean Blue** (default), **Cosmic Violet**, and **Obsidian Gold**.

## Architecture

| Layer | File | Role |
| ----- | ---- | ---- |
| Presets | `src/theme/color-themes.ts` | All palette values (vault colors, blobs, `@/theme` tokens) |
| Context | `src/contexts/color-theme-context.tsx` | Runtime state + AsyncStorage + `useVaultColors()` |
| Vault UI | `useVaultColors()` + `makeStyles(c)` | Vault screens & shared components |
| Dashboard | `useTheme()` + `useThemePresets()` | Auto-updates when color theme changes |
| Blobs | `ScreenBackground` / dashboard | Reads `COLOR_THEMES[id].blob` |
| Persistence | `VaultSettings.colorTheme` | Saved with vault; synced on load |

## User flow

**Settings → Appearance → Color Theme** — three swatch chips. Selecting one:

1. `updateSettings({ colorTheme })` — persisted in vault
2. `setColorTheme(id)` — live UI update + AsyncStorage mirror (for pre-unlock screens)

## Adding a new theme

1. Add an entry to `COLOR_THEMES` in `color-themes.ts` (vault + blob + dark colors/glass/gradients).
2. Add the id to `COLOR_THEME_IDS` and `ColorThemePreference` in `types/credential.ts`.
3. Add a swatch chip in `settings.tsx` (or derive chips from `COLOR_THEME_IDS`).

## Rules for components

- **Do not** use static `VaultColors` in new code — use `useVaultColors()` inside components.
- Module-level `StyleSheet.create({ color: VaultColors.x })` will **not** update on theme change.
- Pattern:

```tsx
function makeStyles(c: VaultColorsShape) {
  return StyleSheet.create({ title: { color: c.heading } });
}

function MyScreen() {
  const c = useVaultColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  return <Text style={styles.title}>...</Text>;
}
```

- Dashboard / preset screens: use `useTheme()` — already wired to `colorThemeId`.

## React Compiler + blobs

Animated blobs require `"use no memo"` on the `Blob` component when React Compiler is enabled. See `Mds/animated-blobs.md`.

## Static `VaultColors` export

`src/constants/vault-theme.ts` still exports `VaultColors` as the **default blue** palette for legacy/static styles. Prefer `useVaultColors()` for anything that should react to the Settings picker.
