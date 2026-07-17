export const RASHIS = [
  { name: "Mesha", english: "Aries", lord: "Mars" },
  { name: "Vrishabha", english: "Taurus", lord: "Venus" },
  { name: "Mithuna", english: "Gemini", lord: "Mercury" },
  { name: "Karka", english: "Cancer", lord: "Moon" },
  { name: "Simha", english: "Leo", lord: "Sun" },
  { name: "Kanya", english: "Virgo", lord: "Mercury" },
  { name: "Tula", english: "Libra", lord: "Venus" },
  { name: "Vrischika", english: "Scorpio", lord: "Mars" },
  { name: "Dhanu", english: "Sagittarius", lord: "Jupiter" },
  { name: "Makara", english: "Capricorn", lord: "Saturn" },
  { name: "Kumbha", english: "Aquarius", lord: "Saturn" },
  { name: "Meena", english: "Pisces", lord: "Jupiter" },
] as const;

/** Fixed 9-lord cycle the 27 nakshatras repeat through 3 times — this is also the Vimshottari Dasha planet order. */
export const NAKSHATRA_LORDS = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
] as const;

const NAKSHATRA_NAMES = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

export const NAKSHATRAS = NAKSHATRA_NAMES.map((name, index) => ({
  name,
  index,
  lord: NAKSHATRA_LORDS[index % 9],
}));

const RASHI_SPAN_DEG = 30;
const NAKSHATRA_SPAN_DEG = 360 / 27;

export function rashiFromSidereal(siderealLongitude: number) {
  const index = Math.floor(siderealLongitude / RASHI_SPAN_DEG) % 12;
  const degreeInRashi = siderealLongitude % RASHI_SPAN_DEG;
  return { ...RASHIS[index], index, degreeInRashi };
}

export function nakshatraFromSidereal(siderealLongitude: number) {
  const index = Math.floor(siderealLongitude / NAKSHATRA_SPAN_DEG) % 27;
  const positionInNakshatra = siderealLongitude - index * NAKSHATRA_SPAN_DEG;
  const pada = Math.floor(positionInNakshatra / (NAKSHATRA_SPAN_DEG / 4)) + 1;
  const fractionElapsed = positionInNakshatra / NAKSHATRA_SPAN_DEG;
  return { ...NAKSHATRAS[index], pada, fractionElapsed };
}

/** Lunar day (1-30) from the Sun-Moon angular separation; independent of ayanamsa, so tropical longitudes work fine. */
export function tithiFromLongitudes(moonTropical: number, sunTropical: number) {
  const diff = (((moonTropical - sunTropical) % 360) + 360) % 360;
  const index = Math.floor(diff / 12);
  const paksha: "Shukla" | "Krishna" = index < 15 ? "Shukla" : "Krishna";
  const tithiNumber = (index % 15) + 1;
  return { index, tithiNumber, paksha };
}
