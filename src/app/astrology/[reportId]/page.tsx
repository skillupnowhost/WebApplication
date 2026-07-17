import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deserializeChart } from "@/lib/astrology/chart";
import type { ReportNarrative } from "@/lib/astrology/narrative";
import { ReportViewer } from "@/components/astrology/ReportViewer";
import type { ReportViewData } from "@/components/astrology/reportTypes";

export const metadata = { title: "Your Horoscope — MyLoginn Astrology" };

export default async function AstrologyReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;

  const report = await prisma.horoscopeReport.findUnique({
    where: { id: reportId },
    include: { chartData: { include: { profile: true } } },
  });
  if (!report) notFound();

  const chart = deserializeChart(report.chartData);
  const narrative = JSON.parse(report.narrativeJson) as ReportNarrative;

  const data: ReportViewData = {
    reportId: report.id,
    chartDataId: report.chartDataId,
    depth: report.depth,
    voice: report.voice,
    language: report.language,
    narrative,
    chart,
    profile: {
      fullName: report.chartData.profile.fullName,
      birthPlace: report.chartData.profile.birthPlace,
      birthDate: report.chartData.profile.birthDate.toISOString(),
      occupation: report.chartData.profile.occupation,
      parentsNames: report.chartData.profile.parentsNames,
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <ReportViewer data={data} />
    </div>
  );
}
