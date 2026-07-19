import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";
import { lahiriAyanamsa, toSidereal } from "./ayanamsa";
import {
  nakshatraFromSidereal,
  tithiFromLongitudes,
  yogaFromLongitudes,
  karanaFromLongitudes,
  vaaraFromLocalWeekday,
  type Tithi,
  type Yoga,
  type Karana,
  type Vaara,
} from "./panchanga";
import { computeRiseSetTimes } from "./almanac";
import { computeDayMuhurta, type TimeWindow } from "./muhurta";
import { NAKSHATRAS, type MuhurthamEventType, type NakshatraInfo } from "./constants";

/**
 * Shubha Muhurtham finder: scans a local-date range and scores each day for an event
 * from the sunrise panchangam — nakshatra (event-specific classical lists), tithi,
 * weekday, yoga, and karana. Time slots come from the day-muhurta engine: auspicious
 * choghadiya/Abhijit windows that don't touch Rahu Kalam, Yamagandam, or Gulikai.
 */

// Nakshatra indexes (0 = Ashwini … 26 = Revati) traditionally favoured per event.
const EVENT_NAKSHATRAS: Record<MuhurthamEventType, number[]> = {
  marriage: [3, 4, 9, 11, 12, 14, 16, 18, 20, 25, 26],
  engagement: [3, 4, 9, 11, 12, 14, 16, 20, 25, 26],
  griha_pravesam: [3, 4, 6, 7, 11, 12, 13, 16, 20, 23, 25, 26],
  business_opening: [0, 3, 7, 11, 12, 13, 16, 20, 26],
  naming_ceremony: [0, 3, 4, 6, 7, 11, 12, 14, 16, 21, 26],
  education_start: [0, 3, 4, 6, 7, 12, 13, 14, 16, 21, 26],
  travel: [0, 4, 6, 7, 12, 16, 21, 22, 26],
  vehicle_purchase: [0, 3, 4, 6, 7, 12, 13, 16, 21, 22, 26],
};

// The generally auspicious set — a partial score when the day misses the event-specific list.
const GENERAL_NAKSHATRAS = new Set([0, 3, 4, 6, 7, 11, 12, 13, 14, 16, 20, 21, 22, 23, 25, 26]);

// Rikta tithis (4th/9th/14th of either paksha) and Amavasya are avoided for all events.
const RIKTA_TITHI_NUMBERS = new Set([4, 9, 14]);
const GOOD_TITHI_NUMBERS = new Set([2, 3, 5, 7, 10, 11, 13]);

// Weekday quality per event group: 0=Sun..6=Sat.
const GOOD_WEEKDAYS: Record<MuhurthamEventType, number[]> = {
  marriage: [1, 3, 4, 5],
  engagement: [1, 3, 4, 5],
  griha_pravesam: [1, 3, 4, 5],
  business_opening: [1, 3, 4, 5, 0],
  naming_ceremony: [1, 3, 4, 5],
  education_start: [1, 3, 4, 5, 0],
  travel: [1, 3, 4, 0],
  vehicle_purchase: [1, 3, 4, 5],
};
const BAD_WEEKDAYS: Record<MuhurthamEventType, number[]> = {
  marriage: [2, 6],
  engagement: [2, 6],
  griha_pravesam: [2, 6],
  business_opening: [2],
  naming_ceremony: [2, 6],
  education_start: [2, 6],
  travel: [2, 6],
  vehicle_purchase: [2, 6],
};

// Inauspicious nitya yogas by index into YOGA_NAMES.
const BAD_YOGAS = new Set([5, 8, 9, 12, 14, 16, 18, 26]);

export type MuhurthamReasonKey =
  | "nakshatraIdeal"
  | "nakshatraGeneral"
  | "nakshatraUnfavourable"
  | "tithiGood"
  | "tithiRikta"
  | "tithiAmavasya"
  | "weekdayGood"
  | "weekdayBad"
  | "yogaBad"
  | "karanaVishti";

export type MuhurthamDay = {
  dateIso: string; // local calendar date, yyyy-MM-dd
  weekday: Vaara;
  score: number; // 0-100
  verdict: "excellent" | "good" | "average" | "avoid";
  nakshatra: NakshatraInfo & { pada: number };
  tithi: Tithi;
  yoga: Yoga;
  karana: Karana;
  sunrise: string | null;
  sunset: string | null;
  goodSlots: TimeWindow[];
  avoidWindows: TimeWindow[]; // Rahu Kalam / Yamagandam / Gulikai
  reasons: MuhurthamReasonKey[];
};

export type MuhurthamResult = {
  days: MuhurthamDay[]; // every scanned day, chronological
  best: MuhurthamDay[]; // top days by score, then date
};

const MAX_SCAN_DAYS = 120;

function windowsOverlap(a: TimeWindow, b: TimeWindow): boolean {
  return a.start < b.end && b.start < a.end; // ISO strings in the same zone compare lexicographically
}

function moonSunLongitudes(date: Date): { moon: number; sun: number } {
  // Geocentric apparent longitudes — Sun via SunPosition (no heliocentric position exists),
  // Moon via GeoVector→Ecliptic. See ephemeris.ts for why EclipticLongitude() is wrong here.
  const sun = Astronomy.SunPosition(date).elon;
  const moon = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, date, true)).elon;
  const norm = (d: number) => ((d % 360) + 360) % 360;
  return { moon: norm(moon), sun: norm(sun) };
}

function scoreDay(params: {
  event: MuhurthamEventType;
  nakshatraIndex: number;
  tithi: Tithi;
  yoga: Yoga;
  karana: Karana;
  weekdayIndex: number;
}): { score: number; reasons: MuhurthamReasonKey[] } {
  const { event, nakshatraIndex, tithi, yoga, karana, weekdayIndex } = params;
  const reasons: MuhurthamReasonKey[] = [];
  let score = 0;

  if (EVENT_NAKSHATRAS[event].includes(nakshatraIndex)) {
    score += 40;
    reasons.push("nakshatraIdeal");
  } else if (GENERAL_NAKSHATRAS.has(nakshatraIndex)) {
    score += 22;
    reasons.push("nakshatraGeneral");
  } else {
    reasons.push("nakshatraUnfavourable");
  }

  const isAmavasya = tithi.index === 29;
  if (isAmavasya) {
    reasons.push("tithiAmavasya");
  } else if (RIKTA_TITHI_NUMBERS.has(tithi.numberInPaksha)) {
    reasons.push("tithiRikta");
  } else if (GOOD_TITHI_NUMBERS.has(tithi.numberInPaksha) || tithi.index === 14) {
    score += 25;
    reasons.push("tithiGood");
  } else {
    score += 15;
  }

  if (GOOD_WEEKDAYS[event].includes(weekdayIndex)) {
    score += 15;
    reasons.push("weekdayGood");
  } else if (BAD_WEEKDAYS[event].includes(weekdayIndex)) {
    reasons.push("weekdayBad");
  } else {
    score += 8;
  }

  if (BAD_YOGAS.has(yoga.index)) {
    reasons.push("yogaBad");
  } else {
    score += 10;
  }

  if (!karana.fixed && karana.name === "Vishti") {
    reasons.push("karanaVishti");
  } else {
    score += 10;
  }

  return { score, reasons };
}

function verdictOf(score: number): MuhurthamDay["verdict"] {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "average";
  return "avoid";
}

export function findMuhurthamDays(params: {
  event: MuhurthamEventType;
  fromDate: string; // yyyy-MM-dd (local)
  toDate: string;
  latitude: number;
  longitude: number;
  timezone: string;
  bestCount?: number;
}): MuhurthamResult {
  const { event, fromDate, toDate, latitude, longitude, timezone, bestCount = 6 } = params;

  const start = DateTime.fromISO(fromDate, { zone: timezone }).startOf("day");
  const end = DateTime.fromISO(toDate, { zone: timezone }).startOf("day");
  const totalDays = Math.min(Math.max(Math.floor(end.diff(start, "days").days) + 1, 1), MAX_SCAN_DAYS);

  const days: MuhurthamDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const day = start.plus({ days: i });
    const noonInstant = day.plus({ hours: 12 }).toJSDate();
    const riseSet = computeRiseSetTimes(noonInstant, latitude, longitude, timezone);

    // Panchang of the day is read at sunrise (fall back to local noon at extreme latitudes).
    const panchangInstant = riseSet.sunrise ? DateTime.fromISO(riseSet.sunrise, { setZone: true }).toJSDate() : noonInstant;
    const { moon, sun } = moonSunLongitudes(panchangInstant);
    const ayanamsa = lahiriAyanamsa(panchangInstant);
    const moonSidereal = toSidereal(moon, ayanamsa);
    const sunSidereal = toSidereal(sun, ayanamsa);

    const nakshatra = nakshatraFromSidereal(moonSidereal);
    const tithi = tithiFromLongitudes(moon, sun);
    const yoga = yogaFromLongitudes(moonSidereal, sunSidereal); // sidereal sum — the ayanamsa doesn't cancel here
    const karana = karanaFromLongitudes(moon, sun);
    const weekdayIndex = day.weekday % 7;

    const muhurta = riseSet.sunrise && riseSet.sunset ? computeDayMuhurta(riseSet.sunrise, riseSet.sunset) : null;
    const avoidWindows = muhurta ? [muhurta.rahuKalam, muhurta.yamagandam, muhurta.gulikai] : [];
    const goodSlots = muhurta
      ? [muhurta.abhijit, ...muhurta.choghadiya.filter((w) => w.kind === "auspicious")]
          .filter((w) => !avoidWindows.some((bad) => windowsOverlap(w, bad)))
          .sort((a, b) => a.start.localeCompare(b.start))
          .slice(0, 4)
      : [];

    const { score, reasons } = scoreDay({ event, nakshatraIndex: nakshatra.index, tithi, yoga, karana, weekdayIndex });

    days.push({
      dateIso: day.toISODate()!,
      weekday: vaaraFromLocalWeekday(weekdayIndex),
      score,
      verdict: verdictOf(score),
      nakshatra: { ...NAKSHATRAS[nakshatra.index], pada: nakshatra.pada },
      tithi,
      yoga,
      karana,
      sunrise: riseSet.sunrise,
      sunset: riseSet.sunset,
      goodSlots,
      avoidWindows,
      reasons,
    });
  }

  const best = [...days]
    .filter((d) => d.verdict === "excellent" || d.verdict === "good")
    .sort((a, b) => b.score - a.score || a.dateIso.localeCompare(b.dateIso))
    .slice(0, bestCount);

  return { days, best };
}
