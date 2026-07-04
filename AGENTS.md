# AGENTS.md

Guidance for AI agents working in this repo. Read this fully before writing code.

## ⚠️ Critical: Expo SDK 57

Expo HAS CHANGED. This project is on **Expo SDK 57**. Always read the exact versioned
docs at https://docs.expo.dev/versions/v57.0.0/ before writing any Expo/RN code. Do not
rely on memory of older Expo APIs.

## Tech Stack

- **Runtime**: Expo SDK ~57, React Native 0.86, React 19.2 (new architecture).
- **Router**: `expo-router` (file-based) with **typed routes** + **React Compiler** enabled
  (`app.config.ts` → `experiments`). Native tabs via `expo-router/unstable-native-tabs`.
  Do **not** add `@react-navigation/*` — `expo-router` no longer depends on React Navigation.
- **Styling**: `uniwind` (Tailwind CSS v4 for React Native). NOT NativeWind.
- **State**: `zustand` + `persist` middleware, persisted to **MMKV** (`react-native-mmkv`).
- **i18n**: `i18next` + `react-i18next` with a typed wrapper hook.
- **Icons**: `react-native-nano-icons` (glyph set auto-generated at build).
- **Animation**: `react-native-reanimated` v4, `react-native-worklets`, `react-native-ease`, `pressto`.
- **Networking**: `react-native-nitro-fetch` (re-exported as `nitroFetch` in `src/lib/nitro-fetch.ts`).
- **Lint/format**: `ultracite` (Biome-based). **Typecheck**: `tsgo` (TypeScript native preview).
- **Package manager**: **bun** (`bun.lock`). Use `bun` / `bun x`, not npm/yarn.
- **Platform**: Android-first (`minSdk 28`, archs `arm64-v8a`). iOS configured too.

## Commands

```bash
bun start              # expo start
bun run android        # expo run:android
bun run ios            # expo run:ios
bun run check          # ultracite check (lint, no writes)
bun run fix            # ultracite fix (lint + format + autofix)
bun run typecheck      # bun tsgo --noEmit -p tsconfig.json
bun run prebuild:android | prebuild:ios
bun run build:apk | build:aab   # ./scripts/build-android.sh
```

`expo prebuild` (SDK 57+) clears and regenerates `android/` / `ios/` by default. Pass
`--no-clean` to apply changes to existing native folders instead.

A `lefthook` pre-commit hook runs `bun x ultracite fix` on staged JS/TS/JSON/CSS files.
Always make sure `bun run check` and `bun run typecheck` pass before finishing.

## Project Structure

```
src/
  app/              # expo-router routes ONLY (thin). Each route re-exports a feature screen.
    _layout.tsx     # RootLayout: SplashOverlay + Providers + AppTabs
    index.tsx       # → HomeScreen
    about.tsx       # → AboutScreen
  features/         # actual screen implementations (home/, about/) — put screen logic here
  components/
    tw/             # uniwind-wrapped RN primitives — USE THESE, re-exported from "@/components/tw"
    ui/             # composed UI components (spinner, gradient-*)
    app-tabs.tsx    # native bottom tabs
    nano-icons.ts   # icon set from generated glyphmap
  providers/        # Font, Theme, I18n providers composed in providers.tsx
  state/persisted/  # zustand stores persisted via MMKV (e.g. preferences)
  i18n/             # i18next setup, languages, locales (en/vi), typed useAppTranslation
  hooks/            # use-theme-color, use-back-handler
  styles/           # colors.css (CSS vars), colors.type.ts, fonts.css, utilities.css, gradients.ts
  lib/              # cn() util, nitro-fetch
  utils/            # screen scaling (nf/wpx/...), time (ms), dev-log
  app-constants.ts  # IS_IOS, APP_NAME, durations, etc.
```

Routing pattern: keep files in `src/app/` thin (route shell that renders a feature screen);
implement the screen under `src/features/<name>/screen.tsx`.

## Path Aliases (tsconfig)

- `@/*` → `src/*`
- `@@/*` → repo root (e.g. `import "@@/global.css"`)
- `@/assets/*` → `assets/*`

## Styling Conventions

- Use `className` on the uniwind components, not raw `react-native` primitives.
  Import from `@/components/tw`: `View`, `ScrollView`, `TextInput`, `Pressable`, `Image`,
  `Link`, `SafeAreaView`, `KeyboardAvoidingView`, `GestureHandlerRootView`,
  `PressableScale`, `PressableOpacity`, `Icon`, `TextUI`.
- Global CSS entry is `global.css` → imports `tailwindcss`, `uniwind`, and the files in
  `src/styles/`. Uniwind type defs auto-generate at `src/uniwind-types.d.ts` (do not edit).
- **Colors are CSS variables** in `src/styles/colors.css` (light/dark variants). When you
  add a color there, you MUST also add it to `ThemeColor` in `src/styles/colors.type.ts`
  so `useThemeColor(...)` stays typed. Read colors at runtime with `useThemeColor("text-primary")`.
- Custom Tailwind utilities live in `src/styles/utilities.css` (e.g. `flex-center`,
  `abs-center`, `size-vw-*`). Fonts mapped in `src/styles/fonts.css`.
- Class merging: use `cn(...)` from `@/lib/utils` (clsx + tailwind-merge).

### Text

Use `<Text>` (`@/components/tw`) instead of RN `Text`. It takes a `name` shorthand
`"size.weight.color"` (e.g. `"16.semibold.text-primary"`) or individual `size`/`weight`/
`color` props. Font sizes are scaled via `nf()`. Defaults: `14.regular.text-primary`,
`numberOfLines={1}`. Font weights: `bold | semibold | medium | regular` (Inter).

### Responsive sizing

From `@/utils` (`screen-utils.ts`): `nf` (font), `wpx`/`hpx` (px from 375×812 design),
`wp`/`hp` (percent), `scale`/`moderateScale`. Prefer these over hardcoded pixel values.

## State (zustand + MMKV)

- Stores live in `src/state/persisted/<domain>/`. Pattern: `create<State & Action>()(persist(...))`
  with `createJSONStorage` over an MMKV-backed `StateStorage` (`getJsonStorage`).
- Track hydration with `_isHydrated` + `onRehydrateStorage`.
- Expose imperative getters/setters for use outside React (e.g. `getPreferences`,
  `updatePreferences`). Use `partialize` to persist only intended slices.

## i18n

- Always use the typed hook `useAppTranslation` from `@/i18n/use-app-translation`:
  `const { t } = useAppTranslation("home")` → `t("title")`; pass an array of namespaces
  for `t("ns:key")`. Keys are type-checked from `src/i18n/locales/en.json`.
- Add new strings to BOTH `en.json` and `vi.json`. `en` is the source of truth for types.
- Languages registered in `src/i18n/languages.ts`. Change language via `changeAppLanguage`.

## Code Style (Biome / ultracite)

- Formatter: **2-space** indent, LF, `lineWidth: 120`. Run `bun run fix`.
- TypeScript `strict: true`. Prefer `type`/`interface` props, named exports for utils,
  `default export` for screens/providers/route files (matches existing files).
- `console.*` is a **warn** — use `devLog` from `@/utils` for intentional dev logging.
- `__DEV__` is a known global. Avoid disabled-by-config rules; don't reintroduce them.
- Don't edit generated files: `src/uniwind-types.d.ts`, `assets/icons/output/*`, `android/` build output.
- Comments: explain WHY only. No narration comments.

## Adding Things — quick recipes

- **New screen**: create `src/features/<name>/screen.tsx` (default export), then a thin
  route in `src/app/<name>.tsx` that renders it. Add a tab in `src/components/app-tabs.tsx` if needed.
- **New color**: add CSS var (light+dark) in `colors.css` AND the literal in `colors.type.ts`.
- **New persisted setting**: extend `Preferences` schema + `defaultPreferences` in
  `src/state/persisted/preferences/schema.ts`.
- **New icon**: drop SVGs in `assets/icons/`, they generate to `assets/icons/output/` (see
  `app.config.ts` nano-icons plugin); use `<Icon name="..." />`.
