# AGENTS.md

Short project context for agents. Read this before editing code.

## Project Summary

This is an Expo SDK 57 React Native app using the new architecture.

- Expo SDK 57 (`expo` ~57.0.x), React Native 0.86.x, React 19.2.x.
- `expo-router` file-based routing with typed routes, React Compiler, and native tabs.
- `uniwind` for Tailwind CSS v4 styling. This is not NativeWind.
- Zustand persisted to MMKV for state.
- `i18next` / `react-i18next` for typed i18n.
- `react-native-reanimated` v4 + `react-native-worklets` with bundle mode enabled.
- `react-native-nano-icons` for generated icons.
- Bun is the package manager. Use `bun` / `bun x`, not npm/yarn.

## Key Commands

```bash
bun start
bun run android
bun run ios
bun run check
bun run typecheck
bun run fix
bun run prebuild:android
bun run prebuild:ios
```

Run `bun run check` and `bun run typecheck` before finishing code changes. If this workspace
does not have `.git`, use `bun install --ignore-scripts` because `lefthook install` fails outside
a git repo.

## Important Notes

- Always use Expo SDK 57 docs: https://docs.expo.dev/versions/v57.0.0/.
- Do not add `@react-navigation/*`; `expo-router` no longer depends on React Navigation.
- Keep route files in `src/app/` thin. Put screen logic in `src/features/<name>/screen.tsx`.
- Use wrapped primitives from `@/components/tw` and `className` for UI.
- Add i18n strings to both `src/i18n/locales/en.json` and `src/i18n/locales/vi.json`.

## Native / Metro Caveats

- Worklets bundle mode is configured in `babel.config.js` and `metro.config.js`.
- `metro.config.js` order matters: `withUniwindConfig()` first, `getBundleModeMetroConfig()` last.
- Bun `patchedDependencies` are required for Metro/worklets/bundle-mode integration.
- `react-native-worklets`, `metro`, and `uniwind` upgrades require retesting Metro startup, HMR,
  splash dismissal, native tabs, and Android bundle mode.

## Aliases

- `@/*` -> `src/*`
- `@@/*` -> repo root
- `@/assets/*` -> `assets/*`
