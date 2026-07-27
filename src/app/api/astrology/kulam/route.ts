import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const language = url.searchParams.get("lang")?.trim() || "en";
  if (q.length < 1) return NextResponse.json({ suggestions: [] });

  const rows = await prisma.kulamSuggestion.findMany({
    where: { language },
    orderBy: { name: "asc" },
  });

  const qLower = q.toLowerCase();
  const suggestions = rows
    .filter((r) => r.alias.toLowerCase().includes(qLower) || r.name.toLowerCase().includes(qLower))
    .slice(0, 8)
    .map((r) => r.name);

  return NextResponse.json({ suggestions });
}
