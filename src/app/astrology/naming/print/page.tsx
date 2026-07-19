import { notFound } from "next/navigation";
import { astrologyNamingQuerySchema } from "@/lib/validation";
import { buildNamingView } from "@/lib/astrology/naming";
import { NamingReportDoc } from "@/components/astrology/NamingReportDoc";
import { firstParams } from "@/components/astrology/ReportParamsError";

export default async function NamingPrintPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = firstParams(await searchParams);
  const parsed = astrologyNamingQuerySchema.safeParse(raw);
  if (!parsed.success) notFound();

  const { birthDate, birthTime, place, gender, letter, lang } = parsed.data;
  const view = await buildNamingView({
    birthDate,
    birthTime,
    place,
    genderFilter: gender,
    preferredLetter: letter || undefined,
    language: lang,
  });
  if (!view) notFound();

  const pageSize = raw.size === "A5" || raw.size === "A3" ? raw.size : "A4";

  return (
    <div data-page-size={pageSize} className="bg-white py-8 print:py-0">
      <NamingReportDoc view={view} printMode />
    </div>
  );
}
