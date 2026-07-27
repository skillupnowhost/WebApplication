"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Small symmetric kolam (dot-grid rangoli) motif in gold gradient with a slow shimmer loop — purely decorative page ornament, not a data section. */
export function AnimatedKolam({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "kl" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const dots = [
    [16, 4], [24, 4], [32, 4],
    [8, 16], [16, 16], [24, 16], [32, 16], [40, 16],
    [8, 32], [16, 32], [24, 32], [32, 32], [40, 32],
    [16, 44], [24, 44], [32, 44],
  ];
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#b47f1a" />
          </linearGradient>
        </defs>
        <motion.g
          style={{ transformOrigin: "24px 24px" }}
          animate={{ opacity: [0.55, 0.95, 0.55] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M24 4c8 4 16 8 16 20s-8 16-16 20c-8-4-16-8-16-20S16 8 24 4Z"
            stroke={`url(#${id}g)`}
            strokeWidth="1"
            opacity="0.5"
          />
          <path d="M8 16c8-4 24-4 32 0M8 32c8 4 24 4 32 0M16 4c-4 8-4 32 0 40M32 4c4 8 4 32 0 40" stroke={`url(#${id}g)`} strokeWidth="1" opacity="0.5" />
          {dots.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.6" fill={`url(#${id}g)`} />
          ))}
          <circle cx="24" cy="24" r="3" fill={`url(#${id}g)`} />
        </motion.g>
      </svg>
    </span>
  );
}
