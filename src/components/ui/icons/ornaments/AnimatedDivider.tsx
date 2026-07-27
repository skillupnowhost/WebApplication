"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Decorative horizontal section-divider flourish — a central lotus/diamond glyph with symmetric
 * sweeping lines and a slow travelling shimmer, used between major sections across all 3 report
 * styles. Colours are tied to the live `--jd-royal`/`--jd-gold-bright` theme variables so it re-skins
 * automatically per style AND per colour theme. Presentational only, fills its container width. */
export function AnimatedDivider({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "dv" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex w-full shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 320 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--jd-gold-bright)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--jd-gold-bright)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--jd-gold-bright)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}shimmer`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--jd-royal)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--jd-paper)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--jd-royal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="4" y1="10" x2="140" y2="10" stroke={`url(#${id}line)`} strokeWidth="1" />
        <line x1="180" y1="10" x2="316" y2="10" stroke={`url(#${id}line)`} strokeWidth="1" />
        <rect
          x="152"
          y="2"
          width="16"
          height="16"
          rx="3"
          fill="var(--jd-royal)"
          style={{ transformOrigin: "160px 10px", rotate: "45deg" }}
        />
        <motion.rect
          x="155"
          y="5"
          width="10"
          height="10"
          rx="2"
          fill="var(--jd-gold-bright)"
          style={{ transformOrigin: "160px 10px", rotate: 45 }}
          animate={{ scale: [0.7, 1, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect
          x="4"
          y="8"
          width="24"
          height="4"
          fill={`url(#${id}shimmer)`}
          animate={{ x: [0, 292, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
