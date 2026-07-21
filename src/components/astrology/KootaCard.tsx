"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { cn } from "@/lib/cn";
import type { KootaResult } from "@/lib/astrology/matching";

export function KootaCard({ koota }: { koota: KootaResult }) {
  const [open, setOpen] = useState(false);
  const isDosha = koota.points === 0;

  return (
    <div className={cn("celestial-card rounded-2xl border p-4", isDosha ? "border-danger/40" : "border-border-soft")}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 text-left cursor-pointer">
        <div className="flex items-center gap-2.5">
          <AnimatedStar className="h-5 w-5" />
          <span className="text-sm font-semibold">{koota.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", isDosha ? "bg-danger/10 text-danger" : "bg-success/10 text-success")}>
            {koota.points}/{koota.maxPoints}
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
            <p className="mt-3 text-sm text-muted">{koota.note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
