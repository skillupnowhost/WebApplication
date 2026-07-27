"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export function AnimatedClockGlyph({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "ck" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="9.2" stroke={`url(#${id}g)`} strokeWidth="1.6" />
        <motion.path
          d="M12 12V7"
          stroke={`url(#${id}g)`}
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ transformOrigin: "12px 12px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <path d="M12 12l3.2 1.6" stroke={`url(#${id}g)`} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.1" fill={`url(#${id}g)`} />
      </svg>
    </span>
  );
}
