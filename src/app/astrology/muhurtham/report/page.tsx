import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { astrologyMuhurthamQuerySchema } from "@/lib/validation";
import { geocodePlace } from "@/lib/astrology/geocode";
import { findMuhurthamDays } from "@/lib/astrology/muhurtham";
import { MuhurthamReportDoc } from "@/components/astrology/MuhurthamReportDoc";
import { StyleTabs } from "@/components/astrology/StyleTabs";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { ReportParamsError, firstParams } from "@/components/astrology/ReportParamsError";
import { t } from "@/lib/astrology/i18n";

export const metadata = { title: "Shubha Muhurtham Report — MyLoginn Astrology" };

const STYLES: ReportStyleValue[] = ["PROFESSIONAL", "TRADITIONAL", "MODERN"];

export default async function MuhurthamReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = firstParams(await searchParams);
  const parsed = astrologyMuhurthamQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return <ReportParamsError message="Those details don't look right." backHref="/astrology/muhurtham" backLabel="Start again" />;
  }

  const { name, event, from, to, place, lang } = parsed.data;
  const reportStyle: ReportStyleValue = STYLES.includes(raw.style as ReportStyleValue) ? (raw.style as ReportStyleValue) : "PROFESSIONAL";
  const geocoded = await geocodePlace(place);
  if (!geocoded) {
    return (
      <ReportParamsError
        message="We couldn't find that place. Try a nearby major city."
        backHref="/astrology/muhurtham"
        backLabel="Start again"
      />
    );
  }

  const result = findMuhurthamDays({
    event,
    fromDate: from,
    toDate: to,
    latitude: geocoded.latitude,
    longitude: geocoded.longitude,
    timezone: geocoded.timezone,
  });

  const qs = new URLSearchParams({ name, event, from, to, place, lang });
  const qsWithStyle = new URLSearchParams(qs);
  qsWithStyle.set("style", reportStyle);

  return (
    <Section className="celestial-hero pt-10 sm:pt-14">
      <Container className="max-w-4xl">
        <AstroBreadcrumbs items={[{ label: "Muhurtham", href: "/astrology/muhurtham" }, { label: "Report" }]} className="mb-4" />
        <div className="astro-no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Shubha muhurtham</h1>
          <div className="flex flex-wrap items-center gap-2">
            <StyleTabs value={reportStyle} lang={lang} baseHref={`/astrology/muhurtham/report?${qs.toString()}`} />
            <Button href={`/astrology/muhurtham/print?${qsWithStyle.toString()}`} variant="secondary" size="sm">
              {t(lang, "viewPrint")}
            </Button>
            <Button href={`/api/astrology/muhurtham/pdf?${qsWithStyle.toString()}&size=A4`} target="_blank" size="sm">
              {t(lang, "downloadPdf")}
            </Button>
          </div>
        </div>

        <MuhurthamReportDoc name={name} event={event} fromDate={from} toDate={to} place={place} result={result} language={lang} reportStyle={reportStyle} />
      </Container>
    </Section>
  );
}
