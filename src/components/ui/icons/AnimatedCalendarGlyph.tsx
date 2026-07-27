"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export function AnimatedCalendarGlyph({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "cg" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path
          d="M7 2.5v2.2M17 2.5v2.2M3.5 8.6h17M5.3 4.7h13.4a1.8 1.8 0 0 1 1.8 1.8v13a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8v-13a1.8 1.8 0 0 1 1.8-1.8Z"
          stroke={`url(#${id}g)`}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.circle
          cx="12"
          cy="14.5"
          r="1.7"
          fill={`url(#${id}g)`}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 1, 0.85] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
