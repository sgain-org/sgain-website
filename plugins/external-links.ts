import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";
import { isExternalHref } from "../src/lib/links.ts";

type HastPlugin = NonNullable<SatteriProcessorOptions["hastPlugins"]>[number];

/** Off-site links in Markdown get the same new-tab treatment as the components. */
export const externalLinksPlugin: HastPlugin = {
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
