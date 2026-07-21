import OpenAI from "openai";
import { z } from "zod";
import type { ChartResult } from "./chart";
import { DASHA_THEMES } from "./dasha";
import type { AstrologyLanguage } from "./i18n";
import type { AshtakootResult } from "./matching";

export type ReportDepthValue = "SUMMARY" | "FULL";

const narrativeSchema = z.object({
  headline: z.string(),
  sections: z.array(z.object({ heading: z.string(), body: z.string() })).min(1),
});

export type ReportNarrative = z.infer<typeof narrativeSchema>;

const LANGUAGE_NAMES: Record<AstrologyLanguage, string> = { en: "English", ta: "Tamil", hi: "Hindi", te: "Telugu", ml: "Malayalam" };

function planetSummary(chart: ChartResult): string {
  return chart.planets
    .map((p) => `${p.planet} in ${p.rashi.english} (house ${p.houseFromAscendant}), ${p.nakshatra.english} nakshatra pada ${p.nakshatra.pada}${p.isRetrograde ? " (retrograde)" : ""}`)
    .join("; ");
}

function currentDashaOf(chart: ChartResult) {
  const now = Date.now();
  return chart.dashaPeriods.find((p) => new Date(p.endDate).getTime() > now) ?? chart.dashaPeriods[0];
}

function buildPrompt(params: { chart: ChartResult; fullName: string; depth: ReportDepthValue; language: AstrologyLanguage }): string {
  const { chart, fullName, depth, language } = params;
  const currentDasha = currentDashaOf(chart);
  const doshaLines = chart.doshas
    .filter((d) => d.present)
    .map((d) => `${d.name}: ${d.explanation}`)
    .join("\n") || "No major doshas detected.";

  return `You are a warm, professional Vedic astrologer writing a horoscope report for ${fullName}. Write entirely in ${LANGUAGE_NAMES[language]}.

Computed chart facts (do not contradict these — weave them into natural prose):
- Ascendant (Lagna): ${chart.ascendant.rashi.english}
- Sun sign: ${chart.planets.find((p) => p.planet === "Sun")?.rashi.english}
- Moon sign (Rashi): ${chart.planets.find((p) => p.planet === "Moon")?.rashi.english}, birth star: ${chart.planets.find((p) => p.planet === "Moon")?.nakshatra.english}
- Planetary positions: ${planetSummary(chart)}
- Panchanga: ${chart.panchanga.tithi.name} tithi, ${chart.panchanga.yoga.name} yoga, ${chart.panchanga.karana.name} karana, born on a ${chart.panchanga.vaara.name}
- Current Mahadasha: ${currentDasha.lord} (themes: ${DASHA_THEMES[currentDasha.lord]})
- Numerology: psychic number ${chart.numerology.psychicNumber}, destiny number ${chart.numerology.destinyNumber}, name number ${chart.numerology.nameNumber}
- Doshas: ${doshaLines}

Report depth: ${depth === "SUMMARY" ? "SUMMARY — one page. Cover only: overall life theme, top personality traits, current dasha headline." : "FULL — multi-page. Cover: personality & life theme, house-by-house planetary influence, the 5-year Dasha age-band predictions, numerology insights, and dosha remedies if any are present."}

Return ONLY a JSON object of the exact shape: { "headline": string, "sections": [{ "heading": string, "body": string }] }. Do not include markdown, backticks, or any text outside the JSON.`;
}

function fallbackNarrative(params: { chart: ChartResult; fullName: string; depth: ReportDepthValue; language: AstrologyLanguage }): ReportNarrative {
  const { chart, fullName, depth } = params;
  const moon = chart.planets.find((p) => p.planet === "Moon")!;
  const sun = chart.planets.find((p) => p.planet === "Sun")!;
  const currentDasha = currentDashaOf(chart);

  const sections: ReportNarrative["sections"] = [
    {
      heading: "Life theme",
      body: `${fullName} was born with ${chart.ascendant.rashi.english} rising, a Sun in ${sun.rashi.english}, and a Moon in ${moon.rashi.english} under the ${moon.nakshatra.english} nakshatra. This blend shapes a personality that leans on ${chart.ascendant.rashi.element.toLowerCase()}-sign instincts for how the world is approached, while the Moon's placement colors the emotional and instinctive inner life.`,
    },
    {
      heading: "Current period",
      body: `The current Mahadasha belongs to ${currentDasha.lord}, a period generally associated with ${DASHA_THEMES[currentDasha.lord]}. This runs from ${new Date(currentDasha.startDate).toLocaleDateString()} to ${new Date(currentDasha.endDate).toLocaleDateString()}.`,
    },
  ];

  if (depth === "FULL") {
    sections.push({
      heading: "Planetary landscape",
      body: chart.planets
        .map((p) => `${p.planet} sits in ${p.rashi.english} in house ${p.houseFromAscendant}, within the ${p.nakshatra.english} nakshatra.`)
        .join(" "),
    });
    sections.push({
      heading: "Numerology",
      body: `The psychic number ${chart.numerology.psychicNumber} and destiny number ${chart.numerology.destinyNumber} suggest a lucky color of ${chart.numerology.luckyColor}. The name number ${chart.numerology.nameNumber}, derived from the Chaldean system, adds a secondary current of influence to how ${fullName} is perceived by others.`,
    });
    const presentDoshas = chart.doshas.filter((d) => d.present);
    sections.push({
      heading: "Doshas & remedies",
      body:
        presentDoshas.length === 0
          ? "No major doshas were detected in this chart."
          : presentDoshas.map((d) => `${d.name}: ${d.explanation} Suggested remedies: ${d.remedies.join("; ")}.`).join(" "),
    });
  }

  return { headline: `${fullName}'s horoscope, under a ${moon.rashi.english} moon`, sections };
}

/** Generates report narrative text, calling OpenRouter/OpenAI when configured and falling back to a deterministic, data-driven narrative otherwise (the report's factual content never depends on an LLM being available). */
export async function generateNarrative(params: {
  chart: ChartResult;
  fullName: string;
  depth: ReportDepthValue;
  language: AstrologyLanguage;
}): Promise<ReportNarrative> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return fallbackNarrative(params);

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://myloginn.com",
        "X-Title": "MyLoginn Astrology",
      },
    });

    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: buildPrompt(params) }],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return fallbackNarrative(params);

    const parsed = narrativeSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return fallbackNarrative(params);
    return parsed.data;
  } catch (error) {
    console.error("Astrology narrative generation failed, using fallback:", error);
    return fallbackNarrative(params);
  }
}

function buildMatchPrompt(params: { nameA: string; nameB: string; ashtakoot: AshtakootResult; language: AstrologyLanguage }): string {
  const { nameA, nameB, ashtakoot, language } = params;
  const kootaLines = ashtakoot.kootas.map((k) => `${k.name}: ${k.points}/${k.maxPoints} — ${k.note}`).join("\n");

  return `You are a warm, professional Vedic astrologer writing a marriage compatibility summary for ${nameA} and ${nameB}, in ${LANGUAGE_NAMES[language]}.

Ashtakoot Guna Milan result: ${ashtakoot.totalPoints}/36 points, verdict: ${ashtakoot.verdict}.
Koota breakdown:
${kootaLines}

Write a compassionate, honest summary of this match — strengths, any friction points implied by low-scoring kootas, and general guidance. Do not invent facts not present above.

Return ONLY a JSON object of the exact shape: { "headline": string, "sections": [{ "heading": string, "body": string }] }. Do not include markdown, backticks, or any text outside the JSON.`;
}

function fallbackMatchNarrative(params: { nameA: string; nameB: string; ashtakoot: AshtakootResult }): ReportNarrative {
  const { nameA, nameB, ashtakoot } = params;
  const weakKootas = ashtakoot.kootas.filter((k) => k.points < k.maxPoints * 0.5);

  return {
    headline: `${nameA} & ${nameB}: ${ashtakoot.totalPoints}/36 — ${ashtakoot.verdict}`,
    sections: [
      {
        heading: "Overall compatibility",
        body: `The classical Ashtakoot Guna Milan comparison between ${nameA} and ${nameB} scores ${ashtakoot.totalPoints} out of 36 points, placing this match in the "${ashtakoot.verdict}" range.`,
      },
      {
        heading: "Koota breakdown",
        body: ashtakoot.kootas.map((k) => `${k.name}: ${k.points}/${k.maxPoints}.`).join(" "),
      },
      {
        heading: "Points to discuss",
        body:
          weakKootas.length === 0
            ? "No koota scored below half marks — a broadly harmonious match across all eight factors."
            : `${weakKootas.map((k) => k.name).join(", ")} scored below half marks and may be worth discussing with a family astrologer before proceeding.`,
      },
    ],
  };
}

export async function generateMatchNarrative(params: { nameA: string; nameB: string; ashtakoot: AshtakootResult; language: AstrologyLanguage }): Promise<ReportNarrative> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return fallbackMatchNarrative(params);

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://myloginn.com",
        "X-Title": "MyLoginn Astrology",
      },
    });

    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      max_tokens: 1536,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: buildMatchPrompt(params) }],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return fallbackMatchNarrative(params);

    const parsed = narrativeSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return fallbackMatchNarrative(params);
    return parsed.data;
  } catch (error) {
    console.error("Astrology match narrative generation failed, using fallback:", error);
    return fallbackMatchNarrative(params);
  }
}
