"use client";

import { useId } from "react";
import { eastIndianCellForHouse, buildHouses, rashiLabel } from "@/lib/astrology/chartLayout";
import { PLANET_ABBR } from "@/lib/astrology/constants";
import type { SiderealPlanet } from "@/lib/astrology/chart";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";

const CELL = 75;

export function EastIndianChart({
  ascendantRashiIndex,
  planets,
  language = "en",
}: {
  ascendantRashiIndex: number;
  planets: SiderealPlanet[];
  language?: AstrologyLanguage;
}) {
  const uid = useId().replace(/[:]/g, "");
  const houses = buildHouses(ascendantRashiIndex, planets);

  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" role="img" aria-label="East Indian style birth chart">
      <defs>
        <linearGradient id={`eic-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-amber-400, #fbbf24)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-violet-500, #7c3aed)" stopOpacity="0.9" />
        </linearGradient>
        <filter id={`eic-glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {houses.map((house) => {
        const cell = eastIndianCellForHouse(house.houseNumber);
        const x = cell.col * CELL;
        const y = cell.row * CELL;

        return (
          <g key={house.houseNumber} filter={`url(#eic-glow-${uid})`}>
            <rect x={x} y={y} width={CELL} height={CELL} fill="none" stroke={`url(#eic-grad-${uid})`} strokeWidth="1" />
            <text x={x + 6} y={y + 13} fontSize="7" fill="currentColor" opacity="0.55">
              H{house.houseNumber} · {rashiLabel(house.rashiIndex, language)}
            </text>
            {house.planets.map((p, i) => (
              <text key={p.planet} x={x + CELL / 2} y={y + CELL / 2 + i * 11} textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">
                {PLANET_ABBR[p.planet]}
                {p.isRetrograde ? "℞" : ""}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
