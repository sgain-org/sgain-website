# SGAIN Website

Static [Astro](https://astro.build/) site, deployed to Hostinger.

## Stack

- **Package manager:** pnpm (use `pnpm`)
- **Node:** v26 (see `.nvmrc`)

## Commands

| Command           | What it does                            |
| ----------------- | --------------------------------------- |
| `pnpm install`    | Install dependencies                    |
| `pnpm dev`        | Start the dev server                    |
| `pnpm build`      | Build the static site to `dist/`        |
| `pnpm preview`    | Preview the production build            |
| `pnpm check`      | Type-check Astro + TS (`astro check`)   |
| `pnpm lint`       | Lint + format check (Biome)             |
| `pnpm lint:fix`   | Auto-fix lint/format issues             |
| `pnpm unused`     | Report unused files/exports/deps (knip) |
| `pnpm svg`        | Optimize SVGs in `public/` (svgo)       |

## Development

- Start the dev server in background mode: `pnpm dev --background` (runs `astro dev --background`).
- Manage the background server with `pnpm astro dev stop`, `pnpm astro dev status`, and `pnpm astro dev logs`.

## Conventions

- Run `pnpm lint:fix` and `pnpm check` before committing.
- Formatting and imports are enforced by Biome (`biome.json` is the source of truth).
- Source lives in `src/`: `components/`, `layouts/`, `lib/`, `pages/`, `styles/`.
- Don't edit generated/vendored dirs: `dist/`, `.astro/`, `node_modules/`, `public/`, `resources/`.

## Cloudflare Deployment

- `astro.config.mjs` uses the `@astrojs/cloudflare` adapter.
- `wrangler.jsonc` is the source of truth for Cloudflare deployment settings.
- The Worker entrypoint is `@astrojs/cloudflare/entrypoints/server`.
- Static assets are served from `dist/` through the `ASSETS` binding.
- Do not add deployment configuration for another platform unless the deployment target changes again.

## Documentation

Full documentation: <https://docs.astro.build>
