import Link from "next/link";
import { AnimatedHome } from "@/components/ui/icons/AnimatedHome";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import { cn } from "@/lib/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0", className)}>
      <ol className="flex w-max min-w-full items-center gap-1.5 whitespace-nowrap text-sm">
        <li className="flex items-center">
          <Link
            href="/"
            aria-label="Home"
            className="flex items-center text-muted transition-colors duration-200 hover:text-brand-500"
          >
            <AnimatedHome className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <AnimatedChevron className="h-3 w-3 shrink-0 opacity-50" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-muted transition-colors duration-200 hover:text-brand-500"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast ? "font-medium text-foreground" : "text-muted")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
