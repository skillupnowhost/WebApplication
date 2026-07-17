import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deserializeChart } from "@/lib/astrology/chart";
import { getOrCreateReport } from "@/lib/astrology/report";
import type { ReportNarrative } from "@/lib/astrology/narrative";
import { PrintReport } from "@/components/astrology/reportStyles/PrintReport";
import { PrintPage, type PageSize } from "@/components/astrology/print/PrintPage";
import type { ReportViewData } from "@/components/astrology/reportTypes";

const PAGE_SIZES: PageSize[] = ["A3", "A4", "A5"];

export default async function AstrologyPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ size?: string }>;
}) {
  const { reportId } = await params;
  const { size: sizeParam } = await searchParams;
  const requested = (sizeParam ?? "A4").toUpperCase();
  const size = (PAGE_SIZES as string[]).includes(requested) ? (requested as PageSize) : "A4";

  let report = await prisma.horoscopeReport.findUnique({
    where: { id: reportId },
    include: { chartData: { include: { profile: true } } },
  });
  if (!report) notFound();

  if (report.voice === "ANIMATED") {
    const professional = await getOrCreateReport({
      chartDataId: report.chartDataId,
      depth: report.depth,
      voice: "PROFESSIONAL",
      language: report.language,
    });
    if (professional) {
      report = await prisma.horoscopeReport.findUnique({
        where: { id: professional.id },
        include: { chartData: { include: { profile: true } } },
      });
    }
  }
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
    <PrintPage size={size}>
      <PrintReport data={data} />
    </PrintPage>
  );
}
