"use client";

import { motion } from "framer-motion";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedRocket } from "@/components/ui/icons/AnimatedRocket";
import { AnimatedBulb } from "@/components/ui/icons/AnimatedBulb";
import { AnimatedTrending } from "@/components/ui/icons/AnimatedTrending";
import { AnimatedShield } from "@/components/ui/icons/AnimatedShield";
import { AnimatedAi } from "@/components/ui/icons/AnimatedAi";
import { useParallax } from "@/hooks/useParallax";

const OFFERING_ICONS = [AnimatedSparkle, AnimatedRocket, AnimatedBulb, AnimatedTrending, AnimatedShield, AnimatedAi];

export type Offering = { id: string; title: string; description: string };

export function AboutHero({
  heroTitle,
  heroTagline,
  overview,
  mission,
  offerings,
}: {
  heroTitle: string;
  heroTagline: string;
  overview: string;
  mission: string;
  offerings: Offering[];
}) {
  const { ref: parallaxRef, y: parallaxY } = useParallax(36);

  return (
    <div ref={parallaxRef} className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--brand-100),transparent_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(108,77,255,0.14),transparent_70%)]" />
      <motion.div
        style={{ y: parallaxY }}
        className="pointer-events-none absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(108,77,255,0.16),transparent_70%)] blur-2xl"
      />
      <motion.div
        style={{ y: parallaxY }}
        className="pointer-events-none absolute top-40 left-[4%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.14),transparent_70%)] blur-2xl"
      />

      <Section className="pb-12 sm:pb-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="flex justify-center">
                <Eyebrow>
                  <AnimatedSparkle className="h-4.5 w-4.5" />
                  About Us
                </Eyebrow>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="cinematic-title mt-6 font-semibold">
                <span className="brand-gradient-text">{heroTitle}</span>
              </h1>
            </Reveal>

            {heroTagline && (
              <Reveal delay={0.18}>
                <p className="mt-5 text-lg font-medium text-foreground/80 sm:text-xl">{heroTagline}</p>
              </Reveal>
            )}

            {overview && (
              <Reveal delay={0.26}>
                <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{overview}</p>
              </Reveal>
            )}
          </div>

          {mission && (
            <Reveal delay={0.32} scale>
              <div className="glass-panel relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl px-6 py-8 text-center sm:px-12 sm:py-10">
                <div className="pointer-events-none absolute inset-0 opacity-40 brand-gradient-bg [mask-image:linear-gradient(180deg,black,transparent)]" />
                <p className="relative text-xs font-bold uppercase tracking-[0.2em] brand-gradient-text">Our mission</p>
                <p className="relative mt-3 text-lg font-medium leading-relaxed sm:text-xl">{mission}</p>
              </div>
            </Reveal>
          )}

          {offerings.length > 0 && (
            <div className="mt-16 sm:mt-20">
              <Reveal>
                <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Key offerings</h2>
              </Reveal>
              <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
                {offerings.map((o, i) => {
                  const Icon = OFFERING_ICONS[i % OFFERING_ICONS.length];
                  return (
                    <RevealItem key={o.id}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.25 }}
                        className="flex h-full flex-col items-start gap-4 rounded-2xl border border-border-soft bg-surface p-6 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
                      >
                        <IconBadge size="sm" className="bg-brand-50 text-brand-600 dark:bg-brand-900/25 dark:text-brand-300">
                          <Icon className="h-6.5 w-6.5" />
                        </IconBadge>
                        <div>
                          <h3 className="font-semibold">{o.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted">{o.description}</p>
                        </div>
                      </motion.div>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
