import { NextResponse } from "next/server";
import { loadMatchView } from "@/lib/astrology/match";
import { renderPrintPdf, pdfPageSize, pdfFileName, pdfContentDisposition } from "@/lib/astrology/pdf";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const size = pdfPageSize(url.searchParams.get("size"));
  const style = url.searchParams.get("style");
  const printUrl = `${url.origin}/astrology/match/${id}/print?size=${size}${style ? `&style=${style}` : ""}`;

  const view = await loadMatchView(id);
  if (!view) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }

  // Spec filename: BoyName_GirlName_Matching.pdf
  const filename = pdfFileName(view.nameA, view.nameB, "Matching");

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
    console.error("Match PDF generation failed:", error);
    return NextResponse.json({ error: "Couldn't generate the PDF right now. Please try again." }, { status: 500 });
  }
}
