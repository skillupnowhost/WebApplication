"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

export function StatCounter({
  from = 0,
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
  immediate = false,
}: {
  from?: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /** Skip the scroll-into-view gate and start counting as soon as this
      mounts. Use for stats that live inside an already-choreographed
      entrance (e.g. a hero) — without this, a stat positioned just below
      the fold can sit frozen at 0 while an identical value shown higher on
      the same screen has already finished counting up, which reads as
      broken/fake data rather than a deferred reveal. */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inViewDetected = useInView(ref, { once: true, margin: "-10% 0px" });
  const inView = immediate || inViewDetected;
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
