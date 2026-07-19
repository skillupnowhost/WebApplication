import { DateTime } from "luxon";
import { rashiLabel } from "@/lib/astrology/chartLayout";
import type { NamingView } from "@/lib/astrology/naming";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import type { BabyNameSuggestion } from "@/lib/astrology/babyNames";
import { cn } from "@/lib/cn";

const L: Record<string, Record<AstrologyLanguage, string>> = {
  kicker: { en: "MyLoginn Astrology · Baby Naming", ta: "மைலாகின் ஜோதிடம் · குழந்தை பெயர் சூட்டு", hi: "माईलॉगिन ज्योतिष · शिशु नामकरण", te: "మైలాగిన్ జ్యోతిష్యం · శిశువు నామకరణం", ml: "മൈലോഗിൻ ജ്യോതിഷം · കുഞ്ഞിന്റെ പേരിടൽ" },
  title: { en: "Baby Naming Report", ta: "குழந்தை பெயர் அறிக்கை", hi: "शिशु नामकरण रिपोर्ट", te: "శిశువు నామకరణ నివేదిక", ml: "കുഞ്ഞിന്റെ പേരിടൽ റിപ്പോർട്ട്" },
  birthDetails: { en: "Birth Details", ta: "பிறப்பு விவரங்கள்", hi: "जन्म विवरण", te: "జనన వివరాలు", ml: "ജനന വിവരങ്ങൾ" },
  dob: { en: "Date of birth", ta: "பிறந்த தேதி", hi: "जन्म तिथि", te: "పుట్టిన తేదీ", ml: "ജനന തീയതി" },
  tob: { en: "Time of birth", ta: "பிறந்த நேரம்", hi: "जन्म समय", te: "పుట్టిన సమయం", ml: "ജനന സമയം" },
  place: { en: "Place of birth", ta: "பிறந்த ஊர்", hi: "जन्म स्थान", te: "జన్మస్థలం", ml: "ജനന സ്ഥലം" },
  rasi: { en: "Janma Rasi", ta: "ஜென்ம ராசி", hi: "जन्म राशि", te: "జన్మ రాశి", ml: "ജന്മ രാശി" },
  nakshatra: { en: "Nakshatra · Pada", ta: "நட்சத்திரம் · பாதம்", hi: "नक्षत्र · पद", te: "నక్షత్రం · పాదం", ml: "നക്ഷത്രം · പാദം" },
  psychic: { en: "Psychic number", ta: "மன எண்", hi: "मूलांक", te: "మూలాంకం", ml: "മൂലാങ്കം" },
  destiny: { en: "Destiny number", ta: "விதி எண்", hi: "भाग्यांक", te: "భాగ్యాంకం", ml: "ഭാഗ്യാങ്കം" },
  preferredLetter: { en: "Preferred letter", ta: "விருப்ப எழுத்து", hi: "पसंदीदा अक्षर", te: "ఇష్ట అక్షరం", ml: "ഇഷ്ട അക്ഷരം" },
  syllablesTitle: { en: "Recommended Starting Syllables", ta: "பரிந்துரைக்கப்படும் தொடக்க எழுத்துகள்", hi: "अनुशंसित प्रारंभिक अक्षर", te: "సిఫార్సు చేసిన ప్రారంభ అక్షరాలు", ml: "ശുപാർശ ചെയ്യുന്ന ആദ്യാക്ഷരങ്ങൾ" },
  birthPada: { en: "Birth pada syllable", ta: "ஜனன பாத எழுத்து", hi: "जन्म पद अक्षर", te: "జనన పాద అక్షరం", ml: "ജനന പാദ അക്ഷരം" },
  luckyTotals: { en: "Lucky name totals (Chaldean)", ta: "அதிர்ஷ்ட பெயர் எண்கள் (கல்தேயன்)", hi: "शुभ नाम अंक (कैल्डियन)", te: "అదృష్ట పేరు మొత్తాలు (కల్దీయన్)", ml: "ഭാഗ്യ പേര് തുകകൾ (കൽദിയൻ)" },
  boysTitle: { en: "Boy Names", ta: "ஆண் குழந்தை பெயர்கள்", hi: "लड़कों के नाम", te: "అబ్బాయిల పేర్లు", ml: "ആൺകുട്ടികളുടെ പേരുകൾ" },
  girlsTitle: { en: "Girl Names", ta: "பெண் குழந்தை பெயர்கள்", hi: "लड़कियों के नाम", te: "అమ్మాయిల పేర్లు", ml: "പെൺകുട്ടികളുടെ പേരുകൾ" },
  colName: { en: "Name", ta: "பெயர்", hi: "नाम", te: "పేరు", ml: "പേര്" },
  colTamil: { en: "Tamil", ta: "தமிழில்", hi: "तमिल में", te: "తమిళంలో", ml: "തമിഴിൽ" },
  colMeaning: { en: "Meaning", ta: "பொருள்", hi: "अर्थ", te: "అర్థం", ml: "അർത്ഥം" },
  colTotal: { en: "Total", ta: "கூட்டு எண்", hi: "योग", te: "మొత్తం", ml: "ആകെ" },
  colNumber: { en: "Number", ta: "எண்", hi: "अंक", te: "సంఖ్య", ml: "സംഖ്യ" },
  lucky: { en: "Lucky", ta: "அதிர்ஷ்டம்", hi: "शुभ", te: "అదృష్టం", ml: "ഭാഗ്യം" },
  luckyNote: {
    en: "A name is marked lucky when its Chaldean total reduces to the child's psychic or destiny number.",
    ta: "பெயரின் கல்தேயன் கூட்டு எண் குழந்தையின் மன எண் அல்லது விதி எண்ணாக சுருங்கினால் அது அதிர்ஷ்ட பெயராக குறிக்கப்படுகிறது.",
    hi: "जब नाम का कैल्डियन योग शिशु के मूलांक या भाग्यांक में घटता है, तो वह नाम शुभ माना जाता है।",
    te: "పేరు యొక్క కల్దీయన్ మొత్తం శిశువు మూలాంకం లేదా భాగ్యాంకానికి తగ్గితే అది అదృష్ట పేరుగా గుర్తించబడుతుంది.",
    ml: "പേരിന്റെ കൽദിയൻ ആകെത്തുക കുഞ്ഞിന്റെ മൂലാങ്കത്തിലോ ഭാഗ്യാങ്കത്തിലോ എത്തിയാൽ അത് ഭാഗ്യ പേരായി അടയാളപ്പെടുത്തുന്നു.",
  },
  generated: { en: "Generated", ta: "உருவாக்கப்பட்டது", hi: "निर्मित", te: "రూపొందించబడింది", ml: "തയ്യാറാക്കിയത്" },
  meanings: {
    en: "Meanings are shown in English.",
    ta: "பெயர் பொருள்கள் ஆங்கிலத்தில் காட்டப்பட்டுள்ளன.",
    hi: "नामों के अर्थ अंग्रेज़ी में दिखाए गए हैं।",
    te: "పేర్ల అర్థాలు ఆంగ్లంలో చూపబడ్డాయి.",
    ml: "പേരുകളുടെ അർത്ഥങ്ങൾ ഇംഗ്ലീഷിൽ കാണിച്ചിരിക്കുന്നു.",
  },
};

const l = (key: string, lang: AstrologyLanguage) => L[key]?.[lang] ?? L[key]?.en ?? key;

function nakshatraLabel(view: NamingView): string {
  const n = view.nakshatra;
  if (view.language === "ta") return n.tamil;
  if (view.language === "hi") return n.hindi;
  if (view.language === "te") return n.telugu;
  if (view.language === "ml") return n.malayalam;
  return n.english;
}

function NameTable({ names, lang }: { names: BabyNameSuggestion[]; lang: AstrologyLanguage }) {
  return (
    <div className="jd-card overflow-x-auto p-2">
      <table className="jd-table">
        <thead>
          <tr>
            <th>{l("colName", lang)}</th>
            <th>{l("colTamil", lang)}</th>
            <th>{l("colMeaning", lang)}</th>
            <th>{l("colTotal", lang)}</th>
            <th>{l("colNumber", lang)}</th>
            <th>{l("lucky", lang)}</th>
          </tr>
        </thead>
        <tbody>
          {names.map((n) => (
            <tr key={`${n.name}-${n.syllable}`}>
              <td className="font-semibold">{n.name}</td>
              <td>{n.tamil}</td>
              <td>{n.meaning}</td>
              <td>{n.chaldeanTotal}</td>
              <td>{n.reducedNumber}</td>
              <td>{n.isLucky ? <span className="jd-chip jd-chip-good">✦ {l("lucky", lang)}</span> : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NamingReportDoc({ view, printMode = false }: { view: NamingView; printMode?: boolean }) {
  const lang = view.language;
  const birthLocal = DateTime.fromISO(view.birthLocalIso, { setZone: true });

  return (
    <article className={cn("jathagam-doc astro-print-page rounded-2xl", printMode ? "shadow-none" : "p-8 shadow-[0_10px_50px_rgba(16,29,58,0.12)] sm:p-10")}>
      <header className="mb-6 border-b-2 border-[var(--jd-gold-bright)] pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="jd-kicker">{l("kicker", lang)}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--jd-royal-deep)]">{l("title", lang)}</h1>
          </div>
          <div className="text-right text-[10px] leading-4 text-[var(--jd-ink-soft)]">
            <p>
              {l("generated", lang)} · {DateTime.now().toFormat("dd MMM yyyy")}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="jd-chip jd-chip-neutral">☽ {rashiLabel(view.moonRashi.index, lang)}</span>
          <span className="jd-chip jd-chip-neutral">✦ {nakshatraLabel(view)} · {view.nakshatra.pada}</span>
          <span className="jd-chip jd-chip-gold">{view.prediction.birthPadaSyllable.latin} / {view.prediction.birthPadaSyllable.tamil}</span>
        </div>
      </header>

      <section className="astro-report-section mb-5">
        <h2 className="jd-section-title mb-2.5">{l("birthDetails", lang)}</h2>
        <div className="jd-card jd-soft grid grid-cols-2 gap-x-4 gap-y-2.5 p-4 sm:grid-cols-4">
          <div><p className="jd-label">{l("dob", lang)}</p><p className="jd-value">{birthLocal.toFormat("dd MMM yyyy (cccc)")}</p></div>
          <div><p className="jd-label">{l("tob", lang)}</p><p className="jd-value">{birthLocal.toFormat("hh:mm a")}</p></div>
          <div><p className="jd-label">{l("place", lang)}</p><p className="jd-value truncate" title={view.placeLabel}>{view.birthPlace}</p></div>
          <div><p className="jd-label">{l("rasi", lang)}</p><p className="jd-value">{rashiLabel(view.moonRashi.index, lang)}</p></div>
          <div><p className="jd-label">{l("nakshatra", lang)}</p><p className="jd-value">{nakshatraLabel(view)} · {view.nakshatra.pada}</p></div>
          <div><p className="jd-label">{l("psychic", lang)}</p><p className="jd-value">{view.psychicNumber}</p></div>
          <div><p className="jd-label">{l("destiny", lang)}</p><p className="jd-value">{view.destinyNumber}</p></div>
          {view.preferredLetter && (
            <div><p className="jd-label">{l("preferredLetter", lang)}</p><p className="jd-value uppercase">{view.preferredLetter}</p></div>
          )}
        </div>
      </section>

      <section className="astro-report-section mb-5">
        <h2 className="jd-section-title mb-2.5">{l("syllablesTitle", lang)}</h2>
        <div className="jd-card p-4">
          <div className="flex flex-wrap gap-1.5">
            {view.prediction.syllables.latin.map((syl, i) => (
              <span
                key={syl}
                className={cn(
                  "jd-chip",
                  syl === view.prediction.birthPadaSyllable.latin ? "jd-chip-gold" : "jd-chip-neutral"
                )}
              >
                {syl} / {view.prediction.syllables.tamil[i]}
              </span>
            ))}
          </div>
          <p className="jd-label mt-3">{l("birthPada", lang)}: <span className="jd-value">{view.prediction.birthPadaSyllable.latin} ({view.prediction.birthPadaSyllable.tamil})</span></p>
          <p className="jd-label mt-2">{l("luckyTotals", lang)}: <span className="jd-value">{view.prediction.luckyTotals.join(", ")}</span></p>
        </div>
      </section>

      {(view.genderFilter === "boy" || view.genderFilter === "both") && view.prediction.boys.length > 0 && (
        <section className="astro-report-section mb-5">
          <h2 className="jd-section-title mb-2.5">{l("boysTitle", lang)}</h2>
          <NameTable names={view.prediction.boys} lang={lang} />
        </section>
      )}

      {(view.genderFilter === "girl" || view.genderFilter === "both") && view.prediction.girls.length > 0 && (
        <section className="astro-report-section mb-5">
          <h2 className="jd-section-title mb-2.5">{l("girlsTitle", lang)}</h2>
          <NameTable names={view.prediction.girls} lang={lang} />
        </section>
      )}

      <footer className="mt-6 border-t border-[var(--jd-hairline)] pt-3 text-[10px] leading-4 text-[var(--jd-ink-soft)]">
        <p>{l("luckyNote", lang)}</p>
        {lang !== "en" && <p className="mt-1">{l("meanings", lang)}</p>}
      </footer>
    </article>
  );
}
