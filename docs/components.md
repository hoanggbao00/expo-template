# Components

## Shared UI

Put reusable components in `src/components/`. Use kebab-case names and named exports by default.

```text
src/components/
├── tw/                  # Uniwind-wrapped primitives
├── ui/                  # Shared product UI
├── app-stack.tsx        # Router stack and navigation theme
└── nano-icons.ts        # Generated Nano Icon set
```

Complex reusable components may use a folder with an `index.tsx` entry point. Keep private
subcomponents with their parent instead of promoting them early.

## Screen components

Keep components used by one screen in `src/screens/<name>/components/`. Move them to
`src/components/` only after a second consumer exists.

## Icons

SVG sources live in `assets/icons/<set>/`. Nano Icons generates `.ttf` and `.glyphmap.json`
under `assets/icons/output/` (committed). `src/components/nano-icons.ts` consumes the map;
use `<Icon name="..." />` from `@/components/tw`.

- Prebuild regenerates changed sets and links the font natively.
- `withNanoIcons()` in `metro.config.js` gives dev HMR: edit an SVG, Metro rebuilds and pushes the font.
- Metro plugin is dev-only. Run prebuild before release builds or icons render blank.
- Do not hand-edit generated output. Register new sets in `app.config.ts` `iconSets`.
