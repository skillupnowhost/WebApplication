import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { birthDetailsSchema } from "@/lib/validation";
import { geocodeBirthPlace } from "@/lib/astrology/geocode";
import { localBirthInstant, computeChart, serializeChart } from "@/lib/astrology/chart";
import { getOrCreateReport } from "@/lib/astrology/report";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = birthDetailsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;

  const geo = await geocodeBirthPlace(data.birthPlace);
  if (!geo) {
    return NextResponse.json(
      { error: 'We couldn\'t find that birth place. Try adding a state/country, e.g. "Madurai, Tamil Nadu, India".' },
      { status: 422 }
    );
  }

  const birthTime = data.birthTimeKnown ? data.birthTime : "12:00";
  const birthInstant = localBirthInstant(data.birthDate, birthTime, geo.timezone);
  const user = await getCurrentUser();

  const profile = await prisma.astrologyProfile.create({
    data: {
      userId: user?.id,
      fullName: data.fullName,
      gender: data.gender || null,
      birthDate: birthInstant,
      birthTimeKnown: data.birthTimeKnown,
      birthPlace: data.birthPlace,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone,
      parentsNames: data.parentsNames || null,
      occupation: data.occupation || null,
      customNotes: data.customNotes || null,
    },
  });

  const chart = computeChart({
    fullName: profile.fullName,
    birthDate: birthInstant,
    latitude: geo.latitude,
    longitude: geo.longitude,
  });

  const chartData = await prisma.chartData.create({
    data: { profileId: profile.id, ...serializeChart(chart) },
  });

  const report = await getOrCreateReport({
    chartDataId: chartData.id,
    depth: data.depth,
    voice: data.voice,
    language: data.language,
  });
  if (!report) {
    return NextResponse.json({ error: "Could not generate your report. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ reportId: report.id, chartDataId: chartData.id });
}
