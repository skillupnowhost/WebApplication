"use client";

import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Eyebrow } from "@/components/ui/Section";
import { StatCounter } from "@/components/ui/StatCounter";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { useParallax } from "@/hooks/useParallax";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ServicesHero({ categoryCount, dedicatedCount }: { categoryCount: number; dedicatedCount: number }) {
  const { ref: parallaxRef, y: parallaxY } = useParallax(30);

  return (
    <div className="relative">
      <motion.div
        ref={parallaxRef}
        style={{ y: parallaxY }}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]"
        aria-hidden
      >
        <div className="hero-grid-light absolute inset-x-0 top-0 h-[28rem]" />
        <span
          className="absolute -top-16 left-[10%] h-60 w-[min(65%,32rem)] rounded-full bg-brand-300/25 blur-3xl"
          style={{ animation: "pulse-glow 5.5s ease-in-out infinite" }}
        />
        <span
          className="absolute top-16 right-[6%] h-48 w-[min(38%,18rem)] rounded-full bg-accent-400/15 blur-3xl"
          style={{ animation: "pulse-glow 6.5s ease-in-out infinite 1s" }}
        />
      </motion.div>

      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="flex justify-center"
        >
          <Eyebrow>
            <AnimatedLayers className="h-4.5 w-4.5" />
            Services &amp; what we do
          </Eyebrow>
        </motion.div>

        <h1 className="mt-5 text-[clamp(2rem,1rem+3.6vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
          <AnimatedText text="Everything you need to" delay={0.1} />{" "}
          <AnimatedText text="build, learn & grow" wordClassName="shimmer-text-ink" delay={0.34} />
        </h1>

        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="brand-gradient-bg bg-size-200 mx-auto mt-5 block h-1.5 w-[clamp(4.5rem,10vw,7rem)] rounded-full"
          aria-hidden
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.34, ease: EASE }}
          className="mx-auto mt-5 max-w-xl text-[clamp(0.875rem,0.79rem+0.45vw,1.05rem)] leading-relaxed text-muted"
        >
          From AI-driven product builds to hands-on internship programs — a look at everything MyLoginn delivers for
          learners, founders and growing teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.46, ease: EASE }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            href="#categories"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="brand-gradient-bg inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(108,77,255,0.35)] sm:px-7 sm:py-3.5 sm:text-[15px]"
          >
            Explore services
            <AnimatedArrow className="h-4.5 w-4.5" />
          </motion.a>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/85 px-5 py-3 text-sm font-semibold text-foreground/85 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:px-6 sm:py-3.5"
          >
            Talk to our team
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.6, ease: EASE }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted"
        >
          <span className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground tabular-nums">
              <StatCounter to={categoryCount} />
            </span>
            service categories
          </span>
          <span className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground tabular-nums">
              <StatCounter to={dedicatedCount} />
            </span>
            dedicated deep-dive pages
          </span>
        </motion.div>
      </div>
    </div>
  );
}
