"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export function AnimatedCameraCapture({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "cm" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}body`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8874ff" />
            <stop offset="100%" stopColor="#4726c4" />
          </linearGradient>
          <linearGradient id={`${id}lens`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        <path d="M8.4 6.4 9.3 4.8a1.4 1.4 0 0 1 1.2-.7h3a1.4 1.4 0 0 1 1.2.7l.9 1.6h2.2A2.2 2.2 0 0 1 20 8.6v8.2A2.2 2.2 0 0 1 17.8 19H6.2A2.2 2.2 0 0 1 4 16.8V8.6a2.2 2.2 0 0 1 2.2-2.2h2.2Z" fill={`url(#${id}body)`} />
        <circle cx="12" cy="12.6" r="3.5" fill={`url(#${id}lens)`} />
        <circle cx="12" cy="12.6" r="1.5" fill="#0e293a" />
        <motion.circle
          cx="12"
          cy="12.6"
          r="4.4"
          stroke="#f0fdff"
          strokeWidth="1"
          fill="none"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.25, 1.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        <circle cx="16.4" cy="9" r="0.8" fill="#f0fdff" opacity="0.9" />
      </svg>
    </span>
  );
}
