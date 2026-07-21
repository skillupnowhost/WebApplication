import { ReportHeader } from "./ReportHeader";
import { CompatibilityMeter } from "./CompatibilityMeter";
import { KootaCard } from "./KootaCard";
import { DoshaCard } from "./DoshaCard";
import type { MatchView } from "@/lib/astrology/match";
import { GlassCard } from "@/components/ui/Card";

export function MatchReport({ view }: { view: MatchView }) {
  return (
    <GlassCard className="celestial-card rounded-3xl p-6 sm:p-10">
      <ReportHeader pageLabel="Marriage Compatibility Report" />

      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {view.nameA} <span className="text-muted">&amp;</span> {view.nameB}
        </h1>
        <p className="text-sm text-muted">Classical Ashtakoot Guna Milan — 36-point compatibility</p>
      </div>

      <div className="mb-8 flex justify-center">
        <CompatibilityMeter totalPoints={view.ashtakoot.totalPoints} maxPoints={view.ashtakoot.maxPoints} verdict={view.ashtakoot.verdict} />
      </div>

      <div className="mb-8">
        <h2 className="celestial-glow-text mb-3 text-base font-bold uppercase tracking-wide">Koota breakdown</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {view.ashtakoot.kootas.map((k) => (
            <KootaCard key={k.key} koota={k} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="celestial-glow-text mb-3 text-base font-bold uppercase tracking-wide">Doshas &amp; remedies</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            { name: view.nameA, doshas: view.doshasA },
            { name: view.nameB, doshas: view.doshasB },
          ].map(({ name, doshas }) => (
            <div key={name} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-muted">{name}</h3>
              {doshas.map((d) => (
                <DoshaCard key={d.key} dosha={d} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="celestial-glow-text mb-3 text-base font-bold uppercase tracking-wide">{view.narrative.headline}</h2>
        <div className="flex flex-col gap-4">
          {view.narrative.sections.map((s) => (
            <div key={s.heading}>
              <h3 className="mb-1 text-sm font-semibold">{s.heading}</h3>
              <p className="text-sm leading-relaxed text-foreground/90">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
