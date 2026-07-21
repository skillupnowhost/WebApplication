"use client";

import { motion } from "framer-motion";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { StatCounter } from "@/components/ui/StatCounter";
import { Button } from "@/components/ui/Button";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { useTiltSpotlight } from "@/hooks/useTiltSpotlight";

const EASE = [0.16, 1, 0.3, 1] as const;

type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

export type HeroChip = { icon: IconComponent; text: string };
export type HeroStat = {
  icon: IconComponent;
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

/**
 * Shared split hero for the explorer pages (courses, projects, internships,
 * tutoring, mentoring, events): copy on the left, a bento grid of
 * product-data widgets on the right instead of an abstract visual —
 * a flagship metric card (the caller's headline number + `stats`) and a
 * trust card (`cluster`), plus a "browse" list card built from
 * `marqueeItems` when the caller passes any (Mentoring doesn't, so that
 * cell is skipped and the trust card takes the full row instead of leaving
 * a blank cell). Every widget renders numbers the caller already computed
 * from the database — no fabricated data, no fake screenshots.
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
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTiltSpotlight();
  const hasBrowseWidget = Boolean(marqueeLabel && marqueeItems && marqueeItems.length > 0);

  return (
    <section className="relative overflow-hidden bg-white text-foreground">
      <div className="mesh-hero-light pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto grid w-full max-w-[86rem] grid-cols-1 items-center gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-16 lg:py-24">
        {/* ── Copy column ── */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: EASE }}
            className="inline-flex w-fit items-center gap-2.5 rounded-full border border-border-soft bg-surface/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600 shadow-[var(--shadow-soft)] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <EyebrowIcon className="h-4 w-4" />
            {eyebrowText}
          </motion.span>

          <h1 className="cinematic-title mt-6 font-semibold text-foreground">
            <AnimatedText text={titleLead} delay={0.1} />{" "}
            <AnimatedText text={titleGradient} wordClassName="shimmer-text-ink" delay={0.3} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Button href={ctaHref} size="lg" icon={<AnimatedArrow className="h-4.5 w-4.5" />}>
              {ctaLabel}
            </Button>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted sm:text-sm">
              <AnimatedSparkle className="h-4.5 w-4.5" />
              {ctaNote}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.62, ease: EASE }}
            className="mt-4 flex flex-wrap gap-2 sm:gap-2.5"
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

        {/* ── Bento widget column — real product data, tilts gently toward
            the cursor for a light parallax feel ── */}
        <motion.div
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4"
        >
          {/* Flagship metric widget */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
            whileHover={{ y: -3, transition: { duration: 0.25 } }}
            className="glass-panel card-shine relative overflow-hidden rounded-3xl p-5 sm:col-span-2 sm:p-6"
          >
            <div className="flex items-center gap-3.5">
              <motion.span
                className="brand-gradient-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeroIcon className="h-6 w-6" />
              </motion.span>
              <div className="min-w-0 leading-tight">
                <p className="text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
                  <StatCounter to={heroValue} duration={1.5} immediate />
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{heroLabel}</p>
              </div>
              <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-80" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            </div>

            {stats.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border-soft pt-4 sm:gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                      <s.icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block text-lg font-bold tabular-nums text-foreground">
                        <StatCounter
                          to={s.value}
                          duration={1.3}
                          decimals={s.decimals}
                          prefix={s.prefix}
                          suffix={s.suffix}
                          immediate
                        />
                      </span>
                      <span className="block truncate text-[10px] font-semibold uppercase tracking-wider text-muted">
                        {s.label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Browse list widget — skipped when the caller has no marquee data */}
          {hasBrowseWidget && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
              whileHover={{ y: -3, transition: { duration: 0.25 } }}
              className="glass-panel card-shine rounded-3xl p-4 sm:p-5"
            >
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                <AnimatedSparkle className="h-3.5 w-3.5" />
                {marqueeLabel}
              </p>
              <div className="mt-3 flex flex-col items-start gap-2">
                {marqueeItems!.slice(0, 3).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.65 + i * 0.08, ease: EASE }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Trust widget */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.6, ease: EASE }}
            whileHover={{ y: -3, transition: { duration: 0.25 } }}
            className={`glass-panel card-shine rounded-3xl p-4 sm:p-5 ${hasBrowseWidget ? "" : "sm:col-span-2"}`}
          >
            <span className="flex shrink-0 -space-x-2.5">
              {cluster.slice(0, 4).map((node, i) => (
                <motion.span
                  key={i}
                  className="relative inline-flex rounded-full ring-2 ring-surface"
                  initial={{ opacity: 0, x: -8, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.75 + i * 0.08, ease: EASE }}
                  style={{ zIndex: cluster.length - i }}
                >
                  {node}
                </motion.span>
              ))}
            </span>
            <p className="mt-3 text-xs leading-snug text-muted">{clusterLabel}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
