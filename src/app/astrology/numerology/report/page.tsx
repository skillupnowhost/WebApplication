import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { astrologyNumerologyQuerySchema } from "@/lib/validation";
import { fullNumerologyProfile, analyzeNames } from "@/lib/astrology/numerology";
import { NumerologyReportDoc } from "@/components/astrology/NumerologyReportDoc";
import { StyleTabs } from "@/components/astrology/StyleTabs";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { ReportParamsError, firstParams } from "@/components/astrology/ReportParamsError";
import { t } from "@/lib/astrology/i18n";

export const metadata = { title: "Numerology Report — MyLoginn Astrology" };

const STYLES: ReportStyleValue[] = ["PROFESSIONAL", "TRADITIONAL", "MODERN"];

export default async function NumerologyReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = firstParams(await searchParams);
  const parsed = astrologyNumerologyQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return <ReportParamsError message="Those details don't look right." backHref="/astrology/numerology" backLabel="Start again" />;
  }

  const { name, birthDate, lang, compareNames } = parsed.data;
  const reportStyle: ReportStyleValue = STYLES.includes(raw.style as ReportStyleValue) ? (raw.style as ReportStyleValue) : "PROFESSIONAL";
  const profile = fullNumerologyProfile(name, new Date(`${birthDate}T00:00:00Z`));
  const compare = compareNames
    ? analyzeNames(compareNames.split(/[\n,]+/).slice(0, 10), profile.psychicNumber, profile.destinyNumber)
    : [];
  const qs = new URLSearchParams({ name, birthDate, lang });
  if (compareNames) qs.set("compareNames", compareNames);
  const qsWithStyle = new URLSearchParams(qs);
  qsWithStyle.set("style", reportStyle);

  return (
    <Section className="celestial-hero pt-10 sm:pt-14">
      <Container className="max-w-4xl">
        <AstroBreadcrumbs items={[{ label: "Numerology", href: "/astrology/numerology" }, { label: "Report" }]} className="mb-4" />
        <div className="astro-no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{name}&apos;s numerology</h1>
          <div className="flex flex-wrap items-center gap-2">
            <StyleTabs value={reportStyle} lang={lang} baseHref={`/astrology/numerology/report?${qs.toString()}`} />
            <Button href={`/astrology/numerology/print?${qsWithStyle.toString()}`} variant="secondary" size="sm">
              {t(lang, "viewPrint")}
            </Button>
            <Button href={`/api/astrology/numerology/pdf?${qsWithStyle.toString()}&size=A4`} target="_blank" size="sm">
              {t(lang, "downloadPdf")}
            </Button>
          </div>
        </div>

        <NumerologyReportDoc fullName={name} birthDate={birthDate} profile={profile} language={lang} compare={compare} reportStyle={reportStyle} />
      </Container>
    </Section>
  );
}
