"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.3 });

  return (
    <motion.div
      style={{ scaleX, boxShadow: "0 0 12px 1px color-mix(in srgb, var(--accent-400) 65%, transparent)" }}
      className="fixed inset-x-0 top-0 z-[60] h-[2.5px] origin-left brand-gradient-bg"
    />
  );
}
