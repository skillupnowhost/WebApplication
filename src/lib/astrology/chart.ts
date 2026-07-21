import { DateTime } from "luxon";
import { computeTropicalPlanetPositions, computeTropicalAscendant, type PlanetPosition } from "./ephemeris";
import { ayanamsaForSystem, toSidereal, type AstrologySystem } from "./ayanamsa";
import { rashiFromSidereal, nakshatraFromSidereal, tithiFromLongitudes, yogaFromLongitudes, karanaFromLongitudes, vaaraFromLocalWeekday } from "./panchanga";
import { computeVimshottariDasha, ageBandPredictions } from "./dasha";
import { numerologyProfile } from "./numerology";
import { computeDoshas } from "./dosha";
import type { RashiInfo, NakshatraInfo } from "./constants";

/** Resolves a local wall-clock birth date/time in a given IANA timezone to a UTC instant. */
export function localBirthInstant(dateStr: string, timeStr: string, timezone: string): Date {
  const dt = DateTime.fromISO(`${dateStr}T${timeStr}`, { zone: timezone });
  return dt.toJSDate();
}

export type SiderealPlanet = PlanetPosition & {
  siderealLongitude: number;
  rashi: RashiInfo;
  nakshatra: NakshatraInfo & { pada: number; fractionElapsed: number };
  houseFromAscendant: number;
};

export type ChartResult = {
  ayanamsaUsed: number;
  planets: SiderealPlanet[];
  ascendant: {
    tropicalLongitude: number;
    siderealLongitude: number;
    rashi: RashiInfo;
  };
  panchanga: {
    tithi: ReturnType<typeof tithiFromLongitudes>;
    yoga: ReturnType<typeof yogaFromLongitudes>;
    karana: ReturnType<typeof karanaFromLongitudes>;
    vaara: ReturnType<typeof vaaraFromLocalWeekday>;
  };
  dashaPeriods: ReturnType<typeof computeVimshottariDasha>;
  ageBands: ReturnType<typeof ageBandPredictions>;
  numerology: ReturnType<typeof numerologyProfile>;
  doshas: ReturnType<typeof computeDoshas>;
};

function houseOf(rashiIndex: number, ascendantRashiIndex: number): number {
  return ((rashiIndex - ascendantRashiIndex + 12) % 12) + 1;
}

/** Runs the full birth-chart calculation once; the result is meant to be stored and reused across styles/languages. */
export function computeChart(params: {
  fullName: string;
  birthDate: Date;
  latitude: number;
  longitude: number;
  timezone: string;
  system?: AstrologySystem;
}): ChartResult {
  const { fullName, birthDate, latitude, longitude, timezone, system = "THIRUKKANITHAM" } = params;

  const ayanamsaUsed = ayanamsaForSystem(system, birthDate);
  const tropicalPlanets = computeTropicalPlanetPositions(birthDate);

  const ascendantTropical = computeTropicalAscendant(birthDate, latitude, longitude);
  const ascendantSidereal = toSidereal(ascendantTropical, ayanamsaUsed);
  const ascendantRashi = rashiFromSidereal(ascendantSidereal);

  const planets: SiderealPlanet[] = tropicalPlanets.map((p) => {
    const siderealLongitude = toSidereal(p.tropicalLongitude, ayanamsaUsed);
    const rashi = rashiFromSidereal(siderealLongitude);
    return {
      ...p,
      siderealLongitude,
      rashi,
      nakshatra: nakshatraFromSidereal(siderealLongitude),
      houseFromAscendant: houseOf(rashi.index, ascendantRashi.index),
    };
  });

  const moon = planets.find((p) => p.planet === "Moon");
  const sun = planets.find((p) => p.planet === "Sun");
  if (!moon || !sun) throw new Error("Ephemeris calculation did not return Sun/Moon positions");

  const dashaPeriods = computeVimshottariDasha(birthDate, moon.siderealLongitude);
  const ageBands = ageBandPredictions(dashaPeriods, birthDate);

  const localWeekday = DateTime.fromJSDate(birthDate, { zone: timezone }).weekday % 7; // luxon: 1=Mon..7=Sun -> 0=Sun..6=Sat

  return {
    ayanamsaUsed,
    planets,
    ascendant: {
      tropicalLongitude: ascendantTropical,
      siderealLongitude: ascendantSidereal,
      rashi: ascendantRashi,
    },
    panchanga: {
      // Tithi/karana depend on the Moon-Sun DIFFERENCE (ayanamsa cancels), but yoga is a SUM
      // and must use sidereal (nirayana) longitudes to match classical panchangams.
      tithi: tithiFromLongitudes(moon.tropicalLongitude, sun.tropicalLongitude),
      yoga: yogaFromLongitudes(moon.siderealLongitude, sun.siderealLongitude),
      karana: karanaFromLongitudes(moon.tropicalLongitude, sun.tropicalLongitude),
      vaara: vaaraFromLocalWeekday(localWeekday),
    },
    dashaPeriods,
    ageBands,
    numerology: numerologyProfile(fullName, birthDate),
    doshas: computeDoshas(
      planets.map((p) => ({ planet: p.planet, rashiIndex: p.rashi.index })),
      ascendantRashi.index
    ),
  };
}
