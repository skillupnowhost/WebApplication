"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Padlock — shackle lifts and clicks shut; keyhole pulses with a soft glow ring. */
export function AnimatedLock({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "lk" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a89dff" />
            <stop offset="100%" stopColor="#6c4dff" />
          </linearGradient>
          <linearGradient id={`${id}sh`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9c4ff" />
            <stop offset="100%" stopColor="#8874ff" />
          </linearGradient>
        </defs>

        {/* Glow ring */}
        <motion.rect
          x="4.4"
          y="9.6"
          width="15.2"
          height="11"
          rx="3"
          fill="none"
          stroke="#8874ff"
          strokeWidth="1"
          style={{ transformOrigin: "12px 15px" }}
          animate={{ scale: [1, 1.18, 1.3], opacity: [0.5, 0.2, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Shackle — lifts open, then clicks shut */}
        <motion.path
          d="M8 10V7.2a4 4 0 0 1 8 0V10"
          stroke={`url(#${id}sh)`}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={{ y: [0, -1.6, -1.6, 0], rotate: [0, 0, 0, 0] }}
          transition={{ duration: 2.6, times: [0, 0.3, 0.6, 0.78], repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Body — settles with a tiny squash when the shackle clicks in */}
        <motion.g
          style={{ transformOrigin: "12px 15px" }}
          animate={{ scale: [1, 1, 1.06, 1] }}
          transition={{ duration: 2.6, times: [0, 0.72, 0.82, 1], repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="4.4" y="9.6" width="15.2" height="11" rx="3" fill={`url(#${id}g)`} />
          {/* Keyhole pulses */}
          <motion.g
            style={{ transformOrigin: "12px 14.6px" }}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="12" cy="14.2" r="1.7" fill="#f2f1ff" />
            <rect x="11.2" y="15" width="1.6" height="3" rx="0.8" fill="#f2f1ff" />
          </motion.g>
        </motion.g>

        {/* Sparkle */}
        <motion.path
          d="M19.6 6.2l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5Z"
          fill="#22d3ee"
          style={{ transformOrigin: "19.6px 7.9px" }}
          animate={{ scale: [0, 1, 0], rotate: [0, 90, 180] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
      </svg>
    </span>
  );
}
