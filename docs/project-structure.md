# Project Structure

```text
assets/                    # Images, fonts, icon source/output
scripts/                   # Build and repository scripts
patches/                   # Bun patched dependencies
plugins/                   # Local Expo config plugins (CommonJS)
polyfills/                 # Runtime polyfills
src/
├── app/                   # Expo Router routes only; keep thin
├── screens/               # Screen UI and screen-private components
├── features/              # Flat <feature-name>.{api,query,mutation,query-key}.ts
├── components/            # Shared UI and wrapped primitives
├── providers/             # App-wide providers
├── state/                 # Client state and persisted Zustand stores
├── lib/                   # Shared clients and adapters
├── hooks/                 # Shared React hooks
├── i18n/                  # Locales and translation helpers
├── styles/                # Design tokens and styling helpers
├── utils/                 # Stateless helpers and logging
└── types/                 # Global TypeScript declarations
```

## Placement

- `src/app/<route>.tsx`: route boundary only. Import a screen body.
- `src/screens/<name>/index.tsx`: screen composition and UI state.
- `src/screens/<name>/components/*`: components private to that screen.
- `src/features/<feature-name>.api.ts`: HTTP and data-source functions.
- `src/features/<feature-name>.query.ts`: TanStack Query definitions.
- `src/features/<feature-name>.mutation.ts`: TanStack mutation definitions.
- `src/features/<feature-name>.query-key.ts`: stable query keys.
- `src/components/*`: reusable UI shared by multiple screens.

Features are flat files with kebab-case feature names. Add a role file only when needed.

Screen flow:

```text
src/app/profile.tsx
  → src/screens/profile/index.tsx
    → src/features/profile.query.ts
      → src/features/profile.api.ts
```

Do not put reusable code in `src/app/`. Add i18n keys to both locale files.

## Architecture

```text
src/app         Route boundary
  ↓
src/screens     Screen composition and UI state
  ↓
src/features    Domain API, queries, mutations, query keys
  ↓
src/lib         Shared clients and adapters (query client)
```

Cross-cutting: `src/providers` (app-wide init), `src/state` (local persisted state),
`src/components` (reusable presentation).

`src/app/_layout.tsx` wraps the router stack in providers: Query, Font, Theme, i18n.
Fonts gate splash dismissal. TanStack Query defaults live in `src/lib/query-client.ts`;
override per query only when a feature needs different freshness or retry.
