"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { useParallax } from "@/hooks/useParallax";

// This panel is always rendered dark regardless of site theme, so the dark-
// tuned WebGL scene never clashes with a light page the way it would if
// dropped behind a normal (theme-following) section.
const GlowGridScene = dynamic(() => import("@/components/cinematic/scenes/GlowGridScene"), { ssr: false });

const trustStrip = [
  "AI/ML & Digital Marketing Courses",
  "1,200+ Internships Placed",
  "CBSE & State Board Tutoring",
  "Real Mentor Support",
  "AI-Driven Growth Services",
  "50k+ Learners Upskilled",
];

export function CTASection() {
  const { ref, y: parallaxY } = useParallax(24);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="marquee-mask mb-8 overflow-hidden">
          <div
            className="animate-marquee flex w-max gap-3"
            style={{ "--marquee-duration": "34s" } as CSSProperties}
          >
            {[...trustStrip, ...trustStrip].map((item, i) => (
              <span
                key={i}
                className="glass-panel whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* extra glow ring so the card pops off a near-black dark background */}
          <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-[radial-gradient(60%_80%_at_50%_50%,var(--brand-500),transparent_70%)] opacity-0 blur-2xl dark:opacity-45" />

          <div className="relative overflow-hidden rounded-3xl cta-mesh px-8 py-16 text-center text-white shadow-[var(--shadow-lift)] ring-1 ring-white/10 sm:px-16 sm:py-24 dark:ring-accent-400/25">
            <div className="luxe-topline" />
            <GlowGridScene />
            <div className="starfield opacity-50" />
            {/* subtle dot-grid texture, faded toward the edges */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                maskImage:
                  "radial-gradient(ellipse 75% 65% at 50% 40%, black 40%, transparent 85%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 75% 65% at 50% 40%, black 40%, transparent 85%)",
              }}
            />
            <motion.div
              style={{ y: parallaxY }}
              className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            />
            <motion.div
              style={{ y: parallaxY }}
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            />

            <div className="relative flex justify-center">
              <Eyebrow className="border-white/25 bg-white/10 text-white">
                <AnimatedSparkle className="h-4 w-4" />
                Join the next cohort
              </Eyebrow>
            </div>
            <h2 className="relative mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              <AnimatedText text="Ready to build your future with AI?" className="text-white" />
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg">
              Join thousands of learners, interns and businesses already growing
              with MyLoginn.
            </p>
            <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <div className="group relative">
                <div className="absolute -inset-1.5 rounded-full bg-white/50 opacity-60 blur-lg transition-opacity duration-300 group-hover:opacity-90" />
                <Button
                  href="/signup"
                  size="lg"
                  className="relative !bg-none !bg-white !text-brand-600 shadow-2xl hover:!brightness-95"
                  icon={<AnimatedArrow className="h-5.5 w-5.5" />}
                >
                  Create your free account
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
