# Dead Code & Unused Files Analysis

This document tracks the identified dead code and unused files within the SecureVault project to facilitate repository cleanup and improve maintainability.

## 🔴 High Confidence (Safe to Delete)

These files are not imported anywhere in the `src` directory and serve no functional purpose in the current version of the application.

### Components

- `src/components/external-link.tsx`
- `src/components/web-badge.tsx`
- `src/components/hint-row.tsx`

---

## 🟡 Medium Confidence (Review Required)

These components are exported in index files but have no visible usage in any screen, or are dependencies of other unused components.

### UI Primitives

- `src/components/ui/collapsible.tsx` - Exported in `ui/index.ts` but not utilized in any active screen.
- `src/components/themed-text.tsx` - Primarily used by `hint-row.tsx` and `web-badge.tsx` (both unused).
- `src/components/themed-view.tsx` - Primarily used by `hint-row.tsx` and `web-badge.tsx` (both unused).

---

## 🛠 Cleanup Strategy

1. **Phase 1:** Remove High Confidence files.
2. **Phase 2:** Verify `collapsible.tsx` usage via global search; if null, remove.
3. **Phase 3:** Remove `themed-text.tsx` and `themed-view.tsx` after verifying no other dependents.
4. **Phase 4:** Archive `Mds/` legacy logs.
