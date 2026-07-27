"use client";

import { motion } from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ServiceCategoryCard, type ServiceCategory } from "./ServiceCategoryCard";

/** Grid of service category cards, laid out in rows of four on desktop with
 * a thin animated "connector rail" running behind each row — a gradient line
 * that draws in on scroll plus a small traveling spark, gesturing at how the
 * categories flow together. Purely decorative and desktop-only (hidden below
 * `lg`, where the grid collapses to 1–2 columns and a straight rail would no
 * longer line up with anything). */
export function ServicesOverview({ categories }: { categories: ServiceCategory[] }) {
  const rows: ServiceCategory[][] = [];
  for (let i = 0; i < categories.length; i += 4) rows.push(categories.slice(i, i + 4));

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      {rows.map((row, ri) => (
        <div key={ri} className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-12 hidden overflow-hidden lg:block"
            style={{ height: "2px" }}
          >
            <motion.div
              className="h-full w-full origin-left bg-gradient-to-r from-transparent via-brand-400/45 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            />
            <motion.span
              aria-hidden
              className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-400 shadow-[0_0_8px_2px_rgba(108,77,255,0.55)]"
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "linear", delay: 0.6 + ri * 0.6 }}
            />
          </div>

          <RevealGroup className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {row.map((cat) => (
              <RevealItem key={cat.title} className="h-full">
                <ServiceCategoryCard category={cat} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      ))}
    </div>
  );
}
