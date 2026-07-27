import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { HandwrittenText } from "./HandwrittenText";
import { AnimatedDivider } from "@/components/ui/icons/ornaments/AnimatedDivider";
import { AnimatedTempleCorner } from "@/components/ui/icons/ornaments/AnimatedTempleCorner";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedCelestialWheel } from "@/components/ui/icons/AnimatedCelestialWheel";
import { AnimatedDashaWheel } from "@/components/ui/icons/ornaments/AnimatedDashaWheel";
import { AnimatedDoshaShield } from "@/components/ui/icons/ornaments/AnimatedDoshaShield";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedMandala } from "@/components/ui/icons/AnimatedMandala";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import type { ReportStyleValue } from "@/lib/astrology/report";

/** Shared building blocks for every `.jathagam-doc` report (horoscope, match, naming, numerology,
 * muhurtham) — the single place that composes the Professional / Traditional-handwritten / Modern-
 * premium visual language on top of the CSS design tokens in globals.css. Replaces the near-
 * identical local `Sec`/`Field`/header implementations each report file used to carry on its own. */

/** Modern-style icon-led section headers, keyed by a stable section identity (not the localized
 * title). Reuses existing astrology icons wherever they already fit; introduces new glyphs only
 * where no existing icon matched the concept. */
const MODERN_SECTION_ICON: Partial<Record<string, ComponentType<{ className?: string }>>> = {
  personal: AnimatedUser,
  panchang: AnimatedCelestialWheel,
  birthDetails: AnimatedUser,
  charts: AnimatedCelestialWheel,
  strength: AnimatedDashaWheel,
  dasha: AnimatedDashaWheel,
  dosha: AnimatedDoshaShield,
  upagrahaL: AnimatedDoshaShield,
  lucky: AnimatedSparkle,
  muhurtham: AnimatedCelestialWheel,
  summary: AnimatedMandala,
  dashaTimeline: AnimatedDashaWheel,
  fullDashaTree: AnimatedDashaWheel,
  coreTitle: AnimatedSparkle,
  luckyTitle: AnimatedSparkle,
  readingsTitle: AnimatedMandala,
  compareTitle: AnimatedUser,
  syllablesTitle: AnimatedSparkle,
  boysTitle: AnimatedUser,
  girlsTitle: AnimatedUser,
  requestTitle: AnimatedUser,
  bestTitle: AnimatedSparkle,
  allTitle: AnimatedCelestialWheel,
  kootaBreakdown: AnimatedMandala,
  sectionDoshas: AnimatedDoshaShield,
};

/** Temple-corner ornaments for the Traditional style — rendered once around the page edges of
 * every report document. No-op for Professional/Modern. */
export function ReportCorners({ style }: { style: ReportStyleValue }) {
  if (style !== "TRADITIONAL") return null;
  return (
    <>
      <AnimatedTempleCorner className="jd-corner-ornament jd-corner-tl" />
      <AnimatedTempleCorner className="jd-corner-ornament jd-corner-tr" />
      <AnimatedTempleCorner className="jd-corner-ornament jd-corner-bl" />
      <AnimatedTempleCorner className="jd-corner-ornament jd-corner-br" />
    </>
  );
}

/** Style-aware document masthead: crest glyph, kicker, title, confidential stamp + meta on the
 * right, and an optional quick-fact chip row underneath. `title` is jittered with HandwrittenText
 * automatically when it's a plain string and the style is Traditional — pass pre-composed JSX
 * (e.g. to mix a translated label with a raw name) and it renders as-is. */
export function ReportMasthead({
  style,
  lang,
  icon: Icon,
  trailingIcon: TrailingIcon,
  kicker,
  title,
  stampLabel,
  meta,
  chips,
  compact = false,
}: {
  style: ReportStyleValue;
  lang: AstrologyLanguage;
  icon?: ComponentType<{ className?: string }>;
  /** Decorative glyph shown to the right of the stamp/meta block — e.g. the horoscope report's
   * kolam motif. Screen-only (marked `astro-no-print`), purely ornamental. */
  trailingIcon?: ComponentType<{ className?: string }>;
  kicker: ReactNode;
  title: ReactNode;
  stampLabel?: string;
  meta?: ReactNode;
  chips?: ReactNode;
  compact?: boolean;
}) {
  const isTraditional = style === "TRADITIONAL";
  const heading = isTraditional && typeof title === "string" ? <HandwrittenText text={title} lang={lang} /> : title;
  return (
    <header className={cn("border-b-2 border-[var(--jd-gold-bright)]", compact ? "mb-2 pb-1.5" : "mb-6 pb-4")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className={cn("jd-crest shrink-0 p-1.5", compact ? "h-7 w-7" : "h-9 w-9")}>
              <Icon className="h-full w-full" />
            </span>
          )}
          {isTraditional && (
            <span className={cn("jd-seal shrink-0 astro-no-print", compact ? "h-6 w-6" : "h-8 w-8")}>
              <AnimatedStar className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            </span>
          )}
          <div>
            <p className="jd-kicker">{kicker}</p>
            <h1 className={cn("mt-0.5 font-bold tracking-tight text-[var(--jd-royal-deep)]", compact ? "text-base" : "text-2xl")}>
              {heading}
            </h1>
          </div>
        </div>
        {(stampLabel || meta) && (
          <div className="flex items-start gap-2">
            <div className={cn("text-right leading-4 text-[var(--jd-ink-soft)]", compact ? "text-[9px]" : "text-[10px]")}>
              {stampLabel && <p className="jd-chip jd-chip-gold jd-stamp mb-1 inline-flex">{stampLabel}</p>}
              {meta}
            </div>
            {TrailingIcon && <TrailingIcon className={cn("shrink-0 astro-no-print", compact ? "h-7 w-7" : "h-8 w-8")} />}
          </div>
        )}
      </div>
      {chips && <div className={cn("flex flex-wrap gap-1.5", compact ? "mt-1.5" : "mt-3")}>{chips}</div>}
    </header>
  );
}

/** Style-aware section wrapper: title (+ Modern icon, + Traditional handwritten jitter and hand-
 * drawn divider) around arbitrary content. `sectionKey` looks up the Modern icon by stable section
 * identity — omit it for sections with no matching glyph. `onepage` switches the spacing class to
 * `jd-onepage-section` (compact single-A4-page horoscope summary) instead of the normal `mb-5`. */
export function ReportSection({
  title,
  sectionKey,
  style,
  lang,
  onepage = false,
  children,
  className,
}: {
  title: string;
  sectionKey?: string;
  style: ReportStyleValue;
  lang: AstrologyLanguage;
  onepage?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const Icon = style === "MODERN" && sectionKey ? MODERN_SECTION_ICON[sectionKey] : undefined;
  return (
    <section className={cn("astro-report-section", onepage ? "jd-onepage-section" : "mb-5", style === "MODERN" && "p-3", className)}>
      <h2 className="jd-section-title mb-2.5">
        {Icon && (
          <span className="jd-section-icon">
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
        {style === "TRADITIONAL" ? <HandwrittenText text={title} lang={lang} /> : title}
      </h2>
      {style === "TRADITIONAL" && <AnimatedDivider className="jd-divider" />}
      {children}
    </section>
  );
}

/** Label/value pair. Jitters the value with HandwrittenText automatically for Traditional string
 * values — matches the behaviour every report file previously implemented locally. */
export function ReportField({
  label,
  value,
  lang,
  style,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  lang: AstrologyLanguage;
  style: ReportStyleValue;
  className?: string;
}) {
  const jitter = style === "TRADITIONAL" && typeof value === "string";
  return (
    <div className={cn("min-w-0", className)}>
      <p className="jd-label">{label}</p>
      <p className="jd-value truncate">{jitter ? <HandwrittenText text={value as string} lang={lang} /> : value}</p>
    </div>
  );
}

/** Closing disclaimer strip. `closingMark`, when supplied, renders a centered star-flanked motif
 * below the disclaimer (used by the horoscope report's "சுபம்" sign-off). */
export function ReportFooter({ disclaimer, closingMark, className }: { disclaimer: ReactNode; closingMark?: ReactNode; className?: string }) {
  return (
    <footer className={cn("mt-6 border-t border-[var(--jd-hairline)] pt-3", closingMark ? "text-center" : "", className)}>
      <div className="text-[10px] leading-4 text-[var(--jd-ink-soft)]">{disclaimer}</div>
      {closingMark && (
        <p className="jd-kicker mt-1 inline-flex items-center justify-center gap-1.5">
          <AnimatedStar className="h-3 w-3" /> {closingMark} <AnimatedStar className="h-3 w-3" />
        </p>
      )}
    </footer>
  );
}
