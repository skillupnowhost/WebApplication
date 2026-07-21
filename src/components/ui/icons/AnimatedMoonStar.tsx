"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Crescent moon with a twinkling companion star — the astrology nav-link icon. */
export function AnimatedMoonStar({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "ms" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#6c4dff" />
          </linearGradient>
          <linearGradient id={`${id}star`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id={`${id}glow`}>
            <feGaussianBlur stdDeviation="0.7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M15.5 4.2a8 8 0 1 0 4.3 14.6 9.4 9.4 0 0 1-4.3-14.6Z"
          fill={`url(#${id}g)`}
          filter={`url(#${id}glow)`}
          style={{ transformOrigin: "13px 12px" }}
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M5.2 5.4c.35 2.4 1.25 3.6 3.5 4.2-2.25.6-3.15 1.8-3.5 4.2-.35-2.4-1.25-3.6-3.5-4.2 2.25-.6 3.15-1.8 3.5-4.2Z"
          fill={`url(#${id}star)`}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.05, 0.85] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
