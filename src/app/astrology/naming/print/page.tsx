import { notFound } from "next/navigation";
import { astrologyNamingQuerySchema } from "@/lib/validation";
import { buildNamingView } from "@/lib/astrology/naming";
import { NamingReportDoc } from "@/components/astrology/NamingReportDoc";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { firstParams } from "@/components/astrology/ReportParamsError";

const STYLES: ReportStyleValue[] = ["PROFESSIONAL", "TRADITIONAL", "MODERN"];

export default async function NamingPrintPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = firstParams(await searchParams);
  const parsed = astrologyNamingQuerySchema.safeParse(raw);
  if (!parsed.success) notFound();

  const { birthDate, birthTime, place, gender, letter, lang, count } = parsed.data;
  const reportStyle: ReportStyleValue = STYLES.includes(raw.style as ReportStyleValue) ? (raw.style as ReportStyleValue) : "PROFESSIONAL";
  const view = await buildNamingView({
    birthDate,
    birthTime,
    place,
    genderFilter: gender,
    preferredLetter: letter || undefined,
    language: lang,
    count,
  });
  if (!view) notFound();

  const pageSize = raw.size === "A5" || raw.size === "A3" ? raw.size : "A4";

  return (
    <div data-page-size={pageSize} className="bg-white py-8 print:py-0">
      <NamingReportDoc view={view} reportStyle={reportStyle} printMode />
    </div>
  );
}
