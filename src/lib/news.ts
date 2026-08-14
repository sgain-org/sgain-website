import { formatDate } from "@/lib/content.ts";

/** The date shown for an entry: `displayDate` when set (spans, approximations), else the date. */
export const toDisplayDate = (data: { date: string; displayDate?: string }): string =>
  data.displayDate || formatDate(data.date);

// Stable anchors for year sections on the news page, so old links keep working.
const yearAnchors: Record<number, string> = {
  2025: "twentyfive",
  2024: "twentyfour",
};

export const toYearAnchor = (year: number) => yearAnchors[year] ?? `year-${year}`;
