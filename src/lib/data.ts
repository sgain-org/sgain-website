import * as d3 from "d3";

/**
 * One row of cgel-initiatives.csv. Every CSV cell is a string; `countries` is
 * derived from the pipe-delimited `countries` column at load time. The index
 * signature supports the dynamic field access in the browse table/filters
 * (e.g. `d[sortField]`).
 */
export interface Initiative {
  code: string;
  name: string;
  name_zh: string;
  acronym: string;
  start_year: string;
  status: string;
  end_year: string;
  governance: string;
  region: string;
  description: string;
  problem1: string;
  problem2: string;
  sdg: string;
  type_primary: string;
  type_secondary: string;
  lead_actor: string;
  lead_actor_type: string;
  colead_actor: string;
  collab_name: string;
  collab_type: string;
  collab_origin: string;
  website: string;
  /** Derived: split of the pipe-delimited `countries` column. */
  countries: string[];
  [key: string]: string | string[] | undefined;
}

/** Minimal world-map GeoJSON shape; each feature carries a country `name`. */
export interface WorldFeature {
  type: "Feature";
  properties: { name: string };
  geometry: unknown;
}
export interface WorldGeo {
  type: "FeatureCollection";
  features: WorldFeature[];
}

/** Parsed `start_year`, or null when blank/non-numeric. */
export const yrInt = (d: Initiative): number | null => {
  const n = parseInt(d.start_year, 10);
  return Number.isNaN(n) ? null : n;
};

/** Load + parse the initiatives CSV (paths are root-absolute for pretty URLs). */
export function loadInitiatives(): Promise<Initiative[]> {
  return d3.csv("/data/cgel-initiatives.csv", (raw) => {
    const d = raw as unknown as Initiative;
    d.countries = raw.countries ? raw.countries.split("|") : [];
    return d;
  }) as unknown as Promise<Initiative[]>;
}

/** Load the world GeoJSON for the collaboration map. */
export function loadGeo(): Promise<WorldGeo> {
  return d3.json("/data/world.geojson") as Promise<WorldGeo>;
}
