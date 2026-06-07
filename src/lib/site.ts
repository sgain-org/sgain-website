/** Canonical origin — mirrors `site` in astro.config.mjs. */
export const SITE_URL = "https://sgain.org";

/** Short site name, used for og:site_name and structured data. */
export const SITE_NAME = "SGAIN Project";

/** Default meta description / tagline. */
export const SITE_DESCRIPTION =
  "Sustainability Governance of China's Global Infrastructure Investments, a UKRI Future Leaders Fellowship project at the University of Bath.";

/** Default meta keywords. */
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

/**
 * Resolve site-absolute paths against the canonical `site` from astro.config.
 * Astro injects `site` (a URL) into page/endpoint context at build time, so it
 * is the single source of truth for the domain. Fails fast if `site` is unset.
 */
export function makeUrl(site: URL | undefined): (path: string) => string {
  if (!site) {
    throw new Error("`site` is not set — configure the `site` option in astro.config.");
  }
  return (path) => new URL(path, site).href;
}
