"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Aquarius — twin water waves rippling in a slow horizontal drift. */
export function AnimatedAquarius({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zaq" + useId().replace(/[^a-zA-Z0-9]/g, "");
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
        <motion.path
          d="M4 9.5 7 7.5 10 9.5 13 7.5 16 9.5 19 7.5"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}glow)`}
          animate={{ x: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M4 15.5 7 13.5 10 15.5 13 13.5 16 15.5 19 13.5"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}glow)`}
          animate={{ x: [1, -1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>
    </span>
  );
}
