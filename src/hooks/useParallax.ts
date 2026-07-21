"use client";

import { useRef } from "react";
import { useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

/**
 * Ties a ref'd element's background/decoration layer to scroll position.
 * `speed` > 0 drifts the layer downward as the page scrolls past it (slower
 * than content = further back); `speed` < 0 drifts it upward (closer/faster).
 * Returns a static 0 motion value when the user prefers reduced motion.
 */
export function useParallax(speed = 40) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y: MotionValue<number> = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [-speed, speed]);
  return { ref, y };
}
