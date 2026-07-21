"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Pisces — two fish tethered by a line, drifting apart and back in a slow loop. */
export function AnimatedPisces({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zpi" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id={`${id}glow`}>
            <feGaussianBlur stdDeviation="0.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M6 12h12"
          stroke={`url(#${id}g)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
        />
        <motion.path
          d="M9 4c-3 3-3 13 0 16"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
          animate={{ x: [0, -0.8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M15 4c3 3 3 13 0 16"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
          animate={{ x: [0, 0.8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>
    </span>
  );
}
