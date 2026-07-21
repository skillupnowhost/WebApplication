"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Facebook glyph — gradient badge breathes slowly, matching AnimatedInstagram's loop. */
export function AnimatedFacebook({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "fb" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>
        <motion.rect
          x="2.6"
          y="2.6"
          width="18.8"
          height="18.8"
          rx="5.4"
          fill={`url(#${id}g)`}
          style={{ transformOrigin: "12px 12px" }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <path
          d="M13.6 21v-7.05h2.37l.35-2.75h-2.72V9.44c0-.8.22-1.34 1.36-1.34h1.46V5.66c-.25-.03-1.1-.11-2.1-.11-2.08 0-3.5 1.27-3.5 3.6v2.01H8.4v2.75h2.42V21Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}
