import { notFound } from "next/navigation";
import { astrologyNumerologyQuerySchema } from "@/lib/validation";
import { fullNumerologyProfile, analyzeNames } from "@/lib/astrology/numerology";
import { NumerologyReportDoc } from "@/components/astrology/NumerologyReportDoc";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { firstParams } from "@/components/astrology/ReportParamsError";

const STYLES: ReportStyleValue[] = ["PROFESSIONAL", "TRADITIONAL", "MODERN"];

export default async function NumerologyPrintPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = firstParams(await searchParams);
  const parsed = astrologyNumerologyQuerySchema.safeParse(raw);
  if (!parsed.success) notFound();

  const { name, birthDate, lang, compareNames } = parsed.data;
  const reportStyle: ReportStyleValue = STYLES.includes(raw.style as ReportStyleValue) ? (raw.style as ReportStyleValue) : "PROFESSIONAL";
  const profile = fullNumerologyProfile(name, new Date(`${birthDate}T00:00:00Z`));
  const compare = compareNames
    ? analyzeNames(compareNames.split(/[\n,]+/).slice(0, 10), profile.psychicNumber, profile.destinyNumber)
    : [];
  const pageSize = raw.size === "A5" || raw.size === "A3" ? raw.size : "A4";

  return (
    <div data-page-size={pageSize} className="bg-white py-8 print:py-0">
      <NumerologyReportDoc fullName={name} birthDate={birthDate} profile={profile} language={lang} compare={compare} reportStyle={reportStyle} printMode />
    </div>
  );
}
