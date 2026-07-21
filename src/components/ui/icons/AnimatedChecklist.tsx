"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Checklist / syllabus glyph — each row's check draws in turn, looping. */
export function AnimatedChecklist({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "cl" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const rows = [6.2, 12, 17.8];
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#6c4dff" />
          </linearGradient>
        </defs>
        <rect x="3" y="3.5" width="18" height="17" rx="3.2" stroke={`url(#${id}g)`} strokeWidth="1.6" opacity="0.35" />
        {rows.map((y, i) => (
          <g key={y}>
            <motion.path
              d={`M6.4 ${y} l1.7 1.7 3.1-3.3`}
              stroke={`url(#${id}g)`}
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{
                duration: 3.6,
                times: [0, 0.22, 0.85, 1],
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
            <motion.line
              x1="13"
              y1={y}
              x2="19.2"
              y2={y}
              stroke={`url(#${id}g)`}
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.35, 0.9, 0.9, 0.35] }}
              transition={{
                duration: 3.6,
                times: [0, 0.22, 0.85, 1],
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          </g>
        ))}
      </svg>
    </span>
  );
}
