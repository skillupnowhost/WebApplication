"use client";

import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export type CompanyStat = { label: string; value: number; suffix?: string };

export function CompanyStatsSection({ stats }: { stats: CompanyStat[] }) {
  if (stats.length === 0) return null;

  return (
    <div className="relative border-y border-border-soft bg-surface py-12 sm:py-14">
      <Container>
        <RevealGroup className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6" stagger={0.08}>
          {stats.map((s, i) => (
            <RevealItem key={s.label}>
              <div
                className={`text-center ${i > 0 ? "sm:border-l sm:border-border-soft sm:pl-6" : ""}`}
              >
                <p className="shimmer-text-ink text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {s.value}
                  {s.suffix ?? "+"}
                </p>
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted">{s.label}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </div>
  );
}
