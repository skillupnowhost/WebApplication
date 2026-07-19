"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Aries — ram's horns, glyph glow breathes while a starlight mote twinkles above. */
export function AnimatedAries({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "zar" + useId().replace(/[^a-zA-Z0-9]/g, "");
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
        <motion.path
          d="M12 20V11M12 11c0-3-2-5-4.5-5C5.5 6 4 7.5 4 9.5M12 11c0-3 2-5 4.5-5C18.5 6 20 7.5 20 9.5"
          stroke={`url(#${id}g)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}glow)`}
          style={{ transformOrigin: "12px 12px" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="19.5"
          cy="5.5"
          r="1"
          fill="#fef3c7"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>
    </span>
  );
}
