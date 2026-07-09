"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { AnimatedSearch } from "@/components/ui/icons/AnimatedSearch";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedRupee } from "@/components/ui/icons/AnimatedRupee";
import { AnimatedCrown } from "@/components/ui/icons/AnimatedCrown";
import { InternshipCard, type InternshipCardData } from "./InternshipCard";

type PayFilter = "all" | "paid" | "unpaid";

const PAY_LABELS: Record<PayFilter, string> = { all: "All", paid: "Paid", unpaid: "Unpaid" };
const EASE = [0.16, 1, 0.3, 1] as const;

export function InternshipsExplorer({
  internships,
  appliedIds,
}: {
  internships: InternshipCardData[];
  appliedIds: string[];
}) {
  const [type, setType] = useState("All");
  const [pay, setPay] = useState<PayFilter>("all");
  const [query, setQuery] = useState("");

  const typeTabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of internships) counts.set(i.type, (counts.get(i.type) ?? 0) + 1);
    return [
      { name: "All", count: internships.length },
      ...[...counts.entries()].map(([name, count]) => ({ name, count })),
    ];
  }, [internships]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return internships
      .filter((i) => {
        const matchesType = type === "All" || i.type === type;
        const matchesPay = pay === "all" || (pay === "paid" ? i.paid : !i.paid);
        const matchesQuery =
          i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q);
        return matchesType && matchesPay && matchesQuery;
      })
      .sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [internships, type, pay, query]);

  const appliedSet = new Set(appliedIds);
  const featuredShown = filtered.filter((i) => i.featured).length;
  const filtersActive = type !== "All" || pay !== "all" || query !== "";

  function clearFilters() {
    setType("All");
    setPay("all");
    setQuery("");
  }

  return (
    <div id="open-roles" className="scroll-mt-24">
      {/* Section heading */}
      <motion.div
        className="flex items-center gap-2.5"
        initial={{ opacity: 0, x: -18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <AnimatedLayers className="h-7 w-7" />
        <h2 className="text-lg font-semibold sm:text-xl">Browse open roles</h2>
        <span className="hidden h-px flex-1 bg-gradient-to-r from-border-soft to-transparent sm:block" />
        {featuredShown > 0 && (
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted sm:ml-0">
            <AnimatedCrown className="h-4 w-4" />
            Featured first
          </span>
        )}
      </motion.div>

      <div className="mt-6 lg:grid lg:grid-cols-[270px_1fr] lg:items-start lg:gap-8">
        {/* Filter rail — sticky sidebar on desktop, glass toolbar on mobile */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="glass-panel z-20 rounded-2xl p-4 sm:p-5 lg:sticky lg:top-24"
        >
          {/* Search */}
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
              <AnimatedSearch className="h-5 w-5" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles or companies…"
              className="w-full rounded-xl border border-border-soft bg-surface py-2.5 pl-11 pr-4 text-sm outline-none transition-shadow duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:focus:ring-brand-900/30"
            />
          </div>

          {/* Pay segmented control */}
          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-muted">Stipend</p>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-border-soft bg-surface-2/70 p-1">
            {(["all", "paid", "unpaid"] as PayFilter[]).map((p) => (
              <motion.button
                key={p}
                onClick={() => setPay(p)}
                whileTap={{ scale: 0.94 }}
                className={`relative inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors duration-200 sm:text-sm ${
                  pay === p ? "text-background" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {pay === p && (
                  <motion.span
                    layoutId="internship-pay-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-foreground shadow-[var(--shadow-soft)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {p === "paid" && <AnimatedRupee className="hidden h-3.5 w-3.5 xl:inline-flex" />}
                {PAY_LABELS[p]}
              </motion.button>
            ))}
          </div>

          {/* Role type — chips rail on mobile, vertical list on desktop */}
          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-muted">Role type</p>
          <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0">
            {typeTabs.map((t) => (
              <motion.button
                key={t.name}
                onClick={() => setType(t.name)}
                whileTap={{ scale: 0.96 }}
                className={`relative inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 lg:w-full lg:rounded-xl lg:px-3.5 lg:py-2.5 ${
                  type === t.name ? "text-white" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {type === t.name ? (
                  <motion.span
                    layoutId="internship-type-pill"
                    className="absolute inset-0 -z-10 rounded-full brand-gradient-bg shadow-[var(--shadow-soft)] lg:rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : (
                  <span className="absolute inset-0 -z-10 rounded-full bg-surface-2 transition-colors duration-200 hover:bg-surface-2/80 lg:rounded-xl lg:bg-transparent lg:hover:bg-surface-2" />
                )}
                {t.name !== "All" && <ContentIcon keyword={t.name} className="h-4.5 w-4.5" />}
                <span className="truncate">{t.name}</span>
                <span
                  className={`rounded-full px-1.5 text-[10px] font-bold tabular-nums lg:ml-auto ${
                    type === t.name ? "bg-white/20" : "bg-surface text-muted"
                  }`}
                >
                  {t.count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Clear */}
          <AnimatePresence>
            {filtersActive && (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onClick={clearFilters}
                className="mt-3 w-full cursor-pointer overflow-hidden rounded-xl border border-border-soft py-2 text-center text-xs font-semibold text-brand-500 transition-colors hover:bg-surface-2 hover:text-brand-600"
              >
                Clear all filters
              </motion.button>
            )}
          </AnimatePresence>
        </motion.aside>

        {/* Results */}
        <div className="mt-6 min-w-0 lg:mt-0">
          <div className="flex items-center justify-between text-xs text-muted">
            <AnimatePresence mode="wait">
              <motion.span
                key={filtered.length}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {filtered.length} {filtered.length === 1 ? "role" : "roles"} found
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.div layout className="mt-3.5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((internship, i) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  applied={appliedSet.has(internship.id)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-16 flex flex-col items-center gap-4 text-center"
            >
              <AnimatedSearch className="h-16 w-16 opacity-80" />
              <div>
                <p className="text-sm font-medium">No internships match your search</p>
                <p className="mt-1 text-xs text-muted">Try a different keyword or clear the filters.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={clearFilters}
                className="cursor-pointer rounded-full brand-gradient-bg px-5 py-2 text-sm font-medium text-white shadow-[var(--shadow-soft)]"
              >
                Clear filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
