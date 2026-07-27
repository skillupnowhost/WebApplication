"use client";

import { cn } from "@/lib/cn";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import { t } from "@/lib/astrology/i18n";
import { lv } from "@/lib/astrology/reportL10n";
import { COLOR_THEME_VALUES, type ColorThemeValue } from "@/lib/astrology/report";

/** Swatch preview colour + English display name per theme — the swatch dot is presentational-only
 * (it does not need to be pixel-identical to the CSS custom properties in globals.css, just a
 * recognisable preview of the palette), the display name is looked up through `lv()` per language. */
const THEME_META: Record<ColorThemeValue, { swatch: string; nameEn: string }> = {
  DEFAULT: { swatch: "linear-gradient(135deg,#1c3faa,#c9a227)", nameEn: "Default" },
  GOLD: { swatch: "linear-gradient(135deg,#8a6a05,#d4af37)", nameEn: "Gold" },
  ROYAL_BLUE: { swatch: "linear-gradient(135deg,#0b2568,#4f7fe0)", nameEn: "Royal Blue" },
  EMERALD: { swatch: "linear-gradient(135deg,#0a4a30,#16a870)", nameEn: "Emerald Green" },
  PURPLE: { swatch: "linear-gradient(135deg,#5b21b6,#c026d3)", nameEn: "Purple" },
  MAROON: { swatch: "linear-gradient(135deg,#530f1c,#b5793a)", nameEn: "Maroon" },
  ORANGE: { swatch: "linear-gradient(135deg,#7c2d12,#f97316)", nameEn: "Orange" },
  TEAL: { swatch: "linear-gradient(135deg,#0a4f4a,#14b8a6)", nameEn: "Teal" },
  CLASSIC_BLACK: { swatch: "linear-gradient(135deg,#000000,#b0b0b0)", nameEn: "Classic Black" },
  PREMIUM_WHITE: { swatch: "linear-gradient(135deg,#e5e5e5,#ffffff)", nameEn: "Premium White" },
  MULTI_TRADITIONAL: { swatch: "linear-gradient(90deg,#a3281f,#0f6b45,#123a9e,#6d28d9,#b8860b)", nameEn: "Multi-colour Traditional" },
};

/** Colour-theme picker for the report page — sits next to StyleTabs/LanguageDropdown. Same full
 * server-navigation pattern as those (not client router), so the browser follows the redirect from
 * /switch-theme, which updates the report's colorTheme column in place (colour theme never forks a
 * new report row the way style/language do, since it never changes narrative content). */
export function ColorThemeTabs({ reportId, value, lang }: { reportId: string; value: ColorThemeValue; lang: AstrologyLanguage }) {
  const currentSwatch = THEME_META[value].swatch;
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-surface-2 py-1 pl-3 pr-1.5 shadow-sm transition-colors hover:border-amber-400/70">
      <span
        aria-hidden
        className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
        style={{ background: currentSwatch }}
      />
      <span className="text-xs font-medium text-muted">{t(lang, "chooseColorTheme")}</span>
      <select
        aria-label={t(lang, "chooseColorTheme")}
        value={value}
        onChange={(e) => {
          window.location.href = `/api/astrology/reports/${reportId}/switch-theme?to=${e.target.value}`;
        }}
        className={cn("cursor-pointer rounded-full bg-transparent py-1 pl-1 pr-1 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/40")}
      >
        {COLOR_THEME_VALUES.map((theme) => (
          <option key={theme} value={theme}>
            {lang === "en" ? THEME_META[theme].nameEn : lv(lang, THEME_META[theme].nameEn)}
          </option>
        ))}
      </select>
    </label>
  );
}
