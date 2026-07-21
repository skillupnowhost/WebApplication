"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Capricorn — sea-goat horns curling into a fish tail that sways gently. */
export function AnimatedCapricorn({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zcp" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id={`${id}glow`}>
            <feGaussianBlur stdDeviation="0.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M5 7l3.5 10 3.5-8"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}glow)`}
        />
        <motion.path
          d="M12 9c2-1 5.5 0 5.5 3.2 0 2.1-2 3.3-3.3 1.7"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
          style={{ transformOrigin: "14px 12px" }}
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="18.5"
          cy="17.5"
          r="1"
          fill="#fef3c7"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </svg>
    </span>
  );
}
