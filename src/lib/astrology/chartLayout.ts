import { RASHIS } from "./constants";
import type { SiderealPlanet } from "./chart";

export type ChartStyleValue = "NORTH_INDIAN" | "SOUTH_INDIAN" | "EAST_INDIAN";

export type ChartHouse = {
  houseNumber: number; // 1-12
  rashiIndex: number; // 0-11
  planets: SiderealPlanet[];
};

export function buildHouses(ascendantRashiIndex: number, planets: SiderealPlanet[]): ChartHouse[] {
  return Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const rashiIndex = (ascendantRashiIndex + i) % 12;
    return {
      houseNumber,
      rashiIndex,
      planets: planets.filter((p) => p.rashi.index === rashiIndex),
    };
  });
}

/**
 * North Indian diamond geometry, derived from a square (0-300) bisected by both diagonals and
 * the quadrilateral connecting edge-midpoints — the classical 12-region Vedic chart partition.
 * 4 "kite" quadrilaterals sit at the cardinal points (houses 1/4/7/10); each corner splits into
 * two triangular houses either side of a diagonal.
 */
export const NORTH_INDIAN_HOUSE_POLYGONS: Record<number, { points: string; labelX: number; labelY: number }> = {
  1: { points: "150,0 225,75 150,150 75,75", labelX: 150, labelY: 45 },
  2: { points: "150,0 300,0 225,75", labelX: 210, labelY: 25 },
  3: { points: "300,0 300,150 225,75", labelX: 275, labelY: 90 },
  4: { points: "300,150 225,225 150,150 225,75", labelX: 255, labelY: 150 },
  5: { points: "300,150 300,300 225,225", labelX: 275, labelY: 210 },
  6: { points: "300,300 150,300 225,225", labelX: 210, labelY: 275 },
  7: { points: "150,300 75,225 150,150 225,225", labelX: 150, labelY: 255 },
  8: { points: "150,300 0,300 75,225", labelX: 90, labelY: 275 },
  9: { points: "0,300 0,150 75,225", labelX: 25, labelY: 210 },
  10: { points: "0,150 75,75 150,150 75,225", labelX: 45, labelY: 150 },
  11: { points: "0,150 0,0 75,75", labelX: 25, labelY: 90 },
  12: { points: "0,0 150,0 75,75", labelX: 90, labelY: 25 },
};

/** South Indian fixed 4x4 grid: signs are pinned to cells forever; the ascendant is marked, not centered. */
export const SOUTH_INDIAN_GRID: Record<number, { row: number; col: number }> = {
  0: { row: 0, col: 1 }, // Aries
  1: { row: 0, col: 2 }, // Taurus
  2: { row: 0, col: 3 }, // Gemini
  3: { row: 1, col: 3 }, // Cancer
  4: { row: 2, col: 3 }, // Leo
  5: { row: 3, col: 3 }, // Virgo
  6: { row: 3, col: 2 }, // Libra
  7: { row: 3, col: 1 }, // Scorpio
  8: { row: 3, col: 0 }, // Sagittarius
  9: { row: 2, col: 0 }, // Capricorn
  10: { row: 1, col: 0 }, // Aquarius
  11: { row: 0, col: 0 }, // Pisces
};

/** East Indian (Bengali/Odia) style: houses — not signs — are pinned to fixed grid cells, walked clockwise from house 1. */
const EAST_INDIAN_HOUSE_WALK: Array<{ row: number; col: number }> = [
  { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 1, col: 3 },
  { row: 2, col: 3 }, { row: 3, col: 3 }, { row: 3, col: 2 }, { row: 3, col: 1 },
  { row: 3, col: 0 }, { row: 2, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 0 },
];

export function eastIndianCellForHouse(houseNumber: number): { row: number; col: number } {
  return EAST_INDIAN_HOUSE_WALK[(houseNumber - 1) % 12];
}

export function rashiLabel(rashiIndex: number, language: "en" | "ta" | "hi" | "te" | "ml" = "en"): string {
  const rashi = RASHIS[rashiIndex];
  if (language === "ta") return rashi.tamil;
  if (language === "hi") return rashi.hindi;
  if (language === "te") return rashi.telugu;
  if (language === "ml") return rashi.malayalam;
  return rashi.english;
}

export function nakshatraLabel(n: { english: string; tamil: string; hindi: string; telugu: string; malayalam: string }, language: "en" | "ta" | "hi" | "te" | "ml" = "en"): string {
  if (language === "ta") return n.tamil;
  if (language === "hi") return n.hindi;
  if (language === "te") return n.telugu;
  if (language === "ml") return n.malayalam;
  return n.english;
}
