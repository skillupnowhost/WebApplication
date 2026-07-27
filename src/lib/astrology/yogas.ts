import type { PlanetName, RashiInfo } from "./constants";
import type { SiderealPlanet } from "./chart";
import type { PlanetStrength } from "./strength";
import type { AstrologyLanguage } from "./i18n";
import { lv } from "./reportL10n";

/** Classical yoga (planetary combination) detection — Parashari rules. Each yoga is evaluated
 * deterministically from placements already computed elsewhere (dignity from strength.ts,
 * house-from-ascendant from chart.ts) so this module adds no new astronomical assumptions.
 * Names and descriptions are generated in any of the 11 supported languages from a small shared
 * vocabulary bank, composed with already-localized planet names (lv()). */

export type YogaResult = {
  key: string;
  name: Record<AstrologyLanguage, string>;
  present: boolean;
  planets: PlanetName[];
  description: Record<AstrologyLanguage, string>;
};

const KENDRA_HOUSES = new Set([1, 4, 7, 10]);
const TRIKONA_HOUSES = new Set([1, 5, 9]);
const DUSTHANA_HOUSES = new Set([6, 8, 12]);
const NATURAL_BENEFICS = new Set<PlanetName>(["Jupiter", "Venus", "Mercury"]);

function houseOf(rashiIndex: number, ascendantRashiIndex: number): number {
  return ((rashiIndex - ascendantRashiIndex + 12) % 12) + 1;
}

function houseLord(houseNumber: number, ascendantRashiIndex: number, rashiOfIndex: (i: number) => RashiInfo): PlanetName {
  const rashiIndex = (ascendantRashiIndex + houseNumber - 1) % 12;
  return rashiOfIndex(rashiIndex).lord;
}

/* ---- Shared per-language vocabulary (kendra/trikona/dusthana are kept as transliterated
   Sanskrit terms, following this codebase's existing convention for "dasha", "rashi", etc.) ---- */
type L11 = Record<AstrologyLanguage, string>;

const YOGA_WORD: L11 = { en: "Yoga", ta: "யோகம்", hi: "योग", te: "యోగం", ml: "യോഗം", kn: "ಯೋಗ", bn: "যোগ", mr: "योग", gu: "યોગ", pa: "ਯੋਗ", ur: "یوگ" };
const HOUSE_WORD: L11 = { en: "house", ta: "பாவம்", hi: "भाव", te: "భావం", ml: "ഭാവം", kn: "ಭಾವ", bn: "ভাব", mr: "भाव", gu: "ભાવ", pa: "ਭਾਵ", ur: "بھاو" };
const FROM_ASCENDANT: L11 = {
  en: "from the ascendant", ta: "லக்னத்திலிருந்து", hi: "लग्न से", te: "లగ్నం నుండి", ml: "ലഗ്നത്തിൽ നിന്ന്", kn: "ಲಗ್ನದಿಂದ", bn: "লগ্ন থেকে", mr: "लग्नापासून", gu: "લગ્નથી", pa: "ਲਗਨ ਤੋਂ", ur: "لگن سے",
};
const FROM_MOON: L11 = {
  en: "from the Moon", ta: "சந்திரனிலிருந்து", hi: "चंद्रमा से", te: "చంద్రుని నుండి", ml: "ചന്ദ്രനിൽ നിന്ന്", kn: "ಚಂದ್ರನಿಂದ", bn: "চন্দ্র থেকে", mr: "चंद्रापासून", gu: "ચંદ્રથી", pa: "ਚੰਦਰਮਾ ਤੋਂ", ur: "چاند سے",
};
const KENDRA_TERM: L11 = { en: "a kendra (angle)", ta: "கேந்திர ஸ்தானம்", hi: "केंद्र (कोण)", te: "కేంద్రం (కోణం)", ml: "കേന്ദ്രം (കോൺ)", kn: "ಕೇಂದ್ರ (ಕೋನ)", bn: "কেন্দ্র (কোণ)", mr: "केंद्र (कोन)", gu: "કેન્દ્ર (ખૂણો)", pa: "ਕੇਂਦਰ (ਕੋਣ)", ur: "کیندر (زاویہ)" };
const TRIKONA_TERM: L11 = { en: "trikona", ta: "திரிகோணம்", hi: "त्रिकोण", te: "త్రికోణం", ml: "ത്രികോണം", kn: "ತ್ರಿಕೋನ", bn: "ত্রিকোণ", mr: "त्रिकोण", gu: "ત્રિકોણ", pa: "ਤ੍ਰਿਕੋਣ", ur: "تریکونہ" };
const DUSTHANA_TERM: L11 = { en: "dusthana", ta: "துஸ்தானம்", hi: "दुःस्थान", te: "దుఃస్థానం", ml: "ദുഃസ്ഥാനം", kn: "ದುಃಸ್ಥಾನ", bn: "দুঃস্থান", mr: "दुःस्थान", gu: "દુઃસ્થાન", pa: "ਦੁਸਥਾਨ", ur: "دستھان" };
const EXALTED_W: L11 = { en: "exalted", ta: "உச்சம் பெற்று", hi: "उच्च राशि में होकर", te: "ఉచ్ఛస్థితిలో", ml: "ഉച്ചത്തിൽ", kn: "ಉಚ್ಚ ಸ್ಥಿತಿಯಲ್ಲಿ", bn: "উচ্চস্থ হয়ে", mr: "उच्च राशीत", gu: "ઉચ્ચ સ્થિતિમાં", pa: "ਉੱਚ ਅਵਸਥਾ ਵਿੱਚ", ur: "اوچ درجے میں" };
const OWN_SIGN_W: L11 = { en: "in its own sign", ta: "சொந்த வீட்டில் இருந்து", hi: "स्वराशि में होकर", te: "స్వక్షేత్రంలో", ml: "സ്വക്ഷേത്രത്തിൽ", kn: "ಸ್ವಕ್ಷೇತ್ರದಲ್ಲಿ", bn: "স্বরাশিতে থেকে", mr: "स्वराशीत", gu: "સ્વરાશિમાં", pa: "ਆਪਣੀ ਰਾਸ਼ੀ ਵਿੱਚ", ur: "اپنی راشی میں" };
const CONJOIN_W: L11 = {
  en: "conjoin in the same sign", ta: "ஒரே ராசியில் இணைந்துள்ளனர்", hi: "एक ही राशि में युति करते हैं", te: "ఒకే రాశిలో కలిసి ఉన్నారు", ml: "ഒരേ രാശിയിൽ ചേരുന്നു", kn: "ಒಂದೇ ರಾಶಿಯಲ್ಲಿ ಸೇರುತ್ತವೆ", bn: "একই রাশিতে যুক্ত হয়", mr: "एकाच राशीत युती करतात", gu: "એક જ રાશિમાં યુતિ કરે છે", pa: "ਇੱਕੋ ਰਾਸ਼ੀ ਵਿੱਚ ਯੁਤੀ ਕਰਦੇ ਹਨ", ur: "ایک ہی راشی میں مل جاتے ہیں",
};
const FORM_TEMPLATE: Record<AstrologyLanguage, (subject: string, yogaName: string, meaning: string) => string> = {
  en: (s, y, m) => `${s}, forming ${y} — ${m}.`,
  ta: (s, y, m) => `${s} — இது ${y} எனப்படும், ${m}.`,
  hi: (s, y, m) => `${s}, जिससे ${y} बनता है — ${m}।`,
  te: (s, y, m) => `${s}, ఇది ${y}ను ఏర్పరుస్తుంది — ${m}.`,
  ml: (s, y, m) => `${s}, ഇത് ${y} രൂപപ്പെടുത്തുന്നു — ${m}.`,
  kn: (s, y, m) => `${s}, ಇದು ${y} ಅನ್ನು ರೂಪಿಸುತ್ತದೆ — ${m}.`,
  bn: (s, y, m) => `${s}, যা ${y} গঠন করে — ${m}।`,
  mr: (s, y, m) => `${s}, ज्यामुळे ${y} तयार होतो — ${m}.`,
  gu: (s, y, m) => `${s}, જેનાથી ${y} રચાય છે — ${m}.`,
  pa: (s, y, m) => `${s}, ਜਿਸ ਨਾਲ ${y} ਬਣਦਾ ਹੈ — ${m}।`,
  ur: (s, y, m) => `${s}، جس سے ${y} بنتا ہے — ${m}۔`,
};
const ABSENT_TEMPLATE: Record<AstrologyLanguage, (condition: string, yogaName: string) => string> = {
  en: (c, y) => `${c}, so ${y} does not form.`,
  ta: (c, y) => `${c}, ஆகவே ${y} அமையவில்லை.`,
  hi: (c, y) => `${c}, इसलिए ${y} नहीं बनता।`,
  te: (c, y) => `${c}, కాబట్టి ${y} ఏర్పడదు.`,
  ml: (c, y) => `${c}, അതിനാൽ ${y} രൂപപ്പെടുന്നില്ല.`,
  kn: (c, y) => `${c}, ಆದ್ದರಿಂದ ${y} ರೂಪುಗೊಳ್ಳುವುದಿಲ್ಲ.`,
  bn: (c, y) => `${c}, তাই ${y} গঠিত হয় না।`,
  mr: (c, y) => `${c}, त्यामुळे ${y} तयार होत नाही.`,
  gu: (c, y) => `${c}, તેથી ${y} રચાતો નથી.`,
  pa: (c, y) => `${c}, ਇਸ ਲਈ ${y} ਨਹੀਂ ਬਣਦਾ।`,
  ur: (c, y) => `${c}، اس لیے ${y} نہیں بنتا۔`,
};
const AND_W: L11 = { en: "and", ta: "மற்றும்", hi: "और", te: "మరియు", ml: "ഉം", kn: "ಮತ್ತು", bn: "ও", mr: "आणि", gu: "અને", pa: "ਅਤੇ", ur: "اور" };
const DOES_NOT_MEET: L11 = {
  en: "does not meet the exaltation/own-sign-in-kendra condition",
  ta: "உச்சம்/சொந்த வீடு + கேந்திர நிபந்தனையை பூர்த்தி செய்யவில்லை",
  hi: "उच्च/स्वराशि-केंद्र की शर्त पूरी नहीं करता",
  te: "ఉచ్ఛ/స్వక్షేత్ర-కేంద్ర షరతును తీర్చదు",
  ml: "ഉച്ച/സ്വക്ഷേത്ര-കേന്ദ്ര വ്യവസ്ഥ പാലിക്കുന്നില്ല",
  kn: "ಉಚ್ಚ/ಸ್ವಕ್ಷೇತ್ರ-ಕೇಂದ್ರ ಷರತ್ತನ್ನು ಪೂರೈಸುವುದಿಲ್ಲ",
  bn: "উচ্চ/স্বরাশি-কেন্দ্র শর্ত পূরণ করে না",
  mr: "उच्च/स्वराशी-केंद्र अट पूर्ण करत नाही",
  gu: "ઉચ્ચ/સ્વરાશિ-કેન્દ્ર શરત પૂરી કરતું નથી",
  pa: "ਉੱਚ/ਸਵਰਾਸ਼ੀ-ਕੇਂਦਰ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਕਰਦਾ",
  ur: "اوچ/سو راشی-کیندر شرط پوری نہیں کرتا",
};
const NOT_CONJUNCT: L11 = {
  en: "are not conjunct", ta: "இணையவில்லை", hi: "युति में नहीं हैं", te: "కలిసి లేవు", ml: "ചേരുന്നില്ല", kn: "ಸೇರುವುದಿಲ್ಲ", bn: "যুক্ত নয়", mr: "युतीत नाहीत", gu: "યુતિમાં નથી", pa: "ਯੁਤੀ ਵਿੱਚ ਨਹੀਂ ਹਨ", ur: "مل نہیں رہے",
};
const NOT_PLACED_IN: L11 = {
  en: "is not placed there", ta: "அங்கு அமையவில்லை", hi: "वहां स्थित नहीं है", te: "అక్కడ లేదు", ml: "അവിടെ സ്ഥിതി ചെയ്യുന്നില്ല", kn: "ಅಲ್ಲಿ ಇಲ್ಲ", bn: "সেখানে অবস্থিত নয়", mr: "तिथे नाही", gu: "ત્યાં નથી", pa: "ਉੱਥੇ ਨਹੀਂ ਹੈ", ur: "وہاں موجود نہیں ہے",
};

const MAHAPURUSHA_MEANING: L11 = {
  en: "a Panch Mahapurusha Yoga granting strong, self-made character traits",
  ta: "பஞ்சமகாபுருஷ யோகம், வலிமையான, சுயமாக வளர்க்கும் ஆளுமை பண்புகளை அளிக்கிறது",
  hi: "पंच महापुरुष योग, जो सशक्त, स्वनिर्मित चरित्र गुण प्रदान करता है",
  te: "పంచ మహాపురుష యోగం, బలమైన, స్వయంకృషితో నిర్మించిన వ్యక్తిత్వ లక్షణాలను ఇస్తుంది",
  ml: "പഞ്ച മഹാപുരുഷ യോഗം, ശക്തവും സ്വയം കെട്ടിപ്പടുത്തതുമായ വ്യക്തിത്വ ഗുണങ്ങൾ നൽകുന്നു",
  kn: "ಪಂಚ ಮಹಾಪುರುಷ ಯೋಗ, ಬಲಿಷ್ಠ, ಸ್ವಯಂ ನಿರ್ಮಿತ ವ್ಯಕ್ತಿತ್ವ ಗುಣಗಳನ್ನು ನೀಡುತ್ತದೆ",
  bn: "পঞ্চ মহাপুরুষ যোগ, শক্তিশালী, স্বনির্মিত চরিত্র বৈশিষ্ট্য প্রদান করে",
  mr: "पंच महापुरुष योग, बलवान, स्वनिर्मित व्यक्तिमत्व गुण देतो",
  gu: "પંચ મહાપુરુષ યોગ, મજબૂત, સ્વનિર્મિત વ્યક્તિત્વ ગુણો આપે છે",
  pa: "ਪੰਚ ਮਹਾਪੁਰਖ ਯੋਗ, ਮਜ਼ਬੂਤ, ਸਵੈ-ਨਿਰਮਿਤ ਸ਼ਖ਼ਸੀਅਤ ਗੁਣ ਦਿੰਦਾ ਹੈ",
  ur: "پنچ مہاپروش یوگ، مضبوط، خود ساختہ کردار کی خصوصیات دیتا ہے",
};

const MAHAPURUSHA: { key: string; planet: PlanetName; name: L11 }[] = [
  { key: "ruchaka", planet: "Mars", name: { en: "Ruchaka Yoga", ta: "ருசக யோகம்", hi: "रुचक योग", te: "రుచక యోగం", ml: "രുചക യോഗം", kn: "ರುಚಕ ಯೋಗ", bn: "রুচক যোগ", mr: "रुचक योग", gu: "રુચક યોગ", pa: "ਰੁਚਕ ਯੋਗ", ur: "روچک یوگ" } },
  { key: "bhadra", planet: "Mercury", name: { en: "Bhadra Yoga", ta: "பத்ர யோகம்", hi: "भद्र योग", te: "భద్ర యోగం", ml: "ഭദ്ര യോഗം", kn: "ಭದ್ರ ಯೋಗ", bn: "ভদ্র যোগ", mr: "भद्र योग", gu: "ભદ્ર યોગ", pa: "ਭਦਰ ਯੋਗ", ur: "بھدر یوگ" } },
  { key: "hamsa", planet: "Jupiter", name: { en: "Hamsa Yoga", ta: "ஹம்ச யோகம்", hi: "हंस योग", te: "హంస యోగం", ml: "ഹംസ യോഗം", kn: "ಹಂಸ ಯೋಗ", bn: "হংস যোগ", mr: "हंस योग", gu: "હંસ યોગ", pa: "ਹੰਸ ਯੋਗ", ur: "ہنس یوگ" } },
  { key: "malavya", planet: "Venus", name: { en: "Malavya Yoga", ta: "மாளவ்ய யோகம்", hi: "मालव्य योग", te: "మాళవ్య యోగం", ml: "മാളവ്യ യോഗം", kn: "ಮಾಳವ್ಯ ಯೋಗ", bn: "মালব্য যোগ", mr: "मालव्य योग", gu: "માળવ્ય યોગ", pa: "ਮਾਲਵਯ ਯੋਗ", ur: "مالویہ یوگ" } },
  { key: "sasa", planet: "Saturn", name: { en: "Sasa Yoga", ta: "சச யோகம்", hi: "शश योग", te: "శశ యోగం", ml: "ശശ യോഗം", kn: "ಶಶ ಯೋಗ", bn: "শশ যোগ", mr: "शश योग", gu: "શશ યોગ", pa: "ਸ਼ਸ਼ ਯੋਗ", ur: "ششا یوگ" } },
];

export function detectYogas(params: {
  planets: SiderealPlanet[];
  strengths: PlanetStrength[];
  ascendantRashiIndex: number;
  rashiOfIndex: (index: number) => RashiInfo;
}): YogaResult[] {
  const { planets, strengths, ascendantRashiIndex, rashiOfIndex } = params;
  const results: YogaResult[] = [];

  const byPlanet = (planet: PlanetName) => planets.find((p) => p.planet === planet);
  const dignityOf = (planet: PlanetName) => strengths.find((s) => s.planet === planet)?.dignity;
  const moon = byPlanet("Moon");
  const mars = byPlanet("Mars");
  const sun = byPlanet("Sun");
  const mercury = byPlanet("Mercury");
  const jupiter = byPlanet("Jupiter");

  const nameAt = (lang: AstrologyLanguage, l11: L11) => l11[lang];
  const buildAll = (name: L11, build: (lang: AstrologyLanguage) => string): Record<AstrologyLanguage, string> => {
    const out = {} as Record<AstrologyLanguage, string>;
    (Object.keys(name) as AstrologyLanguage[]).forEach((lang) => {
      out[lang] = build(lang);
    });
    return out;
  };

  // ---- Panch Mahapurusha Yoga: planet exalted or in its own sign, placed in a kendra from Lagna. ----
  for (const { key, planet, name } of MAHAPURUSHA) {
    const p = byPlanet(planet);
    const dignity = dignityOf(planet);
    const house = p ? houseOf(p.rashi.index, ascendantRashiIndex) : null;
    const present = !!p && (dignity === "Exalted" || dignity === "Own sign") && house !== null && KENDRA_HOUSES.has(house);
    results.push({
      key,
      name,
      present,
      planets: [planet],
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        const planetName = lv(lang, planet);
        if (present) {
          const dignityWord = dignity === "Exalted" ? EXALTED_W[lang] : OWN_SIGN_W[lang];
          const subject = `${planetName} ${dignityWord}, ${HOUSE_WORD[lang]} ${house} (${KENDRA_TERM[lang]} ${FROM_ASCENDANT[lang]})`;
          return FORM_TEMPLATE[lang](subject, yogaName, MAHAPURUSHA_MEANING[lang]);
        }
        return ABSENT_TEMPLATE[lang](`${planetName} ${DOES_NOT_MEET[lang]}`, yogaName);
      }),
    });
  }

  // ---- Gaja Kesari Yoga: Jupiter in a kendra counted from the Moon. ----
  {
    const name: L11 = { en: "Gaja Kesari Yoga", ta: "கஜ கேசரி யோகம்", hi: "गज केसरी योग", te: "గజ కేసరి యోగం", ml: "ഗജ കേസരി യോഗം", kn: "ಗಜ ಕೇಸರಿ ಯೋಗ", bn: "গজ কেসরী যোগ", mr: "गज केसरी योग", gu: "ગજ કેસરી યોગ", pa: "ਗਜ ਕੇਸਰੀ ਯੋਗ", ur: "گج کیسری یوگ" };
    const houseFromMoon = moon && jupiter ? ((jupiter.rashi.index - moon.rashi.index + 12) % 12) + 1 : null;
    const present = houseFromMoon !== null && KENDRA_HOUSES.has(houseFromMoon);
    const meaning: L11 = {
      en: "a classical combination for intelligence, reputation, and steady prosperity", ta: "அறிவு, புகழ், நிலையான செழிப்புக்கான பாரம்பரிய அமைப்பு", hi: "बुद्धि, प्रतिष्ठा व स्थिर समृद्धि का पारंपरिक संयोजन", te: "బుద్ధి, ఖ్యాతి, స్థిర సంపదకు సాంప్రదాయ కలయిక", ml: "ബുദ്ധി, യശസ്സ്, സ്ഥിര അഭിവൃദ്ധിക്കുള്ള പരമ്പരാഗത സംയോജനം", kn: "ಬುದ್ಧಿ, ಖ್ಯಾತಿ, ಸ್ಥಿರ ಸಮೃದ್ಧಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಯೋಜನೆ", bn: "বুদ্ধি, খ্যাতি ও স্থায়ী সমৃদ্ধির ঐতিহ্যবাহী সমন্বয়", mr: "बुद्धी, कीर्ती व स्थिर समृद्धीचे पारंपरिक संयोजन", gu: "બુદ્ધિ, ખ્યાતિ અને સ્થિર સમૃદ્ધિનું પરંપરાગત સંયોજન", pa: "ਬੁੱਧੀ, ਪ੍ਰਸਿੱਧੀ ਅਤੇ ਸਥਿਰ ਖੁਸ਼ਹਾਲੀ ਦਾ ਰਵਾਇਤੀ ਸੁਮੇਲ", ur: "ذہانت، شہرت اور مستحکم خوشحالی کا روایتی امتزاج",
    };
    results.push({
      key: "gajakesari", name, present, planets: ["Jupiter", "Moon"],
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        if (present) {
          const subject = `${lv(lang, "Jupiter")} ${KENDRA_TERM[lang]} ${FROM_MOON[lang]}`;
          return FORM_TEMPLATE[lang](subject, yogaName, meaning[lang]);
        }
        const condition = `${lv(lang, "Jupiter")} (${KENDRA_TERM[lang]} ${FROM_MOON[lang]}) ${NOT_PLACED_IN[lang]}`;
        return ABSENT_TEMPLATE[lang](condition, yogaName);
      }),
    });
  }

  // ---- Two-planet conjunction yogas: Chandra-Mangal, Budha-Aditya ----
  const conjunctionYoga = (
    key: string,
    name: L11,
    planetA: PlanetName,
    planetB: PlanetName,
    meaning: L11
  ): YogaResult => {
    const a = byPlanet(planetA);
    const b = byPlanet(planetB);
    const present = !!a && !!b && a.rashi.index === b.rashi.index;
    return {
      key, name, present, planets: [planetA, planetB],
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        const namesJoined = `${lv(lang, planetA)} ${AND_W[lang]} ${lv(lang, planetB)}`;
        if (present) return FORM_TEMPLATE[lang](`${namesJoined} ${CONJOIN_W[lang]}`, yogaName, meaning[lang]);
        return ABSENT_TEMPLATE[lang](`${namesJoined} ${NOT_CONJUNCT[lang]}`, yogaName);
      }),
    };
  };
  results.push(
    conjunctionYoga(
      "chandramangal",
      { en: "Chandra-Mangal Yoga", ta: "சந்திர-செவ்வாய் யோகம்", hi: "चंद्र-मंगल योग", te: "చంద్ర-కుజ యోగం", ml: "ചന്ദ്ര-ചൊവ്വ യോഗം", kn: "ಚಂದ್ರ-ಮಂಗಳ ಯೋಗ", bn: "চন্দ্র-মঙ্গল যোগ", mr: "चंद्र-मंगळ योग", gu: "ચંદ્ર-મંગળ યોગ", pa: "ਚੰਦਰ-ਮੰਗਲ ਯੋਗ", ur: "چاند-مریخ یوگ" },
      "Moon", "Mars",
      { en: "associated with drive, business acumen, and the ability to accumulate wealth through determined effort", ta: "உந்துதல், வணிக திறமை, உறுதியான முயற்சியால் செல்வம் சேர்க்கும் திறனுடன் தொடர்புடையது", hi: "उत्साह, व्यावसायिक कुशाग्रता व दृढ़ प्रयास से धन संचय की क्षमता से जुड़ा", te: "ఉత్సాహం, వ్యాపార నైపుణ్యం, దృఢ కృషితో సంపద కూడబెట్టే సామర్థ్యంతో ముడిపడి ఉంది", ml: "ഊർജം, ബിസിനസ് സാമർഥ്യം, ദൃഢ പരിശ്രമത്തിലൂടെ സമ്പത്ത് സ്വരൂപിക്കാനുള്ള കഴിവുമായി ബന്ധപ്പെട്ടത്", kn: "ಉತ್ಸಾಹ, ವ್ಯಾಪಾರ ಕುಶಲತೆ, ದೃಢ ಪ್ರಯತ್ನದಿಂದ ಸಂಪತ್ತು ಸಂಗ್ರಹಿಸುವ ಸಾಮರ್ಥ್ಯದೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದೆ", bn: "উদ্যম, ব্যবসায়িক দক্ষতা ও দৃঢ় প্রচেষ্টায় সম্পদ আহরণের ক্ষমতার সাথে যুক্ত", mr: "उत्साह, व्यावसायिक कुशाग्रता व चिकाटीने संपत्ती जमवण्याच्या क्षमतेशी संबंधित", gu: "ઉત્સાહ, વ્યાવસાયિક કુશળતા અને મક્કમ પ્રયત્નથી સંપત્તિ ભેગી કરવાની ક્ષમતા સાથે સંકળાયેલ", pa: "ਉਤਸ਼ਾਹ, ਵਪਾਰਕ ਸੂਝ ਅਤੇ ਦ੍ਰਿੜ ਯਤਨ ਨਾਲ ਦੌਲਤ ਇਕੱਠੀ ਕਰਨ ਦੀ ਯੋਗਤਾ ਨਾਲ ਜੁੜਿਆ", ur: "جوش، کاروباری ذہانت اور ثابت قدمی سے دولت جمع کرنے کی صلاحیت سے وابستہ" }
    )
  );
  results.push(
    conjunctionYoga(
      "budhaditya",
      { en: "Budha-Aditya Yoga", ta: "புத ஆதித்திய யோகம்", hi: "बुध-आदित्य योग", te: "బుధ-ఆదిత్య యోగం", ml: "ബുധ-ആദിത്യ യോഗം", kn: "ಬುಧ-ಆದಿತ್ಯ ಯೋಗ", bn: "বুধ-আদিত্য যোগ", mr: "बुध-आदित्य योग", gu: "બુધ-આદિત્ય યોગ", pa: "ਬੁੱਧ-ਆਦਿੱਤਿਆ ਯੋਗ", ur: "بدھ-آدتیہ یوگ" },
      "Sun", "Mercury",
      { en: "sharpens intellect, analytical skill, and communication ability", ta: "அறிவுத்திறன், பகுப்பாய்வு திறமை, தொடர்பாடல் ஆற்றலை மேம்படுத்துகிறது", hi: "बुद्धि, विश्लेषण क्षमता व संप्रेषण कौशल को तीव्र करता है", te: "బుద్ధి, విశ్లేషణ నైపుణ్యం, సంభాషణ సామర్థ్యాన్ని పదును పెడుతుంది", ml: "ബുദ്ധി, വിശകലന വൈദഗ്ധ്യം, ആശയവിനിമയ ശേഷി മെച്ചപ്പെടുത്തുന്നു", kn: "ಬುದ್ಧಿ, ವಿಶ್ಲೇಷಣಾ ಕೌಶಲ್ಯ, ಸಂವಹನ ಸಾಮರ್ಥ್ಯವನ್ನು ಚುರುಕುಗೊಳಿಸುತ್ತದೆ", bn: "বুদ্ধি, বিশ্লেষণী দক্ষতা ও যোগাযোগ ক্ষমতা তীক্ষ্ণ করে", mr: "बुद्धी, विश्लेषण कौशल्य व संवाद क्षमता तीक्ष्ण करते", gu: "બુદ્ધિ, વિશ્લેષણ કૌશલ્ય અને સંચાર ક્ષમતાને તીક્ષ્ણ બનાવે છે", pa: "ਬੁੱਧੀ, ਵਿਸ਼ਲੇਸ਼ਣ ਹੁਨਰ ਅਤੇ ਸੰਚਾਰ ਯੋਗਤਾ ਨੂੰ ਤਿੱਖਾ ਕਰਦਾ ਹੈ", ur: "ذہانت، تجزیاتی مہارت اور رابطے کی صلاحیت کو تیز کرتا ہے" }
    )
  );

  // ---- Lord-conjunction yogas: Dhana (2nd+11th), Raja (kendra+trikona) ----
  {
    const name: L11 = { en: "Dhana Yoga", ta: "தன யோகம்", hi: "धन योग", te: "ధన యోగం", ml: "ധന യോഗം", kn: "ಧನ ಯೋಗ", bn: "ধন যোগ", mr: "धन योग", gu: "ધન યોગ", pa: "ਧਨ ਯੋਗ", ur: "دھن یوگ" };
    const lord2 = houseLord(2, ascendantRashiIndex, rashiOfIndex);
    const lord11 = houseLord(11, ascendantRashiIndex, rashiOfIndex);
    const p2 = byPlanet(lord2);
    const p11 = byPlanet(lord11);
    const present = !!p2 && !!p11 && lord2 !== lord11 && p2.rashi.index === p11.rashi.index;
    const meaning: L11 = { en: "a classical wealth-accumulation combination", ta: "பாரம்பரிய செல்வ சேர்க்கை அமைப்பு", hi: "धन-संचय का पारंपरिक संयोजन", te: "సాంప్రదాయ సంపద కూడబెట్టే కలయిక", ml: "സമ്പത്ത് സ്വരൂപിക്കാനുള്ള പരമ്പരാഗത സംയോജനം", kn: "ಸಂಪತ್ತು ಸಂಗ್ರಹಣೆಯ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಯೋಜನೆ", bn: "সম্পদ সঞ্চয়ের ঐতিহ্যবাহী সমন্বয়", mr: "संपत्ती जमवण्याचे पारंपरिक संयोजन", gu: "સંપત્તિ સંચયનું પરંપરાગત સંયોજન", pa: "ਦੌਲਤ ਇਕੱਠੀ ਕਰਨ ਦਾ ਰਵਾਇਤੀ ਸੁਮੇਲ", ur: "دولت جمع کرنے کا روایتی امتزاج" };
    results.push({
      key: "dhana", name, present, planets: [lord2, lord11],
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        const l2n = lv(lang, lord2), l11n = lv(lang, lord11);
        if (present) return FORM_TEMPLATE[lang](`2 ${HOUSE_WORD[lang]} (${l2n}) ${AND_W[lang]} 11 ${HOUSE_WORD[lang]} (${l11n}) ${CONJOIN_W[lang]}`, yogaName, meaning[lang]);
        return ABSENT_TEMPLATE[lang](`2/11 ${HOUSE_WORD[lang]} ${NOT_CONJUNCT[lang]}`, yogaName);
      }),
    });
  }
  {
    const name: L11 = { en: "Raja Yoga", ta: "ராஜ யோகம்", hi: "राज योग", te: "రాజ యోగం", ml: "രാജ യോഗം", kn: "ರಾಜ ಯೋಗ", bn: "রাজ যোগ", mr: "राज योग", gu: "રાજ યોગ", pa: "ਰਾਜ ਯੋਗ", ur: "راج یوگ" };
    const kendraLords = new Set([...KENDRA_HOUSES].map((h) => houseLord(h, ascendantRashiIndex, rashiOfIndex)));
    const trikonaLords = new Set([...TRIKONA_HOUSES].map((h) => houseLord(h, ascendantRashiIndex, rashiOfIndex)));
    let found: [PlanetName, PlanetName] | null = null;
    for (const k of kendraLords) {
      for (const t of trikonaLords) {
        if (k === t) continue;
        const pk = byPlanet(k);
        const pt = byPlanet(t);
        if (pk && pt && pk.rashi.index === pt.rashi.index) {
          found = [k, t];
          break;
        }
      }
      if (found) break;
    }
    const meaning: L11 = { en: "a classical combination for status, authority, and success", ta: "அந்தஸ்து, அதிகாரம், வெற்றிக்கான பாரம்பரிய அமைப்பு", hi: "प्रतिष्ठा, अधिकार व सफलता का पारंपरिक संयोजन", te: "హోదా, అధికారం, విజయానికి సాంప్రదాయ కలయిక", ml: "പദവി, അധികാരം, വിജയത്തിനുള്ള പരമ്പരാഗത സംയോജനം", kn: "ಸ್ಥಾನಮಾನ, ಅಧಿಕಾರ, ಯಶಸ್ಸಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಯೋಜನೆ", bn: "মর্যাদা, কর্তৃত্ব ও সাফল্যের ঐতিহ্যবাহী সমন্বয়", mr: "प्रतिष्ठा, अधिकार व यशाचे पारंपरिक संयोजन", gu: "પ્રતિષ્ઠા, અધિકાર અને સફળતાનું પરંપરાગત સંયોજન", pa: "ਰੁਤਬਾ, ਅਧਿਕਾਰ ਅਤੇ ਸਫਲਤਾ ਦਾ ਰਵਾਇਤੀ ਸੁਮੇਲ", ur: "مقام، اختیار اور کامیابی کا روایتی امتزاج" };
    results.push({
      key: "rajayoga", name, present: !!found, planets: found ?? [],
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        if (found) {
          return FORM_TEMPLATE[lang](`${KENDRA_TERM[lang]}-${lv(lang, found[0])} ${AND_W[lang]} ${TRIKONA_TERM[lang]}-${lv(lang, found[1])} ${CONJOIN_W[lang]}`, yogaName, meaning[lang]);
        }
        return ABSENT_TEMPLATE[lang](`${KENDRA_TERM[lang]}-${TRIKONA_TERM[lang]} ${NOT_CONJUNCT[lang]}`, yogaName);
      }),
    });
  }

  // ---- Vipreet Raja Yoga: two of the 6th/8th/12th lords conjunct in a dusthana house. ----
  {
    const name: L11 = { en: "Vipreet Raja Yoga", ta: "விபரீத ராஜ யோகம்", hi: "विपरीत राज योग", te: "విపరీత రాజ యోగం", ml: "വിപരീത രാജ യോഗം", kn: "ವಿಪರೀತ ರಾಜ ಯೋಗ", bn: "বিপরীত রাজ যোগ", mr: "विपरीत राज योग", gu: "વિપરીત રાજ યોગ", pa: "ਵਿਪਰੀਤ ਰਾਜ ਯੋਗ", ur: "وپریت راج یوگ" };
    const dusthanaLords: Record<number, PlanetName> = {
      6: houseLord(6, ascendantRashiIndex, rashiOfIndex),
      8: houseLord(8, ascendantRashiIndex, rashiOfIndex),
      12: houseLord(12, ascendantRashiIndex, rashiOfIndex),
    };
    let found: PlanetName[] = [];
    const houses = [6, 8, 12] as const;
    for (let i = 0; i < houses.length; i++) {
      for (let j = i + 1; j < houses.length; j++) {
        const a = dusthanaLords[houses[i]];
        const b = dusthanaLords[houses[j]];
        if (a === b) continue;
        const pa = byPlanet(a);
        const pb = byPlanet(b);
        if (pa && pb && pa.rashi.index === pb.rashi.index) {
          const houseOfConjunction = houseOf(pa.rashi.index, ascendantRashiIndex);
          if (DUSTHANA_HOUSES.has(houseOfConjunction)) found = [a, b];
        }
      }
    }
    const meaning: L11 = { en: "turns apparent setbacks into unexpected gains", ta: "தோற்றமளிக்கும் இடர்களை எதிர்பாராத ஆதாயங்களாக மாற்றுகிறது", hi: "प्रतीत होने वाली बाधाओं को अप्रत्याशित लाभ में बदल देता है", te: "కనిపించే అడ్డంకులను ఊహించని లాభాలుగా మారుస్తుంది", ml: "പ്രത്യക്ഷ തിരിച്ചടികളെ അപ്രതീക്ഷിത നേട്ടങ്ങളാക്കി മാറ്റുന്നു", kn: "ಕಾಣುವ ಹಿನ್ನಡೆಗಳನ್ನು ಅನಿರೀಕ್ಷಿತ ಲಾಭಗಳಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ", bn: "প্রত্যক্ষ বাধাকে অপ্রত্যাশিত লাভে পরিণত করে", mr: "दिसणाऱ्या अडथळ्यांना अनपेक्षित फायद्यात बदलतो", gu: "દેખાતા અવરોધોને અણધાર્યા ફાયદામાં ફેરવે છે", pa: "ਦਿਸਣ ਵਾਲੀਆਂ ਰੁਕਾਵਟਾਂ ਨੂੰ ਅਚਾਨਕ ਲਾਭ ਵਿੱਚ ਬਦਲਦਾ ਹੈ", ur: "ظاہری رکاوٹوں کو غیر متوقع فوائد میں بدل دیتا ہے" };
    results.push({
      key: "vipreetraja", name, present: found.length > 0, planets: found,
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        if (found.length) return FORM_TEMPLATE[lang](`${DUSTHANA_TERM[lang]}-${lv(lang, found[0])} ${AND_W[lang]} ${DUSTHANA_TERM[lang]}-${lv(lang, found[1])} ${CONJOIN_W[lang]}`, yogaName, meaning[lang]);
        return ABSENT_TEMPLATE[lang](`${DUSTHANA_TERM[lang]} (6/8/12) ${NOT_CONJUNCT[lang]}`, yogaName);
      }),
    });
  }

  // ---- Adhi Yoga: natural benefics occupy each of the 6th, 7th, and 8th houses counted from the Moon. ----
  {
    const name: L11 = { en: "Adhi Yoga", ta: "ஆதி யோகம்", hi: "अधि योग", te: "అధి యోగం", ml: "അധി യോഗം", kn: "ಅಧಿ ಯೋಗ", bn: "অধি যোগ", mr: "अधी योग", gu: "અધિ યોગ", pa: "ਅਧੀ ਯੋਗ", ur: "ادھی یوگ" };
    const housesFromMoon = moon
      ? new Map(planets.map((p) => [p.planet, ((p.rashi.index - moon.rashi.index + 12) % 12) + 1] as const))
      : new Map<PlanetName, number>();
    const check = (h: number) => [...NATURAL_BENEFICS].some((planet) => housesFromMoon.get(planet) === h);
    const present = !!moon && check(6) && check(7) && check(8);
    const meaning: L11 = { en: "a classical combination for leadership, comfort, and a long, fortunate life", ta: "தலைமைத்துவம், சுகவாழ்வு, நீண்ட அதிர்ஷ்டமான வாழ்க்கைக்கான பாரம்பரிய அமைப்பு", hi: "नेतृत्व, सुख-सुविधा व दीर्घ, सौभाग्यशाली जीवन का पारंपरिक संयोजन", te: "నాయకత్వం, సౌఖ్యం, దీర్ఘ అదృష్ట జీవితానికి సాంప్రదాయ కలయిక", ml: "നേതൃത്വം, സുഖം, ദീർഘവും ഭാഗ്യകരവുമായ ജീവിതത്തിനുള്ള പരമ്പരാഗത സംയോജനം", kn: "ನಾಯಕತ್ವ, ಸೌಕರ್ಯ, ದೀರ್ಘ ಅದೃಷ್ಟದ ಜೀವನಕ್ಕೆ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಯೋಜನೆ", bn: "নেতৃত্ব, স্বাচ্ছন্দ্য ও দীর্ঘ, সৌভাগ্যপূর্ণ জীবনের ঐতিহ্যবাহী সমন্বয়", mr: "नेतृत्व, सुखसोयी व दीर्घ, भाग्यशाली आयुष्याचे पारंपरिक संयोजन", gu: "નેતૃત્વ, આરામ અને લાંબા, સૌભાગ્યશાળી જીવનનું પરંપરાગત સંયોજન", pa: "ਲੀਡਰਸ਼ਿਪ, ਆਰਾਮ ਅਤੇ ਲੰਬੀ, ਖੁਸ਼ਕਿਸਮਤ ਜ਼ਿੰਦਗੀ ਦਾ ਰਵਾਇਤੀ ਸੁਮੇਲ", ur: "قیادت، آرام اور طویل، خوش قسمت زندگی کا روایتی امتزاج" };
    results.push({
      key: "adhi", name, present, planets: ["Moon", "Mercury", "Venus", "Jupiter"],
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        if (present) return FORM_TEMPLATE[lang](`${lv(lang, "Jupiter")}, ${lv(lang, "Venus")}, ${lv(lang, "Mercury")} — 6/7/8 ${HOUSE_WORD[lang]} ${FROM_MOON[lang]}`, yogaName, meaning[lang]);
        return ABSENT_TEMPLATE[lang](`6/7/8 ${HOUSE_WORD[lang]} ${FROM_MOON[lang]}`, yogaName);
      }),
    });
  }

  // ---- Saraswati Yoga: Jupiter, Venus, and Mercury all placed in kendras or trikonas from Lagna. ----
  {
    const name: L11 = { en: "Saraswati Yoga", ta: "சரஸ்வதி யோகம்", hi: "सरस्वती योग", te: "సరస్వతి యోగం", ml: "സരസ്വതി യോഗം", kn: "ಸರಸ್ವತಿ ಯೋಗ", bn: "সরস্বতী যোগ", mr: "सरस्वती योग", gu: "સરસ્વતી યોગ", pa: "ਸਰਸਵਤੀ ਯੋਗ", ur: "سرسوتی یوگ" };
    const kendraOrTrikona = new Set([...KENDRA_HOUSES, ...TRIKONA_HOUSES]);
    const trio: PlanetName[] = ["Jupiter", "Venus", "Mercury"];
    const houses = trio.map((pl) => {
      const p = byPlanet(pl);
      return p ? houseOf(p.rashi.index, ascendantRashiIndex) : null;
    });
    const present = houses.every((h) => h !== null && kendraOrTrikona.has(h));
    const meaning: L11 = { en: "a classical combination for learning, eloquence, and artistic or scholarly achievement", ta: "கல்வி, சொல்திறன், கலை/அறிவுசார் சாதனைகளுக்கான பாரம்பரிய அமைப்பு", hi: "शिक्षा, वाक्पटुता व कला/शैक्षणिक उपलब्धि का पारंपरिक संयोजन", te: "విద్య, వాక్చాతుర్యం, కళా/విద్యా విజయాలకు సాంప్రదాయ కలయిక", ml: "വിദ്യാഭ്യാസം, വാഗ്വൈഭവം, കലാ/പണ്ഡിത നേട്ടത്തിനുള്ള പരമ്പരാഗത സംയോജനം", kn: "ವಿದ್ಯೆ, ವಾಗ್ಮಿತೆ, ಕಲಾ/ವಿದ್ವತ್ ಸಾಧನೆಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಯೋಜನೆ", bn: "শিক্ষা, বাগ্মিতা ও শৈল্পিক/পাণ্ডিত্যপূর্ণ কৃতিত্বের ঐতিহ্যবাহী সমন্বয়", mr: "शिक्षण, वक्तृत्व व कला/शैक्षणिक यशाचे पारंपरिक संयोजन", gu: "શિક્ષણ, વાક્ચાતુર્ય અને કલા/વિદ્વતાપૂર્ણ સિદ્ધિનું પરંપરાગત સંયોજન", pa: "ਸਿੱਖਿਆ, ਬੋਲਬਾਣੀ ਅਤੇ ਕਲਾ/ਵਿਦਵਤਾ ਪ੍ਰਾਪਤੀ ਦਾ ਰਵਾਇਤੀ ਸੁਮੇਲ", ur: "تعلیم، فصاحت اور فنی/علمی کامیابی کا روایتی امتزاج" };
    results.push({
      key: "saraswati", name, present, planets: trio,
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        const trioNames = `${lv(lang, "Jupiter")}, ${lv(lang, "Venus")}, ${lv(lang, "Mercury")}`;
        if (present) return FORM_TEMPLATE[lang](`${trioNames} — ${KENDRA_TERM[lang]}/${TRIKONA_TERM[lang]} ${FROM_ASCENDANT[lang]}`, yogaName, meaning[lang]);
        return ABSENT_TEMPLATE[lang](`${trioNames} (${KENDRA_TERM[lang]}/${TRIKONA_TERM[lang]}) ${NOT_PLACED_IN[lang]}`, yogaName);
      }),
    });
  }

  // ---- Lakshmi Yoga: the 9th lord is exalted or in its own sign, and posited in a kendra or trikona. ----
  {
    const name: L11 = { en: "Lakshmi Yoga", ta: "லக்ஷ்மி யோகம்", hi: "लक्ष्मी योग", te: "లక్ష్మి యోగం", ml: "ലക്ഷ്മി യോഗം", kn: "ಲಕ್ಷ್ಮಿ ಯೋಗ", bn: "লক্ষ্মী যোগ", mr: "लक्ष्मी योग", gu: "લક્ષ્મી યોગ", pa: "ਲਕਸ਼ਮੀ ਯੋਗ", ur: "لکشمی یوگ" };
    const lord9 = houseLord(9, ascendantRashiIndex, rashiOfIndex);
    const p9 = byPlanet(lord9);
    const dignity9 = dignityOf(lord9);
    const house9 = p9 ? houseOf(p9.rashi.index, ascendantRashiIndex) : null;
    const kendraOrTrikona = new Set([...KENDRA_HOUSES, ...TRIKONA_HOUSES]);
    const present = !!p9 && (dignity9 === "Exalted" || dignity9 === "Own sign") && house9 !== null && kendraOrTrikona.has(house9);
    const meaning: L11 = { en: "a classical combination for fortune, prosperity, and grace", ta: "அதிர்ஷ்டம், செழிப்பு, அருளுக்கான பாரம்பரிய அமைப்பு", hi: "भाग्य, समृद्धि व कृपा का पारंपरिक संयोजन", te: "అదృష్టం, సంపద, కృపకు సాంప్రదాయ కలయిక", ml: "ഭാഗ്യം, അഭിവൃദ്ധി, കൃപയ്ക്കുള്ള പരമ്പരാഗത സംയോജനം", kn: "ಅದೃಷ್ಟ, ಸಮೃದ್ಧಿ, ಕೃಪೆಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಯೋಜನೆ", bn: "সৌভাগ্য, সমৃদ্ধি ও কৃপার ঐতিহ্যবাহী সমন্বয়", mr: "भाग्य, समृद्धी व कृपेचे पारंपरिक संयोजन", gu: "ભાગ્ય, સમૃદ્ધિ અને કૃપાનું પરંપરાગત સંયોજન", pa: "ਕਿਸਮਤ, ਖੁਸ਼ਹਾਲੀ ਅਤੇ ਕਿਰਪਾ ਦਾ ਰਵਾਇਤੀ ਸੁਮੇਲ", ur: "قسمت، خوشحالی اور کرم کا روایتی امتزاج" };
    results.push({
      key: "lakshmi", name, present, planets: [lord9],
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        const l9n = lv(lang, lord9);
        if (present) return FORM_TEMPLATE[lang](`9 ${HOUSE_WORD[lang]} (${l9n}) ${EXALTED_W[lang]}/${OWN_SIGN_W[lang]}, ${KENDRA_TERM[lang]}/${TRIKONA_TERM[lang]}`, yogaName, meaning[lang]);
        return ABSENT_TEMPLATE[lang](`9 ${HOUSE_WORD[lang]} (${l9n}) ${DOES_NOT_MEET[lang]}`, yogaName);
      }),
    });
  }

  // ---- Amala Yoga: only natural benefics occupy the 10th house from the Lagna. ----
  {
    const name: L11 = { en: "Amala Yoga", ta: "அமல யோகம்", hi: "अमल योग", te: "అమల యోగం", ml: "അമല യോഗം", kn: "ಅಮಲ ಯೋಗ", bn: "অমল যোগ", mr: "अमल योग", gu: "અમલ યોગ", pa: "ਅਮਲ ਯੋਗ", ur: "امل یوگ" };
    const tenthHouseOccupants = planets.filter((p) => houseOf(p.rashi.index, ascendantRashiIndex) === 10);
    const present = tenthHouseOccupants.length > 0 && tenthHouseOccupants.every((p) => NATURAL_BENEFICS.has(p.planet));
    const meaning: L11 = { en: "a classical combination for a spotless reputation and lasting good name", ta: "மாசற்ற புகழ், நீடித்த நற்பெயருக்கான பாரம்பரிய அமைப்பு", hi: "निष्कलंक प्रतिष्ठा व स्थायी सुनाम का पारंपरिक संयोजन", te: "నిష్కళంక ఖ్యాతి, శాశ్వత మంచి పేరుకు సాంప్రదాయ కలయిక", ml: "കളങ്കമില്ലാത്ത യശസ്സും ശാശ്വത നല്ല പേരും നൽകുന്ന പരമ്പരാഗത സംയോജനം", kn: "ನಿಷ್ಕಳಂಕ ಖ್ಯಾತಿ, ಶಾಶ್ವತ ಒಳ್ಳೆಯ ಹೆಸರಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಯೋಜನೆ", bn: "নিষ্কলঙ্ক সুনাম ও চিরস্থায়ী সুখ্যাতির ঐতিহ্যবাহী সমন্বয়", mr: "निष्कलंक कीर्ती व चिरस्थायी नावलौकिकाचे पारंपरिक संयोजन", gu: "નિષ્કલંક પ્રતિષ્ઠા અને ટકાઉ સારા નામનું પરંપરાગત સંયોજન", pa: "ਬੇਦਾਗ ਸ਼ੋਹਰਤ ਅਤੇ ਸਥਾਈ ਚੰਗੇ ਨਾਮ ਦਾ ਰਵਾਇਤੀ ਸੁਮੇਲ", ur: "بے داغ شہرت اور دیرپا اچھے نام کا روایتی امتزاج" };
    results.push({
      key: "amala", name, present, planets: tenthHouseOccupants.map((p) => p.planet),
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        if (present) return FORM_TEMPLATE[lang](`10 ${HOUSE_WORD[lang]}`, yogaName, meaning[lang]);
        return ABSENT_TEMPLATE[lang](`10 ${HOUSE_WORD[lang]}`, yogaName);
      }),
    });
  }

  // ---- Vesi / Vasi Yoga: a planet (other than the Moon) occupies the house right after/before the Sun. ----
  const adjacentToSunYoga = (key: string, name: L11, before: boolean, meaning: L11): YogaResult => {
    const sunHouse = sun ? houseOf(sun.rashi.index, ascendantRashiIndex) : null;
    const targetHouse = sunHouse !== null ? (before ? ((sunHouse + 10) % 12) + 1 : (sunHouse % 12) + 1) : null;
    const occupants = targetHouse !== null
      ? planets.filter((p) => p.planet !== "Sun" && p.planet !== "Moon" && houseOf(p.rashi.index, ascendantRashiIndex) === targetHouse)
      : [];
    const present = occupants.length > 0;
    return {
      key, name, present, planets: occupants.map((p) => p.planet),
      description: buildAll(name, (lang) => {
        const yogaName = nameAt(lang, name);
        if (present) {
          const namesJoined = occupants.map((p) => lv(lang, p.planet)).join(", ");
          return FORM_TEMPLATE[lang](namesJoined, yogaName, meaning[lang]);
        }
        return ABSENT_TEMPLATE[lang](lv(lang, "Moon"), yogaName);
      }),
    };
  };
  results.push(
    adjacentToSunYoga(
      "vesi", { en: "Vesi Yoga", ta: "வேசி யோகம்", hi: "वेसी योग", te: "వేసి యోగం", ml: "വേസി യോഗം", kn: "ವೇಸಿ ಯೋಗ", bn: "ভেসি যোগ", mr: "वेसी योग", gu: "વેસી યોગ", pa: "ਵੇਸੀ ਯੋਗ", ur: "ویسی یوگ" }, false,
      { en: "a classical combination for a forthright, assertive nature", ta: "நேரடியான, உறுதியான குணத்திற்கான பாரம்பரிய அமைப்பு", hi: "स्पष्टवादी, आत्मविश्वासी स्वभाव का पारंपरिक संयोजन", te: "నిష్కపట, దృఢమైన స్వభావానికి సాంప్రదాయ కలయిక", ml: "സത്യസന്ധവും ദൃഢവുമായ സ്വഭാവത്തിനുള്ള പരമ്പരാഗത സംയോജനം", kn: "ನೇರ, ದೃಢ ಸ್ವಭಾವಕ್ಕೆ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಯೋಜನೆ", bn: "স্পষ্টভাষী, দৃঢ় স্বভাবের ঐতিহ্যবাহী সমন্বয়", mr: "स्पष्टवक्ता, ठाम स्वभावाचे पारंपरिक संयोजन", gu: "સ્પષ્ટવક્તા, મક્કમ સ્વભાવનું પરંપરાગત સંયોજન", pa: "ਸਿੱਧੇ, ਦ੍ਰਿੜ ਸੁਭਾਅ ਦਾ ਰਵਾਇਤੀ ਸੁਮੇਲ", ur: "دیانتدار، پراعتماد فطرت کا روایتی امتزاج" }
    )
  );
  results.push(
    adjacentToSunYoga(
      "vasi", { en: "Vasi Yoga", ta: "வாசி யோகம்", hi: "वासी योग", te: "వాసి యోగం", ml: "വാസി യോഗം", kn: "ವಾಸಿ ಯೋಗ", bn: "বাসি যোগ", mr: "वासी योग", gu: "વાસી યોગ", pa: "ਵਾਸੀ ਯੋਗ", ur: "واسی یوگ" }, true,
      { en: "a classical combination for wisdom and a well-regarded character", ta: "ஞானம், நற்பெயருக்கான பாரம்பரிய அமைப்பு", hi: "ज्ञान व सुसम्मानित चरित्र का पारंपरिक संयोजन", te: "జ్ఞానం, గౌరవనీయ వ్యక్తిత్వానికి సాంప్రదాయ కలయిక", ml: "ജ്ഞാനവും ആദരണീയമായ സ്വഭാവത്തിനുമുള്ള പരമ്പരാഗത സംയോജനം", kn: "ಜ್ಞಾನ, ಗೌರವಾನ್ವಿತ ಸ್ವಭಾವಕ್ಕೆ ಸಾಂಪ್ರದಾಯಿಕ ಸಂಯೋಜನೆ", bn: "জ্ঞান ও সম্মানিত চরিত্রের ঐতিহ্যবাহী সমন্বয়", mr: "ज्ञान व सन्माननीय स्वभावाचे पारंपरिक संयोजन", gu: "જ્ઞાન અને આદરણીય પાત્રનું પરંપરાગત સંયોજન", pa: "ਗਿਆਨ ਅਤੇ ਸਤਿਕਾਰਯੋਗ ਚਰਿੱਤਰ ਦਾ ਰਵਾਇਤੀ ਸੁਮੇਲ", ur: "حکمت اور قابل احترام کردار کا روایتی امتزاج" }
    )
  );

  return results;
}
