import type { PlanetName } from "./constants";
import type { SiderealPlanet } from "./chart";
import type { AstrologyLanguage } from "./i18n";
import { lv } from "./reportL10n";

/**
 * Dignity-based graha strength: classical exaltation/debilitation/own-sign/friendship
 * tables plus combustion, retrogression, and sign-based aspects, combined into a
 * transparent 0-100 score. This is a dignity summary, not a full six-fold Shadbala.
 */

const EXALTATION: Partial<Record<PlanetName, number>> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
const OWN_SIGNS: Partial<Record<PlanetName, number[]>> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};

// Naisargika (natural) friendships — same table the Guna Milan module uses.
const FRIENDS: Record<PlanetName, PlanetName[]> = {
  Sun: ["Moon", "Mars", "Jupiter"], Moon: ["Sun", "Mercury"], Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"], Jupiter: ["Sun", "Moon", "Mars"], Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"], Rahu: ["Venus", "Saturn"], Ketu: ["Mars", "Jupiter"],
};
const ENEMIES: Record<PlanetName, PlanetName[]> = {
  Sun: ["Venus", "Saturn"], Moon: [], Mars: ["Mercury"], Mercury: ["Moon"], Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"], Saturn: ["Sun", "Moon", "Mars"], Rahu: ["Sun", "Moon"], Ketu: ["Sun", "Moon"],
};

// Combustion thresholds: max angular distance from the Sun (degrees).
const COMBUSTION_LIMIT: Partial<Record<PlanetName, number>> = { Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15 };

// Sign-based special aspects (houses counted from the planet, 7th is universal).
const SPECIAL_ASPECTS: Partial<Record<PlanetName, number[]>> = { Mars: [4, 8], Jupiter: [5, 9], Saturn: [3, 10] };
const NATURAL_BENEFICS = new Set<PlanetName>(["Jupiter", "Venus", "Mercury", "Moon"]);

export type Dignity = "Exalted" | "Debilitated" | "Own sign" | "Friendly sign" | "Enemy sign" | "Neutral sign";

export type PlanetStrength = {
  planet: PlanetName;
  dignity: Dignity;
  isRetrograde: boolean;
  isCombust: boolean;
  aspectedBy: PlanetName[];
  score: number; // 0-100
  rank: number; // 1 = strongest
};

function angularDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function dignityOf(planet: PlanetName, rashiIndex: number, rashiLord: PlanetName): Dignity {
  if (EXALTATION[planet] === rashiIndex) return "Exalted";
  if (EXALTATION[planet] !== undefined && (EXALTATION[planet]! + 6) % 12 === rashiIndex) return "Debilitated";
  if (OWN_SIGNS[planet]?.includes(rashiIndex)) return "Own sign";
  if (FRIENDS[planet].includes(rashiLord)) return "Friendly sign";
  if (ENEMIES[planet].includes(rashiLord)) return "Enemy sign";
  return "Neutral sign";
}

const DIGNITY_SCORE: Record<Dignity, number> = {
  Exalted: 35, "Own sign": 25, "Friendly sign": 12, "Neutral sign": 0, "Enemy sign": -15, Debilitated: -30,
};

const DIGNITY_TEXT: Record<Dignity, Record<AstrologyLanguage, string>> = {
  Exalted: {
    en: "is exalted", ta: "உச்சம் பெற்றுள்ளது", hi: "उच्च राशि में है", te: "ఉచ్ఛస్థితిలో ఉంది", ml: "ഉച്ചത്തിലാണ്", kn: "ಉಚ್ಚ ಸ್ಥಿತಿಯಲ್ಲಿದೆ", bn: "উচ্চস্থ", mr: "उच्च राशीत आहे", gu: "ઉચ્ચ સ્થિતિમાં છે", pa: "ਉੱਚ ਅਵਸਥਾ ਵਿੱਚ ਹੈ", ur: "اوچ درجے میں ہے",
  },
  Debilitated: {
    en: "is debilitated", ta: "நீச நிலையில் உள்ளது", hi: "नीच राशि में है", te: "నీచస్థితిలో ఉంది", ml: "നീചത്തിലാണ്", kn: "ನೀಚ ಸ್ಥಿತಿಯಲ್ಲಿದೆ", bn: "নীচস্থ", mr: "नीच राशीत आहे", gu: "નીચ સ્થિતિમાં છે", pa: "ਨੀਚ ਅਵਸਥਾ ਵਿੱਚ ਹੈ", ur: "پست درجے میں ہے",
  },
  "Own sign": {
    en: "occupies its own sign", ta: "சொந்த வீட்டில் உள்ளது", hi: "स्वराशि में है", te: "స్వక్షేత్రంలో ఉంది", ml: "സ്വക്ഷേത്രത്തിലാണ്", kn: "ಸ್ವಕ್ಷೇತ್ರದಲ್ಲಿದೆ", bn: "স্বরাশিতে আছে", mr: "स्वराशीत आहे", gu: "સ્વરાશિમાં છે", pa: "ਆਪਣੀ ਰਾਸ਼ੀ ਵਿੱਚ ਹੈ", ur: "اپنی راشی میں ہے",
  },
  "Friendly sign": {
    en: "sits in a friendly sign", ta: "நட்பு வீட்டில் உள்ளது", hi: "मित्र राशि में है", te: "మిత్ర క్షేత్రంలో ఉంది", ml: "മിത്ര ക്ഷേത്രത്തിലാണ്", kn: "ಮಿತ್ರ ಕ್ಷೇತ್ರದಲ್ಲಿದೆ", bn: "মিত্র রাশিতে আছে", mr: "मित्र राशीत आहे", gu: "મિત્ર રાશિમાં છે", pa: "ਮਿੱਤਰ ਰਾਸ਼ੀ ਵਿੱਚ ਹੈ", ur: "دوست راشی میں ہے",
  },
  "Enemy sign": {
    en: "sits in an enemy sign", ta: "பகை வீட்டில் உள்ளது", hi: "शत्रु राशि में है", te: "శత్రు క్షేత్రంలో ఉంది", ml: "ശത്രു ക്ഷേത്രത്തിലാണ്", kn: "ಶತ್ರು ಕ್ಷೇತ್ರದಲ್ಲಿದೆ", bn: "শত্রু রাশিতে আছে", mr: "शत्रू राशीत आहे", gu: "શત્રુ રાશિમાં છે", pa: "ਦੁਸ਼ਮਣ ਰਾਸ਼ੀ ਵਿੱਚ ਹੈ", ur: "دشمن راشی میں ہے",
  },
  "Neutral sign": {
    en: "sits in a neutral sign", ta: "சம வீட்டில் உள்ளது", hi: "सम राशि में है", te: "సమ క్షేత్రంలో ఉంది", ml: "സമ ക്ഷേത്രത്തിലാണ്", kn: "ಸಮ ಕ್ಷೇತ್ರದಲ್ಲಿದೆ", bn: "সম রাশিতে আছে", mr: "सम राशीत आहे", gu: "સમ રાશિમાં છે", pa: "ਸਮ ਰਾਸ਼ੀ ਵਿੱਚ ਹੈ", ur: "غیر جانبدار راشی میں ہے",
  },
};

const RETRO_NOTE: Record<AstrologyLanguage, string> = {
  en: "is also retrograde", ta: "மேலும் வக்கிரமாக இயங்குகிறது", hi: "साथ ही वक्री भी है", te: "అలాగే వక్రంగా కూడా ఉంది", ml: "വക്രഗതിയിലുമാണ്", kn: "ವಕ್ರಗತಿಯಲ್ಲಿಯೂ ಇದೆ", bn: "এবং বক্রীও বটে", mr: "तसेच वक्री देखील आहे", gu: "તેમજ વક્રી પણ છે", pa: "ਅਤੇ ਵਕਰੀ ਵੀ ਹੈ", ur: "اور رجعت میں بھی ہے",
};
const COMBUST_NOTE: Record<AstrologyLanguage, string> = {
  en: "is weakened by combustion, sitting close to the Sun",
  ta: "சூரியனுக்கு அருகில் அஸ்தமனமாகி பலவீனமடைந்துள்ளது",
  hi: "सूर्य के निकट होने से अस्त होकर कमजोर हो गया है",
  te: "సూర్యుడికి సమీపంలో ఉండి అస్తంగతమై బలహీనపడింది",
  ml: "സൂര്യനോട് അടുത്ത് നിൽക്കുന്നതിനാൽ അസ്തമയത്താൽ ദുർബലമായി",
  kn: "ಸೂರ್ಯನ ಸಮೀಪದಲ್ಲಿದ್ದು ಅಸ್ತಂಗತವಾಗಿ ದುರ್ಬಲಗೊಂಡಿದೆ",
  bn: "সূর্যের কাছাকাছি থাকায় অস্তমিত হয়ে দুর্বল হয়ে পড়েছে",
  mr: "सूर्याजवळ असल्याने अस्त होऊन कमकुवत झाला आहे",
  gu: "સૂર્યની નજીક હોવાથી અસ્ત થઈને નબળો પડ્યો છે",
  pa: "ਸੂਰਜ ਦੇ ਨੇੜੇ ਹੋਣ ਕਾਰਨ ਅਸਤ ਹੋ ਕੇ ਕਮਜ਼ੋਰ ਹੋ ਗਿਆ ਹੈ",
  ur: "سورج کے قریب ہونے کی وجہ سے کمزور ہو گیا ہے",
};
const SCORE_LABEL: Record<AstrologyLanguage, string> = {
  en: "Overall strength score", ta: "மொத்த பல மதிப்பெண்", hi: "कुल बल अंक", te: "మొత్తం బల స్కోరు", ml: "മൊത്തം ബല സ്കോർ", kn: "ಒಟ್ಟು ಬಲ ಅಂಕ", bn: "মোট বল স্কোর", mr: "एकूण बल गुण", gu: "કુલ બલ સ્કોર", pa: "ਕੁੱਲ ਬਲ ਸਕੋਰ", ur: "مجموعی طاقت اسکور",
};
const OUT_OF_100: Record<AstrologyLanguage, string> = {
  en: "out of 100", ta: "நூறில்", hi: "100 में से", te: "100కి", ml: "100ൽ", kn: "100ರಲ್ಲಿ", bn: "১০০ এর মধ্যে", mr: "100 पैकी", gu: "100માંથી", pa: "100 ਵਿੱਚੋਂ", ur: "100 میں سے",
};
const ASPECT_FROM: Record<AstrologyLanguage, (names: string) => string> = {
  en: (n) => `It receives aspect from ${n}.`,
  ta: (n) => `இதன் மீது ${n} பார்வை செலுத்துகின்றன.`,
  hi: (n) => `इस पर ${n} की दृष्टि पड़ती है।`,
  te: (n) => `దీనిపై ${n} దృష్టి ప్రసరిస్తుంది.`,
  ml: (n) => `ഇതിന് ${n} ദൃഷ്ടി ചെലുത്തുന്നു.`,
  kn: (n) => `ಇದರ ಮೇಲೆ ${n} ದೃಷ್ಟಿ ಬೀರುತ್ತದೆ.`,
  bn: (n) => `এর উপর ${n} দৃষ্টি দেয়।`,
  mr: (n) => `यावर ${n} दृष्टी टाकतात.`,
  gu: (n) => `આના પર ${n} દૃષ્ટિ કરે છે.`,
  pa: (n) => `ਇਸ ਉੱਤੇ ${n} ਦੀ ਦ੍ਰਿਸ਼ਟੀ ਪੈਂਦੀ ਹੈ।`,
  ur: (n) => `اس پر ${n} کی نظر پڑتی ہے۔`,
};
const NO_ASPECT: Record<AstrologyLanguage, string> = {
  en: "It receives no aspect from another graha.",
  ta: "இதன் மீது வேறு எந்த கிரக பார்வையும் இல்லை.",
  hi: "इस पर किसी अन्य ग्रह की दृष्टि नहीं है।",
  te: "దీనిపై ఇతర గ్రహాల దృష్టి లేదు.",
  ml: "ഇതിന് മറ്റൊരു ഗ്രഹത്തിന്റെയും ദൃഷ്ടിയില്ല.",
  kn: "ಇದರ ಮೇಲೆ ಬೇರೆ ಯಾವುದೇ ಗ್ರಹದ ದೃಷ್ಟಿ ಇಲ್ಲ.",
  bn: "এর উপর অন্য কোনো গ্রহের দৃষ্টি নেই।",
  mr: "यावर इतर कोणत्याही ग्रहाची दृष्टी नाही.",
  gu: "આના પર બીજા કોઈ ગ્રહની દૃષ્ટિ નથી.",
  pa: "ਇਸ ਉੱਤੇ ਕਿਸੇ ਹੋਰ ਗ੍ਰਹਿ ਦੀ ਦ੍ਰਿਸ਼ਟੀ ਨਹੀਂ ਹੈ।",
  ur: "اس پر کسی اور سیارے کی نظر نہیں ہے۔",
};

/** Short paragraph, in any supported language, summarizing one planet's dignity-based
 * strength profile — pure prose derived from the already-computed PlanetStrength record. */
export function planetStrengthInsight(planetLabel: string, s: PlanetStrength, lang: AstrologyLanguage): string {
  const dignityText = DIGNITY_TEXT[s.dignity][lang];
  const sep = lang === "hi" || lang === "mr" ? "। " : lang === "ta" ? "; " : ", ";
  const bits: string[] = [`${planetLabel} ${dignityText}`];
  if (s.isRetrograde) bits.push(RETRO_NOTE[lang]);
  if (s.isCombust) bits.push(COMBUST_NOTE[lang]);
  const aspectNames = s.aspectedBy.map((p) => lv(lang, p)).join(lang === "ta" ? ", " : ", ");
  const aspectNote = s.aspectedBy.length > 0 ? ASPECT_FROM[lang](aspectNames) : NO_ASPECT[lang];
  return `${bits.join(sep)}. ${SCORE_LABEL[lang]}: ${s.score} ${OUT_OF_100[lang]}. ${aspectNote}`;
}

export function computePlanetStrengths(planets: SiderealPlanet[]): PlanetStrength[] {
  const sun = planets.find((p) => p.planet === "Sun");

  const results = planets.map((p) => {
    const dignity = dignityOf(p.planet, p.rashi.index, p.rashi.lord);
    const isCombust =
      p.planet !== "Sun" &&
      COMBUSTION_LIMIT[p.planet] !== undefined &&
      sun !== undefined &&
      angularDistance(p.siderealLongitude, sun.siderealLongitude) <= COMBUSTION_LIMIT[p.planet]!;

    const aspectedBy = planets
      .filter((other) => {
        if (other.planet === p.planet) return false;
        const housesAway = ((p.rashi.index - other.rashi.index + 12) % 12) + 1;
        return housesAway === 7 || (SPECIAL_ASPECTS[other.planet]?.includes(housesAway) ?? false);
      })
      .map((other) => other.planet);

    let score = 50 + DIGNITY_SCORE[dignity];
    if (p.isRetrograde && p.planet !== "Rahu" && p.planet !== "Ketu") score += 8; // cheshta-like boost
    if (isCombust) score -= 20;
    for (const aspecting of aspectedBy) score += NATURAL_BENEFICS.has(aspecting) ? 4 : -4;
    score = Math.max(5, Math.min(100, score));

    return { planet: p.planet, dignity, isRetrograde: p.isRetrograde, isCombust, aspectedBy, score, rank: 0 };
  });

  [...results]
    .sort((a, b) => b.score - a.score)
    .forEach((r, i) => {
      r.rank = i + 1;
    });

  return results;
}
