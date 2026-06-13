# Dashboard — Detailed Design vs Implementation Comparison

Exhaustive element-by-element audit of the **design reference** (`screenshots/Dashboard.png`) against the **current build** (Expo Go, 2026-06-14).

> Scope: **typography, layout, styles, color, spacing, iconography, component anatomy, and states.**
> Dynamic content (credential names, item counts, emails, health numbers) is **excluded** by design.

| | Reference | Implementation |
|---|-----------|----------------|
| **Source** | `screenshots/Dashboard.png` | `src/components/screens/dashboard.tsx` |
| **Overall fidelity** | — | **Partial** — vertical structure matches; header, category-card anatomy, recently-used trailing control, CTA, and bottom nav diverge |

Legend: 🔴 Critical · 🟡 Mismatch · 🟢 Minor · ✅ Matches

---

## 1. Top header

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Structure | 3 zones: menu · **wordmark** · actions | 2 zones: menu + title · avatar | 🔴 |
| Left icon | Hamburger, accent-purple tint | Hamburger, `VaultColors.heading` (`#eedcff`), `size 18`, `strokeWidth 2` | 🟢 |
| Brand/title | **"SecureVault"** serif wordmark, accent purple, centered-left | **"Dashboard"** serif (`VaultType.title`, `fontSize 22`), left-aligned beside menu | 🔴 |
| Notification bell | **Present**, right side, outline bell, accent tint | **Missing** | 🔴 |
| Avatar | Circular **profile photo** (real image), thin ring | Empty circular placeholder, `38×38`, `bg #30253f`, `border rgba(76,67,83,0.3)` | 🟡 |
| Header padding | Comfortable top inset, `~20px` horizontal | `paddingHorizontal 20`, `paddingTop insets.top + 12`, `paddingBottom 12` | ✅ |
| Leading gap (menu→title) | tight | `gap 16` | 🟢 |

**Code:** `dashboard.tsx` 58–76; `headerTitle` style 219–223.

---

## 2. Hero / greeting block

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Greeting text | "Hello, SecureVault" | "Hello, SecureVault" | ✅ |
| Greeting font | Serif, **bold**, ~24px, single line | `VaultType.title` serif, `fontSize 28`, `lineHeight 36`, `fontWeight 600` | 🟡 (app larger) |
| Greeting color | Light lilac `#eedcff`-ish | `VaultColors.heading #eedcff` | ✅ |
| Subtext | "Your digital assets are protected by cosmic encryption." | Same copy | ✅ |
| Subtext font | ~14px regular, muted | `VaultType.body` `fontSize 16`, `lineHeight 24`, `color #cfc2d5` | 🟡 (app larger) |
| Subtext wrap | Wraps to 2 lines | Wraps to 2 lines | ✅ |
| Top gap to greeting | Generous | `content paddingTop 8` after header | 🟢 |
| Subtext top margin | small | `marginTop 6` | ✅ |

---

## 3. Search bar

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Shape | Full-width rounded capsule | Rounded rect, `borderRadius 20` | 🟡 (less pill) |
| Height | Tall (~56px) | `height 56` | ✅ |
| Left icon | **None** (or extremely faint) | Magnifying glass `Search`, `size 18`, `color muted`, `strokeWidth 1.75` | 🟡 (extra) |
| Placeholder | "Search passwords, keys, or folders" | "Search passwords, keys, or folders**...**" | 🟢 (trailing ellipsis) |
| Placeholder color | Muted lilac | `VaultColors.placeholder rgba(207,194,213,0.4)` | ✅ |
| Right element | **⌘ K** shortcut chip | **Missing** | 🟡 |
| Border | Subtle glass hairline | `borderColor glassBorder rgba(192,192,192,0.2)`, `borderWidth 1` | ✅ |
| Fill | Translucent dark | `glassBackground rgba(255,255,255,0.03)` | ✅ |
| Inner padding | ~16px | `paddingHorizontal 16`, `gap 12` | ✅ |
| Top margin | — | `marginTop 24` | ✅ |

---

## 4. Section header ("Manage Passwords")

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Label text | "MANAGE PASSWORDS" | "MANAGE PASSWORDS" | ✅ |
| Label style | Uppercase, tracked, accent, small | `VaultType.label` `fontSize 12`, `letterSpacing 1.2`, `color accent`, `opacity 0.8` | ✅ |
| Action text | **"View All"** | **"See all"** | 🟡 |
| Action style | Accent, small, semibold | `fontSize 12`, `fontWeight 600`, `color accent` | ✅ |
| Alignment | Space-between row | `justifyContent space-between` | ✅ |
| Top margin | — | `marginTop 32` | ✅ |

---

## 5. Category grid layout

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Columns | 2 | 2 (`gridItem width 47%`) | ✅ |
| Rows | 3 (6 cards) | 3 (6 cards) | ✅ |
| Gutter | Even gap both axes | `gap 16` | ✅ |
| Card flow | Wrap | `flexWrap wrap` | ✅ |
| Grid top margin | — | `marginTop 16` | ✅ |

---

## 6. Category card anatomy

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Card shape | Strongly rounded (near-pill, ~28–32 radius) | `borderRadius 24` | 🟡 |
| Card fill | Translucent dark | `glassBackground rgba(255,255,255,0.03)` | ✅ |
| Card border | Faint hairline | `glassBorder`, `borderWidth 1` | ✅ |
| Card min height | ~120px | `minHeight 108` | 🟢 |
| Content align | Centered (icon over label) | `alignItems center`, `justifyContent center`, `gap 8` | ✅ |
| **Icon container** | **Perfect circle** | **Rounded square** `borderRadius 14`, `48×48` | 🔴 |
| Icon container fill | Soft purple; **active card = solid bright purple** | `accentSoft rgba(123,44,191,0.2)` — no active/selected state | 🟡 |
| Icon | Outline, centered | `size 20`, `color accent`, `strokeWidth 1.75` | ✅ |
| Label | One word, centered, semibold | Centered, `fontSize 14`, `fontWeight 600`, `color heading` | ✅ |
| **Count line** | **Absent** | **"X items"** `fontSize 11`, `fontWeight 500`, `color muted` | 🔴 (extra element) |
| Selected state | First card visibly active (filled) | No selected state | 🟡 |

**Code:** `category-card.tsx` 13–63.

### Category set (product-model difference, names are not "data")

| Slot | Reference | Implementation |
|------|-----------|----------------|
| 1 | Website — globe icon | Logins — key icon |
| 2 | Social — people icon | Cards — credit-card icon |
| 3 | Finance — bank icon | Notes — document icon |
| 4 | Mail — envelope icon | Identity — user icon |
| 5 | Secret — padlock icon | Wi-Fi — wifi icon |
| 6 | App — grid/apps icon | API Keys — server icon |

🔴 The app uses **credential-type** categories (`constants/categories.ts`), the design uses **folder/topic** categories. Different taxonomy and icon set.

---

## 7. "Recently Used" section header

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Label | "RECENTLY USED" | "RECENTLY USED" | ✅ |
| Style | Same small-caps tracked accent as Manage | `sectionTitle` + `recentTitle` (`marginTop 32`, `marginBottom 16`) | ✅ |

---

## 8. Recently-used row (credential row) anatomy

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Row shape | Rounded rect, translucent | `borderRadius 20`, `glassBackground`, `border glassBorder` | ✅ |
| Row padding | ~12–16px | `paddingVertical 12`, `paddingHorizontal 16` | ✅ |
| Row gap (list) | even | `recentList gap 12` | ✅ |
| Logo tile | Rounded square, brand logo, dark fill | `CredentialAvatar` `48×48`, `borderRadius size/3.4 ≈ 14`, `glassBackgroundStrong`, accent ring | ✅ |
| Logo→text gap | ~16px | `left gap 16` | ✅ |
| Name | Bold white, single line | `fontSize 16`, `fontWeight 600`, `color heading`, `numberOfLines 1` | ✅ |
| Detail line | Muted, single line, below name | `fontSize 12`, `fontWeight 500`, `color muted` | ✅ |
| Name→detail gap | tight | `text gap 2` | ✅ |
| Inline badge | **None** in reference | **Present** — Weak/Reused/Old pill beside name | 🟡 (extra) |
| **Trailing control** | **Chevron `>`** | **Copy icon** (when `onCopy` set) | 🔴 |
| Trailing icon size | — | `18`, `color muted` | — |

**Badge style (app only):** `paddingHorizontal 8`, `paddingVertical 2`, `borderRadius 9999`, color-tinted bg (`+'22'`) and border (`+'55'`); text `fontSize 10`, `fontWeight 700`, `letterSpacing 0.3`. Colors: Reused/Breached `danger #ff8a8a`, Weak `warning #ffd479`, Old `accent`.

**Code:** `credential-row.tsx` 62–200; `credential-avatar.tsx`.

> The reference always shows a chevron because rows are navigational; the app swaps in a **copy** affordance (and inline health badges) → biggest interaction-level divergence in this section.

---

## 9. Security Health card

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Card type | Gradient panel | `LinearGradient` `rgba(123,44,191,0.35)`→`rgba(222,183,255,0.12)`, diagonal | ✅ |
| Card radius | Large (~28–32) | `borderRadius 32` | ✅ |
| Card padding | Generous | `padding 24`, `gap 12` | ✅ |
| Card border | Faint | `glassBorder`, `borderWidth 1` | ✅ |
| Title | "Security Health", serif | `fontSize 18`, `fontWeight 700` — **not serif** | 🟡 |
| Body | 2–3 lines muted | `fontSize 14`, `lineHeight 20`, `color body` | ✅ |
| **CTA button** | **Purple→light-purple gradient** pill | **Solid light** pill, `backgroundColor heading (#eedcff)` — no gradient | 🔴 |
| CTA label | "Check Now" | "Check Now" | ✅ |
| CTA text | Light on purple | `fontSize 13`, `fontWeight 700`, `color buttonText #2d0050` (dark on light) | 🟡 |
| CTA shape | Pill, left-aligned | `borderRadius 9999`, `alignSelf flex-start`, `padH 20`, `padV 10` | ✅ |
| Top margin | — | `marginTop 32` | ✅ |

**Code:** `dashboard.tsx` 160–179; styles 301–332.

---

## 10. Floating action button (FAB)

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Position | Bottom-right, clearly **above** nav bar | `position absolute`, `right 24`, `bottom insets.bottom + 90` | 🟡 (overlaps content in app) |
| Size | ~56px circle | `56×56`, `borderRadius 9999` | ✅ |
| Fill | Bright purple, **strong outer glow** | `LinearGradient accentStrong→accent` + `vaultShadow` (softer glow) | 🟡 |
| Icon | `+`, light on purple | `Plus` `size 22`, `strokeWidth 2.5`, `color buttonText #2d0050` (dark) | 🟡 |

**Code:** `dashboard.tsx` 181–193; styles 336–350.

---

## 11. Bottom navigation

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Tab count | **4** | **5** | 🔴 |
| Tabs | Grid (active) · Shield · History/Clock · Settings | Shield (active) · Grid · Wand · Activity · Settings | 🔴 |
| Active item | Grid/Home | Shield | 🔴 |
| Active indicator | **Filled rounded-square purple highlight** behind icon | Small `4×4` accent **dot** under icon | 🔴 |
| Inactive icon | Muted outline | `color muted`, `strokeWidth 1.75` | ✅ |
| Active icon | Bright purple | `color accent`, `strokeWidth 2.25` | 🟡 |
| Bar shape | Dark floating pill | `borderRadius 9999`, `bg rgba(25,14,39,0.92)`, `border glassBorder` | ✅ |
| Bar inset | Floating with side margins | `left 16`, `right 16`, `bottom 0`, `height 66` | ✅ |
| Icon size | — | `22` | ✅ |

**Code:** `bottom-nav.tsx` `ITEMS` 17–23; styles 61–91.

---

## 12. Background & ambiance

| Property | Reference | Implementation | Verdict |
|----------|-----------|----------------|---------|
| Base color | Very dark purple `#120F1D`-ish | `VaultColors.background #190e27` | 🟢 |
| Ambient glow | Large soft purple blobs (top-left + lower area) | `ScreenBackground` aurora: top-left `rgba(222,183,255,0.12)`, bottom-right `rgba(123,44,191,0.18)` | 🟡 (placement/scale differ) |
| Glow shape | Big diffuse organic | Two rounded ovals `200×360` / `220×440` | 🟡 |

**Code:** `screen-background.tsx`.

---

## 13. Color tokens

| Role | Reference (approx) | Implementation token | Verdict |
|------|--------------------|----------------------|---------|
| Brand accent | Bright violet `~#A855F7` | `accent #deb7ff` (light) / `accentStrong #7b2cbf` | 🟡 (app accent lighter for icons) |
| Heading text | Light lilac | `heading #eedcff` | ✅ |
| Body text | Muted lilac-grey | `body #cfc2d5` | ✅ |
| Muted text | Low-opacity lilac | `muted rgba(207,194,213,0.6)` | ✅ |
| Card surface | Translucent white-on-dark | `glassBackground rgba(255,255,255,0.03)` | ✅ |
| Border | Faint grey hairline | `glassBorder rgba(192,192,192,0.2)` | ✅ |
| Danger (badge) | red | `danger #ff8a8a` | ✅ |
| Warning (badge) | amber | `warning #ffd479` | ✅ |

---

## 14. Typography

| Element | Reference | Implementation | Verdict |
|---------|-----------|----------------|---------|
| Header brand/title | Serif | Serif (`VaultType.title`, 22) | ✅ family |
| Greeting | Serif bold ~24 | Serif 28 / lh 36 / 600 | 🟡 size |
| Sub-greeting | Sans ~14 | Sans 16 / lh 24 | 🟡 size |
| Section labels | Sans uppercase, tracked 12 | 12 / `letterSpacing 1.2` / 500 | ✅ |
| Card label | Sans 14 semibold | 14 / 600 | ✅ |
| Card count | — | 11 / 500 muted | (extra) |
| Row name | Sans 16 semibold | 16 / 600 | ✅ |
| Row detail | Sans 12 | 12 / 500 muted | ✅ |
| Health title | Serif | **Sans** 18 / 700 | 🟡 |
| Health body | Sans 14 | 14 / lh 20 | ✅ |
| CTA / badge | Sans bold small | 13/700, 10/700 | ✅ |

Font families: `VaultType.brand/title` use `Fonts.serif`; everything else system sans.

---

## Consolidated discrepancy list

### 🔴 Critical
1. Header shows **"Dashboard"** title, not the **SecureVault wordmark**; no **notification bell**; avatar has no photo.
2. Category icon container is a **rounded square**, design is a **circle**; design shows an **active/selected** category, app has none.
3. Category cards include a **"X items"** count line absent from the design.
4. Recently-used rows use a **copy icon** trailing control; design uses a **chevron `>`**.
5. Security Health **CTA** is a flat light pill; design is a **purple gradient** pill.
6. Bottom nav has **5 tabs** with a **dot** indicator; design has **4 tabs** with a **filled highlight** and a different tab/icon set + active tab.

### 🟡 Mismatch
7. Search: extra left search icon, missing **⌘K** chip, placeholder ends with `...`, less pill-shaped.
8. Greeting/sub-greeting font sizes larger than reference.
9. FAB glow weaker and overlaps content; `+` icon is dark, not light.
10. Health card title is sans, design is serif.
11. Accent purple in app is lighter than the reference's vivid violet.
12. Aurora glow placement/scale differs from reference blobs.
13. Inline health **badges** on rows are an app-only addition.

### 🟢 Minor
14. Section action wording "See all" vs "View All".
15. Card radius 24 vs design's near-pill rounding.
16. Background base `#190e27` slightly warmer than reference.

---

## Recommended fixes (prioritized, with file targets)

| # | Fix | File | Value |
|---|-----|------|-------|
| 1 | Center **SecureVault** serif wordmark; drop/relocate "Dashboard" | `dashboard.tsx` (header 58–76) | use `VaultType.brand` |
| 2 | Add notification **bell** + real avatar image | `dashboard.tsx` | `Bell` lucide, `size 22` |
| 3 | Make category icon container a **circle** + add active state | `category-card.tsx` (iconWrap 45–52) | `borderRadius 24` (= width/2) |
| 4 | Hide/remove **count line** to match design | `category-card.tsx` 58–61 | conditional render |
| 5 | Use **chevron** on dashboard recents (drop copy on this surface) | `dashboard.tsx` 127–145 | omit `onCopy` |
| 6 | Apply **gradient** to "Check Now" button | `dashboard.tsx` 175–177 | `LinearGradient` accent |
| 7 | Rework bottom nav to **4 tabs** + filled active highlight (or update design ref to the 5-tab IA) | `bottom-nav.tsx` 17–23, 86–90 | match design icons |
| 8 | Remove placeholder `...`, add **⌘K** chip | `dashboard.tsx` 88 | platform-gated chip |
| 9 | Strengthen FAB glow, light `+` icon | `dashboard.tsx`/`vault-theme.ts` | brighten `vaultShadow`, `color heading` |
| 10 | Health title to **serif** | `dashboard.tsx` 310–314 | `Fonts.serif` |
| 11 | Rename "See all" → "View All" | `dashboard.tsx` 103 | text |

### Product decisions (not pure visual)
- Keep **credential-type** categories (Logins/Cards/…) vs design's **folder** categories (Website/Social/…)? If the app model is canonical, update `screenshots/Dashboard.png` instead of the code.
- Keep inline health badges on dashboard rows? They improve UX but deviate from the reference.

---

## Fixes applied — 2026-06-14 (Run 8)

Visual-fidelity pass against `screenshots/Dashboard.png`. Functional IA preserved where it would orphan real screens.

| # | Fix | Status | File |
|---|-----|--------|------|
| 1 | Header → **SecureVault** serif wordmark (`VaultType.brand`, accent) beside menu; replaced "Dashboard" title | ✅ | `dashboard.tsx` |
| 2 | Added notification **Bell** (accent, 22) + **avatar** now shows a `User` fallback icon (no photo asset in repo) | ✅ | `dashboard.tsx` |
| 3 | Category icon container → **circle** (`borderRadius 24` = w/2); added **active** state (`accentStrong` fill, heading icon) | ✅ | `category-card.tsx` |
| 4 | Removed **"X items" count line** from cards (count kept for a11y label only) | ✅ | `category-card.tsx` |
| 5 | Dashboard recents now use the **chevron** (dropped `onCopy` on this surface) | ✅ | `dashboard.tsx` |
| 6 | "Check Now" CTA → **purple→light gradient** pill; Health title → **serif** | ✅ | `dashboard.tsx` |
| 7 | Section action **"See all" → "View All"** | ✅ | `dashboard.tsx` |
| 8 | Search: dropped trailing `...`, added **⌘K** chip | ✅ | `dashboard.tsx` |
| 9 | FAB: stronger glow (`vaultShadow` opacity 0.55 / radius 22 / elevation 14) + **light** `+` icon | ✅ | `dashboard.tsx`, `vault-theme.ts` |
| 10 | Greeting/sub-greeting sizes brought down to reference (24/14) | ✅ | `dashboard.tsx` |
| 11 | Bottom nav: dot → **filled rounded-square active highlight** (`accentStrong`, light icon) | ✅ | `bottom-nav.tsx` |

### Follow-up — color + font fidelity (Run 8b)

Closed the two remaining theme gaps flagged above (🟡 #11 accent, 🟢 #16 background, + typography family):

| Gap | Before | After | File |
|-----|--------|-------|------|
| Brand accent too pale | `accent #deb7ff` | `accent #b06af0` (vivid violet, closer to reference `~#a855f7`); `accentSoft` opacity 0.2 → 0.25 | `vault-theme.ts` (+ `_layout.tsx`, `setup-master-password.tsx`) |
| Background too warm | `#190e27` | `#140b20` (cooler near-black); `backgroundDeep` `#120a1c` → `#0f0818` | `vault-theme.ts`, `_layout.tsx`, `app.json` |
| Serif was OS fallback (Noto Serif / New York) | `Fonts.serif: 'serif' / 'ui-serif'` | **Playfair Display** loaded via `@expo-google-fonts/playfair-display`; `SerifFont` weight map; `VaultType.brand/title` use `PlayfairDisplay_600SemiBold` | `theme.ts`, `vault-theme.ts`, `_layout.tsx` |

Fonts load in `app/_layout.tsx` via `useFonts` + `expo-splash-screen` gate (render held until loaded). Now the typography family matches the reference's high-contrast display serif, not just "a serif."

**Deferred (product decisions, intentionally not changed):**
- **Category taxonomy** — kept credential-type categories (Logins/Cards/…); the app model is canonical. Design `screenshots/Dashboard.png` shows folder categories.
- **Bottom-nav tab count** — kept **5** functional tabs (Dashboard/Vault/Generator/Health/Settings); reducing to the design's 4 would orphan the Generator + Health screens. Only the active-indicator style was matched.
- **Inline health badges** on recents — kept (UX win) even though absent from the reference.

---

## Files in scope

| File | Concerns |
|------|----------|
| `src/components/screens/dashboard.tsx` | Header, search, section action, recents trailing control, health CTA copy/style, FAB |
| `src/components/vault/category-card.tsx` | Icon container shape, count line, active state |
| `src/components/vault/credential-row.tsx` | Trailing control (chevron vs copy), badges |
| `src/components/vault/bottom-nav.tsx` | Tab count/order, icons, active indicator |
| `src/components/vault/screen-background.tsx` | Aurora glow placement/scale |
| `src/constants/vault-theme.ts` | Accent vividness, CTA gradient, FAB glow |
| `src/constants/categories.ts` | Category taxonomy (only if matching design names) |

---

*Last compared: 2026-06-14 — reference `screenshots/Dashboard.png` vs Expo Go build (1:33 capture).*
*Fixes applied: 2026-06-14 (Run 8) — see "Fixes applied" section above. `npm run lint` → 0 errors.*
