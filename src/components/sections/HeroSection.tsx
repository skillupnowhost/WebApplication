"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedExploreCourses } from "@/components/ui/icons/AnimatedExploreCourses";
import { Eyebrow } from "@/components/ui/Section";
import { RotatingHeadline } from "@/components/ui/RotatingHeadline";
import { IconBadge } from "@/components/ui/IconBadge";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { HeroOrbitIcons } from "@/components/sections/HeroOrbitIcons";
import { useTiltSpotlight } from "@/hooks/useTiltSpotlight";
import { useGSAP, gsap } from "@/lib/gsap";
import type { CourseIconKey } from "@/lib/courseIcons";
import heroImage from "@/images/Hero Section images/15.png";

const heroPhrases = [
  "Where Potential Meets Opportunity",
  "Elevating Learning, Empowering Careers",
  "Learning with Direction. Careers with Impact.",
  "From Aspiration to Achievement",
  "A Smarter Path to Professional Growth",
];

const stats: { iconKey: CourseIconKey; value: string; label: string; ring: string }[] = [
  { iconKey: "student", value: "AI-personalized", label: "Learning paths", ring: "border-brand-400/50 text-brand-600 dark:border-brand-300/40 dark:text-brand-300" },
  { iconKey: "career", value: "Real", label: "Internship placements", ring: "border-teal-400/50 text-teal-600 dark:border-teal-300/40 dark:text-teal-300" },
  { iconKey: "comm", value: "Live", label: "Mentor 1:1 support", ring: "border-amber-400/50 text-amber-600 dark:border-amber-300/40 dark:text-amber-300" },
];

export function HeroSection() {
  const { spotlightBg, onMouseMove, onMouseLeave } = useTiltSpotlight();
  const stageRef = useRef<HTMLDivElement>(null);

  // Camera-style reveal: the whole hero pulls into focus from a dim, soft-blurred
  // wide shot on first paint, instead of a plain fade.
  useGSAP(
    () => {
      gsap.fromTo(
        stageRef.current,
        { scale: 1.05, filter: "brightness(0.45) blur(10px)" },
        { scale: 1, filter: "brightness(1) blur(0px)", duration: 1.3, ease: "power3.out" }
      );
    },
    { scope: stageRef }
  );

  return (
    <div ref={stageRef} className="relative overflow-hidden">
      <div className="starfield opacity-60 dark:opacity-80" />
      <div
        className="volumetric-beam left-[8%] top-[-10%] h-[70rem] w-[24rem]"
        style={{ "--beam-angle": "14deg" } as React.CSSProperties}
      />
      <div
        className="volumetric-beam right-[4%] top-[-16%] h-[70rem] w-[18rem]"
        style={{ "--beam-angle": "-10deg" } as React.CSSProperties}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--brand-100),transparent_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(108,77,255,0.18),transparent_70%)]" />

      <div className="mx-auto grid max-w-[85rem] grid-cols-1 items-center gap-12 px-5 pt-14 pb-10 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1.5fr] lg:gap-8 lg:pt-24">
        <div
          className="relative z-10 text-center lg:text-left"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <motion.div
            aria-hidden
            style={{ background: spotlightBg }}
            className="pointer-events-none absolute -inset-x-10 -inset-y-16 -z-10 hidden lg:block"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-start"
          >
            <Eyebrow>
              <AnimatedSparkle className="h-4.5 w-4.5" />
              AI Agent · Live Now
            </Eyebrow>
          </motion.div>

          <h1 className="cinematic-title mt-6 font-semibold">
            <RotatingHeadline phrases={heroPhrases} gradientClassName="brand-gradient-text" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg lg:mx-0"
          >
            Advanced AI/ML &amp; digital marketing courses, personalized CBSE/State
            Board tutoring, real internships, and AI-driven growth services &mdash;
            all on one premium platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Button href="/signup" size="lg" icon={<AnimatedArrow className="h-5 w-5" />}>
              Get started free
            </Button>
            <Button href="/courses" size="lg" variant="secondary" icon={<AnimatedExploreCourses className="h-5 w-5" />}>
              Explore courses
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3 text-left"
              >
                <IconBadge size="sm" className={`border bg-transparent ${s.ring}`}>
                  <ContentIcon keyword={s.iconKey} className="h-6 w-6" />
                </IconBadge>
                <span>
                  <p className="text-lg font-semibold text-foreground sm:text-xl">{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 6, delay: 1.3, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative -mx-5 w-[calc(100%+2.5rem)] max-w-none sm:mx-auto sm:w-full sm:max-w-2xl lg:mx-0 lg:w-[118%] lg:max-w-none"
        >
          <Image
            src={heroImage}
            alt="An AI mentor extending a hand in welcome"
            preload
            sizes="(min-width: 1024px) 720px, 100vw"
            className="relative z-10 h-auto w-full select-none"
          />
          <HeroOrbitIcons />
        </motion.div>
      </div>
    </div>
  );
}
