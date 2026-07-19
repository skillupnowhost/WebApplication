"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Om symbol in gold gradient with a gentle glow pulse — remedies / spiritual content. */
export function AnimatedOm({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "om" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id={`${id}glow`}>
            <feGaussianBlur stdDeviation="0.7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.g
          style={{ transformOrigin: "12px 12px" }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M5 13.5c0-2.4 1.9-3.9 4-3.9 2.4 0 3.4 1.7 3.3 3.4-.1 1.7-1.4 2.8-2.8 2.5M11 15.2c0-2.7 2.1-4.6 4.6-4.6 2.9 0 4.9 2.3 4.9 5s-2 5-4.6 5-4.3-2-4-4.3M14.5 4.4c1.8.9 2.3 2.9 1.2 4.3-1 1.3-2.9 1.5-4.2.5"
            stroke={`url(#${id}g)`}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${id}glow)`}
          />
          <path
            d="M17.3 5.6c1.3.4 1.9 1.6 1.5 2.7"
            stroke={`url(#${id}g)`}
            strokeWidth="1.4"
            strokeLinecap="round"
            filter={`url(#${id}glow)`}
          />
        </motion.g>
        <motion.circle
          cx="19.4"
          cy="3.6"
          r="1"
          fill="#fef3c7"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
