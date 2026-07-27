"use client";

import { useId } from "react";
import { SOUTH_INDIAN_GRID, rashiLabel } from "@/lib/astrology/chartLayout";
import { RASHIS } from "@/lib/astrology/constants";
import type { SiderealPlanet } from "@/lib/astrology/chart";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import { planetAbbr, retrogradeAbbr, retrogradeLabel } from "@/lib/astrology/reportL10n";
import { MANDI_ABBR, type MandiPosition } from "@/lib/astrology/mandi";

const CELL = 75;

export type ChartCenterInfo = {
  title: string; // e.g. "Rasi" / "Navamsa" in the report language
  lines: string[]; // small lines above the title (date, time)
  footer?: string; // small line below the title (nakshatra)
};

export function SouthIndianChart({
  ascendantRashiIndex,
  planets,
  language = "en",
  center,
  mandi,
}: {
  ascendantRashiIndex: number;
  planets: SiderealPlanet[];
  language?: AstrologyLanguage;
  center?: ChartCenterInfo;
  mandi?: MandiPosition | null;
}) {
  const uid = useId().replace(/[:]/g, "");

  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" role="img" aria-label="South Indian style birth chart">
      <defs>
        <linearGradient id={`sic-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-amber-400, #fbbf24)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-violet-500, #7c3aed)" stopOpacity="0.9" />
        </linearGradient>
        <filter id={`sic-glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {center && (
        <g aria-hidden>
          {center.lines.map((line, i) => (
            <text key={i} x={150} y={116 + i * 15} textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.75">
              {line}
            </text>
          ))}
          <text x={150} y={150 + center.lines.length * 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
            {center.title}
          </text>
          {center.footer && (
            <text x={150} y={168 + center.lines.length * 4} textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.75">
              {center.footer}
            </text>
          )}
        </g>
      )}

      {RASHIS.map((rashi) => {
        const cell = SOUTH_INDIAN_GRID[rashi.index];
        const x = cell.col * CELL;
        const y = cell.row * CELL;
        const isAscendant = rashi.index === ascendantRashiIndex;
        const occupants = planets.filter((p) => p.rashi.index === rashi.index);

        return (
          <g key={rashi.index} filter={`url(#sic-glow-${uid})`}>
            <rect x={x} y={y} width={CELL} height={CELL} fill="none" stroke={`url(#sic-grad-${uid})`} strokeWidth="1" />
            {isAscendant && (
              <line x1={x + 6} y1={y + 6} x2={x + CELL - 6} y2={y + CELL - 6} stroke={`url(#sic-grad-${uid})`} strokeWidth="1.5" />
            )}
            <text x={x + 6} y={y + 13} fontSize="7" fill="currentColor" opacity="0.55">
              {rashiLabel(rashi.index, language)}
            </text>
            {occupants.map((p, i) => (
              <text key={p.planet} x={x + CELL / 2} y={y + CELL / 2 + i * 11} textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">
                {planetAbbr(language, p.planet)}
                {p.isRetrograde && (
                  <tspan dx="1" dy="-3" fontSize="6" fontWeight="700" fill="var(--color-rose-500, #f43f5e)">
                    <title>{retrogradeLabel(language)}</title>
                    {retrogradeAbbr(language)}
                  </tspan>
                )}
              </text>
            ))}
            {mandi && mandi.rashi.index === rashi.index && (
              <text
                x={x + CELL / 2}
                y={y + CELL / 2 + occupants.length * 11}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="var(--color-rose-500, #f43f5e)"
              >
                {MANDI_ABBR[language]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
