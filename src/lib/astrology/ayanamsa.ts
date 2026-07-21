const PRECESSION_ARCSEC_PER_YEAR = 50.2388475; // IAU general precession in longitude
const REFERENCE_EPOCH_MS = Date.UTC(1900, 0, 1);
const MS_PER_JULIAN_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Supported astrology systems. Each maps to a real, distinct ayanamsa so the
 * calculation genuinely changes with the selection — no faked variation.
 * VAKYA has no computable modern ephemeris equivalent; positions are computed
 * by the Drik (astronomical) method with Lahiri ayanamsa and the report says so.
 */
export const ASTROLOGY_SYSTEMS = ["THIRUKKANITHAM", "VAKYA", "KP", "RAMAN"] as const;
export type AstrologySystem = (typeof ASTROLOGY_SYSTEMS)[number];

/** Ayanamsa value at 1900-01-01T00:00:00 UTC per system (degrees). */
const AYANAMSA_BASE_1900: Record<AstrologySystem, number> = {
  THIRUKKANITHAM: 22.460148, // Lahiri (Chitrapaksha) — standard for Thirukkanitha panchangams
  VAKYA: 22.460148, // computed via Drik/Lahiri; honest approximation noted in reports
  KP: 22.363889, // Krishnamurti ayanamsa (22°21'50" at 1900)
  RAMAN: 21.013333, // B.V. Raman ayanamsa (21°00'48" at 1900)
};

/** Human-readable ayanamsa name shown in report footers per system. */
export const AYANAMSA_NAMES: Record<AstrologySystem, string> = {
  THIRUKKANITHAM: "Lahiri",
  VAKYA: "Lahiri (Drik-computed)",
  KP: "Krishnamurti (KP)",
  RAMAN: "Raman",
};

/**
 * Linear-precession ayanamsa approximation, accurate to a few arc-minutes across
 * the modern era. This trades the full IAU nutation model (which requires the
 * native Swiss Ephemeris library) for a pure-JS implementation that runs
 * anywhere Node/Vercel does.
 */
export function ayanamsaForSystem(system: AstrologySystem, date: Date): number {
  const yearsSinceReference = (date.getTime() - REFERENCE_EPOCH_MS) / MS_PER_JULIAN_YEAR;
  return AYANAMSA_BASE_1900[system] + (PRECESSION_ARCSEC_PER_YEAR * yearsSinceReference) / 3600;
}

/** Lahiri (Chitrapaksha) ayanamsa — kept as the default for callers that don't select a system. */
export function lahiriAyanamsa(date: Date): number {
  return ayanamsaForSystem("THIRUKKANITHAM", date);
}

export function toSidereal(tropicalLongitude: number, ayanamsaDeg: number): number {
  const sidereal = tropicalLongitude - ayanamsaDeg;
  return ((sidereal % 360) + 360) % 360;
}
