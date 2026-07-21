"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { GlowCard } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { IconBadge } from "@/components/ui/IconBadge";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedExploreCourses } from "@/components/ui/icons/AnimatedExploreCourses";
import { useParallax } from "@/hooks/useParallax";
import type { CourseIconKey } from "@/lib/courseIcons";

type Module = {
  iconKey: CourseIconKey;
  title: string;
  description: string;
  href: string;
  color: string;
  span: "hero" | "wide" | "compact";
};

// Bento layout — column spans only (no row-span), so every tile stays a
// single grid row and row height auto-fits its row's tallest card instead of
// leaving dead space when a spanned tile's content doesn't fill 2 rows.
// Row 1 (lg): hero(2) + internships(1) + tutoring(1) = 4 cols
// Row 2 (lg): projects(1) + marketing(1) + webdev(2) = 4 cols
const modules: Module[] = [
  {
    iconKey: "ai",
    title: "Advanced Digital Marketing & AI/ML Courses",
    description:
      "Live sessions, personalized AI recommendations, mentor support and placement guidance for working professionals & graduates.",
    href: "/courses",
    color: "var(--brand-500)",
    span: "hero",
  },
  {
    iconKey: "career",
    title: "Internship Programs",
    description: "Paid & unpaid internships for IT and engineering students, certified with mentor feedback.",
    href: "/internships",
    color: "var(--brand-600)",
    span: "compact",
  },
  {
    iconKey: "student",
    title: "Online Tutoring",
    description: "Personalized CBSE & State Board tutoring with live classes and progress dashboards.",
    href: "/tutoring",
    color: "var(--accent-500)",
    span: "compact",
  },
  {
    iconKey: "leader",
    title: "Student Project Showcase",
    description: "Real capstone projects built by learners — browse for inspiration.",
    href: "/projects",
    color: "var(--brand-300)",
    span: "compact",
  },
  {
    iconKey: "marketing",
    title: "Digital Marketing Services",
    description: "AI-driven campaigns, optimized social ads, WhatsApp integration and real-time analytics.",
    href: "/services/digital-marketing",
    color: "var(--accent-600)",
    span: "compact",
  },
  {
    iconKey: "webdev",
    title: "App & Website Development",
    description: "Full-stack development, smooth animations and real-time updates for startups & enterprises.",
    href: "/services/app-web-development",
    color: "var(--brand-400)",
    span: "wide",
  },
];

const spanClasses: Record<Module["span"], string> = {
  hero: "sm:col-span-2 lg:col-span-2",
  compact: "",
  wide: "sm:col-span-2",
};

export function ModulesSection() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow>What we offer</Eyebrow>
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            <AnimatedText text="One platform. Every path forward." />
          </h2>
          <p className="mt-4 text-muted">
            Whether you&apos;re a student, a job-seeker, or a founder scaling a
            business &mdash; MyLoginn has a path built for you.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m, i) => (
            <ModuleCard key={m.title} module={m} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ModuleCard({ module: m, index: i }: { module: Module; index: number }) {
  const { ref, y: parallaxY } = useParallax(m.span === "hero" ? 0 : 14);
  const isHero = m.span === "hero";

  return (
    <motion.div ref={ref} style={{ y: parallaxY }} className={spanClasses[m.span]}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
        className="h-full"
      >
        <Link href={m.href} className="group block h-full">
          <TiltCard maxTilt={isHero ? 4 : 7} className="h-full">
            <GlowCard
              className={`flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] ${
                isHero ? "sm:p-8" : ""
              }`}
            >
              {isHero && (
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
                  style={{ background: m.color }}
                  aria-hidden
                />
              )}

              <IconBadge size={isHero ? "xl" : "lg"} style={{ color: m.color }} delay={i * 0.07} className="relative bg-transparent">
                <ContentIcon
                  keyword={m.iconKey}
                  className={isHero ? "h-14 w-14 sm:h-16 sm:w-16" : "h-11 w-11 sm:h-13 sm:w-13"}
                />
              </IconBadge>
              <h3 className={`relative mt-5 font-semibold leading-snug ${isHero ? "text-2xl sm:text-3xl" : "text-lg"}`}>
                {m.title}
              </h3>
              <p className={`relative mt-2.5 text-muted ${isHero ? "max-w-md text-base" : "text-sm"}`}>
                {m.description}
              </p>

              <span className="relative mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-brand-500">
                Explore
                {m.href === "/courses" ? (
                  <AnimatedExploreCourses className="h-5.5 w-5.5" />
                ) : (
                  <AnimatedArrow className="h-5 w-5" />
                )}
              </span>
            </GlowCard>
          </TiltCard>
        </Link>
      </motion.div>
    </motion.div>
  );
}
