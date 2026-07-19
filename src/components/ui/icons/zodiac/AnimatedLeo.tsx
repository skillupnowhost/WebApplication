"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Leo — the lion's mane curl, sweeping tail glinting at its tip. */
export function AnimatedLeo({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zle" + useId().replace(/[^a-zA-Z0-9]/g, "");
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
          style={{ transformOrigin: "9px 15px" }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="9" cy="15" r="4.4" stroke={`url(#${id}g)`} strokeWidth="1.7" filter={`url(#${id}glow)`} />
          <path
            d="M12.8 12.6c2.4-.3 4.7-2.5 4.3-5.1-.3-2-2.2-2.7-3.2-1.5-.8 1 0 2.6 1.5 2.6"
            stroke={`url(#${id}g)`}
            strokeWidth="1.7"
            strokeLinecap="round"
            filter={`url(#${id}glow)`}
          />
        </motion.g>
        <motion.circle
          cx="17.5"
          cy="6.2"
          r="1"
          fill="#fef3c7"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>
    </span>
  );
}
