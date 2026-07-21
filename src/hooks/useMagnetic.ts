"use client";

import { useRef, type MouseEvent } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Pulls an element a few px toward the pointer while it's within `radius`px
 * of the element's center, snapping back on leave. Attach the returned
 * handlers + motion values to a `motion.*` element.
 */
export function useMagnetic(strength = 0.35, radius = 90) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springCfg = { stiffness: 200, damping: 18, mass: 0.4 };
  const sx = useSpring(x, springCfg);
  const sy = useSpring(y, springCfg);

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < radius) {
      x.set(dx * strength);
      y.set(dy * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return { ref, x: sx, y: sy, onMouseMove, onMouseLeave };
}
