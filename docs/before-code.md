# Before Code

1. Read task-specific doc from `AGENTS.md`.
2. Check current route, screen, feature, or shared component before adding files.
3. Keep `src/app/` route files thin.
4. Decide ownership before coding:
   - screen-only UI → `src/screens/<name>/components/`
   - shared UI → `src/components/`
   - server data → `src/features/<feature-name>.{api,query,mutation,query-key}.ts`
   - client state → `src/state/`
5. Add translation keys to both `src/i18n/locales/en.json` and `src/i18n/locales/vi.json`.
6. Use Expo SDK 58 docs for Expo APIs.
7. Prefer existing dependencies and platform primitives. Do not add `@react-navigation/*`.
8. Run `bun run check`, `bun run typecheck`, and `bun run test` after changes.
