"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export function AnimatedRetake({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "rt" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a89dff" />
            <stop offset="100%" stopColor="#5934f0" />
          </linearGradient>
        </defs>
        <motion.g
          style={{ transformOrigin: "12px 12px" }}
          animate={{ rotate: [0, -300, -360] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.75, 1] }}
        >
          <path
            d="M18.4 12a6.4 6.4 0 1 1-2-4.65"
            stroke={`url(#${id}g)`}
            strokeWidth="1.9"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M16.6 4.8 16.9 8.1 13.6 7.5Z" fill={`url(#${id}g)`} />
        </motion.g>
      </svg>
    </span>
  );
}
