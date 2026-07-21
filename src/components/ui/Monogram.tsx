"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "h-9 w-9 text-sm",
  md: "h-11 w-11 text-base",
  lg: "h-14 w-14 text-xl",
};

/** Compact brand monogram badge — gradient "M" mark with a slow rotating sheen ring, used beside the wordmark. */
export function Monogram({
  size = "md",
  className,
  style,
}: {
  size?: keyof typeof sizes;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", sizes[size], className)}
      style={style}
    >
      <motion.span
        aria-hidden
        className="absolute inset-[-3px] rounded-2xl opacity-70"
        style={{
          background:
            "conic-gradient(from 0deg, var(--brand-400), var(--accent-400), var(--brand-500), var(--brand-400))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <span className="brand-gradient-bg relative flex h-full w-full items-center justify-center rounded-2xl shadow-[var(--shadow-lift)]">
        <span className="font-bold text-white" style={{ fontFamily: "var(--font-display)" }} aria-hidden>
          M
        </span>
      </span>
      <span className="sr-only">MyLoginn</span>
    </span>
  );
}

/** Oversized, near-transparent monogram used as a decorative watermark texture behind hero/footer panels. */
export function MonogramWatermark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none select-none font-bold leading-none text-white/[0.06] dark:text-white/[0.05]",
        className
      )}
      style={{ fontFamily: "var(--font-display)" }}
    >
      M
    </span>
  );
}
