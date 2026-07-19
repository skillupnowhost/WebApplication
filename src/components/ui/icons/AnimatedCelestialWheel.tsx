"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Stylized zodiac wheel — orbit rings with small planets circling, astrology hero art. */
export function AnimatedCelestialWheel({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "cw" + useId().replace(/[^a-zA-Z0-9]/g, "");
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

        <circle cx="12" cy="12" r="9.4" stroke={`url(#${id}g)`} strokeWidth="0.7" opacity="0.55" />
        <circle cx="12" cy="12" r="6.2" stroke={`url(#${id}g)`} strokeWidth="0.6" opacity="0.4" strokeDasharray="1.5 2" />

        {Array.from({ length: 12 }, (_, i) => i * 30).map((deg) => (
          <line
            key={deg}
            x1="12"
            y1="2.6"
            x2="12"
            y2="4.2"
            stroke={`url(#${id}g)`}
            strokeWidth="0.6"
            opacity="0.5"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}

        <motion.circle
          cx="12"
          cy="12"
          r="2.2"
          fill={`url(#${id}gold)`}
          filter={`url(#${id}glow)`}
          animate={{ scale: [1, 1.12, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.g
          style={{ transformOrigin: "12px 12px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="12" cy="2.6" r="1.15" fill={`url(#${id}gold)`} filter={`url(#${id}glow)`} />
        </motion.g>

        <motion.g
          style={{ transformOrigin: "12px 12px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="12" cy="5.8" r="0.85" fill={`url(#${id}g)`} filter={`url(#${id}glow)`} />
        </motion.g>

        <motion.g
          style={{ transformOrigin: "12px 12px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="21.4" cy="12" r="0.7" fill="#fef3c7" filter={`url(#${id}glow)`} />
        </motion.g>
      </svg>
    </span>
  );
}
