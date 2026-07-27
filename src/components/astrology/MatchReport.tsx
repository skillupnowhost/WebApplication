import { ReportMasthead, ReportSection, ReportCorners } from "./ReportPrimitives";
import { MatchHeartMeter } from "./MatchHeartMeter";
import { KootaCard } from "./KootaCard";
import { DoshaCard } from "./DoshaCard";
import { HandwrittenText } from "./HandwrittenText";
import type { MatchView } from "@/lib/astrology/match";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedHeart } from "@/components/ui/icons/AnimatedHeart";
import { t } from "@/lib/astrology/i18n";
import { l as horoscopeL } from "./ReportViewer";
import { cn } from "@/lib/cn";

function PersonCard({ name, roleLabel }: { name: string; roleLabel: string }) {
  return (
    <div className="jd-card jd-soft flex flex-col items-center justify-center gap-3 p-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--jd-royal)]/10 text-[var(--jd-royal)]">
        <AnimatedUser className="h-6 w-6" />
      </span>
      <div>
        <p className="jd-label">{roleLabel}</p>
        <p className="mt-1 text-base font-semibold text-[var(--jd-ink)]">{name}</p>
      </div>
    </div>
  );
}

/** Compatibility report — reuses the horoscope module's Professional/Traditional/Modern
    theme system (.jathagam-doc + jd-style-*) so all three PDF styles stay visually
    consistent across every report type, rather than a fourth bespoke skin. */
export function MatchReport({ view, reportStyle = "PROFESSIONAL", printMode = false }: { view: MatchView; reportStyle?: ReportStyleValue; printMode?: boolean }) {
  const lang = view.language;
  const isTraditional = reportStyle === "TRADITIONAL";
  const heading = (text: string) => (isTraditional ? <HandwrittenText text={text} lang={lang} /> : text);

  return (
    <article
      data-astro-lang={lang}
      className={cn(
        "jathagam-doc astro-print-page rounded-2xl",
        reportStyle === "TRADITIONAL" && "jd-style-traditional",
        reportStyle === "MODERN" && "jd-style-modern",
        printMode ? "shadow-none" : "p-8 shadow-[0_10px_50px_rgba(16,29,58,0.12)] sm:p-10"
      )}
    >
      <ReportCorners style={reportStyle} />
      <ReportMasthead
        style={reportStyle}
        lang={lang}
        icon={AnimatedHeart}
        kicker="MyLoginn Astrology"
        title={t(lang, "matchReportTitle")}
        stampLabel={horoscopeL("confidential", lang)}
      />

      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-[var(--jd-royal-deep)]">
          {heading(`${view.nameA} & ${view.nameB}`)}
        </h1>
        <p className="jd-label">{t(lang, "matchSubtitle")}</p>
      </div>

      <div className="mb-10 grid grid-cols-1 items-start gap-5 sm:grid-cols-3">
        <PersonCard name={view.nameA} roleLabel={t(lang, "bride")} />
        <div className="flex justify-center">
          <MatchHeartMeter totalPoints={view.ashtakoot.totalPoints} maxPoints={view.ashtakoot.maxPoints} verdict={view.ashtakoot.verdict} lang={lang} />
        </div>
        <PersonCard name={view.nameB} roleLabel={t(lang, "groom")} />
      </div>

      <ReportSection title={t(lang, "kootaBreakdown")} sectionKey="kootaBreakdown" style={reportStyle} lang={lang} className="mb-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {view.ashtakoot.kootas.map((k) => (
            <KootaCard key={k.key} koota={k} />
          ))}
        </div>
      </ReportSection>

      <ReportSection title={t(lang, "sectionDoshas")} sectionKey="sectionDoshas" style={reportStyle} lang={lang} className="mb-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            { name: view.nameA, doshas: view.doshasA },
            { name: view.nameB, doshas: view.doshasB },
          ].map(({ name, doshas }) => (
            <div key={name} className="flex flex-col gap-3">
              <h3 className="jd-label">{name}</h3>
              {doshas.map((d) => (
                <DoshaCard key={d.key} dosha={d} lang={lang} />
              ))}
            </div>
          ))}
        </div>
      </ReportSection>

      <ReportSection title={view.narrative.headline} style={reportStyle} lang={lang}>
        <div className="flex flex-col gap-4">
          {view.narrative.sections.map((s) => (
            <div key={s.heading} className="jd-card p-3">
              <h3 className="mb-1 text-sm font-semibold text-[var(--jd-royal-deep)]">{s.heading}</h3>
              <p className="text-sm leading-relaxed text-[var(--jd-ink)]">{s.body}</p>
            </div>
          ))}
        </div>
      </ReportSection>
    </article>
  );
}
