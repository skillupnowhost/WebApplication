import { DateTime } from "luxon";
import type { ChartData } from "@prisma/client";
import { computeTropicalPlanetPositions, computeTropicalAscendant, type PlanetPosition } from "./ephemeris";
import { lahiriAyanamsa, toSidereal } from "./ayanamsa";
import { rashiFromSidereal, nakshatraFromSidereal, tithiFromLongitudes } from "./panchanga";
import { computeVimshottariDasha, ageBandPredictions } from "./dasha";
import { numerologyProfile } from "./numerology";

/** Resolves a local wall-clock birth date/time in a given IANA timezone to a UTC instant. */
export function localBirthInstant(dateStr: string, timeStr: string, timezone: string): Date {
  const dt = DateTime.fromISO(`${dateStr}T${timeStr}`, { zone: timezone });
  return dt.toJSDate();
}

export type SiderealPlanet = PlanetPosition & {
  siderealLongitude: number;
  rashi: ReturnType<typeof rashiFromSidereal>;
  nakshatra: ReturnType<typeof nakshatraFromSidereal>;
};

export type ChartResult = {
  ayanamsaUsed: number;
  planets: SiderealPlanet[];
  ascendant: {
    tropicalLongitude: number;
    siderealLongitude: number;
    rashi: ReturnType<typeof rashiFromSidereal>;
  };
  tithi: ReturnType<typeof tithiFromLongitudes>;
  dashaPeriods: ReturnType<typeof computeVimshottariDasha>;
  ageBands: ReturnType<typeof ageBandPredictions>;
  numerology: ReturnType<typeof numerologyProfile>;
};

/** Runs the full birth-chart calculation once; the result is meant to be stored and reused across styles/languages. */
export function computeChart(params: {
  fullName: string;
  birthDate: Date;
  latitude: number;
  longitude: number;
}): ChartResult {
  const { fullName, birthDate, latitude, longitude } = params;

  const ayanamsaUsed = lahiriAyanamsa(birthDate);
  const tropicalPlanets = computeTropicalPlanetPositions(birthDate);

  const planets: SiderealPlanet[] = tropicalPlanets.map((p) => {
    const siderealLongitude = toSidereal(p.tropicalLongitude, ayanamsaUsed);
    return {
      ...p,
      siderealLongitude,
      rashi: rashiFromSidereal(siderealLongitude),
      nakshatra: nakshatraFromSidereal(siderealLongitude),
    };
  });

  const ascendantTropical = computeTropicalAscendant(birthDate, latitude, longitude);
  const ascendantSidereal = toSidereal(ascendantTropical, ayanamsaUsed);

  const moon = planets.find((p) => p.planet === "Moon");
  const sun = planets.find((p) => p.planet === "Sun");
  if (!moon || !sun) throw new Error("Ephemeris calculation did not return Sun/Moon positions");

  const dashaPeriods = computeVimshottariDasha(birthDate, moon.siderealLongitude);
  const ageBands = ageBandPredictions(dashaPeriods, birthDate);

  return {
    ayanamsaUsed,
    planets,
    ascendant: {
      tropicalLongitude: ascendantTropical,
      siderealLongitude: ascendantSidereal,
      rashi: rashiFromSidereal(ascendantSidereal),
    },
    tithi: tithiFromLongitudes(moon.tropicalLongitude, sun.tropicalLongitude),
    dashaPeriods,
    ageBands,
    numerology: numerologyProfile(fullName, birthDate),
  };
}

/** Maps a computed ChartResult onto the ChartData row's JSON columns for persistence. */
export function serializeChart(chart: ChartResult) {
  return {
    ayanamsaUsed: chart.ayanamsaUsed,
    planetsJson: JSON.stringify(chart.planets),
    ascendantJson: JSON.stringify(chart.ascendant),
    dashaJson: JSON.stringify({ periods: chart.dashaPeriods, ageBands: chart.ageBands, tithi: chart.tithi }),
    numerologyJson: JSON.stringify(chart.numerology),
  };
}

/** Inverse of serializeChart — reconstructs a full ChartResult from a stored ChartData row. */
export function deserializeChart(record: ChartData): ChartResult {
  const dasha = JSON.parse(record.dashaJson) as {
    periods: ChartResult["dashaPeriods"];
    ageBands: ChartResult["ageBands"];
    tithi: ChartResult["tithi"];
  };
  return {
    ayanamsaUsed: record.ayanamsaUsed,
    planets: JSON.parse(record.planetsJson),
    ascendant: JSON.parse(record.ascendantJson),
    tithi: dasha.tithi,
    dashaPeriods: dasha.periods,
    ageBands: dasha.ageBands,
    numerology: JSON.parse(record.numerologyJson),
  };
}
