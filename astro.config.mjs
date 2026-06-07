// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const CANONICAL_URL = "https://sgain.org";

export default defineConfig({
  site: CANONICAL_URL,
  output: "static",
  build: {
    // output an index.html file in each directory instead of a single file in the root
    format: "directory",
  },
  integrations: [sitemap()],
});
