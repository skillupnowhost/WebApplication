"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { AnimatedFolder } from "@/components/ui/icons/AnimatedFolder";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedTrophy } from "@/components/ui/icons/AnimatedTrophy";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedCrown } from "@/components/ui/icons/AnimatedCrown";
import { useTiltSpotlight } from "@/hooks/useTiltSpotlight";
import type { ShowcaseProject } from "@/lib/showcaseProjects";

const EASE = [0.16, 1, 0.3, 1] as const;

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "linear-gradient(135deg,#7c3aed,#c084fc)",
  "linear-gradient(135deg,#0ea5e9,#7dd3fc)",
  "linear-gradient(135deg,#059669,#6ee7b7)",
  "linear-gradient(135deg,#e11d48,#fda4af)",
  "linear-gradient(135deg,#d97706,#fde68a)",
  "linear-gradient(135deg,#4f46e5,#a5b4fc)",
];

/* Mesh-gradient "screens" inside the browser frame, one per project (cycled). */
const MESHES = [
  "radial-gradient(120% 140% at 12% 18%, rgba(192,132,252,.85) 0%, transparent 55%), radial-gradient(120% 140% at 88% 30%, rgba(34,211,238,.7) 0%, transparent 55%), linear-gradient(135deg, #6d28d9, #4f46e5)",
  "radial-gradient(120% 140% at 14% 20%, rgba(125,211,252,.85) 0%, transparent 55%), radial-gradient(120% 140% at 85% 28%, rgba(52,211,153,.65) 0%, transparent 55%), linear-gradient(135deg, #0369a1, #0e7490)",
  "radial-gradient(120% 140% at 12% 20%, rgba(110,231,183,.8) 0%, transparent 55%), radial-gradient(120% 140% at 88% 26%, rgba(253,224,71,.55) 0%, transparent 55%), linear-gradient(135deg, #047857, #0d9488)",
  "radial-gradient(120% 140% at 14% 18%, rgba(253,164,175,.85) 0%, transparent 55%), radial-gradient(120% 140% at 86% 30%, rgba(251,191,36,.6) 0%, transparent 55%), linear-gradient(135deg, #be123c, #c2410c)",
  "radial-gradient(120% 140% at 12% 20%, rgba(253,230,138,.8) 0%, transparent 55%), radial-gradient(120% 140% at 88% 26%, rgba(251,113,133,.6) 0%, transparent 55%), linear-gradient(135deg, #b45309, #d97706)",
  "radial-gradient(120% 140% at 14% 18%, rgba(165,180,252,.85) 0%, transparent 55%), radial-gradient(120% 140% at 86% 30%, rgba(192,132,252,.65) 0%, transparent 55%), linear-gradient(135deg, #3730a3, #6d28d9)",
];

export function ProjectsExplorer({ projects }: { projects: ShowcaseProject[] }) {
  const [tag, setTag] = useState("All");
  const tags = useMemo(() => ["All", ...new Set(projects.flatMap((p) => p.tags))], [projects]);
  const filtered = useMemo(
    () => (tag === "All" ? projects : projects.filter((p) => p.tags.includes(tag))),
    [projects, tag]
  );

  return (
    <div id="capstone-gallery" className="scroll-mt-24">
      {/* Section heading */}
      <motion.div
        className="flex items-center gap-2.5"
        initial={{ opacity: 0, x: -18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <AnimatedFolder className="h-7 w-7" />
        <h2 className="text-lg font-semibold sm:text-xl">Capstone gallery</h2>
        <span className="hidden h-px flex-1 bg-gradient-to-r from-border-soft to-transparent sm:block" />
      </motion.div>

      {/* Filter dock */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: EASE }}
        className="glass-panel no-scrollbar z-20 mt-5 flex items-center gap-2 overflow-x-auto rounded-2xl p-3 sm:mt-6 sm:flex-wrap sm:overflow-visible sm:rounded-full sm:px-4 lg:sticky lg:top-20"
      >
        {tags.map((t) => (
          <motion.button
            key={t}
            onClick={() => setTag(t)}
            whileTap={{ scale: 0.94 }}
            className={`relative inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 sm:px-4 sm:py-2 ${
              tag === t ? "text-white" : "text-foreground/80 hover:text-foreground"
            }`}
          >
            {tag === t ? (
              <motion.span
                layoutId="project-tag-pill"
                className="absolute inset-0 -z-10 rounded-full brand-gradient-bg shadow-[var(--shadow-soft)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : (
              <span className="absolute inset-0 -z-10 rounded-full bg-surface-2 transition-colors duration-200 hover:bg-surface-2/80" />
            )}
            {t !== "All" && <ContentIcon keyword={t} className="h-4 w-4" />}
            {t}
          </motion.button>
        ))}

        {/* Animated result count */}
        <span className="ml-auto hidden pr-2 text-xs text-muted sm:block">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${tag}-${filtered.length}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="inline-block"
            >
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.div>

      {/* Gallery — first card is a full-width spotlight on large screens */}
      <motion.div layout className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              colorIndex={projects.indexOf(p)}
              wide={i === 0 && filtered.length > 2}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <AnimatedFolder className="h-16 w-16 opacity-80" />
          <div>
            <p className="text-sm font-medium">No projects in this category yet</p>
            <p className="mt-1 text-xs text-muted">Check back soon — new capstones ship every cohort.</p>
          </div>
        </motion.div>
      )}

      {/* CTA strip */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-border-soft"
      >
        <div className="relative z-10 flex flex-col items-center gap-4 rounded-2xl bg-surface p-7 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left">
          <div className="flex items-center gap-3.5">
            <AnimatedTrophy className="hidden h-10 w-10 shrink-0 sm:inline-flex" />
            <div>
              <h3 className="text-lg font-semibold">Want your project featured here?</h3>
              <p className="mt-1 text-sm text-muted">Join a course cohort and build your capstone with a mentor.</p>
            </div>
          </div>
          <Link
            href="/courses"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full brand-gradient-bg px-5 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-transform duration-300 hover:scale-105"
          >
            Explore courses
            <AnimatedArrow className="h-4.5 w-4.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* Browser-chrome bar with traffic lights and a live URL pill. */
function ChromeBar({ slug, wide }: { slug: string; wide: boolean }) {
  return (
    <div className="relative z-10 flex shrink-0 items-center gap-2 border-b border-border-soft bg-surface-2/60 px-4 py-2.5">
      <span className="flex items-center gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </span>
      <span className="mx-1 min-w-0 flex-1 truncate rounded-md border border-border-soft bg-surface px-3 py-1 text-center text-[10px] text-muted">
        myloginn.dev/showcase/{slug}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-500">
        {wide ? (
          <>
            <AnimatedCrown className="h-4 w-4" /> Spotlight
          </>
        ) : (
          <>
            <AnimatedSparkle className="h-3.5 w-3.5" /> Capstone
          </>
        )}
      </span>
    </div>
  );
}

function ProjectCard({
  project: p,
  index,
  colorIndex,
  wide = false,
}: {
  project: ShowcaseProject;
  index: number;
  colorIndex: number;
  wide?: boolean;
}) {
  const { rotateX, rotateY, spotlightBg, onMouseMove, onMouseLeave } = useTiltSpotlight();
  const safeIndex = ((colorIndex % MESHES.length) + MESHES.length) % MESHES.length;
  const mesh = MESHES[safeIndex];
  const avatar = AVATAR_COLORS[safeIndex];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      className={`h-full ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY }}
        className="group h-full"
      >
        {/* Browser-window frame */}
        <div className="card-shine relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-border-soft bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-lift)]">
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spotlightBg }}
          />

          <ChromeBar slug={p.id} wide={wide} />

          <div className={`flex flex-1 flex-col ${wide ? "lg:grid lg:grid-cols-[0.85fr_1.15fr]" : ""}`}>
            {/* Screen: mesh gradient with floating category icon */}
            <div
              className={`relative flex shrink-0 items-center justify-center overflow-hidden ${
                wide ? "h-40 lg:h-full lg:min-h-[16rem]" : "h-32 sm:h-36"
              }`}
              style={{ background: mesh }}
            >
              {/* Subtle dot texture on the screen */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,.35) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
                aria-hidden
              />
              <span
                className="pointer-events-none absolute h-24 w-24 rounded-full bg-white/25 blur-2xl"
                style={{ animation: "pulse-glow 3.2s ease-in-out infinite" }}
                aria-hidden
              />
              <div className="animate-float relative flex flex-col items-center gap-1.5">
                <ContentIcon
                  keyword={p.tags[0] ?? p.title}
                  className={`drop-shadow-lg transition-transform duration-500 group-hover:scale-110 ${
                    wide ? "h-16 w-16" : "h-12 w-12"
                  }`}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/85">
                  {p.tags[0]}
                </span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
            </div>

            {/* Body */}
            <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <CategoryTag key={t} category={t} />
                ))}
              </div>

              <h3
                className={`mt-3.5 font-semibold leading-snug transition-colors duration-300 group-hover:text-brand-500 ${
                  wide ? "text-lg sm:text-xl" : "text-base"
                }`}
              >
                {p.title}
              </h3>
              <p className={`mt-2.5 flex-1 text-sm text-muted ${wide ? "" : "line-clamp-3"}`}>
                {p.description}
              </p>

              {/* Outcome metric */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border-l-[3px] border-brand-400 bg-brand-50 px-3.5 py-3 dark:bg-brand-900/25">
                <AnimatedTrophy className="h-7 w-7 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Outcome</p>
                  <p className="line-clamp-2 text-sm font-semibold text-foreground">{p.result}</p>
                </div>
              </div>

              {/* Student + mentor */}
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-soft pt-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <motion.span
                    className="animate-breathe-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                    style={{ background: avatar }}
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {initials(p.student)}
                  </motion.span>
                  <div className="min-w-0 text-xs leading-tight">
                    <p className="truncate font-medium text-foreground">{p.student}</p>
                    <p className="truncate text-muted">Learner</p>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
                  <AnimatedGraduation className="h-5 w-5 shrink-0" />
                  <span className="truncate">{p.mentor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
