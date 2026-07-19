import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border-soft bg-surface shadow-[var(--shadow-soft)] transition-all duration-300",
        className
      )}
      {...rest}
    />
  );
}

export function GlassCard({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-panel rounded-2xl", className)} {...rest} />;
}

/** GlassCard with a hover shine sweep — the default cinematic card treatment. */
export function GlowCard({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel card-shine relative overflow-hidden rounded-2xl transition-transform duration-300",
        className
      )}
      {...rest}
    />
  );
}
