import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { astrologyNumerologyQuerySchema } from "@/lib/validation";
import { fullNumerologyProfile, analyzeNames } from "@/lib/astrology/numerology";
import { NumerologyReportDoc } from "@/components/astrology/NumerologyReportDoc";
import { ReportParamsError, firstParams } from "@/components/astrology/ReportParamsError";
import { t } from "@/lib/astrology/i18n";

export const metadata = { title: "Numerology Report — MyLoginn Astrology" };

export default async function NumerologyReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsed = astrologyNumerologyQuerySchema.safeParse(firstParams(await searchParams));
  if (!parsed.success) {
    return <ReportParamsError message="Those details don't look right." backHref="/astrology/numerology" backLabel="Start again" />;
  }

  const { name, birthDate, lang, compareNames } = parsed.data;
  const profile = fullNumerologyProfile(name, new Date(`${birthDate}T00:00:00Z`));
  const compare = compareNames
    ? analyzeNames(compareNames.split(/[\n,]+/).slice(0, 10), profile.psychicNumber, profile.destinyNumber)
    : [];
  const qs = new URLSearchParams({ name, birthDate, lang });
  if (compareNames) qs.set("compareNames", compareNames);

  return (
    <Section className="celestial-hero pt-10 sm:pt-14">
      <Container className="max-w-4xl">
        <AstroBreadcrumbs items={[{ label: "Numerology", href: "/astrology/numerology" }, { label: "Report" }]} className="mb-4" />
        <div className="astro-no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{name}&apos;s numerology</h1>
          <div className="flex gap-2">
            <Button href={`/astrology/numerology/print?${qs.toString()}`} variant="secondary" size="sm">
              {t(lang, "viewPrint")}
            </Button>
            <Button href={`/api/astrology/numerology/pdf?${qs.toString()}&size=A4`} target="_blank" size="sm">
              {t(lang, "downloadPdf")}
            </Button>
          </div>
        </div>

        <NumerologyReportDoc fullName={name} birthDate={birthDate} profile={profile} language={lang} compare={compare} />
      </Container>
    </Section>
  );
}
