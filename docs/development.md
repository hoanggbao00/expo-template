# Development

## Requirements

- Bun 1.4.2+
- Android Studio for Android
- Xcode for iOS
- Development build; Expo Go is not the target runtime

## Commands

```bash
bun install
bun start
bun run android
bun run ios
bun run check
bun run fix
bun run typecheck
bun run prebuild:android
bun run prebuild:android:prod
bun run prebuild:ios
bun run prebuild:ios:prod
bun run build:apk
bun run build:aab
```

## Validation

Run `bun run check` and `bun run typecheck` before finishing code changes.

GitHub Actions runs both checks on push and pull request. New runs cancel older runs for the same ref.

## Native changes

`android/` and `ios/` are generated native projects. `expo prebuild` may regenerate them.
Use `--no-clean` only when preserving local native changes is intentional.

After upgrading Expo, Metro, Uniwind, Reanimated, or Worklets, retest Metro startup, HMR,
splash dismissal, native tabs, and Android bundle mode.

Outside a git checkout, use `bun install --ignore-scripts`; `lefthook install` needs `.git`.

## Worklets bundle mode

Enabled to lower Android memory use with Hermes + Reanimated.

- `babel.config.js`: `react-native-worklets/plugin` with `bundleMode: true`
- `metro.config.js`: `withUniwindConfig()` first, `getBundleModeMetroConfig()` last

## Patches

Bun applies `patches/` on install through `patchedDependencies` in `package.json`.

| Package | Why |
| --- | --- |
| `react-native-worklets@0.10.4` | Bundle mode + Uniwind resolver remap compatibility |
| `metro@0.84.4` | Stable SHA-1 for generated `.worklets/` modules |
| `metro-runtime@0.84.4` | HMR propagation and `metroRequire.getModules` for bundle mode |

Refresh with `bun patch <package>` after upgrading a patched package.

## Upgrade

```bash
bunx expo install expo@^57.0.0 --fix
bunx expo-doctor
```

TypeScript 7 is intentional. Do not downgrade it to satisfy Expo checks.
