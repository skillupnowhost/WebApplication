"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { GlowCard } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useGSAP, gsap } from "@/lib/gsap";
import type { ShowcaseProject } from "@/lib/showcaseProjects";

const MESHES = [
  "radial-gradient(120% 140% at 12% 18%, rgba(192,132,252,.55) 0%, transparent 55%), radial-gradient(120% 140% at 88% 30%, rgba(34,211,238,.45) 0%, transparent 55%), linear-gradient(135deg, #6d28d9, #4f46e5)",
  "radial-gradient(120% 140% at 14% 20%, rgba(125,211,252,.55) 0%, transparent 55%), radial-gradient(120% 140% at 85% 28%, rgba(52,211,153,.4) 0%, transparent 55%), linear-gradient(135deg, #0369a1, #0e7490)",
  "radial-gradient(120% 140% at 12% 20%, rgba(110,231,183,.5) 0%, transparent 55%), radial-gradient(120% 140% at 88% 26%, rgba(253,224,71,.35) 0%, transparent 55%), linear-gradient(135deg, #047857, #0d9488)",
];

function RailNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={direction === "prev" ? "Previous projects" : "Next projects"}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={cn(
        "glass-panel flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground transition-opacity duration-300",
        disabled ? "cursor-not-allowed opacity-35" : "hover:border-brand-400"
      )}
    >
      <span className={cn("inline-flex h-4.5 w-4.5", direction === "prev" && "rotate-180")}>
        <AnimatedArrow className="h-4.5 w-4.5" />
      </span>
    </motion.button>
  );
}

export function PortfolioShowcase({ projects }: { projects: ShowcaseProject[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useGSAP(
    () => {
      const rail = railRef.current;
      if (!rail) return;

      const onScroll = () => {
        const max = rail.scrollWidth - rail.clientWidth;
        setCanPrev(rail.scrollLeft > 4);
        setCanNext(rail.scrollLeft < max - 4);

        // Coverflow emphasis: cards nearest the rail's visual center scale up
        // and sharpen while off-center cards recede — scrubbed by scroll
        // position rather than a one-shot viewport reveal.
        const railRect = rail.getBoundingClientRect();
        const center = railRect.left + railRect.width / 2;
        let nearestIdx = 0;
        let nearestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const rawDist = Math.abs(cardCenter - center);
          const dist = Math.min(rawDist / (railRect.width / 2), 1);
          if (rawDist < nearestDist) {
            nearestDist = rawDist;
            nearestIdx = i;
          }
          gsap.to(card, {
            scale: 1 - dist * 0.08,
            opacity: 1 - dist * 0.35,
            duration: 0.25,
            ease: "power1.out",
            overwrite: true,
          });
        });
        setActive((prev) => (prev === nearestIdx ? prev : nearestIdx));
      };
      rail.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => rail.removeEventListener("scroll", onScroll);
    },
    { scope: railRef, dependencies: [projects.length] }
  );

  // Re-run the center-emphasis pass once images/layout settle (initial mount).
  useEffect(() => {
    const id = requestAnimationFrame(() => railRef.current?.dispatchEvent(new Event("scroll")));
    return () => cancelAnimationFrame(id);
  }, [projects.length]);

  function scrollByPage(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  }

  function scrollToIndex(i: number) {
    const rail = railRef.current;
    const card = cardRefs.current[i];
    if (!rail || !card) return;
    const railRect = rail.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const delta = cardRect.left + cardRect.width / 2 - (railRect.left + railRect.width / 2);
    rail.scrollBy({ left: delta, behavior: "smooth" });
  }

  if (projects.length === 0) return null;

  return (
    <Section className="relative overflow-hidden">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Student showcase</Eyebrow>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              <AnimatedText text="Real projects, built by real learners" />
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <RailNavButton direction="prev" disabled={!canPrev} onClick={() => scrollByPage(-1)} />
              <RailNavButton direction="next" disabled={!canNext} onClick={() => scrollByPage(1)} />
            </div>
            <Button href="/projects" variant="secondary" icon={<AnimatedArrow className="h-4.5 w-4.5" />}>
              View all projects
            </Button>
          </div>
        </div>

        <div
          ref={railRef}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto py-4"
        >
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="group w-[min(85vw,340px)] shrink-0 snap-start [transform-style:preserve-3d]"
            >
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard maxTilt={6}>
                  <Link href={`/projects#capstone-gallery`}>
                    <GlowCard className="flex h-full flex-col p-0 transition-transform duration-300 hover:-translate-y-1.5">
                      <div
                        className="h-32 rounded-t-2xl bg-size-200"
                        style={{ backgroundImage: MESHES[i % MESHES.length] }}
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
                </TiltCard>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Show ${p.title}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-6 brand-gradient-bg" : "w-2 bg-border-soft hover:bg-brand-300"
              )}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
