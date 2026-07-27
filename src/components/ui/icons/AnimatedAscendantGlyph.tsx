"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Rising-horizon glyph for the Lagna/Ascendant — a sun arc breaking a horizon line,
 * used inline in astrology report chips in place of a plain "↑" that Indic
 * handwriting webfonts don't carry a glyph for. */
export function AnimatedAscendantGlyph({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "as" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#6c4dff" />
          </linearGradient>
          <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id={`${id}glow`}>
            <feGaussianBlur stdDeviation="0.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line x1="2.4" y1="16.2" x2="21.6" y2="16.2" stroke={`url(#${id}g)`} strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
        <motion.g
          animate={{ y: [1.4, -0.6, 1.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M6 16.2a6 6 0 0 1 12 0"
            stroke={`url(#${id}gold)`}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            filter={`url(#${id}glow)`}
          />
          <motion.g
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <line x1="12" y1="7.4" x2="12" y2="5.4" stroke={`url(#${id}gold)`} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="8.2" y1="8.7" x2="6.9" y2="7.3" stroke={`url(#${id}gold)`} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="15.8" y1="8.7" x2="17.1" y2="7.3" stroke={`url(#${id}gold)`} strokeWidth="1.2" strokeLinecap="round" />
          </motion.g>
        </motion.g>
      </svg>
    </span>
  );
}
