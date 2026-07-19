"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Taurus — bull's head, horns arch above a glowing circle that gently breathes. */
export function AnimatedTaurus({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zta" + useId().replace(/[^a-zA-Z0-9]/g, "");
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
          style={{ transformOrigin: "12px 13px" }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M7.5 11c-1.5-3 0-7 4.5-7s6 4 4.5 7"
            stroke={`url(#${id}g)`}
            strokeWidth="1.7"
            strokeLinecap="round"
            filter={`url(#${id}glow)`}
          />
          <circle cx="12" cy="15.5" r="4.3" stroke={`url(#${id}g)`} strokeWidth="1.7" filter={`url(#${id}glow)`} />
        </motion.g>
        <motion.circle
          cx="4.5"
          cy="6"
          r="1"
          fill="#fef3c7"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
    </span>
  );
}
