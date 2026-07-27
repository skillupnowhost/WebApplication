"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import { AnimatedOm } from "@/components/ui/icons/AnimatedOm";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { cn } from "@/lib/cn";
import type { DoshaFlag } from "@/lib/astrology/dosha";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";

export function DoshaCard({ dosha, lang = "en" }: { dosha: DoshaFlag; lang?: AstrologyLanguage }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("celestial-card rounded-2xl border p-4", dosha.present ? "border-amber-400/40" : "border-border-soft")}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 text-left cursor-pointer">
        <div className="flex items-center gap-2.5">
          <AnimatedOm className="h-5 w-5" />
          <span className="text-sm font-semibold">{dosha.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              dosha.present ? "bg-amber-500/10 text-amber-700" : "bg-success/10 text-success"
            )}
          >
            {dosha.present ? t(lang, "doshaPresent") : t(lang, "noDosha")}
          </span>
          <AnimatedChevron direction="down" className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-sm text-muted">{dosha.explanation}</p>
            {dosha.remedies.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {dosha.remedies.map((r) => (
                  <li key={r} className="flex items-center gap-2 text-sm">
                    <AnimatedStar className="h-3 w-3 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
