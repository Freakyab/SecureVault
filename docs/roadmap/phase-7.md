# Phase 7 — Modern Animation & UX

**Goal:** Take the app from "polished" to "alive" using advanced, gesture-driven, physics-based motion and micro-interactions.

**Core principles**
- **Gesture-first:** prefer interruptible, gesture-driven motion over tap-then-wait animations.
- **Physics over timers:** use spring/decay physics for finger-touch interactions.
- **Purposeful delight:** animation must communicate state, hierarchy, or spatial continuity.
- **Accessible by default:** every animation has a reduced-motion variant.
- **Always 60fps:** all animation runs on the UI thread (Reanimated worklets).

### 7.1 Gesture-driven interactions
- [ ] **7.1** Swipe-to-action vault rows (reveal copy / edit / delete)
- [ ] **7.2** Long-press → context menu + drag-to-reorder favorites
- [ ] **7.3** Custom branded pull-to-refresh
- [ ] **7.4** Velocity-aware bottom sheet gestures

### 7.2 Shared element & screen transitions
- [ ] **7.5** Shared-element transition: vault row → entry detail
- [ ] **7.6** Scroll-driven collapsing headers with parallax hero
- [ ] **7.7** Spatial continuity between Dashboard and Health

### 7.3 Delight & feedback animations
- [ ] **7.8** Lottie / Reanimated success states
- [ ] **7.9** Animated empty-state illustrations
- [ ] **7.10** Generator strength meter: spring fill + color interpolation
- [ ] **7.11** Health score ring draw-on animation synced with count-up
- [ ] **7.12** Subtle celebratory moment on health-score milestone

### 7.4 Continuous & ambient motion
- [ ] **7.13** Perf-budgeted animated gradient / glow backdrops
- [ ] **7.14** Shimmer skeleton → content morph
- [ ] **7.15** Spring-animated tab bar

### 7.5 Accessibility & performance
- [ ] **7.16** Respect `useReducedMotion()`
- [ ] **7.17** 60fps budget: worklet-driven UI-thread animation
- [ ] **7.18** Motion consistency audit via `theme/animations.ts`

### Suggested libraries
- Gestures & physics: `react-native-gesture-handler`, `react-native-reanimated`
- Shared transitions: Reanimated shared element transitions / `expo-router` transitions
- Vector / Lottie: `lottie-react-native`, `react-native-svg`
- Sheets: `@gorhom/bottom-sheet`
- Effects: `expo-blur`, `expo-linear-gradient`
- Feedback: `expo-haptics`

### Definition of done
- Core lists and sheets are gesture-driven with spring physics and haptic detents.
- Navigating into and out of an entry uses a shared-element / spatial-continuity transition.
- Success, loading, and empty states use purposeful animation instead of static UI.
- Every animation has a verified reduced-motion variant.
- All animations hold 60fps on a mid-range device.
