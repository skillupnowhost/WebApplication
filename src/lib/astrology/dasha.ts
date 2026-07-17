import { NAKSHATRA_LORDS, nakshatraFromSidereal } from "./panchanga";

/** Vimshottari Dasha period lengths in years — fixed 120-year cycle across the 9 nakshatra lords. */
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

export type DashaPeriod = {
  lord: string;
  startDate: string;
  endDate: string;
  years: number;
};

const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

/** Full Mahadasha timeline from birth, derived from the Moon's nakshatra position at birth. */
export function computeVimshottariDasha(
  birthDate: Date,
  moonSiderealLongitude: number,
  spanYears = 120
): DashaPeriod[] {
  const nakshatra = nakshatraFromSidereal(moonSiderealLongitude);
  const startLordIndex = NAKSHATRA_LORDS.indexOf(nakshatra.lord);
  const balanceYears = DASHA_YEARS[nakshatra.lord] * (1 - nakshatra.fractionElapsed);

  const periods: DashaPeriod[] = [];
  let cursor = birthDate.getTime();
  let elapsedYears = 0;
  let lordIndex = startLordIndex;
  let isFirst = true;

  while (elapsedYears < spanYears) {
    const lord = NAKSHATRA_LORDS[lordIndex];
    const years = isFirst ? balanceYears : DASHA_YEARS[lord];
    const start = cursor;
    const end = cursor + years * MS_PER_YEAR;

    periods.push({ lord, startDate: new Date(start).toISOString(), endDate: new Date(end).toISOString(), years });

    cursor = end;
    elapsedYears += years;
    lordIndex = (lordIndex + 1) % 9;
    isFirst = false;
  }

  return periods;
}

export type AgeBandPrediction = {
  fromAge: number;
  toAge: number;
  lord: string;
  theme: string;
};

export const DASHA_THEMES: Record<string, string> = {
  Sun: "authority, self-confidence, career recognition, and relationships with father figures",
  Moon: "emotional life, home, family, and mental well-being",
  Mars: "energy, courage, competition, property, and siblings",
  Mercury: "communication, learning, business acumen, and adaptability",
  Jupiter: "growth, wisdom, wealth, marriage, and higher education",
  Venus: "love, comfort, creativity, luxury, and relationships",
  Saturn: "discipline, delays, hard-won achievement, and long-term responsibility",
  Rahu: "ambition, unconventional paths, sudden change, and material drive",
  Ketu: "spirituality, detachment, introspection, and past-life karma",
};

/** Buckets the Mahadasha timeline into fixed-width age bands (default: every 5 years, birth to 80). */
export function ageBandPredictions(
  periods: DashaPeriod[],
  birthDate: Date,
  maxAge = 80,
  bandSize = 5
): AgeBandPrediction[] {
  const birthMs = birthDate.getTime();
  const bands: AgeBandPrediction[] = [];

  for (let fromAge = 0; fromAge < maxAge; fromAge += bandSize) {
    const toAge = fromAge + bandSize;
    const midpointMs = birthMs + ((fromAge + toAge) / 2) * MS_PER_YEAR;
    const governing = periods.find(
      (p) => midpointMs >= new Date(p.startDate).getTime() && midpointMs < new Date(p.endDate).getTime()
    );
    const lord = governing?.lord ?? periods[periods.length - 1]?.lord ?? "Jupiter";
    bands.push({ fromAge, toAge, lord, theme: DASHA_THEMES[lord] });
  }

  return bands;
}
