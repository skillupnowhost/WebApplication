import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { astrologyNamingQuerySchema } from "@/lib/validation";
import { buildNamingView } from "@/lib/astrology/naming";
import { NamingReportDoc } from "@/components/astrology/NamingReportDoc";
import { ReportParamsError, firstParams } from "@/components/astrology/ReportParamsError";
import { t } from "@/lib/astrology/i18n";

export const metadata = { title: "Baby Naming Report — MyLoginn Astrology" };

export default async function NamingReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsed = astrologyNamingQuerySchema.safeParse(firstParams(await searchParams));
  if (!parsed.success) {
    return <ReportParamsError message="Those details don't look right." backHref="/astrology/naming" backLabel="Start again" />;
  }

  const { birthDate, birthTime, place, gender, letter, lang } = parsed.data;
  const view = await buildNamingView({
    birthDate,
    birthTime,
    place,
    genderFilter: gender,
    preferredLetter: letter || undefined,
    language: lang,
  });
  if (!view) {
    return (
      <ReportParamsError
        message="We couldn't find that place. Try a nearby major city."
        backHref="/astrology/naming"
        backLabel="Start again"
      />
    );
  }

  const qs = new URLSearchParams({ birthDate, birthTime, place, gender, lang });
  if (letter) qs.set("letter", letter);

  return (
    <Section className="celestial-hero pt-10 sm:pt-14">
      <Container className="max-w-4xl">
        <AstroBreadcrumbs items={[{ label: "Baby Naming", href: "/astrology/naming" }, { label: "Report" }]} className="mb-4" />
        <div className="astro-no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Baby naming report</h1>
          <div className="flex gap-2">
            <Button href={`/astrology/naming/print?${qs.toString()}`} variant="secondary" size="sm">
              {t(lang, "viewPrint")}
            </Button>
            <Button href={`/api/astrology/naming/pdf?${qs.toString()}&size=A4`} target="_blank" size="sm">
              {t(lang, "downloadPdf")}
            </Button>
          </div>
        </div>

        <NamingReportDoc view={view} />
      </Container>
    </Section>
  );
}
