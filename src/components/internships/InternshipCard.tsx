"use client";

import Link from "next/link";
import { useId, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedCrown } from "@/components/ui/icons/AnimatedCrown";
import { AnimatedMapPin } from "@/components/ui/icons/AnimatedMapPin";
import { AnimatedClock } from "@/components/ui/icons/AnimatedClock";
import { AnimatedRupee } from "@/components/ui/icons/AnimatedRupee";
import { AnimatedSuccess } from "@/components/ui/icons/AnimatedSuccess";
import { AnimatedFlame } from "@/components/ui/icons/AnimatedFlame";
import { useTiltSpotlight } from "@/hooks/useTiltSpotlight";

export type InternshipCardData = {
  id: string;
  title: string;
  slug: string;
  company: string;
  type: string;
  paid: boolean;
  stipend: number | null;
  location: string;
  durationWeeks: number;
  applyDeadline: string;
  featured: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/* Monogram tile gradients — picked deterministically per company name.
   Three stops (not two) so `.bg-size-200`'s slow gradient-shift animation
   has somewhere to travel, plus a matching glow tint for the drop shadow. */
const MONOGRAMS = [
  { gradient: "linear-gradient(135deg,#7c3aed,#a855f7 55%,#c084fc)", glow: "rgba(124,58,237,0.38)" },
  { gradient: "linear-gradient(135deg,#0ea5e9,#38bdf8 55%,#67e8f9)", glow: "rgba(14,165,233,0.38)" },
  { gradient: "linear-gradient(135deg,#059669,#10b981 55%,#6ee7b7)", glow: "rgba(5,150,105,0.38)" },
  { gradient: "linear-gradient(135deg,#e11d48,#f43f5e 55%,#fb923c)", glow: "rgba(225,29,72,0.38)" },
  { gradient: "linear-gradient(135deg,#4f46e5,#6366f1 55%,#a5b4fc)", glow: "rgba(79,70,229,0.38)" },
  { gradient: "linear-gradient(135deg,#d97706,#f59e0b 55%,#fde047)", glow: "rgba(217,119,6,0.38)" },
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* Two-letter monogram (first letter of the first two words) reads as a much
   more intentional, branded mark than a single initial — falls back to the
   first two characters for one-word company names. */
function companyInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

/* Days remaining rendered as an animated progress ring (30-day apply window). */
function DeadlineRing({ daysLeft, closed }: { daysLeft: number; closed: boolean }) {
  const id = "dr" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const R = 17;
  const C = 2 * Math.PI * R;
  const frac = closed ? 0 : Math.min(1, daysLeft / 30);
  const urgent = !closed && daysLeft <= 5;

  return (
    <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center" title={closed ? "Applications closed" : `${daysLeft} days left to apply`}>
      <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={urgent ? "#f59e0b" : "var(--brand-400)"} />
            <stop offset="100%" stopColor={urgent ? "#ef4444" : "var(--accent-400)"} />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r={R} fill="none" stroke="var(--border-soft)" strokeWidth="3" />
        <motion.circle
          cx="20"
          cy="20"
          r={R}
          fill="none"
          stroke={`url(#${id}g)`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * (1 - frac) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className={`text-[13px] font-bold tabular-nums ${urgent ? "text-warning" : "text-foreground"}`}>
          {closed ? "—" : daysLeft}
        </span>
        {!closed && <span className="text-[7px] font-bold uppercase tracking-wide text-muted">days</span>}
      </span>
    </span>
  );
}

export function InternshipCard({
  internship,
  applied,
  index = 0,
}: {
  internship: InternshipCardData;
  applied: boolean;
  index?: number;
}) {
  const deadline = new Date(internship.applyDeadline);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const closed = daysLeft === 0;
  const urgent = daysLeft > 0 && daysLeft <= 5;
  const { rotateX, rotateY, spotlightBg, onMouseMove, onMouseLeave } = useTiltSpotlight();
  const monogram = MONOGRAMS[hashString(internship.company) % MONOGRAMS.length];
  const initials = companyInitials(internship.company);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
      className="h-full"
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY }}
        className="group h-full"
      >
        <Link href={`/internships/${internship.slug}`} className="block h-full">
          <div
            className={`card-shine relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-lift)] ${
              internship.featured
                ? "border-brand-300/70 dark:border-brand-700/70"
                : "border-border-soft"
            }`}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: spotlightBg }}
            />

            {/* Featured wash */}
            {internship.featured && (
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-60"
                style={{
                  background:
                    "radial-gradient(120% 100% at 50% 0%, color-mix(in srgb, var(--brand-400) 16%, transparent) 0%, transparent 70%)",
                }}
                aria-hidden
              />
            )}

            <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
              {/* Header: monogram + company/location + deadline ring */}
              <div className="flex items-start gap-3.5">
                <span
                  className="bg-size-200 relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-base font-bold tracking-tight text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={
                    {
                      background: monogram.gradient,
                      boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.2), 0 8px 18px -6px ${monogram.glow}`,
                    } as CSSProperties
                  }
                >
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(120% 120% at 22% 14%, rgba(255,255,255,0.55), transparent 58%)" }}
                    aria-hidden
                  />
                  <span className="relative">{initials}</span>
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="truncate text-sm font-semibold text-foreground/90">{internship.company}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                    <AnimatedMapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{internship.location}</span>
                  </p>
                </div>
                <DeadlineRing daysLeft={daysLeft} closed={closed} />
              </div>

              {/* Role title */}
              <h3 className="mt-4 text-[1.05rem] font-semibold leading-snug transition-colors duration-300 group-hover:text-brand-500 sm:text-lg">
                {internship.title}
              </h3>

              {/* Meta chips */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground/80">
                  <ContentIcon keyword={`${internship.type} ${internship.title}`} className="h-4 w-4" />
                  {internship.type}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground/80">
                  <AnimatedClock className="h-4 w-4" />
                  {internship.durationWeeks} weeks
                </span>
                {internship.featured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 dark:border-brand-800 dark:bg-brand-900/40 dark:text-brand-300">
                    <AnimatedCrown className="h-4 w-4" />
                    Featured
                  </span>
                )}
              </div>

              <div className="flex-1" />

              {/* Stipend band */}
              <div
                className={`mt-5 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                  internship.paid
                    ? "border-success/25 bg-success/8"
                    : "border-border-soft bg-surface-2/60"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <AnimatedRupee className="h-6 w-6 shrink-0" />
                  <div className="min-w-0 leading-tight">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Stipend</p>
                    <p className={`truncate text-sm font-bold ${internship.paid ? "text-success" : "text-foreground/80"}`}>
                      {internship.paid
                        ? `₹${internship.stipend?.toLocaleString("en-IN")}/mo`
                        : "Unpaid · Certificate"}
                    </p>
                  </div>
                </div>
                {/* Circular CTA */}
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${
                    closed
                      ? "bg-surface-2 text-muted"
                      : "brand-gradient-bg text-white shadow-[var(--shadow-soft)] group-hover:shadow-[var(--shadow-lift)]"
                  }`}
                  aria-hidden
                >
                  <AnimatedArrow className="h-5 w-5" />
                </span>
              </div>

              {/* Status row */}
              <div className="mt-3 flex min-h-5 items-center justify-between gap-2 text-xs">
                {closed ? (
                  <span className="font-medium text-muted">Applications closed</span>
                ) : urgent ? (
                  <motion.span
                    className="inline-flex items-center gap-1.5 font-semibold text-warning"
                    animate={{ opacity: [1, 0.55, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <AnimatedFlame className="h-4 w-4" />
                    {daysLeft === 1 ? "Closes tomorrow" : `Only ${daysLeft} days left`}
                  </motion.span>
                ) : (
                  <span className="text-muted">
                    Apply by{" "}
                    {deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                )}
                {applied && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                    <AnimatedSuccess className="h-3.5 w-3.5" />
                    Applied
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
