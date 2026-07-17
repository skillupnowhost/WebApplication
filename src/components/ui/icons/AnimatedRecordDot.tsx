"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Pulsing "recording" indicator dot with an expanding ring, for live-recording status. */
export function AnimatedRecordDot({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "rd" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <radialGradient id={`${id}g`}>
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#dc2626" />
          </radialGradient>
        </defs>

        <motion.circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.4"
          animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />

        <motion.circle
          cx="12"
          cy="12"
          r="5.4"
          fill={`url(#${id}g)`}
          animate={{ scale: [1, 1.12, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
