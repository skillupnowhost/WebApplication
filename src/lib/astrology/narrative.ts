import OpenAI from "openai";
import { z } from "zod";
import type { AstrologyProfile } from "@prisma/client";
import type { ChartResult } from "./chart";
import { DASHA_THEMES } from "./dasha";

export type ReportDepthValue = "SUMMARY" | "FULL";
export type ReportVoiceValue = "STORYTELLING" | "PROFESSIONAL" | "ANIMATED";

const narrativeSchema = z.object({
  headline: z.string(),
  sections: z.array(z.object({ heading: z.string(), body: z.string() })).min(1),
});

export type ReportNarrative = z.infer<typeof narrativeSchema>;

type ProfileFields = Pick<AstrologyProfile, "fullName" | "occupation" | "parentsNames" | "customNotes">;

const VOICE_INSTRUCTIONS: Record<ReportVoiceValue, string> = {
  STORYTELLING:
    "Write in a warm, second-person, storytelling voice — like a wise friend narrating someone's life story. Use flowing paragraphs and gentle metaphors.",
  PROFESSIONAL:
    "Write in a clear, structured, professional report voice — precise, neutral phrasing, suitable for a printed astrology report a client keeps for reference.",
  ANIMATED:
    "Write in an energetic, vivid voice with short punchy sentences — suitable for an on-screen animated reveal experience.",
};

function planetSummary(chart: ChartResult) {
  return chart.planets
    .map((p) => `${p.planet} in ${p.rashi.english} (${p.rashi.name}), ${p.nakshatra.name} nakshatra pada ${p.nakshatra.pada}`)
    .join("; ");
}

function currentDashaOf(chart: ChartResult) {
  const now = Date.now();
  return chart.dashaPeriods.find((p) => new Date(p.endDate).getTime() > now) ?? chart.dashaPeriods[0];
}

function buildPrompt(params: {
  chart: ChartResult;
  profile: ProfileFields;
  depth: ReportDepthValue;
  voice: ReportVoiceValue;
  language: string;
}) {
  const { chart, profile, depth, voice, language } = params;
  const currentDasha = currentDashaOf(chart);

  const facts = {
    name: profile.fullName,
    sunRashi: chart.planets.find((p) => p.planet === "Sun")?.rashi.english,
    moonRashi: chart.planets.find((p) => p.planet === "Moon")?.rashi.english,
    moonNakshatra: chart.planets.find((p) => p.planet === "Moon")?.nakshatra.name,
    ascendantRashi: chart.ascendant.rashi.english,
    currentDashaLord: currentDasha?.lord,
    lifePathNumber: chart.numerology.lifePath,
    destinyNumber: chart.numerology.destiny,
    luckyColor: chart.numerology.luckyColor,
    occupation: profile.occupation || undefined,
    parentsNames: profile.parentsNames || undefined,
    customNotes: profile.customNotes || undefined,
    ageBands: depth === "FULL" ? chart.ageBands : undefined,
    allPlanets: depth === "FULL" ? planetSummary(chart) : undefined,
  };

  const sectionGuidance =
    depth === "SUMMARY"
      ? "Produce exactly 4 sections: 'Your Cosmic Blueprint' (sun/moon/ascendant overview), 'Core Personality', 'Your Current Life Chapter' (based on the current ruling dasha planet), and 'Lucky Numbers & Colors'."
      : "Produce 6 sections: 'Your Cosmic Blueprint', 'Core Personality', 'Planetary Positions' (a prose walkthrough of every planet's placement), 'Your Life Timeline' (one paragraph per 5-year age band from the ageBands data, referencing the ruling planet's theme for each band), 'Numerology Deep Dive', and — only if occupation, parentsNames, or customNotes are present in the facts — a final 'Personalized Notes' section weaving those specific details in naturally. Omit 'Personalized Notes' entirely if none of those fields are present.";

  return `You are a warm, knowledgeable Vedic astrologer writing a horoscope report for MyLoginn Astrology. ${VOICE_INSTRUCTIONS[voice]}
Write the entire response in ${language === "ta" ? "Tamil" : "English"}, including every section heading — do not leave any heading in English when the target language is not English.
${sectionGuidance}
Never mention that this is AI-generated or reference "data"/"JSON" — write as a human astrologer would.
Base every claim strictly on these computed birth-chart facts, do not invent extra placements: ${JSON.stringify(facts)}

Respond with ONLY a JSON object of this exact shape, no markdown fences, no extra commentary:
{ "headline": string, "sections": [{ "heading": string, "body": string }] }`;
}

/** Deterministic, chart-derived text used when no LLM key is configured or generation fails — never a hardcoded template. */
function buildFactualNarrative(chart: ChartResult, depth: ReportDepthValue, profile: ProfileFields): ReportNarrative {
  const sun = chart.planets.find((p) => p.planet === "Sun");
  const moon = chart.planets.find((p) => p.planet === "Moon");
  const currentDasha = currentDashaOf(chart);

  const sections = [
    {
      heading: "Your Cosmic Blueprint",
      body: `${profile.fullName} was born with the Sun in ${sun?.rashi.english} and the Moon in ${moon?.rashi.english}, under the ${moon?.nakshatra.name} nakshatra. The ascendant (rising sign) is ${chart.ascendant.rashi.english}.`,
    },
    {
      heading: "Your Current Life Chapter",
      body: `The current planetary period (Dasha) is ruled by ${currentDasha.lord}, bringing a focus on ${DASHA_THEMES[currentDasha.lord] ?? "personal growth"}.`,
    },
    {
      heading: "Numerology",
      body: `The life-path number is ${chart.numerology.lifePath}, with a destiny number of ${chart.numerology.destiny} and a lucky color of ${chart.numerology.luckyColor}.`,
    },
  ];

  if (depth === "FULL") {
    sections.push({
      heading: "Planetary Positions",
      body: chart.planets.map((p) => `${p.planet}: ${p.rashi.english} (${p.nakshatra.name} nakshatra, pada ${p.nakshatra.pada})`).join(". "),
    });
    sections.push({
      heading: "Your Life Timeline",
      body: chart.ageBands.map((b) => `Ages ${b.fromAge}-${b.toAge}: governed by ${b.lord}, themes of ${b.theme}.`).join(" "),
    });
    if (profile.occupation || profile.parentsNames || profile.customNotes) {
      const notes = [
        profile.occupation && `In the context of your work as ${profile.occupation}, this period favors steady, disciplined progress.`,
        profile.parentsNames && `Family placements this chart carries are shared with ${profile.parentsNames}.`,
        profile.customNotes && profile.customNotes,
      ]
        .filter(Boolean)
        .join(" ");
      sections.push({ heading: "Personalized Notes", body: notes });
    }
  }

  return { headline: `A horoscope for ${profile.fullName}`, sections };
}

export async function generateNarrative(params: {
  chart: ChartResult;
  profile: ProfileFields;
  depth: ReportDepthValue;
  voice: ReportVoiceValue;
  language: string;
}): Promise<ReportNarrative> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return buildFactualNarrative(params.chart, params.depth, params.profile);

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
      messages: [{ role: "user", content: buildPrompt(params) }],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const cleaned = raw
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "");
    return narrativeSchema.parse(JSON.parse(cleaned));
  } catch (error) {
    console.error("Astrology narrative generation failed, using factual fallback:", error);
    return buildFactualNarrative(params.chart, params.depth, params.profile);
  }
}
