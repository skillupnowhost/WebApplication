import { NextResponse } from "next/server";
import { loadReportView } from "@/lib/astrology/report";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const view = await loadReportView(id);
  if (!view) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  return NextResponse.json({ report: view });
}
