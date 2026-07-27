import { DateTime } from "luxon";
import type { FullNumerologyProfile, NameAnalysis } from "@/lib/astrology/numerology";
import { NUMBER_TEXTS } from "@/lib/astrology/numerologyTexts";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { ReportMasthead, ReportSection, ReportField, ReportFooter, ReportCorners } from "./ReportPrimitives";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { AnimatedMandala } from "@/components/ui/icons/AnimatedMandala";
import { l as horoscopeL } from "./ReportViewer";
import { cn } from "@/lib/cn";

const L: Record<string, Partial<Record<AstrologyLanguage, string>>> = {
  kicker: { en: "MyLoginn Astrology · Numerology", ta: "மைலாகின் ஜோதிடம் · எண் கணிதம்", hi: "माईलॉगिन ज्योतिष · अंक ज्योतिष", te: "మైలాగిన్ జ్యోతిష్యం · సంఖ్యా శాస్త్రం", ml: "മൈലോഗിൻ ജ്യോതിഷം · സംഖ്യാശാസ്ത്രം", kn: "ಮೈಲೋಗಿನ್ ಜ್ಯೋತಿಷ್ಯ · ಸಂಖ್ಯಾಶಾಸ್ತ್ರ", bn: "মাইলগিন জ্যোতিষ · সংখ্যাতত্ত্ব", mr: "माईलॉगिन ज्योतिष · अंकशास्त्र", gu: "માઇલોગિન જ્યોતિષ · અંકશાસ્ત્ર", pa: "ਮਾਈਲੋਗਿਨ ਜੋਤਿਸ਼ · ਅੰਕ ਵਿਗਿਆਨ", ur: "مائیلاگن علم نجوم · عددیات" },
  title: { en: "Numerology Report", ta: "எண் கணித அறிக்கை", hi: "अंक ज्योतिष रिपोर्ट", te: "సంఖ్యా శాస్త్ర నివేదిక", ml: "സംഖ്യാശാസ്ത്ര റിപ്പോർട്ട്", kn: "ಸಂಖ್ಯಾಶಾಸ್ತ್ರ ವರದಿ", bn: "সংখ্যাতত্ত্ব প্রতিবেদন", mr: "अंकशास्त्र रिपोर्ट", gu: "અંકશાસ્ત્ર રિપોર્ટ", pa: "ਅੰਕ ਵਿਗਿਆਨ ਰਿਪੋਰਟ", ur: "عددیات کی رپورٹ" },
  coreTitle: { en: "Core Numbers", ta: "முக்கிய எண்கள்", hi: "मुख्य अंक", te: "ముఖ్య సంఖ్యలు", ml: "പ്രധാന സംഖ്യകൾ", kn: "ಮುಖ್ಯ ಸಂಖ್ಯೆಗಳು", bn: "মূল সংখ্যা", mr: "मुख्य अंक", gu: "મુખ્ય સંખ્યાઓ", pa: "ਮੁੱਖ ਅੰਕ", ur: "اہم نمبر" },
  psychic: { en: "Psychic (Moolank)", ta: "மன எண் (மூலாங்கம்)", hi: "मूलांक", te: "మూలాంకం", ml: "മൂലാങ്കം", kn: "ಮನ ಎಣಿಕೆ (ಮೂಲಾಂಕ)", bn: "মন সংখ্যা (মূলাঙ্ক)", mr: "मूलांक", gu: "મૂળાંક", pa: "ਮੂਲਾਂਕ", ur: "مُولانک" },
  lifePath: { en: "Life Path / Destiny", ta: "விதி எண் (பாக்கியாங்கம்)", hi: "भाग्यांक", te: "భాగ్యాంకం", ml: "ഭാഗ്യാങ്കം", kn: "ಜೀವನ ಮಾರ್ಗ / ವಿಧಿ", bn: "জীবন পথ / ভাগ্য", mr: "जीवन मार्ग / भाग्य", gu: "જીવન માર્ગ / ભાગ્ય", pa: "ਜੀਵਨ ਮਾਰਗ / ਭਾਗ", ur: "زندگی کا راستہ / تقدیر" },
  nameNumber: { en: "Name number", ta: "பெயர் எண்", hi: "नामांक", te: "నామాంకం", ml: "നാമാങ്കം", kn: "ಹೆಸರು ಸಂಖ್ಯೆ", bn: "নাম সংখ্যা", mr: "नावांक", gu: "નામાંક", pa: "ਨਾਮਾਂਕ", ur: "نام کا نمبر" },
  soul: { en: "Soul number", ta: "ஆன்மா எண்", hi: "आत्मांक", te: "ఆత్మ సంఖ్య", ml: "ആത്മ സംഖ്യ", kn: "ಆತ್ಮ ಸಂಖ್ಯೆ", bn: "আত্মা সংখ্যা", mr: "आत्मांक", gu: "આત્માંક", pa: "ਆਤਮਾਂਕ", ur: "روح کا نمبر" },
  personality: { en: "Personality number", ta: "ஆளுமை எண்", hi: "व्यक्तित्व अंक", te: "వ్యక్తిత్వ సంఖ్య", ml: "വ്യക്തിത്വ സംഖ്യ", kn: "ವ್ಯಕ್ತಿತ್ವ ಸಂಖ್ಯೆ", bn: "ব্যক্তিত্ব সংখ্যা", mr: "व्यक्तित्व अंक", gu: "વ્યક્તિત્વ સંખ્યા", pa: "ਵਿਆਕਤਿਤਵ ਅੰਕ", ur: "شخصیت کا نمبر" },
  planet: { en: "Ruling planet", ta: "ஆளும் கிரகம்", hi: "स्वामी ग्रह", te: "అధిపతి గ్రహం", ml: "അധിപ ഗ്രഹം", kn: "ಆಳುವ ಗ್ರಹ", bn: "শাসক গ্রহ", mr: "शासक ग्रह", gu: "આધિપતિ ગ્રહ", pa: "ਸਰਕਾਰੀ ਗ੍ਰਹਿ", ur: "حاکم سیارہ" },
  luckyTitle: { en: "Lucky Elements", ta: "அதிர்ஷ்ட கூறுகள்", hi: "शुभ तत्व", te: "అదృష్ట అంశాలు", ml: "ഭാഗ്യ ഘടകങ്ങൾ", kn: "ಅದೃಷ್ಟ ಅಂಶಗಳು", bn: "শুভ উপাদান", mr: "शुभ तत्व", gu: "શુભ તત્વો", pa: "ਸ਼ੁਭ ਤੱਤ", ur: "خوش قسمت عناصر" },
  luckyNumbers: { en: "Lucky numbers", ta: "அதிர்ஷ்ட எண்கள்", hi: "शुभ अंक", te: "అదృష్ట సంఖ్యలు", ml: "ഭാഗ്യ സംഖ്യകൾ", kn: "ಅದೃಷ್ಟ ಸಂಖ್ಯೆಗಳು", bn: "শুভ সংখ্যা", mr: "शुभ अंक", gu: "શુભ સંખ્યાઓ", pa: "ਸ਼ੁਭ ਅੰਕ", ur: "خوش قسمت نمبر" },
  luckyDates: { en: "Lucky dates (any month)", ta: "அதிர்ஷ்ட தேதிகள் (எந்த மாதமும்)", hi: "शुभ तिथियां (किसी भी माह)", te: "అదృష్ట తేదీలు (ఏ నెలలోనైనా)", ml: "ഭാഗ്യ തീയതികൾ (ഏത് മാസത്തിലും)", kn: "ಅದೃಷ್ಟ ದಿನಾಂಕಗಳು (ಯಾವುದೇ ತಿಂಗಳು)", bn: "শুভ তারিখ (যেকোনো মাস)", mr: "शुभ तिथी (किसीही महिने)", gu: "શુભ તારીખો (કોઈપણ મહિને)", pa: "ਸ਼ੁਭ ਤਾਰੀਖਾਂ (ਕਿਸੇ ਵੀ ਮਹੀਨੇ)", ur: "خوش قسمت تاریخیں (کسی بھی مہینے)" },
  luckyDays: { en: "Lucky days", ta: "அதிர்ஷ்ட நாட்கள்", hi: "शुभ दिन", te: "అదృష్ట రోజులు", ml: "ഭാഗ്യ ദിനങ്ങൾ", kn: "ಅದೃಷ್ಟ ದಿನಗಳು", bn: "শুভ দিন", mr: "शुभ दिवस", gu: "શુભ દિવસો", pa: "ਸ਼ੁਭ ਦਿਨ", ur: "خوش قسمت دن" },
  luckyColors: { en: "Lucky colors", ta: "அதிர்ஷ்ட நிறங்கள்", hi: "शुभ रंग", te: "అదృష్ట రంగులు", ml: "ഭാഗ്യ നിറങ്ങൾ", kn: "ಅದೃಷ್ಟ ಬಣ್ಣಗಳು", bn: "শুভ রং", mr: "शुभ रंग", gu: "શુભ રંગો", pa: "ਸ਼ੁਭ ਰੰਗ", ur: "خوش قسمت رنگ" },
  friendly: { en: "Compatible numbers", ta: "பொருந்தும் எண்கள்", hi: "अनुकूल अंक", te: "అనుకూల సంఖ్యలు", ml: "അനുകൂല സംഖ്യകൾ", kn: "ಪೋರು ಸಂಖ್ಯೆಗಳು", bn: "অনুকূল সংখ্যা", mr: "अनुकूल अंक", gu: "અનુકૂળ સંખ્યાઓ", pa: "ਅਨੁਕੂਲ ਅੰਕ", ur: "ہم آہنگ نمبر" },
  readingsTitle: { en: "Readings", ta: "பலன்கள்", hi: "फलादेश", te: "ఫలితాలు", ml: "ഫലങ്ങൾ", kn: "ಊಹನೆಗಳು", bn: "ফলাফল", mr: "फलादेश", gu: "ફળ", pa: "ਫਲ", ur: "پڑھائی" },
  essence: { en: "Essence", ta: "இயல்பு", hi: "स्वभाव", te: "స్వభావం", ml: "സ്വഭാവം", kn: "ಸ್ವಭಾವ", bn: "স্বভাব", mr: "स्वभाव", gu: "સ્વભાવ", pa: "ਸਵਭਾਵ", ur: "فطرت" },
  career: { en: "Career", ta: "தொழில்", hi: "करियर", te: "వృత్తి", ml: "കരിയർ", kn: "ವೃತ್ತಿ", bn: "ক্যারিয়ার", mr: "करियर", gu: "કેરિયર", pa: "ਕੈਰੀਅਰ", ur: "کیریئر" },
  business: { en: "Business", ta: "வணிகம்", hi: "व्यापार", te: "వ్యాపారం", ml: "ബിസിനസ്", kn: "ವ್ಯಾಪಾರ", bn: "ব্যবসা", mr: "व्यापार", gu: "વ્યાપાર", pa: "ਵਿਆਪਾਰ", ur: "کاروبار" },
  marriage: { en: "Marriage compatibility", ta: "திருமண பொருத்தம்", hi: "विवाह अनुकूलता", te: "వివాహ పొంతన", ml: "വിവാഹ പൊരുത്തം", kn: "ವಿವಾಹ ಹೊಂದಾಣಿಕೆ", bn: "বিবাহের সামঞ্জস্য", mr: "विवाह अनुकूलता", gu: "વિવાહ અનુકૂળતા", pa: "ਵਿਵਾਹ ਅਨੁਕੂਲਤਾ", ur: "شادی کی ہم آہنگی" },
  health: { en: "Health", ta: "ஆரோக்கியம்", hi: "स्वास्थ्य", te: "ఆరోగ్యం", ml: "ആരോഗ്യം", kn: "ಆರೋಗ್ಯ", bn: "স্বাস্থ্য", mr: "स्वास्थ्य", gu: "આરોગ્ય", pa: "ਸਿਹਤ", ur: "صحت" },
  generated: { en: "Generated", ta: "உருவாக்கப்பட்டது", hi: "निर्मित", te: "రూపొందించబడింది", ml: "തയ്യാറാക്കിയത്", kn: "ತಯಾರಿಸಲಾಗಿದೆ", bn: "উৎপন্ন", mr: "निर्मित", gu: "ઉત્પાદિત", pa: "ਤਿਆਰ ਕੀਤਾ ਗਿਆ", ur: "تیار کیا گیا" },
  name: { en: "Name", ta: "பெயர்", hi: "नाम", te: "పేరు", ml: "പേര്", kn: "ಹೆಸರು", bn: "নাম", mr: "नाव", gu: "નામ", pa: "ਨਾਮ", ur: "نام" },
  dob: { en: "Date of birth", ta: "பிறந்த தேதி", hi: "जन्म तिथि", te: "పుట్టిన తేదీ", ml: "ജനന തീയതി", kn: "ಜನ್ಮ ದಿನಾಂಕ", bn: "জন্ম তারিখ", mr: "जन्म तिथि", gu: "જન્મ તારીખ", pa: "ਜਨਮ ਤਾਰੀਖ", ur: "پیدائش کی تاریخ" },
  compareTitle: { en: "Name Comparison", ta: "பெயர் ஒப்பீடு", hi: "नाम तुलना", te: "పేర్ల పోలిక", ml: "പേരുകളുടെ താരതമ്യം", kn: "ಹೆಸರು ಹೋಲಿಕೆ", bn: "নাম তুলনা", mr: "नाव तुलना", gu: "નામ તુલના", pa: "ਨਾਮਾਂ ਦੀ ਤੁਲਨਾ", ur: "نام کا موازنہ" },
  compareHint: {
    en: "Chaldean totals for each name — gold rows harmonise with the birth numbers.",
    ta: "ஒவ்வொரு பெயருக்கும் கல்தேயன் மொத்தம் — தங்க வரிசைகள் பிறப்பு எண்களுடன் பொருந்துகின்றன.",
    hi: "प्रत्येक नाम का कैल्डियन योग — स्वर्ण पंक्तियाँ जन्म अंकों से मेल खाती हैं।",
    te: "ప్రతి పేరుకు కల్దీయన్ మొత్తం — బంగారు వరుసలు జనన సంఖ్యలతో సరిపోతాయి.",
    ml: "ഓരോ പേരിന്റെയും കൽദിയൻ ആകെത്തുക — സ്വർണ്ണ വരികൾ ജനന സംഖ്യകളുമായി യോജിക്കുന്നു.",
  },
  method: {
    en: "Method: Chaldean numerology — numbers derived from the birth date and the letters of the name.",
    ta: "முறை: கல்தேயன் எண் கணிதம் — பிறந்த தேதி மற்றும் பெயர் எழுத்துகளிலிருந்து கணக்கிடப்பட்டது.",
    hi: "पद्धति: कैल्डियन अंक ज्योतिष — जन्म तिथि और नाम के अक्षरों से गणना।",
    te: "పద్ధతి: కల్దీయన్ సంఖ్యా శాస్త్రం — పుట్టిన తేదీ మరియు పేరు అక్షరాల నుండి గణించబడింది.",
    ml: "രീതി: കൽദിയൻ സംഖ്യാശാസ്ത്രം — ജനന തീയതിയിൽ നിന്നും പേരിന്റെ അക്ഷരങ്ങളിൽ നിന്നും കണക്കാക്കിയത്.",
    kn: "ವಿಧಾನ: ಕಲ್ದೀಯನ್ ಸಂಖ್ಯಾಶಾಸ್ತ್ರ — ಜನ್ಮ ದಿನಾಂಕ ಮತ್ತು ಹೆಸರಿನ ಅಕ್ಷರಗಳಿಂದ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ.",
    bn: "পদ্ধতি: কাল্ডিয়ান সংখ্যাতত্ত্ব — জন্ম তারিখ এবং নামের অক্ষর থেকে গণনা করা।",
    mr: "पद्धत: कॅल्डियन अंकशास्त्र — जन्मतारीख आणि नावाच्या अक्षरांवरून काढलेले.",
    gu: "પદ્ધતિ: કૅલ્ડિયન અંકશાસ્ત્ર — જન્મ તારીખ અને નામના અક્ષરો પરથી ગણેલ.",
    pa: "ਢੰਗ: ਕੈਲਡੀਅਨ ਅੰਕ ਵਿਗਿਆਨ — ਜਨਮ ਤਾਰੀਖ ਅਤੇ ਨਾਮ ਦੇ ਅੱਖਰਾਂ ਤੋਂ ਗਿਣਿਆ ਗਿਆ।",
    ur: "طریقہ: کالڈین ہندسہ شناسی — تاریخ پیدائش اور نام کے حروف سے اخذ کردہ۔",
  },
};

const l = (key: string, lang: AstrologyLanguage) => L[key]?.[lang] ?? L[key]?.en ?? key;

const PLANET_L: Record<string, Partial<Record<AstrologyLanguage, string>>> = {
  Sun: { en: "Sun", ta: "சூரியன்", hi: "सूर्य", te: "సూర్యుడు", ml: "സൂര്യൻ", kn: "ಸೂರ್ಯ", bn: "সূর্য", mr: "सूर्य", gu: "સૂર્ય", pa: "ਸੂਰਜ", ur: "سورج" },
  Moon: { en: "Moon", ta: "சந்திரன்", hi: "चंद्र", te: "చంద్రుడు", ml: "ചന്ദ്രൻ", kn: "ಚಂದ್ರ", bn: "চন্দ্র", mr: "चंद्र", gu: "ચંદ્ર", pa: "ਚੰਦਰ", ur: "چاند" },
  Mars: { en: "Mars", ta: "செவ்வாய்", hi: "मंगल", te: "కుజుడు", ml: "ചൊവ്വ", kn: "ಮಂಗಳ", bn: "মঙ্গল", mr: "मंगल", gu: "મંગલ", pa: "ਮੰਗਲ", ur: "منگل" },
  Mercury: { en: "Mercury", ta: "புதன்", hi: "बुध", te: "బుధుడు", ml: "ബുധൻ", kn: "ಬುಧ", bn: "বুধ", mr: "बुध", gu: "બુધ", pa: "ਬੁਧ", ur: "بُدھ" },
  Jupiter: { en: "Jupiter", ta: "குரு", hi: "बृहस्पति", te: "గురువు", ml: "വ്യാഴം", kn: "ಗುರು", bn: "বৃহস্পতি", mr: "बृहस्पति", gu: "ગુરુ", pa: "ਗੁਰੂ", ur: "برہسپتی" },
  Venus: { en: "Venus", ta: "சுக்கிரன்", hi: "शुक्र", te: "శుక్రుడు", ml: "ശുക്രൻ", kn: "ಶುಕ್ರ", bn: "শুক্র", mr: "शुक्र", gu: "શુક્ર", pa: "ਸ਼ੁਕਰ", ur: "زہرہ" },
  Saturn: { en: "Saturn", ta: "சனி", hi: "शनि", te: "శని", ml: "ശനി", kn: "ಶನಿ", bn: "শনি", mr: "शनि", gu: "શનિ", pa: "ਸ਼ਨੀ", ur: "زحل" },
  Rahu: { en: "Rahu", ta: "ராகு", hi: "राहु", te: "రాహువు", ml: "രാഹു", kn: "ರಾಹು", bn: "রাহু", mr: "राहु", gu: "રાહુ", pa: "ਰਾਹੂ", ur: "راہو" },
  Ketu: { en: "Ketu", ta: "கேது", hi: "केतु", te: "కేతువు", ml: "കേതു", kn: "ಕೇತು", bn: "কেতু", mr: "केतु", gu: "કેતુ", pa: "ਕੇਤੂ", ur: "کتو" },
};

const DAY_L: Record<string, Partial<Record<AstrologyLanguage, string>>> = {
  Sunday: { en: "Sunday", ta: "ஞாயிறு", hi: "रविवार", te: "ఆదివారం", ml: "ഞായർ", kn: "ಭಾನುವಾರ", bn: "রবিবার", mr: "रविवार", gu: "રવિવાર", pa: "ਐਤਵਾਰ", ur: "اتوار" },
  Monday: { en: "Monday", ta: "திங்கள்", hi: "सोमवार", te: "సోమవారం", ml: "തിങ്കൾ", kn: "ಸೋಮವಾರ", bn: "সোমবার", mr: "सोमवार", gu: "સોમવાર", pa: "ਸੋਮਵਾਰ", ur: "پیر" },
  Tuesday: { en: "Tuesday", ta: "செவ்வாய்", hi: "मंगलवार", te: "మంగళవారం", ml: "ചൊവ്വ", kn: "ಮಂಗಳವಾರ", bn: "মঙ্গলবার", mr: "मंगलवार", gu: "મંગળવાર", pa: "ਮੰਗਲਵਾਰ", ur: "منگل" },
  Wednesday: { en: "Wednesday", ta: "புதன்", hi: "बुधवार", te: "బుధవారం", ml: "ബുധൻ", kn: "ಬುಧವಾರ", bn: "বুধবার", mr: "बुधवार", gu: "બુધવાર", pa: "ਬੁਧਵਾਰ", ur: "بدھ" },
  Thursday: { en: "Thursday", ta: "வியாழன்", hi: "गुरुवार", te: "గురువారం", ml: "വ്യാഴം", kn: "ಗುರುವಾರ", bn: "বৃহস্পতিবার", mr: "गुरुवार", gu: "ગુરુવાર", pa: "ਗੁਰੂਵਾਰ", ur: "جمعرات" },
  Friday: { en: "Friday", ta: "வெள்ளி", hi: "शुक्रवार", te: "శుక్రవారం", ml: "വെള്ളി", kn: "ಶುಕ್ರವಾರ", bn: "শুক্রবার", mr: "शुक्रवार", gu: "શુક્રવાર", pa: "ਸ਼ੁਕਰਵਾਰ", ur: "جمعہ" },
  Saturday: { en: "Saturday", ta: "சனி", hi: "शनिवार", te: "శనివారం", ml: "ശനി", kn: "ಶನಿವಾರ", bn: "শনিবার", mr: "शनिवार", gu: "શનિવાર", pa: "ਸ਼ਨੀਵਾਰ", ur: "ہفتہ" },
};

/** LUCKY_COLORS strings localized by root number, so non-English reports never show English color names. */
const COLOR_L: Record<number, Partial<Record<AstrologyLanguage, string>>> = {
  1: { en: "Gold / Orange", ta: "தங்கம் / ஆரஞ்சு", hi: "स्वर्ण / नारंगी", te: "బంగారు / నారింజ", ml: "സ്വർണം / ഓറഞ്ച്", kn: "ಚಿನ್ನ / ಕಿತ್ತಳೆ", bn: "সোনা / কমলা", mr: "सोना / नारंगी", gu: "સોનુ / નારંગી", pa: "ਸੋਨਾ / ਸੰਤਰਾ", ur: "سونا / نارنجی" },
  2: { en: "White / Cream", ta: "வெள்ளை / கிரீம்", hi: "श्वेत / क्रीम", te: "తెలుపు / క్రీమ్", ml: "വെള്ള / ക്രീം", kn: "ಬಿಳಿ / ಕ್ರೀಮ್", bn: "সাদা / ক্রিম", mr: "पांढरा / क्रीम", gu: "સફેદ / ક્રીમ", pa: "ਸਫੈਦ / ਕ੍ਰੀਮ", ur: "سفید / کریم" },
  3: { en: "Yellow / Purple", ta: "மஞ்சள் / ஊதா", hi: "पीला / बैंगनी", te: "పసుపు / ఊదా", ml: "മഞ്ഞ / പർപ്പിൾ", kn: "ಮಂಜಳ / ಬೂದು", bn: "হলুদ / বেগুনি", mr: "पिवळा / जांभळा", gu: "પીળા / જાંબળી", pa: "ਪੀਲਾ / ਬੈਗਨੀ", ur: "پیلا / بنفشی" },
  4: { en: "Grey / Electric blue", ta: "சாம்பல் / மின் நீலம்", hi: "धूसर / चमकीला नीला", te: "బూడిద / మెరుపు నీలం", ml: "ചാരനിറം / തിളക്ക നീല", kn: "ಕಪ್ಪು / ವಿದ್ಯುತ್ ನೀಲಿ", bn: "ধূসর / ইলেকট্রিক নীল", mr: "ग्रे / इलेक्ट्रिक निळा", gu: "ધૂસર / ઇલેક્ટ્રિક નિલો", pa: "ਧੂਸਰ / ਇਲੈਕਟ੍ਰਿਕ ਨੀਲਾ", ur: "سرمئی / الیکٹرک نیلا" },
  5: { en: "Emerald green", ta: "மரகத பச்சை", hi: "पन्ना हरा", te: "మరకత ఆకుపచ్చ", ml: "മരതക പച്ച", kn: "ಪಚ್ಚೆ ಹಸಿರು", bn: "পান্না সবুজ", mr: "पाचूचा हिरवा", gu: "લીલો પન્ના", pa: "ਪੰਨਾ ਹਰਾ", ur: "زمردی سبز" },
  6: { en: "Blue / Pink", ta: "நீலம் / இளஞ்சிவப்பு", hi: "नीला / गुलाबी", te: "నీలం / గులాబీ", ml: "നീല / പിങ്ക്", kn: "ನೀಲಿ / ಗುಲಾಬಿ", bn: "নীল / গোলাপী", mr: "निळा / गुलाबी", gu: "નીલો / ગુલાબી", pa: "ਨੀਲਾ / ਗੁਲਾਬੀ", ur: "نیلا / گلابی" },
  7: { en: "Sea green / White", ta: "கடல் பச்சை / வெள்ளை", hi: "समुद्री हरा / श्वेत", te: "సముద్రపు ఆకుపచ్చ / తెలుపు", ml: "കടൽപ്പച്ച / വെള്ള", kn: "ಸಮುದ್ರ ಹಸಿರು / ಬಿಳಿ", bn: "সমুদ্র সবুজ / সাদা", mr: "समुद्री हिरवा / पांढरा", gu: "સમુદ્રી લીલો / સફેદ", pa: "ਸਮੁੰਦਰੀ ਹਰਾ / ਚਿੱਟਾ", ur: "سمندری سبز / سفید" },
  8: { en: "Dark blue / Black", ta: "அடர் நீலம் / கருப்பு", hi: "गहरा नीला / काला", te: "ముదురు నీలం / నలుపు", ml: "കടും നീല / കറുപ്പ്", kn: "ಗಾಢ ನೀಲಿ / ಕಪ್ಪು", bn: "গাঢ় নীল / কালো", mr: "गडद निळा / काळा", gu: "ઘાટો ભૂરો / કાળો", pa: "ਗੂੜ੍ਹਾ ਨੀਲਾ / ਕਾਲਾ", ur: "گہرا نیلا / کالا" },
  9: { en: "Red / Crimson", ta: "சிவப்பு / செம்மை", hi: "लाल / रक्तिम", te: "ఎరుపు / రక్తవర్ణం", ml: "ചുവപ്പ് / രക്തവർണം", kn: "ಕೆಂಪು / ರಕ್ತವರ್ಣ", bn: "লাল / রক্তিম", mr: "लाल / रक्तिम", gu: "લાલ / રક્તિમ", pa: "ਲਾਲ / ਰਕਤਿਮ", ur: "سرخ / سرخی" },
};

function CoreNumber({ label, value, planet, lang }: { label: string; value: number; planet?: string; lang: AstrologyLanguage }) {
  return (
    <div className="jd-card p-4 text-center">
      <p className="jd-label">{label}</p>
      <p className="mt-1 text-3xl font-bold text-[var(--jd-royal-deep)]">{value}</p>
      {planet && (
        <p className="jd-label mt-1">
          {l("planet", lang)}: <span className="font-semibold text-[var(--jd-ink)]">{PLANET_L[planet]?.[lang] ?? planet}</span>
        </p>
      )}
    </div>
  );
}

export function NumerologyReportDoc({
  fullName,
  birthDate,
  profile,
  language,
  compare = [],
  reportStyle = "PROFESSIONAL",
  printMode = false,
}: {
  fullName: string;
  birthDate: string; // yyyy-MM-dd
  profile: FullNumerologyProfile;
  language: AstrologyLanguage;
  compare?: NameAnalysis[];
  reportStyle?: ReportStyleValue;
  printMode?: boolean;
}) {
  const lang = language;
  const dob = DateTime.fromISO(birthDate);

  const readings = [
    { key: "essence", number: profile.psychicNumber, text: NUMBER_TEXTS[profile.psychicNumber]?.essence[lang] ?? NUMBER_TEXTS[profile.psychicNumber]?.essence.en },
    { key: "career", number: profile.destinyNumber, text: NUMBER_TEXTS[profile.destinyNumber]?.career[lang] ?? NUMBER_TEXTS[profile.destinyNumber]?.career.en },
    { key: "business", number: profile.nameNumber, text: NUMBER_TEXTS[profile.nameNumber]?.business[lang] ?? NUMBER_TEXTS[profile.nameNumber]?.business.en },
    { key: "marriage", number: profile.destinyNumber, text: NUMBER_TEXTS[profile.destinyNumber]?.marriage[lang] ?? NUMBER_TEXTS[profile.destinyNumber]?.marriage.en },
    { key: "health", number: profile.psychicNumber, text: NUMBER_TEXTS[profile.psychicNumber]?.health[lang] ?? NUMBER_TEXTS[profile.psychicNumber]?.health.en },
  ].filter((r) => r.text);

  const luckyColors = [...new Set([profile.psychicNumber, profile.destinyNumber])]
    .map((n) => COLOR_L[n]?.[lang] ?? COLOR_L[n]?.en)
    .filter(Boolean);

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
        icon={AnimatedMandala}
        kicker={l("kicker", lang)}
        title={`${l("title", lang)} — ${fullName}`}
        stampLabel={horoscopeL("confidential", lang)}
        meta={
          <p>
            {l("generated", lang)} · {DateTime.now().toFormat("dd MMM yyyy")}
          </p>
        }
        chips={
          <>
            <span className="jd-chip jd-chip-neutral">{l("name", lang)}: {fullName}</span>
            <span className="jd-chip jd-chip-neutral">{l("dob", lang)}: {dob.toFormat("dd MMM yyyy")}</span>
            <span className="jd-chip jd-chip-gold">{profile.psychicNumber} · {profile.destinyNumber} · {profile.nameNumber}</span>
          </>
        }
      />

      <ReportSection title={l("coreTitle", lang)} sectionKey="coreTitle" style={reportStyle} lang={lang}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <CoreNumber label={l("psychic", lang)} value={profile.psychicNumber} planet={profile.rulingPlanets.psychic} lang={lang} />
          <CoreNumber label={l("lifePath", lang)} value={profile.lifePathNumber} planet={profile.rulingPlanets.destiny} lang={lang} />
          <CoreNumber label={l("nameNumber", lang)} value={profile.nameNumber} lang={lang} />
          <CoreNumber label={l("soul", lang)} value={profile.soulNumber} lang={lang} />
          <CoreNumber label={l("personality", lang)} value={profile.personalityNumber} lang={lang} />
        </div>
      </ReportSection>

      <ReportSection title={l("luckyTitle", lang)} sectionKey="luckyTitle" style={reportStyle} lang={lang}>
        <div className="jd-card jd-soft grid grid-cols-1 gap-x-4 gap-y-2.5 p-4 sm:grid-cols-2">
          <ReportField style={reportStyle} lang={lang} label={l("luckyNumbers", lang)} value={profile.luckyNumbers.join(", ")} />
          <ReportField style={reportStyle} lang={lang} label={l("friendly", lang)} value={profile.friendlyNumbers.join(", ")} />
          <ReportField style={reportStyle} lang={lang} label={l("luckyDates", lang)} value={profile.luckyDates.join(", ")} />
          <ReportField style={reportStyle} lang={lang} label={l("luckyDays", lang)} value={profile.luckyDays.map((d) => DAY_L[d]?.[lang] ?? d).join(", ")} />
          <ReportField style={reportStyle} lang={lang} label={l("luckyColors", lang)} value={luckyColors.join(" · ")} className="sm:col-span-2" />
        </div>
      </ReportSection>

      <ReportSection title={l("readingsTitle", lang)} sectionKey="readingsTitle" style={reportStyle} lang={lang}>
        <div className="flex flex-col gap-2.5">
          {readings.map((r) => (
            <div key={r.key} className="jd-card p-4">
              <p className="jd-label">
                {l(r.key, lang)} <span className="jd-chip jd-chip-gold ml-1">{r.number}</span>
              </p>
              <p className="jd-value mt-1.5 whitespace-normal text-[13px] leading-6">{r.text}</p>
            </div>
          ))}
        </div>
      </ReportSection>

      {compare.length > 0 && (
        <ReportSection title={l("compareTitle", lang)} sectionKey="compareTitle" style={reportStyle} lang={lang}>
          <div className="jd-card overflow-x-auto p-2">
            <table className="jd-table">
              <thead>
                <tr>
                  <th>{l("name", lang)}</th>
                  <th>{l("nameNumber", lang)}</th>
                  <th>{l("soul", lang)}</th>
                  <th>{l("personality", lang)}</th>
                  <th className="text-right">{l("luckyTitle", lang)}</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((n) => (
                  <tr key={n.name}>
                    <td className="font-semibold">{n.name}</td>
                    <td>
                      {n.chaldeanTotal} → {n.nameNumber}
                    </td>
                    <td>{n.soulNumber}</td>
                    <td>{n.personalityNumber}</td>
                    <td className="text-right">
                      <span className={cn("jd-chip", n.isLucky ? "jd-chip-gold" : "jd-chip-neutral")}>
                        {n.isLucky ? <AnimatedStar className="h-3 w-3" /> : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-[9.5px] leading-4 text-[var(--jd-ink-soft)]">{l("compareHint", lang)}</p>
        </ReportSection>
      )}

      <ReportFooter disclaimer={l("method", lang)} />
    </article>
  );
}
