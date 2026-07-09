"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type AuthFeature = {
  icon: ReactNode;
  title: string;
  desc: string;
};

type AuthShellProps = {
  badge: string;
  heading: ReactNode;
  subline: string;
  features: AuthFeature[];
  stats?: { value: string; label: string }[];
  children: ReactNode;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * Split-screen auth layout: an animated brand panel on desktop, a centered
 * form column everywhere. All floating/rotating decorations live inside an
 * overflow-hidden stage so they can never widen the mobile viewport.
 */
export function AuthShell({ badge, heading, subline, features, stats, children }: AuthShellProps) {
  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Ambient background — orbs + grid, clipped to the stage */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-400/25 blur-3xl dark:bg-brand-600/25"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-accent-400/20 blur-3xl dark:bg-accent-600/20"
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-500/15"
          animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:py-20">
        {/* Brand panel — desktop only */}
        <div className="hidden lg:block">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-500 uppercase backdrop-blur dark:text-brand-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            {badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: easeOut }}
            className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight xl:text-5xl"
          >
            {heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: easeOut }}
            className="mt-4 max-w-md text-base text-muted"
          >
            {subline}
          </motion.p>

          <div className="mt-10 flex flex-col gap-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.28 + i * 0.12, ease: easeOut }}
                whileHover={{ x: 6 }}
                className="flex items-center gap-4 rounded-2xl border border-border-soft bg-surface/60 p-4 backdrop-blur transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]"
              >
                <span className="h-10 w-10 shrink-0">{feature.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="text-xs text-muted">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 + features.length * 0.12, ease: easeOut }}
              className="mt-10 flex gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="brand-gradient-text text-2xl font-bold">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Form column */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1, ease: easeOut }}
          className="relative mx-auto w-full max-w-md pb-16 lg:pb-0"
        >
          {/* Soft gradient halo behind the card */}
          <div
            className="brand-gradient-bg absolute -inset-1 rounded-[1.75rem] opacity-20 blur-xl dark:opacity-30"
            aria-hidden
          />
          <div className="glass-panel relative rounded-3xl p-6 sm:p-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
