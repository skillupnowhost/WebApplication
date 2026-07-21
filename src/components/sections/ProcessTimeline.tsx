"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { IconBadge } from "@/components/ui/IconBadge";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { cn } from "@/lib/cn";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import type { CourseIconKey } from "@/lib/courseIcons";

type Step = { iconKey: CourseIconKey; title: string; description: string };

const steps: Step[] = [
  { iconKey: "ai", title: "Discover your path", description: "Explore courses, tutoring and internships tailored to where you want to go." },
  { iconKey: "comm", title: "Learn from real mentors", description: "Live sessions and 1:1 feedback from working professionals, not pre-recorded filler." },
  { iconKey: "leader", title: "Build real projects", description: "Ship capstone work that goes in your portfolio, reviewed and refined by mentors." },
  { iconKey: "career", title: "Launch your career", description: "Certification, interview prep and a placement network that gets you hired." },
];

function StepCard({ step, index, active, className }: { step: Step; index: number; active: boolean; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass-panel card-shine relative z-10 flex flex-col items-center gap-2.5 rounded-2xl px-5 pb-6 pt-7 text-center transition-all duration-500",
        active ? "-translate-y-2 shadow-[var(--shadow-lift)] ring-1 ring-brand-400/40" : "opacity-70",
        className
      )}
    >
      <span className="absolute left-5 top-4 text-xs font-semibold tracking-wider text-muted">
        0{index + 1}
      </span>
      <IconBadge size="lg" className="bg-transparent" delay={index * 0.08}>
        <ContentIcon keyword={step.iconKey} className="h-14 w-14" />
      </IconBadge>
      <h3 className="mt-1 font-semibold">{step.title}</h3>
      <p className="text-sm text-muted">{step.description}</p>
    </motion.div>
  );
}

export function ProcessTimeline() {
  const scope = useRef<HTMLDivElement>(null);
  const desktopRowRef = useRef<HTMLDivElement>(null);
  const desktopLineRef = useRef<HTMLDivElement>(null);
  const desktopHeadRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);
  const mobileHeadRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: desktopRowRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 0.6,
          onUpdate: (self) => {
            gsap.set(desktopLineRef.current, { width: `${self.progress * 100}%` });
            gsap.set(desktopHeadRef.current, { left: `${self.progress * 100}%`, opacity: self.progress > 0.01 ? 1 : 0 });
            const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            setActive((prev) => (prev === idx ? prev : idx));
          },
        });
        return () => st.kill();
      });

      mm.add("(max-width: 1023px)", () => {
        const st = ScrollTrigger.create({
          trigger: mobileListRef.current,
          start: "top 85%",
          end: "bottom 65%",
          scrub: 0.6,
          onUpdate: (self) => {
            gsap.set(mobileLineRef.current, { height: `${self.progress * 100}%` });
            gsap.set(mobileHeadRef.current, { top: `${self.progress * 100}%`, opacity: self.progress > 0.01 ? 1 : 0 });
            const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            setActive((prev) => (prev === idx ? prev : idx));
          },
        });
        return () => st.kill();
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <Section className="relative overflow-hidden">
      <Container ref={scope}>
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow>How it works</Eyebrow>
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            <AnimatedText text="From first click to career launch" />
          </h2>
        </div>

        {/* Desktop: all 4 steps visible as cards on a glowing connector line
            that draws in and lights each card as the section scrolls into view. */}
        <div ref={desktopRowRef} className="relative mt-16 hidden lg:block">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-16 h-6 -translate-y-1/2">
            <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-[repeating-linear-gradient(90deg,var(--border-soft)_0_8px,transparent_8px_16px)]" />
            <div
              ref={desktopLineRef}
              className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full brand-gradient-bg"
              style={{ width: "0%", boxShadow: "0 0 16px 2px color-mix(in srgb, var(--accent-400) 60%, transparent)" }}
            >
              <div className="timeline-flow-x absolute inset-0" />
            </div>
            <div ref={desktopHeadRef} className="timeline-head top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 opacity-0" />
            {steps.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500",
                  i <= active
                    ? "border-brand-500 bg-white shadow-[0_0_10px_2px_color-mix(in_srgb,var(--accent-400)_60%,transparent)]"
                    : "border-border-soft bg-surface"
                )}
                style={{ left: `${(i / (steps.length - 1)) * 100}%` }}
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} active={i <= active} />
            ))}
          </div>
        </div>

        {/* Mobile / tablet: stacked steps with a scroll-drawn connector line
            running centered behind the cards, visible in the gaps between them. */}
        <div ref={mobileListRef} className="relative mt-16 lg:hidden">
          <div className="absolute left-1/2 top-9 bottom-9 w-6 -translate-x-1/2">
            <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 overflow-hidden rounded-full bg-[repeating-linear-gradient(180deg,var(--border-soft)_0_8px,transparent_8px_16px)]" />
            <div
              ref={mobileLineRef}
              className="absolute top-0 left-1/2 w-[3px] -translate-x-1/2 overflow-hidden rounded-full brand-gradient-bg"
              style={{ height: "0%", boxShadow: "0 0 16px 2px color-mix(in srgb, var(--accent-400) 60%, transparent)" }}
            >
              <div className="timeline-flow-y absolute inset-0" />
            </div>
            <div ref={mobileHeadRef} className="timeline-head left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 opacity-0" />
          </div>
          <ol className="relative flex flex-col gap-6">
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} active={i <= active} />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
