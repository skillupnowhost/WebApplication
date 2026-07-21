"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Libra — the balance beam, gently tipping side to side as if weighing. */
export function AnimatedLibra({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zli" + useId().replace(/[^a-zA-Z0-9]/g, "");
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
          d="M4 19h16"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
        />
        <motion.path
          d="M6 7h6M9 7v3M4 14c0-2.8 3.6-4 8-4s8 1.2 8 4"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}glow)`}
          style={{ transformOrigin: "12px 10px" }}
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="20"
          cy="5.5"
          r="1"
          fill="#fef3c7"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
    </span>
  );
}
