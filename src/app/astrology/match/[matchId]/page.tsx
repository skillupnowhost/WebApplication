import { notFound } from "next/navigation";
import { loadMatchView } from "@/lib/astrology/match";
import { MatchReport } from "@/components/astrology/MatchReport";
import { StyleTabs } from "@/components/astrology/StyleTabs";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";

const STYLES: ReportStyleValue[] = ["PROFESSIONAL", "TRADITIONAL", "MODERN"];

export default async function AstrologyMatchReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ style?: string }>;
}) {
  const { matchId } = await params;
  const { style } = await searchParams;
  const view = await loadMatchView(matchId);
  if (!view) notFound();

  const reportStyle: ReportStyleValue = STYLES.includes(style as ReportStyleValue) ? (style as ReportStyleValue) : "PROFESSIONAL";

  return (
    <Section className="celestial-hero pt-10 sm:pt-14">
      <Container className="max-w-3xl">
        <AstroBreadcrumbs items={[{ label: "Matching", href: "/astrology/match" }, { label: "Result" }]} className="mb-4" />
        <div className="astro-no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">
            {view.nameA} &amp; {view.nameB}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StyleTabs value={reportStyle} lang={view.language} baseHref={`/astrology/match/${matchId}`} />
            <Button href={`/astrology/match/${matchId}/print?style=${reportStyle}`} variant="secondary" size="sm">
              Print preview
            </Button>
            <Button href={`/api/astrology/match/${matchId}/pdf?size=A4&style=${reportStyle}`} target="_blank" size="sm">
              Download PDF
            </Button>
          </div>
        </div>

        <MatchReport view={view} reportStyle={reportStyle} />
      </Container>
    </Section>
  );
}
