"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export function AnimatedHeart({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "ht" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <motion.span
        className="inline-flex h-full w-full"
        style={{ transformOrigin: "50% 55%" }}
        animate={{ scale: [1, 1.12, 1, 1.06, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.22, 0.4, 0.6, 1] }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <defs>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="55%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
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
            d="M12 20.6c-.28 0-.55-.1-.77-.28C6.4 16.4 3 13.2 3 9.4 3 6.7 5.1 4.6 7.75 4.6c1.55 0 3.02.75 3.9 1.98a.44.44 0 0 0 .7 0 4.76 4.76 0 0 1 3.9-1.98C18.9 4.6 21 6.7 21 9.4c0 3.8-3.4 7-8.23 10.92-.22.18-.5.28-.77.28Z"
            fill={`url(#${id}g)`}
            filter={`url(#${id}glow)`}
          />
        </svg>
      </motion.span>
    </span>
  );
}
