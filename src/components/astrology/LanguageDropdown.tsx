"use client";

import { ASTROLOGY_LANGUAGES, LANGUAGE_LABELS, t, type AstrologyLanguage } from "@/lib/astrology/i18n";

/** Language dropdown for the report view — full navigation (not client router) so the browser follows the server's redirect to the sibling-language report. */
export function LanguageDropdown({ reportId, value }: { reportId: string; value: AstrologyLanguage }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-surface-2 py-1 pl-3 pr-1.5 shadow-sm transition-colors hover:border-amber-400/70">
      <span className="text-xs font-medium text-muted">{t(value, "chooseLanguage")}</span>
      <select
        aria-label={t(value, "chooseLanguage")}
        value={value}
        onChange={(e) => {
          window.location.href = `/api/astrology/reports/${reportId}/switch-language?to=${e.target.value}`;
        }}
        className="cursor-pointer rounded-full bg-transparent py-1 pl-1 pr-1 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/40"
      >
        {ASTROLOGY_LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
