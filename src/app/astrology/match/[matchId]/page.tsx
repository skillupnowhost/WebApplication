import { notFound } from "next/navigation";
import { loadMatchView } from "@/lib/astrology/match";
import { MatchReport } from "@/components/astrology/MatchReport";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";

export default async function AstrologyMatchReportPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const view = await loadMatchView(matchId);
  if (!view) notFound();

  return (
    <Section className="celestial-hero pt-10 sm:pt-14">
      <Container className="max-w-3xl">
        <AstroBreadcrumbs items={[{ label: "Matching", href: "/astrology/match" }, { label: "Result" }]} className="mb-4" />
        <div className="astro-no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">
            {view.nameA} &amp; {view.nameB}
          </h1>
          <div className="flex gap-2">
            <Button href={`/astrology/match/${matchId}/print`} variant="secondary" size="sm">
              Print preview
            </Button>
            <Button href={`/api/astrology/match/${matchId}/pdf?size=A4`} target="_blank" size="sm">
              Download PDF
            </Button>
          </div>
        </div>

        <MatchReport view={view} />
      </Container>
    </Section>
  );
}
