"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const TEETH = 8;

/** Settings gear — turns slowly and continuously, with a soft pulsing center ring. */
export function AnimatedSettings({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "se" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a89dff" />
            <stop offset="100%" stopColor="#6c4dff" />
          </linearGradient>
        </defs>
        <motion.g
          style={{ transformOrigin: "12px 12px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: TEETH }, (_, i) => (
            <rect
              key={i}
              x="10.5"
              y="1.4"
              width="3"
              height="4.6"
              rx="1.1"
              fill={`url(#${id}g)`}
              transform={`rotate(${(360 / TEETH) * i} 12 12)`}
            />
          ))}
          <circle cx="12" cy="12" r="6.6" fill={`url(#${id}g)`} />
          <circle cx="12" cy="12" r="2.6" fill="#f2f1ff" />
        </motion.g>
        <motion.circle
          cx="12"
          cy="12"
          r="2.6"
          fill="none"
          stroke="#8874ff"
          strokeWidth="1"
          style={{ transformOrigin: "12px 12px" }}
          animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}
