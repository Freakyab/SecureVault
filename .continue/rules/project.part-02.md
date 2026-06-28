
> _Continued from [project.md](./project.md) — Part 1._

# Important Files

| File                                  | Purpose                                                   |
| ------------------------------------- | --------------------------------------------------------- |
| `src/app/_layout.tsx`                 | Root providers, font loading, splash, navigation theme    |
| `src/contexts/vault-context.tsx`      | Vault session, CRUD, auto-lock, screen capture policy     |
| `src/services/vault-storage.ts`       | Encrypted persistence, legacy migration                   |
| `src/services/crypto/vault-crypto.ts` | PBKDF2 + AES-GCM primitives                               |
| `src/types/credential.ts`             | Domain models and defaults                                |
| `src/theme/color-themes.ts`           | Runtime accent presets (blue/purple/gold)                 |
| `src/theme/index.ts`                  | `getTheme()`, Theme type, token exports                   |
| `src/hooks/use-theme.ts`              | Primary theme hook for screens                            |
| `src/constants/categories.ts`         | Credential category ids, labels, icons                    |
| `src/components/vault/bottom-nav.tsx` | Custom tab navigation                                     |
| `src/components/vault/index.ts`       | Vault component barrel exports                            |
| `src/app/(auth)/index.tsx`            | Onboarding + routing gate                                 |
| `src/app/(auth)/unlock.tsx`           | Unlock orchestration + biometrics                         |
| `src/services/health-checks.ts`       | Password health scoring                                   |
| `src/services/breach-check.ts`        | HIBP k-anonymity integration                              |
| `app.json`                            | Expo app config, experiments (typedRoutes, reactCompiler) |
| `package.json`                        | Dependencies, scripts, Jest config                        |
| `Mds/ROADMAP.md`                      | Phase-based development plan and progress                 |
| `Mds/TASKS.md`                        | Granular task tracking                                    |
| `Mds/BUGS.md`                         | Known bugs and fixes                                      |
| `README.md`                           | V1 scope, workflow, verify commands, security notes       |
| `AGENTS.md`                           | Expo docs version requirement for AI agents               |

---


# AI Instructions

When modifying code in SecureVault:

1. **Read existing implementations first** — especially neighboring screens in `components/screens/` and shared vault components.
2. **Follow established patterns** — thin routes, `makeStyles(theme)`, auth guards, `useVault()` for data mutations.
3. **Reuse components whenever possible** — `GlassCard`, `CredentialRow`, `PrimaryButton`, `ScreenBackground`, `BottomNav`.
4. **Keep styling consistent** — use `useTheme()` tokens; no inline hex; match glass/spacing/typography of sibling screens.
5. **Avoid introducing new libraries** unless necessary and aligned with ROADMAP — no Redux, NativeWind, or alternate icon libraries.
6. **Preserve existing architecture** — offline-first, context-based state, encrypted local storage, no backend.
7. **Prefer project conventions over generic best practices** — e.g. StyleSheet over Tamagui; lucide over vector-icons; Playfair serif headings.
8. **Be specific to SecureVault** — reference actual file paths, hook names, and token keys from this codebase.
9. **Infer and match patterns** — if one screen uses `PressableScale` + `useHaptics().selection`, follow suit for similar interactions.
10. **Security-sensitive changes** require extra care — never log passwords, never persist AES keys, use `copySensitiveToClipboard` for secrets, document privacy for any new network call.
11. **Test changes** — add/update tests in `src/services/__tests__/` for service logic; run `npm test` and `npm run lint`.
12. **Track documentation** — update `Mds/` task/bug/roadmap entries when closing scoped work.


---

**Navigation:** [← Part 1](./project.part-01.md) · **Part 2 of 2** · [↑ Index](./project.md)
