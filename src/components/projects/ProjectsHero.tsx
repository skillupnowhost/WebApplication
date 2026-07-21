"use client";

import { ExplorerHero } from "@/components/ui/ExplorerHero";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedRocket } from "@/components/ui/icons/AnimatedRocket";
import { AnimatedTrophy } from "@/components/ui/icons/AnimatedTrophy";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";

const MONOGRAMS = [
  "linear-gradient(135deg,#7c3aed,#c084fc)",
  "linear-gradient(135deg,#0ea5e9,#67e8f9)",
  "linear-gradient(135deg,#059669,#6ee7b7)",
  "linear-gradient(135deg,#e11d48,#fb923c)",
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function ProjectsHero({
  projectCount,
  mentorCount,
  categoryCount,
  categories,
  students,
}: {
  projectCount: number;
  mentorCount: number;
  categoryCount: number;
  categories: string[];
  students: string[];
}) {
  const cluster = students.slice(0, 4).map((s, i) => (
    <span
      key={s}
      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white sm:h-9 sm:w-9 sm:text-[11px]"
      style={{ background: MONOGRAMS[i % MONOGRAMS.length] }}
      title={s}
    >
      {initials(s)}
    </span>
  ));

  const marqueeItems = categories.map((c) => (
    <span
      key={c}
      className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-1.5 text-sm font-medium text-foreground/80"
    >
      <ContentIcon keyword={c} className="h-4.5 w-4.5" />
      {c}
    </span>
  ));

  return (
    <ExplorerHero
      eyebrowIcon={AnimatedRocket}
      eyebrowText="Built by Learners"
      titleLead="Proof over promises:"
      titleGradient="projects that shipped"
      description="Every card below is a real capstone: built by a MyLoginn learner, reviewed by a mentor, and measured by the result it delivered."
      chips={[
        { icon: AnimatedTrophy, text: "Measurable outcomes" },
        { icon: AnimatedSparkle, text: "Mentor-reviewed builds" },
        { icon: AnimatedGraduation, text: "Cohort capstones" },
      ]}
      ctaHref="#capstone-gallery"
      ctaLabel="Browse the gallery"
      ctaNote={`${mentorCount} mentors reviewing builds`}
      heroIcon={AnimatedTrophy}
      heroValue={projectCount}
      heroLabel="Projects shipped"
      cluster={cluster}
      clusterLabel="Built by real learners in course cohorts"
      stats={[
        { icon: AnimatedUsers, label: "Mentors involved", value: mentorCount },
        { icon: AnimatedLayers, label: "Categories covered", value: categoryCount },
      ]}
      marqueeLabel="Explore categories"
      marqueeItems={marqueeItems}
    />
  );
}
