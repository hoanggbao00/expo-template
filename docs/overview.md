# Overview

Expo SDK 57 template for Android-first React Native development.

## Runtime

- Expo SDK 57
- React Native 0.86.x, React 19.2.x
- TypeScript 7 (intentional; do not downgrade for Expo checks)
- New Architecture
- Hermes
- React Compiler
- Expo Router with typed routes and native tabs support

## Package map

| Concern | Packages / location |
| --- | --- |
| Navigation | `expo-router` |
| Styling | `uniwind`, `tailwindcss` |
| UI wrappers | `src/components/tw/` |
| Server state | `@tanstack/react-query` |
| Network transport | `react-native-nitro-fetch` |
| Client state | `zustand`, `react-native-mmkv` |
| Localization | `i18next`, `react-i18next` |
| Animation | `react-native-reanimated`, `react-native-worklets`, `react-native-ease` |
| Icons | `react-native-nano-icons` |
| Validation | `ultracite`, `@biomejs/biome`, `typescript` |
| Package manager | Bun 1.4.2 |

## Defaults

- `src/app/` contains routes only.
- `src/screens/` contains screen composition.
- `src/features/` contains domain data access.
- `src/state/` contains local persisted state.
- `src/i18n/` contains typed translations for `en` and `vi`.
- `package.json` uses `UNLICENSED`; project has no license.
