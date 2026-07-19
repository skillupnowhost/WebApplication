"use client";

import { ExplorerHero } from "@/components/ui/ExplorerHero";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { AnimatedBook } from "@/components/ui/icons/AnimatedBook";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedAi } from "@/components/ui/icons/AnimatedAi";

const MONOGRAMS = [
  "linear-gradient(135deg,#7c3aed,#c084fc)",
  "linear-gradient(135deg,#0ea5e9,#67e8f9)",
  "linear-gradient(135deg,#059669,#6ee7b7)",
  "linear-gradient(135deg,#e11d48,#fb923c)",
];

export function CoursesHero({
  courseCount,
  studentsCount,
  avgRating,
  categories,
  instructors,
}: {
  courseCount: number;
  studentsCount: number;
  avgRating: number;
  categories: string[];
  instructors: string[];
}) {
  const cluster = instructors.slice(0, 4).map((name, i) => (
    <span
      key={name}
      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white sm:h-9 sm:w-9 sm:text-[11px]"
      style={{ background: MONOGRAMS[i % MONOGRAMS.length] }}
      title={name}
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
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
      eyebrowIcon={AnimatedAi}
      eyebrowText="AI-Personalized Learning"
      titleLead="Skills that compound:"
      titleGradient="courses built for outcomes"
      description="Advanced digital marketing & AI/ML courses with live sessions, personalized AI recommendations, mentor support and placement guidance."
      chips={[
        { icon: AnimatedGraduation, text: "Live mentor-led sessions" },
        { icon: AnimatedSparkle, text: "AI-personalized paths" },
        { icon: AnimatedStar, text: "Verified certification" },
      ]}
      ctaHref="#course-catalog"
      ctaLabel="Browse the catalog"
      ctaNote={`${studentsCount.toLocaleString()}+ learners enrolled`}
      heroIcon={AnimatedBook}
      heroValue={courseCount}
      heroLabel="Courses live"
      cluster={cluster}
      clusterLabel="Taught by working industry instructors"
      stats={[
        { icon: AnimatedLayers, label: "Categories covered", value: categories.length },
        { icon: AnimatedStar, label: "Avg. rating x10", value: Math.round(avgRating * 10) },
      ]}
      marqueeLabel="Explore categories"
      marqueeItems={marqueeItems}
    />
  );
}
