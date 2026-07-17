"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export function AnimatedMoonStar({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "ms" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <motion.span
        className="inline-flex h-full w-full"
        style={{ transformOrigin: "50% 50%" }}
        animate={{ rotate: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <defs>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c9c4ff" />
              <stop offset="100%" stopColor="#6c4dff" />
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
            d="M14.8 2.6a9.6 9.6 0 1 0 6.6 12.4 7.8 7.8 0 0 1-6.6-12.4Z"
            fill={`url(#${id}g)`}
            filter={`url(#${id}glow)`}
          >
            <animate attributeName="opacity" values=".9;1;.9" dur="3.2s" repeatCount="indefinite" />
          </path>
        </svg>
      </motion.span>
      <motion.span
        className="absolute -right-0.5 -top-0.5 h-[30%] w-[30%]"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1, 0.7], rotate: [0, 15, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <path
            d="M11.525 2.295a.53.53 0 0 1 .95 0l1.1 2.23a1 1 0 0 0 .75.55l2.46.36a.53.53 0 0 1 .3.9l-1.78 1.74a1 1 0 0 0-.29.89l.42 2.45a.53.53 0 0 1-.77.56l-2.2-1.16a1 1 0 0 0-.94 0l-2.2 1.16a.53.53 0 0 1-.76-.56l.42-2.45a1 1 0 0 0-.29-.89L6.94 7.33a.53.53 0 0 1 .3-.9l2.45-.36a1 1 0 0 0 .76-.55z"
            fill="#fde68a"
          />
        </svg>
      </motion.span>
    </span>
  );
}
