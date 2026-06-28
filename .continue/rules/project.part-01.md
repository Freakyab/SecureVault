---
description: SecureVault project architecture and development rules
globs:
  - "**/*"
alwaysApply: true
---


# Project Overview

**SecureVault** is an offline-first, local-only password manager built with Expo (React Native) and TypeScript. The app stores credentials on-device, encrypts them with a user-defined master password, and provides password generation, health scoring, and optional breach scanning — without cloud sync or user accounts.


## Purpose

- Give users a private vault for website credentials (website, URL, username, password, category, notes, folders, tags).
- Protect data at rest with AES-256-GCM encryption derived from a master password (PBKDF2-SHA256, 120k iterations).
- Surface password hygiene: weak/reused/old password detection and optional Have I Been Pwned k-anonymity checks.
- Deliver a premium dark glassmorphic UI inspired by Figma designs in `screenshots/` and tracked in `Mds/ROADMAP.md`.


## Main User Flows

1. **First launch:** Onboarding (`(auth)/index`) → master password setup (`(auth)/setup`) → dashboard.
2. **Return visit (locked):** Unlock screen (`(auth)/unlock`) via master password or biometrics (opt-in) → dashboard.
3. **Vault management:** Browse/filter credentials on Vault (`/vault`), view read-only detail (`/entry/[id]`), add (`/add-credential`), edit inline on entry route.
4. **Generator:** Create strong passwords on `/generator`, optionally save to vault.
5. **Health:** Password health dashboard on `/health` with score, weak/reused/old breakdown.
6. **Settings:** Theme, auto-lock, biometrics, backup import/export, master password change, vault reset.


## Core Business Goals (V1)

- Offline-only local vault — no cloud sync, accounts, or sharing.
- Encrypted credential storage before beta.
- Master password as primary unlock; biometrics only after explicit opt-in.
- Clipboard auto-clear for copied secrets (30 seconds).
- Track progress via `Mds/ROADMAP.md`, `Mds/TASKS.md`, and `Mds/BUGS.md`.

**Deferred:** Cloud sync, browser extension, full breach monitoring service, custom logo caching beyond favicon fallback.

---


# Tech Stack


## Frameworks

| Layer                 | Technology                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| App framework         | Expo SDK ~54 (`expo` ~54.0.0)                                                                        |
| UI runtime            | React 19.1, React Native 0.81.5                                                                      |
| Routing               | Expo Router ~6 (`expo-router/entry`, file-based routes, typed routes enabled)                        |
| Navigation primitives | `@react-navigation/native` (ThemeProvider), `react-native-screens`, `react-native-safe-area-context` |


## Languages

- **TypeScript** (strict mode, `expo/tsconfig.base`)
- Path aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*`


## Libraries (by concern)

| Concern              | Library                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| Icons                | `lucide-react-native` (outline style, consistent sizes)                |
| Crypto               | `@noble/ciphers` (AES-GCM), `@noble/hashes` (PBKDF2), `expo-crypto`    |
| Local storage        | `@react-native-async-storage/async-storage` (encrypted vault blob)     |
| Secure storage       | `expo-secure-store` (onboarding flag, biometric key hex)               |
| Biometrics           | `expo-local-authentication`                                            |
| Clipboard            | `expo-clipboard`                                                       |
| Haptics              | `expo-haptics`                                                         |
| Animation            | `react-native-reanimated`, `react-native-gesture-handler`              |
| Visual effects       | `expo-blur`, `expo-linear-gradient`, `expo-glass-effect`, `expo-image` |
| Fonts                | `@expo-google-fonts/playfair-display` (serif headings)                 |
| Screen capture block | `expo-screen-capture` (while vault unlocked)                           |


## Tooling

- **Lint:** ESLint 9 + `eslint-config-expo` (`npm run lint`)
- **Test:** Jest 29 + `jest-expo` preset (`npm test`), tests in `src/services/__tests__/*.test.ts`
- **Build:** Expo managed workflow, EAS profiles planned (see README release checklist)
- **Docs/process:** `Mds/` folder (ROADMAP, TASKS, BUGS, TEST-SCENARIOS)
- **AI agent notes:** `AGENTS.md` — always consult Expo v56 docs at https://docs.expo.dev/versions/v56.0.0/ before writing Expo code


## What Is NOT Used

- No Redux, Zustand, React Query, or global reducer libraries.
- No backend server, MongoDB, or REST API layer in this repo (`.cursor/rules/backend-mongodb.mdc` is not applicable to runtime).
- No NativeWind/Tamagui — styling is React Native `StyleSheet` with design tokens.
- No Tailwind in production screens.

---


# Architecture


## Overall Pattern

The app follows a **thin-route, thick-screen** architecture:

```
Root (_layout.tsx)
  └── Providers: SafeAreaProvider → SecureVaultThemeProvider → VaultProvider → ToastProvider
  └── Stack navigator (headerless)
        ├── (auth)/   — onboarding, setup, unlock
        ├── (tabs)/   — main app tabs (custom BottomNav, native tab bar hidden)
        └── modal/stack routes — add-credential, change-password, entry/[id]
```

- **Route files** (`src/app/**/*.tsx`): auth guards, redirects, wire vault state to screen components.
- **Screen components** (`src/components/screens/*.tsx`): full UI, business logic orchestration, local UI state.
- **Vault components** (`src/components/vault/*.tsx`): reusable SecureVault-specific UI (GlassCard, BottomNav, CredentialRow, etc.).
- **Generic UI** (`src/components/ui/*.tsx`): cross-cutting primitives (PressableScale, AnimatedBlobs, Button/Card from primitives).
- **Services** (`src/services/*.ts`): pure/async logic — storage, crypto, health, search, clipboard, biometrics.
- **Contexts** (`src/contexts/*.tsx`): global session and theme state.


## Data Flow

```
User action (screen)
  → useVault() context method (addCredential, unlockVault, …)
    → vault-storage.ts (encrypt/decrypt via vault-crypto.ts)
      → AsyncStorage (persist encrypted blob)
    → setState in VaultProvider (credentials, settings, isUnlocked)
  → Screen re-renders from context
```

**Unlock session:** A `Uint8Array` AES key lives in `encryptionKeyRef` inside `VaultProvider` — memory only, cleared on lock. Credentials are empty in context while locked; settings/metadata remain readable without unlock.

**Legacy migration:** Pre-encryption vaults (salted SHA-256 + plaintext credentials) migrate to AES-256-GCM on first successful unlock.


## Component Hierarchy (typical tab screen)

```
ScreenBackground
  VaultHeader (optional)
  ScrollView / FlatList content
    GlassCard, CredentialRow, CategoryCard, ScoreRing, …
  BottomNav (active tab prop)
```

Entry detail and auth screens omit `BottomNav`. Screens use `useSafeAreaInsets()` for bottom padding above the floating nav bar.


## State Management Flow

| State                                                     | Owner                | Persistence                                                         |
| --------------------------------------------------------- | -------------------- | ------------------------------------------------------------------- |
| Vault session (unlocked, credentials, settings, metadata) | `VaultProvider`      | AsyncStorage via `vault-storage.ts`                                 |
| Color theme accent (blue/purple/gold)                     | `ColorThemeProvider` | AsyncStorage `securevault:color-theme` + synced from vault settings |
| Toast messages                                            | `ToastProvider`      | Ephemeral                                                           |
| Screen-local UI (filters, form fields, modals)            | Component `useState` | None                                                                |
| Onboarding complete flag                                  | `onboarding.ts`      | SecureStore                                                         |

No global action dispatcher — async methods on context replace CRUD operations.

---


# Folder Structure

```
pass-code/
├── src/
│   ├── app/                    # Expo Router routes (thin wrappers)
│   │   ├── _layout.tsx         # Root providers + Stack
│   │   ├── (auth)/             # Onboarding, setup, unlock
│   │   ├── (tabs)/             # dashboard, vault, generator, health, settings, my-vault
│   │   ├── add-credential.tsx
│   │   ├── change-password.tsx
│   │   └── entry/[id].tsx      # Credential detail (view + inline edit mode)
│   ├── components/
│   │   ├── screens/            # Full screen implementations (11 screens)
│   │   ├── vault/              # SecureVault design-system components
│   │   └── ui/                 # Generic reusable UI (PressableScale, primitives)
│   ├── constants/              # Static config: categories, legacy vault tokens, theme helpers
│   ├── contexts/               # VaultProvider, ColorTheme, Toast, SecureVaultTheme wrapper
│   ├── hooks/                  # useTheme, useVaultStyles, useHaptics, useNavigationLock, useColorScheme
│   ├── services/               # Business logic + crypto + storage (no React)
│   │   ├── crypto/vault-crypto.ts
│   │   └── __tests__/          # Jest unit tests
│   ├── theme/                  # Fold-style design token system (colors, spacing, motion, …)
│   └── types/                  # Shared TypeScript interfaces (credential.ts)
├── assets/                     # App icon, splash, images
├── Mds/                        # ROADMAP, TASKS, BUGS, implementation plans
├── screenshots/                # Figma/design reference PNGs
├── .continue/                  # Continue.dev config (agents, rules)
├── .cursor/                    # Cursor rules, skills, agents
├── app.json                    # Expo config (SecureVault, typedRoutes, reactCompiler)
├── package.json
└── README.md
```

### Responsibilities

| Folder                    | Responsibility                                                                   |
| ------------------------- | -------------------------------------------------------------------------------- |
| `src/app/`                | Routing only: redirects when vault locked/uninitialized, render screen component |
| `src/components/screens/` | Feature-complete screens; import vault + ui components, hooks, services          |
| `src/components/vault/`   | Branded UI kit: glass surfaces, nav, credential list rows, headers, buttons      |
| `src/components/ui/`      | Theme-agnostic or shared primitives not tied to vault branding                   |
| `src/services/`           | Side effects and pure functions; testable without React                          |
| `src/theme/`              | Design tokens consumed via `useTheme()` / `getTheme()`                           |
| `src/constants/`          | Domain constants (`CREDENTIAL_CATEGORIES`) and legacy static `VaultColors`       |
| `src/types/`              | Domain models — extend here before adding fields to credentials/settings         |
| `Mds/`                    | Project management source of truth — update when shipping features/fixes         |

---


# Navigation


## System

- **Expo Router** file-based routing under `src/app/`.
- Root `Stack` with `(auth)` and `(tabs)` groups; both use `headerShown: false`.
- `(tabs)` uses Expo `Tabs` with **`tabBarStyle: { display: 'none' }`** — the app renders its own floating `BottomNav` inside each tab screen.
- `experiments.typedRoutes: true` — prefer typed hrefs like `/dashboard`, `/vault`.


## Route Map

| Route              | Screen component                                | Auth guard                               |
| ------------------ | ----------------------------------------------- | ---------------------------------------- |
| `/` (auth index)   | Onboarding or redirects                         | Checks onboarding, initialized, unlocked |
| `/setup`           | Setup master password                           | Uninitialized only                       |
| `/unlock`          | Unlock vault                                    | Initialized, locked                      |
| `/dashboard`       | DashboardScreen                                 | Initialized + unlocked                   |
| `/vault`           | MainVaultScreen                                 | Initialized + unlocked                   |
| `/my-vault`        | MyVaultScreen                                   | Initialized + unlocked                   |
| `/generator`       | GeneratorScreen                                 | Initialized + unlocked                   |
| `/health`          | PasswordHealthScreen                            | Initialized + unlocked                   |
| `/settings`        | SettingsScreen                                  | Initialized + unlocked                   |
| `/add-credential`  | AddCredentialScreen                             | Stack route, unlocked                    |
| `/change-password` | ChangePasswordScreen                            | Stack route, unlocked                    |
| `/entry/[id]`      | Inline EntryReadOnlyView + EditCredentialScreen | Dynamic id param                         |


## Auth Guard Pattern

Every protected route repeats this pattern:

```tsx
const { isInitialized, isLoading, isUnlocked } = useVault();
if (isLoading) return <RouteFallback />; // or <View />
if (!isInitialized) return <Redirect href="/" />;
if (!isUnlocked) return <Redirect href="/unlock" />;
return <SomeScreen />;
```


## Navigation Utilities

- **`useRouter()`** from `expo-router` for `push`, `replace`, `back`.
- **`useNavigationLock()`** — debounces rapid taps (BUG-010); wrap navigations: `runLocked(() => router.push('/vault'))`.
- **`useLocalSearchParams()`** — read query params (e.g. `category` filter on vault, `id` on entry).


## BottomNav Tabs

`VaultTab` type: `'dashboard' | 'vault' | 'generator' | 'health' | 'settings'`.

Each tab screen passes `active` prop to `<BottomNav active="vault" />`. Routes are hardcoded in `bottom-nav.tsx` ITEMS array.

---


# State Management


## VaultProvider (`src/contexts/vault-context.tsx`)

Central app state. Access via **`useVault()`** (throws if outside provider).

**Read state:** `isLoading`, `isInitialized`, `isUnlocked`, `metadata`, `settings`, `credentials`

**Actions:**

- Session: `setupMasterPassword`, `unlockVault`, `unlockWithBiometrics`, `lockVault`, `resetVault`, `changeMasterPassword`
- CRUD: `addCredential`, `updateCredential`, `deleteCredential`, `getCredential`, `setCredentialLogo`
- Organization: `toggleFavorite`, `toggleArchive`, `importCredentials`
- Settings: `updateSettings`

**Side effects in provider:**

- Auto-lock on app background (respects `settings.autoLockMinutes`: -1 never, 0 immediate, N minutes)
- Screen capture prevention while unlocked (native only)
- Biometric key sync to SecureStore when enabled


## ColorThemeProvider (`src/contexts/color-theme-context.tsx`)

- **`useVaultColors()`** — runtime palette (`VaultColorsShape`) for vault screens.
- **`useColorTheme()`** — full context including `setColorTheme`.
- **`ColorThemeVaultSync`** — child of VaultProvider that syncs vault settings → color theme.

Presets: `'blue' | 'purple' | 'gold'` defined in `src/theme/color-themes.ts`.


## ToastProvider (`src/contexts/toast-context.tsx`)

- **`useToast().showToast(message, tone?)`** — tones: `'success' | 'error' | 'info'`.
- Rendered inside root navigation stack; positioned above BottomNav.


## Local State Conventions

- Form fields, filters, modals, toggles → `useState` in screen component.
- Derived lists → `useMemo` (filtered credentials, health metrics).
- Expensive style objects → `useMemo(() => makeStyles(theme), [theme])`.


## Domain Types (`src/types/credential.ts`)

- `Credential`, `VaultSettings`, `VaultMetadata`, `PasswordHistoryEntry`
- `DEFAULT_VAULT_SETTINGS`, `AUTO_LOCK_PRESETS`
- Use `interface` not `type` for objects; avoid enums — use string union types or const arrays.

---


# API Layer

There is **no internal REST/GraphQL backend**. All data is local. External network usage is minimal and opt-in.


## Services Overview

| Service                  | Role                                                                        |
| ------------------------ | --------------------------------------------------------------------------- |
| `vault-storage.ts`       | Read/write encrypted vault blob to AsyncStorage; setup/unlock/reset/migrate |
| `crypto/vault-crypto.ts` | PBKDF2 key derivation, AES-256-GCM encrypt/decrypt JSON payloads            |
| `vault-backup.ts`        | Serialize/parse plaintext JSON backups; merge on import                     |
| `onboarding.ts`          | SecureStore flag for onboarding completion                                  |
| `biometric.ts`           | Device capability check + LocalAuthentication prompt                        |
| `biometric-key.ts`       | Store/retrieve hex encryption key in SecureStore for biometric unlock       |
| `password-generator.ts`  | Pure password generation with charset options                               |
| `health-checks.ts`       | Weak/reused/old password analysis, health score                             |
| `breach-check.ts`        | HIBP k-anonymity range API (`fetch` to `api.pwnedpasswords.com`)            |
| `credential-search.ts`   | Client-side filter/search over credentials                                  |
| `site-branding.ts`       | Domain normalization, favicon URL, logo cache in AsyncStorage               |
| `feedback.ts`            | Clipboard copy, haptic helpers, 30s sensitive clipboard wipe                |


## Request Patterns

- **Local I/O:** All vault operations are `async` functions returning typed results (`VaultSnapshot`, `UnlockResult`).
- **Network:** Only `breach-check.ts` uses `fetch`. Throws on HTTP errors; callers show offline/error UI.
- **No axios, no react-query** — call services directly from screens or context.


## Error Handling

- **`VaultDecryptionError`** — wrong master password (GCM auth failure).
- **`CorruptVaultError`** — JSON parse failure or invalid vault structure; unlock screen offers reset.
- Context methods throw `Error` with user-readable messages (`'Unlock your vault before saving changes.'`).
- Screens catch errors and show `Alert.alert` or `showToast(..., 'error')`.
- Biometrics, haptics, screen capture, SecureStore — **best-effort, never crash**; fall back gracefully.


## Data Fetching Conventions

- Vault hydrates once on mount in `VaultProvider` via `loadVaultSnapshot()`.
- No polling. Re-read from context after mutations.
- Favicons loaded by `expo-image` in `CredentialAvatar`; domain status cached in AsyncStorage via `site-branding.ts`.

---


# UI System


## Design Language

- **Dark-first premium aesthetic:** deep navy/aubergine backgrounds, glassmorphic cards, violet/blue/gold accents.
- **Serif display type:** Playfair Display for brand titles and section headings.
- **Glass surfaces:** semi-transparent fills, subtle borders, optional blur on iOS (`expo-blur`).
- **Motion:** `react-native-reanimated` enter animations (`FadeInDown`), press scale via `PressableScale`.
- **Reference:** `screenshots/` folder and Figma-derived specs in `Mds/Main Vault.md`, `Mds/color-themes.md`.


## Theme System (dual — migrating)

### 1. Modern token system — **preferred for new/edited screens**

```tsx
import { useTheme } from "@/hooks/use-theme";
import { type Theme } from "@/theme";

const theme = useTheme();
const styles = useMemo(() => makeStyles(theme), [theme]);

function makeStyles(t: Theme) {
  return StyleSheet.create({
    container: {
      padding: t.layout.screenPadding,
      backgroundColor: t.colors.background,
    },
  });
}
```

`getTheme(scheme, colorThemeId)` resolves: `colors`, `glass`, `gradients`, `spacing`, `layout`, `radius`, `typography`, `fontFamily`, `fontWeight`, `shadows`, `motion`.

### 2. Legacy vault tokens — still used in some screens

```tsx
import { useVaultColors } from "@/contexts/color-theme-context";
import { useVaultStyles } from "@/hooks/use-vault-styles";
import { VaultType, VaultSpacing, VaultRadii } from "@/constants/vault-theme";
```

Static `VaultColors` export in `constants/vault-theme.ts` is deprecated for runtime — use `useVaultColors()`.

**When editing:** match the surrounding file's system; prefer migrating to `useTheme()` + `makeStyles(t: Theme)` when touching styling significantly.


## Colors

- **Accent presets:** `blue` (Ocean Blue, default), `purple`, `gold` — full token sets in `src/theme/color-themes.ts`.
- **Semantic:** `success` (#7ee0b8), `warning` (#ffd479), `danger` (#ff8a8a) shared across presets.
- **Never hardcode random hex** in components — pull from `theme.colors.*`, `theme.glass.*`, or `useVaultColors()`.


## Typography

- **Serif headings:** `theme.typography.titleSerif`, `sectionHeading`, Playfair via `SerifFont` in `constants/theme.ts`.
- **Body/labels:** `theme.typography.body`, `label`, `caption`; legacy `VaultType.body`, `VaultType.label`.
- **Uppercase labels:** letter-spacing ~0.8–1.2, 11–12px, muted color.


## Spacing & Radius

- Token spacing: `t.spacing.xs` (4) through `t.spacing.xxxl` (32); 8px grid baseline.
- Legacy: `VaultSpacing`, `VaultRadii` (sm 12, md 20, lg 32, pill 9999).
- Screen horizontal padding: `t.layout.screenPadding`; card padding: `t.layout.cardPadding`.


## Icons

- **Library:** `lucide-react-native` only (outline, consistent strokeWidth ~1.75–2).
- **Sizes:** small 16, default 20, navigation 24, feature 32–40.
- **Categories:** mapped in `constants/categories.ts` with Lucide icons per category id.
- Always set `accessibilityLabel` on interactive icons.


## Shared UI Components

### Vault kit (`@/components/vault`)

| Component                          | Use                                    |
| ---------------------------------- | -------------------------------------- |
| `ScreenBackground`                 | Full-screen gradient/blob backdrop     |
| `VaultHeader`                      | Back button + title                    |
| `GlassCard`                        | Glassmorphic content surface           |
| `PrimaryButton`                    | CTA with optional icon                 |
| `CredentialRow`                    | List row with avatar, badges, actions  |
| `CredentialAvatar`                 | Favicon or category icon               |
| `CategoryCard`                     | Dashboard category stat tile           |
| `BottomNav`                        | Floating tab bar                       |
| `EmptyState`                       | Zero-data states with icon             |
| `ScoreRing`                        | Circular health score                  |
| `InputField`, `Toggle`, `IconTile` | Forms and settings                     |
| `RouteFallback`                    | Loading placeholder for guarded routes |

Import barrel: `import { GlassCard, BottomNav } from '@/components/vault'`.

### Generic UI (`@/components/ui`)

- `PressableScale` — Reanimated press feedback + haptic
- `AnimatedBlobs` — aurora background (palette from color theme)
- `primitives.tsx` — `Button`, `Card`, `Input`, `Badge`, `Progress`, `Screen`


## Reusable Patterns

- **`makeStyles(theme)` factory** at bottom of file, called via `useMemo`.
- **`ScreenBackground` + `VaultHeader` + `ScrollView` + `BottomNav`** for tab screens.
- **`useHaptics()`** for tactile feedback on copy, navigation, toggles.
- **`useToast()`** for non-blocking success/error feedback.
- **`copySensitiveToClipboard()`** for passwords (auto-clear 30s).
- **Staggered list entrance:** `Animated.View entering={FadeInDown.duration(...).delay(index * stagger)}`.

---


# Development Rules

AI agents working in this repo **must**:

1. **Reuse existing components** (`vault/*`, `ui/*`) before creating new ones.
2. **Follow thin-route / thick-screen split** — do not put large UI in `src/app/` route files.
3. **Use types from `src/types/credential.ts`** and extend interfaces there for new credential/settings fields.
4. **Follow naming conventions** (kebab-case folders, PascalCase components, `useX` hooks, `*-screen.tsx` screens).
5. **Avoid duplicate implementations** — categories live in `constants/categories.ts`; health logic in `health-checks.ts`; crypto in `vault-crypto.ts`.
6. **Maintain design consistency** — dark glass aesthetic, Playfair headings, lucide icons, token-based colors.
7. **Preserve offline-first architecture** — no cloud APIs, auth servers, or sync unless explicitly scoped in ROADMAP.
8. **Update `Mds/TASKS.md` / `Mds/BUGS.md` / `Mds/ROADMAP.md`** when completing tracked work.
9. **Run `npm run lint` and `npm test`** before considering work done.
10. **Consult Expo v56 docs** per `AGENTS.md` when using Expo APIs.

---


# Coding Conventions


## File Naming

| Kind                | Pattern                                   | Example                                    |
| ------------------- | ----------------------------------------- | ------------------------------------------ |
| Route files         | kebab-case or `[param]`                   | `add-credential.tsx`, `entry/[id].tsx`     |
| Screen components   | kebab-case + `-screen` implicit in folder | `main-vault.tsx` exports `MainVaultScreen` |
| Vault/UI components | kebab-case file, PascalCase export        | `glass-card.tsx` → `GlassCard`             |
| Services            | kebab-case                                | `vault-storage.ts`                         |
| Hooks               | `use-*.ts`                                | `use-theme.ts`                             |
| Tests               | `*.test.ts` in `__tests__/`               | `health-checks.test.ts`                    |
| Types               | singular domain noun                      | `credential.ts`                            |


## Folder Naming

- Lowercase with dashes: `components/screens`, `services/crypto`.
- Route groups in parentheses: `(auth)`, `(tabs)`.


## Component Patterns

```tsx
// Named export, function keyword, PropsWithChildren or explicit interface
interface DashboardScreenProps {
  onFinish?: () => void;
}

export function DashboardScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  // ...
}
```

- Prefer **`function` declarations** for components and pure helpers.
- Co-locate **`makeStyles(t: Theme)`** at file bottom.
- Subcomponents in same file when private to one screen; promote to `vault/` when reused 2+ times.


## Hook Patterns

- **`useVault()`**, **`useTheme()`**, **`useToast()`**, **`useHaptics()`** — standard hooks; check throw messages if provider missing.
- **`useVaultStyles(factory)`** — memoized StyleSheet from vault colors.
- **`useNavigationLock()`** — returns `runLocked(action)`.
- Platform-specific: `use-color-scheme.ts` / `use-color-scheme.web.ts`.


## Service Patterns

- Pure functions exported by name; no React imports.
- Async storage/crypto services throw typed errors; UI layer handles display.
- Jest-testable logic stays in services, not components.
- Document security/privacy behavior in file header comments (see `breach-check.ts`, `vault-crypto.ts`).


## State Patterns

- Global vault state → `VaultProvider` only.
- Theme → `ColorThemeProvider` + vault settings sync.
- Never store master password or AES key in React state or AsyncStorage plaintext.
- Optimistic `setCredentials` then persist via `commitCredentials` in context.


## Git Workflow

Branch naming (from README):

- `feature/<short-description>`
- `fix/<bug-id>-<short-description>`
- `chore/<short-description>`

Labels: `priority:p0–p3`, `type:bug|feature|task|security|docs`, `area:auth|vault|health|ui|release`.

---


# Common Workflows


## Creating a New Screen

1. Add screen component in `src/components/screens/my-feature.tsx` exporting `MyFeatureScreen`.
2. Add route file in `src/app/` (or `(tabs)/`) with auth guard pattern.
3. If tab-accessible: add to `(tabs)/_layout.tsx` Tabs.Screen and `BottomNav` ITEMS if needed.
4. Compose with `ScreenBackground`, `VaultHeader`, `GlassCard`, `useTheme`, `useVault`.
5. Add screenshot reference to `screenshots/` if design-driven; track task in `Mds/TASKS.md`.


## Creating a New API Integration

Rare — app is offline-first. If adding external service:

1. Create `src/services/my-service.ts` with pure async functions.
2. Document privacy implications in file header.
3. Handle offline/errors in calling screen with Alert or toast.
4. Add unit tests with mocked `fetch` if applicable.
5. Update ROADMAP security/privacy section.


## Creating a New Component

1. Check `@/components/vault` and `@/components/ui` for existing match.
2. If vault-branded → `src/components/vault/my-component.tsx`, export from `vault/index.ts`.
3. Use `useTheme()` + `makeStyles`; accept `style?` prop for overrides.
4. Include accessibility props on pressables.
5. Use lucide-react-native icons at standard sizes.


## Adding a New Navigation Route

1. Create `src/app/my-route.tsx` with vault guards.
2. For stack modal behavior, add `<Stack.Screen>` in root `_layout.tsx` if custom animation needed.
3. Navigate with `router.push('/my-route')` or `replace`; wrap in `useNavigationLock`.
4. Typed routes: use string literals matching file path.


## Managing Application State

- **New vault-wide setting:** extend `VaultSettings` in `types/credential.ts`, default in `DEFAULT_VAULT_SETTINGS`, persist in `vault-storage.ts` (settings are plaintext in blob), expose via `updateSettings` in context.
- **New credential field:** extend `Credential` interface, update `migrateCredential`/`normalizeCredential` in storage and backup services, update add/edit screens.
- **Ephemeral UI state:** local `useState` in screen — do not add to context.

---


---

**Navigation:** [↑ Index](./project.md) · **Part 1 of 2** · [Part 2 →](./project.part-02.md)
