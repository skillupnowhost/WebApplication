import { DateTime } from "luxon";
import type { MuhurthamDay, MuhurthamResult, MuhurthamReasonKey } from "@/lib/astrology/muhurtham";
import type { MuhurthamEventType } from "@/lib/astrology/constants";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import type { TimeWindow } from "@/lib/astrology/muhurta";
import { cn } from "@/lib/cn";

const L: Record<string, Record<AstrologyLanguage, string>> = {
  kicker: { en: "MyLoginn Astrology · Shubha Muhurtham", ta: "மைலாகின் ஜோதிடம் · சுப முகூர்த்தம்", hi: "माईलॉगिन ज्योतिष · शुभ मुहूर्त", te: "మైలాగిన్ జ్యోతిష్యం · శుభ ముహూర్తం", ml: "മൈലോഗിൻ ജ്യോതിഷം · ശുഭ മുഹൂർത്തം" },
  title: { en: "Shubha Muhurtham Report", ta: "சுப முகூர்த்த அறிக்கை", hi: "शुभ मुहूर्त रिपोर्ट", te: "శుభ ముహూర్త నివేదిక", ml: "ശുഭ മുഹൂർത്ത റിപ്പോർട്ട്" },
  requestTitle: { en: "Request Details", ta: "கோரிக்கை விவரங்கள்", hi: "अनुरोध विवरण", te: "అభ్యర్థన వివరాలు", ml: "അഭ്യർത്ഥന വിവരങ്ങൾ" },
  requestedBy: { en: "Requested by", ta: "கோரியவர்", hi: "अनुरोधकर्ता", te: "అభ్యర్థించినవారు", ml: "അഭ്യർത്ഥിച്ചത്" },
  event: { en: "Event", ta: "நிகழ்வு", hi: "कार्यक्रम", te: "కార్యక్రమం", ml: "ചടങ്ങ്" },
  range: { en: "Date range", ta: "தேதி வரம்பு", hi: "तिथि सीमा", te: "తేదీ పరిధి", ml: "തീയതി പരിധി" },
  location: { en: "Location", ta: "இடம்", hi: "स्थान", te: "ప్రదేశం", ml: "സ്ഥലം" },
  bestTitle: { en: "Best Muhurtham Dates", ta: "சிறந்த முகூர்த்த நாட்கள்", hi: "सर्वोत्तम मुहूर्त तिथियां", te: "ఉత్తమ ముహూర్త తేదీలు", ml: "മികച്ച മുഹൂർത്ത തീയതികൾ" },
  noBest: {
    en: "No excellent or good muhurtham days fall in this range. Consider widening the date range.",
    ta: "இந்த வரம்பில் சிறந்த முகூர்த்த நாட்கள் இல்லை. தேதி வரம்பை விரிவாக்க பரிசீலிக்கவும்.",
    hi: "इस सीमा में कोई उत्तम मुहूर्त दिन नहीं है। तिथि सीमा बढ़ाने पर विचार करें।",
    te: "ఈ పరిధిలో ఉత్తమ ముహూర్త రోజులు లేవు. తేదీ పరిధిని పెంచడాన్ని పరిశీలించండి.",
    ml: "ഈ പരിധിയിൽ മികച്ച മുഹൂർത്ത ദിനങ്ങളില്ല. തീയതി പരിധി വിപുലീകരിക്കുന്നത് പരിഗണിക്കുക.",
  },
  allTitle: { en: "Day-by-Day Panchangam", ta: "நாள்வாரியான பஞ்சாங்கம்", hi: "दिन-प्रतिदिन पंचांग", te: "రోజువారీ పంచాంగం", ml: "ദിനംപ്രതി പഞ്ചാംഗം" },
  score: { en: "Score", ta: "மதிப்பெண்", hi: "अंक", te: "స్కోరు", ml: "സ്കോർ" },
  goodSlots: { en: "Auspicious time slots", ta: "சுப நேரங்கள்", hi: "शुभ समय", te: "శుభ సమయాలు", ml: "ശുഭ സമയങ്ങൾ" },
  avoid: { en: "Avoid", ta: "தவிர்க்கவும்", hi: "टालें", te: "తప్పించండి", ml: "ഒഴിവാക്കുക" },
  sunrise: { en: "Sunrise", ta: "சூரிய உதயம்", hi: "सूर्योदय", te: "సూర్యోదయం", ml: "സൂര്യോദയം" },
  sunset: { en: "Sunset", ta: "சூரிய அஸ்தமனம்", hi: "सूर्यास्त", te: "సూర్యాస్తమయం", ml: "സൂര്യാസ്തമയം" },
  colDate: { en: "Date", ta: "தேதி", hi: "तिथि", te: "తేదీ", ml: "തീയതി" },
  colDay: { en: "Day", ta: "கிழமை", hi: "वार", te: "వారం", ml: "ദിവസം" },
  colNakshatra: { en: "Nakshatra", ta: "நட்சத்திரம்", hi: "नक्षत्र", te: "నక్షత్రం", ml: "നക്ഷത്രം" },
  colTithi: { en: "Tithi", ta: "திதி", hi: "तिथि", te: "తిథి", ml: "തിഥി" },
  colYoga: { en: "Yoga", ta: "யோகம்", hi: "योग", te: "యోగం", ml: "യോഗം" },
  colVerdict: { en: "Verdict", ta: "முடிவு", hi: "निर्णय", te: "తీర్పు", ml: "വിധി" },
  excellent: { en: "Excellent", ta: "மிகச்சிறந்தது", hi: "उत्तम", te: "అత్యుత్తమం", ml: "അത്യുത്തമം" },
  good: { en: "Good", ta: "நல்லது", hi: "शुभ", te: "మంచిది", ml: "നല്ലത്" },
  average: { en: "Average", ta: "நடுத்தரம்", hi: "मध्यम", te: "మధ్యస్థం", ml: "ഇടത്തരം" },
  avoidVerdict: { en: "Avoid", ta: "தவிர்க்கவும்", hi: "वर्जित", te: "వర్జ్యం", ml: "ഒഴിവാക്കുക" },
  generated: { en: "Generated", ta: "உருவாக்கப்பட்டது", hi: "निर्मित", te: "రూపొందించబడింది", ml: "തയ്യാറാക്കിയത്" },
  method: {
    en: "Days are scored from the sunrise panchangam: event-specific nakshatras, tithi, weekday, yoga, and karana. Time slots avoid Rahu Kalam, Yamagandam, and Gulikai.",
    ta: "சூரிய உதய பஞ்சாங்கத்தின் அடிப்படையில் நாட்கள் மதிப்பிடப்படுகின்றன: நிகழ்வு சார்ந்த நட்சத்திரங்கள், திதி, கிழமை, யோகம், கரணம். சுப நேரங்கள் ராகு காலம், எமகண்டம், குளிகை தவிர்த்து தரப்படுகின்றன.",
    hi: "दिनों का मूल्यांकन सूर्योदय पंचांग से होता है: कार्यक्रम-विशेष नक्षत्र, तिथि, वार, योग और करण। शुभ समय राहु काल, यमगंड और गुलिक से बचाकर दिए गए हैं।",
    te: "సూర్యోదయ పంచాంగం ఆధారంగా రోజులు స్కోరు చేయబడతాయి: కార్యక్రమ-నిర్దిష్ట నక్షత్రాలు, తిథి, వారం, యోగం, కరణం. శుభ సమయాలు రాహుకాలం, యమగండం, గుళికను తప్పించి ఇవ్వబడ్డాయి.",
    ml: "സൂര്യോദയ പഞ്ചാംഗത്തെ അടിസ്ഥാനമാക്കി ദിനങ്ങൾ വിലയിരുത്തുന്നു: ചടങ്ങിന് അനുയോജ്യമായ നക്ഷത്രങ്ങൾ, തിഥി, ദിവസം, യോഗം, കരണം. ശുഭ സമയങ്ങൾ രാഹുകാലം, യമകണ്ടകം, ഗുളികം ഒഴിവാക്കി നൽകിയിരിക്കുന്നു.",
  },
};

const l = (key: string, lang: AstrologyLanguage) => L[key]?.[lang] ?? L[key]?.en ?? key;

const EVENT_L: Record<MuhurthamEventType, Record<AstrologyLanguage, string>> = {
  marriage: { en: "Marriage", ta: "திருமணம்", hi: "विवाह", te: "వివాహం", ml: "വിവാഹം" },
  engagement: { en: "Engagement", ta: "நிச்சயதார்த்தம்", hi: "सगाई", te: "నిశ్చితార్థం", ml: "വിവാഹനിശ്ചയം" },
  griha_pravesam: { en: "Housewarming (Griha Pravesam)", ta: "கிரகப்பிரவேசம்", hi: "गृह प्रवेश", te: "గృహప్రవేశం", ml: "ഗൃഹപ്രവേശം" },
  business_opening: { en: "Business opening", ta: "தொழில் தொடக்கம்", hi: "व्यापार आरंभ", te: "వ్యాపార ప్రారంభం", ml: "ബിസിനസ് ഉദ്ഘാടനം" },
  naming_ceremony: { en: "Naming ceremony", ta: "பெயர் சூட்டு விழா", hi: "नामकरण संस्कार", te: "నామకరణం", ml: "പേരിടൽ ചടങ്ങ്" },
  education_start: { en: "Starting education (Vidyarambham)", ta: "வித்யாரம்பம்", hi: "विद्यारंभ", te: "విద్యారంభం", ml: "വിദ്യാരംഭം" },
  travel: { en: "Travel", ta: "பயணம்", hi: "यात्रा", te: "ప్రయాణం", ml: "യാത്ര" },
  vehicle_purchase: { en: "Vehicle purchase", ta: "வாகனம் வாங்குதல்", hi: "वाहन खरीद", te: "వాహన కొనుగోలు", ml: "വാഹനം വാങ്ങൽ" },
};

const DAY_L: Record<string, Record<AstrologyLanguage, string>> = {
  Sunday: { en: "Sunday", ta: "ஞாயிறு", hi: "रविवार", te: "ఆదివారం", ml: "ഞായർ" },
  Monday: { en: "Monday", ta: "திங்கள்", hi: "सोमवार", te: "సోమవారం", ml: "തിങ്കൾ" },
  Tuesday: { en: "Tuesday", ta: "செவ்வாய்", hi: "मंगलवार", te: "మంగళవారం", ml: "ചൊവ്വ" },
  Wednesday: { en: "Wednesday", ta: "புதன்", hi: "बुधवार", te: "బుధవారం", ml: "ബുധൻ" },
  Thursday: { en: "Thursday", ta: "வியாழன்", hi: "गुरुवार", te: "గురువారం", ml: "വ്യാഴം" },
  Friday: { en: "Friday", ta: "வெள்ளி", hi: "शुक्रवार", te: "శుక్రవారం", ml: "വെള്ളി" },
  Saturday: { en: "Saturday", ta: "சனி", hi: "शनिवार", te: "శనివారం", ml: "ശനി" },
};

const REASON_L: Record<MuhurthamReasonKey, Record<AstrologyLanguage, string>> = {
  nakshatraIdeal: { en: "Ideal nakshatra for this event", ta: "இந்நிகழ்வுக்கு சிறந்த நட்சத்திரம்", hi: "इस कार्य हेतु आदर्श नक्षत्र", te: "ఈ కార్యక్రమానికి ఆదర్శ నక్షత్రం", ml: "ഈ ചടങ്ങിന് അനുയോജ്യമായ നക്ഷത്രം" },
  nakshatraGeneral: { en: "Generally auspicious nakshatra", ta: "பொதுவாக சுபமான நட்சத்திரம்", hi: "सामान्यतः शुभ नक्षत्र", te: "సాధారణంగా శుభ నక్షత్రం", ml: "പൊതുവേ ശുഭ നക്ഷത്രം" },
  nakshatraUnfavourable: { en: "Nakshatra not favourable", ta: "நட்சத்திரம் சாதகமல்ல", hi: "नक्षत्र अनुकूल नहीं", te: "నక్షత్రం అనుకూలం కాదు", ml: "നക്ഷത്രം അനുകൂലമല്ല" },
  tithiGood: { en: "Auspicious tithi", ta: "சுபமான திதி", hi: "शुभ तिथि", te: "శుభ తిథి", ml: "ശുഭ തിഥി" },
  tithiRikta: { en: "Rikta tithi — avoided", ta: "ரிக்த திதி — தவிர்க்கப்படுகிறது", hi: "रिक्ता तिथि — वर्जित", te: "రిక్త తిథి — వర్జ్యం", ml: "രിക്ത തിഥി — ഒഴിവാക്കി" },
  tithiAmavasya: { en: "Amavasya — avoided", ta: "அமாவாசை — தவிர்க்கப்படுகிறது", hi: "अमावस्या — वर्जित", te: "అమావాస్య — వర్జ్యం", ml: "അമാവാസി — ഒഴിവാക്കി" },
  weekdayGood: { en: "Favourable weekday", ta: "சாதகமான கிழமை", hi: "अनुकूल वार", te: "అనుకూల వారం", ml: "അനുകൂല ദിവസം" },
  weekdayBad: { en: "Weekday not favourable", ta: "கிழமை சாதகமல்ல", hi: "वार अनुकूल नहीं", te: "వారం అనుకూలం కాదు", ml: "ദിവസം അനുകൂലമല്ല" },
  yogaBad: { en: "Inauspicious yoga", ta: "அசுப யோகம்", hi: "अशुभ योग", te: "అశుభ యోగం", ml: "അശുഭ യോഗം" },
  karanaVishti: { en: "Vishti (Bhadra) karana", ta: "விஷ்டி (பத்ரை) கரணம்", hi: "विष्टि (भद्रा) करण", te: "విష్టి (భద్ర) కరణం", ml: "വിഷ്ടി (ഭദ്ര) കരണം" },
};

const fmtTime = (iso: string | null) => (iso ? DateTime.fromISO(iso, { setZone: true }).toFormat("hh:mm a") : "—");

function verdictChip(day: MuhurthamDay, lang: AstrologyLanguage) {
  const key = day.verdict === "avoid" ? "avoidVerdict" : day.verdict;
  const cls =
    day.verdict === "excellent" ? "jd-chip-gold" : day.verdict === "good" ? "jd-chip-good" : day.verdict === "average" ? "jd-chip-neutral" : "jd-chip-bad";
  return <span className={cn("jd-chip", cls)}>{l(key, lang)}</span>;
}

function nakshatraLabel(day: MuhurthamDay, lang: AstrologyLanguage): string {
  if (lang === "ta") return day.nakshatra.tamil;
  if (lang === "hi") return day.nakshatra.hindi;
  if (lang === "te") return day.nakshatra.telugu;
  if (lang === "ml") return day.nakshatra.malayalam;
  return day.nakshatra.english;
}

function windowText(w: TimeWindow): string {
  return `${fmtTime(w.start)} – ${fmtTime(w.end)}`;
}

export function MuhurthamReportDoc({
  name,
  event,
  fromDate,
  toDate,
  place,
  result,
  language,
  printMode = false,
}: {
  name: string;
  event: MuhurthamEventType;
  fromDate: string;
  toDate: string;
  place: string;
  result: MuhurthamResult;
  language: AstrologyLanguage;
  printMode?: boolean;
}) {
  const lang = language;

  return (
    <article className={cn("jathagam-doc astro-print-page rounded-2xl", printMode ? "shadow-none" : "p-8 shadow-[0_10px_50px_rgba(16,29,58,0.12)] sm:p-10")}>
      <header className="mb-6 border-b-2 border-[var(--jd-gold-bright)] pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="jd-kicker">{l("kicker", lang)}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--jd-royal-deep)]">
              {l("title", lang)} — {EVENT_L[event][lang]}
            </h1>
          </div>
          <div className="text-right text-[10px] leading-4 text-[var(--jd-ink-soft)]">
            <p>
              {l("generated", lang)} · {DateTime.now().toFormat("dd MMM yyyy")}
            </p>
          </div>
        </div>
      </header>

      <section className="astro-report-section mb-5">
        <h2 className="jd-section-title mb-2.5">{l("requestTitle", lang)}</h2>
        <div className="jd-card jd-soft grid grid-cols-2 gap-x-4 gap-y-2.5 p-4 sm:grid-cols-4">
          <div><p className="jd-label">{l("requestedBy", lang)}</p><p className="jd-value">{name}</p></div>
          <div><p className="jd-label">{l("event", lang)}</p><p className="jd-value">{EVENT_L[event][lang]}</p></div>
          <div>
            <p className="jd-label">{l("range", lang)}</p>
            <p className="jd-value">
              {DateTime.fromISO(fromDate).toFormat("dd MMM yyyy")} – {DateTime.fromISO(toDate).toFormat("dd MMM yyyy")}
            </p>
          </div>
          <div><p className="jd-label">{l("location", lang)}</p><p className="jd-value truncate">{place}</p></div>
        </div>
      </section>

      <section className="astro-report-section mb-5">
        <h2 className="jd-section-title mb-2.5">{l("bestTitle", lang)}</h2>
        {result.best.length === 0 ? (
          <div className="jd-card p-4">
            <p className="jd-value">{l("noBest", lang)}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {result.best.map((day) => (
              <div key={day.dateIso} className="jd-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-base font-bold text-[var(--jd-royal-deep)]">
                    {DateTime.fromISO(day.dateIso).toFormat("dd MMM yyyy")} · {DAY_L[day.weekday.name]?.[lang] ?? day.weekday.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="jd-chip jd-chip-neutral">{l("score", lang)}: {day.score}/100</span>
                    {verdictChip(day, lang)}
                  </div>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                  <div><p className="jd-label">{l("colNakshatra", lang)}</p><p className="jd-value">{nakshatraLabel(day, lang)}</p></div>
                  <div><p className="jd-label">{l("colTithi", lang)}</p><p className="jd-value">{day.tithi.paksha} {day.tithi.name}</p></div>
                  <div><p className="jd-label">{l("colYoga", lang)}</p><p className="jd-value">{day.yoga.name}</p></div>
                  <div>
                    <p className="jd-label">{l("sunrise", lang)} / {l("sunset", lang)}</p>
                    <p className="jd-value">{fmtTime(day.sunrise)} / {fmtTime(day.sunset)}</p>
                  </div>
                </div>
                {day.goodSlots.length > 0 && (
                  <div className="mt-2.5">
                    <p className="jd-label mb-1">{l("goodSlots", lang)}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {day.goodSlots.map((w) => (
                        <span key={w.key} className="jd-chip jd-chip-good">{w.label} · {windowText(w)}</span>
                      ))}
                    </div>
                  </div>
                )}
                {day.avoidWindows.length > 0 && (
                  <div className="mt-2">
                    <p className="jd-label mb-1">{l("avoid", lang)}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {day.avoidWindows.map((w) => (
                        <span key={w.key} className="jd-chip jd-chip-bad">{w.label} · {windowText(w)}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {day.reasons.map((r) => (
                    <span key={r} className="jd-chip jd-chip-neutral">{REASON_L[r][lang]}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="astro-report-section mb-5">
        <h2 className="jd-section-title mb-2.5">{l("allTitle", lang)}</h2>
        <div className="jd-card overflow-x-auto p-2">
          <table className="jd-table">
            <thead>
              <tr>
                <th>{l("colDate", lang)}</th>
                <th>{l("colDay", lang)}</th>
                <th>{l("colNakshatra", lang)}</th>
                <th>{l("colTithi", lang)}</th>
                <th>{l("colYoga", lang)}</th>
                <th>{l("score", lang)}</th>
                <th>{l("colVerdict", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {result.days.map((day) => (
                <tr key={day.dateIso}>
                  <td className="font-semibold">{DateTime.fromISO(day.dateIso).toFormat("dd MMM")}</td>
                  <td>{DAY_L[day.weekday.name]?.[lang] ?? day.weekday.name}</td>
                  <td>{nakshatraLabel(day, lang)}</td>
                  <td>{day.tithi.paksha[0]}. {day.tithi.name}</td>
                  <td>{day.yoga.name}</td>
                  <td>{day.score}</td>
                  <td>{verdictChip(day, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-6 border-t border-[var(--jd-hairline)] pt-3 text-[10px] leading-4 text-[var(--jd-ink-soft)]">
        <p>{l("method", lang)}</p>
      </footer>
    </article>
  );
}
