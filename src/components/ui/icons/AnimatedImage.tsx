"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Picture frame — sun glows and the mountain skyline breathes in a loop. */
export function AnimatedImage({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "im" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}frame`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={`${id}hill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        <rect x="2.4" y="3.6" width="19.2" height="16.8" rx="3" fill={`url(#${id}frame)`} opacity="0.18" />
        <rect x="2.4" y="3.6" width="19.2" height="16.8" rx="3" stroke={`url(#${id}frame)`} strokeWidth="1.4" />

        <motion.circle
          cx="16.4"
          cy="8.6"
          r="2.1"
          fill="#fbbf24"
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.path
          d="M2.4 17.4 7.6 11l3.4 3.8 2.6-2.6 7.6 5.2v2.4a3 3 0 0 1-3 3H5.4a3 3 0 0 1-3-3Z"
          fill={`url(#${id}hill)`}
          animate={{ y: [0.4, -0.4, 0.4] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
