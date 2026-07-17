"use client";

import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Eyebrow } from "@/components/ui/Section";
import { StatCounter } from "@/components/ui/StatCounter";
import { AnimatedCode } from "@/components/ui/icons/AnimatedCode";
import { AnimatedRocket } from "@/components/ui/icons/AnimatedRocket";
import { AnimatedShield } from "@/components/ui/icons/AnimatedShield";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { BuildTerminal } from "@/components/services/BuildTerminal";

const EASE = [0.16, 1, 0.3, 1] as const;

export function AppWebDevHero({ techCount }: { techCount: number }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]" aria-hidden>
        <div className="hero-grid-light absolute inset-x-0 top-0 h-[30rem]" />
        <span
          className="absolute -top-16 left-[8%] h-64 w-[min(70%,34rem)] rounded-full bg-brand-300/25 blur-3xl"
          style={{ animation: "pulse-glow 5.5s ease-in-out infinite" }}
        />
        <span
          className="absolute top-20 right-[4%] h-52 w-[min(40%,20rem)] rounded-full bg-accent-400/15 blur-3xl"
          style={{ animation: "pulse-glow 6.5s ease-in-out infinite 1s" }}
        />
        <motion.span
          className="glass-panel absolute left-[6%] top-[14%] hidden h-12 w-12 items-center justify-center rounded-2xl lg:flex"
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatedCode className="h-6 w-6" />
        </motion.span>
      </div>

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            <Eyebrow>
              <AnimatedCode className="h-4.5 w-4.5" />
              Product Engineering
            </Eyebrow>
          </motion.div>

          <h1 className="mt-5 text-[clamp(2rem,1rem+3.6vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
            <AnimatedText text="We build" delay={0.1} />{" "}
            <AnimatedText text="premium products" wordClassName="shimmer-text-ink" delay={0.28} />
          </h1>

          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className="brand-gradient-bg bg-size-200 mt-5 block h-1.5 w-[clamp(4.5rem,10vw,7rem)] rounded-full"
            aria-hidden
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
            className="mt-5 max-w-xl text-[clamp(0.875rem,0.79rem+0.45vw,1.05rem)] leading-relaxed text-muted"
          >
            For startups, enterprises and organizations that need a premium mobile app or website &mdash; built,
            animated, and maintained by our in-house engineering team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.44, ease: EASE }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#lead-form"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="brand-gradient-bg inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(108,77,255,0.35)] sm:px-7 sm:py-3.5 sm:text-[15px]"
            >
              Start your project
              <AnimatedArrow className="h-4.5 w-4.5" />
            </motion.a>
            <motion.a
              href="#stack"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/85 px-5 py-3 text-sm font-semibold text-foreground/85 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:px-6 sm:py-3.5"
            >
              See our stack
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.56, ease: EASE }}
            className="mt-6 flex flex-wrap gap-2 sm:gap-2.5"
          >
            {[
              { icon: AnimatedShield, text: "NDA on request" },
              { icon: AnimatedLayers, text: "Full source-code ownership" },
              { icon: AnimatedRocket, text: "Weekly sprint demos" },
            ].map((c) => (
              <span
                key={c.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface/85 px-3 py-1.5 text-[11px] font-medium text-foreground/80 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:gap-2 sm:px-3.5 sm:py-2 sm:text-xs"
              >
                <c.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                {c.text}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.68, ease: EASE }}
            className="mt-7 flex items-center gap-2 text-sm text-muted"
          >
            <span className="text-2xl font-bold text-foreground tabular-nums">
              <StatCounter to={techCount} suffix="+" />
            </span>
            technologies in our production stack
          </motion.div>
        </div>

        <div className="flex justify-center lg:col-span-2 lg:justify-end">
          <BuildTerminal />
        </div>
      </div>
    </div>
  );
}
