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
