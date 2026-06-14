# Password Health — Figma Alignment Implementation Plan

Based on `Mds/Password-Health-Figma-vs-Build.md`.

## Phase 1 — Core visual alignment ✅ (implemented)

| # | Task | Status |
|---|------|--------|
| 1 | Add `VaultType.sectionHeading` serif token (Playfair 22px) | ✅ |
| 2 | `ScoreRing` SVG gauge: dotted track + gradient arc + `%` + status word | ✅ |
| 3 | Serif headline "Vault Security Health" + descriptive blurb | ✅ |
| 4 | Stats → 2×2 icon cards with status tints + uppercase labels | ✅ |
| 5 | Serif section titles (Needs Attention, Reused Groups, Secure Tips) | ✅ |
| 6 | "View All" toggle on Needs Attention (cap at 3 items) | ✅ |
| 7 | Attention rows → filled pill action buttons | ✅ |
| 8 | Reused Groups → "Shared Secret #N" + "High Risk" pill | ✅ |
| 9 | Secure Tips title → lightbulb accessory on right | ✅ |
| 10 | CTA → "Quick Fix All" gradient pill (no icon) | ✅ |

### Files changed
- `src/constants/vault-theme.ts` — `sectionHeading` token
- `src/components/vault/score-ring.tsx` — new SVG gauge component
- `src/components/vault/index.ts` — export `ScoreRing`
- `src/components/screens/password-health.tsx` — full layout restyle

## Phase 2 — Remaining gaps (not yet implemented)

| # | Task | Priority | Notes |
|---|------|----------|-------|
| 11 | Secure Tips → bulleted checklist with tick icons (single block) | Medium | Design uses inline list, not per-tip cards |
| 12 | Reused Groups → circular member avatars instead of full rows | Low | Functional rows kept for navigation |
| 13 | Score ring glow / shadow effect on arc | Low | SVG gradient arc done; glow filter optional |
| 14 | Bottom nav active indicator → circle instead of rounded square | Low | App-wide nav pattern |
| 15 | Header → menu + avatar (design) vs back button (sub-screen) | N/A | Sub-screen pattern is correct for routed page |

## Phase 3 — Intentionally preserved (build-only features)

- **Breach Monitor** section — functional feature not in Figma mock
- **5-tab bottom nav** — matches app architecture (Dashboard, Vault, Generator, Health, Settings)
- **Back button header** — correct for a pushed sub-screen vs. dashboard root

## Status word tiers (score → label)

| Score | Label | Color |
|-------|-------|-------|
| ≥ 90 | FORTIFIED | success green |
| ≥ 60 | GOOD | accent violet |
| ≥ 40 | FAIR | warning amber |
| < 40 | AT RISK | danger coral |
