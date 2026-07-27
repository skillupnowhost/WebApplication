"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Radiant sun glyph — used inline for Sun-sign chips in astrology reports. */
export function AnimatedSunGlyph({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "sn" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
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
        <motion.g
          style={{ transformOrigin: "12px 12px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 8 }, (_, i) => i * 45).map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="2.4"
              x2="12"
              y2="5"
              stroke={`url(#${id}g)`}
              strokeWidth="1.4"
              strokeLinecap="round"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </motion.g>
        <motion.circle
          cx="12"
          cy="12"
          r="4.6"
          fill={`url(#${id}g)`}
          filter={`url(#${id}glow)`}
          animate={{ scale: [1, 1.08, 1], opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
