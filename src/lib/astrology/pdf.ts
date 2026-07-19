import { chromium } from "playwright";

/** Shared Playwright-Chromium print pipeline for every astrology PDF route. */

export type PdfPageSize = "A4" | "A5" | "A3";

export function pdfPageSize(param: string | null): PdfPageSize {
  return param === "A5" || param === "A3" ? param : "A4";
}

export async function renderPrintPdf(printUrl: string, format: PdfPageSize = "A4"): Promise<Uint8Array<ArrayBuffer>> {
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(printUrl, { waitUntil: "networkidle" });
    const pdf = await page.pdf({ format, printBackground: true });
    return new Uint8Array(pdf);
  } finally {
    await browser?.close();
  }
}

/** Spec filename builder: joins name parts with underscores, e.g. ["Arun", "Anitha", "Matching"] → Arun_Anitha_Matching.pdf */
export function pdfFileName(...parts: Array<string | null | undefined>): string {
  const safe = parts
    .filter((p): p is string => Boolean(p))
    .map((p) => p.trim().replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, ""))
    .filter(Boolean);
  return `${safe.join("_") || "Report"}.pdf`;
}

/** Content-Disposition with an ASCII fallback plus RFC 5987 UTF-8 name (Tamil/Hindi customer names). */
export function pdfContentDisposition(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "'");
  return `inline; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
