import { cn } from "@/lib/cn";
import { forwardRef, type HTMLAttributes } from "react";

export const Section = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Section(
  { className, ...rest },
  ref
) {
  return <section ref={ref} className={cn("relative py-20 sm:py-28", className)} {...rest} />;
});

export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Container(
  { className, ...rest },
  ref
) {
  return <div ref={ref} className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)} {...rest} />;
});

export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300",
        className
      )}
      {...rest}
    />
  );
}
