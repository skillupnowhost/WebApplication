"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Instagram glyph — gradient badge breathes slowly, lens glints on a loop. */
export function AnimatedInstagram({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "ig" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="45%" stopColor="#e1306c" />
            <stop offset="100%" stopColor="#833ab4" />
          </linearGradient>
        </defs>
        <motion.rect
          x="2.6"
          y="2.6"
          width="18.8"
          height="18.8"
          rx="5.4"
          fill={`url(#${id}g)`}
          style={{ transformOrigin: "12px 12px" }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="12" cy="12" r="4.1" stroke="#fff" strokeWidth="1.9" />
        <motion.circle
          cx="17.25"
          cy="6.75"
          r="1.25"
          fill="#fff"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
