import * as Astronomy from "astronomy-engine";
import type { PlanetName } from "./constants";

export type PlanetPosition = {
  planet: PlanetName;
  tropicalLongitude: number; // degrees, 0-360, geocentric apparent ecliptic longitude of date
  isRetrograde: boolean;
};

const CLASSICAL_BODIES: { name: Exclude<PlanetName, "Rahu" | "Ketu">; body: Astronomy.Body }[] = [
  { name: "Sun", body: Astronomy.Body.Sun },
  { name: "Moon", body: Astronomy.Body.Moon },
  { name: "Mercury", body: Astronomy.Body.Mercury },
  { name: "Venus", body: Astronomy.Body.Venus },
  { name: "Mars", body: Astronomy.Body.Mars },
  { name: "Jupiter", body: Astronomy.Body.Jupiter },
  { name: "Saturn", body: Astronomy.Body.Saturn },
];

function normalizeDegrees(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

/** Mean lunar ascending node (Rahu) longitude — Meeus, Astronomical Algorithms, ch. 47. */
function meanLunarNodeLongitude(date: Date): number {
  const julianDay = date.getTime() / 86400000 + 2440587.5;
  const T = (julianDay - 2451545.0) / 36525; // Julian centuries since J2000.0
  const omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T ** 2 + T ** 3 / 467441 - T ** 4 / 60616000;
  return normalizeDegrees(omega);
}

/**
 * GEOCENTRIC apparent ecliptic longitude of date. Astronomy-engine's EclipticLongitude()
 * is HELIOCENTRIC — using it here silently produces earth-shifted positions for every body
 * (verified against a professional Thirukkanitha panchangam: Moon was ~135° off). The correct
 * geocentric path is GeoVector (with aberration) converted through Ecliptic(); the Sun still
 * needs SunPosition() because it has no meaningful heliocentric position.
 */
function eclipticLongitudeOf(body: Astronomy.Body, date: Date): number {
  if (body === Astronomy.Body.Sun) return Astronomy.SunPosition(date).elon;
  return Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;
}

function isRetrograde(body: Astronomy.Body, date: Date): boolean {
  const before = eclipticLongitudeOf(body, new Date(date.getTime() - 24 * 3600 * 1000));
  const after = eclipticLongitudeOf(body, new Date(date.getTime() + 24 * 3600 * 1000));
  let diff = after - before;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

/** Geocentric apparent tropical longitudes of the Navagraha (9 Vedic "planets") at a given instant. */
export function computeTropicalPlanetPositions(date: Date): PlanetPosition[] {
  const positions: PlanetPosition[] = CLASSICAL_BODIES.map(({ name, body }) => ({
    planet: name,
    tropicalLongitude: normalizeDegrees(eclipticLongitudeOf(body, date)),
    isRetrograde: name === "Sun" || name === "Moon" ? false : isRetrograde(body, date),
  }));

  const rahuLongitude = meanLunarNodeLongitude(date);
  positions.push({ planet: "Rahu", tropicalLongitude: rahuLongitude, isRetrograde: true });
  positions.push({ planet: "Ketu", tropicalLongitude: normalizeDegrees(rahuLongitude + 180), isRetrograde: true });

  return positions;
}

/**
 * Tropical ecliptic longitude of the ascendant (Lagna) for a birth instant + geographic location.
 * Standard RAMC formula (Duffett-Smith, "Practical Astronomy with Your Calculator"). The atan2
 * arrangement lands in the descendant's quadrant, so a +180° correction selects the rising point —
 * verified to the arc-second against a professional Thirukkanitha panchangam reference chart.
 */
export function computeTropicalAscendant(date: Date, latitude: number, longitude: number): number {
  const time = Astronomy.MakeTime(date);
  const gstHours = Astronomy.SiderealTime(time); // Greenwich apparent sidereal time, hours
  const ramcDeg = normalizeDegrees(gstHours * 15 + longitude);
  const obliquityDeg = Astronomy.e_tilt(time).tobl;

  const ramcRad = (ramcDeg * Math.PI) / 180;
  const oblRad = (obliquityDeg * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;

  const y = -Math.cos(ramcRad);
  const x = Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);

  return normalizeDegrees((Math.atan2(y, x) * 180) / Math.PI + 180);
}
