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
bun run android:prod
bun run ios
bun run check
bun run fix
bun run typecheck
bun run test
bun run test:ui
bun run prebuild:android
bun run prebuild:ios
bun run prebuild:ios:prod
bun run android:build   # interactive; flags: -v prod|preview|dev|all -b apk|aab|all -n name
bun run build:apk
bun run build:aab
```

Android scripts live in `scripts/*.ts` and run with Bun; they are type-checked by
`tsconfig.test.json` (Bun types) and import `VARIANTS` from `app.config.ts`.

## Validation

Run `bun run check`, `bun run typecheck`, `bun run test`, and `bun run test:ui` before finishing code changes.

GitHub Actions runs all three checks on push and pull request. New runs cancel older runs for the same ref.

## Native changes

`android/` and `ios/` are generated native projects. `expo prebuild` may regenerate them.
Use `--no-clean` only when preserving local native changes is intentional.

After upgrading Expo, Metro, Uniwind, Reanimated, or Worklets, retest Metro startup, HMR,
splash dismissal, native tabs, and Android bundle mode.

Outside a git checkout, use `bun install --ignore-scripts`; `lefthook install` needs `.git`.

## Worklets bundle mode

Enabled: worklets run against the full bundle (Hermes bytecode, any library usable in
worklets, lower memory).

- `babel.config.js`: `react-native-worklets/plugin` with `bundleMode: true`
- `metro.config.js`: `withUniwindConfig()` first, `getBundleModeMetroConfig()` last

## Patches

Bun applies `patches/` on install through `patchedDependencies` in `package.json`.

| Package | Why |
| --- | --- |
| `metro@0.87.1` | Bundle mode: stable SHA-1 for generated `.worklets/` modules (upstream Worklets patch) |
| `metro-runtime@0.87.1` | Bundle mode: HMR updates reach Worklet runtimes (upstream Worklets patch) |
| `react-native-worklets@0.13.0` | Bundle mode + Uniwind: route only the real `react-native` through the shim, which loads it via a private specifier, so the Uniwind remap keeps working without a require cycle ([reanimated#9817](https://github.com/software-mansion/react-native-reanimated/issues/9817)) |

Refresh with `bun patch <package>` after upgrading a patched package. Stop Metro first:
Uniwind regenerates `node_modules/uniwind/uniwind.css`, which must not end up in the patch.

## Upgrade

```bash
bunx expo install expo@^58.0.0 --fix
bunx expo-doctor
```

TypeScript 7 is intentional. Do not downgrade it to satisfy Expo checks.

## Tests

`bun test` runs `*.test.ts` files next to the code they cover. `test/setup.ts` (preloaded via `bunfig.toml`) defines `__DEV__` and mocks `react-native-mmkv` with an in-memory map. Test files are type-checked by `tsconfig.test.json` so Bun globals (e.g. `Headers`) stay out of app code. Bun cannot parse React Native's Flow source, so render tests use Jest instead:

- `*.test.ts`: plain logic, `bun test`. `bunfig.toml` ignores `*.test.tsx`.
- `test/**/*.test.tsx`: render tests, `bun run test:ui` (`jest-expo` preset, config in `package.json` `jest`). Use `renderRouter("./src/app")` from `expo-router/testing-library` to render real routes.
- `test/jest-setup.ts` mocks native-only modules (MMKV, keyboard controller, fonts, dev tools, adaptive status bar) and swaps `react-native-plain-text` for RN `Text` so text is queryable. Uniwind CSS is not compiled under Jest: the setup registers the light theme tokens from `src/styles/colors.css` so `useCSSVariable` resolves, but `className` utilities still resolve to nothing, so assert on content, not styles.
