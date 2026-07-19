"use client";

import { ASTROLOGY_LANGUAGES, LANGUAGE_LABELS, t, type AstrologyLanguage } from "@/lib/astrology/i18n";
import { cn } from "@/lib/cn";

/* Live language switcher — every label in the surrounding form re-renders
   in the picked language the moment a chip is clicked. */
export function LanguageChips({ value, onChange }: { value: AstrologyLanguage; onChange: (lang: AstrologyLanguage) => void }) {
  return (
    <div className="relative mb-6 flex flex-wrap items-center gap-1.5">
      <span className="mr-2 text-sm font-medium text-muted">{t(value, "chooseLanguage")}</span>
      {ASTROLOGY_LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={cn(
            "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
            code === value
              ? "celestial-glow-text bg-[color-mix(in_oklab,var(--color-amber-500)_16%,transparent)] ring-1 ring-amber-400/50"
              : "bg-surface-2 text-muted hover:text-foreground"
          )}
        >
          {LANGUAGE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
