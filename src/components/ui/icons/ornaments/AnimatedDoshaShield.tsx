"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Shield-with-spark glyph for MODERN report section headers (Dosha analysis / remedies sections) —
 * gradient-filled shield outline with a pulsing spark at the centre, tied to the live theme variables. */
export function AnimatedDoshaShield({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "ds" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--jd-gold-bright)" />
            <stop offset="100%" stopColor="var(--jd-royal)" />
          </linearGradient>
        </defs>
        <path
          d="M24 5 39 10.5v11c0 11-6.4 17.8-15 21.5-8.6-3.7-15-10.5-15-21.5v-11L24 5Z"
          stroke={`url(#${id}g)`}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <motion.path
          d="M25.5 14 18 25h6l-1.6 9L30 22h-6l1.5-8Z"
          fill={`url(#${id}g)`}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
