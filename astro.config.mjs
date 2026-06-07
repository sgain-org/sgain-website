// @ts-check
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const CANONICAL_URL = "https://sgain.org";

// Hostinger serves plain static files, so drop the Cloudflare adapter for it.
const isHostinger = process.env.DEPLOY_TARGET === "hostinger";

export default defineConfig({
  site: CANONICAL_URL,
  output: "static",
  build: {
    // output an index.html file in each directory instead of a single file in the root
    format: "directory",
  },
  integrations: [sitemap()],
  ...(isHostinger ? {} : { adapter: cloudflare() }),
});
