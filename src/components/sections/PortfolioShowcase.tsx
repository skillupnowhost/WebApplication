"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { GlowCard } from "@/components/ui/Card";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { Button } from "@/components/ui/Button";
import { useGSAP, gsap } from "@/lib/gsap";
import type { ShowcaseProject } from "@/lib/showcaseProjects";

const MESHES = [
  "radial-gradient(120% 140% at 12% 18%, rgba(192,132,252,.55) 0%, transparent 55%), radial-gradient(120% 140% at 88% 30%, rgba(34,211,238,.45) 0%, transparent 55%), linear-gradient(135deg, #6d28d9, #4f46e5)",
  "radial-gradient(120% 140% at 14% 20%, rgba(125,211,252,.55) 0%, transparent 55%), radial-gradient(120% 140% at 85% 28%, rgba(52,211,153,.4) 0%, transparent 55%), linear-gradient(135deg, #0369a1, #0e7490)",
  "radial-gradient(120% 140% at 12% 20%, rgba(110,231,183,.5) 0%, transparent 55%), radial-gradient(120% 140% at 88% 26%, rgba(253,224,71,.35) 0%, transparent 55%), linear-gradient(135deg, #047857, #0d9488)",
];

export function PortfolioShowcase({ projects }: { projects: ShowcaseProject[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rail = railRef.current;
      const progress = progressRef.current;
      if (!rail || !progress) return;
      const onScroll = () => {
        const max = rail.scrollWidth - rail.clientWidth;
        const pct = max > 0 ? rail.scrollLeft / max : 0;
        gsap.to(progress, { scaleX: pct, duration: 0.2, ease: "power1.out", overwrite: true });
      };
      rail.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => rail.removeEventListener("scroll", onScroll);
    },
    { scope: railRef }
  );

  if (projects.length === 0) return null;

  return (
    <Section className="relative overflow-hidden">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Student showcase</Eyebrow>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Real projects, built by real learners
            </h2>
          </div>
          <Button href="/projects" variant="secondary" icon={<AnimatedArrow className="h-4.5 w-4.5" />}>
            View all projects
          </Button>
        </div>

        <div
          ref={railRef}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group w-[min(85vw,340px)] shrink-0 snap-start"
            >
              <Link href={`/projects#capstone-gallery`}>
                <GlowCard className="flex h-full flex-col p-0">
                  <div
                    className="h-32 rounded-t-2xl"
                    style={{ background: MESHES[i % MESHES.length] }}
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold leading-snug">{p.title}</h3>
                    <p className="mt-1 text-xs font-medium text-brand-500">{p.result}</p>
                    <p className="mt-2.5 line-clamp-2 flex-1 text-sm text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {p.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted">
                      <span>{p.student}</span>
                      <span>Mentor: {p.mentor}</span>
                    </div>
                  </div>
                </GlowCard>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-surface-2">
          <div ref={progressRef} className="h-full w-full origin-left scale-x-0 brand-gradient-bg" />
        </div>
      </Container>
    </Section>
  );
}
