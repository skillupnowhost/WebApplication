import { NextResponse } from "next/server";
import { reportRequestSchema } from "@/lib/validation";
import { getOrCreateReport } from "@/lib/astrology/report";

/** Switches an existing chart to a different depth/voice/language — never recomputes the astronomy. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = reportRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const report = await getOrCreateReport(parsed.data);
  if (!report) return NextResponse.json({ error: "Chart not found" }, { status: 404 });

  return NextResponse.json({ reportId: report.id });
}
