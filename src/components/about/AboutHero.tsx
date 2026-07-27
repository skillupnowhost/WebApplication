"use client";

import { motion } from "framer-motion";
import { Section, Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedTrending } from "@/components/ui/icons/AnimatedTrending";
import { useParallax } from "@/hooks/useParallax";
import { useTiltSpotlight } from "@/hooks/useTiltSpotlight";
import { PillBadge } from "@/components/about/PillBadge";
import { CornerTechIcons } from "@/components/about/CornerTechIcons";
import { HeroMotionGraphics } from "@/components/about/HeroMotionGraphics";

export function AboutHero({
  heroTitle,
  heroTagline,
  overview,
  sinceYear,
}: {
  heroTitle: string;
  heroTagline: string;
  overview: string;
  /** Earliest company-milestone year (e.g. "2013"), shown as a credibility badge — undefined hides it. */
  sinceYear?: string;
}) {
  const { ref: parallaxRef, y: parallaxY } = useParallax(36);
  const { rotateX, rotateY, spotlightBg, onMouseMove, onMouseLeave } = useTiltSpotlight();

  const foundedYear = sinceYear ? parseInt(sinceYear, 10) : null;
  const yearsOfGrowth =
    foundedYear && Number.isFinite(foundedYear) ? Math.max(new Date().getFullYear() - foundedYear, 1) : null;

  return (
    <div ref={parallaxRef} className="relative overflow-hidden bg-[#FBF9F5] dark:bg-surface-2">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.35]" />
      <CornerTechIcons />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--brand-100),transparent_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(108,77,255,0.14),transparent_70%)]" />
      <motion.div
        style={{ y: parallaxY }}
        className="pointer-events-none absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(108,77,255,0.14),transparent_70%)] blur-2xl"
      />
      <motion.div
        style={{ y: parallaxY }}
        className="pointer-events-none absolute top-40 left-[4%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(108,77,255,0.1),transparent_70%)] blur-2xl"
      />

      <Section className="pb-12 sm:pb-16">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* Left: interactive tilt-and-spotlight motion graphics, with a floating growth callout */}
            <Reveal direction="left" distance={36} className="order-2 lg:order-1">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <motion.div
                  onMouseMove={onMouseMove}
                  onMouseLeave={onMouseLeave}
                  style={{ rotateX, rotateY, transformPerspective: 1000 }}
                  className="relative"
                >
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -inset-2 -z-10 rounded-[2.5rem] opacity-40 blur-xl"
                    style={{ background: "conic-gradient(from 0deg, var(--brand-300), var(--brand-500), var(--brand-400), var(--brand-300))" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-10 rounded-[2rem]"
                    style={{ background: spotlightBg }}
                  />
                  <HeroMotionGraphics />
                </motion.div>

                {yearsOfGrowth && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                    className="card-shine absolute -bottom-6 -right-4 z-20 flex items-center gap-3 rounded-2xl border border-border-soft bg-surface px-4 py-3.5 shadow-[var(--shadow-lift)] sm:-right-8"
                  >
                    <motion.span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl brand-gradient-bg text-white"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <AnimatedTrending className="h-5 w-5" />
                    </motion.span>
                    <div className="leading-tight">
                      <p className="shimmer-text-ink text-xl font-extrabold tracking-tight">{yearsOfGrowth}+ yrs</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">of growth</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </Reveal>

            {/* Right: headline + copy */}
            <div className="order-1 text-center lg:order-2 lg:text-left">
              <Reveal>
                <div className="flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                  <PillBadge>
                    <AnimatedSparkle className="h-4 w-4" />
                    About Us
                  </PillBadge>
                  {sinceYear && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-600 dark:border-brand-800 dark:bg-brand-900/25 dark:text-brand-300"
                    >
                      <motion.span
                        className="h-1.5 w-1.5 rounded-full bg-brand-500"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      Building since {sinceYear}
                    </motion.span>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.1} scale>
                <h1 className="cinematic-title mt-6 font-semibold">
                  <AnimatedText text={heroTitle} wordClassName="shimmer-text-ink" delay={0.2} />
                </h1>
                <div className="mx-auto mt-4 h-[3px] w-[120px] rounded-full brand-gradient-bg lg:mx-0" />
              </Reveal>

              {heroTagline && (
                <Reveal delay={0.18}>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-muted">{heroTagline}</p>
                </Reveal>
              )}

              {overview && (
                <Reveal delay={0.26}>
                  <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{overview}</p>
                </Reveal>
              )}

              <Reveal delay={0.34}>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <Button href="/signup" size="lg" icon={<AnimatedArrow className="h-4.5 w-4.5" />}>
                    Get started
                  </Button>
                  <Button href="#our-journey" size="lg" variant="outline" icon={<AnimatedChevron direction="down" className="h-4.5 w-4.5" />}>
                    See how we grew
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
