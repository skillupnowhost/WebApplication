import { computeTropicalPlanetPositions } from "./ephemeris";
import { ayanamsaForSystem, toSidereal, type AstrologySystem } from "./ayanamsa";
import { rashiFromSidereal } from "./panchanga";
import type { PlanetName, RashiInfo } from "./constants";
import type { AstrologyLanguage } from "./i18n";

/** Gochara (transit) analysis: today's planetary positions counted as houses from the natal Moon
 * sign — the classical reference point for transit effects — plus a short classical effect note
 * per house. Computed fresh at request time (not persisted): transits are inherently "as of now". */

export type TransitPosition = {
  planet: PlanetName;
  rashi: RashiInfo;
  houseFromMoon: number; // 1-12
};

/** Classical life-area associated with each house (1-12), shared with dashaNarrative.ts so a
 * period-lord's natal house placement and a transiting planet's gochara house draw on one
 * consistent, accurate phrase bank rather than two independently-authored ones. */
export const HOUSE_LIFE_AREA: Record<number, Record<AstrologyLanguage, string>> = {
  1: {
    en: "health, self-image, and new beginnings", ta: "உடல்நலம், தன்னிலை, புதிய தொடக்கங்கள்",
    hi: "स्वास्थ्य, आत्म-छवि व नई शुरुआत", te: "ఆరోగ్యం, స్వీయ-ప్రతిబింబం, కొత్త ప్రారంభాలు", ml: "ആരോഗ്യം, സ്വയം പ്രതിച്ഛായ, പുതിയ തുടക്കങ്ങൾ", kn: "ಆರೋಗ್ಯ, ಸ್ವಯಂ-ಪ್ರತಿಮೆ, ಹೊಸ ಆರಂಭಗಳು", bn: "স্বাস্থ্য, আত্মচিত্র ও নতুন সূচনা", mr: "आरोग्य, स्वप्रतिमा व नवीन सुरुवात", gu: "આરોગ્ય, સ્વ-છબી અને નવી શરૂઆત", pa: "ਸਿਹਤ, ਸਵੈ-ਪ੍ਰਤੀਬਿੰਬ ਅਤੇ ਨਵੀਂ ਸ਼ੁਰੂਆਤ", ur: "صحت، خود تصویر اور نئی شروعات",
  },
  2: {
    en: "finances, speech, and family", ta: "பொருளாதாரம், பேச்சு, குடும்பம்",
    hi: "धन, वाणी व परिवार", te: "ఆర్థికం, మాట, కుటుంబం", ml: "ധനകാര്യം, സംസാരം, കുടുംബം", kn: "ಹಣಕಾಸು, ಮಾತು, ಕುಟುಂಬ", bn: "অর্থ, বাক্য ও পরিবার", mr: "अर्थ, वाणी व कुटुंब", gu: "નાણાં, વાણી અને પરિવાર", pa: "ਵਿੱਤ, ਬੋਲੀ ਅਤੇ ਪਰਿਵਾਰ", ur: "مالیات، گفتگو اور خاندان",
  },
  3: {
    en: "courage, effort, and siblings", ta: "துணிவு, முயற்சி, உடன்பிறப்புகள்",
    hi: "साहस, प्रयास व भाई-बहन", te: "ధైర్యం, కృషి, తోబుట్టువులు", ml: "ധൈര്യം, പരിശ്രമം, സഹോദരങ്ങൾ", kn: "ಧೈರ್ಯ, ಪ್ರಯತ್ನ, ಒಡಹುಟ್ಟಿದವರು", bn: "সাহস, প্রচেষ্টা ও ভাইবোন", mr: "धैर्य, प्रयत्न व भावंडे", gu: "હિંમત, પ્રયાસ અને ભાઈ-બહેન", pa: "ਹਿੰਮਤ, ਯਤਨ ਅਤੇ ਭੈਣ-ਭਰਾ", ur: "ہمت، کوشش اور بہن بھائی",
  },
  4: {
    en: "home, mother, and inner peace", ta: "இல்லம், தாய், மன அமைதி",
    hi: "घर, माता व मन की शांति", te: "ఇల్లు, తల్లి, మనశ్శాంతి", ml: "വീട്, അമ്മ, മനഃസമാധാനം", kn: "ಮನೆ, ತಾಯಿ, ಮನಶ್ಶಾಂತಿ", bn: "বাড়ি, মা ও মানসিক শান্তি", mr: "घर, आई व मनःशांती", gu: "ઘર, માતા અને માનસિક શાંતિ", pa: "ਘਰ, ਮਾਂ ਅਤੇ ਮਨ ਦੀ ਸ਼ਾਂਤੀ", ur: "گھر، ماں اور ذہنی سکون",
  },
  5: {
    en: "intellect, children, and romance", ta: "அறிவு, குழந்தைகள், காதல்",
    hi: "बुद्धि, संतान व प्रेम", te: "బుద్ధి, పిల్లలు, ప్రేమ", ml: "ബുദ്ധി, കുട്ടികൾ, പ്രണയം", kn: "ಬುದ್ಧಿ, ಮಕ್ಕಳು, ಪ್ರೇಮ", bn: "বুদ্ধি, সন্তান ও প্রণয়", mr: "बुद्धी, मुले व प्रेम", gu: "બુદ્ધિ, સંતાન અને પ્રેમ", pa: "ਬੁੱਧੀ, ਬੱਚੇ ਅਤੇ ਪਿਆਰ", ur: "ذہانت، اولاد اور محبت",
  },
  6: {
    en: "health challenges, debts, and competition", ta: "உடல்நல சவால்கள், கடன்கள், போட்டி",
    hi: "स्वास्थ्य चुनौतियां, ऋण व प्रतिस्पर्धा", te: "ఆరోగ్య సవాళ్ళు, అప్పులు, పోటీ", ml: "ആരോഗ്യ വെല്ലുവിളികൾ, കടങ്ങൾ, മത്സരം", kn: "ಆರೋಗ್ಯ ಸವಾಲುಗಳು, ಸಾಲಗಳು, ಸ್ಪರ್ಧೆ", bn: "স্বাস্থ্য চ্যালেঞ্জ, ঋণ ও প্রতিযোগিতা", mr: "आरोग्य आव्हाने, कर्ज व स्पर्धा", gu: "આરોગ્ય પડકારો, દેવાં અને સ્પર્ધા", pa: "ਸਿਹਤ ਚੁਣੌਤੀਆਂ, ਕਰਜ਼ੇ ਅਤੇ ਮੁਕਾਬਲਾ", ur: "صحت کے چیلنجز، قرضے اور مقابلہ",
  },
  7: {
    en: "partnerships, marriage, and public dealings", ta: "கூட்டாண்மை, திருமணம், பொது நடவடிக்கைகள்",
    hi: "साझेदारी, विवाह व सार्वजनिक व्यवहार", te: "భాగస్వామ్యాలు, వివాహం, ప్రజా వ్యవహారాలు", ml: "പങ്കാളിത്തം, വിവാഹം, പൊതു ഇടപെടലുകൾ", kn: "ಪಾಲುದಾರಿಕೆ, ವಿವಾಹ, ಸಾರ್ವಜನಿಕ ವ್ಯವಹಾರಗಳು", bn: "অংশীদারিত্ব, বিবাহ ও জনসাধারণের লেনদেন", mr: "भागीदारी, विवाह व सार्वजनिक व्यवहार", gu: "ભાગીદારી, લગ્ન અને જાહેર વ્યવહાર", pa: "ਭਾਈਵਾਲੀ, ਵਿਆਹ ਅਤੇ ਜਨਤਕ ਲੈਣ-ਦੇਣ", ur: "شراکت داری، شادی اور عوامی معاملات",
  },
  8: {
    en: "transformation, obstacles, and sudden events", ta: "மாற்றம், தடைகள், திடீர் நிகழ்வுகள்",
    hi: "रूपांतरण, बाधाएं व अचानक घटनाएं", te: "పరివర్తన, అడ్డంకులు, ఆకస్మిక సంఘటనలు", ml: "പരിവർത്തനം, തടസ്സങ്ങൾ, പെട്ടെന്നുള്ള സംഭവങ്ങൾ", kn: "ರೂಪಾಂತರ, ಅಡೆತಡೆಗಳು, ಹಠಾತ್ ಘಟನೆಗಳು", bn: "রূপান্তর, বাধা ও আকস্মিক ঘটনা", mr: "रूपांतर, अडथळे व अचानक घटना", gu: "પરિવર્તન, અવરોધો અને અચાનક ઘટનાઓ", pa: "ਤਬਦੀਲੀ, ਰੁਕਾਵਟਾਂ ਅਤੇ ਅਚਾਨਕ ਘਟਨਾਵਾਂ", ur: "تبدیلی، رکاوٹیں اور اچانک واقعات",
  },
  9: {
    en: "fortune, dharma, and long journeys", ta: "அதிர்ஷ்டம், தர்மம், நீண்ட பயணங்கள்",
    hi: "भाग्य, धर्म व लंबी यात्राएं", te: "అదృష్టం, ధర్మం, సుదూర ప్రయాణాలు", ml: "ഭാഗ്യം, ധർമം, ദീർഘ യാത്രകൾ", kn: "ಅದೃಷ್ಟ, ಧರ್ಮ, ದೀರ್ಘ ಪ್ರಯಾಣಗಳು", bn: "সৌভাগ্য, ধর্ম ও দীর্ঘ যাত্রা", mr: "भाग्य, धर्म व लांब प्रवास", gu: "ભાગ્ય, ધર્મ અને લાંબી મુસાફરી", pa: "ਕਿਸਮਤ, ਧਰਮ ਅਤੇ ਲੰਬੀਆਂ ਯਾਤਰਾਵਾਂ", ur: "قسمت، دھرم اور طویل سفر",
  },
  10: {
    en: "career, status, and public recognition", ta: "தொழில், அந்தஸ்து, பொது அங்கீகாரம்",
    hi: "करियर, प्रतिष्ठा व सार्वजनिक पहचान", te: "వృత్తి, హోదా, ప్రజా గుర్తింపు", ml: "കരിയർ, പദവി, പൊതു അംഗീകാരം", kn: "ವೃತ್ತಿ, ಸ್ಥಾನಮಾನ, ಸಾರ್ವಜನಿಕ ಗುರುತಿಸುವಿಕೆ", bn: "কর্মজীবন, মর্যাদা ও জনস্বীকৃতি", mr: "करिअर, प्रतिष्ठा व सार्वजनिक ओळख", gu: "કારકિર્દી, દરજ્જો અને જાહેર માન્યતા", pa: "ਕਰੀਅਰ, ਰੁਤਬਾ ਅਤੇ ਜਨਤਕ ਮਾਨਤਾ", ur: "کیریئر، مقام اور عوامی پہچان",
  },
  11: {
    en: "gains, income, and social circles", ta: "ஆதாயம், வருமானம், சமூக வட்டாரங்கள்",
    hi: "लाभ, आय व सामाजिक दायरे", te: "లాభాలు, ఆదాయం, సామాజిక వర్గాలు", ml: "നേട്ടങ്ങൾ, വരുമാനം, സാമൂഹിക വലയങ്ങൾ", kn: "ಲಾಭಗಳು, ಆದಾಯ, ಸಾಮಾಜಿಕ ವಲಯಗಳು", bn: "লাভ, আয় ও সামাজিক বৃত্ত", mr: "फायदे, उत्पन्न व सामाजिक वर्तुळे", gu: "ફાયદા, આવક અને સામાજિક વર્તુળો", pa: "ਲਾਭ, ਆਮਦਨ ਅਤੇ ਸਮਾਜਿਕ ਦਾਇਰੇ", ur: "فوائد، آمدنی اور سماجی حلقے",
  },
  12: {
    en: "expenses, rest, and letting go", ta: "செலவுகள், ஓய்வு, விடுதலை",
    hi: "व्यय, विश्राम व त्याग", te: "ఖర్చులు, విశ్రాంతి, వదిలేయడం", ml: "ചെലവുകൾ, വിശ്രമം, ഉപേക്ഷിക്കൽ", kn: "ಖರ್ಚುಗಳು, ವಿಶ್ರಾಂತಿ, ಬಿಟ್ಟುಕೊಡುವಿಕೆ", bn: "খরচ, বিশ্রাম ও ছেড়ে দেওয়া", mr: "खर्च, विश्रांती व सोडून देणे", gu: "ખર્ચ, આરામ અને છોડી દેવું", pa: "ਖਰਚੇ, ਆਰਾਮ ਅਤੇ ਤਿਆਗ", ur: "اخراجات، آرام اور ترک کرنا",
  },
};

export function computeCurrentTransits(natalMoonRashiIndex: number, system: AstrologySystem = "THIRUKKANITHAM"): TransitPosition[] {
  const now = new Date();
  const ayanamsaUsed = ayanamsaForSystem(system, now);
  const tropicalPlanets = computeTropicalPlanetPositions(now);

  return tropicalPlanets.map((p) => {
    const siderealLongitude = toSidereal(p.tropicalLongitude, ayanamsaUsed);
    const rashi = rashiFromSidereal(siderealLongitude);
    const houseFromMoon = ((rashi.index - natalMoonRashiIndex + 12) % 12) + 1;
    return { planet: p.planet, rashi, houseFromMoon };
  });
}

export function gocharaEffect(houseFromMoon: number): Record<AstrologyLanguage, string> {
  return HOUSE_LIFE_AREA[houseFromMoon] ?? HOUSE_LIFE_AREA[1];
}
