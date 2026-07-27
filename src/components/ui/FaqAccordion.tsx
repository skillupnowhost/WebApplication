"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedPlus } from "@/components/ui/icons/AnimatedPlus";
import { AnimatedSearch } from "@/components/ui/icons/AnimatedSearch";
import { AnimatedClose } from "@/components/ui/icons/AnimatedClose";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Named to avoid colliding with the generated Prisma `FaqItem` model type. */
export type FaqAccordionItem = { question: string; answer: string; category?: string };

/** Canonical FAQ category order — mirrors the fixed category list enforced on the admin FaqItem form. */
export const FAQ_CATEGORIES = [
  "Courses & Training",
  "Internship Programs",
  "Certification",
  "Payments & EMI",
  "Technical Support",
  "Account & Login",
  "Project Assistance",
  "Placement Guidance",
  "AI Services",
  "General Company Information",
] as const;

function faqKey(item: FaqAccordionItem) {
  return `${item.category ?? ""}__${item.question}`;
}

/** DOM-safe id derived from the (already-unique) faqKey, for aria-controls/aria-labelledby linkage. */
function faqDomId(key: string) {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function FaqList({
  items,
  openKey,
  onToggle,
}: {
  items: FaqAccordionItem[];
  openKey: string | null;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const key = faqKey(item);
        const isOpen = openKey === key;
        const domId = faqDomId(key);
        const buttonId = `faq-trigger-${domId}`;
        const panelId = `faq-panel-${domId}`;
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: EASE }}
            className={cn(
              "overflow-hidden rounded-2xl border border-border-soft bg-surface transition-colors duration-300",
              isOpen && "border-brand-300 dark:border-brand-700"
            )}
          >
            <button
              type="button"
              id={buttonId}
              onClick={() => onToggle(key)}
              aria-expanded={isOpen}
              aria-controls={panelId}
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
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
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

/**
 * Shared FAQ accordion for contact/services/tutoring pages.
 *
 * Simple flat mode (default): pass `items` without `category`, no search/tabs UI is shown.
 * Full hub mode: pass `items` with `category` set, and enable `searchable` + `categoryTabs`
 * to get a search box, category pills and grouped sections (used on the Contact page).
 */
export function FaqAccordion({
  items,
  className,
  searchable = false,
  categoryTabs = false,
  emptyMessage = "No FAQs published yet — check back soon, or just send us a message.",
}: {
  items: FaqAccordionItem[];
  className?: string;
  searchable?: boolean;
  categoryTabs?: boolean;
  emptyMessage?: string;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const availableCategories = useMemo(() => {
    if (!categoryTabs) return [];
    const present = new Set(items.map((i) => i.category).filter(Boolean) as string[]);
    return FAQ_CATEGORIES.filter((c) => present.has(c));
  }, [items, categoryTabs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (activeCategory && item.category !== activeCategory) return false;
      if (!q) return true;
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    });
  }, [items, query, activeCategory]);

  const handleToggle = (key: string) => setOpenKey((cur) => (cur === key ? null : key));

  if (items.length === 0) {
    return (
      <div className={cn("rounded-2xl border border-dashed border-border-soft bg-surface-2/50 px-6 py-10 text-center", className)}>
        <p className="text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  const grouped =
    categoryTabs && !activeCategory
      ? availableCategories
          .map((cat) => ({ category: cat, items: filtered.filter((i) => i.category === cat) }))
          .filter((g) => g.items.length > 0)
      : null;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {(searchable || categoryTabs) && (
        <div className="flex flex-col gap-4">
          {searchable && (
            <div className="relative">
              <AnimatedSearch className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search frequently asked questions…"
                aria-label="Search FAQs"
                className="w-full rounded-full border border-border-soft bg-surface py-3 pl-11 pr-11 text-sm outline-none transition-colors duration-200 focus:border-brand-300 dark:focus:border-brand-700"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <AnimatedClose className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          {categoryTabs && availableCategories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                  activeCategory === null
                    ? "border-brand-500 bg-brand-500 text-white shadow-[var(--shadow-soft)]"
                    : "border-border-soft bg-surface text-muted hover:-translate-y-0.5 hover:border-brand-400 hover:text-foreground"
                )}
              >
                All topics
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                    activeCategory === cat
                      ? "border-brand-500 bg-brand-500 text-white shadow-[var(--shadow-soft)]"
                      : "border-border-soft bg-surface text-muted hover:-translate-y-0.5 hover:border-brand-400 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-soft bg-surface-2/50 px-6 py-10 text-center">
          <p className="text-sm text-muted">No questions match that search — try another term or topic.</p>
        </div>
      ) : grouped ? (
        <div className="flex flex-col gap-8">
          {grouped.map((g) => (
            <div key={g.category}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{g.category}</h3>
              <FaqList items={g.items} openKey={openKey} onToggle={handleToggle} />
            </div>
          ))}
        </div>
      ) : (
        <FaqList items={filtered} openKey={openKey} onToggle={handleToggle} />
      )}
    </div>
  );
}
