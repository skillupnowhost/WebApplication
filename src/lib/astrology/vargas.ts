import { RASHIS } from "./constants";
import type { AstrologyLanguage } from "./i18n";
import { lv } from "./reportL10n";
import { rashiLabel } from "./chartLayout";

/** Divisional (varga) chart calculators — classical Parashari rules (Brihat Parashara Hora Shastra).
 * Each function takes an absolute sidereal longitude and returns the resulting rashi index (0-11).
 * D1 (Rasi) and D9 (Navamsa) live in panchanga.ts; this module covers the remaining Shodasavarga
 * members used in a complete horoscope: D2, D3, D7, D10, D12, D30. */

const RASHI_SPAN = 30;

function normalizeDegrees(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

function rashiAndOffset(siderealLongitude: number): { rashiIndex: number; inSignDeg: number } {
  const lon = normalizeDegrees(siderealLongitude);
  const rashiIndex = Math.floor(lon / RASHI_SPAN) % 12;
  const inSignDeg = lon - rashiIndex * RASHI_SPAN;
  return { rashiIndex, inSignDeg };
}

/** D2 Hora (wealth): each sign's two 15° halves fall to the Sun's Hora (Leo) or Moon's Hora (Cancer).
 * Odd signs: 1st half → Leo, 2nd half → Cancer. Even signs: 1st half → Cancer, 2nd half → Leo. */
export function horaRashiIndex(siderealLongitude: number): number {
  const { rashiIndex, inSignDeg } = rashiAndOffset(siderealLongitude);
  const isOddSign = rashiIndex % 2 === 0; // 0-based even index = 1-based odd sign number (Aries=1, ...)
  const firstHalf = inSignDeg < 15;
  const sunHora = 4; // Leo
  const moonHora = 3; // Cancer
  if (isOddSign) return firstHalf ? sunHora : moonHora;
  return firstHalf ? moonHora : sunHora;
}

/** D3 Drekkana (siblings & courage): each 10° third maps to the same sign, then the 5th, then the 9th from it. */
export function drekkanaRashiIndex(siderealLongitude: number): number {
  const { rashiIndex, inSignDeg } = rashiAndOffset(siderealLongitude);
  const part = Math.floor(inSignDeg / 10); // 0, 1, 2
  return (rashiIndex + part * 4) % 12;
}

/** D7 Saptamsa (children & progeny): 7 parts of 30/7°. Odd signs count from themselves; even signs from the 7th sign onward. */
export function saptamsaRashiIndex(siderealLongitude: number): number {
  const { rashiIndex, inSignDeg } = rashiAndOffset(siderealLongitude);
  const span = RASHI_SPAN / 7;
  const part = Math.min(6, Math.floor(inSignDeg / span));
  const isOddSign = rashiIndex % 2 === 0;
  const start = isOddSign ? rashiIndex : (rashiIndex + 6) % 12;
  return (start + part) % 12;
}

/** D10 Dasamsa (career & status): 10 parts of 3°. Odd signs count from themselves; even signs from the 9th sign onward. */
export function dasamsaRashiIndex(siderealLongitude: number): number {
  const { rashiIndex, inSignDeg } = rashiAndOffset(siderealLongitude);
  const part = Math.min(9, Math.floor(inSignDeg / 3));
  const isOddSign = rashiIndex % 2 === 0;
  const start = isOddSign ? rashiIndex : (rashiIndex + 8) % 12;
  return (start + part) % 12;
}

/** D12 Dwadasamsa (parents & lineage): 12 parts of 2.5°, always counted from the sign itself. */
export function dwadasamsaRashiIndex(siderealLongitude: number): number {
  const { rashiIndex, inSignDeg } = rashiAndOffset(siderealLongitude);
  const part = Math.min(11, Math.floor(inSignDeg / 2.5));
  return (rashiIndex + part) % 12;
}

/** D30 Trimsamsa (misfortunes & inner weaknesses): classical uneven division ruled by 5 planets,
 * with different degree spans for odd and even signs (BPHS). */
export function trimsamsaRashiIndex(siderealLongitude: number): number {
  const { rashiIndex, inSignDeg } = rashiAndOffset(siderealLongitude);
  const isOddSign = rashiIndex % 2 === 0;

  // [upperBoundDeg, resultRashiIndex] cumulative bands, 0-based rashi indices.
  const oddBands: [number, number][] = [
    [5, 0], // Mars 0-5 -> Aries
    [10, 10], // Saturn 5-10 -> Aquarius
    [18, 8], // Jupiter 10-18 -> Sagittarius
    [25, 2], // Mercury 18-25 -> Gemini
    [30, 6], // Venus 25-30 -> Libra
  ];
  const evenBands: [number, number][] = [
    [5, 1], // Venus 0-5 -> Taurus
    [12, 5], // Mercury 5-12 -> Virgo
    [20, 11], // Jupiter 12-20 -> Pisces
    [25, 9], // Saturn 20-25 -> Capricorn
    [30, 7], // Mars 25-30 -> Scorpio
  ];

  const bands = isOddSign ? oddBands : evenBands;
  for (const [upper, result] of bands) {
    if (inSignDeg < upper) return result;
  }
  return bands[bands.length - 1][1];
}

export type VargaKey = "D2" | "D3" | "D7" | "D9" | "D10" | "D12" | "D30";

export const VARGA_CALCULATORS: Record<Exclude<VargaKey, "D9">, (siderealLongitude: number) => number> = {
  D2: horaRashiIndex,
  D3: drekkanaRashiIndex,
  D7: saptamsaRashiIndex,
  D10: dasamsaRashiIndex,
  D12: dwadasamsaRashiIndex,
  D30: trimsamsaRashiIndex,
};

export const VARGA_LABELS: Record<VargaKey, { en: string; ta: string; nameL: Record<AstrologyLanguage, string>; significance: Record<AstrologyLanguage, string> }> = {
  D2: {
    en: "Hora (D2)", ta: "ஹோரை (D2)",
    nameL: { en: "Hora (D2)", ta: "ஹோரை (D2)", hi: "होरा (D2)", te: "హోర (D2)", ml: "ഹോറ (D2)", kn: "ಹೋರಾ (D2)", bn: "হোরা (D2)", mr: "होरा (D2)", gu: "હોરા (D2)", pa: "ਹੋਰਾ (D2)", ur: "ہورا (D2)" },
    significance: { en: "Wealth", ta: "செல்வம்", hi: "धन", te: "సంపద", ml: "ധനം", kn: "ಸಂಪತ್ತು", bn: "সম্পদ", mr: "संपत्ती", gu: "સંપત્તિ", pa: "ਧਨ", ur: "دولت" },
  },
  D3: {
    en: "Drekkana (D3)", ta: "திரேக்காணம் (D3)",
    nameL: { en: "Drekkana (D3)", ta: "திரேக்காணம் (D3)", hi: "द्रेष्काण (D3)", te: "ద్రేష్కాణ (D3)", ml: "ദ്രേഷ്കാണം (D3)", kn: "ದ್ರೇಷ್ಕಾಣ (D3)", bn: "দ্রেষ্কাণ (D3)", mr: "द्रेष्काण (D3)", gu: "દ્રેષ્કાણ (D3)", pa: "ਦ੍ਰੇਸ਼ਕਾਣ (D3)", ur: "دریشکان (D3)" },
    significance: { en: "Siblings & courage", ta: "உடன்பிறப்பு & துணிவு", hi: "भाई-बहन व साहस", te: "తోబుట్టువులు & ధైర్యం", ml: "സഹോദരങ്ങളും ധൈര്യവും", kn: "ಒಡಹುಟ್ಟಿದವರು ಮತ್ತು ಧೈರ್ಯ", bn: "ভাইবোন ও সাহস", mr: "भावंडे व धैर्य", gu: "ભાઈ-બહેન અને હિંમત", pa: "ਭੈਣ-ਭਰਾ ਅਤੇ ਹਿੰਮਤ", ur: "بہن بھائی اور ہمت" },
  },
  D7: {
    en: "Saptamsa (D7)", ta: "சப்தாம்சம் (D7)",
    nameL: { en: "Saptamsa (D7)", ta: "சப்தாம்சம் (D7)", hi: "सप्तांश (D7)", te: "సప్తాంశ (D7)", ml: "സപ്താംശം (D7)", kn: "ಸಪ್ತಾಂಶ (D7)", bn: "সপ্তাংশ (D7)", mr: "सप्तांश (D7)", gu: "સપ્તાંશ (D7)", pa: "ਸਪਤਾਂਸ਼ (D7)", ur: "سپتانش (D7)" },
    significance: { en: "Children & progeny", ta: "குழந்தைகள் & வழித்தோன்றல்", hi: "संतान", te: "సంతానం", ml: "സന്താനങ്ങൾ", kn: "ಸಂತಾನ", bn: "সন্তান", mr: "संतती", gu: "સંતાન", pa: "ਔਲਾਦ", ur: "اولاد" },
  },
  D9: {
    en: "Navamsa (D9)", ta: "நவாம்சம் (D9)",
    nameL: { en: "Navamsa (D9)", ta: "நவாம்சம் (D9)", hi: "नवांश (D9)", te: "నవాంశ (D9)", ml: "നവാംശം (D9)", kn: "ನವಾಂಶ (D9)", bn: "নবাংশ (D9)", mr: "नवांश (D9)", gu: "નવાંશ (D9)", pa: "ਨਵਾਂਸ਼ (D9)", ur: "نوانش (D9)" },
    significance: { en: "Marriage & dharma", ta: "திருமணம் & தர்மம்", hi: "विवाह व धर्म", te: "వివాహం & ధర్మం", ml: "വിവാഹവും ധർമവും", kn: "ವಿವಾಹ ಮತ್ತು ಧರ್ಮ", bn: "বিবাহ ও ধর্ম", mr: "विवाह व धर्म", gu: "લગ્ન અને ધર્મ", pa: "ਵਿਆਹ ਅਤੇ ਧਰਮ", ur: "شادی اور دھرم" },
  },
  D10: {
    en: "Dasamsa (D10)", ta: "தசாம்சம் (D10)",
    nameL: { en: "Dasamsa (D10)", ta: "தசாம்சம் (D10)", hi: "दशांश (D10)", te: "దశాంశ (D10)", ml: "ദശാംശം (D10)", kn: "ದಶಾಂಶ (D10)", bn: "দশাংশ (D10)", mr: "दशांश (D10)", gu: "દશાંશ (D10)", pa: "ਦਸਾਂਸ਼ (D10)", ur: "دسانش (D10)" },
    significance: { en: "Career & status", ta: "தொழில் & அந்தஸ்து", hi: "करियर व प्रतिष्ठा", te: "వృత్తి & హోదా", ml: "കരിയറും പദവിയും", kn: "ವೃತ್ತಿ ಮತ್ತು ಸ್ಥಾನಮಾನ", bn: "কর্মজীবন ও মর্যাদা", mr: "करिअर व प्रतिष्ठा", gu: "કારકિર્દી અને દરજ્જો", pa: "ਕਰੀਅਰ ਅਤੇ ਰੁਤਬਾ", ur: "کیریئر اور مقام" },
  },
  D12: {
    en: "Dwadasamsa (D12)", ta: "துவாதசாம்சம் (D12)",
    nameL: { en: "Dwadasamsa (D12)", ta: "துவாதசாம்சம் (D12)", hi: "द्वादशांश (D12)", te: "ద్వాదశాంశ (D12)", ml: "ദ്വാദശാംശം (D12)", kn: "ದ್ವಾದಶಾಂಶ (D12)", bn: "দ্বাদশাংশ (D12)", mr: "द्वादशांश (D12)", gu: "દ્વાદશાંશ (D12)", pa: "ਦਵਾਦਸ਼ਾਂਸ਼ (D12)", ur: "دوادشانش (D12)" },
    significance: { en: "Parents & lineage", ta: "பெற்றோர் & குலம்", hi: "माता-पिता व वंश", te: "తల్లిదండ్రులు & వంశం", ml: "മാതാപിതാക്കളും വംശവും", kn: "ಪೋಷಕರು ಮತ್ತು ವಂಶ", bn: "পিতামাতা ও বংশ", mr: "पालक व वंश", gu: "માતાપિતા અને વંશ", pa: "ਮਾਪੇ ਅਤੇ ਵੰਸ਼", ur: "والدین اور نسب" },
  },
  D30: {
    en: "Trimsamsa (D30)", ta: "திரிம்சாம்சம் (D30)",
    nameL: { en: "Trimsamsa (D30)", ta: "திரிம்சாம்சம் (D30)", hi: "त्रिंशांश (D30)", te: "త్రింశాంశ (D30)", ml: "ത്രിംശാംശം (D30)", kn: "ತ್ರಿಂಶಾಂಶ (D30)", bn: "ত্রিংশাংশ (D30)", mr: "त्रिंशांश (D30)", gu: "ત્રિંશાંશ (D30)", pa: "ਤ੍ਰਿੰਸ਼ਾਂਸ਼ (D30)", ur: "ترنشانش (D30)" },
    significance: { en: "Misfortunes & inner weaknesses", ta: "தீங்கு & உள் பலவீனங்கள்", hi: "कष्ट व आंतरिक दुर्बलताएं", te: "కష్టాలు & అంతర్గత బలహీనతలు", ml: "ദുരിതങ്ങളും ആന്തരിക ദൗർബല്യങ്ങളും", kn: "ಸಂಕಷ್ಟಗಳು ಮತ್ತು ಆಂತರಿಕ ದೌರ್ಬಲ್ಯಗಳು", bn: "দুর্ভাগ্য ও অভ্যন্তরীণ দুর্বলতা", mr: "संकटे व अंतर्गत कमकुवतपणा", gu: "દુર્ભાગ્ય અને આંતરિક નબળાઈઓ", pa: "ਬਦਕਿਸਮਤੀ ਅਤੇ ਅੰਦਰੂਨੀ ਕਮਜ਼ੋਰੀਆਂ", ur: "بدقسمتی اور اندرونی کمزوریاں" },
  },
};

export function rashiOf(index: number) {
  return RASHIS[((index % 12) + 12) % 12];
}

const VARGA_TEMPLATE: Record<AstrologyLanguage, (varga: string, subject: string, rashi: string, lord: string, significance: string) => string> = {
  en: (v, s, r, l, sig) => `In the ${v}, ${s} falls in ${r}, ruled by ${l} — coloring matters of ${sig} with ${l}'s classical themes.`,
  ta: (v, s, r, l, sig) => `${v}-இல் ${s} ${r} ராசியில் அமைந்துள்ளது (அதிபதி: ${l}) — இது ${sig} தொடர்பான விஷயங்களை ${l} கிரகத்தின் குணங்களால் வண்ணமாக்குகிறது.`,
  hi: (v, s, r, l, sig) => `${v} में, ${s} ${r} राशि में स्थित है (स्वामी: ${l}) — यह ${sig} से जुड़े विषयों को ${l} के गुणों से रंग देता है।`,
  te: (v, s, r, l, sig) => `${v}లో, ${s} ${r} రాశిలో ఉంది (అధిపతి: ${l}) — ఇది ${sig}కు సంబంధించిన అంశాలను ${l} లక్షణాలతో ప్రభావితం చేస్తుంది.`,
  ml: (v, s, r, l, sig) => `${v}ൽ, ${s} ${r} രാശിയിലാണ് (അധിപൻ: ${l}) — ഇത് ${sig} സംബന്ധിച്ച കാര്യങ്ങളെ ${l}ന്റെ സ്വഭാവങ്ങളാൽ സ്വാധീനിക്കുന്നു.`,
  kn: (v, s, r, l, sig) => `${v}ನಲ್ಲಿ, ${s} ${r} ರಾಶಿಯಲ್ಲಿದೆ (ಒಡೆಯ: ${l}) — ಇದು ${sig} ಗೆ ಸಂಬಂಧಿಸಿದ ವಿಷಯಗಳನ್ನು ${l} ನ ಗುಣಗಳಿಂದ ಬಣ್ಣಿಸುತ್ತದೆ.`,
  bn: (v, s, r, l, sig) => `${v}-এ, ${s} ${r} রাশিতে অবস্থিত (অধিপতি: ${l}) — এটি ${sig} সংক্রান্ত বিষয়গুলিকে ${l}-এর বৈশিষ্ট্য দিয়ে রাঙিয়ে দেয়।`,
  mr: (v, s, r, l, sig) => `${v} मध्ये, ${s} ${r} राशीत आहे (स्वामी: ${l}) — हे ${sig} शी संबंधित बाबींना ${l} च्या गुणांनी रंगवते.`,
  gu: (v, s, r, l, sig) => `${v} માં, ${s} ${r} રાશિમાં છે (સ્વામી: ${l}) — આ ${sig} સંબંધિત બાબતોને ${l} ના ગુણોથી રંગ આપે છે.`,
  pa: (v, s, r, l, sig) => `${v} ਵਿੱਚ, ${s} ${r} ਰਾਸ਼ੀ ਵਿੱਚ ਹੈ (ਸੁਆਮੀ: ${l}) — ਇਹ ${sig} ਨਾਲ ਸੰਬੰਧਿਤ ਮਾਮਲਿਆਂ ਨੂੰ ${l} ਦੇ ਗੁਣਾਂ ਨਾਲ ਰੰਗ ਦਿੰਦਾ ਹੈ।`,
  ur: (v, s, r, l, sig) => `${v} میں، ${s} ${r} راشی میں ہے (مالک: ${l}) — یہ ${sig} سے متعلق معاملات کو ${l} کی خصوصیات سے رنگ دیتا ہے۔`,
};

/** Interpretive paragraph, in any supported language, for a subject's placement in one
 * divisional chart — e.g. "in the Navamsa, Priya's Lagna falls in Leo, ruled by the Sun,
 * coloring marriage and dharma with Sun's themes." Uses only the varga's own resulting rashi
 * (already computed), so it adds no new astronomical assumption. */
export function vargaInsight(key: VargaKey, rashiIndex: number, subjectLabel: string, lang: AstrologyLanguage): string {
  const r = rashiOf(rashiIndex);
  const label = VARGA_LABELS[key];
  const vargaName = label.nameL[lang];
  const rashiName = rashiLabel(rashiIndex, lang);
  const lordName = lv(lang, r.lord);
  return VARGA_TEMPLATE[lang](vargaName, subjectLabel, rashiName, lordName, label.significance[lang]);
}
