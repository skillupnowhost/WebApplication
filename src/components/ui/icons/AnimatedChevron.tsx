"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export function AnimatedChevron({
  className,
  style,
  direction = "right",
}: {
  className?: string;
  style?: CSSProperties;
  direction?: "left" | "right";
}) {
  const id = "chv" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <motion.span
        className="inline-flex h-full w-full"
        animate={{ x: direction === "right" ? [0, 2, 0] : [0, -2, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
          <defs>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand-400)" />
              <stop offset="100%" stopColor="var(--brand-600)" />
            </linearGradient>
          </defs>
          <path
            d={direction === "right" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
            stroke={`url(#${id}g)`}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    </span>
  );
}
