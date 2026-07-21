"use client";

import { ExplorerHero } from "@/components/ui/ExplorerHero";
import { AnimatedCalendar } from "@/components/ui/icons/AnimatedCalendar";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedRocket } from "@/components/ui/icons/AnimatedRocket";
import { AnimatedVideoCamera } from "@/components/ui/icons/AnimatedVideoCamera";
import { AnimatedMapPin } from "@/components/ui/icons/AnimatedMapPin";

const MONOGRAMS = [
  "linear-gradient(135deg,#7c3aed,#c084fc)",
  "linear-gradient(135deg,#0ea5e9,#67e8f9)",
  "linear-gradient(135deg,#059669,#6ee7b7)",
  "linear-gradient(135deg,#e11d48,#fb923c)",
];

export function EventsHero({
  upcomingCount,
  totalCount,
  categories,
  categoryCount,
}: {
  upcomingCount: number;
  totalCount: number;
  categories: string[];
  categoryCount: number;
}) {
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
      eyebrowIcon={AnimatedCalendar}
      eyebrowText="Live & Upcoming"
      titleLead="Learn together:"
      titleGradient="workshops & events"
      description="Live workshops, webinars and meetups run by MyLoginn mentors and partners — build skills alongside the community, online or in person."
      chips={[
        { icon: AnimatedVideoCamera, text: "Live & recorded sessions" },
        { icon: AnimatedMapPin, text: "Online & in-person" },
        { icon: AnimatedRocket, text: "Hosted by real mentors" },
      ]}
      ctaHref="#events-list"
      ctaLabel="See what's coming up"
      ctaNote={`${totalCount} events hosted so far`}
      heroIcon={AnimatedCalendar}
      heroValue={upcomingCount}
      heroLabel="Upcoming events"
      cluster={cluster}
      clusterLabel="Across courses, internships & community tracks"
      stats={[
        { icon: AnimatedLayers, label: "Categories", value: categoryCount },
        { icon: AnimatedUsers, label: "Events hosted", value: totalCount },
      ]}
      marqueeLabel="Explore categories"
      marqueeItems={marqueeItems.length > 1 ? marqueeItems : undefined}
    />
  );
}
