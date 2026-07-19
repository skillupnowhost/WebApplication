"use client";

import { useRef } from "react";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

type Step = { title: string; description: string };

const steps: Step[] = [
  { title: "Discover your path", description: "Explore courses, tutoring and internships tailored to where you want to go." },
  { title: "Learn from real mentors", description: "Live sessions and 1:1 feedback from working professionals, not pre-recorded filler." },
  { title: "Build real projects", description: "Ship capstone work that goes in your portfolio, reviewed and refined by mentors." },
  { title: "Launch your career", description: "Certification, interview prep and a placement network that gets you hired." },
];

export function ProcessTimeline() {
  const scope = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!lineRef.current) return;
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );
      ScrollTrigger.refresh();
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
            From first click to career launch
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-4 top-4 bottom-4 w-px bg-border-soft lg:left-0 lg:right-0 lg:top-[26px] lg:bottom-auto lg:h-px lg:w-auto" />
          <div
            ref={lineRef}
            className="absolute left-4 top-4 bottom-4 w-px origin-top brand-gradient-bg lg:left-0 lg:right-0 lg:top-[26px] lg:bottom-auto lg:h-px lg:w-auto lg:origin-left"
            style={{ boxShadow: "0 0 16px 2px color-mix(in srgb, var(--accent-400) 60%, transparent)" }}
          />

          <ol className="relative flex flex-col gap-10 lg:grid lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <li key={step.title} className="relative flex gap-5 pl-2 lg:flex-col lg:gap-0 lg:pl-0 lg:text-center">
                <span
                  className="relative z-10 flex h-13 w-13 shrink-0 items-center justify-center rounded-full brand-gradient-bg text-lg font-semibold text-white lg:mx-auto"
                  style={{ animation: "pulse-glow 2.6s ease-in-out infinite" }}
                >
                  {i + 1}
                </span>
                <div className="pt-1 lg:pt-6">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
