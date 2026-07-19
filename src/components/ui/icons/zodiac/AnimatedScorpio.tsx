"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Scorpio — the barbed tail, sting glinting at the tip in a slow strike loop. */
export function AnimatedScorpio({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zsc" + useId().replace(/[^a-zA-Z0-9]/g, "");
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
          d="M4 7v9M4 7c0-2 3-2 3 0v9M7 7c0-2 3-2 3 0v9c0 2 2 3 3.6 3.6"
          stroke={`url(#${id}g)`}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}glow)`}
        />
        <motion.path
          d="M13.6 19.6 17 21l-.6-2.4"
          stroke={`url(#${id}g)`}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}glow)`}
          style={{ transformOrigin: "17px 21px" }}
          animate={{ rotate: [0, -14, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
