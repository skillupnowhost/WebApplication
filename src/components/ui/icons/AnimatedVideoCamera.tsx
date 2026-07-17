"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Video camera — lens glints and the live dot pulses, for join/live-class actions. */
export function AnimatedVideoCamera({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "vc" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>

        <rect x="2.4" y="6.6" width="13.6" height="10.8" rx="2.6" fill={`url(#${id}g)`} />

        <motion.path
          d="M17.6 10.4l3.4-2.2c.6-.4 1.4 0 1.4.8v6c0 .8-.8 1.2-1.4.8l-3.4-2.2z"
          fill={`url(#${id}g)`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.circle
          cx="9.2"
          cy="12"
          r="1.15"
          fill="#e0e7ff"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.circle
          cx="20.2"
          cy="5.4"
          r="1.6"
          fill="#ef4444"
          animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
