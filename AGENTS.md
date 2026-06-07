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
| `pnpm check`      | Check (`astro check`)                   |
| `pnpm lint`       | Lint + format check (Biome)             |
| `pnpm lint:fix`   | Auto-fix lint/format issues             |
| `pnpm unused`     | Report unused files/exports/deps (knip) |
| `pnpm svg`        | Optimize SVGs in `public/` (svgo)       |
| `pnpm deploy`     | Build and deploy to Hostinger           |
| `pnpm deploy:dry` | Build and dry-run the deploy            |

## Conventions

- Run `pnpm lint:fix` and `pnpm check` before committing.
- Biome enforces 2-space indent, double quotes, 100-char lines, LF endings, organized imports.
- Source lives in `src/`: `components/`, `layouts/`, `lib/`, `pages/`, `styles/`.
- Don't edit generated/vendored dirs: `dist/`, `.astro/`, `node_modules/`, `public/`, `resources/`.

## Cloudflare Deployment

- `astro.config.mjs` uses the `@astrojs/cloudflare` adapter.
- `wrangler.jsonc` is the source of truth for Cloudflare deployment settings.
- The Worker entrypoint is `@astrojs/cloudflare/entrypoints/server`.
- Static assets are served from `dist/` through the `ASSETS` binding.
- Do not add deployment configuration for another platform unless the deployment target changes again.
