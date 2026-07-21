import type { ComponentType, CSSProperties } from "react";
import { AnimatedAries } from "./AnimatedAries";
import { AnimatedTaurus } from "./AnimatedTaurus";
import { AnimatedGemini } from "./AnimatedGemini";
import { AnimatedCancer } from "./AnimatedCancer";
import { AnimatedLeo } from "./AnimatedLeo";
import { AnimatedVirgo } from "./AnimatedVirgo";
import { AnimatedLibra } from "./AnimatedLibra";
import { AnimatedScorpio } from "./AnimatedScorpio";
import { AnimatedSagittarius } from "./AnimatedSagittarius";
import { AnimatedCapricorn } from "./AnimatedCapricorn";
import { AnimatedAquarius } from "./AnimatedAquarius";
import { AnimatedPisces } from "./AnimatedPisces";

export {
  AnimatedAries,
  AnimatedTaurus,
  AnimatedGemini,
  AnimatedCancer,
  AnimatedLeo,
  AnimatedVirgo,
  AnimatedLibra,
  AnimatedScorpio,
  AnimatedSagittarius,
  AnimatedCapricorn,
  AnimatedAquarius,
  AnimatedPisces,
};

/** Keyed by standard Vedic rashi order: 0 = Aries ... 11 = Pisces. */
export const ZODIAC_ICONS: Record<number, ComponentType<{ className?: string; style?: CSSProperties }>> = {
  0: AnimatedAries,
  1: AnimatedTaurus,
  2: AnimatedGemini,
  3: AnimatedCancer,
  4: AnimatedLeo,
  5: AnimatedVirgo,
  6: AnimatedLibra,
  7: AnimatedScorpio,
  8: AnimatedSagittarius,
  9: AnimatedCapricorn,
  10: AnimatedAquarius,
  11: AnimatedPisces,
};
