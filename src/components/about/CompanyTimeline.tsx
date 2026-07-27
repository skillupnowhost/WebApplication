"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { Section, Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedRocket } from "@/components/ui/icons/AnimatedRocket";
import { AnimatedFlame } from "@/components/ui/icons/AnimatedFlame";
import { AnimatedTrophy } from "@/components/ui/icons/AnimatedTrophy";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { PillBadge } from "@/components/about/PillBadge";
import { CornerTechIcons } from "@/components/about/CornerTechIcons";

const MILESTONE_ICONS = [AnimatedRocket, AnimatedFlame, AnimatedTrophy, AnimatedLayers, AnimatedSparkle, AnimatedStar];

export type Milestone = { id: string; year: string; title: string; description: string };

/** Counts up to the milestone's year once it scrolls into view; falls back to the raw label for non-numeric years. */
function YearCounter({ year }: { year: string }) {
  const numeric = parseInt(year, 10);
  const isNumeric = Number.isFinite(numeric) && String(numeric) === year.trim();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(isNumeric ? Math.max(numeric - 14, 0) : numeric);

  useEffect(() => {
    if (!isNumeric) return;
    if (!inView) return;
    if (reduced) {
      setDisplay(numeric);
      return;
    }
    const controls = animate(Math.max(numeric - 14, 0), numeric, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, isNumeric, numeric, reduced]);

  if (!isNumeric) return <span ref={ref}>{year}</span>;
  return <span ref={ref}>{display}</span>;
}

/** Icon medallion that lives directly on the spine/rail — glows and grows a pulse ring once its step is active. */
function TimelineNode({ Icon, active }: { Icon: typeof AnimatedRocket; active: boolean }) {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center lg:h-16 lg:w-16">
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-full transition-opacity duration-500",
          active ? "opacity-100 animate-breathe-ring" : "opacity-0"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-[-8px] -z-10 rounded-full blur-lg transition-opacity duration-500",
          active ? "opacity-80" : "opacity-0"
        )}
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent-400) 60%, transparent) 0%, transparent 72%)" }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.12, rotate: 6 }}
        transition={{ type: "spring", stiffness: 300, damping: 16 }}
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-full border-2 bg-surface transition-colors duration-500",
          active ? "border-brand-400 shadow-[var(--shadow-lift)]" : "border-border-soft"
        )}
      >
        <Icon className="h-7 w-7 lg:h-8 lg:w-8" />
      </motion.div>
    </div>
  );
}

/** Horizontal-layout card: node sits above, card centered below, connector stub points up. Desktop spine only. */
function HorizontalMilestoneCard({
  milestone,
  index,
  active,
}: {
  milestone: Milestone;
  index: number;
  active: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "card-shine group relative isolate w-full overflow-hidden rounded-2xl border bg-surface p-5 text-center shadow-[var(--shadow-soft)] transition-all duration-300",
        active
          ? "-translate-y-1 border-brand-300 shadow-[var(--shadow-lift)] ring-1 ring-brand-400/30"
          : "border-border-soft opacity-80 hover:opacity-100 hover:border-brand-200"
      )}
    >
      {/* Connector stub bridging the card top edge to the spine node */}
      <span
        aria-hidden
        className={cn(
          "absolute -top-6 left-1/2 h-6 w-px -translate-x-1/2 bg-[repeating-linear-gradient(180deg,var(--border-soft)_0_5px,transparent_5px_10px)] transition-opacity duration-500",
          active ? "opacity-100" : "opacity-50"
        )}
      />
      {/* Top accent bar — brighter and glowing once this step is active */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 brand-gradient-bg transition-opacity duration-500",
          active ? "opacity-100" : "opacity-30"
        )}
      />
      {/* Oversized ghost step numeral — editorial anchor for the card */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-3 left-2 select-none text-6xl font-black text-brand-900/[0.05] transition-colors duration-500 dark:text-white/[0.05]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <p className="shimmer-text-ink relative text-2xl font-extrabold tracking-tight sm:text-3xl">
        <YearCounter year={milestone.year} />
      </p>
      <h3 className="relative mt-1.5 text-base font-semibold text-foreground">{milestone.title}</h3>
      {milestone.description && (
        <p className="relative mt-1.5 text-sm leading-relaxed text-muted">{milestone.description}</p>
      )}
    </motion.div>
  );
}

function MilestoneCard({
  milestone,
  index,
  active,
  side,
}: {
  milestone: Milestone;
  index: number;
  active: boolean;
  side: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, x: side === "left" ? 28 : -28 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "card-shine group relative isolate w-full overflow-hidden rounded-2xl border bg-surface p-6 shadow-[var(--shadow-soft)] transition-all duration-300 sm:p-7 lg:max-w-md",
        side === "left" ? "lg:ml-auto lg:text-right" : "lg:mr-auto",
        active
          ? "border-brand-300 shadow-[var(--shadow-lift)] ring-1 ring-brand-400/30"
          : "border-border-soft opacity-80 hover:opacity-100 hover:border-brand-200"
      )}
    >
      {/* Connector stub bridging the card edge to the spine node — desktop only */}
      <span
        aria-hidden
        className={cn(
          "absolute top-10 hidden h-px w-6 bg-[repeating-linear-gradient(90deg,var(--border-soft)_0_5px,transparent_5px_10px)] transition-opacity duration-500 lg:block",
          side === "left" ? "-right-6" : "-left-6",
          active ? "opacity-100" : "opacity-50"
        )}
      />
      {/* Top accent bar — brighter and glowing once this step is active */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 brand-gradient-bg transition-opacity duration-500",
          active ? "opacity-100" : "opacity-30"
        )}
      />
      {/* Oversized ghost step numeral — editorial anchor for the card */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-4 select-none text-7xl font-black text-brand-900/[0.05] transition-colors duration-500 dark:text-white/[0.05] sm:text-8xl",
          side === "left" ? "lg:-left-2" : "-right-1"
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <p className="shimmer-text-ink relative text-3xl font-extrabold tracking-tight sm:text-4xl">
        <YearCounter year={milestone.year} />
      </p>
      <h3 className="relative mt-2 text-lg font-semibold text-foreground">{milestone.title}</h3>
      {milestone.description && (
        <p className="relative mt-2 text-sm leading-relaxed text-muted">{milestone.description}</p>
      )}
    </motion.div>
  );
}

/**
 * Cinematic company-history timeline: a scroll-scrubbed glowing spine with icon
 * medallions riding the line itself and cards trailing below — horizontal,
 * left-to-right on desktop (scrolls if there are more milestones than fit),
 * vertical rail on mobile/tablet where there's no width to go sideways.
 * Renders whatever rows the admin has added via /admin/milestones — no
 * hardcoded milestone copy — and renders nothing when that list is empty.
 */
export function CompanyTimeline({ milestones }: { milestones: Milestone[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);
  const lineRefRail = useRef<HTMLDivElement>(null);
  const headRefRail = useRef<HTMLDivElement>(null);
  const desktopRowRef = useRef<HTMLDivElement>(null);
  const lineRefSpine = useRef<HTMLDivElement>(null);
  const headRefSpine = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useGSAP(
    () => {
      if (milestones.length === 0) return;

      // Respect prefers-reduced-motion: reveal the connector and every card
      // immediately instead of scrubbing them in as the page scrolls.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(lineRefRail.current, { height: "100%" });
        gsap.set(headRefRail.current, { top: "100%", opacity: 0 });
        gsap.set(lineRefSpine.current, { width: "100%" });
        gsap.set(headRefSpine.current, { left: "100%", opacity: 0 });
        setActive(milestones.length - 1);
        return;
      }

      const mm = gsap.matchMedia();

      // Desktop: horizontal spine, line fills left-to-right as the row scrolls into view.
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: desktopRowRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 0.6,
          onUpdate: (self) => {
            const pct = `${self.progress * 100}%`;
            const visible = self.progress > 0.01 ? 1 : 0;
            gsap.set(lineRefSpine.current, { width: pct });
            gsap.set(headRefSpine.current, { left: pct, opacity: visible });
            const idx = Math.min(milestones.length - 1, Math.floor(self.progress * milestones.length));
            setActive((prev) => (prev === idx ? prev : idx));
          },
        });
        return () => st.kill();
      });

      // Mobile/tablet: vertical rail, line fills top-to-bottom.
      mm.add("(max-width: 1023px)", () => {
        const st = ScrollTrigger.create({
          trigger: mobileListRef.current,
          start: "top 82%",
          end: "bottom 60%",
          scrub: 0.6,
          onUpdate: (self) => {
            const pct = `${self.progress * 100}%`;
            const visible = self.progress > 0.01 ? 1 : 0;
            gsap.set(lineRefRail.current, { height: pct });
            gsap.set(headRefRail.current, { top: pct, opacity: visible });
            const idx = Math.min(milestones.length - 1, Math.floor(self.progress * milestones.length));
            setActive((prev) => (prev === idx ? prev : idx));
          },
        });
        return () => st.kill();
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope, dependencies: [milestones.length] }
  );

  if (milestones.length === 0) return null;

  return (
    <Section id="our-journey" className="relative scroll-mt-24 overflow-hidden bg-[#FBF9F5] dark:bg-surface-2">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.3]" />
      <CornerTechIcons />

      <Container ref={scope}>
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Our Journey</p>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-4 flex justify-center">
              <PillBadge>02 &bull; Company Timeline</PillBadge>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              How <span className="shimmer-text-ink">We Got Here</span>
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-[120px] rounded-full brand-gradient-bg" />
          </Reveal>
        </div>

        {/* Mobile/tablet: vertical rail, stacked cards */}
        <div ref={mobileListRef} className="relative mt-16 sm:mt-20 lg:hidden">
          <div className="absolute bottom-2 left-7 top-2 w-[3px] -translate-x-1/2">
            <div className="absolute inset-x-0 top-0 h-full w-[3px] overflow-hidden rounded-full bg-[repeating-linear-gradient(180deg,var(--border-soft)_0_8px,transparent_8px_16px)]" />
            <div
              ref={lineRefRail}
              className="absolute left-0 top-0 w-[3px] overflow-hidden rounded-full brand-gradient-bg"
              style={{ height: "0%", boxShadow: "0 0 16px 2px color-mix(in srgb, var(--accent-400) 60%, transparent)" }}
            >
              <div className="timeline-flow-y absolute inset-0" />
            </div>
            <div ref={headRefRail} className="timeline-head left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 opacity-0" />
          </div>

          <ol className="relative flex flex-col gap-10 sm:gap-12">
            {milestones.map((m, i) => {
              const isActive = i <= active;
              const Icon = MILESTONE_ICONS[i % MILESTONE_ICONS.length];
              return (
                <li key={m.id} className="relative flex items-start gap-4">
                  <div className="relative z-10">
                    <TimelineNode Icon={Icon} active={isActive} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <MilestoneCard milestone={m} index={i} active={isActive} side="right" />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Desktop: horizontal spine — nodes ride the line left to right, cards trail below.
            Up to 4 milestones fill the row evenly; more than that switches to fixed-width
            scrollable cards so nothing gets cramped or clipped. */}
        <div ref={desktopRowRef} className="relative mt-20 hidden lg:block">
          <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
            <div
              className={cn(
                "relative mx-auto flex items-start gap-6 px-2",
                milestones.length > 4 && "min-w-max"
              )}
            >
              <div className="pointer-events-none absolute inset-x-2 top-8 h-[3px] -translate-y-1/2">
                <div className="absolute inset-x-0 top-0 h-[3px] overflow-hidden rounded-full bg-[repeating-linear-gradient(90deg,var(--border-soft)_0_8px,transparent_8px_16px)]" />
                <div
                  ref={lineRefSpine}
                  className="absolute left-0 top-0 h-[3px] overflow-hidden rounded-full brand-gradient-bg"
                  style={{ width: "0%", boxShadow: "0 0 16px 2px color-mix(in srgb, var(--accent-400) 60%, transparent)" }}
                >
                  <div className="timeline-flow-x absolute inset-0" />
                </div>
                <div ref={headRefSpine} className="timeline-head top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 opacity-0" />
              </div>

              {milestones.map((m, i) => {
                const isActive = i <= active;
                const Icon = MILESTONE_ICONS[i % MILESTONE_ICONS.length];
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "relative flex flex-col items-center",
                      milestones.length > 4 ? "w-64 shrink-0" : "min-w-0 flex-1"
                    )}
                  >
                    <div className="relative z-10">
                      <TimelineNode Icon={Icon} active={isActive} />
                    </div>
                    <div className="mt-6 w-full">
                      <HorizontalMilestoneCard milestone={m} index={i} active={isActive} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
