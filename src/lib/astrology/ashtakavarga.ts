import type { PlanetName } from "./constants";

/** Ashtakavarga — classical Parashari strength system (Brihat Parashara Hora Shastra).
 *
 * For each of the 7 grahas' own Bhinnashtakavarga chart, eight contributors (the 7 grahas
 * plus the Lagna) each cast a bindu (point) onto specific houses counted from the
 * CONTRIBUTOR's own rashi. The tables below are the fixed classical benefic-house lists per
 * contributor, for each target planet's chart. The well-known checksum — total bindus across
 * all seven planets' Sarvashtakavarga sums to exactly 337 — holds for these tables and was
 * used to cross-check the transcription. */

export type AshtakavargaTarget = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";
export type AshtakavargaContributor = AshtakavargaTarget | "Lagna";

/** Houses (1-12, counted from the contributor's own position) that receive a bindu, per [target][contributor]. */
const BINDU_TABLE: Record<AshtakavargaTarget, Record<AshtakavargaContributor, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Lagna: [3, 6, 10, 11],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 3, 6, 10, 11],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Lagna: [1, 3, 4, 6, 10, 11],
  },
};

export const ASHTAKAVARGA_TARGETS: AshtakavargaTarget[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const CONTRIBUTORS: AshtakavargaContributor[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Lagna"];

export type BhinnashtakavargaResult = { target: AshtakavargaTarget; bindus: number[] }; // bindus[rashiIndex] 0-11
export type AshtakavargaResult = {
  bhinna: BhinnashtakavargaResult[];
  sarva: number[]; // sarvashtakavarga bindus[rashiIndex], sums to 337 across all 12 signs
};

/** Computes Bhinnashtakavarga for all 7 planets plus the combined Sarvashtakavarga, given each
 * contributor's rashi index (0-11, Aries=0) at birth. */
export function computeAshtakavarga(contributorRashiIndex: Record<AshtakavargaContributor, number>): AshtakavargaResult {
  const bhinna: BhinnashtakavargaResult[] = ASHTAKAVARGA_TARGETS.map((target) => {
    const bindus = new Array(12).fill(0);
    for (const contributor of CONTRIBUTORS) {
      const fromRashi = contributorRashiIndex[contributor];
      const houses = BINDU_TABLE[target][contributor];
      for (const house of houses) {
        const rashiIndex = (fromRashi + house - 1) % 12;
        bindus[rashiIndex] += 1;
      }
    }
    return { target, bindus };
  });

  const sarva = new Array(12).fill(0);
  for (const { bindus } of bhinna) {
    for (let i = 0; i < 12; i++) sarva[i] += bindus[i];
  }

  return { bhinna, sarva };
}

/** Builds the contributor-rashi map straight from computed planet positions + ascendant. */
export function contributorRashiFromChart(
  planets: { planet: PlanetName; rashiIndex: number }[],
  ascendantRashiIndex: number
): Record<AshtakavargaContributor, number> {
  const map = {} as Record<AshtakavargaContributor, number>;
  for (const target of ASHTAKAVARGA_TARGETS) {
    const p = planets.find((x) => x.planet === target);
    if (p) map[target] = p.rashiIndex;
  }
  map.Lagna = ascendantRashiIndex;
  return map;
}
