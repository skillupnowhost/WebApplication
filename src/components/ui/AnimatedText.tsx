"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.028, delayChildren: 0.1 },
  },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.6em", rotateX: -40 },
  show: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AnimatedText({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag as "span"] ?? motion.span;
  const containerRef = useRef<HTMLElement>(null);
  const [offsets, setOffsets] = useState<number[] | null>(null);
  const [totalWidth, setTotalWidth] = useState(0);
  const isGradient = Boolean(wordClassName);

  // wordClassName is expected to be a background-clip:text gradient (e.g.
  // brand-gradient-text / shimmer-text-ink). Each word is its own box for the
  // rotateX entrance to work, so a gradient applied per-word restarts at each
  // word instead of flowing across the whole phrase — measure every word's
  // offset and slice one shared gradient image across them instead.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || !isGradient) return;
    const measure = () => {
      const containerRect = el.getBoundingClientRect();
      const wordEls = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
      setOffsets(wordEls.map((w) => w.getBoundingClientRect().left - containerRect.left));
      setTotalWidth(containerRect.width);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, isGradient]);

  return (
    <MotionTag
      ref={containerRef}
      className={cn("inline-block [perspective:800px]", className)}
      variants={container}
      initial="hidden"
      animate="show"
      transition={{ delayChildren: delay }}
    >
      {words.map((w, i) => {
        const offset = offsets?.[i] ?? 0;
        const sliced = isGradient && totalWidth > 0;
        return (
          <motion.span
            key={i}
            variants={word}
            className="inline-block will-change-transform"
            style={{ marginRight: "0.28em" }}
          >
            <motion.span
              data-word
              className={cn("inline-block", wordClassName)}
              style={sliced ? { backgroundSize: `${totalWidth}px 100%`, animation: "none" } : undefined}
              initial={sliced ? { backgroundPositionX: -offset } : undefined}
              animate={sliced ? { backgroundPositionX: [-offset, -offset - totalWidth] } : undefined}
              transition={sliced ? { duration: 5.5, ease: "linear", repeat: Infinity } : undefined}
            >
              {w}
            </motion.span>
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
