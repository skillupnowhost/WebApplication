"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Catmull-Rom → cubic-bezier smoothing so the growth trace reads as a real analytics curve, not straight segments. */
function smoothPath(points: [number, number][]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const CHART_POINTS: [number, number][] = [
  [50, 235],
  [82, 250],
  [110, 210],
  [140, 225],
  [168, 175],
  [196, 195],
  [224, 140],
  [252, 155],
  [278, 95],
];
const BASELINE = 272;
const CURVE_PATH = smoothPath(CHART_POINTS);
const AREA_PATH = `${CURVE_PATH} L${CHART_POINTS[CHART_POINTS.length - 1][0]},${BASELINE} L${CHART_POINTS[0][0]},${BASELINE} Z`;
const AXIS_TICKS = [40, 80, 120, 160, 200, 240, 280];
const PULSE_NODES: { x: number; y: number; delay: number }[] = [
  { x: 140, y: 225, delay: 0 },
  { x: 224, y: 140, delay: 0.9 },
];

/** A small four-point sparkle mark drawn purely in stroke — used sparingly as mono accent detail. */
function Sparkle({ x, y, size, duration, delay, reduced }: { x: number; y: number; size: number; duration: number; delay: number; reduced: boolean }) {
  const s = size / 2;
  return (
    <motion.g
      style={{ transformOrigin: `${x}px ${y}px` }}
      animate={reduced ? { opacity: 0.5 } : { opacity: [0.15, 0.85, 0.15], rotate: [0, 14, 0] }}
      transition={reduced ? { duration: 0 } : { duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <path
        d={`M${x},${y - s} L${x},${y + s} M${x - s},${y} L${x + s},${y} M${x - s * 0.6},${y - s * 0.6} L${x + s * 0.6},${y + s * 0.6} M${x + s * 0.6},${y - s * 0.6} L${x - s * 0.6},${y + s * 0.6}`}
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
      />
    </motion.g>
  );
}

/** A small hollow satellite node joined to the central frame by a short dashed lead line. */
function SatelliteNode({ x1, y1, x2, y2, r, duration, delay, reduced }: { x1: number; y1: number; x2: number; y2: number; r: number; duration: number; delay: number; reduced: boolean }) {
  return (
    <motion.g
      animate={reduced ? { opacity: 0.6 } : { opacity: [0.25, 0.75, 0.25] }}
      transition={reduced ? { duration: 0 } : { duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="1 5" strokeLinecap="round" />
      <circle cx={x2} cy={y2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth={1.25} />
    </motion.g>
  );
}

/** A short vertical "signal" tick that rises and fades from a data node — reads as a live pulse of activity. */
function DataPulse({ x, y, delay, reduced }: { x: number; y: number; delay: number; reduced: boolean }) {
  if (reduced) return <line x1={x} y1={y} x2={x} y2={y - 16} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.25} strokeLinecap="round" />;
  return (
    <motion.line
      x1={x}
      y1={y}
      x2={x}
      strokeLinecap="round"
      stroke="currentColor"
      strokeWidth={1.25}
      initial={{ y2: y, opacity: 0.6 }}
      animate={{ y2: [y, y - 34], opacity: [0.6, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay }}
    />
  );
}

/**
 * Left-side hero illustration for the About page: a single monochrome line-art
 * scene — orbit rings framing a hand-smoothed, animated growth curve with a
 * filled gradient area, traveling highlight, live signal pulses and sparkle
 * accents, all in one brand hue. Purely decorative and clipped inside an
 * overflow-hidden, padded stage so the rotating strokes never widen
 * scrollWidth or affect the fixed bottom nav on mobile.
 */
export function HeroMotionGraphics() {
  const reduced = Boolean(useReducedMotion());
  const uid = useId();
  const [peakX, peakY] = CHART_POINTS[CHART_POINTS.length - 1];

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-[2rem] border border-border-soft bg-surface/60 p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:aspect-square lg:aspect-[4/5]">
      {/* Faint mono blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] text-brand-500 dark:text-brand-400"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent_35%,var(--surface)_92%)]" aria-hidden />

      <svg viewBox="0 0 340 340" className="relative h-full w-full text-brand-500 dark:text-brand-400" fill="none" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.32} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Orbit rings */}
        <motion.g
          style={{ transformOrigin: "170px 170px" }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={reduced ? { duration: 0 } : { duration: 26, repeat: Infinity, ease: "linear" }}
        >
          <ellipse cx={170} cy={170} rx={150} ry={90} transform="rotate(-18 170 170)" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="1 7" strokeLinecap="round" />
          <circle cx={312} cy={124} r={3.5} fill="currentColor" />
        </motion.g>

        <motion.g
          style={{ transformOrigin: "170px 170px" }}
          animate={reduced ? undefined : { rotate: -360 }}
          transition={reduced ? { duration: 0 } : { duration: 19, repeat: Infinity, ease: "linear" }}
        >
          <circle cx={170} cy={170} r={100} stroke="currentColor" strokeOpacity={0.14} strokeWidth={1} strokeDasharray="1 6" />
          <circle cx={170} cy={70} r={3} fill="currentColor" opacity={0.85} />
        </motion.g>

        {/* Baseline with a marching-dash scan */}
        <motion.line
          x1={34}
          y1={BASELINE}
          x2={300}
          y2={BASELINE}
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={1}
          strokeDasharray="2 6"
          initial={{ strokeDashoffset: 0 }}
          animate={reduced ? undefined : { strokeDashoffset: [0, -16] }}
          transition={reduced ? { duration: 0 } : { duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        {AXIS_TICKS.map((x) => (
          <line key={x} x1={x} y1={BASELINE - 4} x2={x} y2={BASELINE + 4} stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
        ))}

        {/* Data pulses rising from mid-curve nodes */}
        {PULSE_NODES.map((n) => (
          <DataPulse key={`${n.x}-${n.y}`} x={n.x} y={n.y} delay={n.delay} reduced={reduced} />
        ))}

        {/* Realistic growth curve with soft gradient fill */}
        <motion.path
          d={AREA_PATH}
          fill={`url(#${uid}-area)`}
          stroke="none"
          animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={reduced ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <path d={CURVE_PATH} stroke="currentColor" strokeOpacity={0.7} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        {[CHART_POINTS[0], CHART_POINTS[3], CHART_POINTS[6]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.8} fill="currentColor" fillOpacity={0.7} />
        ))}

        {/* Glowing "current" marker at the peak */}
        <motion.circle
          cx={peakX}
          cy={peakY}
          fill="currentColor"
          style={{ filter: "blur(6px)" }}
          initial={{ r: 16, opacity: 0.2 }}
          animate={reduced ? { r: 16, opacity: 0.2 } : { r: [13, 19, 13], opacity: [0.14, 0.32, 0.14] }}
          transition={reduced ? { duration: 0 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx={peakX} cy={peakY} r={4} fill="currentColor" />

        <motion.circle
          r={4}
          fill="currentColor"
          style={{ offsetPath: `path("${CURVE_PATH}")` }}
          animate={reduced ? undefined : { offsetDistance: ["0%", "100%"] }}
          transition={reduced ? { duration: 0 } : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Satellite nodes */}
        <SatelliteNode x1={252} y1={82} x2={296} y2={54} r={5} duration={4.2} delay={0.3} reduced={reduced} />
        <SatelliteNode x1={92} y1={258} x2={50} y2={288} r={4} duration={3.8} delay={0.9} reduced={reduced} />

        {/* Sparkle accents */}
        <Sparkle x={54} y={70} size={12} duration={4} delay={0.2} reduced={reduced} />
        <Sparkle x={290} y={230} size={10} duration={3.4} delay={1.1} reduced={reduced} />
        <Sparkle x={100} y={295} size={9} duration={3.8} delay={0.6} reduced={reduced} />
      </svg>
    </div>
  );
}
