# Expo Template

Android-first [Expo](https://expo.dev) app template on **SDK 57** (React Native 0.86, React 19.2).

## Stack

| Area | Libraries |
|------|-----------|
| Routing | [expo-router](https://docs.expo.dev/router/introduction/) — typed routes, React Compiler, native tabs |
| Styling | [uniwind](https://uniwind.dev) (Tailwind CSS v4) |
| State | [zustand](https://zustand.docs.pmnd.rs/) + MMKV persistence |
| i18n | [i18next](https://www.i18next.com/) / react-i18next (en, vi) |
| Animation | Reanimated 4, worklets, pressto, ease |
| Networking | [react-native-nitro-fetch](https://github.com/margelo/react-native-nitro-fetch) |
| Tooling | bun, ultracite (Biome), tsgo, lefthook |

See [AGENTS.md](./AGENTS.md) for full conventions and project structure.

## Prerequisites

- [bun](https://bun.sh)
- [Android Studio](https://developer.android.com/studio) (Android-first; iOS optional)
- Xcode (macOS, for iOS builds)

## Get started

```bash
bun install
bun start
```

From the dev server, open on an emulator/simulator or scan the QR code. This template is
intended for [development builds](https://docs.expo.dev/develop/development-builds/introduction/),
not Expo Go.

## Scripts

```bash
bun start              # Start Metro
bun run android        # Run on Android (expo run:android)
bun run ios            # Run on iOS (expo run:ios)
bun run check          # Lint (ultracite)
bun run fix            # Lint + format + autofix
bun run typecheck      # TypeScript check (tsgo)
bun run prebuild:android   # Generate android/ native project
bun run prebuild:ios       # Generate ios/ native project
bun run build:apk      # Release APK (./scripts/build-android.sh)
bun run build:aab      # Release AAB
```

## Project layout

```
src/
  app/         # Thin expo-router routes
  features/    # Screen implementations
  components/  # UI (tw/ primitives, app-tabs, …)
  providers/   # Font, theme, i18n
  state/       # Persisted zustand stores
  i18n/        # Locales and typed translation hook
  styles/      # CSS variables, fonts, utilities
```

Routes live in `src/app/`; screen logic goes in `src/features/<name>/screen.tsx`.

## Native projects

`expo prebuild` (SDK 57+) **clears and regenerates** `android/` and `ios/` by default.
Use `--no-clean` to patch existing native folders instead.

After upgrading the SDK, delete stale `android/` / `ios/` and re-run prebuild or
`bun run android` / `bun run ios` so native code matches the new SDK.

## Upgrading

```bash
npx expo install expo@^57.0.0 --fix
bunx expo-doctor
```

Changelog: [Expo SDK 57](https://expo.dev/changelog/sdk-57)

## Docs

- [Expo SDK 57 reference](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AGENTS.md](./AGENTS.md) — conventions for contributors and AI agents
