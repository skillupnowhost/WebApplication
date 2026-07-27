"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The admin shell positions fixed overlays (drawer, modals, toasts); the
  // animated wrapper's transform/filter would turn into their containing
  // block and pin them to the page instead of the viewport — skip it there.
  //
  // /astrology/**/print pages are captured headlessly by Playwright for PDF
  // export (see lib/astrology/pdf.ts). Headless Chromium never paints frames
  // for a backgrounded tab, so the entrance animation's initial (invisible,
  // blurred) state never advances — Chromium then rasterizes the whole page
  // as one blank layer, producing an empty PDF. Skip the wrapper there too.
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.endsWith("/print")) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 18, scale: 0.992, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -14, scale: 0.995, filter: "blur(4px)" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
