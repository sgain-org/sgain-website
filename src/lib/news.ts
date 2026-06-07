// Stable anchors for legacy archive years, so old links keep working.
const yearAnchors: Record<number, string> = {
  2025: "twentyfive",
  2024: "twentyfour",
};

export const toYearAnchor = (year: number) => yearAnchors[year] ?? `year-${year}`;
