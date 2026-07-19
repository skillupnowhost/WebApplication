import { prisma } from "@/lib/prisma";
import { computeAndStoreChart } from "./report";
import { computeAshtakoot, type MoonInput, type AshtakootResult } from "./matching";
import { generateMatchNarrative, type ReportNarrative } from "./narrative";
import type { AstrologyLanguage } from "./i18n";
import type { SiderealPlanet } from "./chart";
import type { DoshaFlag } from "./dosha";

function moonInputFromPlanets(planets: SiderealPlanet[]): MoonInput {
  const moon = planets.find((p) => p.planet === "Moon");
  if (!moon) throw new Error("Chart is missing Moon position");
  return { rashiIndex: moon.rashi.index, nakshatraIndex: moon.nakshatra.index, rashiLord: moon.rashi.lord };
}

export async function getOrCreateMatch(params: { profileAId: string; profileBId: string; language: AstrologyLanguage }) {
  const { profileAId, profileBId, language } = params;

  const [{ profile: profileA, chart: chartA }, { profile: profileB, chart: chartB }] = await Promise.all([
    computeAndStoreChart(profileAId),
    computeAndStoreChart(profileBId),
  ]);

  const existing = await prisma.matchRequest.findFirst({
    where: { profileAId, profileBId, language },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return { match: existing, profileA, profileB };

  const ashtakoot = computeAshtakoot(moonInputFromPlanets(chartA.planets), moonInputFromPlanets(chartB.planets));
  const narrative = await generateMatchNarrative({ nameA: profileA.fullName, nameB: profileB.fullName, ashtakoot, language });

  const match = await prisma.matchRequest.create({
    data: {
      profileAId,
      profileBId,
      language,
      ashtakootJson: JSON.stringify(ashtakoot),
      narrativeJson: JSON.stringify(narrative),
    },
  });

  return { match, profileA, profileB };
}

export type MatchView = {
  matchId: string;
  nameA: string;
  nameB: string;
  language: AstrologyLanguage;
  ashtakoot: AshtakootResult;
  doshasA: DoshaFlag[];
  doshasB: DoshaFlag[];
  narrative: ReportNarrative;
  createdAt: string;
};

export async function loadMatchView(matchId: string): Promise<MatchView | null> {
  const match = await prisma.matchRequest.findUnique({
    where: { id: matchId },
    include: {
      profileA: { include: { chart: true } },
      profileB: { include: { chart: true } },
    },
  });
  if (!match) return null;

  return {
    matchId: match.id,
    nameA: match.profileA.fullName,
    nameB: match.profileB.fullName,
    language: match.language as AstrologyLanguage,
    ashtakoot: JSON.parse(match.ashtakootJson),
    doshasA: match.profileA.chart ? JSON.parse(match.profileA.chart.doshaJson) : [],
    doshasB: match.profileB.chart ? JSON.parse(match.profileB.chart.doshaJson) : [],
    narrative: JSON.parse(match.narrativeJson),
    createdAt: match.createdAt.toISOString(),
  };
}
