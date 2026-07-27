"use client";

import Link from "next/link";
import type { ComponentType, CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { cn } from "@/lib/cn";

export type ServiceCategory = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  href: string;
  ctaLabel: string;
  /** True for the categories that link through to a real deep-dive page
   * (App & Web Development, Digital Marketing) rather than to /contact. */
  dedicated?: boolean;
};

/** One service category tile — whole card is a link, icon badge + copy +
 * a CTA row. Dedicated categories get a "Deep dive" ribbon since they route
 * to a full feature page instead of a generic contact CTA. */
export function ServiceCategoryCard({ category }: { category: ServiceCategory }) {
  const Icon = category.icon;
  return (
    <Link href={category.href} className="group block h-full">
      <Card
        className={cn(
          "card-shine relative flex h-full flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]",
          category.dedicated && "border-brand-300/70 dark:border-brand-700/60"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(108,77,255,0.16),transparent_70%)] transition-transform duration-500 group-hover:scale-125"
        />

        {category.dedicated && (
          <span className="brand-gradient-bg absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Deep dive
          </span>
        )}

        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <Icon className="h-9 w-9" />
        </span>

        <h3 className="mt-4 font-semibold">{category.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{category.description}</p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500">
          {category.ctaLabel}
          <AnimatedArrow className="h-4 w-4" />
        </span>
      </Card>
    </Link>
  );
}
