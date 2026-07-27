"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Temple-gopuram corner ornament for the TRADITIONAL report style — a tiered tower silhouette
 * with a curling vine border, gradient-filled and tied to the live `--jd-royal`/`--jd-gold-bright`
 * theme variables so it re-colors automatically with whichever colour theme is active. Meant to sit
 * in a report page corner (rotate via className/style for the other 3 corners) or as a small top-of-page
 * accent. Purely decorative — presentational only, no data props. */
export function AnimatedTempleCorner({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "tc" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--jd-gold-bright)" />
            <stop offset="100%" stopColor="var(--jd-royal)" />
          </linearGradient>
        </defs>
        {/* corner vine / border sweep */}
        <motion.path
          d="M4 68C4 40 4 16 30 6"
          stroke={`url(#${id}g)`}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
          animate={{ pathLength: [0.85, 1, 0.85], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <path d="M9 68c1-22 1-40 20-52" stroke={`url(#${id}g)`} strokeWidth="0.8" opacity="0.35" />
        {/* gopuram tiers, stacked trapezoids narrowing upward */}
        <motion.g
          style={{ transformOrigin: "22px 44px" }}
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="12" y="52" width="20" height="6" rx="0.6" fill={`url(#${id}g)`} />
          <path d="M14 52l2-6h12l2 6H14Z" fill={`url(#${id}g)`} opacity="0.92" />
          <path d="M17 46l1.6-5h6.8l1.6 5H17Z" fill={`url(#${id}g)`} opacity="0.85" />
          <path d="M19.5 41l1-4h3l1 4h-5Z" fill={`url(#${id}g)`} opacity="0.78" />
          <circle cx="22" cy="35" r="1.6" fill={`url(#${id}g)`} />
        </motion.g>
        <motion.circle
          cx="22"
          cy="35"
          r="4"
          stroke={`url(#${id}g)`}
          strokeWidth="0.6"
          opacity="0.4"
          animate={{ r: [4, 6, 4], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}
