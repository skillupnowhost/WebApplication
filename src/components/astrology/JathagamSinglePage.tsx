import { DateTime } from "luxon";
import { ChartWheel } from "./charts/ChartWheel";
import { rashiLabel, nakshatraLabel } from "@/lib/astrology/chartLayout";
import { AYANAMSA_NAMES } from "@/lib/astrology/ayanamsa";
import { RASHIS } from "@/lib/astrology/constants";
import { formatDegreesInSign } from "@/lib/astrology/panchanga";
import { MANDI_HOUSE_THEME } from "@/lib/astrology/mandi";
import type { ReportView } from "@/lib/astrology/report";
import type { SiderealPlanet } from "@/lib/astrology/chart";
import { lv, LUXON_LOCALE, planetAbbr } from "@/lib/astrology/reportL10n";
import { l } from "./ReportViewer";
import { ReportMasthead, ReportSection, ReportField, ReportFooter } from "./ReportPrimitives";
import { AnimatedVinayagar } from "@/components/ui/icons/AnimatedVinayagar";
import { AnimatedKolam } from "@/components/ui/icons/AnimatedKolam";
import { HandwrittenText } from "./HandwrittenText";
import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { AnimatedSunGlyph } from "@/components/ui/icons/AnimatedSunGlyph";
import { AnimatedAscendantGlyph } from "@/components/ui/icons/AnimatedAscendantGlyph";
import { cn } from "@/lib/cn";

const KUJA_NOTE = {
  present: {
    en: "Mars sits in a Mangal Dosha house — consider matching or remedies before marriage.",
    ta: "செவ்வாய் குஜ தோஷ வீட்டில் உள்ளது — திருமணத்திற்கு முன் பொருத்தம் அல்லது பரிகாரம் பரிந்துரைக்கப்படுகிறது.",
  },
  clear: {
    en: "Mars is clear of the Mangal Dosha houses.",
    ta: "செவ்வாய் குஜ தோஷ வீடுகளில் இல்லை — தோஷம் இல்லை.",
  },
} as const;

/** Condensed single-A4-page handwritten Jathagam — SUMMARY depth, TRADITIONAL style only. Curated subset of the full report, dense layout, real computed data throughout (no placeholders). */
export function JathagamSinglePage({ view }: { view: ReportView }) {
  const lang = view.language;
  const locale = LUXON_LOCALE[lang];
  const sun = view.planets.find((p) => p.planet === "Sun")!;
  const moon = view.planets.find((p) => p.planet === "Moon")!;
  const birthLocal = DateTime.fromISO(view.birthLocalIso, { setZone: true }).setLocale(locale);
  const fmtDate = (iso: string) => DateTime.fromISO(iso, { setZone: true }).setLocale(locale).toFormat("dd MMM yyyy");
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

  const navamsaPlanets: SiderealPlanet[] = view.planets.map((p) => ({
    ...p,
    rashi: RASHIS[view.navamsaIndices[p.planet] ?? p.rashi.index],
  }));

  const mangal = view.doshas.find((d) => d.key === "mangal");
  const mangalNote = mangal?.present ? KUJA_NOTE.present : KUJA_NOTE.clear;
  const mandiTheme = view.mandi ? MANDI_HOUSE_THEME[view.mandi.houseFromAscendant] : null;

  return (
    <>
      <ReportMasthead
        style="TRADITIONAL"
        lang={lang}
        icon={AnimatedVinayagar}
        trailingIcon={AnimatedKolam}
        compact
        kicker={l("blessingL", lang)}
        title={`${l("headerSummary", lang)} — ${view.fullName}`}
        stampLabel={l("confidential", lang)}
        meta={
          <>
            <p>
              {l("reportIdL", lang)} · {view.reportId.slice(-8).toUpperCase()}
            </p>
            <p>
              {l("generatedL", lang)} · {fmtDate(view.createdAt)}
            </p>
          </>
        }
        chips={
          <>
            <span className="jd-chip jd-chip-neutral">
              <AnimatedMoonStar className="h-3 w-3" /> {rashiLabel(moon.rashi.index, lang)} {l("rasiWord", lang)}
            </span>
            <span className="jd-chip jd-chip-neutral">
              <AnimatedStar className="h-3 w-3" /> {nakshatraLabel(moon.nakshatra, lang)} · {l("padaL", lang)} {moon.nakshatra.pada}
            </span>
            <span className="jd-chip jd-chip-neutral">
              <AnimatedAscendantGlyph className="h-3 w-3" /> {rashiLabel(view.ascendant.rashi.index, lang)} {l("lagnaWord", lang)}
            </span>
            <span className="jd-chip jd-chip-neutral">
              <AnimatedSunGlyph className="h-3 w-3" /> {rashiLabel(sun.rashi.index, lang)}
            </span>
          </>
        }
      />

      {/* ---- Personal + Birth details, merged ---- */}
      <ReportSection title={`${l("personal", lang)} · ${l("birthDetails", lang)}`} style="TRADITIONAL" lang={lang} onepage>
        <div className="jd-card jd-soft grid grid-cols-3 gap-x-3 gap-y-1.5 p-2 sm:grid-cols-4">
          <ReportField style="TRADITIONAL" lang={lang} label={l("name", lang)} value={view.fullName} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("gender", lang)} value={view.gender ? lv(lang, cap(view.gender)) : "—"} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("dob", lang)} value={birthLocal.toFormat("dd MMM yyyy")} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("tob", lang)} value={view.birthTimeKnown ? birthLocal.toFormat("hh:mm a") : lv(lang, "Unknown (12:00 assumed)")} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("place", lang)} value={view.birthPlace} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("systemL", lang)} value={AYANAMSA_NAMES[view.system]} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("janmaRasi", lang)} value={rashiLabel(moon.rashi.index, lang)} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("nakPada", lang)} value={`${nakshatraLabel(moon.nakshatra, lang)} · ${moon.nakshatra.pada}`} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("lagnaAsc", lang)} value={rashiLabel(view.ascendant.rashi.index, lang)} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("sunSign", lang)} value={rashiLabel(sun.rashi.index, lang)} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("ganaL", lang)} value={lv(lang, view.avakahada.gana)} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("nadiL", lang)} value={lv(lang, view.avakahada.nadi)} />
        </div>
      </ReportSection>

      {/* ---- Charts ---- */}
      <ReportSection title={l("charts", lang)} style="TRADITIONAL" lang={lang} onepage className="jd-charts">
        <div className="grid grid-cols-2 gap-2">
          {[
            { title: l("rasiChart", lang), asc: view.ascendant.rashi.index, planets: view.planets, rot: -0.6 },
            { title: l("navamsaChart", lang), asc: view.navamsaLagnaIndex, planets: navamsaPlanets, rot: 0.5 },
          ].map((c) => (
            <div key={c.title} className="jd-card jd-pasted p-1.5" style={{ transform: `rotate(${c.rot}deg)` }}>
              <p className="jd-label mb-0.5 text-center">{c.title}</p>
              <div className="mx-auto aspect-square w-full max-w-[148px] text-[var(--jd-ink)]">
                <ChartWheel
                  chartStyle={view.chartStyle}
                  ascendantRashiIndex={c.asc}
                  planets={c.planets}
                  language={lang}
                  center={{ title: c.title, lines: [birthLocal.toFormat("dd-MM-yyyy")], footer: nakshatraLabel(moon.nakshatra, lang) }}
                />
              </div>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* ---- Planetary positions ---- */}
      <ReportSection title={l("planetary", lang)} style="TRADITIONAL" lang={lang} onepage>
        <div className="jd-card overflow-x-auto p-1">
          <table className="jd-table">
            <thead>
              <tr>
                <th>{l("colPlanet", lang)}</th>
                <th>{l("colDegree", lang)}</th>
                <th>{l("colSign", lang)}</th>
                <th>{l("nakPada", lang)}</th>
                <th>{l("colHouse", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {view.planets.map((p) => (
                <tr key={p.planet}>
                  <td className="font-semibold">
                    <HandwrittenText text={lv(lang, p.planet)} lang={lang} /> <span className="text-[var(--jd-ink-soft)]">({planetAbbr(lang, p.planet)})</span>
                  </td>
                  <td>{formatDegreesInSign(p.siderealLongitude)}</td>
                  <td>
                    <HandwrittenText text={rashiLabel(p.rashi.index, lang)} lang={lang} />
                  </td>
                  <td>
                    <HandwrittenText text={`${nakshatraLabel(p.nakshatra, lang)} · ${p.nakshatra.pada}`} lang={lang} />
                  </td>
                  <td>{p.houseFromAscendant}</td>
                </tr>
              ))}
              <tr>
                <td className="font-semibold">
                  <HandwrittenText text={lv(lang, "Lagna")} lang={lang} />
                </td>
                <td>{formatDegreesInSign(view.ascendant.siderealLongitude)}</td>
                <td>
                  <HandwrittenText text={rashiLabel(view.ascendant.rashi.index, lang)} lang={lang} />
                </td>
                <td colSpan={2}>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ReportSection>

      {/* ---- Dasha + Upagraha/Dosha ---- */}
      <div className="grid grid-cols-2 gap-3">
        <ReportSection title={l("dasha", lang)} style="TRADITIONAL" lang={lang} onepage>
          <div className="jd-card p-2">
            <ReportField
              style="TRADITIONAL"
              lang={lang}
              label={l("balanceBirth", lang)}
              value={`${lv(lang, view.dashaBalance.lord)} — ${view.dashaBalance.years}${l("yAbbr", lang)} ${view.dashaBalance.months}${l("mAbbr", lang)}`}
            />
            {view.currentDasha && (
              <ReportField
                style="TRADITIONAL"
                lang={lang}
                label={l("currentPeriod", lang)}
                value={`${lv(lang, view.currentDasha.mahaLord)} / ${lv(lang, view.currentDasha.antarLord)}`}
              />
            )}
          </div>
        </ReportSection>

        <ReportSection title={l("upagrahaL", lang)} style="TRADITIONAL" lang={lang} onepage>
          <div className="jd-card p-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold">{lv(lang, mangal?.name ?? "Mangal Dosha (Kuja Dosha)")}</span>
              <span className={cn("jd-chip", mangal?.present ? "jd-chip-bad" : "jd-chip-good")}>
                {mangal?.present ? l("presentL", lang) : l("clearL", lang)}
              </span>
            </div>
            <p className="mb-1.5 text-[9px] leading-3.5 text-[var(--jd-ink-soft)]">{mangalNote[lang === "ta" ? "ta" : "en"]}</p>
            {view.mandi && mandiTheme && (
              <>
                <p className="jd-label mb-0.5">
                  {l("mandiWord", lang)} · {rashiLabel(view.mandi.rashi.index, lang)} · {l("colHouse", lang)} {view.mandi.houseFromAscendant}
                </p>
                <p className="text-[9px] leading-3.5 text-[var(--jd-ink-soft)]">{mandiTheme[lang === "ta" ? "ta" : "en"]}</p>
              </>
            )}
          </div>
        </ReportSection>
      </div>

      {/* ---- Lucky essentials ---- */}
      <ReportSection title={l("lucky", lang)} style="TRADITIONAL" lang={lang} onepage>
        <div className="jd-card jd-soft grid grid-cols-4 gap-x-3 gap-y-2 p-2.5">
          <ReportField style="TRADITIONAL" lang={lang} label={l("luckyNumbers", lang)} value={view.lucky.numbers.slice(0, 5).join(", ")} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("luckyColour", lang)} value={lv(lang, view.numerology.luckyColor)} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("luckyDay", lang)} value={lv(lang, view.lucky.day)} />
          <ReportField style="TRADITIONAL" lang={lang} label={l("deityL", lang)} value={lv(lang, view.lucky.deity)} />
        </div>
      </ReportSection>

      {/* ---- Narrative headline ---- */}
      {view.narrative.headline && (
        <ReportSection title={l("summary", lang)} style="TRADITIONAL" lang={lang} onepage className="mb-1.5">
          <div className="jd-card jd-soft p-2.5">
            <p className="text-[10px] leading-4 text-[var(--jd-ink)]">
              <HandwrittenText text={view.narrative.headline} lang={lang} />
            </p>
          </div>
        </ReportSection>
      )}

      <ReportFooter disclaimer={l("footerDisclaimer", lang)} closingMark="சுபம்" className="mt-2 pt-2" />
    </>
  );
}
