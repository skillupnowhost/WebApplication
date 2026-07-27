import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateReport, type ChartStyleValue, type ReportStyleValue, type ColorThemeValue } from "@/lib/astrology/report";
import { ASTROLOGY_LANGUAGES, type AstrologyLanguage } from "@/lib/astrology/i18n";
import type { ReportDepthValue } from "@/lib/astrology/narrative";

/** Navigates to the sibling report in another language, reusing the same computed chart data (compute-once model) — generating it on first request, then reading the cached row on every later switch. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const to = url.searchParams.get("to");

  if (!to || !ASTROLOGY_LANGUAGES.includes(to as AstrologyLanguage)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const current = await prisma.horoscopeReport.findUnique({ where: { id }, include: { chartData: true } });
  if (!current) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  if (current.language === to) {
    return NextResponse.redirect(new URL(`/astrology/${id}`, url.origin));
  }

  const { report: switched } = await getOrCreateReport({
    profileId: current.chartData.profileId,
    depth: current.depth as ReportDepthValue,
    chartStyle: current.chartStyle as ChartStyleValue,
    language: to as AstrologyLanguage,
    reportStyle: current.reportStyle as ReportStyleValue,
    colorTheme: current.colorTheme as ColorThemeValue,
  });

  return NextResponse.redirect(new URL(`/astrology/${switched.id}`, url.origin));
}
