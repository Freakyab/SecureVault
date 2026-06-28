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

## ⚪ Documentation & Archival
The following assets are identified as legacy or archival and may be moved to an `archive/` directory.

### Legacy Task Logs
- `Mds/TASKS.part-01.md`
- `Mds/TASKS.part-02.md`
- `Mds/TASKS.part-03.md`
- `Mds/TASKS.part-04.md`
- `Mds/TASKS.part-05.md`
- `Mds/ROADMAP.part-01.md`
- `Mds/ROADMAP.part-02.md`
- `Mds/ROADMAP.part-03.md`
- `Mds/BUGS.part-01.md`
- `Mds/BUGS.part-02.md`
- `Mds/BUGS.part-03.md`

### Redundant Specifications
- `Mds/animated-blobs.md` - Implementation is already stable and integrated.

---

## 🛠 Cleanup Strategy
1. **Phase 1:** Remove High Confidence files.
2. **Phase 2:** Verify `collapsible.tsx` usage via global search; if null, remove.
3. **Phase 3:** Remove `themed-text.tsx` and `themed-view.tsx` after verifying no other dependents.
4. **Phase 4:** Archive `Mds/` legacy logs.
