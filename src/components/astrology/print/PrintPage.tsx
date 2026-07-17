import type { ReactNode } from "react";

export type PageSize = "A4" | "A5" | "A3";

/** @page-aware wrapper — the size drives both the Playwright PDF page box (via preferCSSPageSize) and on-screen preview width. */
export function PrintPage({ size, children }: { size: PageSize; children: ReactNode }) {
  return (
    <div data-page-size={size} className="astro-print-root">
      <style>{`@page { size: ${size}; margin: 16mm 14mm; }`}</style>
      {children}
    </div>
  );
}
