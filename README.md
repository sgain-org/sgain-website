# SGAIN Website

This repository contains the source code for the SGAIN website.
The website is built using [Astro](https://astro.build/), and is deployed to Hostinger.

## Cloudflare Deployment

This project is deployed to Cloudflare using the Astro Cloudflare adapter and
Wrangler.

The deployment configuration lives in `wrangler.jsonc`:

- Worker name: `sgain-website`
- Worker entrypoint: `@astrojs/cloudflare/entrypoints/server`
- Static assets directory: `dist`
- Static assets binding: `ASSETS`

Useful commands:

```shell
# Generate Cloudflare environment types
pnpm generate-types

# Build and preview with Wrangler
pnpm cf:preview

# Build and deploy to Cloudflare
pnpm cf:deploy
```
