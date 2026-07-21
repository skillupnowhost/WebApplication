"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export function AnimatedUploadCloud({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "up" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}cloud`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id={`${id}arrow`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path
          d="M6.8 17.6a4 4 0 0 1-.4-7.98 5.2 5.2 0 0 1 10.1-1.9 3.8 3.8 0 0 1-.6 9.88H6.8Z"
          fill={`url(#${id}cloud)`}
        />
        <motion.g
          animate={{ y: [2, -2.5, 2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M12 8.4v6.4"
            stroke={`url(#${id}arrow)`}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            d="M9.1 11.1 12 8.2l2.9 2.9"
            stroke={`url(#${id}arrow)`}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      </svg>
    </span>
  );
}
