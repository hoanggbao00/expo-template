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

## Worklets bundle mode

This template enables [worklets bundle mode](https://docs.swmansion.com/react-native-worklets/docs/bundleMode)
to lower Android memory use with Hermes V1 + Reanimated (see [SDK 57 known regression](https://expo.dev/changelog/sdk-57)).

Configuration:

- `babel.config.js` — `react-native-worklets/plugin` with `bundleMode: true`
- `metro.config.js` — `getBundleModeMetroConfig()` applied **after** `withUniwindConfig()`

## Patches (`patches/`)

Bun applies these automatically on `bun install` via `patchedDependencies` in `package.json`.

| Package | Why |
|---------|-----|
| `react-native-worklets@0.10.1` | Fixes infinite `NativeModules` recursion / stuck splash when bundle mode runs alongside uniwind’s `react-native` resolver remap ([reanimated#9817](https://github.com/software-mansion/react-native-reanimated/issues/9817)) |
| `metro@0.84.4` | Stable SHA-1 for generated `.worklets/` modules |
| `metro-runtime@0.84.4` | HMR propagation + `metroRequire.getModules` for bundle mode |

If you upgrade `react-native-worklets`, `metro`, or `uniwind`, re-test the app and
refresh patches if needed (`bun patch <package>`).

## Upgrading

```bash
bunx expo install expo@^57.0.0 --fix
bunx expo-doctor
```

Changelog: [Expo SDK 57](https://expo.dev/changelog/sdk-57)

## Docs

- [Expo SDK 57 reference](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AGENTS.md](./AGENTS.md) — conventions for contributors and AI agents
