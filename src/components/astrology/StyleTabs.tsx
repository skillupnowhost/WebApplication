"use client";

import { cn } from "@/lib/cn";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import { t } from "@/lib/astrology/i18n";
import type { ReportStyleValue } from "@/lib/astrology/report";

const STYLES: { value: ReportStyleValue; labelKey: "outputProfessional" | "outputTraditional" | "outputModern" }[] = [
  { value: "PROFESSIONAL", labelKey: "outputProfessional" },
  { value: "TRADITIONAL", labelKey: "outputTraditional" },
  { value: "MODERN", labelKey: "outputModern" },
];

/** Segmented Professional / Handwritten / Premium switch on the report page — full navigation (not client router) so the browser follows the server's redirect (horoscope reports) or plain query-param link (match/muhurtham/naming/numerology) to the sibling-style view. */
export function StyleTabs({
  reportId,
  value,
  lang,
  baseHref,
}: {
  reportId?: string;
  value: ReportStyleValue;
  lang: AstrologyLanguage;
  /** Overrides the default DB-backed horoscope switch-style URL — used by stateless report types
   * that just re-render with a different `?style=` query param. Must be a plain string (not a
   * function): this component is a Client Component, and Server Component pages can't pass
   * functions as props across that boundary. Should already carry every other query param the
   * page needs (name/birthDate/place/etc.) but must NOT itself contain a `style` param — this
   * component appends the destination style itself. */
  baseHref?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={t(lang, "chooseOutputStyle")}
      className="inline-flex items-center gap-0.5 rounded-full border border-amber-400/40 bg-surface-2 p-1 shadow-sm"
    >
      {STYLES.map((s) => {
        const active = s.value === value;
        return (
          <button
            key={s.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={active}
            onClick={() => {
              if (active) return;
              window.location.href = baseHref
                ? `${baseHref}${baseHref.includes("?") ? "&" : "?"}style=${s.value}`
                : `/api/astrology/reports/${reportId}/switch-style?to=${s.value}`;
            }}
            className={cn(
              "cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-amber-500 text-white shadow-sm"
                : "text-foreground hover:bg-[color-mix(in_oklab,var(--color-amber-500)_12%,transparent)]",
              active && "cursor-default"
            )}
          >
            {t(lang, s.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
