/** Mirrors `site` in astro.config.mjs. */
export const SITE_URL = "https://sgain.org";

export const SITE_NAME = "SGAIN Project";

export const SITE_DESCRIPTION =
  "Sustainability Governance of China's Global Infrastructure Investments, a UKRI Future Leaders Fellowship project at the University of Bath.";

export const SITE_KEYWORDS = [
  "SGAIN",
  "China",
  "infrastructure investment",
  "sustainability governance",
  "environmental governance",
  "Belt and Road Initiative",
  "climate",
  "global development",
  "UKRI Future Leaders Fellowship",
  "University of Bath",
].join(", ");

/** Resolve paths against `Astro.site`, the single source of truth for the domain. */
export function makeUrl(site: URL | undefined): (path: string) => string {
  if (!site) {
    throw new Error("`site` is not set — configure the `site` option in astro.config.");
  }
  return (path) => new URL(path, site).href;
}
