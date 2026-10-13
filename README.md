# Expo Template

Android-first Expo app template.

- Expo SDK 57
- React Native 0.86
- React 19.2
- TypeScript 7
- New Architecture
- React Compiler
- Expo Router typed routes

No license. See `package.json` (`UNLICENSED`).

## Stack

| Area | Choice |
| --- | --- |
| Runtime | Expo SDK 57, React Native 0.86, Hermes |
| Navigation | Expo Router, typed routes, native tabs support |
| Styling | Uniwind + Tailwind CSS v4 |
| UI primitives | Wrapped components in `src/components/tw/` |
| Server state | TanStack Query + `react-native-nitro-fetch` |
| Client state | Zustand + MMKV persistence |
| Forms/data types | TypeScript |
| Localization | i18next + react-i18next (`en`, `vi`) |
| Motion | React Native Reanimated 4 + React Native Worklets |
| Icons | react-native-nano-icons |
| Validation/tooling | Ultracite, Biome, TypeScript, Lefthook |
| Package manager | Bun 1.4.2 |

## Requirements

- Bun 1.4.2+
- Android Studio for Android
- Xcode for iOS
- Development build; Expo Go is not the target runtime

## Start

```bash
bun install
bun start
```

Open the development build on an emulator/device. Select app mode with `APP_VARIANT`.

## Modes

`APP_VARIANT` controls branding and native identifiers in `app.config.ts`.

| Mode | Value | Purpose |
| --- | --- | --- |
| Development | `development` | Dev app, installable beside production |
| Production | `production` | Release app identifiers |

Use `.env.local` or `.env.production.local` when needed. Keep native identifiers in
`app.config.ts`; they are compiled into native projects during prebuild.

```bash
bun start
APP_VARIANT=development bun run android
APP_VARIANT=production bun run prebuild:android:prod
APP_VARIANT=production bun run prebuild:ios:prod
```

## Scripts

```bash
bun start                         # Start Metro in development mode
bun run android                   # Build and run development Android app
bun run ios                       # Build and run development iOS app
bun run check                     # Ultracite check
bun run fix                       # Ultracite format and autofix
bun run typecheck                 # TypeScript check
bun run prebuild:android          # Prebuild development Android project
bun run prebuild:android:prod     # Prebuild production Android project
bun run prebuild:ios              # Prebuild development iOS project
bun run prebuild:ios:prod         # Prebuild production iOS project
bun run build:apk                 # Build release APK
bun run build:aab                 # Build release AAB
```

CI runs `bun run check` and `bun run typecheck` on every push and pull request. A newer
run cancels an older run for the same ref.

## Project structure

```text
assets/                    # App images, fonts, generated icon inputs
scripts/                   # Build and repository scripts
patches/                   # Bun patched dependencies
polyfills/                 # Runtime polyfills
src/
├── app/                   # Expo Router routes only; keep files thin
│   ├── _layout.tsx        # Root providers and navigation entry
│   ├── index.tsx          # Home route
│   └── about.tsx          # About route
├── screens/               # Screen UI and screen-private components
│   └── <name>/
│       ├── index.tsx
│       └── components/    # Optional screen-local components
├── features/              # Domain data layer, not route UI
│   └── <name>/
│       ├── api/           # HTTP/data source functions
│       ├── queries/       # useQuery definitions
│       ├── mutations/     # useMutation definitions
│       └── query-keys/    # Stable TanStack Query keys
├── components/            # Shared UI components and wrapped primitives
├── providers/             # Query, font, theme, and i18n providers
├── state/                 # Client state; persisted Zustand stores
├── lib/                   # Shared configured clients and library adapters
├── hooks/                 # Shared React hooks
├── i18n/                  # Locales and typed translation helpers
├── styles/                # Uniwind/CSS tokens, fonts, gradients, utilities
├── utils/                 # Stateless helpers and logging
└── types/                 # Global TypeScript declarations
```

Routes import screen bodies. Screens compose shared UI and call feature hooks. Features
own API calls and TanStack Query definitions. Providers wire cross-cutting runtime state.

Example:

```text
src/app/profile.tsx
  -> src/screens/profile/index.tsx
    -> src/features/profile/queries/use-profile.ts
      -> src/features/profile/api/get-profile.ts
```

Keep route-specific concerns in `src/app/`. Keep reusable UI in `src/components/`. Keep
screen-private UI in `src/screens/<name>/components/`. Add i18n keys to both locale files.

## Design system

Uniwind is the styling layer. Use `className` on wrapped primitives from `@/components/tw`.
Do not introduce NativeWind or parallel styling systems.

Design tokens live in:

- `src/styles/colors.css` and `src/styles/colors.type.ts`
- `src/styles/fonts.css` and `src/styles/fonts.ts`
- `src/styles/utilities.css`
- `src/styles/gradients.ts`

Theme selection comes from Uniwind and maps into Expo Router navigation colors through
`src/components/app-stack.tsx`. Add shared visual tokens before adding one-off values.

## Architecture

```text
src/app                 Route boundary
  ↓
src/screens             Screen composition and UI state
  ↓
src/features            Domain API, queries, mutations, query keys
  ↓
src/lib                 Shared clients and adapters

src/providers           App-wide providers
src/state               Local client state
src/components          Reusable presentation
```

Root initialization runs through `src/app/_layout.tsx`: providers wrap the router stack,
fonts load before splash dismissal, i18n provides translations, and the device ID hook
initializes runtime identity.

TanStack Query defaults are centralized in `src/lib/query-client.ts`. Override freshness,
retry, or refetch behavior only when a feature needs different behavior.

## Native and bundle-mode notes

`android/` and `ios/` are generated native projects. `expo prebuild` can regenerate them;
review native changes before committing. Use `--no-clean` only when preserving local native
changes is intentional.

Worklets bundle mode is enabled for Hermes and Reanimated:

- `babel.config.js` configures the Worklets plugin
- `metro.config.js` applies Uniwind first and bundle-mode config last
- `patches/` fixes Metro, Metro Runtime, and Worklets integration

After upgrading Expo, Metro, Uniwind, Reanimated, or Worklets, run checks and retest Metro
startup, HMR, splash dismissal, native tabs, and Android bundle mode.

## Upgrade

```bash
bunx expo install expo@^57.0.0 --fix
bunx expo-doctor
```

Use [Expo SDK 57 docs](https://docs.expo.dev/versions/v57.0.0/) for SDK-specific guidance.
See [AGENTS.md](./AGENTS.md) for repository conventions.
