import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COLOR_THEME_VALUES, type ColorThemeValue } from "@/lib/astrology/report";

/** Colour theme is purely presentational (it never changes narrative content), so unlike
 * switch-style it doesn't fork/find a sibling report row — it just updates the colorTheme column
 * on the current report in place, then redirects back to the same report id. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const to = url.searchParams.get("to");

  if (!to || !COLOR_THEME_VALUES.includes(to as ColorThemeValue)) {
    return NextResponse.json({ error: "Invalid colour theme" }, { status: 400 });
  }

  const current = await prisma.horoscopeReport.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  if (current.colorTheme !== to) {
    await prisma.horoscopeReport.update({ where: { id }, data: { colorTheme: to } });
  }

  return NextResponse.redirect(new URL(`/astrology/${id}`, url.origin));
}
