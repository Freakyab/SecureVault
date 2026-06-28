# Decisions & Risks

## Open decisions

| # | Decision | Options | Chosen | Date |
|---|----------|---------|--------|------|
| D1 | v1 storage model | Offline only / Cloud day one | **Offline only** | 2026-05-16 |
| D2 | Unlock method | Master password / Biometrics / Both | **Master password** | 2026-05-16 |
| D5 | State management | Context + useReducer / Zustand | **React Context** | 2026-05-16 |
| D3 | Styling | NativeWind / StyleSheet | **StyleSheet** | 2026-05-16 |
| D4 | Icons | lucide-react-native / @expo/vector-icons | **lucide-react-native** | 2026-05-16 |
| D7 | Dark mode timing | Phase 1 with UI / Phase 5 later | **Phase 1 with UI** | 2026-05-16 |
| D6 | Breach API in v1 | Yes / No | **Yes — HIBP k-anonymity only** | 2026-06-13 |

## Risks & mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Weak custom crypto | Critical | Use well-reviewed libraries; security review in Phase 5 |
| Scope creep (sync early) | Delays MVP | Ship Phases 1–5 offline-first; Phase 9 optional |
| Expo Go limitations | Blocks native modules | Plan EAS dev build before Phase 3 |
| Prototype ≠ mobile UX | Rework | Skip DeviceFrame; use native patterns from Phase 1 |
