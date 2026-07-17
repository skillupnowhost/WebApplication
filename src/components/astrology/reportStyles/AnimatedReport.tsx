"use client";

import { motion } from "framer-motion";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/Reveal";
import { ReportHeader } from "../ReportHeader";
import { ChartWheel } from "./ChartWheel";
import type { ReportViewData } from "../reportTypes";

/** The dynamic, on-screen-only voice — animated chart wheel + scroll-triggered reveals. Excluded from PDF export. */
export function AnimatedReport({ data }: { data: ReportViewData }) {
  const { narrative, chart, profile } = data;

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col gap-8 overflow-hidden">
      <div className="aurora-blob pointer-events-none absolute -left-24 -top-24 h-72 w-72 opacity-40" />
      <div className="aurora-blob-alt pointer-events-none absolute -right-20 top-40 h-64 w-64 opacity-30" />

      <Reveal>
        <ReportHeader subtitle={`A live reveal of the sky for ${profile.fullName}`} />
      </Reveal>

      <Reveal delay={0.05} scale>
        <ChartWheel chart={chart} />
      </Reveal>

      <Reveal delay={0.1}>
        <motion.h1
          className="text-center text-3xl font-semibold tracking-tight sm:text-4xl"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: "linear-gradient(110deg, var(--brand-600), var(--accent-500), var(--brand-400), var(--brand-600))",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {narrative.headline}
        </motion.h1>
      </Reveal>

      <RevealGroup className="flex flex-col gap-5">
        {narrative.sections.map((section) => (
          <RevealItem key={section.heading}>
            <div className="gradient-border card-shine relative overflow-hidden rounded-2xl bg-surface p-6 sm:p-7">
              <h2 className="mb-2.5 text-base font-semibold brand-gradient-text">{section.heading}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{section.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <p className="text-center text-xs text-muted">
          Ayanamsa: Lahiri ({chart.ayanamsaUsed.toFixed(2)}°) — for self-reflection and entertainment purposes.
        </p>
      </Reveal>
    </div>
  );
}
