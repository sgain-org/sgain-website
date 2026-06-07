// @ts-check
import cloudflare from "@astrojs/cloudflare";
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { isExternalHref } from "./src/lib/links.ts";

const CANONICAL_URL = "https://sgain.org";

// Hostinger serves plain static files, so it gets no adapter.
const isHostinger = process.env.DEPLOY_TARGET === "hostinger";

/**
 * Off-site links in Markdown get the same new-tab treatment as the components.
 *
 * @type {NonNullable<import("@astrojs/markdown-satteri").SatteriProcessorOptions["hastPlugins"]>[number]}
 */
const externalLinksPlugin = {
  name: "external-links",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href === "string" && isExternalHref(href)) {
        ctx.setProperty(node, "target", "_blank");
        ctx.setProperty(node, "rel", "noopener noreferrer");
      }
    },
  },
};

export default defineConfig({
  site: CANONICAL_URL,
  output: "static",
  build: {
    // index.html per directory, not a flat file per page
    format: "directory",
  },
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ hastPlugins: [externalLinksPlugin] }),
  },
  ...(isHostinger ? {} : { adapter: cloudflare() }),
});
