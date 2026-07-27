import { DateTime } from "luxon";
import { rashiLabel } from "@/lib/astrology/chartLayout";
import type { NamingView } from "@/lib/astrology/naming";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import type { BabyNameSuggestion } from "@/lib/astrology/babyNames";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { ReportMasthead, ReportSection, ReportField, ReportFooter, ReportCorners } from "./ReportPrimitives";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { l as horoscopeL } from "./ReportViewer";
import { cn } from "@/lib/cn";

const L: Record<string, Partial<Record<AstrologyLanguage, string>>> = {
  kicker: { en: "MyLoginn Astrology · Baby Naming", ta: "மைலாகின் ஜோதிடம் · குழந்தை பெயர் சூட்டு", hi: "माईलॉगिन ज्योतिष · शिशु नामकरण", te: "మైలాగిన్ జ్యోతిష్యం · శిశువు నామకరణం", ml: "മൈലോഗിൻ ജ്യോതിഷം · കുഞ്ഞിന്റെ പേരിടൽ", kn: "ಮೈಲೋಗಿನ್ ಜ್ಯೋತಿಷ್ಯ · ಶಿಶು ಹೆಸರಿಡುವಿಕೆ", bn: "মাইলগিন জ্যোতিষ · শিশু নামকরণ", mr: "माईलॉगिन ज्योतिष · शिशु नामकरण", gu: "માઇલોગિન જ્યોતિષ · બાળક નામકરણ", pa: "ਮਾਈਲੋਗਿਨ ਜੋਤਿਸ਼ · ਬੱਚੇ ਦਾ ਨਾਮ ਰੱਖਣਾ", ur: "مائیلاگن علم نجوم · بچے کا نام رکھنا" },
  title: { en: "Baby Naming Report", ta: "குழந்தை பெயர் அறிக்கை", hi: "शिशु नामकरण रिपोर्ट", te: "శిశువు నామకరణ నివేదిక", ml: "കുഞ്ഞിന്റെ പേരിടൽ റിപ്പോർട്ട്", kn: "ಶಿಶು ಹೆಸರಿಡುವಿಕೆ ವರದಿ", bn: "শিশু নামকরণ রিপোর্ট", mr: "शिशु नामकरण रिपोर्ट", gu: "બાળક નામકરણ અહેવાલ", pa: "ਬੱਚੇ ਦੇ ਨਾਮ ਰੱਖਣ ਦੀ ਰਿਪੋਰਟ", ur: "بچے کے نام رکھنے کی رپورٹ" },
  birthDetails: { en: "Birth Details", ta: "பிறப்பு விவரங்கள்", hi: "जन्म विवरण", te: "జనన వివరాలు", ml: "ജനന വിവരങ്ങൾ", kn: "ಜನನ ವಿವರಗಳು", bn: "জন্মের বিস্তারিত", mr: "जन्म विवरण", gu: "જન્મ વિગતો", pa: "ਜਨਮ ਵੇਰਵੇ", ur: "پیدائش کی تفصیلات" },
  dob: { en: "Date of birth", ta: "பிறந்த தேதி", hi: "जन्म तिथि", te: "పుట్టిన తేదీ", ml: "ജനന തീയതി", kn: "ಜನ್ಮ ದಿನಾಂಕ", bn: "জন্ম তারিখ", mr: "जन्म तिथि", gu: "જન્મ તારીખ", pa: "ਜਨਮ ਦੀ ਤਾਰੀਖ", ur: "پیدائش کی تاریخ" },
  tob: { en: "Time of birth", ta: "பிறந்த நேரம்", hi: "जन्म समय", te: "పుట్టిన సమయం", ml: "ജനന സമയം", kn: "ಜನ್ಮ ಸಮಯ", bn: "জন্মের সময়", mr: "जन्म समय", gu: "જન્મ સમય", pa: "ਜਨਮ ਸਮਾਂ", ur: "پیدائش کا وقت" },
  place: { en: "Place of birth", ta: "பிறந்த ஊர்", hi: "जन्म स्थान", te: "జన్మస్థలం", ml: "ജനന സ്ഥലം", kn: "ಜನ್ಮ ಸ್ಥಳ", bn: "জন্মস্থান", mr: "जन्म स्थान", gu: "જન્મ સ્થળ", pa: "ਜਨਮ ਸਥਾਨ", ur: "پیدائش کی جگہ" },
  rasi: { en: "Janma Rasi", ta: "ஜென்ம ராசி", hi: "जन्म राशि", te: "జన్మ రాశి", ml: "ജന്മ രാശി", kn: "ಜನ್ಮ ರಾಶಿ", bn: "জন্ম রাশি", mr: "जन्म राशि", gu: "જન્મ રાશિ", pa: "ਜਨਮ ਰਾਸ਼ੀ", ur: "پیدائش کی راشی" },
  nakshatra: { en: "Nakshatra · Pada", ta: "நட்சத்திரம் · பாதம்", hi: "नक्षत्र · पद", te: "నక్షత్రం · పాదం", ml: "നക്ഷത്രം · പാദം", kn: "ನಕ್ಷತ್ರ · ಪಾದ", bn: "নক্ষত্র · পদ", mr: "नक्षत्र · पद", gu: "નક્ષત્ર · પાદ", pa: "ਨਕਸ਼ਤਰ · ਪਦ", ur: "نکشتر · پاد" },
  psychic: { en: "Psychic number", ta: "மன எண்", hi: "मूलांक", te: "మూలాంకం", ml: "മൂലാങ്കം", kn: "ಮಾನಸಿಕ ಸಂಖ್ಯೆ", bn: "মনস্তাত্ত্বিক সংখ্যা", mr: "मानसिक संख्या", gu: "માનસિક નંબર", pa: "ਮਾਨਸਿਕ ਨੰਬਰ", ur: "ذہنی نمبر" },
  destiny: { en: "Destiny number", ta: "விதி எண்", hi: "भाग्यांक", te: "భాగ్యాంకం", ml: "ഭാഗ്യാങ്കം", kn: "ಭಾಗ್ಯ ಸಂಖ್ಯೆ", bn: "ভাগ্য সংখ্যা", mr: "भाग्यांक", gu: "ભાગ્ય નંબર", pa: "ਭਾਗ੍ਯ ਨੰਬਰ", ur: "قسمت کا نمبر" },
  preferredLetter: { en: "Preferred letter", ta: "விருப்ப எழுத்து", hi: "पसंदीदा अक्षर", te: "ఇష్ట అక్షరం", ml: "ഇഷ്ട അക്ഷരം", kn: "ಆಕರ್ಷಿತ ಅಕ್ಷರ", bn: "পছন্দের অক্ষর", mr: "पसंदीदा अक्षर", gu: "પસંદીદા અક્ષર", pa: "ਪਸੰਦ ਦਾ ਅੱਖਰ", ur: "پسندیدہ حرف" },
  syllablesTitle: { en: "Recommended Starting Syllables", ta: "பரிந்துரைக்கப்படும் தொடக்க எழுத்துகள்", hi: "अनुशंसित प्रारंभिक अक्षर", te: "సిఫార్సు చేసిన ప్రారంభ అక్షరాలు", ml: "ശുപാർശ ചെയ്യുന്ന ആദ്യാക്ഷരങ്ങൾ", kn: "ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಾರಂಭಿಕ ಅಕ್ಷರಗಳು", bn: "সুপারিশকৃত প্রারম্ভিক অক্ষর", mr: "अनुशंसित प्रारंभिक अक्षर", gu: "સૂચવેલ શરૂઆતના અક્ષરો", pa: "ਸਿਫਾਰਸ਼ ਕੀਤੇ ਗਏ ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ", ur: "مجوزہ ابتدائی حروف" },
  birthPada: { en: "Birth pada syllable", ta: "ஜனன பாத எழுத்து", hi: "जन्म पद अक्षर", te: "జనన పాద అక్షరం", ml: "ജനന പാദ അക്ഷരം", kn: "ಜನನ ಪಾದ ಅಕ್ಷರ", bn: "জন্ম পদের অক্ষর", mr: "जन्म पद अक्षर", gu: "જન્મ પાદ અક્ષર", pa: "ਜਨਮ ਪਦ ਅੱਖਰ", ur: "پیدائش کا پاد حرف" },
  luckyTotals: { en: "Lucky name totals (Chaldean)", ta: "அதிர்ஷ்ட பெயர் எண்கள் (கல்தேயன்)", hi: "शुभ नाम अंक (कैल्डियन)", te: "అదృష్ట పేరు మొత్తాలు (కల్దీయన్)", ml: "ഭാഗ്യ പേര് തുകകൾ (കൽദിയൻ)", kn: "ಅದೃಷ್ಟ ಹೆಸರು ಸಂಖ್ಯೆಗಳು (ಕಲ್ದಿಯನ್)", bn: "শুভ নাম সংখ্যা (কাল্ডিয়ান)", mr: "शुभ नाम अंक (कैल्डियन)", gu: "અદ્રષ્ટ નામ સંખ્યાઓ (કલ્દિયન)", pa: "ਸ਼ੁਭ ਨਾਮ ਅੰਕ (ਕੈਲਡਿਅਨ)", ur: "خوش قسمت نام کے اعداد (چالدیان)" },
  boysTitle: { en: "Boy Names", ta: "ஆண் குழந்தை பெயர்கள்", hi: "लड़कों के नाम", te: "అబ్బాయిల పేర్లు", ml: "ആൺകുട്ടികളുടെ പേരുകൾ", kn: "ಗಂಡು ಮಕ್ಕಳ ಹೆಸರುಗಳು", bn: "ছেলেদের নাম", mr: "मुलांची नावे", gu: "છોકરાઓના નામ", pa: "ਮੁੰਡਿਆਂ ਦੇ ਨਾਮ", ur: "لڑکوں کے نام" },
  girlsTitle: { en: "Girl Names", ta: "பெண் குழந்தை பெயர்கள்", hi: "लड़कियों के नाम", te: "అమ్మాయిల పేర్లు", ml: "പെൺകുട്ടികളുടെ പേരുകൾ", kn: "ಹೆಣ್ಣು ಮಕ್ಕಳ ಹೆಸರುಗಳು", bn: "মেয়েদের নাম", mr: "मुलींची नावे", gu: "છોકરીઓના નામ", pa: "ਕੁੜੀਆਂ ਦੇ ਨਾਮ", ur: "لڑکیوں کے نام" },
  colName: { en: "Name", ta: "பெயர்", hi: "नाम", te: "పేరు", ml: "പേര്", kn: "ಹೆಸರು", bn: "নাম", mr: "नाम", gu: "નામ", pa: "ਨਾਮ", ur: "نام" },
  colTamil: { en: "Tamil", ta: "தமிழில்", hi: "तमिल में", te: "తమిళంలో", ml: "തമിഴിൽ", kn: "ತಮಿಳು", bn: "তামিল", mr: "तमिल", gu: "તામિલ", pa: "ਤਮਿਲ", ur: "تمل" },
  colMeaning: { en: "Meaning", ta: "பொருள்", hi: "अर्थ", te: "అర్థం", ml: "അർത്ഥം", kn: "ಅರ್ಥ", bn: "অর্থ", mr: "अर्थ", gu: "અર્થ", pa: "ਅਰਥ", ur: "مفہوم" },
  colTotal: { en: "Total", ta: "கூட்டு எண்", hi: "योग", te: "మొత్తం", ml: "ആകെ", kn: "ಒಟ್ಟು", bn: "মোট", mr: "योग", gu: "કુલ", pa: "ਕੁੱਲ", ur: "کل" },
  colNumber: { en: "Number", ta: "எண்", hi: "अंक", te: "సంఖ్య", ml: "സംഖ്യ", kn: "ಸಂಖ್ಯೆ", bn: "সংখ্যা", mr: "संख्या", gu: "નંબર", pa: "ਨੰਬਰ", ur: "نمبر" },
  lucky: { en: "Lucky", ta: "அதிர்ஷ்டம்", hi: "शुभ", te: "అదృష్టం", ml: "ഭാഗ്യം", kn: "ಅದೃಷ್ಟ", bn: "শুভ", mr: "शुभ", gu: "લકી", pa: "ਸ਼ੁਭ", ur: "خوش قسمت" },
  luckyNote: {
    en: "A name is marked lucky when its Chaldean total reduces to the child's psychic or destiny number.",
    ta: "பெயரின் கல்தேயன் கூட்டு எண் குழந்தையின் மன எண் அல்லது விதி எண்ணாக சுருங்கினால் அது அதிர்ஷ்ட பெயராக குறிக்கப்படுகிறது.",
    hi: "जब नाम का कैल्डियन योग शिशु के मूलांक या भाग्यांक में घटता है, तो वह नाम शुभ माना जाता है।",
    te: "పేరు యొక్క కల్దీయన్ మొత్తం శిశువు మూలాంకం లేదా భాగ్యాంకానికి తగ్గితే అది అదృష్ట పేరుగా గుర్తించబడుతుంది.",
    ml: "പേരിന്റെ കൽദിയൻ ആകെത്തുക കുഞ്ഞിന്റെ മൂലാങ്കത്തിലോ ഭാഗ്യാങ്കത്തിലോ എത്തിയാൽ അത് ഭാഗ്യ പേരായി അടയാളപ്പെടുത്തുന്നു.",
    kn: "ಹೆಸರಿನ ಕಲ್ದೀಯನ್ ಮೊತ್ತವು ಮಗುವಿನ ಮನೋ ಅಥವಾ ಭಾಗ್ಯ ಸಂಖ್ಯೆಗೆ ಇಳಿದಾಗ ಆ ಹೆಸರನ್ನು ಅದೃಷ್ಟಕರವೆಂದು ಗುರುತಿಸಲಾಗುತ್ತದೆ.",
    bn: "নামের কাল্ডিয়ান যোগফল শিশুর মানসিক বা ভাগ্য সংখ্যায় নেমে এলে সেই নামকে শুভ নাম হিসেবে চিহ্নিত করা হয়।",
    mr: "नावाची कॅल्डियन बेरीज मुलाच्या मानसिक किंवा भाग्यांकाशी जुळल्यास ते नाव शुभ मानले जाते.",
    gu: "નામનો કૅલ્ડિયન સરવાળો બાળકના મનોવૈજ્ઞાનિક અથવા ભાગ્ય નંબર સુધી ઘટે ત્યારે તે નામ શુભ ગણાય છે.",
    pa: "ਜਦੋਂ ਨਾਮ ਦਾ ਕੈਲਡੀਅਨ ਜੋੜ ਬੱਚੇ ਦੇ ਮਾਨਸਿਕ ਜਾਂ ਭਾਗ ਅੰਕ ਤੱਕ ਘਟਦਾ ਹੈ, ਤਾਂ ਉਹ ਨਾਮ ਸ਼ੁਭ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",
    ur: "جب نام کا کالڈین مجموعہ بچے کے نفسیاتی یا قسمت کے نمبر تک کم ہو جائے تو اس نام کو خوش قسمت سمجھا جاتا ہے۔",
  },
  generated: { en: "Generated", ta: "உருவாக்கப்பட்டது", hi: "निर्मित", te: "రూపొందించబడింది", ml: "തയ്യാറാക്കിയത്", kn: "ತಯಾರಾದ", bn: "উৎপন্ন", mr: "निर्मित", gu: "ઉપજવાયેલ", pa: "ਤਿਆਰ ਕੀਤਾ", ur: "تیار کردہ" },
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
              <td>
                {n.isLucky ? (
                  <span className="jd-chip jd-chip-good">
                    <AnimatedStar className="h-3 w-3" /> {l("lucky", lang)}
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NamingReportDoc({
  view,
  reportStyle = "PROFESSIONAL",
  printMode = false,
}: {
  view: NamingView;
  reportStyle?: ReportStyleValue;
  printMode?: boolean;
}) {
  const lang = view.language;
  const birthLocal = DateTime.fromISO(view.birthLocalIso, { setZone: true });

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
        icon={AnimatedSparkle}
        kicker={l("kicker", lang)}
        title={l("title", lang)}
        stampLabel={horoscopeL("confidential", lang)}
        meta={
          <p>
            {l("generated", lang)} · {DateTime.now().toFormat("dd MMM yyyy")}
          </p>
        }
        chips={
          <>
            <span className="jd-chip jd-chip-neutral">
              <AnimatedMoonStar className="h-3 w-3" /> {rashiLabel(view.moonRashi.index, lang)}
            </span>
            <span className="jd-chip jd-chip-neutral">
              <AnimatedStar className="h-3 w-3" /> {nakshatraLabel(view)} · {view.nakshatra.pada}
            </span>
            <span className="jd-chip jd-chip-gold">{view.prediction.birthPadaSyllable.latin} / {view.prediction.birthPadaSyllable.tamil}</span>
          </>
        }
      />

      <ReportSection title={l("birthDetails", lang)} sectionKey="birthDetails" style={reportStyle} lang={lang}>
        <div className="jd-card jd-soft grid grid-cols-2 gap-x-4 gap-y-2.5 p-4 sm:grid-cols-4">
          <ReportField style={reportStyle} lang={lang} label={l("dob", lang)} value={birthLocal.toFormat("dd MMM yyyy (cccc)")} />
          <ReportField style={reportStyle} lang={lang} label={l("tob", lang)} value={birthLocal.toFormat("hh:mm a")} />
          <ReportField style={reportStyle} lang={lang} label={l("place", lang)} value={<span title={view.placeLabel}>{view.birthPlace}</span>} />
          <ReportField style={reportStyle} lang={lang} label={l("rasi", lang)} value={rashiLabel(view.moonRashi.index, lang)} />
          <ReportField style={reportStyle} lang={lang} label={l("nakshatra", lang)} value={`${nakshatraLabel(view)} · ${view.nakshatra.pada}`} />
          <ReportField style={reportStyle} lang={lang} label={l("psychic", lang)} value={view.psychicNumber} />
          <ReportField style={reportStyle} lang={lang} label={l("destiny", lang)} value={view.destinyNumber} />
          {view.preferredLetter && (
            <ReportField style={reportStyle} lang={lang} label={l("preferredLetter", lang)} value={<span className="uppercase">{view.preferredLetter}</span>} />
          )}
        </div>
      </ReportSection>

      <ReportSection title={l("syllablesTitle", lang)} sectionKey="syllablesTitle" style={reportStyle} lang={lang}>
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
      </ReportSection>

      {(view.genderFilter === "boy" || view.genderFilter === "both") && view.prediction.boys.length > 0 && (
        <ReportSection title={`${l("boysTitle", lang)} (${view.prediction.boys.length})`} sectionKey="boysTitle" style={reportStyle} lang={lang}>
          <NameTable names={view.prediction.boys} lang={lang} />
        </ReportSection>
      )}

      {(view.genderFilter === "girl" || view.genderFilter === "both") && view.prediction.girls.length > 0 && (
        <ReportSection title={`${l("girlsTitle", lang)} (${view.prediction.girls.length})`} sectionKey="girlsTitle" style={reportStyle} lang={lang}>
          <NameTable names={view.prediction.girls} lang={lang} />
        </ReportSection>
      )}

      <ReportFooter
        disclaimer={
          <>
            <p>{l("luckyNote", lang)}</p>
            {lang !== "en" && <p className="mt-1">{l("meanings", lang)}</p>}
          </>
        }
      />
    </article>
  );
}
