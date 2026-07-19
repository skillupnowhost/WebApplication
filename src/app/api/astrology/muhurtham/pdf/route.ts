import { NextResponse } from "next/server";
import { renderPrintPdf, pdfPageSize, pdfFileName, pdfContentDisposition } from "@/lib/astrology/pdf";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const size = pdfPageSize(url.searchParams.get("size"));
  const customerName = url.searchParams.get("name") ?? "Customer";

  const printUrl = new URL(`${url.origin}/astrology/muhurtham/print`);
  url.searchParams.forEach((value, key) => printUrl.searchParams.set(key, value));
  printUrl.searchParams.set("size", size);

  try {
    const pdf = await renderPrintPdf(printUrl.toString(), size);
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": pdfContentDisposition(pdfFileName(customerName, "Muhurtham_Report")),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Muhurtham PDF generation failed:", error);
    return NextResponse.json({ error: "Couldn't generate the PDF right now. Please try again." }, { status: 500 });
  }
}
