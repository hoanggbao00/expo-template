# Product

## App modes

`APP_VARIANT` controls app branding and native identifiers in `app.config.ts`.

| Mode | Value | Purpose |
| --- | --- | --- |
| Development | `development` | Dev branding and identifiers; install beside production |
| Production | `production` | Release branding and identifiers |

Native identifiers stay in `app.config.ts`, not `.env`, because prebuild bakes them into
native projects. Use `.env.local` or `.env.production.local` only for selecting runtime mode
and non-identity environment values.

```bash
APP_VARIANT=development bun run android
APP_VARIANT=production bun run prebuild:android:prod
APP_VARIANT=production bun run prebuild:ios:prod
```

## Product boundaries

- Routes define navigation only.
- Screens define user-facing composition.
- Features own domain data access.
- Providers own app-wide initialization.
- State owns local persisted preferences.
- Design tokens define shared visual language.
