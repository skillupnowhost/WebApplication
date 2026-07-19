"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";

export type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string;
  rating: number;
};

const AVATAR_COLORS = ["#6c4dff", "#0891b2", "#c026d3", "#059669", "#d97706", "#e11d48"];

function colorFor(id: string) {
  const sum = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={cn("h-4 w-4", i < rating ? "text-amber-400" : "text-border-soft")} fill="currentColor">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5500);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  if (testimonials.length === 0) return null;
  const t = testimonials[index];

  return (
    <Section className="relative overflow-hidden">
      <div className="starfield opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_40%,var(--brand-100),transparent_70%)] dark:bg-[radial-gradient(50%_60%_at_50%_40%,rgba(108,77,255,0.12),transparent_70%)]" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow>Voices from the community</Eyebrow>
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Loved by learners, mentors &amp; partners
          </h2>
        </div>

        <div
          className="relative mx-auto mt-14 max-w-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, scale: 0.97, filter: "blur(4px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard className="relative overflow-hidden px-7 py-10 text-center sm:px-12">
                <Stars rating={t.rating} />
                <p className="mx-auto mt-5 max-w-xl text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Avatar name={t.authorName} avatarUrl={t.avatarUrl || null} avatarColor={colorFor(t.id)} size={44} />
                  <span className="text-left">
                    <p className="text-sm font-semibold text-foreground">{t.authorName}</p>
                    {t.authorRole ? <p className="text-xs text-muted">{t.authorRole}</p> : null}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 ? (
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial from ${item.authorName}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-6 brand-gradient-bg" : "w-2 bg-border-soft hover:bg-brand-300"
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
