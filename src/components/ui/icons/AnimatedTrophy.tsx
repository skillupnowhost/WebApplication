"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Trophy — cup gleams and rocks gently, star pops above, confetti sparks loop. */
export function AnimatedTrophy({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "tp" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}cup`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id={`${id}base`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        <motion.g
          style={{ transformOrigin: "12px 21px" }}
          animate={{ rotate: [0, -2.5, 0, 2.5, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Handles */}
          <path
            d="M6.4 6.2H3.6c0 3.1 1.4 5 3.4 5.6M17.6 6.2h2.8c0 3.1-1.4 5-3.4 5.6"
            stroke={`url(#${id}base)`}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cup */}
          <path
            d="M6.4 4.4h11.2v4.2c0 3.4-2.4 5.9-5.6 5.9s-5.6-2.5-5.6-5.9Z"
            fill={`url(#${id}cup)`}
          />
          {/* Gleam sweeping across the cup */}
          <motion.rect
            x="7.6"
            y="4.9"
            width="1.7"
            height="8.2"
            rx="0.85"
            fill="#fffbeb"
            opacity="0.75"
            animate={{ x: [0, 7.2, 0], opacity: [0, 0.85, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Stem + base */}
          <path d="M10.9 14.4h2.2v2.6h-2.2Z" fill={`url(#${id}base)`} />
          <path d="M7.9 20.6c0-2 1.8-3.6 4.1-3.6s4.1 1.6 4.1 3.6Z" fill={`url(#${id}base)`} />
        </motion.g>

        {/* Star popping above the cup */}
        <motion.path
          d="M12 -0.4 12.6 1.2 14.2 1.8 12.6 2.4 12 4 11.4 2.4 9.8 1.8 11.4 1.2Z"
          fill="#fde68a"
          style={{ transformOrigin: "12px 1.8px" }}
          animate={{ scale: [0.4, 1.15, 0.4], opacity: [0, 1, 0], rotate: [0, 40, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Confetti sparks */}
        <motion.circle
          cx="4.2"
          cy="3.4"
          r="0.9"
          fill="#fbbf24"
          animate={{ y: [2, -2.5], x: [0, -1.2], opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        />
        <motion.circle
          cx="20.2"
          cy="3"
          r="0.75"
          fill="#f59e0b"
          animate={{ y: [2, -2.2], x: [0, 1.3], opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
        />
      </svg>
    </span>
  );
}
