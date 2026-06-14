# Animated Blobs Background

Slow-drifting, soft gradient "aurora" blobs that bring screen backgrounds to
life. Replaces the old static corner glows.

- **Component:** `src/components/ui/animated-blobs.tsx`
- **Exports:** `AnimatedBlobs`, `BLOB_PALETTES`, `BlobPalette`
- **Built on:** `react-native-reanimated` (motion) + `react-native-svg` (soft radial blobs)

## How it works

Three `<Svg>` radial-gradient circles are each wrapped in an `Animated.View`.
Reanimated drives the parent view's `transform` (`translateX/Y` + `scale`) on the
UI thread. Each blob oscillates on X and Y with **different durations**, so the
path wanders instead of sliding on a fixed diagonal. The gradient uses 4 stops
(`0% → 35% → 70% → 100%`) fading to transparent for a soft, blurred look with no
hard edges or hot center.

## Usage

Render it as the **first child** of a screen's root `View` (it sits behind the
content via `StyleSheet.absoluteFill`). The root should have
`overflow: 'hidden'` so blobs clip cleanly at the screen edge.

```tsx
import { AnimatedBlobs } from '@/components/ui/animated-blobs';

function Screen() {
  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <AnimatedBlobs />
      {/* ...content... */}
    </View>
  );
}
```

## Props

| Prop        | Type          | Default               | Description                                            |
| ----------- | ------------- | --------------------- | ------------------------------------------------------ |
| `colors`    | `BlobPalette` | `BLOB_PALETTES.blue`  | Three colors (center → edges) for the three blobs.     |
| `speed`     | `number`      | `1`                   | Speed multiplier. `>1` faster, `<1` slower.            |
| `intensity` | `number`      | `1`                   | Opacity multiplier. Lower it behind dense content.     |

### Palettes

```ts
BLOB_PALETTES.blue   // ['#7FB0FF', '#2D6CF6', '#4A90E2'] — global blue scheme (default)
BLOB_PALETTES.violet // ['#deb7ff', '#b06af0', '#7b2cbf'] — legacy violet (one-off use)
```

Pass a custom tuple for a one-off palette: `<AnimatedBlobs colors={['#f00', '#0f0', '#00f']} />`.

## Applying it globally

Color themes are defined in `Mds/color-themes.md`. Blob palettes are tied to each theme in `src/theme/color-themes.ts` (`preset.blob`).

It is already wired in two places that cover the whole app:

1. **`ScreenBackground`** — passes `COLOR_THEMES[colorThemeId].blob` from the active color theme.
2. **`DashboardScreen`** — same blob palette from `useColorTheme()`.

When the user switches theme in **Settings → Appearance → Color Theme**, both blobs and all migrated screens update live.

To add it to a **new screen**, either:

- Wrap the screen in `ScreenBackground` (recommended — gets the blobs for free), or
- Drop `<AnimatedBlobs />` as the first child of the screen's root `View` and add
  `overflow: 'hidden'` to that root.

To change the look everywhere, edit the blob configs (size / position / travel /
duration) or `BLOB_PALETTES` in `animated-blobs.tsx` — a single source of truth.

## React Compiler caveat

React Compiler is enabled (`app.json` → `experiments.reactCompiler`). It cannot
see Reanimated's `progress.value` reads inside the `useAnimatedStyle` worklet, so
it would memoize the style and **freeze** the blobs. The `Blob` component opts out
with a `"use no memo"` directive — keep that directive when editing the file, and
add it to any new component that drives Reanimated worklets.

## Tips

- Behind dense lists, lower `intensity` (e.g. `0.7`) for readability.
- `react-native-svg` requires SVG-safe gradient IDs. Do **not** use `useId()` for
  them — its `:` characters break `url(#…)` references on Android. Use plain string
  ids like the existing `blob-a/b/c`.
