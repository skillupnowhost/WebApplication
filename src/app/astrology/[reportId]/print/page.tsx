import { notFound } from "next/navigation";
import { loadReportView } from "@/lib/astrology/report";
import { ReportViewer } from "@/components/astrology/ReportViewer";

export default async function AstrologyPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ size?: string }>;
}) {
  const { reportId } = await params;
  const { size } = await searchParams;
  const view = await loadReportView(reportId);
  if (!view) notFound();

  const pageSize = size === "A5" || size === "A3" ? size : "A4";

  return (
    <div data-page-size={pageSize} className="bg-white py-8 print:py-0">
      <ReportViewer view={view} printMode />
    </div>
  );
}
