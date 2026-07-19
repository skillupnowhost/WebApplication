"use client";

import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { ContentIcon } from "@/components/ui/ContentIcon";
import type { CourseIconKey } from "@/lib/courseIcons";

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
  return (
    <Section className="relative overflow-hidden bg-surface-2/50">
      <div className="bg-dot-grid pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow>Why MyLoginn</Eyebrow>
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for outcomes, not just content
          </h2>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {features.map((f, i) => (
            <RevealItem key={f.title}>
              <TiltCard maxTilt={6} className="h-full">
                <GlassCard className="flex h-full items-start gap-4 p-5 text-left transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] sm:block sm:p-6">
                  <IconBadge
                    size="xl"
                    className="h-12 w-12 shrink-0 text-brand-500 dark:text-brand-400 sm:h-22 sm:w-22"
                    delay={i * 0.1}
                  >
                    <ContentIcon keyword={f.iconKey} className="h-7 w-7 sm:h-14 sm:w-14" />
                  </IconBadge>
                  <div>
                    <h3 className="font-semibold sm:mt-4">{f.title}</h3>
                    <p className="mt-1 text-sm text-muted sm:mt-2">{f.description}</p>
                  </div>
                </GlassCard>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
