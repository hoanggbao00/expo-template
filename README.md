# Expo Template

Android-first Expo SDK 57 template for React Native 0.86, React 19.2, and TypeScript 7.
New Architecture, Hermes, React Compiler, Expo Router, Uniwind, TanStack Query, Zustand,
i18next, Reanimated 4, and React Native Worklets bundle mode are configured.

No license. `package.json` uses `UNLICENSED`.

## Requirements

- Bun 1.4.2+
- Android Studio and Android SDK for Android
- Xcode for iOS
- Physical device or emulator/simulator
- Development build; this project does not target Expo Go

## Development

`bun start` starts Metro only. It does not install or launch the app.

Normal development flow:

```bash
bun install
bun run android
# or
bun run ios
```

`bun run android` and `bun run ios` run `expo run:*`, which prebuilds native code when
needed, builds the development app, installs it, and starts Metro. After app installation,
use `bun start` when only Metro needs restarting.

Run a specific mode explicitly:

```bash
APP_VARIANT=development bun run android
APP_VARIANT=development bun run ios
```

## App modes

`APP_VARIANT` controls branding and native identifiers in `app.config.ts`.

| Mode | Value | Purpose |
| --- | --- | --- |
| Development | `development` | Dev app name, slug, scheme, and bundle ID; installs beside production |
| Production | `production` | Release app name, slug, scheme, and bundle ID |

Native identifiers stay in `app.config.ts`, not `.env`. Prebuild bakes them into native
projects. `.env.local` and `.env.production.local` are ignored by Git and may set
`APP_VARIANT` or other local environment values.

## Build

### Native prebuild

Generate or update native projects for a mode:

```bash
bun run prebuild:android
bun run prebuild:android:prod
bun run prebuild:ios
bun run prebuild:ios:prod
```

`prebuild:*:clean` variants allow Expo to regenerate the native project cleanly. The normal
commands use `--no-clean` to preserve existing native changes.

### Android release artifacts

```bash
bun run build:apk
bun run build:aab
```

Both use `scripts/build-android.sh`. Default mode is production. Override it with flags:

```bash
./scripts/build-android.sh --production --apk
./scripts/build-android.sh --production --aab
./scripts/build-android.sh --development --apk
```

The script reads app version and version code from `package.json`, resolves app name from
`app.config.ts`, selects `APP_VARIANT`, configures Gradle, and signs using the local release
keystore configuration. Review that script before using it for shared or public releases.

## Scripts

```bash
bun start                         # Start Metro only
bun run android                   # Build, install, and run development Android app
bun run ios                       # Build, install, and run development iOS app
bun run check                     # Ultracite check
bun run fix                       # Ultracite format and autofix
bun run typecheck                 # TypeScript check
bun run prebuild:android          # Development Android prebuild, preserves native changes
bun run prebuild:android:prod     # Production Android prebuild, preserves native changes
bun run prebuild:android:clean    # Clean development Android prebuild
bun run prebuild:ios              # Development iOS prebuild, preserves native changes
bun run prebuild:ios:prod         # Production iOS prebuild, preserves native changes
bun run prebuild:ios:clean        # Clean development iOS prebuild
bun run build:apk                 # Production APK
bun run build:aab                 # Production AAB
```

## Project structure

```text
assets/                    # App icons, images, fonts, SVG icon sources/output
scripts/                   # Build and repository scripts
patches/                   # Bun patched dependencies
polyfills/                 # Runtime polyfills
src/
├── app/                   # Expo Router routes only; keep route files thin
│   ├── _layout.tsx        # Root initialization and providers
│   ├── index.tsx          # Home route
│   └── about.tsx          # About route
├── screens/               # Screen composition and screen-private components
│   └── <name>/index.tsx
├── features/              # Domain data layer, not route UI
│   ├── <feature-name>.api.ts         # HTTP/data-source functions
│   ├── <feature-name>.query.ts       # TanStack Query definitions
│   ├── <feature-name>.mutation.ts    # TanStack Mutation definitions
│   └── <feature-name>.query-key.ts   # Stable query keys
├── components/            # Shared UI and Uniwind-wrapped primitives
├── providers/             # Query, font, theme, and i18n providers
├── state/                 # Client state and persisted Zustand stores
├── lib/                   # Shared clients and adapters
├── hooks/                 # Shared React hooks
├── i18n/                  # Locales and typed translation helpers
├── styles/                # Design tokens and styling helpers
├── utils/                 # Stateless helpers and logging
└── types/                 # Global TypeScript declarations
```

Screen flow:

```text
src/app/profile.tsx
  → src/screens/profile/index.tsx
    → src/features/profile.query.ts
      → src/features/profile.api.ts
```

Put screen-private UI in `src/screens/<name>/components/`. Promote UI to
`src/components/` only when multiple screens use it. Add translation keys to both
`src/i18n/locales/en.json` and `src/i18n/locales/vi.json`.

## Architecture

```text
src/app                 Route boundary
  ↓
src/screens             Screen composition and UI state
  ↓
src/features            Domain API, queries, mutations, query keys
  ↓
src/lib                 Shared clients and adapters

src/providers            App-wide initialization
src/state                Local persisted client state
src/components            Reusable presentation
```

`src/app/_layout.tsx` initializes device ID and wraps the router stack with Query, Font,
Theme, and i18n providers. `src/components/app-stack.tsx` owns the Expo Router stack and
maps Uniwind theme colors into navigation colors. `src/lib/query-client.ts` owns TanStack
Query defaults and global query/mutation error logging.

## Packages and configuration

| Concern | Package / location |
| --- | --- |
| Navigation | `expo-router` |
| Styling | `uniwind`, `tailwindcss`, `src/global.css` |
| Wrapped UI | `src/components/tw/` |
| Server state | `@tanstack/react-query`, `src/lib/query-client.ts` |
| Network transport | `react-native-nitro-fetch`, wired in `index.js` |
| Client state | `zustand`, `react-native-mmkv`, `src/state/` |
| Localization | `i18next`, `react-i18next`, `src/i18n/` |
| Motion | `react-native-reanimated`, `react-native-worklets`, `react-native-ease` |
| Icons | `react-native-nano-icons`, `assets/icons/`, `src/components/nano-icons.ts` |
| Validation | `ultracite`, `@biomejs/biome`, `tsc` |
| Package manager | Bun 1.4.2, `bun.lock` |

Important config locations:

- `app.config.ts`: app name, slug, scheme, bundle IDs, versions, plugins, splash, icon generation.
- `package.json`: scripts, dependency versions, app versions, patched dependencies.
- `babel.config.js`: Expo Babel preset and Worklets plugin.
- `metro.config.js`: Uniwind, Nano Icons, and Worklets bundle mode integration.
- `src/global.css`: Uniwind CSS entry.
- `src/styles/`: colors, fonts, gradients, and custom utilities.
- `tsconfig.json`: strict TypeScript and `@/*` aliases.
- `biome.jsonc`: Ultracite/Biome rules and formatting.
- `lefthook.yml`: pre-commit autofix.
- `.github/workflows/check.yml`: CI `check` + `typecheck` on push/PR.

## Design and styling

Uniwind is the styling system. NativeWind is not used.

- Use `className` on wrapped primitives from `@/components/tw`.
- Use wrapped components instead of raw native components when a wrapper exists.
- Put shared colors, fonts, gradients, and utilities in `src/styles/`.
- Keep screen-private styles beside screen components.
- Use `StyleSheet.create` only for values that cannot be represented by existing tokens/utilities.

Theme comes from Uniwind. Navigation receives mapped theme colors through
`src/components/app-stack.tsx`.

See [docs/design-styling.md](./docs/design-styling.md) and
[docs/components.md](./docs/components.md).

## Icons

SVG icons are compiled into an icon font by `react-native-nano-icons`.

- Source SVGs: `assets/icons/common/*.svg`
- Generated output: `assets/icons/output/common.ttf` + `common.glyphmap.json` (committed)
- Config: `react-native-nano-icons` plugin `iconSets` in `app.config.ts`
- Usage: `<Icon name="chevron-left" />` from `@/components/tw`; names are typed from the glyphmap

Generation:

- **Prebuild** (`bun run prebuild:*`, `bun run android|ios`) regenerates the font when SVGs,
  config, or library versions change, and links it into native projects. Unchanged sets are skipped.
- **Dev HMR**: `withNanoIcons()` in `metro.config.js` watches the SVG folder. Add or edit an SVG
  and Metro rebuilds the font and pushes it to the running dev app — no native rebuild.
- The Metro plugin is dev-only and does not link fonts natively. Run prebuild before a
  release build so the native binary ships the current font, otherwise icons render blank
  (font integrity check fails).

Do not hand-edit files in `assets/icons/output/`.

## Worklets bundle mode

Bundle mode is enabled for Hermes + Reanimated to reduce Android memory use and allow
Worklets to access the full bundle.

- `babel.config.js`: applies `react-native-worklets/plugin` once with `bundleMode: true` and `strictGlobal: true`.
- `metro.config.js`: applies `withUniwindConfig()` first, Nano Icons next, and `getBundleModeMetroConfig()` last.
- `patches/`: pins compatibility fixes for Worklets, Metro, and Metro Runtime.

Metro config order matters. After upgrading `react-native-worklets`, `metro`, or `uniwind`,
retest Metro startup, HMR, splash dismissal, native tabs, and Android bundle mode.

## Validation and CI

```bash
bun run check
bun run typecheck
```

GitHub Actions runs both commands on every push and pull request. New runs cancel older
runs for the same ref. Outside a Git checkout, use `bun install --ignore-scripts` because
Lefthook installation needs `.git`.

## Upgrade

```bash
bunx expo install expo@^57.0.0 --fix
bunx expo-doctor
```

Use [Expo SDK 57 docs](https://docs.expo.dev/versions/v57.0.0/) for Expo APIs.

See [AGENTS.md](./AGENTS.md) for task-specific documentation routing.
