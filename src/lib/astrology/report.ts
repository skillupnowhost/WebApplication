import { prisma } from "@/lib/prisma";
import { deserializeChart } from "./chart";
import { generateNarrative, type ReportDepthValue, type ReportVoiceValue } from "./narrative";

/** Idempotent per (chartDataId, depth, voice, language) — regenerating an existing combo never re-runs the LLM. */
export async function getOrCreateReport(params: {
  chartDataId: string;
  depth: ReportDepthValue;
  voice: ReportVoiceValue;
  language: string;
}) {
  const { chartDataId, depth, voice, language } = params;

  const existing = await prisma.horoscopeReport.findUnique({
    where: { chartDataId_depth_voice_language: { chartDataId, depth, voice, language } },
  });
  if (existing) return existing;

  const chartData = await prisma.chartData.findUnique({ where: { id: chartDataId }, include: { profile: true } });
  if (!chartData) return null;

  const chart = deserializeChart(chartData);
  const narrative = await generateNarrative({ chart, profile: chartData.profile, depth, voice, language });

  return prisma.horoscopeReport.create({
    data: { chartDataId, depth, voice, language, narrativeJson: JSON.stringify(narrative) },
  });
}
