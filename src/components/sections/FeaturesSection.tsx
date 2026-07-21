"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { useParallax } from "@/hooks/useParallax";
import type { CourseIconKey } from "@/lib/courseIcons";

const GlowGridScene = dynamic(() => import("@/components/cinematic/scenes/GlowGridScene"), { ssr: false });

const features: { iconKey: CourseIconKey; title: string; description: string }[] = [
  {
    iconKey: "ai",
    title: "AI-personalized paths",
    description: "Recommendations that adapt to your goals, pace and performance in real time.",
  },
  {
    iconKey: "comm",
    title: "Real mentor support",
    description: "1:1 feedback from working professionals across marketing, AI/ML and engineering.",
  },
  {
    iconKey: "data",
    title: "Live progress tracking",
    description: "Dashboards for courses, internships and projects update the moment you act.",
  },
  {
    iconKey: "testing",
    title: "Verified certification",
    description: "Course and internship certificates recognized by our hiring & mentor network.",
  },
];

export function FeaturesSection() {
  const { ref: lineRef, y: lineY } = useParallax(18);

  return (
    <Section className="relative overflow-hidden">
      <div className="outcomes-mesh" />
      <div className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-45">
        <GlowGridScene />
      </div>

      <Container className="relative grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>Why MyLoginn</Eyebrow>
          <h2 className="mt-5 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
            <AnimatedText text="Built for outcomes, not just content" />
          </h2>
          <p className="mt-4 max-w-sm text-muted">
            Every path on MyLoginn is engineered around a real outcome &mdash; a
            job, a certificate, a shipped project &mdash; not passive video
            watching.
          </p>
        </Reveal>

        <div ref={lineRef} className="relative">
          <motion.div
            aria-hidden
            style={{ y: lineY }}
            className="pointer-events-none absolute -left-5 top-0 hidden h-full w-px sm:block"
          >
            <div
              className="h-full w-full bg-gradient-to-b from-transparent via-brand-400/60 to-transparent"
              style={{ boxShadow: "0 0 20px 1px color-mix(in srgb, var(--accent-400) 45%, transparent)" }}
            />
          </motion.div>

          <RevealGroup className="flex flex-col" stagger={0.12}>
            {features.map((f, i) => (
              <RevealItem key={f.title}>
                <div
                  className={`group flex items-start gap-5 border-border-soft py-6 transition-colors duration-300 ${
                    i > 0 ? "border-t" : ""
                  }`}
                >
                  <IconBadge
                    size="lg"
                    className="shrink-0 bg-transparent text-brand-500 dark:text-brand-400"
                    delay={i * 0.1}
                  >
                    <ContentIcon keyword={f.iconKey} className="h-10 w-10 sm:h-12 sm:w-12" />
                  </IconBadge>
                  <div className="pt-1">
                    <h3 className="font-semibold transition-transform duration-300 group-hover:translate-x-1">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted">{f.description}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
