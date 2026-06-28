# Phase 2 — UI screens (mock data)

**Goal:** Pixel-close layouts using static data—no real vault yet.

### 2.1 Onboarding
- [x] Hero illustration / image area
- [x] Title, subtitle, step indicator dots
- [x] Primary CTA (“Get started” / multi-step)
- [x] Persist “onboarding complete” on CTA

### 2.2 Dashboard (Home)
- [x] Header with greeting / user area
- [x] Category stat cards (6 categories, theme-aware tints)
- [x] “Manage password” + Recently Used sections
- [x] Floating pill tab bar integrated with tabs layout

### 2.3 Vault
- [x] “My Vault” header + shield branding
- [x] Search input (UI only)
- [x] Category chips: All, Social, Mail, Design, Finance
- [x] Credential list rows (title, username, category, icon)
- [x] Security alerts section (compromised, reused)
- [x] “Import vault” entry point (UI stub)
- [x] Empty state when no items

### 2.4 Generator
- [x] Generated password display + copy button
- [x] Length slider
- [x] Toggles: uppercase, lowercase, numbers, symbols
- [x] Strength meter (weak → strong) with shield icon states
- [x] Regenerate control
- [x] “Save secure password” CTA (wired to vault)

### 2.5 Health
- [x] “Password Health” header
- [x] Health score ring or large score display
- [x] Breakdown cards: Safe, Reused, Weak, Old + Breach Monitor
- [x] Recommendations list
- [x] Actionable list linking to affected entries

### 2.6 Entry detail
- [x] View mode: site, username, password (masked), notes, category — **read-only detail view**
- [x] Edit mode with form validation (UI)
- [x] Show / hide password, copy actions
- [x] Delete with confirmation dialog

### Definition of done
- Every screen in the prototype has a React Native equivalent
- Mock data lives in `constants/mock-data.ts` or similar
- No crashes on iOS and Android
