"use client";

import { motion } from "framer-motion";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedTrending } from "@/components/ui/icons/AnimatedTrending";
import { Eyebrow } from "@/components/ui/Section";
import { StatCounter } from "@/components/ui/StatCounter";
import { LiveActivityTicker } from "@/components/services/LiveActivityTicker";
import { useParallax } from "@/hooks/useParallax";

const tickerItems = [
  "AI campaign launched for a D2C fashion brand — just now",
  "WhatsApp lead flow activated for a SaaS startup — 2m ago",
  "Growth report auto-generated for a clinic chain — 5m ago",
  "Social ad creative refreshed by AI — 8m ago",
  "New consultation request from Bengaluru — 12m ago",
];

const stats: { to: number; decimals?: number; prefix?: string; suffix: string; label: string }[] = [
  { to: 4.8, decimals: 1, suffix: "x", label: "Avg. ROAS" },
  { to: 120, suffix: "+", label: "Active campaigns" },
  { to: 35, suffix: "+", label: "Industries served" },
];

export function DigitalMarketingHero() {
  const { ref: parallaxRef, y: parallaxY } = useParallax(30);

  return (
    <div className="relative">
      <motion.div
        ref={parallaxRef}
        style={{ y: parallaxY }}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]"
        aria-hidden
      >
        <div className="hero-grid-light absolute inset-x-0 top-0 h-[30rem]" />
        <span
          className="absolute -top-16 left-[6%] h-64 w-[min(70%,34rem)] rounded-full bg-brand-300/25 blur-3xl"
          style={{ animation: "pulse-glow 5.5s ease-in-out infinite" }}
        />
        <span
          className="absolute top-16 right-[2%] h-52 w-[min(40%,20rem)] rounded-full bg-accent-400/15 blur-3xl"
          style={{ animation: "pulse-glow 6.5s ease-in-out infinite 1s" }}
        />
        <motion.span
          className="glass-panel absolute right-[8%] top-[10%] hidden h-12 w-12 items-center justify-center rounded-2xl lg:flex"
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatedTrending className="h-6 w-6" />
        </motion.span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Eyebrow>
          <AnimatedSparkle className="h-4.5 w-4.5" />
          Growth Marketing
        </Eyebrow>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-5 text-[clamp(2rem,1rem+3.6vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-foreground"
      >
        <span className="brand-gradient-text bg-size-200">AI-Driven</span> Digital Marketing
        Services
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-4 max-w-xl text-muted"
      >
        For SMEs, startups and established businesses looking to scale online
        &mdash; we run performance marketing powered by AI, with WhatsApp built
        into the customer journey.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.42 }}
        className="mt-6"
      >
        <LiveActivityTicker items={tickerItems} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="mt-8 grid grid-cols-3 gap-3"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border-soft bg-surface-2/60 px-3 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-[var(--shadow-soft)] sm:px-4"
          >
            <p className="text-xl font-semibold text-foreground sm:text-2xl">
              <StatCounter to={s.to} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="mt-1 text-[11px] text-muted sm:text-xs">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
