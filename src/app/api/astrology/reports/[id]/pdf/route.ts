import { NextResponse } from "next/server";
import { chromium } from "playwright";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const PAGE_SIZES = ["A3", "A4", "A5"] as const;
type PageSize = (typeof PAGE_SIZES)[number];

function isPageSize(value: string): value is PageSize {
  return (PAGE_SIZES as readonly string[]).includes(value);
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const sizeParam = (url.searchParams.get("size") ?? "A4").toUpperCase();
  const size: PageSize = isPageSize(sizeParam) ? sizeParam : "A4";

  const report = await prisma.horoscopeReport.findUnique({ where: { id } });
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  const printUrl = `${url.origin}/astrology/${id}/print?size=${size}`;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(printUrl, { waitUntil: "networkidle" });
    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="width:100%; font-size:9px; text-align:center; color:#6c4dff; padding-top:4px;">MyLoginn Astrology</div>`,
      footerTemplate: `<div style="width:100%; font-size:8px; text-align:center; color:#8a8aa3;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
    });
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="MyLoginn-Astrology-${size}.pdf"`,
      },
    });
  } finally {
    await browser.close();
  }
}
