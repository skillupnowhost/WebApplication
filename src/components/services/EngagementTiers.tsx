"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnimatedSuccess } from "@/components/ui/icons/AnimatedSuccess";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";

export type EngagementTier = {
  name: string;
  tagline: string;
  features: string[];
  featured?: boolean;
};

/** Reusable "which engagement model fits you" tier cards — used by service landing pages. No fixed pricing is shown; every tier routes to the lead form for a custom quote. */
export function EngagementTiers({
  tiers,
  ctaHref = "#lead-form",
  ctaLabel = "Get a custom quote",
}: {
  tiers: EngagementTier[];
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {tiers.map((tier, i) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card
            className={`card-shine relative flex h-full flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 ${
              tier.featured
                ? "border-brand-400 shadow-[var(--shadow-lift)] dark:border-brand-600"
                : "hover:shadow-[var(--shadow-lift)]"
            }`}
          >
            {tier.featured && (
              <span className="brand-gradient-bg absolute right-5 top-5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Most popular
              </span>
            )}
            <h3 className="font-semibold">{tier.name}</h3>
            <p className="mt-1.5 text-sm text-muted">{tier.tagline}</p>
            <ul className="mt-5 flex flex-1 flex-col gap-2.5">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                  <AnimatedSuccess className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              href={ctaHref}
              variant={tier.featured ? "primary" : "secondary"}
              size="sm"
              className="mt-6 w-full"
              icon={<AnimatedArrow className="h-4 w-4" />}
            >
              {ctaLabel}
            </Button>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
