import { NextResponse } from "next/server";
import { astrologyReportRequestSchema } from "@/lib/validation";
import { getOrCreateReport } from "@/lib/astrology/report";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = astrologyReportRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  try {
    const { report } = await getOrCreateReport(parsed.data);
    return NextResponse.json({ reportId: report.id });
  } catch (error) {
    console.error("Failed to generate astrology report:", error);
    return NextResponse.json({ error: "Couldn't generate the report. Please check the birth details and try again." }, { status: 500 });
  }
}
