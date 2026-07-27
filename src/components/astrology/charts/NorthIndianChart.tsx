"use client";

import { useId } from "react";
import { NORTH_INDIAN_HOUSE_POLYGONS, buildHouses } from "@/lib/astrology/chartLayout";
import { rashiLabel } from "@/lib/astrology/chartLayout";
import type { SiderealPlanet } from "@/lib/astrology/chart";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import { planetAbbr, retrogradeAbbr, retrogradeLabel } from "@/lib/astrology/reportL10n";
import { MANDI_ABBR, type MandiPosition } from "@/lib/astrology/mandi";

export function NorthIndianChart({
  ascendantRashiIndex,
  planets,
  language = "en",
  mandi,
}: {
  ascendantRashiIndex: number;
  planets: SiderealPlanet[];
  language?: AstrologyLanguage;
  mandi?: MandiPosition | null;
}) {
  const uid = useId().replace(/[:]/g, "");
  const houses = buildHouses(ascendantRashiIndex, planets);

  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" role="img" aria-label="North Indian style birth chart">
      <defs>
        <linearGradient id={`nic-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-amber-400, #fbbf24)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-violet-500, #7c3aed)" stopOpacity="0.9" />
        </linearGradient>
        <filter id={`nic-glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="1" y="1" width="298" height="298" fill="none" stroke={`url(#nic-grad-${uid})`} strokeWidth="2" opacity="0.6" />

      {houses.map((house) => {
        const poly = NORTH_INDIAN_HOUSE_POLYGONS[house.houseNumber];
        return (
          <g key={house.houseNumber} filter={`url(#nic-glow-${uid})`}>
            <polygon points={poly.points} fill="none" stroke={`url(#nic-grad-${uid})`} strokeWidth="1.1" strokeLinejoin="round" />
            <text x={poly.labelX} y={poly.labelY - 10} textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.55">
              {rashiLabel(house.rashiIndex, language)}
            </text>
            {house.planets.map((p, i) => (
              <text key={p.planet} x={poly.labelX} y={poly.labelY + i * 9} textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">
                {planetAbbr(language, p.planet)}
                {p.isRetrograde && (
                  <tspan dx="1" dy="-3" fontSize="6" fontWeight="700" fill="var(--color-rose-500, #f43f5e)">
                    <title>{retrogradeLabel(language)}</title>
                    {retrogradeAbbr(language)}
                  </tspan>
                )}
              </text>
            ))}
            {mandi && mandi.rashi.index === house.rashiIndex && (
              <text
                x={poly.labelX}
                y={poly.labelY + house.planets.length * 9}
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
