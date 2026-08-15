# SGAIN Website

Static [Astro](https://astro.build/) site, deployed to Hostinger.

## Stack

- **Package manager:** pnpm (use `pnpm`)
- **Node:** v26 (see `.nvmrc`)
- **Animation:** [Motion](https://motion.dev/) via `src/lib/motion.ts`

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
- Blog, news and publications are ordered by their `date` (`YYYY-MM-DD`) — newest first, via `byDateDesc` in `src/lib/content.ts`. Don't reintroduce a manual `order` field; to move an entry, fix its date. Team members are the exception: they carry an explicit `order`, since no date applies.
- News renders `displayDate` when set, else the formatted `date`. Use it for spans and approximations ("4-5 December 2024", "Spring 2026"), and set `date` to when the event started so sorting stays right.
- Images live in `public/images/<collection>/<year>/<slug>/`, mirroring the content path — `hero.jpg` for the card/hero, `1.jpg`, `2.jpg`, … for body images. Don't reference another entry's folder, and don't add flat files at the collection root. Resize to ≤ 1600 px / ≤ 400 KB before committing.
- Galleries are bare `<img>` children of a `.news-gallery` div — no `<figure>` wrappers.
- Write straight quotes (`"` and `'`) in content Markdown, never curly ones (`“ ” ‘ ’`) — the Markdown processor has smart punctuation on, so bodies render curled anyway. In frontmatter, escape inner quotes as `\"` inside the double-quoted YAML scalar.
- The `news`, `publications` and `blog` content schemas are `.strict()`: a stray `order:`/`year:`/`oldUrl:` fails `pnpm check` instead of being ignored.
- Animate with the helpers in `src/lib/motion.ts`. Mark scroll-revealed elements `data-reveal`; they start hidden only when `<html>` has `motion-ready`, which `Layout.astro` withholds from visitors who prefer reduced motion.
- Don't edit generated/vendored dirs: `dist/`, `.astro/`, `node_modules/`, `public/`, `resources/`.

## Cloudflare Deployment

- `astro.config.mjs` uses the `@astrojs/cloudflare` adapter.
- `wrangler.jsonc` is the source of truth for Cloudflare deployment settings.
- The Worker entrypoint is `@astrojs/cloudflare/entrypoints/server`.
- Static assets are served from `dist/` through the `ASSETS` binding.
- Do not add deployment configuration for another platform unless the deployment target changes again.

## Documentation

Full documentation: <https://docs.astro.build>
