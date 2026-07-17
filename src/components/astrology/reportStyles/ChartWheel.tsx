"use client";

import { motion } from "framer-motion";
import type { ChartResult } from "@/lib/astrology/chart";
import { RASHIS } from "@/lib/astrology/panchanga";

const PLANET_GLYPHS: Record<string, string> = {
  Sun: "☉",
  Moon: "☾",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Rahu: "☊",
  Ketu: "☋",
};

/** A radial birth-chart wheel built from real sidereal longitudes — 0° (Aries) at the top, clockwise. */
export function ChartWheel({ chart }: { chart: ChartResult }) {
  const size = 320;
  const center = size / 2;
  const outerR = center - 12;
  const innerR = outerR - 46;
  const planetR = innerR - 24;

  function pointOn(radius: number, degrees: number) {
    const angle = (degrees - 90) * (Math.PI / 180);
    // Rounded to avoid SSR/client floating-point last-digit drift in Math.cos/sin, which causes hydration mismatches.
    return {
      x: Math.round((center + radius * Math.cos(angle)) * 100) / 100,
      y: Math.round((center + radius * Math.sin(angle)) * 100) / 100,
    };
  }

  return (
    <motion.svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto h-72 w-72 sm:h-80 sm:w-80"
      initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--brand-400)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--brand-400)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={center} cy={center} r={outerR + 10} fill="url(#wheelGlow)" />
      <circle cx={center} cy={center} r={outerR} fill="none" stroke="var(--border-soft)" strokeWidth={1.5} />
      <circle cx={center} cy={center} r={innerR} fill="none" stroke="var(--border-soft)" strokeWidth={1.5} />

      {RASHIS.map((rashi, i) => {
        const startDeg = i * 30;
        const midDeg = startDeg + 15;
        const a = pointOn(outerR, startDeg);
        const labelPos = pointOn((outerR + innerR) / 2, midDeg);
        return (
          <g key={rashi.name}>
            <line x1={center} y1={center} x2={a.x} y2={a.y} stroke="var(--border-soft)" strokeWidth={1} />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted"
              fontSize={9}
              fontWeight={600}
            >
              {rashi.english}
            </text>
          </g>
        );
      })}

      {[...chart.planets, { planet: "Asc" as const, siderealLongitude: chart.ascendant.siderealLongitude }].map(
        (p, i) => {
          const pos = pointOn(planetR, p.siderealLongitude);
          return (
            <motion.g
              key={p.planet}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 300, damping: 18 }}
            >
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={11}
                className="fill-surface stroke-[var(--brand-400)]"
                strokeWidth={1.5}
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
              />
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={11} className="fill-foreground">
                {PLANET_GLYPHS[p.planet] ?? p.planet[0]}
              </text>
            </motion.g>
          );
        }
      )}
    </motion.svg>
  );
}
