"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Cancer — twin crab spirals, each coil pulsing out of phase. */
export function AnimatedCancer({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zcn" + useId().replace(/[^a-zA-Z0-9]/g, "");
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
        <motion.g
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="7.5" cy="8" r="2.1" stroke={`url(#${id}g)`} strokeWidth="1.6" filter={`url(#${id}glow)`} />
          <path
            d="M9.4 9.6c2 2 2 6.2 5.1 7.4"
            stroke={`url(#${id}g)`}
            strokeWidth="1.6"
            strokeLinecap="round"
            filter={`url(#${id}glow)`}
          />
        </motion.g>
        <motion.g
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <circle cx="16.5" cy="16" r="2.1" stroke={`url(#${id}g)`} strokeWidth="1.6" filter={`url(#${id}glow)`} />
          <path
            d="M14.6 14.4c-2-2-2-6.2-5.1-7.4"
            stroke={`url(#${id}g)`}
            strokeWidth="1.6"
            strokeLinecap="round"
            filter={`url(#${id}glow)`}
          />
        </motion.g>
      </svg>
    </span>
  );
}
