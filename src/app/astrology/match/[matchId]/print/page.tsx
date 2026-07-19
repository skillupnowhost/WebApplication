import { notFound } from "next/navigation";
import { loadMatchView } from "@/lib/astrology/match";
import { MatchReport } from "@/components/astrology/MatchReport";

export default async function AstrologyMatchPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ size?: string }>;
}) {
  const { matchId } = await params;
  const { size } = await searchParams;
  const view = await loadMatchView(matchId);
  if (!view) notFound();

  const pageSize = size === "A5" || size === "A3" ? size : "A4";

  return (
    <div data-page-size={pageSize} className="celestial-hero min-h-screen py-8 print:py-0">
      <div className="mx-auto max-w-3xl">
        <MatchReport view={view} />
      </div>
    </div>
  );
}
