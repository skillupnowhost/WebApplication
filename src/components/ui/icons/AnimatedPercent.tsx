"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Percent glyph — the two circles pulse in sequence while the slash gleams. */
export function AnimatedPercent({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "pc" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <motion.path
          d="M19 5 5 19"
          stroke={`url(#${id}g)`}
          strokeWidth="2.1"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.circle
          cx="7.5"
          cy="6.5"
          r="2.5"
          fill={`url(#${id}g)`}
          style={{ transformOrigin: "7.5px 6.5px" }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="16.5"
          cy="17.5"
          r="2.5"
          fill={`url(#${id}g)`}
          style={{ transformOrigin: "16.5px 17.5px" }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
        />
      </svg>
    </span>
  );
}
