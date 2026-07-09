"use client";

import { ExplorerHero } from "@/components/ui/ExplorerHero";
import { AnimatedBriefcase } from "@/components/ui/icons/AnimatedBriefcase";
import { AnimatedRupee } from "@/components/ui/icons/AnimatedRupee";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedTrending } from "@/components/ui/icons/AnimatedTrending";
import { AnimatedRocket } from "@/components/ui/icons/AnimatedRocket";
import { AnimatedShield } from "@/components/ui/icons/AnimatedShield";
import { AnimatedSuccess } from "@/components/ui/icons/AnimatedSuccess";

const MONOGRAMS = [
  "linear-gradient(135deg,#7c3aed,#c084fc)",
  "linear-gradient(135deg,#0ea5e9,#67e8f9)",
  "linear-gradient(135deg,#059669,#6ee7b7)",
  "linear-gradient(135deg,#e11d48,#fb923c)",
];

export function InternshipsHero({
  total,
  paidCount,
  companyCount,
  avgWeeks,
  companies,
}: {
  total: number;
  paidCount: number;
  companyCount: number;
  avgWeeks: number;
  companies: string[];
}) {
  const cluster = companies.slice(0, 4).map((c, i) => (
    <span
      key={c}
      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white sm:h-9 sm:w-9"
      style={{ background: MONOGRAMS[i % MONOGRAMS.length] }}
      title={c}
    >
      {c.charAt(0).toUpperCase()}
    </span>
  ));

  const marqueeItems = companies.map((c, i) => (
    <span
      key={c}
      className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-1.5 text-sm font-medium text-foreground/80"
    >
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ background: MONOGRAMS[i % MONOGRAMS.length] }}
        aria-hidden
      >
        {c.charAt(0).toUpperCase()}
      </span>
      {c}
    </span>
  ));

  return (
    <ExplorerHero
      eyebrowIcon={AnimatedBriefcase}
      eyebrowText="Career Launchpad"
      titleLead="Internships that"
      titleGradient="launch real careers"
      description="Paid and unpaid roles for IT and engineering students — real teams, real deadlines, and a mentor in your corner the whole way."
      chips={[
        { icon: AnimatedShield, text: "Completion certificate" },
        { icon: AnimatedSuccess, text: "Mentor feedback" },
        { icon: AnimatedRocket, text: "Interview prep" },
      ]}
      ctaHref="#open-roles"
      ctaLabel="Browse open roles"
      ctaNote={`${paidCount} paid programs live now`}
      heroIcon={AnimatedBriefcase}
      heroValue={total}
      heroLabel="Open roles"
      cluster={cluster}
      clusterLabel={`${companyCount} ${companyCount === 1 ? "company" : "companies"} hiring this cohort`}
      stats={[
        { icon: AnimatedRupee, label: "Paid programs", value: paidCount },
        { icon: AnimatedGraduation, label: "Hiring companies", value: companyCount },
        { icon: AnimatedTrending, label: "Avg. weeks", value: avgWeeks },
      ]}
      marqueeLabel="Hiring now"
      marqueeItems={marqueeItems}
    />
  );
}
