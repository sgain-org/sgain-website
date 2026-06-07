// Stable anchors for year sections on the news page, so old links keep working.
const yearAnchors: Record<number, string> = {
  2025: "twentyfive",
  2024: "twentyfour",
};

export const toYearAnchor = (year: number) => yearAnchors[year] ?? `year-${year}`;
