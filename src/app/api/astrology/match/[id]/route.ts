import { NextResponse } from "next/server";
import { loadMatchView } from "@/lib/astrology/match";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const view = await loadMatchView(id);
  if (!view) return NextResponse.json({ error: "Match not found" }, { status: 404 });
  return NextResponse.json({ match: view });
}
