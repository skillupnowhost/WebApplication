import Link from "next/link";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb trail for the astrology module: Home › Astrology › …items.
 * The last crumb is the current page (unlinked); every earlier crumb navigates
 * back up the hierarchy. Hidden in print/PDF via astro-no-print.
 */
export function AstroBreadcrumbs({ items = [], className }: { items?: Crumb[]; className?: string }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, { label: "Astrology", href: "/astrology" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={cn("astro-no-print mb-6 flex flex-wrap items-center gap-1.5 text-sm", className)}>
      {trail.map((crumb, i) => {
        const isLast = i === trail.length - 1;
        return (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <AnimatedChevron className="h-3 w-3 opacity-60" />}
            {crumb.href && !isLast ? (
              <Link href={crumb.href} className="text-muted transition-colors duration-200 hover:text-foreground">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
