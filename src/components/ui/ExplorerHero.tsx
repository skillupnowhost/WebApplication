"use client";

import { motion } from "framer-motion";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { StatCounter } from "@/components/ui/StatCounter";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";

const EASE = [0.16, 1, 0.3, 1] as const;

type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

export type HeroChip = { icon: IconComponent; text: string };
export type HeroStat = { icon: IconComponent; label: string; value: number };

/**
 * Shared light hero for the explorer pages (internships, projects) —
 * an open, airy composition (no boxed panel): centered headline with an
 * animated gradient underline over a soft clipped aurora backdrop, a
 * wrap-based "bento" showcase strip (gradient headline-number tile +
 * glass stat tiles + trust tile), and a glass marquee rail below.
 *
 * Responsive rules this component must keep:
 * - fluid sizing only (clamp / flex-wrap / min-w with min(100%, …)) —
 *   the showcase strip wraps tile-by-tile so it can never leave holes
 *   or overflow at any viewport width;
 * - every decorative element lives inside the overflow-hidden backdrop
 *   layer so nothing can widen the document and break fixed bars on
 *   mobile;
 * - entrances use `animate` (not whileInView) with short delays so the
 *   hero is never blank while reveals wait to trigger.
 */
export function ExplorerHero({
  eyebrowIcon: EyebrowIcon,
  eyebrowText,
  titleLead,
  titleGradient,
  description,
  chips,
  ctaHref,
  ctaLabel,
  ctaNote,
  heroIcon: HeroIcon,
  heroValue,
  heroLabel,
  cluster,
  clusterLabel,
  stats,
  marqueeLabel,
  marqueeItems,
}: {
  eyebrowIcon: IconComponent;
  eyebrowText: string;
  titleLead: string;
  titleGradient: string;
  description: string;
  chips: HeroChip[];
  ctaHref: string;
  ctaLabel: string;
  ctaNote: string;
  heroIcon: IconComponent;
  heroValue: number;
  heroLabel: string;
  cluster: ReactNode[];
  clusterLabel: string;
  stats: HeroStat[];
  marqueeLabel?: string;
  marqueeItems?: ReactNode[];
}) {
  return (
    <div className="relative">
      {/* ── Clipped aurora backdrop — all decoration lives in here ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
        aria-hidden
      >
        <div className="hero-grid-light absolute inset-x-0 top-0 h-[34rem]" />
        <span
          className="absolute -top-24 left-1/2 h-72 w-[min(80%,42rem)] -translate-x-1/2 rounded-full bg-brand-300/25 blur-3xl"
          style={{ animation: "pulse-glow 5s ease-in-out infinite" }}
        />
        <span
          className="absolute top-24 left-[6%] h-48 w-[min(38%,18rem)] rounded-full bg-accent-400/15 blur-3xl"
          style={{ animation: "pulse-glow 6.5s ease-in-out infinite 1s" }}
        />
        <span
          className="absolute top-16 right-[4%] h-52 w-[min(40%,20rem)] rounded-full bg-fuchsia-400/12 blur-3xl"
          style={{ animation: "pulse-glow 7s ease-in-out infinite 2s" }}
        />

        {/* Floating glass icon tiles at the headline's shoulders (lg+) */}
        {chips.slice(0, 2).map((c, i) => (
          <motion.span
            key={c.text}
            className="glass-panel absolute hidden h-13 w-13 items-center justify-center rounded-2xl lg:flex"
            style={[{ left: "6%", top: "22%" }, { right: "6%", top: "16%" }][i]}
            animate={{ y: [0, i % 2 ? 12 : -12, 0], rotate: [0, i % 2 ? -5 : 5, 0] }}
            transition={{ duration: 5.5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          >
            <c.icon className="h-6.5 w-6.5" />
          </motion.span>
        ))}
        <motion.span
          className="glass-panel absolute right-[13%] top-[46%] hidden h-10 w-10 items-center justify-center rounded-xl lg:flex"
          animate={{ y: [0, 9, 0], rotate: [0, 7, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        >
          <AnimatedSparkle className="h-5 w-5" />
        </motion.span>
        <motion.span
          className="glass-panel absolute left-[11%] top-[52%] hidden h-11 w-11 items-center justify-center rounded-xl lg:flex"
          animate={{ y: [0, -9, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <EyebrowIcon className="h-5.5 w-5.5" />
        </motion.span>
      </div>

      {/* ── Headline block ── */}
      <div className="relative flex flex-col items-center px-[clamp(0.5rem,3vw,2rem)] pt-[clamp(1.75rem,4.5vw,3.25rem)] text-center">
        {/* Live badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: EASE }}
          className="inline-flex items-center gap-2.5 rounded-full border border-border-soft bg-surface/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600 shadow-[var(--shadow-soft)] backdrop-blur-sm dark:text-brand-300"
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <EyebrowIcon className="h-4 w-4" />
          {eyebrowText}
        </motion.span>

        <h1 className="mt-6 max-w-4xl text-[clamp(2rem,1rem+4.5vw,4.25rem)] font-semibold leading-[1.07] tracking-tight text-foreground">
          <AnimatedText text={titleLead} delay={0.1} />{" "}
          <AnimatedText text={titleGradient} wordClassName="shimmer-text-ink" delay={0.3} />
        </h1>

        {/* Animated gradient underline */}
        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="brand-gradient-bg bg-size-200 mt-5 h-1.5 w-[clamp(4.5rem,10vw,7rem)] rounded-full"
          aria-hidden
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
          className="mt-5 max-w-2xl text-[clamp(0.875rem,0.79rem+0.45vw,1.1rem)] leading-relaxed text-muted"
        >
          {description}
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <motion.a
            href={ctaHref}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="brand-gradient-bg inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(108,77,255,0.35)] sm:px-7 sm:py-3.5 sm:text-[15px]"
          >
            {ctaLabel}
            <AnimatedArrow className="h-4.5 w-4.5" />
          </motion.a>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted sm:text-sm">
            <AnimatedSparkle className="h-4.5 w-4.5" />
            {ctaNote}
          </span>
        </motion.div>

        {/* Promise chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.62, ease: EASE }}
          className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-2.5"
        >
          {chips.map((c) => (
            <span
              key={c.text}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface/85 px-3 py-1.5 text-[11px] font-medium text-foreground/80 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:gap-2 sm:px-3.5 sm:py-2 sm:text-xs"
            >
              <c.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              {c.text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Showcase strip — wrap-based bento, hole-free at every width ── */}
      <div className="relative mt-[clamp(2.25rem,5.5vw,3.75rem)] flex flex-wrap gap-3 sm:gap-4">
        {/* Headline-number tile */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
          whileHover={{ y: -4, transition: { duration: 0.25 } }}
          className="brand-gradient-bg card-shine relative min-w-[min(100%,16rem)] flex-[1.5] overflow-hidden rounded-3xl p-5 text-white shadow-[0_14px_36px_rgba(108,77,255,0.35)] sm:p-6"
        >
          {/* Decorative rings clipped inside the tile */}
          <span className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/15" aria-hidden />
          <span className="absolute -right-4 -top-4 h-20 w-20 rounded-full border border-white/10" aria-hidden />
          <div className="relative flex items-center gap-4">
            <motion.span
              className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:h-14 sm:w-14"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <HeroIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </motion.span>
            <div className="min-w-0 leading-tight">
              <p className="text-3xl font-bold tabular-nums sm:text-4xl">
                <StatCounter to={heroValue} duration={1.5} />
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/85 sm:text-[11px]">
                {heroLabel}
              </p>
            </div>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
              Live
            </span>
          </div>
        </motion.div>

        {/* Stat tiles */}
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.58 + i * 0.08, ease: EASE }}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="glass-panel card-shine relative flex min-w-[min(100%,10rem)] flex-1 items-center gap-3.5 overflow-hidden rounded-3xl p-4 sm:p-5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 sm:h-12 sm:w-12">
              <s.icon className="h-6.5 w-6.5 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-2xl font-bold tabular-nums sm:text-3xl">
                <StatCounter to={s.value} duration={1.4} />
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted sm:text-[11px]">
                {s.label}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Trust tile */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.58 + stats.length * 0.08, ease: EASE }}
          whileHover={{ y: -4, transition: { duration: 0.25 } }}
          className="glass-panel card-shine relative flex min-w-[min(100%,13rem)] flex-[1.2] items-center gap-3 overflow-hidden rounded-3xl p-4 sm:p-5"
        >
          <span className="flex shrink-0 -space-x-2.5">
            {cluster.slice(0, 4).map((node, i) => (
              <motion.span
                key={i}
                className="relative inline-flex rounded-full ring-2 ring-surface"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.75 + i * 0.08, ease: EASE }}
                style={{ zIndex: cluster.length - i }}
              >
                {node}
              </motion.span>
            ))}
          </span>
          <span className="min-w-0 text-xs font-medium leading-snug text-muted sm:text-[13px]">
            {clusterLabel}
          </span>
        </motion.div>
      </div>

      {/* ── Marquee rail as a glass tile ── */}
      {marqueeLabel && marqueeItems && marqueeItems.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.8, ease: EASE }}
          className="glass-panel relative mt-3 flex flex-col items-start gap-2.5 overflow-hidden rounded-3xl px-4 py-3.5 sm:mt-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
        >
          <span className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <AnimatedSparkle className="h-4.5 w-4.5" />
            {marqueeLabel}
          </span>
          <div className="marquee-mask w-full min-w-0 flex-1 overflow-hidden">
            <div
              className="animate-marquee flex w-max items-center gap-3 pr-3"
              style={{ "--marquee-duration": `${Math.max(18, marqueeItems.length * 6)}s` } as CSSProperties}
            >
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i} className="inline-flex shrink-0">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
