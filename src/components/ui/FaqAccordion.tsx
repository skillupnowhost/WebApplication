"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedPlus } from "@/components/ui/icons/AnimatedPlus";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

export type FaqItem = { question: string; answer: string };

/** Shared single-open accordion for FAQ sections across contact/services/tutoring pages. */
export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={item.question}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
            className={cn(
              "overflow-hidden rounded-2xl border border-border-soft bg-surface transition-colors duration-300",
              isOpen && "border-brand-300 dark:border-brand-700"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
            >
              <span className={cn("text-sm font-semibold sm:text-[15px]", isOpen && "text-brand-600 dark:text-brand-300")}>
                {item.question}
              </span>
              <span
                className="shrink-0 rounded-full bg-surface-2 p-1.5 transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                <AnimatedPlus className="h-4 w-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
