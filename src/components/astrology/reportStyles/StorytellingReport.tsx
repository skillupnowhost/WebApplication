import { GlassCard } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { ReportHeader } from "../ReportHeader";
import type { ReportViewData } from "../reportTypes";

/** A warm, human-narrative voice — long-form paragraphs, minimal tables, for on-screen reading. */
export function StorytellingReport({ data }: { data: ReportViewData }) {
  const { narrative, profile, chart } = data;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <Reveal>
        <ReportHeader subtitle={`A story written in the stars, for ${profile.fullName}`} />
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="brand-gradient-text">{narrative.headline}</span>
        </h1>
      </Reveal>

      {narrative.sections.map((section, i) => (
        <Reveal key={section.heading} delay={0.08 * (i + 1)}>
          <GlassCard className="relative overflow-hidden p-7 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,var(--brand-300),transparent_70%)] opacity-20 blur-2xl" />
            <h2 className="mb-3 text-lg font-semibold brand-gradient-text">{section.heading}</h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-foreground/90">{section.body}</p>
          </GlassCard>
        </Reveal>
      ))}

      <Reveal delay={0.1}>
        <p className="text-center text-xs text-muted">
          Ayanamsa: Lahiri ({chart.ayanamsaUsed.toFixed(2)}°) — for self-reflection and entertainment purposes.
        </p>
      </Reveal>
    </div>
  );
}
