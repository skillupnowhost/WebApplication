"use client";

import { useId } from "react";
import { motion } from "framer-motion";

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CompatibilityMeter({ totalPoints, maxPoints, verdict }: { totalPoints: number; maxPoints: number; verdict: string }) {
  const uid = useId().replace(/[:]/g, "");
  const fraction = totalPoints / maxPoints;
  const starsOutOf10 = Math.round(fraction * 10 * 10) / 10;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id={`meter-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="12" />
          <motion.circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke={`url(#meter-grad-${uid})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - fraction) }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="celestial-glow-text text-3xl font-bold">
            {totalPoints}/{maxPoints}
          </span>
          <span className="text-xs text-muted">{starsOutOf10} / 10 stars</span>
        </div>
      </div>
      <span className="rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-semibold text-amber-700">{verdict}</span>
    </div>
  );
}
