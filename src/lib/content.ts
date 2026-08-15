/** Entry `id` -> public URL slug. Content is filed under `<year>/`, but URLs stay flat. */
export const entrySlug = (id: string): string => id.replace(/\.md$/, "").replace(/^\d{4}\//, "");

type Dated = { data: { date: string; title: string } };

/** Newest first. Equal dates fall back to the title, so the order is stable between builds. */
export const byDateDesc = (first: Dated, second: Dated): number =>
  second.data.date.localeCompare(first.data.date) ||
  first.data.title.localeCompare(second.data.title);

/** Calendar year of an ISO date, for grouping listings. */
export const entryYear = (date: string): number => Number(date.slice(0, 4));

/** ISO date -> "30 December 2025". */
export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

import getReadingTime from "reading-time/lib/reading-time";

/** "4 min read" from the raw Markdown body. Syntax noise doesn't shift the estimate. */
export const readingTime = (body: string | undefined): string | undefined =>
  body ? getReadingTime(body).text : undefined;
