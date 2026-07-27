"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Time-cycle glyph for MODERN report section headers (Dasha / period-timeline sections) — concentric
 * arcs with a slowly orbiting marker, gradient-filled and tied to the live theme variables so it
 * re-colours with the active colour theme. */
export function AnimatedDashaWheel({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "dw" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--jd-gold-bright)" />
            <stop offset="100%" stopColor="var(--jd-royal)" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="19" stroke={`url(#${id}g)`} strokeWidth="1.4" opacity="0.28" />
        <motion.circle
          cx="24"
          cy="24"
          r="13"
          stroke={`url(#${id}g)`}
          strokeWidth="1.6"
          strokeDasharray="6 5"
          opacity="0.7"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "24px 24px" }}
        />
        <circle cx="24" cy="24" r="4.5" fill={`url(#${id}g)`} />
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "24px 24px" }}>
          <circle cx="24" cy="6.5" r="2.4" fill={`url(#${id}g)`} />
        </motion.g>
      </svg>
    </span>
  );
}
