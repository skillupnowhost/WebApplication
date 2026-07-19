"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Rotating mandala / yantra radial pattern — ambient celestial decoration. */
export function AnimatedMandala({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "mn" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id={`${id}glow`}>
            <feGaussianBlur stdDeviation="0.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.g
          style={{ transformOrigin: "12px 12px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          {petals.map((deg) => (
            <path
              key={deg}
              d="M12 12 12 3.5a2.2 2.2 0 0 1 0 4.4Z"
              fill={`url(#${id}g)`}
              opacity="0.85"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
          <circle cx="12" cy="12" r="7.2" stroke={`url(#${id}g)`} strokeWidth="0.6" opacity="0.6" />
        </motion.g>
        <motion.g
          style={{ transformOrigin: "12px 12px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="12" cy="12" r="10.4" stroke={`url(#${id}g)`} strokeWidth="0.5" opacity="0.4" />
        </motion.g>
        <motion.circle
          cx="12"
          cy="12"
          r="2"
          fill={`url(#${id}g)`}
          filter={`url(#${id}glow)`}
          animate={{ scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
