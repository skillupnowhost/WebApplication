import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderPrintPdf, pdfPageSize, pdfFileName, pdfContentDisposition } from "@/lib/astrology/pdf";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const size = pdfPageSize(url.searchParams.get("size"));
  const printUrl = `${url.origin}/astrology/${id}/print?size=${size}`;

  const report = await prisma.horoscopeReport.findUnique({
    where: { id },
    include: { chartData: { include: { profile: { select: { fullName: true } } } } },
  });
  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  // Spec filenames: CustomerName_Single_Horoscope.pdf / CustomerName_Full_Horoscope.pdf
  const filename = pdfFileName(report.chartData.profile.fullName, report.depth === "FULL" ? "Full_Horoscope" : "Single_Horoscope");

  try {
    const pdf = await renderPrintPdf(printUrl, size);
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": pdfContentDisposition(filename),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Astrology PDF generation failed:", error);
    return NextResponse.json({ error: "Couldn't generate the PDF right now. Please try again." }, { status: 500 });
  }
}
