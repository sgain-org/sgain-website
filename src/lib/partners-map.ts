/**
 * Geometry for the partner map on /international-partners/.
 *
 * `label` coordinates are viewBox units, not degrees. The European and East
 * Asian pins sit too close together for labels to be placed automatically, so
 * those are parked on a ladder clear of the cluster and joined back to their
 * pin with a leader line.
 */

/** Equirectangular frame. The latitude range trims Antarctica and the high Arctic. */
export const MAP_WIDTH = 2048;
export const MAP_LAT_NORTH = 84;
export const MAP_LAT_SOUTH = -58;
export const MAP_HEIGHT = Math.round((MAP_WIDTH * (MAP_LAT_NORTH - MAP_LAT_SOUTH)) / 360);

/** Sections defined on the international partners page. */
type PartnerSection = "indonesia" | "china" | "bangladesh" | "pakistan";

type MapLocation = {
  name: string;
  lat: number;
  lon: number;
  /** Pins for a partner country link to that section further down the page. */
  section?: PartnerSection;
  label: { x: number; y: number; anchor: "start" | "end" };
  /** Draw a line from pin to label, for labels parked clear of a cluster. */
  leader?: boolean;
};

export type MapRegion = {
  name: string;
  locations: readonly MapLocation[];
};

/**
 * The two label ladders flanking the European cluster, indexed top to bottom.
 * Which city takes which rung is load-bearing: a leader that passes within
 * ~12 units of another pin reads as if it points at that pin instead.
 */
const LADDER_TOP = 134;
const LADDER_STEP = 34;
const rung =
  (x: number, anchor: "start" | "end") =>
  (index: number): MapLocation["label"] => ({
    x,
    y: LADDER_TOP + index * LADDER_STEP,
    anchor,
  });
const leftRung = rung(985, "end");
const rightRung = rung(1125, "start");

export const mapRegions: readonly MapRegion[] = [
  {
    name: "Americas",
    locations: [
      { name: "Vancouver", lat: 49.28, lon: -123.12, label: { x: 352, y: 202, anchor: "start" } },
      { name: "Los Angeles", lat: 34.05, lon: -118.24, label: { x: 322, y: 290, anchor: "end" } },
      { name: "Mexico City", lat: 19.43, lon: -99.13, label: { x: 430, y: 374, anchor: "end" } },
      { name: "New York", lat: 40.71, lon: -74.01, label: { x: 632, y: 244, anchor: "start" } },
      { name: "Washington DC", lat: 38.91, lon: -77.04, label: { x: 556, y: 268, anchor: "end" } },
      { name: "São Paulo", lat: -23.55, lon: -46.63, label: { x: 730, y: 616, anchor: "end" } },
    ],
  },
  {
    // Nine pins inside ~45x28 units, so every label goes on a ladder. Rung
    // order is not alphabetical or geographic: it is chosen so the leaders fan
    // out without crossing each other or passing through a neighbouring pin.
    name: "Europe",
    locations: [
      { name: "Hamburg", lat: 53.55, lon: 9.99, label: leftRung(0), leader: true },
      { name: "Amsterdam", lat: 52.37, lon: 4.9, label: leftRung(1), leader: true },
      { name: "Bath", lat: 51.38, lon: -2.36, label: leftRung(2), leader: true },
      { name: "London", lat: 51.51, lon: -0.13, label: leftRung(3), leader: true },
      { name: "Utrecht", lat: 52.09, lon: 5.12, label: rightRung(0), leader: true },
      { name: "Copenhagen", lat: 55.68, lon: 12.57, label: rightRung(1), leader: true },
      { name: "Berlin", lat: 52.52, lon: 13.4, label: rightRung(2), leader: true },
      { name: "Zurich", lat: 47.38, lon: 8.54, label: rightRung(3), leader: true },
      { name: "Geneva", lat: 46.2, lon: 6.14, label: rightRung(4), leader: true },
    ],
  },
  {
    name: "South & West Asia",
    locations: [
      { name: "Abu Dhabi", lat: 24.45, lon: 54.38, label: { x: 1305, y: 335, anchor: "end" } },
      {
        name: "Islamabad",
        lat: 33.68,
        lon: 73.05,
        section: "pakistan",
        label: { x: 1410, y: 282, anchor: "end" },
      },
      {
        name: "Dhaka",
        lat: 23.81,
        lon: 90.41,
        section: "bangladesh",
        label: { x: 1512, y: 346, anchor: "end" },
      },
    ],
  },
  {
    // Shenzhen and Hong Kong land on the same pixel, so their labels split
    // opposite ways to stay legible.
    name: "East Asia",
    locations: [
      {
        name: "Beijing",
        lat: 39.9,
        lon: 116.41,
        section: "china",
        label: { x: 1760, y: 244, anchor: "start" },
        leader: true,
      },
      {
        name: "Shanghai",
        lat: 31.23,
        lon: 121.47,
        section: "china",
        label: { x: 1760, y: 302, anchor: "start" },
        leader: true,
      },
      {
        name: "Shenzhen",
        lat: 22.54,
        lon: 114.06,
        section: "china",
        label: { x: 1640, y: 336, anchor: "end" },
        leader: true,
      },
      {
        name: "Hong Kong",
        lat: 22.32,
        lon: 114.17,
        section: "china",
        label: { x: 1760, y: 364, anchor: "start" },
        leader: true,
      },
    ],
  },
  {
    name: "Southeast Asia & Oceania",
    locations: [
      { name: "Singapore", lat: 1.35, lon: 103.82, label: { x: 1585, y: 470, anchor: "end" } },
      {
        name: "Jakarta",
        lat: -6.21,
        lon: 106.85,
        section: "indonesia",
        label: { x: 1600, y: 516, anchor: "end" },
      },
      {
        name: "Yogyakarta",
        lat: -7.8,
        lon: 110.36,
        section: "indonesia",
        label: { x: 1690, y: 540, anchor: "start" },
        leader: true,
      },
      { name: "Sydney", lat: -33.87, lon: 151.21, label: { x: 1855, y: 676, anchor: "end" } },
    ],
  },
];
