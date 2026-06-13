# Main Vault — Detailed Design vs Implementation Comparison

Exhaustive element-by-element audit of the **design reference** (`screenshots/Main Vault.png`) against the **current build** (Expo Go, 2026-06-14).

> Scope: **typography, layout, styles, color, spacing, iconography, component anatomy, and states.**
> Dynamic content (credential names, item counts, emails, health %, risk numbers) is **excluded** by design.

| | Reference | Implementation |
|---|-----------|----------------|
| **Source** | `screenshots/Main Vault.png` | `src/components/screens/main-vault.tsx` |
| **Overall fidelity** | — | **Partial** — most cards present; header actions, list grouping, security-pulse color language, FAB, and bottom nav diverge; app adds 3 extra filter rows |

Legend: 🔴 Critical · 🟡 Mismatch · 🟢 Minor · ✅ Matches

---

## 1. Top header — brand & actions

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Brand wordmark | Shield + **"SecureVault"** wordmark on a top line | **None** (no wordmark line) | 🔴 |
| Top-right actions | **Upload/Export** + **Download/Import** icons + **avatar photo** | **None** of these | 🔴 |
| Brand icon | Small shield, accent | Shield in rounded-square tile `44×44`, `borderRadius 14`, `accentSoft` fill, accent `+'55'` border | 🟡 |
| Screen title | "Main Vault", serif bold | "Main Vault", `VaultType.title` serif (28/lh36/600) | ✅ |
| Subtitle | "32 Items **Secured**" | "13 **passwords**" — `fontSize 14`, `color muted`, `marginTop 2` | 🟡 (wording) |
| Primary action btn | **"+ NEW ITEM"** purple **gradient** pill, top-right | **"Sort by"** glass pill with `SlidersHorizontal` icon | 🔴 (different action) |
| Action btn style | Filled accent gradient, white text | `borderRadius 9999`, glass bg, `border glassBorder`, text `accent` 13/600, icon `size 15` | 🟡 |
| Header layout | Wordmark row above; title + CTA row below | Single row: brand tile + title block · sort button (`space-between`) | 🟡 |

**Code:** `main-vault.tsx` 110–127; styles 291–336.

---

## 2. Search bar

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Shape | Rounded rect | `borderRadius 16` | ✅ |
| Height | ~50px | `height 50` | ✅ |
| Left icon | Magnifying glass, muted | `Search` `size 17`, `color muted`, `strokeWidth 1.75` | ✅ |
| Placeholder | "Search your vault..." | "Search your vault..." | ✅ |
| Placeholder color | Muted lilac | `placeholder rgba(207,194,213,0.4)` | ✅ |
| Fill / border | Translucent + hairline | `glassBackground` + `glassBorder` | ✅ |
| Inner padding / gap | ~16 / ~12 | `paddingHorizontal 16`, `gap 12` | ✅ |
| Top margin | — | `marginTop 24` | ✅ |
| Input text | — | `fontSize 15`, `color heading` | ✅ |

> Search is the closest-matching element on the screen.

---

## 3. View filter chips (Active / Favorites / Archived)

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Items | Active · Favorites · Archived | Active · Favorites · Archived | ✅ |
| Width | **Content-width**, left-aligned, hug text | **Full-width**, each `flex 1` (equal thirds) | 🔴 |
| Shape | Pill | `borderRadius 9999` | ✅ |
| Active fill | Bright purple | `accentStrong #7b2cbf`, matching border | ✅ |
| Active text | Light/white | `viewChipTextActive color heading` | ✅ |
| Inactive | Glass pill, muted text | `glassBackground` + `glassBorder`, text `muted` 13/600 | ✅ |
| Vertical padding | ~8 | `paddingVertical 10` | 🟢 |
| Row gap | small | `gap 8`, `marginTop 16` | ✅ |

**Code:** `main-vault.tsx` 142–156; styles 355–380.

---

## 4. Category filter chips — **app only**

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Whole row | **Absent** | All · Login · Card · Note · Identity · Wi-Fi · API Keys (wraps to 2 lines) | 🔴 (extra) |
| Active style | — | `accentSoft` fill, `accent` border, `accent` text | — |
| Inactive | — | glass, `muted` text 13/600 | — |
| Chip padding | — | `paddingHorizontal 18`, `paddingVertical 8` | — |
| Row | — | `flexWrap wrap`, `gap 8`, `marginTop 12` | — |

**Code:** `main-vault.tsx` 158–173; styles 381–406.

---

## 5. Folder / tag filter chips — **app only**

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Whole row | **Absent** | "All folders" + user folders/tags (e.g. dev, work) | 🔴 (extra) |
| Active style | — | `accentStrong` fill, `heading` text | — |
| Inactive | — | transparent bg, `glassBorder`, `muted` text 12/600 | — |
| Chip padding | — | `paddingHorizontal 14`, `paddingVertical 6` | — |
| Conditional | — | only shows when folders/tags exist | — |

**Code:** `main-vault.tsx` 175–194; styles 407–426.

---

## 6. Security Pulse alert card

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Card type | Glass card | `GlassCard` | ✅ |
| Card border | Neutral hairline | **Danger-tinted** `rgba(255,138,138,0.3)` | 🟡 |
| Header icon | Warning triangle, **accent/purple** | `AlertTriangle` **danger red**, `size 18` | 🔴 (color) |
| Eyebrow text | "SECURITY PULSE" | "SECURITY PULSE" | ✅ |
| Eyebrow color | **Accent purple** | **Danger red** (`VaultType.label` + `color danger`) | 🔴 |
| Title | "2 Vulnerabilities Detected" — **serif**, large (~22) | "Review 7 password risks" — **sans** `fontSize 20`, `fontWeight 700` | 🔴 (serif→sans) |
| Body | 3-line muted paragraph | `fontSize 14`, `lineHeight 20`, `color body` | ✅ |
| CTA | **"RESOLVE NOW →"** uppercase, accent | **"View Health →"** mixed-case, **danger red** | 🟡 |
| CTA icon | Arrow → accent | `ArrowRight` `size 15`, danger, `strokeWidth 2.5` | 🟡 |
| Header gap | — | `alertHeader gap 12` | ✅ |
| Card top margin | — | `marginTop 24`, inner `gap 10` | ✅ |

**Code:** `main-vault.tsx` 196–217; styles 430–464.

> Whole card uses **red/danger** language in the app, but **purple/accent** in the design. This is the most prominent color-system divergence on the screen.

---

## 7. Vault Health stats card

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Card type | Glass card | `GlassCard` | ✅ |
| Eyebrow | "VAULT HEALTH" accent small-caps | `VaultType.label`, `color accent`, `opacity 0.8` | ✅ |
| Order | eyebrow → progress bar → value → caption | eyebrow → track → value → caption | ✅ |
| Progress track | Thin rounded, dark | `height 4`, `borderRadius 9999`, `bg rgba(255,255,255,0.1)` | ✅ |
| Progress fill | Purple **gradient**, near-full | `LinearGradient accentStrong→accent`, width = `score%` | ✅ |
| Value type | **Serif**, large; `%` smaller superscript | **Sans** `fontSize 40`, `fontWeight 700`, no size contrast on `%` | 🔴 |
| Value color | **Accent purple** | **`heading` (light)** — not purple | 🟡 |
| Caption | "Excellent encryption strength across all assets." | "Health recalculates whenever you add or update credentials." | 🟡 (copy) |
| Caption style | ~14 muted | `fontSize 14`, `color body` | ✅ |
| Card top margin | — | `marginTop 16`, inner `gap 12` | ✅ |

**Code:** `main-vault.tsx` 219–235; styles 465–492.

---

## 8. Credential list grouping

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Grouping | **By category** — multiple sections: "FINANCE", "ENTERTAINMENT", … | **Single group** — "{VIEW} CREDENTIALS" (e.g. "ACTIVE CREDENTIALS") | 🔴 |
| Group header | Category name, small-caps tracked, accent, **with trailing divider line** | View name + divider | 🟡 (label source differs) |
| Header divider | Thin rule beside label | `divider flex 1`, `height 1`, `glassBorder` | ✅ (style) |
| Header style | Small-caps accent | `VaultType.label`, `accent`, `opacity 0.8` | ✅ |
| List gap | even | `groupList gap 12` | ✅ |
| Group top margin | — | `group marginTop 24`, header `marginBottom 16`, header `gap 16` | ✅ |

**Code:** `main-vault.tsx` 237–271; styles 493–514.

> Reference splits the vault into **named category groups**; the app renders **one flat list** under a single view-named header.

---

## 9. Credential row anatomy

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Row shape | Rounded glass | `borderRadius 20`, `glassBackground`, `glassBorder` | ✅ |
| Row padding | ~12 / ~16 | `paddingVertical 12`, `paddingHorizontal 16` | ✅ |
| **Logo tile** | **Circular** | **Rounded square** `48×48`, `borderRadius ≈14`, accent ring | 🔴 |
| Logo fill | Dark translucent | `glassBackgroundStrong` | ✅ |
| Logo→text gap | ~16 | `left gap 16` | ✅ |
| Name | Bold white, 1 line | `fontSize 16`, `fontWeight 600`, `heading`, `numberOfLines 1` | ✅ |
| Detail | Muted, 1 line below | `fontSize 12`, `fontWeight 500`, `muted` | ✅ |
| Name→detail gap | tight | `text gap 2` | ✅ |
| Inline badge | **None** | **Weak / Reused / Old** pill beside name | 🟡 (extra) |
| Trailing controls | **Copy** + **Star** | **Copy** + **Star** | ✅ |
| Copy icon | Muted | `Copy` `size 18`, `muted`, `strokeWidth 1.75` | ✅ |
| Star (favorite) | **Filled = purple/accent** | **Filled = `warning` (amber)**; outline = muted | 🟡 (color) |
| Action button hit | — | `36×36`, `actions gap 6` | ✅ |

**Badge style (app only):** `padH 8`, `padV 2`, `borderRadius 9999`, tinted bg (`color+'22'`) + border (`color+'55'`); text 10/700, `letterSpacing 0.3`. Reused/Breached = `danger`, Weak = `warning`, Old = `accent`.

**Code:** `credential-row.tsx`; `credential-avatar.tsx` (`borderRadius size/3.4`).

---

## 10. Floating action button (FAB)

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Presence | **Fingerprint FAB** bottom-right, purple circle, glow | **No FAB on this screen** | 🔴 |
| Purpose | Biometric quick-unlock affordance | — | — |

> The Main Vault screen renders **no FAB** (`main-vault.tsx` has none). The reference shows a fingerprint/biometric FAB above the nav bar.

---

## 11. Bottom navigation

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Tab count | **4** | **5** | 🔴 |
| Tabs | Grid (active) · Shield · History · Settings | Shield · Grid (active) · Wand · Activity · Settings | 🔴 |
| Active item | Grid | Grid (`active="vault"`) | ✅ (this screen) |
| Active indicator | **Filled rounded-square purple highlight** | Small `4×4` accent **dot** under icon | 🔴 |
| Inactive icon | Muted outline | `muted`, `strokeWidth 1.75` | ✅ |
| Active icon | Bright purple | `accent`, `strokeWidth 2.25` | 🟡 |
| Bar | Dark floating pill | `borderRadius 9999`, `bg rgba(25,14,39,0.92)`, `glassBorder`, `height 66`, side inset 16 | ✅ |

**Code:** `bottom-nav.tsx` 17–23, 61–91.

---

## 12. Background & ambiance

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Base | Very dark purple | `background #190e27` | 🟢 |
| Ambient glow | Soft purple blobs | `ScreenBackground` aurora top-left + bottom-right (bottom-right clearly visible behind list) | 🟡 (placement/scale) |

---

## 13. Color tokens

| Role | Reference (approx) | Implementation token | Verdict |
|------|--------------------|----------------------|---------|
| Brand accent | Vivid violet `~#A855F7` | `accent #deb7ff` / `accentStrong #7b2cbf` | 🟡 |
| Heading text | Light lilac | `heading #eedcff` | ✅ |
| Body text | Muted lilac-grey | `body #cfc2d5` | ✅ |
| Muted text | Low-opacity lilac | `muted rgba(207,194,213,0.6)` | ✅ |
| Card surface | Translucent | `glassBackground rgba(255,255,255,0.03)` | ✅ |
| Border | Faint hairline | `glassBorder rgba(192,192,192,0.2)` | ✅ |
| Security pulse | **Accent purple** | **Danger red** (`danger #ff8a8a`) | 🔴 |
| Favorite star | **Accent purple** | **Warning amber** (`warning #ffd479`) | 🟡 |

---

## 14. Typography

| Element | Reference | Implementation | Verdict |
|---------|-----------|----------------|---------|
| Wordmark | Serif | — (absent) | 🔴 |
| Screen title | Serif bold ~26 | `VaultType.title` serif 28/lh36/600 | ✅ family |
| Subtitle | Sans ~14 muted | 14 muted | ✅ |
| Sort/New btn | Sans 13 | 13/600 accent | ✅ |
| View chips | Sans 13 semibold | 13/600 | ✅ |
| Category chips | — (absent) | 13/600 | (extra) |
| Tag chips | — (absent) | 12/600 | (extra) |
| Pulse eyebrow | Small-caps tracked 12 | `VaultType.label` 12/1.2 | ✅ size |
| Pulse title | **Serif** ~22 | **Sans** 20/700 | 🔴 |
| Pulse body / CTA | Sans 14 | 14 / 14·700 | ✅ |
| Health eyebrow | Small-caps 12 | 12/1.2 | ✅ |
| Health value | **Serif** large, accent | **Sans** 40/700, heading | 🔴 |
| Health caption | Sans 14 | 14 body | ✅ |
| Group header | Small-caps tracked accent | `VaultType.label` accent | ✅ |
| Row name / detail | Sans 16 / 12 | 16/600 · 12/500 | ✅ |

---

## Consolidated discrepancy list

### 🔴 Critical
1. Header missing **SecureVault wordmark**, **import/export icons**, and **avatar**.
2. Header CTA is **"Sort by"** (glass), design is **"+ NEW ITEM"** (accent gradient) — different purpose & weight.
3. View chips are **full-width thirds**; design chips are **content-width, left-aligned**.
4. App adds two filter rows absent from design: **category chips** and **folder/tag chips**.
5. Security Pulse uses **red/danger** color language; design uses **purple/accent**.
6. Security Pulse + Vault Health values are **sans**; design uses **serif** (and design's health value is **accent purple**, app is white).
7. List is **one flat group**; design groups credentials **by category** (FINANCE, ENTERTAINMENT, …).
8. Row logo tile is a **rounded square**; design is a **circle**.
9. **No FAB** on this screen; design has a **fingerprint** FAB.
10. Bottom nav: **5 tabs + dot** vs design's **4 tabs + filled highlight** and different icon set.

### 🟡 Mismatch
11. Subtitle wording "passwords" vs "Items Secured".
12. Brand icon is a rounded-square tile vs a bare shield.
13. Security Pulse card border is red-tinted; design neutral.
14. Favorite star fills **amber**; design fills **purple**.
15. Inline health **badges** on rows are app-only.
16. Accent purple lighter than reference; aurora placement differs.
17. Health/pulse caption & title copy differ.

### 🟢 Minor
18. View chip vertical padding 10 vs ~8.
19. Background base slightly warmer than reference.

---

## Recommended fixes (prioritized, with file targets)

| # | Fix | File | Note |
|---|-----|------|------|
| 1 | Add **SecureVault** wordmark + import/export icons + avatar to header | `main-vault.tsx` 110–127 | match 3-zone header |
| 2 | Replace/augment "Sort by" with **"+ New Item"** accent gradient CTA | `main-vault.tsx` 120–126 | `LinearGradient` pill |
| 3 | Make view chips **content-width** (remove `flex:1`) | styles 360–361 | drop `flex 1` |
| 4 | Recolor Security Pulse to **accent/purple** (icon, eyebrow, CTA, border) | `main-vault.tsx` 202–214, styles 433/442/463 | swap `danger`→`accent` |
| 5 | Make Pulse title + Health value **serif** (+ purple health value) | styles 444–448, 484–488 | `Fonts.serif`, `color accent` |
| 6 | Group credentials **by category** with per-category headers | `main-vault.tsx` 237–271 | sectioned list |
| 7 | Make row logo tile **circular** | `credential-avatar.tsx` 58 | `borderRadius size/2` |
| 8 | Favorite star fill **accent purple** | `credential-row.tsx` 118–119 | `accent` not `warning` |
| 9 | Add **fingerprint** FAB (biometric) or confirm intentional omission | `main-vault.tsx` | new FAB |
| 10 | Bottom nav → **4 tabs** + filled active highlight (or update design ref) | `bottom-nav.tsx` 17–23, 86–90 | match design |
| 11 | Subtitle copy "Items Secured" | `main-vault.tsx` 117 | wording |

### Product decisions (not pure visual)
- The **category** and **folder/tag** filter rows are real app features absent from the design — keep them (and update the reference) or move them behind the "Sort by/Filter" control to match the cleaner design.
- Security Pulse red vs purple: decide whether risk should read as **danger (red)** or stay on-brand **accent (purple)** as designed.

---

## Files in scope

| File | Concerns |
|------|----------|
| `src/components/screens/main-vault.tsx` | Header actions, view-chip width, extra filter rows, pulse color/typography, health typography, list grouping, FAB |
| `src/components/vault/credential-row.tsx` | Star color, inline badges |
| `src/components/vault/credential-avatar.tsx` | Logo tile shape (circle vs square) |
| `src/components/vault/glass-card.tsx` | Card border/surface |
| `src/components/vault/bottom-nav.tsx` | Tab count/order, active indicator |
| `src/components/vault/screen-background.tsx` | Aurora placement/scale |
| `src/constants/vault-theme.ts` | Accent vividness, danger vs accent usage, serif tokens |

---

*Last compared: 2026-06-14 — reference `screenshots/Main Vault.png` vs Expo Go build (1:40 capture).*
