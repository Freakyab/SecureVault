# Phase 6 — Premium UI overhaul (Fold-style)

**Goal:** Upgrade the existing app into a calm, responsive, premium experience inspired by Fold Money. Adopt a centralized design-token system, a reusable UI kit, and a Reanimated-based motion + haptics layer.

**Core principle:** A premium app is defined by how effortlessly the user moves through it — prefer simplicity over complexity, consistency over novelty, smoothness over speed, clarity over decoration. All animations < 350ms.

### 6.1 Foundation — design tokens & theme
- [x] **6.1** Build the design-token system under `theme/`
- [x] **6.2** 8-point spacing scale and radius scale
- [x] **6.3** Typography scale
- [x] **6.4** `useTheme` and `useHaptics` hooks

### 6.2 Core components (reusable UI kit)
- [ ] **6.5** `Button`
- [ ] **6.6** `Card` + `GlassCard`
- [ ] **6.7** `Input`
- [ ] **6.8** `Avatar`
- [ ] **6.9** `AnimatedNumber`
- [ ] **6.10** `BottomSheet`
- [ ] **6.11** `SectionHeader`
- [ ] **6.12** `SkeletonLoader`

### 6.3 Motion design system
- [x] **6.13** Centralized animation durations in `theme/animations.ts`
- [ ] **6.14** Reanimated micro-interactions (button press, card fade+slide-up, list stagger)
- [x] **6.15** Haptic feedback map
- [ ] **6.16** Skeleton → fade-in loading transitions

### 6.4 Navigation experience
- [ ] **6.17** Floating rounded bottom navigation
- [ ] **6.18** Sticky headers that collapse slightly on scroll
- [ ] **6.19** Fade + slide screen transitions with shared visual continuity

### 6.5 Screen migration & polish
- [x] **6.20** Migrate screens one at a time to card-based layout + design tokens
- [ ] **6.21** Background & depth pass: soft neutral background, subtle hero gradients
- [ ] **6.22** Final UI consistency audit + animation-timing fine-tune

### Suggested libraries
- Animation: `react-native-reanimated`, `react-native-gesture-handler`, `moti`
- Visual effects: `expo-blur`, `expo-linear-gradient`
- UI / sheets: `@gorhom/bottom-sheet`, `react-native-svg`, `lucide-react-native`
- Interaction: `expo-haptics`

### Definition of done
- All buttons, cards, and inputs use shared UI-kit components and design tokens.
- Every interactive element gives immediate feedback (animation + haptic); animations < 350ms.
- Loading uses skeletons/shimmer with fade-in; no spinners or blank screens.
- Bottom nav, headers, and screen transitions follow the navigation experience spec.
- Design QA checklist passes for each migrated screen.
