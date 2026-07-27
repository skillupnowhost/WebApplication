"use client";

import { ExplorerHero } from "@/components/ui/ExplorerHero";
import { AnimatedCameraCapture } from "@/components/ui/icons/AnimatedCameraCapture";
import { AnimatedImage } from "@/components/ui/icons/AnimatedImage";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { AnimatedTrophy } from "@/components/ui/icons/AnimatedTrophy";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";

const MONOGRAMS = [
  "linear-gradient(135deg,#7c3aed,#c084fc)",
  "linear-gradient(135deg,#0ea5e9,#67e8f9)",
  "linear-gradient(135deg,#059669,#6ee7b7)",
  "linear-gradient(135deg,#e11d48,#fb923c)",
  "linear-gradient(135deg,#d97706,#fde68a)",
];

export function GalleryHero({
  totalCount,
  categories,
  titleAs,
}: {
  totalCount: number;
  categories: string[];
  /** Pass "h2" when this hero is embedded mid-page (e.g. at the bottom of the About page) rather than as the page's own h1. */
  titleAs?: "h1" | "h2";
}) {
  const categoryCount = categories.length;

  const cluster = categories.slice(0, 4).map((c, i) => (
    <span
      key={c}
      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white sm:h-9 sm:w-9"
      style={{ background: MONOGRAMS[i % MONOGRAMS.length] }}
      title={c}
    >
      {c.charAt(0).toUpperCase()}
    </span>
  ));

  const marqueeItems = categories.map((c) => (
    <span
      key={c}
      className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-1.5 text-sm font-medium text-foreground/80"
    >
      <AnimatedSparkle className="h-4.5 w-4.5" />
      {c}
    </span>
  ));

  return (
    <ExplorerHero
      eyebrowIcon={AnimatedCameraCapture}
      eyebrowText="Moments & Milestones"
      titleLead="Inside MyLoginn:"
      titleGradient="our story in photos"
      titleAs={titleAs}
      description="Workshops, launches, office life and the wins we celebrate together — a running photo album of the MyLoginn community."
      chips={[
        { icon: AnimatedUsers, text: "Team & community" },
        { icon: AnimatedTrophy, text: "Certificates & wins" },
        { icon: AnimatedImage, text: "Events & workshops" },
      ]}
      ctaHref="#gallery-grid"
      ctaLabel="Browse the gallery"
      ctaNote={`${totalCount} photos shared so far`}
      heroIcon={AnimatedCameraCapture}
      heroValue={totalCount}
      heroLabel="Photos shared"
      cluster={cluster.length > 0 ? cluster : [<AnimatedImage key="placeholder" className="h-8 w-8 sm:h-9 sm:w-9" />]}
      clusterLabel="Captured across courses, internships & community events"
      stats={[
        { icon: AnimatedLayers, label: "Categories", value: categoryCount },
        { icon: AnimatedImage, label: "Photos", value: totalCount },
      ]}
      marqueeLabel="Browse categories"
      marqueeItems={marqueeItems.length > 1 ? marqueeItems : undefined}
    />
  );
}
