import type { PlanetName } from "./constants";
import type { SiderealPlanet } from "./chart";

/**
 * Dignity-based graha strength: classical exaltation/debilitation/own-sign/friendship
 * tables plus combustion, retrogression, and sign-based aspects, combined into a
 * transparent 0-100 score. This is a dignity summary, not a full six-fold Shadbala.
 */

const EXALTATION: Partial<Record<PlanetName, number>> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
const OWN_SIGNS: Partial<Record<PlanetName, number[]>> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};

// Naisargika (natural) friendships — same table the Guna Milan module uses.
const FRIENDS: Record<PlanetName, PlanetName[]> = {
  Sun: ["Moon", "Mars", "Jupiter"], Moon: ["Sun", "Mercury"], Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"], Jupiter: ["Sun", "Moon", "Mars"], Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"], Rahu: ["Venus", "Saturn"], Ketu: ["Mars", "Jupiter"],
};
const ENEMIES: Record<PlanetName, PlanetName[]> = {
  Sun: ["Venus", "Saturn"], Moon: [], Mars: ["Mercury"], Mercury: ["Moon"], Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"], Saturn: ["Sun", "Moon", "Mars"], Rahu: ["Sun", "Moon"], Ketu: ["Sun", "Moon"],
};

// Combustion thresholds: max angular distance from the Sun (degrees).
const COMBUSTION_LIMIT: Partial<Record<PlanetName, number>> = { Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15 };

// Sign-based special aspects (houses counted from the planet, 7th is universal).
const SPECIAL_ASPECTS: Partial<Record<PlanetName, number[]>> = { Mars: [4, 8], Jupiter: [5, 9], Saturn: [3, 10] };
const NATURAL_BENEFICS = new Set<PlanetName>(["Jupiter", "Venus", "Mercury", "Moon"]);

export type Dignity = "Exalted" | "Debilitated" | "Own sign" | "Friendly sign" | "Enemy sign" | "Neutral sign";

export type PlanetStrength = {
  planet: PlanetName;
  dignity: Dignity;
  isRetrograde: boolean;
  isCombust: boolean;
  aspectedBy: PlanetName[];
  score: number; // 0-100
  rank: number; // 1 = strongest
};

function angularDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function dignityOf(planet: PlanetName, rashiIndex: number, rashiLord: PlanetName): Dignity {
  if (EXALTATION[planet] === rashiIndex) return "Exalted";
  if (EXALTATION[planet] !== undefined && (EXALTATION[planet]! + 6) % 12 === rashiIndex) return "Debilitated";
  if (OWN_SIGNS[planet]?.includes(rashiIndex)) return "Own sign";
  if (FRIENDS[planet].includes(rashiLord)) return "Friendly sign";
  if (ENEMIES[planet].includes(rashiLord)) return "Enemy sign";
  return "Neutral sign";
}

const DIGNITY_SCORE: Record<Dignity, number> = {
  Exalted: 35, "Own sign": 25, "Friendly sign": 12, "Neutral sign": 0, "Enemy sign": -15, Debilitated: -30,
};

export function computePlanetStrengths(planets: SiderealPlanet[]): PlanetStrength[] {
  const sun = planets.find((p) => p.planet === "Sun");

  const results = planets.map((p) => {
    const dignity = dignityOf(p.planet, p.rashi.index, p.rashi.lord);
    const isCombust =
      p.planet !== "Sun" &&
      COMBUSTION_LIMIT[p.planet] !== undefined &&
      sun !== undefined &&
      angularDistance(p.siderealLongitude, sun.siderealLongitude) <= COMBUSTION_LIMIT[p.planet]!;

    const aspectedBy = planets
      .filter((other) => {
        if (other.planet === p.planet) return false;
        const housesAway = ((p.rashi.index - other.rashi.index + 12) % 12) + 1;
        return housesAway === 7 || (SPECIAL_ASPECTS[other.planet]?.includes(housesAway) ?? false);
      })
      .map((other) => other.planet);

    let score = 50 + DIGNITY_SCORE[dignity];
    if (p.isRetrograde && p.planet !== "Rahu" && p.planet !== "Ketu") score += 8; // cheshta-like boost
    if (isCombust) score -= 20;
    for (const aspecting of aspectedBy) score += NATURAL_BENEFICS.has(aspecting) ? 4 : -4;
    score = Math.max(5, Math.min(100, score));

    return { planet: p.planet, dignity, isRetrograde: p.isRetrograde, isCombust, aspectedBy, score, rank: 0 };
  });

  [...results]
    .sort((a, b) => b.score - a.score)
    .forEach((r, i) => {
      r.rank = i + 1;
    });

  return results;
}
