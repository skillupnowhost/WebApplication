import { notFound } from "next/navigation";
import { loadMatchView } from "@/lib/astrology/match";
import { MatchReport } from "@/components/astrology/MatchReport";
import type { ReportStyleValue } from "@/lib/astrology/report";

const STYLES: ReportStyleValue[] = ["PROFESSIONAL", "TRADITIONAL", "MODERN"];

export default async function AstrologyMatchPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ size?: string; style?: string }>;
}) {
  const { matchId } = await params;
  const { size, style } = await searchParams;
  const view = await loadMatchView(matchId);
  if (!view) notFound();

  const pageSize = size === "A5" || size === "A3" ? size : "A4";
  const reportStyle: ReportStyleValue = STYLES.includes(style as ReportStyleValue) ? (style as ReportStyleValue) : "PROFESSIONAL";

  return (
    <div data-page-size={pageSize} className="celestial-hero min-h-screen py-8 print:py-0">
      <div className="mx-auto max-w-3xl">
        <MatchReport view={view} reportStyle={reportStyle} printMode />
      </div>
    </div>
  );
}
