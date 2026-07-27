import { NorthIndianChart } from "./NorthIndianChart";
import { SouthIndianChart, type ChartCenterInfo } from "./SouthIndianChart";
import { EastIndianChart } from "./EastIndianChart";
import type { SiderealPlanet } from "@/lib/astrology/chart";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import type { ChartStyleValue } from "@/lib/astrology/report";
import type { MandiPosition } from "@/lib/astrology/mandi";

export function ChartWheel({
  chartStyle,
  ascendantRashiIndex,
  planets,
  language,
  center,
  mandi,
}: {
  chartStyle: ChartStyleValue;
  ascendantRashiIndex: number;
  planets: SiderealPlanet[];
  language?: AstrologyLanguage;
  /** Traditional center panel (date/time, chart name, nakshatra) — only the South Indian grid has an empty middle. */
  center?: ChartCenterInfo;
  /** Mandi/Gulika placement, rendered as an extra rose-colored marker in its rashi's cell alongside the real grahas. */
  mandi?: MandiPosition | null;
}) {
  if (chartStyle === "SOUTH_INDIAN") {
    return (
      <SouthIndianChart ascendantRashiIndex={ascendantRashiIndex} planets={planets} language={language} center={center} mandi={mandi} />
    );
  }
  if (chartStyle === "EAST_INDIAN") {
    return <EastIndianChart ascendantRashiIndex={ascendantRashiIndex} planets={planets} language={language} mandi={mandi} />;
  }
  return <NorthIndianChart ascendantRashiIndex={ascendantRashiIndex} planets={planets} language={language} mandi={mandi} />;
}
