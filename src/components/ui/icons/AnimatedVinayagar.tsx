"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Simplified Vinayagar (Ganesha) glyph in gold gradient with a gentle glow pulse — auspicious header mark for horoscope documents. */
export function AnimatedVinayagar({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "vg" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <filter id={`${id}glow`}>
            <feGaussianBlur stdDeviation="0.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.g
          style={{ transformOrigin: "12px 13px" }}
          animate={{ scale: [1, 1.035, 1], opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* crown */}
          <path d="M12 2.4c.9 0 1.6.6 1.6 1.4S12.9 5.2 12 5.2s-1.6-.6-1.6-1.4S11.1 2.4 12 2.4Z" fill={`url(#${id}g)`} />
          {/* ears */}
          <path d="M5.3 9.4c-1.7-.2-3 1-3 2.6 0 1.7 1.4 2.9 3 2.7 1.1-.1 1.9-1 2.1-2.1" stroke={`url(#${id}g)`} strokeWidth="1.5" strokeLinecap="round" filter={`url(#${id}glow)`} />
          <path d="M18.7 9.4c1.7-.2 3 1 3 2.6 0 1.7-1.4 2.9-3 2.7-1.1-.1-1.9-1-2.1-2.1" stroke={`url(#${id}g)`} strokeWidth="1.5" strokeLinecap="round" filter={`url(#${id}glow)`} />
          {/* head */}
          <path
            d="M8.6 15.4c-1.3-1.1-2.1-2.6-2.1-4.4 0-3.4 2.5-5.6 5.5-5.6s5.5 2.2 5.5 5.6c0 1.9-.9 3.5-2.3 4.6"
            stroke={`url(#${id}g)`}
            strokeWidth="1.6"
            strokeLinecap="round"
            filter={`url(#${id}glow)`}
          />
          {/* eyes */}
          <circle cx="10.2" cy="10.6" r="0.8" fill={`url(#${id}g)`} />
          <circle cx="13.8" cy="10.6" r="0.8" fill={`url(#${id}g)`} />
        </motion.g>
        {/* trunk, swaying independently */}
        <motion.path
          d="M11.8 14.8c-.3 1.6-1.5 2.2-1.3 3.6.15 1 1.1 1.5 2 1.1"
          stroke={`url(#${id}g)`}
          strokeWidth="1.6"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
          style={{ transformOrigin: "11.8px 14.8px" }}
          animate={{ rotate: [-3, 4, -3] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="19.6"
          cy="4.2"
          r="0.9"
          fill="#fef3c7"
          animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
