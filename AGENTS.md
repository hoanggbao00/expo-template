# AGENTS.md

Short routing context for agents. Load task-specific docs only when needed.

## Project baseline

Expo SDK 58, React Native 0.88.x, React 19.3.x, New Architecture, React Compiler, and Expo Router.
Bun 1.4.2 is package manager. Styling uses Uniwind + Tailwind CSS v4, not NativeWind.

## Read by task

| Task | Read |
| --- | --- |
| Any code change | [docs/before-code.md](docs/before-code.md) |
| New route, screen, folder, or file placement | [docs/project-structure.md](docs/project-structure.md) |
| UI, styling, theme, tokens, layout | [docs/design-styling.md](docs/design-styling.md) |
| Shared or screen-local UI, icons | [docs/components.md](docs/components.md) |
| Commands, validation, CI, native, Metro | [docs/development.md](docs/development.md) |
| Branding, dev/prod mode, product boundary | [docs/product.md](docs/product.md) |
| General project context | [docs/overview.md](docs/overview.md) |

## Non-negotiable rules

- Use `bun` / `bun x`, never npm or yarn.
- Use Expo SDK 58 docs: https://docs.expo.dev/versions/v58.0.0/.
- Do not add `@react-navigation/*`.
- Import `panelui-native` from subpaths (`panelui-native/components/<slug>`), never the root; Metro does not tree-shake.
- Add i18n strings to both `src/i18n/locales/en.json` and `src/i18n/locales/vi.json`.
- Keep native identifiers in `app.config.ts`.
- `metro.config.js` order matters: `withUniwindConfig()` first, bundle-mode config last.
- `react-native-worklets`, `metro`, and `uniwind` upgrades require native/runtime retesting.

## Aliases

- `@/*` → `src/*`
- `@@/*` → repo root
- `@/assets/*` → `assets/*`
