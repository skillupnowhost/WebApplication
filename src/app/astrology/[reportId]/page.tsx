import { notFound } from "next/navigation";
import { loadReportView } from "@/lib/astrology/report";
import { ReportViewer } from "@/components/astrology/ReportViewer";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { StyleTabs } from "@/components/astrology/StyleTabs";
import { ColorThemeTabs } from "@/components/astrology/ColorThemeTabs";
import { LanguageDropdown } from "@/components/astrology/LanguageDropdown";
import { AstroChat } from "@/components/astrology/AstroChat";

export default async function AstrologyReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const view = await loadReportView(reportId);
  if (!view) notFound();

  return (
    <Section className="celestial-hero pt-10 sm:pt-14">
      <Container className="max-w-4xl">
        <AstroBreadcrumbs items={[{ label: "Generate Horoscope", href: "/astrology/new" }, { label: "Report" }]} className="mb-4" />
        <div className="astro-no-print mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{view.fullName}&apos;s horoscope</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button href={`/astrology/${reportId}/print`} variant="secondary" size="sm">
              Print preview
            </Button>
            <Button href={`/api/astrology/reports/${reportId}/pdf?size=A4`} target="_blank" size="sm">
              Download PDF
            </Button>
          </div>
        </div>

        <div className="astro-no-print mb-6 flex flex-wrap items-center gap-2">
          <StyleTabs reportId={reportId} value={view.reportStyle} lang={view.language} />
          <ColorThemeTabs reportId={reportId} value={view.colorTheme} lang={view.language} />
          <LanguageDropdown reportId={reportId} value={view.language} />
        </div>

        <ReportViewer view={view} />

        <div className="astro-no-print mt-6">
          <AstroChat reportId={reportId} lang={view.language} hasMandi={!!view.mandi} />
        </div>
      </Container>
    </Section>
  );
}
