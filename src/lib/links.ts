/**
 * Mirrors `site` in astro.config.mjs. Kept import-free so astro.config.mjs can
 * share these helpers with the components.
 */
const SITE_HOSTS = new Set(["sgain.org", "www.sgain.org"]);

/** True for links that leave the site — those open in a new tab. */
export function isExternalHref(href: string): boolean {
  const url = URL.parse(href);
  if (!url || (url.protocol !== "http:" && url.protocol !== "https:")) {
    return false;
  }
  return !SITE_HOSTS.has(url.hostname);
}

/** Spread onto an `<a>`: new-tab attributes off site, nothing on site. */
export function externalLinkAttrs(href: string): { target?: string; rel?: string } {
  return isExternalHref(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
