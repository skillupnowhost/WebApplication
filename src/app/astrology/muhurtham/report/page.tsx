import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { astrologyMuhurthamQuerySchema } from "@/lib/validation";
import { geocodePlace } from "@/lib/astrology/geocode";
import { findMuhurthamDays } from "@/lib/astrology/muhurtham";
import { MuhurthamReportDoc } from "@/components/astrology/MuhurthamReportDoc";
import { ReportParamsError, firstParams } from "@/components/astrology/ReportParamsError";
import { t } from "@/lib/astrology/i18n";

export const metadata = { title: "Shubha Muhurtham Report — MyLoginn Astrology" };

export default async function MuhurthamReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsed = astrologyMuhurthamQuerySchema.safeParse(firstParams(await searchParams));
  if (!parsed.success) {
    return <ReportParamsError message="Those details don't look right." backHref="/astrology/muhurtham" backLabel="Start again" />;
  }

  const { name, event, from, to, place, lang } = parsed.data;
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

  return (
    <Section className="celestial-hero pt-10 sm:pt-14">
      <Container className="max-w-4xl">
        <AstroBreadcrumbs items={[{ label: "Muhurtham", href: "/astrology/muhurtham" }, { label: "Report" }]} className="mb-4" />
        <div className="astro-no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Shubha muhurtham</h1>
          <div className="flex gap-2">
            <Button href={`/astrology/muhurtham/print?${qs.toString()}`} variant="secondary" size="sm">
              {t(lang, "viewPrint")}
            </Button>
            <Button href={`/api/astrology/muhurtham/pdf?${qs.toString()}&size=A4`} target="_blank" size="sm">
              {t(lang, "downloadPdf")}
            </Button>
          </div>
        </div>

        <MuhurthamReportDoc name={name} event={event} fromDate={from} toDate={to} place={place} result={result} language={lang} />
      </Container>
    </Section>
  );
}
