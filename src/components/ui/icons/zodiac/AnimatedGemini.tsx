"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Gemini — the twin pillars, each column glinting in staggered sequence. */
export function AnimatedGemini({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zge" + useId().replace(/[^a-zA-Z0-9]/g, "");
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
          d="M6 5h12M6 19h12"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
        />
        <motion.path
          d="M9 5v14"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M15 5v14"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="19.5"
          cy="12"
          r="1"
          fill="#fef3c7"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
      </svg>
    </span>
  );
}
