import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";
import { lahiriAyanamsa, toSidereal } from "./ayanamsa";

/**
 * Day-almanac values computed for the birth instant + place: rise/set times,
 * the Tamil solar-calendar date, and the traditional era years. Everything here
 * is a pure function of (instant, latitude, longitude, timezone).
 */

export type RiseSetTimes = {
  sunrise: string | null; // ISO in local zone
  sunset: string | null;
  moonrise: string | null;
  moonset: string | null;
};

function findRiseSet(body: Astronomy.Body, direction: 1 | -1, localDayStartUtc: Date, latitude: number, longitude: number): Date | null {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const result = Astronomy.SearchRiseSet(body, observer, direction, localDayStartUtc, 1.2);
  return result ? result.date : null;
}

/** Rise/set events for the local civil day containing the birth instant. */
export function computeRiseSetTimes(birthDate: Date, latitude: number, longitude: number, timezone: string): RiseSetTimes {
  const localDayStart = DateTime.fromJSDate(birthDate, { zone: timezone }).startOf("day");
  const startUtc = localDayStart.toJSDate();
  const toLocalIso = (d: Date | null) => (d ? DateTime.fromJSDate(d, { zone: timezone }).toISO() : null);

  return {
    sunrise: toLocalIso(findRiseSet(Astronomy.Body.Sun, 1, startUtc, latitude, longitude)),
    sunset: toLocalIso(findRiseSet(Astronomy.Body.Sun, -1, startUtc, latitude, longitude)),
    moonrise: toLocalIso(findRiseSet(Astronomy.Body.Moon, 1, startUtc, latitude, longitude)),
    moonset: toLocalIso(findRiseSet(Astronomy.Body.Moon, -1, startUtc, latitude, longitude)),
  };
}

/* ---- Tamil solar calendar ---- */

export const TAMIL_MONTHS = [
  { english: "Chithirai", tamil: "சித்திரை" }, // Sun in Mesha
  { english: "Vaigasi", tamil: "வைகாசி" },
  { english: "Aani", tamil: "ஆனி" },
  { english: "Aadi", tamil: "ஆடி" },
  { english: "Aavani", tamil: "ஆவணி" },
  { english: "Purattasi", tamil: "புரட்டாசி" },
  { english: "Aippasi", tamil: "ஐப்பசி" },
  { english: "Karthigai", tamil: "கார்த்திகை" },
  { english: "Margazhi", tamil: "மார்கழி" },
  { english: "Thai", tamil: "தை" },
  { english: "Maasi", tamil: "மாசி" },
  { english: "Panguni", tamil: "பங்குனி" }, // Sun in Meena
];

/** 60-year Prabhava cycle. Anchor: the Tamil year beginning April 1987 was Prabhava (index 0). */
export const TAMIL_YEAR_NAMES = [
  "Prabhava", "Vibhava", "Shukla", "Pramodoota", "Prajotpatti", "Angirasa", "Srimukha", "Bhava", "Yuva", "Dhatu",
  "Eeshvara", "Bahudhanya", "Pramathi", "Vikrama", "Vishu", "Chitrabhanu", "Subhanu", "Dharana", "Parthiba", "Viya",
  "Sarvajith", "Sarvadhari", "Virodhi", "Vikruti", "Kara", "Nandhana", "Vijaya", "Jaya", "Manmatha", "Dhunmuki",
  "Hevilambi", "Vilambi", "Vikari", "Sarvari", "Plava", "Subakruthu", "Sobakruthu", "Krodhi", "Visuvasuva", "Parabhava",
  "Plavanga", "Keelaka", "Saumya", "Sadharana", "Virodhikruthu", "Paridhabi", "Pramadhisa", "Ananda", "Rakshasa", "Nala",
  "Pingala", "Kalayukthi", "Siddharthi", "Raudri", "Dhunmathi", "Dhundubhi", "Rudhrodhgari", "Raktakshi", "Krodhana", "Akshaya",
];

const TAMIL_YEAR_ANCHOR = 1987; // Gregorian year whose April started Prabhava

function siderealSunLongitude(date: Date): number {
  const tropical = Astronomy.SunPosition(date).elon;
  return toSidereal(tropical, lahiriAyanamsa(date));
}

export type TamilDate = {
  yearName: string;
  yearNameTamil: string;
  yearIndex: number; // 0-59 in the Prabhava cycle
  monthIndex: number; // 0 = Chithirai
  monthEnglish: string;
  monthTamil: string;
  day: number; // 1-based day of the solar month
  sakaYear: number;
  kaliYear: number;
};

const TAMIL_YEAR_NAMES_TA = [
  "பிரபவ", "விபவ", "சுக்ல", "பிரமோதூத", "பிரஜோத்பத்தி", "ஆங்கீரச", "ஸ்ரீமுக", "பவ", "யுவ", "தாது",
  "ஈஸ்வர", "வெகுதானிய", "பிரமாதி", "விக்கிரம", "விஷு", "சித்திரபானு", "சுபானு", "தாரண", "பார்த்திப", "விய",
  "சர்வஜித்", "சர்வதாரி", "விரோதி", "விக்ருதி", "கர", "நந்தன", "விஜய", "ஜய", "மன்மத", "துன்முகி",
  "ஹேவிளம்பி", "விளம்பி", "விகாரி", "சார்வரி", "பிலவ", "சுபகிருது", "சோபகிருது", "குரோதி", "விசுவாசுவ", "பராபவ",
  "பிலவங்க", "கீலக", "சௌம்ய", "சாதாரண", "விரோதிகிருது", "பரிதாபி", "பிரமாதீச", "ஆனந்த", "ராட்சச", "நள",
  "பிங்கள", "காளயுக்தி", "சித்தார்த்தி", "ரௌத்திரி", "துன்மதி", "துந்துபி", "ருத்ரோத்காரி", "ரக்தாட்சி", "குரோதன", "அட்சய",
];

/**
 * Tamil solar date at the birth instant. The solar month is the sun's sidereal rashi;
 * the day number counts local days from the month's sankranti (crossing day = day 1).
 * The panchangam day runs sunrise-to-sunrise, so a birth before sunrise belongs to the
 * PREVIOUS civil day — confirmed against a professional Thirukkanitha reference chart.
 */
export function computeTamilDate(birthDate: Date, timezone: string, latitude?: number, longitude?: number): TamilDate {
  let local = DateTime.fromJSDate(birthDate, { zone: timezone });

  if (latitude !== undefined && longitude !== undefined) {
    const sunrise = findRiseSet(Astronomy.Body.Sun, 1, local.startOf("day").toJSDate(), latitude, longitude);
    if (sunrise && birthDate.getTime() < sunrise.getTime()) local = local.minus({ days: 1 });
  }

  const referenceNoon = local.startOf("day").plus({ hours: 12 });
  const monthIndex = Math.floor(siderealSunLongitude(referenceNoon.toJSDate()) / 30) % 12;

  let day = 1;
  let cursor = referenceNoon; // sample each local day at noon
  for (let i = 0; i < 34; i++) {
    const prev = cursor.minus({ days: 1 });
    const prevMonth = Math.floor(siderealSunLongitude(prev.toJSDate()) / 30) % 12;
    if (prevMonth !== monthIndex) break;
    day += 1;
    cursor = prev;
  }

  // Gregorian year in which this Tamil year began (at Mesha sankranti, mid-April).
  // Months Chithirai..Margazhi (0-8) begin Apr-Dec of the starting year; Thai..Panguni (9-11) fall in Jan-Apr of the next.
  const tamilYearStart = monthIndex <= 8 ? (local.month >= 4 ? local.year : local.year - 1) : local.year - 1;
  const yearIndex = ((tamilYearStart - TAMIL_YEAR_ANCHOR) % 60 + 60) % 60;

  return {
    yearName: TAMIL_YEAR_NAMES[yearIndex],
    yearNameTamil: TAMIL_YEAR_NAMES_TA[yearIndex],
    yearIndex,
    monthIndex,
    monthEnglish: TAMIL_MONTHS[monthIndex].english,
    monthTamil: TAMIL_MONTHS[monthIndex].tamil,
    day,
    sakaYear: tamilYearStart - 78,
    kaliYear: tamilYearStart + 3101,
  };
}

/* ---- Ritu (season) from the solar month ---- */

const RITUS = [
  { english: "Vasanta (Spring)", tamil: "வசந்த ருது" },
  { english: "Grishma (Summer)", tamil: "கிரீஷ்ம ருது" },
  { english: "Varsha (Monsoon)", tamil: "வர்ஷ ருது" },
  { english: "Sharad (Autumn)", tamil: "சரத் ருது" },
  { english: "Hemanta (Early winter)", tamil: "ஹேமந்த ருது" },
  { english: "Shishira (Late winter)", tamil: "சிசிர ருது" },
];

export function rituFromSolarMonth(monthIndex: number): { english: string; tamil: string } {
  return RITUS[Math.floor(monthIndex / 2) % 6];
}

/** Ayana: Uttarayana while the sun travels Makara..Mithuna (sidereal), Dakshinayana for Kataka..Dhanusu. */
export function ayanaFromSolarMonth(monthIndex: number): { english: string; tamil: string } {
  // monthIndex 0 = Chithirai (Mesha). Uttarayana = Thai..Aani (Makara through Mithuna).
  const uttarayana = monthIndex >= 9 || monthIndex <= 2;
  return uttarayana
    ? { english: "Uttarayana", tamil: "உத்தராயணம்" }
    : { english: "Dakshinayana", tamil: "தட்சிணாயனம்" };
}

/* ---- Udayadi Nazhigai: time elapsed since sunrise, in nazhigai/vinadi ---- */

export function udayadiNazhigai(birthDate: Date, sunriseIso: string | null): { nazhigai: number; vinadi: number } | null {
  if (!sunriseIso) return null;
  const sunrise = DateTime.fromISO(sunriseIso);
  let minutes = DateTime.fromJSDate(birthDate).diff(sunrise, "minutes").minutes;
  if (minutes < 0) minutes += 24 * 60; // birth before sunrise counts from the previous day's sunrise
  const nazhigai = Math.floor(minutes / 24);
  const vinadi = Math.floor(((minutes % 24) / 24) * 60);
  return { nazhigai, vinadi };
}
