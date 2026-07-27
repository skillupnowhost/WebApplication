import { DateTime } from "luxon";
import { geocodePlace } from "./geocode";
import { computeChart, localBirthInstant } from "./chart";
import { predictBabyNames, type BabyNamePrediction } from "./babyNames";
import type { AstrologyLanguage } from "./i18n";
import type { RashiInfo, NakshatraInfo } from "./constants";

export type BabyGenderFilter = "boy" | "girl" | "both";

export type NamingView = {
  language: AstrologyLanguage;
  genderFilter: BabyGenderFilter;
  preferredLetter?: string;
  requestedCount?: number;
  birthLocalIso: string;
  birthPlace: string;
  placeLabel: string;
  timezone: string;
  moonRashi: RashiInfo;
  nakshatra: NakshatraInfo & { pada: number };
  psychicNumber: number;
  destinyNumber: number;
  prediction: BabyNamePrediction;
};

/**
 * Standalone Baby Naming report: geocodes the birth place, computes the real moon
 * nakshatra/pada from the birth instant, and derives name suggestions from the
 * classical pada syllables + Chaldean numerology. Stateless — nothing is persisted.
 */
export async function buildNamingView(params: {
  birthDate: string; // yyyy-MM-dd
  birthTime: string; // HH:mm
  place: string;
  genderFilter: BabyGenderFilter;
  preferredLetter?: string;
  language: AstrologyLanguage;
  /** How many names the user asked for (500/1000/5000, or a manually entered count). Unset = the small curated birth-pada list. */
  count?: number;
}): Promise<NamingView | null> {
  const geocoded = await geocodePlace(params.place);
  if (!geocoded) return null;

  const birthInstant = localBirthInstant(params.birthDate, params.birthTime, geocoded.timezone);
  const chart = computeChart({
    fullName: "Baby",
    birthDate: birthInstant,
    latitude: geocoded.latitude,
    longitude: geocoded.longitude,
    timezone: geocoded.timezone,
  });

  const moon = chart.planets.find((p) => p.planet === "Moon")!;
  const prediction = predictBabyNames({
    nakshatraIndex: moon.nakshatra.index,
    pada: moon.nakshatra.pada,
    psychicNumber: chart.numerology.psychicNumber,
    destinyNumber: chart.numerology.destinyNumber,
    preferredLetter: params.preferredLetter,
    limitPerGender: params.count,
    expandNames: !!params.count,
  });

  return {
    language: params.language,
    genderFilter: params.genderFilter,
    preferredLetter: params.preferredLetter?.trim() || undefined,
    requestedCount: params.count,
    birthLocalIso: DateTime.fromJSDate(birthInstant, { zone: geocoded.timezone }).toISO()!,
    birthPlace: params.place,
    placeLabel: geocoded.label,
    timezone: geocoded.timezone,
    moonRashi: moon.rashi,
    nakshatra: moon.nakshatra,
    psychicNumber: chart.numerology.psychicNumber,
    destinyNumber: chart.numerology.destinyNumber,
    prediction,
  };
}
