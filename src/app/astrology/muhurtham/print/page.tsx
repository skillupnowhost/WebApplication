import { notFound } from "next/navigation";
import { astrologyMuhurthamQuerySchema } from "@/lib/validation";
import { geocodePlace } from "@/lib/astrology/geocode";
import { findMuhurthamDays } from "@/lib/astrology/muhurtham";
import { MuhurthamReportDoc } from "@/components/astrology/MuhurthamReportDoc";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { firstParams } from "@/components/astrology/ReportParamsError";

const STYLES: ReportStyleValue[] = ["PROFESSIONAL", "TRADITIONAL", "MODERN"];

export default async function MuhurthamPrintPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = firstParams(await searchParams);
  const parsed = astrologyMuhurthamQuerySchema.safeParse(raw);
  if (!parsed.success) notFound();

  const { name, event, from, to, place, lang } = parsed.data;
  const reportStyle: ReportStyleValue = STYLES.includes(raw.style as ReportStyleValue) ? (raw.style as ReportStyleValue) : "PROFESSIONAL";
  const geocoded = await geocodePlace(place);
  if (!geocoded) notFound();

  const result = findMuhurthamDays({
    event,
    fromDate: from,
    toDate: to,
    latitude: geocoded.latitude,
    longitude: geocoded.longitude,
    timezone: geocoded.timezone,
  });

  const pageSize = raw.size === "A5" || raw.size === "A3" ? raw.size : "A4";

  return (
    <div data-page-size={pageSize} className="bg-white py-8 print:py-0">
      <MuhurthamReportDoc name={name} event={event} fromDate={from} toDate={to} place={place} result={result} language={lang} reportStyle={reportStyle} printMode />
    </div>
  );
}
