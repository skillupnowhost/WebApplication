import * as Astronomy from "astronomy-engine";

export type PlanetName = "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Rahu" | "Ketu";

export type PlanetPosition = {
  planet: PlanetName;
  /** Geocentric tropical ecliptic longitude, degrees 0-360. */
  tropicalLongitude: number;
};

/** Bodies other than the Sun — geocentric apparent ecliptic longitude via GeoVector + Ecliptic. */
const GEO_BODY_MAP: Record<string, Astronomy.Body> = {
  Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn,
};

export function normalizeDegrees(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

/** Mean lunar ascending node longitude (Rahu), Meeus "Astronomical Algorithms" formula 22.2. */
function meanLunarNodeLongitude(julianCenturiesTT: number): number {
  const T = julianCenturiesTT;
  const omega =
    125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441 - (T * T * T * T) / 60616000;
  return normalizeDegrees(omega);
}

/** Sun, Moon, and the five visible planets, plus the lunar nodes (Rahu/Ketu), all tropical/geocentric. */
export function computeTropicalPlanetPositions(date: Date): PlanetPosition[] {
  const time = new Astronomy.AstroTime(date);

  const positions: PlanetPosition[] = [
    { planet: "Sun", tropicalLongitude: normalizeDegrees(Astronomy.SunPosition(time).elon) },
    ...Object.entries(GEO_BODY_MAP).map(([name, body]) => ({
      planet: name as PlanetName,
      tropicalLongitude: normalizeDegrees(Astronomy.Ecliptic(Astronomy.GeoVector(body, time, true)).elon),
    })),
  ];

  const rahuLongitude = meanLunarNodeLongitude(time.tt / 36525);
  positions.push({ planet: "Rahu", tropicalLongitude: rahuLongitude });
  positions.push({ planet: "Ketu", tropicalLongitude: normalizeDegrees(rahuLongitude + 180) });

  return positions;
}

/** Ascendant (lagna) tropical longitude from birth instant + geographic coordinates. */
export function computeTropicalAscendant(date: Date, latitude: number, longitude: number): number {
  const time = new Astronomy.AstroTime(date);
  const obliquityDeg = Astronomy.e_tilt(time).tobl;
  const gstHours = Astronomy.SiderealTime(time);

  let lstHours = gstHours + longitude / 15;
  lstHours = ((lstHours % 24) + 24) % 24;
  const ramcDeg = lstHours * 15;

  const latRad = (latitude * Math.PI) / 180;
  const oblRad = (obliquityDeg * Math.PI) / 180;
  const ramcRad = (ramcDeg * Math.PI) / 180;

  const y = -Math.cos(ramcRad);
  const x = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(ramcRad);
  const ascendantDeg = (Math.atan2(y, x) * 180) / Math.PI;

  return normalizeDegrees(ascendantDeg);
}
