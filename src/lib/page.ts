const SITE_TITLE_SUFFIX = " | SGAIN Project";

export function toPageTitle(title: string) {
  return title.endsWith(SITE_TITLE_SUFFIX) ? title : `${title}${SITE_TITLE_SUFFIX}`;
}

export function toDisplayTitle(title: string) {
  return title.endsWith(SITE_TITLE_SUFFIX) ? title.slice(0, -SITE_TITLE_SUFFIX.length) : title;
}
