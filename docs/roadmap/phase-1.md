# Phase 1 — Design system & app shell

**Goal:** Replace Expo starter with SecureVault structure, theme, and navigation—screens can be placeholders.

### Tasks
- [x] **1.1** Add `constants/securevault-theme.ts` with **light + dark** palettes
- [x] **1.2** Load app fonts via `expo-font` (system sans + Playfair Display)
- [x] **1.3** Update root `app/_layout.tsx` (theme provider, fonts, splash)
- [x] **1.4** Create route groups: `(auth)`, `(tabs)` + `entry/[id]`
- [x] **1.5** Implement auth gate (onboarding flag in `expo-secure-store`)
- [x] **1.6** Build custom **pill tab bar**
- [x] **1.7** Wire tab routes: Home, Vault, Generator, Health, Settings
- [x] **1.8** Create shared UI primitives: `Button`, `Card`, `Input`, `Badge`, `Progress`, `Screen`
- [x] **1.9** Remove default Expo Explore tab
- [x] **1.10** Configure status bar / safe areas
- [x] **1.11** `SecureVaultThemeProvider` — all screens use `useSecureVaultTheme()`

### Definition of done
- App launches into onboarding or tabs based on auth state
- All five main areas are reachable via navigation
- Theme matches prototype purple palette on all shells
