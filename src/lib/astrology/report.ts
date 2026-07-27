import { prisma } from "@/lib/prisma";
import { DateTime } from "luxon";
import type { AstrologySystem } from "./ayanamsa";
import { computeChart, type SiderealPlanet, type ChartResult } from "./chart";
import { generateNarrative, type ReportDepthValue, type ReportNarrative } from "./narrative";
import { buildHouses, type ChartHouse } from "./chartLayout";
import type { AstrologyLanguage } from "./i18n";
import { ageBandPredictions, type DashaPeriod, type AgeBandPrediction } from "./dasha";
import type { NumerologyProfile } from "./numerology";
import type { DoshaFlag } from "./dosha";
import type { RashiInfo } from "./constants";
import { navamsaRashiIndex } from "./panchanga";
import { computeRiseSetTimes, computeTamilDate, rituFromSolarMonth, ayanaFromSolarMonth, udayadiNazhigai, type RiseSetTimes, type TamilDate } from "./almanac";
import { computeDayMuhurta, type DayMuhurta } from "./muhurta";
import { computePlanetStrengths, type PlanetStrength } from "./strength";
import { computeAvakahada, type AvakahadaProfile } from "./avakahada";
import { computeLuckyProfile, type LuckyProfile } from "./lucky";
import { predictBabyNames, type BabyNamePrediction } from "./babyNames";
import { computeMandi, type MandiPosition } from "./mandi";
import { VARGA_CALCULATORS, type VargaKey } from "./vargas";
import { computeAshtakavarga, contributorRashiFromChart, type AshtakavargaResult } from "./ashtakavarga";
import { detectYogas, type YogaResult } from "./yogas";
import { computeCurrentTransits, type TransitPosition } from "./transit";
import { RASHIS, type PlanetName } from "./constants";

export type ChartStyleValue = "NORTH_INDIAN" | "SOUTH_INDIAN" | "EAST_INDIAN";
export type ReportStyleValue = "PROFESSIONAL" | "TRADITIONAL" | "MODERN";

/** Colour theme is independent of report style — it only swaps the `--jd-*` CSS custom properties,
 * layered on top of whichever structural style (Professional/Traditional/Modern) is active. Unlike
 * reportStyle it never changes narrative content, so it isn't part of the report's cache key — it's
 * a plain mutable column updated in place via /switch-theme. */
export const COLOR_THEME_VALUES = [
  "DEFAULT",
  "GOLD",
  "ROYAL_BLUE",
  "EMERALD",
  "PURPLE",
  "MAROON",
  "ORANGE",
  "TEAL",
  "CLASSIC_BLACK",
  "PREMIUM_WHITE",
  "MULTI_TRADITIONAL",
] as const;
export type ColorThemeValue = (typeof COLOR_THEME_VALUES)[number];

/** Maps a colorTheme value to the `.jd-theme-*` class applied alongside `.jd-style-*` on the
 * `.jathagam-doc` root — `null` for DEFAULT means "no extra class", i.e. use the active style's
 * own built-in palette untouched. */
export const COLOR_THEME_CLASS: Record<ColorThemeValue, string | null> = {
  DEFAULT: null,
  GOLD: "jd-theme-gold",
  ROYAL_BLUE: "jd-theme-royal-blue",
  EMERALD: "jd-theme-emerald",
  PURPLE: "jd-theme-purple",
  MAROON: "jd-theme-maroon",
  ORANGE: "jd-theme-orange",
  TEAL: "jd-theme-teal",
  CLASSIC_BLACK: "jd-theme-classic-black",
  PREMIUM_WHITE: "jd-theme-premium-white",
  MULTI_TRADITIONAL: "jd-theme-multi",
};

export async function computeAndStoreChart(profileId: string) {
  const profile = await prisma.astrologyProfile.findUniqueOrThrow({ where: { id: profileId } });
  const chart = computeChart({
    fullName: profile.fullName,
    birthDate: profile.birthDate,
    latitude: profile.latitude,
    longitude: profile.longitude,
    timezone: profile.timezone,
    system: profile.system as AstrologySystem,
  });

  const payload = {
    ayanamsaUsed: chart.ayanamsaUsed,
    planetsJson: JSON.stringify(chart.planets),
    ascendantJson: JSON.stringify(chart.ascendant),
    panchangaJson: JSON.stringify(chart.panchanga),
    dashaJson: JSON.stringify(chart.dashaPeriods),
    numerologyJson: JSON.stringify(chart.numerology),
    doshaJson: JSON.stringify(chart.doshas),
  };

  const chartData = await prisma.chartData.upsert({
    where: { profileId },
    create: { profileId, ...payload },
    update: payload,
  });

  return { profile, chart, chartData };
}

export async function getOrCreateReport(params: {
  profileId: string;
  depth: ReportDepthValue;
  chartStyle: ChartStyleValue;
  language: AstrologyLanguage;
  reportStyle?: ReportStyleValue;
  colorTheme?: ColorThemeValue;
}) {
  const { profileId, depth, chartStyle, language, reportStyle = "PROFESSIONAL", colorTheme = "DEFAULT" } = params;
  const { profile, chart, chartData } = await computeAndStoreChart(profileId);

  const existing = await prisma.horoscopeReport.findUnique({
    where: {
      chartDataId_depth_chartStyle_language_reportStyle: { chartDataId: chartData.id, depth, chartStyle, language, reportStyle },
    },
  });

  if (existing) return { report: existing, chart, profile, chartData };

  const narrative = await generateNarrative({ chart, fullName: profile.fullName, depth, language });
  const report = await prisma.horoscopeReport.create({
    data: { chartDataId: chartData.id, depth, chartStyle, language, reportStyle, colorTheme, narrativeJson: JSON.stringify(narrative) },
  });

  return { report, chart, profile, chartData };
}

export type VargaTableRow = { subject: PlanetName | "Lagna"; rashiByVarga: Record<VargaKey, number> };

export type CurrentDashaInfo = {
  mahaLord: string;
  antarLord: string;
  mahaEndDate: string;
  antarEndDate: string;
};

export type DashaBalance = { lord: string; years: number; months: number; days: number };

export type ReportView = {
  reportId: string;
  fullName: string;
  gender: string | null;
  parentsNames: string | null;
  fatherName: string | null;
  motherName: string | null;
  maritalStatus: string | null;
  phone: string | null;
  email: string | null;
  occupation: string | null;
  businessType: string | null;
  salary: string | null;
  community: string | null;
  caste: string | null;
  gothram: string | null;
  system: AstrologySystem;
  reportStyle: ReportStyleValue;
  colorTheme: ColorThemeValue;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  birthDateIso: string; // UTC instant
  birthLocalIso: string; // local wall-clock at birth place
  birthTimeKnown: boolean;
  depth: ReportDepthValue;
  chartStyle: ChartStyleValue;
  language: AstrologyLanguage;
  ayanamsaUsed: number;
  planets: SiderealPlanet[];
  navamsaIndices: Record<string, number>; // planet name -> D9 rashi index
  navamsaLagnaIndex: number;
  ascendant: ChartResult["ascendant"];
  panchanga: ChartResult["panchanga"];
  riseSet: RiseSetTimes;
  tamilDate: TamilDate;
  ritu: { english: string; tamil: string };
  ayana: { english: string; tamil: string };
  udayadi: { nazhigai: number; vinadi: number } | null;
  muhurta: DayMuhurta | null;
  mandi: MandiPosition | null;
  dashaPeriods: DashaPeriod[];
  dashaBalance: DashaBalance;
  currentDasha: CurrentDashaInfo | null;
  ageBands: AgeBandPrediction[];
  numerology: NumerologyProfile;
  strengths: PlanetStrength[];
  avakahada: AvakahadaProfile;
  lucky: LuckyProfile;
  babyNames: BabyNamePrediction;
  doshas: DoshaFlag[];
  houses: ChartHouse[];
  narrative: ReportNarrative;
  createdAt: string;
  vargaTable: VargaTableRow[];
  ashtakavarga: AshtakavargaResult;
  yogas: YogaResult[];
  transits: TransitPosition[];
};

function dashaBalanceOf(first: DashaPeriod): DashaBalance {
  const totalDays = (new Date(first.endDate).getTime() - new Date(first.startDate).getTime()) / 86400000;
  const years = Math.floor(totalDays / 365.2425);
  const months = Math.floor((totalDays - years * 365.2425) / 30.44);
  const days = Math.floor(totalDays - years * 365.2425 - months * 30.44);
  return { lord: first.lord, years, months, days };
}

function currentDashaOf(periods: DashaPeriod[]): CurrentDashaInfo | null {
  const now = Date.now();
  const maha = periods.find((p) => now >= new Date(p.startDate).getTime() && now < new Date(p.endDate).getTime());
  if (!maha) return null;
  const antar = maha.antardashas.find((a) => now >= new Date(a.startDate).getTime() && now < new Date(a.endDate).getTime());
  return {
    mahaLord: maha.lord,
    antarLord: antar?.lord ?? maha.lord,
    mahaEndDate: maha.endDate,
    antarEndDate: antar?.endDate ?? maha.endDate,
  };
}

export async function loadReportView(reportId: string): Promise<ReportView | null> {
  const report = await prisma.horoscopeReport.findUnique({
    where: { id: reportId },
    include: { chartData: { include: { profile: true } } },
  });
  if (!report) return null;

  const { chartData } = report;
  const profile = chartData.profile;
  const planets: SiderealPlanet[] = JSON.parse(chartData.planetsJson);
  const ascendant: ChartResult["ascendant"] = JSON.parse(chartData.ascendantJson);
  const ascendantRashi: RashiInfo = ascendant.rashi;
  const dashaPeriods: DashaPeriod[] = JSON.parse(chartData.dashaJson);
  const panchanga: ChartResult["panchanga"] = JSON.parse(chartData.panchangaJson);
  const numerology: NumerologyProfile = JSON.parse(chartData.numerologyJson);

  const moon = planets.find((p) => p.planet === "Moon")!;

  // Day-almanac extras — pure functions of the stored birth data, computed at read time.
  const riseSet = computeRiseSetTimes(profile.birthDate, profile.latitude, profile.longitude, profile.timezone);
  const tamilDate = computeTamilDate(profile.birthDate, profile.timezone, profile.latitude, profile.longitude);
  const muhurta = riseSet.sunrise && riseSet.sunset ? computeDayMuhurta(riseSet.sunrise, riseSet.sunset) : null;
  const mandi = muhurta
    ? computeMandi({
        gulikaStartIso: muhurta.gulikai.start,
        latitude: profile.latitude,
        longitude: profile.longitude,
        ayanamsaUsed: chartData.ayanamsaUsed,
        ascendantRashiIndex: ascendantRashi.index,
      })
    : null;

  const navamsaIndices: Record<string, number> = {};
  for (const p of planets) navamsaIndices[p.planet] = navamsaRashiIndex(p.siderealLongitude);

  // Shodasavarga table: D2/D3/D7/D10/D12/D30 rashi for every planet + Lagna (D9 reuses navamsaIndices above).
  const vargaTable: VargaTableRow[] = [
    ...planets.map((p) => ({
      subject: p.planet,
      rashiByVarga: Object.fromEntries(
        (Object.keys(VARGA_CALCULATORS) as (keyof typeof VARGA_CALCULATORS)[]).map((key) => [key, VARGA_CALCULATORS[key](p.siderealLongitude)])
      ) as Record<VargaKey, number>,
    })),
    {
      subject: "Lagna" as const,
      rashiByVarga: Object.fromEntries(
        (Object.keys(VARGA_CALCULATORS) as (keyof typeof VARGA_CALCULATORS)[]).map((key) => [key, VARGA_CALCULATORS[key](ascendant.siderealLongitude)])
      ) as Record<VargaKey, number>,
    },
  ];

  const ashtakavarga = computeAshtakavarga(
    contributorRashiFromChart(
      planets.map((p) => ({ planet: p.planet, rashiIndex: p.rashi.index })),
      ascendantRashi.index
    )
  );

  const strengths = computePlanetStrengths(planets);
  const yogas = detectYogas({
    planets,
    strengths,
    ascendantRashiIndex: ascendantRashi.index,
    rashiOfIndex: (i) => RASHIS[i],
  });

  const transits = computeCurrentTransits(moon.rashi.index, profile.system as AstrologySystem);

  const birthLocal = DateTime.fromJSDate(profile.birthDate, { zone: profile.timezone });

  return {
    reportId: report.id,
    fullName: profile.fullName,
    gender: profile.gender,
    parentsNames: profile.parentsNames,
    fatherName: profile.fatherName,
    motherName: profile.motherName,
    maritalStatus: profile.maritalStatus,
    phone: profile.phone,
    email: profile.email,
    occupation: profile.occupation,
    businessType: profile.businessType,
    salary: profile.salary,
    community: profile.community,
    caste: profile.caste,
    gothram: profile.gothram,
    system: profile.system as AstrologySystem,
    reportStyle: (report.reportStyle ?? "PROFESSIONAL") as ReportStyleValue,
    colorTheme: (report.colorTheme ?? "DEFAULT") as ColorThemeValue,
    birthPlace: profile.birthPlace,
    latitude: profile.latitude,
    longitude: profile.longitude,
    timezone: profile.timezone,
    birthDateIso: profile.birthDate.toISOString(),
    birthLocalIso: birthLocal.toISO() ?? profile.birthDate.toISOString(),
    birthTimeKnown: profile.birthTimeKnown,
    depth: report.depth as ReportDepthValue,
    chartStyle: report.chartStyle as ChartStyleValue,
    language: report.language as AstrologyLanguage,
    ayanamsaUsed: chartData.ayanamsaUsed,
    planets,
    navamsaIndices,
    navamsaLagnaIndex: navamsaRashiIndex(ascendant.siderealLongitude),
    ascendant,
    panchanga,
    riseSet,
    tamilDate,
    ritu: rituFromSolarMonth(tamilDate.monthIndex),
    ayana: ayanaFromSolarMonth(tamilDate.monthIndex),
    udayadi: udayadiNazhigai(profile.birthDate, riseSet.sunrise),
    muhurta,
    mandi,
    dashaPeriods,
    dashaBalance: dashaBalanceOf(dashaPeriods[0]),
    currentDasha: currentDashaOf(dashaPeriods),
    ageBands: ageBandPredictions(dashaPeriods, profile.birthDate),
    numerology,
    strengths,
    avakahada: computeAvakahada({
      moonRashiIndex: moon.rashi.index,
      nakshatraIndex: moon.nakshatra.index,
      pada: moon.nakshatra.pada,
      paksha: panchanga.tithi.paksha,
    }),
    lucky: computeLuckyProfile({
      moonRashiLord: moon.rashi.lord,
      psychicNumber: numerology.psychicNumber,
      destinyNumber: numerology.destinyNumber,
      fromYear: new Date().getFullYear(),
    }),
    babyNames: predictBabyNames({
      nakshatraIndex: moon.nakshatra.index,
      pada: moon.nakshatra.pada,
      psychicNumber: numerology.psychicNumber,
      destinyNumber: numerology.destinyNumber,
    }),
    doshas: JSON.parse(chartData.doshaJson),
    houses: buildHouses(ascendantRashi.index, planets),
    narrative: JSON.parse(report.narrativeJson),
    vargaTable,
    ashtakavarga,
    yogas,
    transits,
    createdAt: report.createdAt.toISOString(),
  };
}
