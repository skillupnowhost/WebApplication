"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Sagittarius — the archer's arrow, drawing back and releasing in a loop. */
export function AnimatedSagittarius({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zsg" + useId().replace(/[^a-zA-Z0-9]/g, "");
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
          d="M9.5 15.5 5.5 19.5"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
        />
        <motion.path
          d="M6 18 18 6M13 6h5v5"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}glow)`}
          style={{ transformOrigin: "18px 6px" }}
          animate={{ x: [-1.4, 0.6, -1.4], y: [1.4, -0.6, 1.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
