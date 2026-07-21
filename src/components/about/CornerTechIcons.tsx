"use client";

import { AnimatedAi } from "@/components/ui/icons/AnimatedAi";
import { AnimatedUploadCloud } from "@/components/ui/icons/AnimatedUploadCloud";
import { AnimatedTrending } from "@/components/ui/icons/AnimatedTrending";
import { AnimatedLock } from "@/components/ui/icons/AnimatedLock";
import { AnimatedCode } from "@/components/ui/icons/AnimatedCode";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";

/**
 * Faint tech-motif glyphs scattered near the edges of a section — AI, cloud, analytics,
 * security, code and data-flow, at very low opacity so they never compete with foreground content.
 */
export function CornerTechIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.08]" aria-hidden>
      <AnimatedAi className="absolute -left-4 top-6 h-20 w-20 sm:h-28 sm:w-28" />
      <AnimatedUploadCloud className="absolute -right-3 top-16 h-16 w-16 sm:h-24 sm:w-24" />
      <AnimatedTrending className="absolute left-[8%] bottom-10 h-16 w-16 sm:h-20 sm:w-20" />
      <AnimatedLock className="absolute right-[6%] bottom-4 h-14 w-14 sm:h-20 sm:w-20" />
      <AnimatedCode className="absolute right-[22%] top-2 hidden h-16 w-16 sm:block" />
      <AnimatedLayers className="absolute left-[20%] top-1/2 hidden h-14 w-14 lg:block" />
      <AnimatedArrow className="absolute left-1/2 bottom-1/3 hidden h-10 w-10 -rotate-45 lg:block" />
    </div>
  );
}
