import { nakshatraFromSidereal } from "./panchanga";
import { NAKSHATRA_LORDS, type PlanetName } from "./constants";

/** Vimshottari Dasha period lengths in years — fixed 120-year cycle across the 9 nakshatra lords. */
const DASHA_YEARS: Record<PlanetName, number> = {
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

const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

export type AntarDasha = {
  lord: PlanetName;
  startDate: string;
  endDate: string;
};

export type DashaPeriod = {
  lord: PlanetName;
  startDate: string;
  endDate: string;
  years: number;
  antardashas: AntarDasha[];
};

function lordSequenceFrom(startLord: PlanetName): PlanetName[] {
  const startIndex = NAKSHATRA_LORDS.indexOf(startLord);
  return Array.from({ length: 9 }, (_, i) => NAKSHATRA_LORDS[(startIndex + i) % 9]);
}

/** Antardashas (sub-periods) within one Mahadasha, proportional to each lord's full dasha length. */
function computeAntardashas(mahaLord: PlanetName, start: number, years: number): AntarDasha[] {
  const sequence = lordSequenceFrom(mahaLord);
  const totalYears = 120;
  let cursor = start;
  return sequence.map((lord) => {
    const subYears = (DASHA_YEARS[lord] * years) / totalYears;
    const subStart = cursor;
    const subEnd = cursor + subYears * MS_PER_YEAR;
    cursor = subEnd;
    return { lord, startDate: new Date(subStart).toISOString(), endDate: new Date(subEnd).toISOString() };
  });
}

/** Full Mahadasha timeline (with Antardashas) from birth, derived from the Moon's nakshatra at birth. */
export function computeVimshottariDasha(birthDate: Date, moonSiderealLongitude: number, spanYears = 120): DashaPeriod[] {
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

    periods.push({
      lord,
      startDate: new Date(start).toISOString(),
      endDate: new Date(end).toISOString(),
      years,
      antardashas: computeAntardashas(lord, start, years),
    });

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
  mahaLord: PlanetName;
  antarLord: PlanetName;
};

/** Splits the Dasha timeline into fixed 5-year age bands (0-80), each tagged with the ruling Maha+Antar lord. */
export function ageBandPredictions(periods: DashaPeriod[], birthDate: Date, maxAge = 80): AgeBandPrediction[] {
  const birthMs = birthDate.getTime();
  const bands: AgeBandPrediction[] = [];

  for (let fromAge = 0; fromAge < maxAge; fromAge += 5) {
    const midpointMs = birthMs + (fromAge + 2.5) * MS_PER_YEAR;
    const maha = periods.find((p) => midpointMs >= new Date(p.startDate).getTime() && midpointMs < new Date(p.endDate).getTime());
    if (!maha) continue;
    const antar = maha.antardashas.find(
      (a) => midpointMs >= new Date(a.startDate).getTime() && midpointMs < new Date(a.endDate).getTime()
    );
    bands.push({ fromAge, toAge: fromAge + 5, mahaLord: maha.lord, antarLord: antar?.lord ?? maha.lord });
  }

  return bands;
}

export const DASHA_THEMES: Record<PlanetName, string> = {
  Sun: "authority, self-confidence, career recognition, and relationships with father figures",
  Moon: "emotional life, home, mother, and the ebb and flow of the mind",
  Mars: "energy, courage, siblings, property, and decisive action",
  Mercury: "communication, learning, trade, and intellectual pursuits",
  Jupiter: "wisdom, wealth, teachers, marriage, and expansion of good fortune",
  Venus: "love, beauty, comfort, creativity, and material pleasures",
  Saturn: "discipline, delay, hard work, and long-term structural gain",
  Rahu: "ambition, unconventional paths, foreign connections, and sudden change",
  Ketu: "detachment, spirituality, introspection, and letting go",
};
