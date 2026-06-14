# SecureVault

SecureVault is an offline-first Expo password manager prototype. The current app uses Expo Router,
React Native, TypeScript, StyleSheet-driven components, and `lucide-react-native` icons.

## V1 Scope

V1 is focused on a local mobile vault, not cloud sync.

Must-have:

- Onboarding, master-password setup, and unlock flow.
- Dashboard, Vault, Add Credential, Settings, and Password Health screens.
- Local credential CRUD with website, URL, username, password, and category fields.
- Password generator and basic health checks for weak or reused passwords.
- Encrypted local storage before beta release.

Deferred / later:

- Cloud sync, account login, credential sharing, browser extension, and breach monitoring.
- Custom credential logos and offline logo caching unless they are pulled into v1.1.

## Project Decisions

- Storage model: offline-only for v1.
- Unlock method: master password first; biometrics only after explicit opt-in and security review.
- State management: React Context for shared vault/session state.
- Styling: React Native `StyleSheet` with centralized vault design tokens.
- Icons: `lucide-react-native`.
- Theme: current Figma-derived dark aubergine/glassmorphic palette, with light/dark token expansion still tracked in the roadmap.

## Workflow

Branch names:

- `feature/<short-description>` for user-visible features.
- `fix/<bug-id>-<short-description>` for tracked bugs.
- `chore/<short-description>` for tooling, docs, and release work.

Suggested issue labels:

- `priority:p0`, `priority:p1`, `priority:p2`, `priority:p3`
- `type:bug`, `type:feature`, `type:task`, `type:security`, `type:docs`
- `area:auth`, `area:vault`, `area:health`, `area:ui`, `area:release`

Use `ROADMAP.md`, `TASKS.md`, and `BUGS.md` as the source of truth. Update them whenever a feature or fix ships.

## Verify

```bash
npm run lint
npm test
```

## Security notes

- Credentials are stored locally in AsyncStorage with a salted master-password hash. Full AES encryption is tracked in the roadmap (TASK-015).
- Copied passwords auto-clear from the clipboard after 30 seconds.
- Vault backups exported from Settings are plaintext JSON — keep them private.

## Release checklist (internal beta)

- [ ] App icon and splash match the SecureVault aubergine palette.
- [ ] Privacy policy and terms drafted.
- [ ] EAS Build profiles for development, preview, and production.
- [ ] TestFlight / internal testing track configured.
- [ ] Store listing copy drafted.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
