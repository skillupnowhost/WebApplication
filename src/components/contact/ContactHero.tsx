"use client";

import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { StatCounter } from "@/components/ui/StatCounter";
import { AnimatedChat } from "@/components/ui/icons/AnimatedChat";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { LiveStatusBadge } from "@/components/contact/LiveStatusBadge";
import { toWhatsAppLink } from "@/lib/whatsapp";
import { CONTACT_EMAIL, CONTACT_PHONES, WHATSAPP_PHONE } from "@/lib/contactInfo";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ContactHero({ learnerCount }: { learnerCount: number }) {
  const whatsappHref = toWhatsAppLink(WHATSAPP_PHONE, "Hi MyLoginn team! I have a question.");

  return (
    <div className="relative">
      {/* Clipped aurora backdrop — keeps floating accents from widening the viewport */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]" aria-hidden>
        <div className="hero-grid-light absolute inset-x-0 top-0 h-[28rem]" />
        <span
          className="absolute -top-20 left-1/2 h-64 w-[min(80%,38rem)] -translate-x-1/2 rounded-full bg-brand-300/25 blur-3xl"
          style={{ animation: "pulse-glow 5s ease-in-out infinite" }}
        />
        <span
          className="absolute top-16 right-[8%] h-44 w-[min(36%,17rem)] rounded-full bg-accent-400/15 blur-3xl"
          style={{ animation: "pulse-glow 6.5s ease-in-out infinite 1s" }}
        />
        <motion.span
          className="glass-panel absolute left-[8%] top-[18%] hidden h-13 w-13 items-center justify-center rounded-2xl lg:flex"
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatedMail className="h-6.5 w-6.5" />
        </motion.span>
        <motion.span
          className="glass-panel absolute right-[10%] top-[14%] hidden h-11 w-11 items-center justify-center rounded-xl lg:flex"
          animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          <AnimatedChat className="h-5.5 w-5.5" />
        </motion.span>
        <motion.span
          className="glass-panel absolute right-[16%] top-[52%] hidden h-10 w-10 items-center justify-center rounded-xl lg:flex"
          animate={{ y: [0, 9, 0], rotate: [0, 7, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <AnimatedPhone className="h-5 w-5" />
        </motion.span>
      </div>

      <div className="relative flex flex-col items-center px-[clamp(0.5rem,3vw,2rem)] pt-[clamp(1rem,3vw,2rem)] text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05, ease: EASE }}>
          <LiveStatusBadge />
        </motion.div>

        <h1 className="mt-6 max-w-3xl text-[clamp(2rem,1rem+4vw,3.75rem)] font-semibold leading-[1.07] tracking-tight text-foreground">
          <AnimatedText text="Let's start a" delay={0.1} />{" "}
          <AnimatedText text="conversation" wordClassName="shimmer-text-ink" delay={0.3} />
        </h1>

        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="brand-gradient-bg bg-size-200 mt-5 h-1.5 w-[clamp(4.5rem,10vw,7rem)] rounded-full"
          aria-hidden
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
          className="mt-5 max-w-xl text-[clamp(0.875rem,0.79rem+0.45vw,1.05rem)] leading-relaxed text-muted"
        >
          Questions about a course, internship, or one of our services? Send us a message and a real
          person &mdash; not a bot &mdash; will get back to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.44, ease: EASE }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          {whatsappHref && (
            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="brand-gradient-bg inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(108,77,255,0.35)] sm:px-7 sm:py-3.5 sm:text-[15px]"
            >
              <AnimatedChat className="h-4.5 w-4.5" />
              Chat on WhatsApp
              <AnimatedArrow className="h-4.5 w-4.5" />
            </motion.a>
          )}
          <motion.a
            href={`tel:${CONTACT_PHONES[0].tel}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/85 px-5 py-3 text-sm font-semibold text-foreground/85 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:px-6 sm:py-3.5"
          >
            <AnimatedPhone className="h-4.5 w-4.5" />
            Call now
          </motion.a>
          <motion.a
            href={`mailto:${CONTACT_EMAIL}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/85 px-5 py-3 text-sm font-semibold text-foreground/85 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:px-6 sm:py-3.5"
          >
            <AnimatedMail className="h-4.5 w-4.5" />
            Email us
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.58, ease: EASE }}
          className="mt-9 flex w-full max-w-lg flex-wrap justify-center gap-3"
        >
          <div className="glass-panel card-shine relative flex min-w-[9rem] flex-1 items-center gap-3 overflow-hidden rounded-2xl p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2">
              <AnimatedUsers className="h-6 w-6" />
            </span>
            <div className="min-w-0 text-left leading-tight">
              <p className="text-xl font-bold tabular-nums">
                <StatCounter to={learnerCount} suffix="+" />
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Learners we support</p>
            </div>
          </div>
          <div className="glass-panel card-shine relative flex min-w-[9rem] flex-1 items-center gap-3 overflow-hidden rounded-2xl p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2">
              <AnimatedPhone className="h-6 w-6" />
            </span>
            <div className="min-w-0 text-left leading-tight">
              <p className="text-xl font-bold tabular-nums">
                <StatCounter to={CONTACT_PHONES.length} />
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Direct phone lines</p>
            </div>
          </div>
          <div className="glass-panel card-shine relative flex min-w-[9rem] flex-1 items-center gap-3 overflow-hidden rounded-2xl p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2">
              <AnimatedChat className="h-6 w-6" />
            </span>
            <div className="min-w-0 text-left leading-tight">
              <p className="text-xl font-bold tabular-nums">&lt;24h</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Avg. reply time</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
