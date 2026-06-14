# Password Health — Figma Design vs. Built Screen (Detailed Comparison)

> Compares the Figma reference **"Password Health Dashboard"** against the implemented
> **`PasswordHealthScreen`** (`src/components/screens/password-health.tsx`, rendered via `src/app/health.tsx`).
> Scope: **typography, layout, structure, components, colors, spacing, iconography, styles.**
> **Dynamic data is intentionally excluded** (score numbers, stat counts, account names, emails, percentages, "days ago", etc.).

Legend: 🟥 = mismatch / missing · 🟧 = partial / differs · 🟩 = matches

---

## 1. Screen header

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Title text | `SecureVault` (app brand) | `Password Health` (screen name) | 🟧 different label intent |
| Title font | Serif (Playfair Display), accent violet | Serif (Playfair Display SemiBold, 24px, `letterSpacing -0.4`, color `accent #b06af0`) | 🟩 font matches |
| Leading control | Hamburger / menu icon | Circular **back button** (`ArrowLeft`, 20px, in a 40×40 glass circle with border) | 🟥 different control |
| Trailing control | Circular **user avatar** (photo) top-right | None | 🟥 missing |
| Header divider | Subtle, blends into background | Hairline bottom border (`headerBorder rgba(76,67,83,0.4)`) on translucent header bg | 🟧 more pronounced bar |

---

## 2. Score / health ring

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Ring style | Circular **progress/gauge** ring with a glowing violet arc + segmented dotted track at the top | **Solid uniform border ring** (`borderWidth 8`, single color), no progress arc, no dotted track | 🟥 |
| Ring color | Violet glow (accent) | Threshold color: green ≥80 / amber ≥50 / coral/danger below | 🟧 semantic color vs. fixed violet |
| Ring size | Large, ~center hero | 160×160, `borderRadius 9999`, glass fill background | 🟩 comparable scale |
| Primary number | Serif, shown as **percentage** (e.g. `%`) | Sans-serif, `fontSize 48`, `fontWeight 700`, color `heading #eedcff`; plain integer | 🟥 serif→sans, and `/ 100` unit instead of `%` |
| Secondary label inside ring | Word label **below the number, inside the ring** (e.g. "GOOD") | `/ 100` unit (14px, muted) inside ring | 🟥 different content |
| Caption under ring | Big serif headline **"Vault Security Health"** + a centered multi-line muted paragraph | Single centered line `body` style ("Your vault health updates live") — no serif headline, no paragraph | 🟥 headline + paragraph missing |

---

## 3. Stats block (Safe / Reused / Weak / Old)

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Layout | **2×2 grid of four separate cards** | **Single horizontal row** of four items inside one glass card | 🟥 |
| Per-stat icon | Each card has an **icon** (shield-check, history/clock, warning triangle, clock) in a corner | **No icons** — number + label only | 🟥 |
| Card tinting | Some cards carry a status tint (e.g. weak = reddish, old = amber wash) | No per-stat tint; numbers are colored, container is neutral glass | 🟧 |
| Number style | Large serif-leaning numerals | `fontSize 28`, `fontWeight 700`, sans; colored per status (`success / danger / warning / accent`) | 🟧 |
| Label style | Uppercase small caption under number | `fontSize 12`, `fontWeight 500`, color `muted`, normal case (e.g. "Safe") | 🟧 case differs |
| Container | Four bordered glass tiles with gaps | One rounded container: `borderRadius 24`, `borderWidth 1`, `glassBorder`, `glassBackground`, `paddingVertical 20` | 🟥 |

---

## 4. Breach Monitor section

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Presence | **Not present** in the design | Full section: title + glass card with scan icon, explainer text, and an outline pill button | 🟥 added in build |
| Title | — | `sectionTitle` (sans, 18px/600) "Breach Monitor" | n/a |
| Button | — | Outline pill (`height 48`, `borderRadius 9999`, `accentSoft` fill, `accent` border @ 55, accent label 700) | n/a |

---

## 5. "Needs Attention" section

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Section title font | **Serif** (Playfair), elegant | **Sans-serif** `heading` (18px, `fontWeight 600`, `letterSpacing 0.2`, `heading` color) | 🟥 serif→sans |
| "View All" link | Present on the right, accent colored | **Missing** | 🟥 |
| Item count | Curated short list (~3 highlighted) | Full scrollable list of every affected credential (uncapped) | 🟧 |
| Row leading | Rounded-square icon tile, status-tinted background | `attentionIcon` 40×40, `borderRadius 12`, bg = status color @ `22` alpha, `ShieldAlert` 18px in status color | 🟩 close |
| Row middle | Name (bold) + uppercase sub-label (e.g. "WEAK PASSWORD") | `attentionName` 15px/600 `heading`; `attentionMeta` 12px `muted`, sentence case ("Weak password · …") | 🟧 case differs |
| Row trailing | **Filled pill button** with verb ("Update" / "Change" / "Rotate") | **Text link + chevron** (`attentionActionText` 13px/700 in status color, `ChevronRight` 16px muted) — no pill | 🟥 |
| Action color mapping | Per-issue accent | weak→`warning`, reused→`danger`, old→`accent` (`ISSUE_META`) | 🟩 logic present |
| Card surface | Glass card per row | `GlassCard` row: `borderRadius 32`, `borderWidth 1`, `glassBorder`, `padding 20`, gap 14 | 🟩 |

---

## 6. "Reused Groups" section

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Section title font | Serif (Playfair) | Sans `heading` | 🟥 |
| Group title | Named group label (e.g. "Shared Secret #1") | No group title — straight to explainer body | 🟥 |
| Risk badge | **"High Risk" pill** (violet) top-right | Missing | 🟥 |
| Member display | Small **circular avatars** of members | **Full member rows**: `KeyRound` icon + `website · username` text + `ChevronRight`, on inset glass pills (`borderRadius 14`) | 🟥 different pattern |
| Explainer text | Small muted caption beneath | `reusedBody` 14px/lineHeight20 `body` | 🟧 |
| Card accent | Neutral glass | Card uses reddish border tint `rgba(255,138,138,0.3)` + reddish icon tile | 🟧 build adds danger tint |
| Header icon | — | `Copy` icon 18px in danger color, in `rgba(255,138,138,0.15)` tile | n/a |

---

## 7. "Old passwords" callout

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Presence | Folded into the "Main Bank Account / LAST UPDATED … AGO" attention row | Separate standalone glass callout: `Clock` 18px accent + body text | 🟧 different placement |

---

## 8. "Secure Tips" section

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Section title font | Serif (Playfair) | Sans `heading` | 🟥 |
| Section title accessory | Lightbulb icon **to the right of the title** | No title accessory | 🟥 |
| Tip layout | **Bulleted list** with small **check/tick** markers, inline within one block | **Separate glass cards**, one per tip, each with a **lightbulb** icon (`Lightbulb` 18px accent) + text | 🟥 list→cards, tick→lightbulb |
| Tip text style | Small body text | `tipText` 14px/lineHeight20 `body` | 🟩 |

---

## 9. Primary CTA button

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Label | **"Quick Fix All"** | **"RE-SCAN VAULT"** (uppercase) | 🟥 different action |
| Icon | None | `RefreshCw` 16px leading, `buttonText` color | 🟧 build adds icon |
| Fill | Gradient violet pill | `LinearGradient` `accentStrong → accent`, diagonal (0,0)→(1,1) | 🟩 |
| Shape | Full-width pill | `height 56`, `borderRadius 9999` | 🟩 |
| Text style | Centered, medium weight | 14px, `fontWeight 700`, `letterSpacing 1.4`, color `buttonText #2d0050` | 🟧 heavier + tracked caps |

---

## 10. Bottom navigation

| Aspect | Figma design | Built screen | Status |
|---|---|---|---|
| Item count | **4 icons** | **5 icons** (Dashboard / Vault / Generator / Health / Settings) | 🟥 |
| Icon set | grid, lock/shield, history, gear | `Shield`, `LayoutGrid`, `Wand2`, `Activity`, `Settings` (lucide, outline) | 🟧 |
| Active indicator | Center icon in a **violet circle** | Active icon in a **violet rounded square** (`iconWrapActive` bg `accentStrong`, `borderRadius 14`) | 🟧 circle→rounded-square |
| Active item | Center (lock/shield) | `Activity` (health) | 🟧 contextual |
| Bar shape | Floating rounded bar | Floating pill bar: `height 66`, `borderRadius 9999`, bg `rgba(25,14,39,0.92)`, `glassBorder`, left/right inset 16 | 🟩 |

---

## 11. Global tokens (theme)

| Token | Value (build) | Notes vs. design |
|---|---|---|
| Background | `#140b20` (deep aubergine) + ambient `AnimatedBlobs` aurora | 🟩 matches dark violet base |
| Heading text | `#eedcff` | 🟩 |
| Body text | `#cfc2d5` | 🟩 |
| Muted text | `rgba(207,194,213,0.6)` | 🟩 |
| Accent | `#b06af0` | 🟩 |
| Accent strong | `#7b2cbf` | 🟩 |
| Success / Warning / Danger | `#7ee0b8` / `#ffd479` / `#ff8a8a` | 🟩 status palette present |
| Glass surface | bg `rgba(255,255,255,0.03)`, border `rgba(192,192,192,0.2)` | 🟩 glassmorphism present |
| Card radius | `lg = 32` (`GlassCard`) | 🟩 large rounded cards |
| Screen padding | `paddingHorizontal 20`, `paddingTop 16` | 🟩 |
| Section spacing | `sectionTitle marginTop 32 / marginBottom 16` | 🟧 design rhythm slightly tighter in places |

---

## 12. Key typography findings (summary)

1. 🟥 **Section titles** ("Needs Attention", "Reused Groups", "Secure Tips") are **serif (Playfair)** in the design but **sans-serif** (`VaultType.heading`) in the build — the single most repeated typographic mismatch.
2. 🟥 **The hero score number** is **serif** in the design but **sans-serif 48/700** in the build.
3. 🟥 The serif headline **"Vault Security Health"** under the ring is **not implemented**.
4. 🟧 **Sub-labels / meta text** are **UPPERCASE** in the design (e.g. "WEAK PASSWORD") vs. **sentence case** in the build.
5. 🟩 The header brand title and the screen background, glass surfaces, accent palette, gradient CTA, and floating nav bar are faithful to the design system.

---

## 13. Structural differences (summary)

- 🟥 Stats: design = **2×2 icon cards**; build = **single icon-less row**.
- 🟥 Attention rows: design = **filled pill buttons**; build = **text link + chevron**.
- 🟥 Reused groups: design = **named group + "High Risk" pill + avatars**; build = **explainer + member rows**.
- 🟥 Secure tips: design = **bulleted ticks in one block**; build = **individual lightbulb cards**.
- 🟥 **Breach Monitor** section exists only in the build.
- 🟥 CTA: **"Quick Fix All"** (design) vs **"RE-SCAN VAULT"** (build).
- 🟥 Bottom nav: **4 items** (design) vs **5 items** (build); circle vs rounded-square active state.
- 🟥 Header: **menu + avatar** (design) vs **back button only** (build).
