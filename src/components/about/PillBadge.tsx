"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** White pill badge with a small pulsing brand dot — used for section eyebrows on the redesigned About page. */
export function PillBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-border-soft bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70 shadow-[var(--shadow-soft)]",
        className
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
      </span>
      {children}
    </span>
  );
}
