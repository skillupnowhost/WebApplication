import {
  RASHIS,
  NAKSHATRAS,
  TITHI_NAMES,
  YOGA_NAMES,
  KARANA_NAMES_MOVABLE,
  KARANA_NAMES_FIXED,
  VAARA_NAMES,
  VAARA_LORDS,
  type RashiInfo,
  type NakshatraInfo,
} from "./constants";

const RASHI_SPAN = 30;
const NAKSHATRA_SPAN = 360 / 27;
const PADA_SPAN = NAKSHATRA_SPAN / 4;

function normalizeDegrees(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

export function rashiFromSidereal(siderealLongitude: number): RashiInfo {
  const index = Math.floor(normalizeDegrees(siderealLongitude) / RASHI_SPAN) % 12;
  return RASHIS[index];
}

export function nakshatraFromSidereal(siderealLongitude: number): NakshatraInfo & { pada: number; fractionElapsed: number } {
  const lon = normalizeDegrees(siderealLongitude);
  const index = Math.floor(lon / NAKSHATRA_SPAN) % 27;
  const positionInNakshatra = lon - index * NAKSHATRA_SPAN;
  const pada = Math.floor(positionInNakshatra / PADA_SPAN) + 1;
  const fractionElapsed = positionInNakshatra / NAKSHATRA_SPAN;
  return { ...NAKSHATRAS[index], pada, fractionElapsed };
}

/** Navamsa (D9) rashi: each sign splits into nine 3°20' parts counted onward from the sign itself ×9. */
export function navamsaRashiIndex(siderealLongitude: number): number {
  const lon = normalizeDegrees(siderealLongitude);
  const rashiIndex = Math.floor(lon / RASHI_SPAN) % 12;
  const part = Math.floor((lon - rashiIndex * RASHI_SPAN) / (RASHI_SPAN / 9));
  return (rashiIndex * 9 + part) % 12;
}

export function navamsaRashiFromSidereal(siderealLongitude: number): RashiInfo {
  return RASHIS[navamsaRashiIndex(siderealLongitude)];
}

/** Formats an absolute ecliptic longitude as in-sign degrees° minutes′ seconds″. */
export function formatDegreesInSign(siderealLongitude: number): string {
  const lon = normalizeDegrees(siderealLongitude);
  const inSign = lon % RASHI_SPAN;
  const deg = Math.floor(inSign);
  const minFloat = (inSign - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  return `${String(deg).padStart(2, "0")}° ${String(min).padStart(2, "0")}′ ${String(sec).padStart(2, "0")}″`;
}

export type Tithi = {
  index: number; // 0-29
  name: string;
  paksha: "Shukla" | "Krishna";
  numberInPaksha: number; // 1-15
};

export function tithiFromLongitudes(moonTropicalLongitude: number, sunTropicalLongitude: number): Tithi {
  const diff = normalizeDegrees(moonTropicalLongitude - sunTropicalLongitude);
  const index = Math.floor(diff / 12);
  const paksha: "Shukla" | "Krishna" = index < 15 ? "Shukla" : "Krishna";
  const numberInPaksha = (index % 15) + 1;
  const name = numberInPaksha === 15 ? TITHI_NAMES[14] : TITHI_NAMES[numberInPaksha - 1];
  return { index, name, paksha, numberInPaksha };
}

export type Yoga = { index: number; name: string };

export function yogaFromLongitudes(moonTropicalLongitude: number, sunTropicalLongitude: number): Yoga {
  const sum = normalizeDegrees(moonTropicalLongitude + sunTropicalLongitude);
  const index = Math.floor(sum / NAKSHATRA_SPAN) % 27;
  return { index, name: YOGA_NAMES[index] };
}

export type Karana = { index: number; name: string; fixed: boolean };

export function karanaFromLongitudes(moonTropicalLongitude: number, sunTropicalLongitude: number): Karana {
  const diff = normalizeDegrees(moonTropicalLongitude - sunTropicalLongitude);
  const halfTithiIndex = Math.floor(diff / 6); // 0-59

  if (halfTithiIndex === 0) return { index: 0, name: KARANA_NAMES_FIXED[0], fixed: true }; // Kimstughna
  if (halfTithiIndex >= 57) {
    return { index: halfTithiIndex, name: KARANA_NAMES_FIXED[halfTithiIndex - 56], fixed: true }; // Shakuni/Chatushpada/Naga
  }
  const movableIndex = (halfTithiIndex - 1) % 7;
  return { index: halfTithiIndex, name: KARANA_NAMES_MOVABLE[movableIndex], fixed: false };
}

export type Vaara = { index: number; name: string; lord: string };

export function vaaraFromLocalWeekday(weekdayIndex: number): Vaara {
  // weekdayIndex: 0 = Sunday .. 6 = Saturday (local civil day at birth place)
  return { index: weekdayIndex, name: VAARA_NAMES[weekdayIndex], lord: VAARA_LORDS[weekdayIndex] };
}
