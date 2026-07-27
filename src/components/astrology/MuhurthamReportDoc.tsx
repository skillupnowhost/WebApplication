import { DateTime } from "luxon";
import type { MuhurthamDay, MuhurthamResult, MuhurthamReasonKey } from "@/lib/astrology/muhurtham";
import type { MuhurthamEventType } from "@/lib/astrology/constants";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import type { TimeWindow } from "@/lib/astrology/muhurta";
import type { ReportStyleValue } from "@/lib/astrology/report";
import { ReportMasthead, ReportSection, ReportField, ReportFooter, ReportCorners } from "./ReportPrimitives";
import { AnimatedCelestialWheel } from "@/components/ui/icons/AnimatedCelestialWheel";
import { l as horoscopeL } from "./ReportViewer";
import { cn } from "@/lib/cn";

const L: Record<string, Partial<Record<AstrologyLanguage, string>>> = {
  kicker: { en: "MyLoginn Astrology · Shubha Muhurtham", ta: "மைலாகின் ஜோதிடம் · சுப முகூர்த்தம்", hi: "माईलॉगिन ज्योतिष · शुभ मुहूर्त", te: "మైలాగిన్ జ్యోతిష్యం · శుభ ముహూర్తం", ml: "മൈലോഗിൻ ജ്യോതിഷം · ശുഭ മുഹൂർത്തം", kn: "ಮೈಲಾಗಿನ್ ಜ್ಯೋತಿಷ್ಯ · ಶುಭ ಮುಹೂರ್ತ", bn: "মাইলগিন জ্যোতিষ · শুভ মুহূর্ত", mr: "माईलॉगिन ज्योतिष · शुभ मुहूर्त", gu: "માઇલોગિન જ્યોતિષ · શુભ મુહૂર્ત", pa: "ਮਾਈਲੋਗਿਨ ਜੋਤਿਸ਼ · ਸ਼ੁਭ ਮੁਹੂਰਤ", ur: "مائیلاگن علم نجوم · شُبھ مُہُورَت" },
  title: { en: "Shubha Muhurtham Report", ta: "சுப முகூர்த்த அறிக்கை", hi: "शुभ मुहूर्त रिपोर्ट", te: "శుభ ముహూర్త నివేదిక", ml: "ശുഭ മുഹൂർത്ത റിപ്പോർട്ട്", kn: "ಶುಭ ಮುಹೂರ್ತ ವರದಿ", bn: "শুভ মুহূর্ত রিপোর্ট", mr: "शुभ मुहूर्त रिपोर्ट", gu: "શુભ મુહૂરત રિપોર્ટ", pa: "ਸ਼ੁਭ ਮੁਹੂਰਤ ਰਿਪੋਰਟ", ur: "شُبھ مُہُورَت رپورٹ" },
  requestTitle: { en: "Request Details", ta: "கோரிக்கை விவரங்கள்", hi: "अनुरोध विवरण", te: "అభ్యర్థన వివరాలు", ml: "അഭ്യർത്ഥന വിവരങ്ങൾ", kn: "ಕೋರಿಕೆ ವಿವರಗಳು", bn: "অনুরোধের বিবরণ", mr: "अनुरोध विवरण", gu: "વિનંતી વિગતો", pa: "ਅਨੁਰੋਧ ਵੇਰਵਾ", ur: "درخواست کی تفصیلات" },
  requestedBy: { en: "Requested by", ta: "கோரியவர்", hi: "अनुरोधकर्ता", te: "అభ్యర్థించినవారు", ml: "അഭ്യർത്ഥിച്ചത്", kn: "ಕೋರಿದವರು", bn: "অনুরোধকারী", mr: "अनुरोधकर्ता", gu: "વિનંતી કરનાર", pa: "ਅਨੁਰੋਧਕ", ur: "درخواست کرنے والا" },
  event: { en: "Event", ta: "நிகழ்வு", hi: "कार्यक्रम", te: "కార్యక్రమం", ml: "ചടങ്ങ്", kn: "ಘಟನೆ", bn: "ঘটনা", mr: "कार्यक्रम", gu: "ઘટના", pa: "ਘਟਨਾ", ur: "واقعہ" },
  range: { en: "Date range", ta: "தேதி வரம்பு", hi: "तिथि सीमा", te: "తేదీ పరిధి", ml: "തീയതി പരിധി", kn: "ತಾರೀಖು ವ್ಯಾಪ್ತಿ", bn: "তারিখের পরিসীমা", mr: "तारीख सीमा", gu: "તારીખની શ્રેણી", pa: "ਤਾਰੀਖ ਦੀ ਸੀਮਾ", ur: "تاریخ کی حد" },
  location: { en: "Location", ta: "இடம்", hi: "स्थान", te: "ప్రదేశం", ml: "സ്ഥലം", kn: "ಸ್ಥಳ", bn: "স্থান", mr: "स्थान", gu: "સ્થાન", pa: "ਸਥਾਨ", ur: "مقام" },
  bestTitle: { en: "Best Muhurtham Dates", ta: "சிறந்த முகூர்த்த நாட்கள்", hi: "सर्वोत्तम मुहूर्त तिथियां", te: "ఉత్తమ ముహూర్త తేదీలు", ml: "മികച്ച മുഹൂർത്ത തീയതികൾ", kn: "ಉತ್ತಮ ಮುಹೂರ್ತ ದಿನಗಳು", bn: "সর্বোত্তম মুহূর্তের তারিখ", mr: "सर्वोत्तम मुहूर्त तिथियां", gu: "શ્રેષ્ઠ મુહૂરત તારીખો", pa: "ਸਭ ਤੋਂ ਵਧੀਆ ਮੁਹੂਰਤ ਦੀਆਂ ਤਾਰੀਖਾਂ", ur: "بہترین مُہُورَت کی تاریخیں" },
  noBest: {
    en: "No excellent or good muhurtham days fall in this range. Consider widening the date range.",
    ta: "இந்த வரம்பில் சிறந்த முகூர்த்த நாட்கள் இல்லை. தேதி வரம்பை விரிவாக்க பரிசீலிக்கவும்.",
    hi: "इस सीमा में कोई उत्तम मुहूर्त दिन नहीं है। तिथि सीमा बढ़ाने पर विचार करें।",
    te: "ఈ పరిధిలో ఉత్తమ ముహూర్త రోజులు లేవు. తేదీ పరిధిని పెంచడాన్ని పరిశీలించండి.",
    ml: "ഈ പരിധിയിൽ മികച്ച മുഹൂർത്ത ദിനങ്ങളില്ല. തീയതി പരിധി വിപുലീകരിക്കുന്നത് പരിഗണിക്കുക.",
    kn: "ಈ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಯಾವುದೇ ಅತ್ಯುತ್ತಮ ಅಥವಾ ಒಳ್ಳೆಯ ಮುಹೂರ್ತ ದಿನಗಳಿಲ್ಲ. ದಿನಾಂಕ ವ್ಯಾಪ್ತಿಯನ್ನು ವಿಸ್ತರಿಸುವುದನ್ನು ಪರಿಗಣಿಸಿ.",
    bn: "এই সীমার মধ্যে কোনো চমৎকার বা ভালো মুহূর্তের দিন নেই। তারিখের সীমা বাড়ানোর কথা বিবেচনা করুন।",
    mr: "या मर्यादेत उत्तम किंवा चांगले मुहूर्त दिवस नाहीत. तारीख मर्यादा वाढवण्याचा विचार करा.",
    gu: "આ મર્યાદામાં કોઈ ઉત્તમ કે સારો મુહૂર્ત દિવસ નથી. તારીખની મર્યાદા વધારવાનું વિચારો.",
    pa: "ਇਸ ਸੀਮਾ ਵਿੱਚ ਕੋਈ ਵਧੀਆ ਜਾਂ ਚੰਗਾ ਮੁਹੂਰਤ ਦਿਨ ਨਹੀਂ ਹੈ। ਤਾਰੀਖ ਦੀ ਸੀਮਾ ਵਧਾਉਣ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ।",
    ur: "اس حد میں کوئی بہترین یا اچھا محورت دن نہیں ہے۔ تاریخ کی حد بڑھانے پر غور کریں۔",
  },
  allTitle: { en: "Day-by-Day Panchangam", ta: "நாள்வாரியான பஞ்சாங்கம்", hi: "दिन-प्रतिदिन पंचांग", te: "రోజువారీ పంచాంగం", ml: "ദിനംപ്രതി പഞ്ചാംഗം", kn: "ದಿನದಿಂದ ದಿನಕ್ಕೆ ಪಂಚಾಂಗ", bn: "দিন-প্রতি দিন পঞ্চাঙ্গ", mr: "दिन-प्रतिदिन पंचांग", gu: "દિવસ-દિવસ પંચાંગ", pa: "ਦਿਨ-ਬਦਿਨ ਪੰਚਾਂਗ", ur: "دن بہ دن پنچنگ" },
  score: { en: "Score", ta: "மதிப்பெண்", hi: "अंक", te: "స్కోరు", ml: "സ്കോർ", kn: "ಅಂಕ", bn: "স্কোর", mr: "अंक", gu: "સ્કોર", pa: "ਅੰਕ", ur: "نمبر" },
  goodSlots: { en: "Auspicious time slots", ta: "சுப நேரங்கள்", hi: "शुभ समय", te: "శుభ సమయాలు", ml: "ശുഭ സമയങ്ങൾ", kn: "ಶುಭ ಸಮಯಗಳು", bn: "শুভ সময়", mr: "शुभ समय", gu: "શુભ સમય", pa: "ਸ਼ੁਭ ਸਮਾਂ", ur: "نیک وقت" },
  avoid: { en: "Avoid", ta: "தவிர்க்கவும்", hi: "टालें", te: "తప్పించండి", ml: "ഒഴിവാക്കുക", kn: "ತಪ್ಪಿಸು", bn: "এড়িয়ে চলুন", mr: "टालें", gu: "ટાળો", pa: "ਟਾਲੋ", ur: "اجتناب کریں" },
  sunrise: { en: "Sunrise", ta: "சூரிய உதயம்", hi: "सूर्योदय", te: "సూర్యోదయం", ml: "സൂര്യോദയം", kn: "ಸೂರ್ಯೋದಯ", bn: "সূর্যোদয়", mr: "सूर्योदय", gu: "સૂર્યોદય", pa: "ਸੂਰਜ ਉਗਣਾ", ur: "سورج کا طلوع" },
  sunset: { en: "Sunset", ta: "சூரிய அஸ்தமனம்", hi: "सूर्यास्त", te: "సూర్యాస్తమయం", ml: "സൂര്യാസ്തമയം", kn: "ಸೂರ್ಯಾಸ್ತಮಯ", bn: "সূর্যাস্ত", mr: "सूर्यास्त", gu: "સૂર્યાસ્ત", pa: "ਸੂਰਜ ਡੁੱਬਣਾ", ur: "سورج کا غروب" },
  colDate: { en: "Date", ta: "தேதி", hi: "तिथि", te: "తేదీ", ml: "തീയതി", kn: "ತಾರೀಖು", bn: "তারিখ", mr: "तारीख", gu: "તારીખ", pa: "ਤਾਰੀਖ", ur: "تاریخ" },
  colDay: { en: "Day", ta: "கிழமை", hi: "वार", te: "వారం", ml: "ദിവസം", kn: "ದಿನ", bn: "দিন", mr: "वार", gu: "દિવસ", pa: "ਦਿਨ", ur: "دن" },
  colNakshatra: { en: "Nakshatra", ta: "நட்சத்திரம்", hi: "नक्षत्र", te: "నక్షత్రం", ml: "നക്ഷത്രം", kn: "ನಕ್ಷತ್ರ", bn: "নক্ষত্র", mr: "नक्षत्र", gu: "નક્ષત્ર", pa: "ਨਕਸ਼ਤਰ", ur: "نکشتر" },
  colTithi: { en: "Tithi", ta: "திதி", hi: "तिथि", te: "తిథి", ml: "തിഥി", kn: "ತಿಥಿ", bn: "তিথি", mr: "तिथि", gu: "તિથિ", pa: "ਤਿਥੀ", ur: "تاریخ" },
  colYoga: { en: "Yoga", ta: "யோகம்", hi: "योग", te: "యోగం", ml: "യോഗം", kn: "ಯೋಗ", bn: "যোগ", mr: "योग", gu: "યોગ", pa: "ਯੋਗ", ur: "یوگا" },
  colVerdict: { en: "Verdict", ta: "முடிவு", hi: "निर्णय", te: "తీర్పు", ml: "വിധി", kn: "ಮುಗಿಯುವುದು", bn: "ফয়সালা", mr: "निर्णय", gu: "નિર્ણય", pa: "ਫੈਸਲਾ", ur: "فیصلہ" },
  excellent: { en: "Excellent", ta: "மிகச்சிறந்தது", hi: "उत्तम", te: "అత్యుత్తమం", ml: "അത്യുത്തമം", kn: "ಅತ್ಯುತ್ತಮ", bn: "অত্যুত্তম", mr: "उत्तम", gu: "ઉત્તમ", pa: "ਉਤਮ", ur: "عالی" },
  good: { en: "Good", ta: "நல்லது", hi: "शुभ", te: "మంచిది", ml: "നല്ലത്", kn: "ಚೆನ್ನಾಗಿದೆ", bn: "ভাল", mr: "नम्र", gu: "સારા", pa: "ਚੰਗਾ", ur: "اچھا" },
  average: { en: "Average", ta: "நடுத்தரம்", hi: "मध्यम", te: "మధ్యస్థం", ml: "ഇടത്തരം", kn: "ಮಧ್ಯಮ", bn: "গড়", mr: "मध्यम", gu: "સરેરાશ", pa: "ਮੱਧਮ", ur: "اوسط" },
  avoidVerdict: { en: "Avoid", ta: "தவிர்க்கவும்", hi: "वर्जित", te: "వర్జ్యం", ml: "ഒഴിവാക്കുക", kn: "ತಪ್ಪಿಸು", bn: "এড়িয়ে চলুন", mr: "वर्जित", gu: "ટાળો", pa: "ਟਾਲੋ", ur: "اجتناب کریں" },
  generated: { en: "Generated", ta: "உருவாக்கப்பட்டது", hi: "निर्मित", te: "రూపొందించబడింది", ml: "തയ്യാറാക്കിയത്", kn: "ಉತ್ಪತ್ತಿ", bn: "উৎপন্ন", mr: "निर्मित", gu: "ઉત્પાદિત", pa: "ਉਤਪੰਨ", ur: "پیدا کیا گیا" },
  method: {
    en: "Days are scored from the sunrise panchangam: event-specific nakshatras, tithi, weekday, yoga, and karana. Time slots avoid Rahu Kalam, Yamagandam, and Gulikai.",
    ta: "சூரிய உதய பஞ்சாங்கத்தின் அடிப்படையில் நாட்கள் மதிப்பிடப்படுகின்றன: நிகழ்வு சார்ந்த நட்சத்திரங்கள், திதி, கிழமை, யோகம், கரணம். சுப நேரங்கள் ராகு காலம், எமகண்டம், குளிகை தவிர்த்து தரப்படுகின்றன.",
    hi: "दिनों का मूल्यांकन सूर्योदय पंचांग से होता है: कार्यक्रम-विशेष नक्षत्र, तिथि, वार, योग और करण। शुभ समय राहु काल, यमगंड और गुलिक से बचाकर दिए गए हैं।",
    te: "సూర్యోదయ పంచాంగం ఆధారంగా రోజులు స్కోరు చేయబడతాయి: కార్యక్రమ-నిర్దిష్ట నక్షత్రాలు, తిథి, వారం, యోగం, కరణం. శుభ సమయాలు రాహుకాలం, యమగండం, గుళికను తప్పించి ఇవ్వబడ్డాయి.",
    ml: "സൂര്യോദയ പഞ്ചാംഗത്തെ അടിസ്ഥാനമാക്കി ദിനങ്ങൾ വിലയിരുത്തുന്നു: ചടങ്ങിന് അനുയോജ്യമായ നക്ഷത്രങ്ങൾ, തിഥി, ദിവസം, യോഗം, കരണം. ശുഭ സമയങ്ങൾ രാഹുകാലം, യമകണ്ടകം, ഗുളികം ഒഴിവാക്കി നൽകിയിരിക്കുന്നു.",
    kn: "ದಿನಗಳನ್ನು ಸೂರ್ಯೋದಯ ಪಂಚಾಂಗದಿಂದ ಅಂಕಿಸಲಾಗುತ್ತದೆ: ಕಾರ್ಯಕ್ರಮ-ನಿರ್ದಿಷ್ಟ ನಕ್ಷತ್ರಗಳು, ತಿಥಿ, ವಾರ, ಯೋಗ ಮತ್ತು ಕರಣ. ಸಮಯ ಸ್ಲಾಟ್‌ಗಳು ರಾಹು ಕಾಲ, ಯಮಗಂಡ ಮತ್ತು ಗುಳಿಕೆಯನ್ನು ತಪ್ಪಿಸುತ್ತವೆ.",
    bn: "সূর্যোদয় পঞ্চাঙ্গ থেকে দিনগুলির মূল্যায়ন করা হয়: অনুষ্ঠান-নির্দিষ্ট নক্ষত্র, তিথি, বার, যোগ ও করণ। সময় স্লট রাহু কাল, যমগণ্ড ও গুলিকা এড়িয়ে চলে।",
    mr: "दिवसांचे मूल्यांकन सूर्योदय पंचांगावरून केले जाते: कार्यक्रम-विशिष्ट नक्षत्रे, तिथी, वार, योग व करण. वेळ स्लॉट राहू काळ, यमगंड व गुलिक टाळतात.",
    gu: "દિવસોનું મૂલ્યાંકન સૂર્યોદય પંચાંગ પરથી થાય છે: પ્રસંગ-વિશિષ્ટ નક્ષત્રો, તિથિ, વાર, યોગ અને કરણ. સમય સ્લોટ રાહુ કાળ, યમગંડ અને ગુલિકને ટાળે છે.",
    pa: "ਦਿਨਾਂ ਦਾ ਮੁਲਾਂਕਣ ਸੂਰਜ ਚੜ੍ਹਨ ਦੇ ਪੰਚਾਂਗ ਤੋਂ ਕੀਤਾ ਜਾਂਦਾ ਹੈ: ਸਮਾਗਮ-ਵਿਸ਼ੇਸ਼ ਨਕਸ਼ਤਰ, ਤਿਥੀ, ਵਾਰ, ਯੋਗ ਅਤੇ ਕਰਨ। ਸਮਾਂ ਸਲਾਟ ਰਾਹੂ ਕਾਲ, ਯਮਗੰਡ ਅਤੇ ਗੁਲਿਕ ਤੋਂ ਬਚਦੇ ਹਨ।",
    ur: "دنوں کا اندازہ طلوع آفتاب کے پنچانگ سے لگایا جاتا ہے: تقریب کے مخصوص نکشتر، تیتھی، ہفتہ کا دن، یوگ اور کرن۔ وقت کے سلاٹ راہو کال، یمگنڈ اور گلیکا سے بچتے ہیں۔",
  },
};

const l = (key: string, lang: AstrologyLanguage) => L[key]?.[lang] ?? L[key]?.en ?? key;

const EVENT_L: Record<MuhurthamEventType, Partial<Record<AstrologyLanguage, string>>> = {
  marriage: { en: "Marriage", ta: "திருமணம்", hi: "विवाह", te: "వివాహం", ml: "വിവാഹം", kn: "ವಿವಾಹ", bn: "বিবাহ", mr: "विवाह", gu: "વિવાહ", pa: "ਵਿਵਾਹ", ur: "شادی" },
  engagement: { en: "Engagement", ta: "நிச்சயதார்த்தம்", hi: "सगाई", te: "నిశ్చితార్థం", ml: "വിവാഹനിശ്ചയം", kn: "ನಿಶ್ಚಯತಾರ್ತ", bn: "সগাই", mr: "सगाई", gu: "નિશ્ચયતાર્થ", pa: "ਨਿਸ਼ਚਿਤਾਰਥ", ur: "منگنی" },
  griha_pravesam: { en: "Housewarming (Griha Pravesam)", ta: "கிரகப்பிரவேசம்", hi: "गृह प्रवेश", te: "గృహప్రవేశం", ml: "ഗൃഹപ്രവേശം", kn: "ಗೃಹ ಪ್ರವೇಶ", bn: "গৃহ প্রবেশ", mr: "गृह प्रवेश", gu: "ગૃહ પ્રવેશ", pa: "ਗ੍ਰਿਹ ਪ੍ਰਵੇਸ਼", ur: "گھر میں داخلہ" },
  business_opening: { en: "Business opening", ta: "தொழில் தொடக்கம்", hi: "व्यापार आरंभ", te: "వ్యాపార ప్రారంభం", ml: "ബിസിനസ് ഉദ്ഘാടനം", kn: "ವ್ಯಾಪಾರ ಆರಂಭ", bn: "ব্যবসার উদ্বোধন", mr: "व्यापार आरंभ", gu: "વ્યાપાર શરૂ", pa: "ਵਪਾਰ ਦੀ ਸ਼ੁਰੂਆਤ", ur: "کاروبار کا آغاز" },
  naming_ceremony: { en: "Naming ceremony", ta: "பெயர் சூட்டு விழா", hi: "नामकरण संस्कार", te: "నామకరణం", ml: "പേരിടൽ ചടങ്ങ്", kn: "ಹೆಸರು ಹಾಕುವ ಸಮಾರಂಭ", bn: "নামকরণ অনুষ্ঠান", mr: "नामकरण संस्कार", gu: "નામકરણ", pa: "ਨਾਮਕਰਨ ਸਮਾਰੋਹ", ur: "نام رکھنے کی تقریب" },
  education_start: { en: "Starting education (Vidyarambham)", ta: "வித்யாரம்பம்", hi: "विद्यारंभ", te: "విద్యారంభం", ml: "വിദ്യാരംഭം", kn: "ವಿದ್ಯಾರಂಬ", bn: "বিদ্যারম্ভ", mr: "विद्यारंभ", gu: "વિદ્યારંભ", pa: "ਵਿਦਿਆਰੰਭ", ur: "تعلیم کا آغاز" },
  travel: { en: "Travel", ta: "பயணம்", hi: "यात्रा", te: "ప్రయాణం", ml: "യാത്ര", kn: "ಯಾತ್ರೆ", bn: "যাত্রা", mr: "यात्रा", gu: "યાત્રા", pa: "ਯਾਤਰਾ", ur: "سفر" },
  vehicle_purchase: { en: "Vehicle purchase", ta: "வாகனம் வாங்குதல்", hi: "वाहन खरीद", te: "వాహన కొనుగోలు", ml: "വാഹനം വാങ്ങൽ", kn: "ವಾಹನ ಖರೀದಿ", bn: "যানবাহন ক্রয়", mr: "वाहन खरीद", gu: "વાહન ખરીદી", pa: "ਵਾਹਨ ਖਰੀਦਣਾ", ur: "گاڑی خریدنا" },
};

const DAY_L: Record<string, Partial<Record<AstrologyLanguage, string>>> = {
  Sunday: { en: "Sunday", ta: "ஞாயிறு", hi: "रविवार", te: "ఆదివారం", ml: "ഞായർ", kn: "ಭಾನುವಾರ", bn: "রবিবার", mr: "रविवार", gu: "રવિવાર", pa: "ਐਤਵਾਰ", ur: "اتوار" },
  Monday: { en: "Monday", ta: "திங்கள்", hi: "सोमवार", te: "సోమవారం", ml: "തിങ്കൾ", kn: "ಸೋಮವಾರ", bn: "সোমবার", mr: "सोमवार", gu: "સોમવાર", pa: "ਸੋਮਵਾਰ", ur: "پیر" },
  Tuesday: { en: "Tuesday", ta: "செவ்வாய்", hi: "मंगलवार", te: "మంగళవారం", ml: "ചൊവ്വ", kn: "ಮಂಗಳವಾರ", bn: "মঙ্গলবার", mr: "मंगलवार", gu: "મંગળવાર", pa: "ਮੰਗਲਵਾਰ", ur: "منگل" },
  Wednesday: { en: "Wednesday", ta: "புதன்", hi: "बुधवार", te: "బుధవారం", ml: "ബുധൻ", kn: "ಬುಧವಾರ", bn: "বুধবার", mr: "बुधवार", gu: "બુધવાર", pa: "ਬੁਧਵਾਰ", ur: "بدھ" },
  Thursday: { en: "Thursday", ta: "வியாழன்", hi: "गुरुवार", te: "గురువారం", ml: "വ്യാഴം", kn: "ಗುರುವಾರ", bn: "বৃহস্পতিবার", mr: "गुरुवार", gu: "ગુરુવાર", pa: "ਗੁਰੂਵਾਰ", ur: "جمعرات" },
  Friday: { en: "Friday", ta: "வெள்ளி", hi: "शुक्रवार", te: "శుక్రవారం", ml: "വെള്ളി", kn: "ಶುಕ್ರವಾರ", bn: "শুক্রবার", mr: "शुक्रवार", gu: "શુક્રવાર", pa: "ਸ਼ੁੱਕਰਵਾਰ", ur: "جمعہ" },
  Saturday: { en: "Saturday", ta: "சனி", hi: "शनिवार", te: "శనివారం", ml: "ശനി", kn: "ಶನಿವಾರ", bn: "শনিবার", mr: "शनिवार", gu: "શનિવાર", pa: "ਸ਼ਨੀਵਾਰ", ur: "ہفتہ" },
};

const REASON_L: Record<MuhurthamReasonKey, Partial<Record<AstrologyLanguage, string>>> = {
  nakshatraIdeal: { en: "Ideal nakshatra for this event", ta: "இந்நிகழ்வுக்கு சிறந்த நட்சத்திரம்", hi: "इस कार्य हेतु आदर्श नक्षत्र", te: "ఈ కార్యక్రమానికి ఆదర్శ నక్షత్రం", ml: "ഈ ചടങ്ങിന് അനുയോജ്യമായ നക്ഷത്രം", kn: "ಈ ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಉತ್ತಮ ನಕ್ಷತ್ರ", bn: "এই কাজের জন্য আদর্শ নক্ষত্র", mr: "इस कार्य हेतु आदर्श नक्षत्र", gu: "આ પ્રસંગ માટે શ્રેષ્ઠ નક્ષત્ર", pa: "ਇਸ ਸਮਾਰੋਹ ਲਈ ਆਦਰਸ਼ ਨਕਸ਼ਤਰ", ur: "اس تقریب کے لیے مثالی نکشتر" },
  nakshatraGeneral: { en: "Generally auspicious nakshatra", ta: "பொதுவாக சுபமான நட்சத்திரம்", hi: "सामान्यतः शुभ नक्षत्र", te: "సాధారణంగా శుభ నక్షత్రం", ml: "പൊതുവേ ശുഭ നക്ഷത്രം", kn: "ಸಾಮಾನ್ಯವಾಗಿ ಶುಭ ನಕ್ಷತ್ರ", bn: "সাধারণত শুভ নক্ষত্র", mr: "सामान्यतः शुभ नक्षत्र", gu: "સામાન્ય રીતે શુભ નક્ષત્ર", pa: "ਆਮ ਤੌਰ 'ਤੇ ਸ਼ੁਭ ਨਕਸ਼ਤਰ", ur: "عام طور پر مبارک نکشتر" },
  nakshatraUnfavourable: { en: "Nakshatra not favourable", ta: "நட்சத்திரம் சாதகமல்ல", hi: "नक्षत्र अनुकूल नहीं", te: "నక్షత్రం అనుకూలం కాదు", ml: "നക്ഷത്രം അനുകൂലമല്ല", kn: "ನಕ್ಷತ್ರವು ಅನುಕೂಲಕರವಲ್ಲ", bn: "নক্ষত্র অনুকূল নয়", mr: "नक्षत्र अनुकूल नहीं", gu: "નક્ષત્ર અનુકૂળ નથી", pa: "ਨਕਸ਼ਤਰ ਅਨੁਕੂਲ ਨਹੀਂ", ur: "نکشتر موافق نہیں" },
  tithiGood: { en: "Auspicious tithi", ta: "சுபமான திதி", hi: "शुभ तिथि", te: "శుభ తిథి", ml: "ശുഭ തിഥി", kn: "ಶುಭ ತಿಥಿ", bn: "শুভ তিথি", mr: "शुभ तिथि", gu: "શુભ તિથિ", pa: "ਸ਼ੁਭ ਤਿਥੀ", ur: "مبارک تاریخ" },
  tithiRikta: { en: "Rikta tithi — avoided", ta: "ரிக்த திதி — தவிர்க்கப்படுகிறது", hi: "रिक्ता तिथि — वर्जित", te: "రిక్త తిథి — వర్జ్యం", ml: "രിക്ത തിഥി — ഒഴിവാക്കി", kn: "ರಿಕ್ತ ತಿಥಿ - ತಪ್ಪಿಸಬೇಕು", bn: "রিক্তা তিথি - পরিহার করতে হবে", mr: "रिक्ता तिथि — वर्जित", gu: "રિક્ત તિથિ - ટાળવું", pa: "ਰਿਕਤਾ ਤਿਥੀ - ਟਾਲਣਾ", ur: "ریکٹا تاریخ - سے بچنا" },
  tithiAmavasya: { en: "Amavasya — avoided", ta: "அமாவாசை — தவிர்க்கப்படுகிறது", hi: "अमावस्या — वर्जित", te: "అమావాస్య — వర్జ్యం", ml: "അമാവാസി — ഒഴിവാക്കി", kn: "ಅಮಾವಾಸ್ಯ - ತಪ್ಪಿಸಬೇಕು", bn: "অমাবস্যা - পরিহার করতে হবে", mr: "अमावस्या — वर्जित", gu: "અમાવાસ્ય - ટાળવું", pa: "ਅਮਾਵਸਿਆ - ਟਾਲਣਾ", ur: "اماؤسیا - سے بچنا" },
  weekdayGood: { en: "Favourable weekday", ta: "சாதகமான கிழமை", hi: "अनुकूल वार", te: "అనుకూల వారం", ml: "അനുകൂല ദിവസം", kn: "ಅನುಕೂಲಕರ ವಾರದ ದಿನ", bn: "অনুকূল সপ্তাহের দিন", mr: "अनुकूल वार", gu: "અનુકૂળ દિવસ", pa: "ਅਨੁਕੂਲ ਦਿਨ", ur: "موافق ہفتے کا دن" },
  weekdayBad: { en: "Weekday not favourable", ta: "கிழமை சாதகமல்ல", hi: "वार अनुकूल नहीं", te: "వారం అనుకూలం కాదు", ml: "ദിവസം അനുകൂലമല്ല", kn: "ವಾರದ ದಿನ ಅನುಕೂಲಕರವಲ್ಲ", bn: "সপ্তাহের দিন অনুকূল নয়", mr: "वार अनुकूल नहीं", gu: "વાર અનુકૂળ નથી", pa: "ਵਾਰ ਅਨੁਕੂਲ ਨਹੀਂ", ur: "ہفتے کا دن موافق نہیں" },
  yogaBad: { en: "Inauspicious yoga", ta: "அசுப யோகம்", hi: "अशुभ योग", te: "అశుభ యోగం", ml: "അശുഭ യോഗം", kn: "ಅಶುಭ ಯೋಗ", bn: "অশুভ যোগ", mr: "अशुभ योग", gu: "અશુભ યોગ", pa: "ਅਸ਼ੁਭ ਯੋਗ", ur: "بدقسمت یوگا" },
  karanaVishti: { en: "Vishti (Bhadra) karana", ta: "விஷ்டி (பத்ரை) கரணம்", hi: "विष्टि (भद्रा) करण", te: "విష్టి (భద్ర) కరణం", ml: "വിഷ്ടി (ഭദ്ര) കരണം", kn: "ವಿಷ್ಟಿ (ಭದ್ರ) ಕರಣ", bn: "বিশ্টি (ভদ্র) করণ", mr: "विष्टि (भद्रा) करण", gu: "વિષ્ટિ (ભદ્ર) કરણ", pa: "ਵਿਸ਼ਟੀ (ਭਦ੍ਰ) ਕਰਣ", ur: "ویشتی (بھدرا) کرن" },
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
  if (lang === "kn") return day.nakshatra.kannada;
  if (lang === "bn") return day.nakshatra.bengali;
  if (lang === "mr") return day.nakshatra.marathi;
  if (lang === "gu") return day.nakshatra.gujarati;
  if (lang === "pa") return day.nakshatra.punjabi;
  if (lang === "ur") return day.nakshatra.urdu;
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
  reportStyle = "PROFESSIONAL",
  printMode = false,
}: {
  name: string;
  event: MuhurthamEventType;
  fromDate: string;
  toDate: string;
  place: string;
  result: MuhurthamResult;
  language: AstrologyLanguage;
  reportStyle?: ReportStyleValue;
  printMode?: boolean;
}) {
  const lang = language;

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
        icon={AnimatedCelestialWheel}
        kicker={l("kicker", lang)}
        title={`${l("title", lang)} — ${EVENT_L[event][lang] ?? EVENT_L[event].en}`}
        stampLabel={horoscopeL("confidential", lang)}
        meta={
          <p>
            {l("generated", lang)} · {DateTime.now().toFormat("dd MMM yyyy")}
          </p>
        }
      />

      <ReportSection title={l("requestTitle", lang)} sectionKey="requestTitle" style={reportStyle} lang={lang}>
        <div className="jd-card jd-soft grid grid-cols-2 gap-x-4 gap-y-2.5 p-4 sm:grid-cols-4">
          <ReportField style={reportStyle} lang={lang} label={l("requestedBy", lang)} value={name} />
          <ReportField style={reportStyle} lang={lang} label={l("event", lang)} value={EVENT_L[event][lang] ?? EVENT_L[event].en} />
          <ReportField
            style={reportStyle}
            lang={lang}
            label={l("range", lang)}
            value={`${DateTime.fromISO(fromDate).toFormat("dd MMM yyyy")} – ${DateTime.fromISO(toDate).toFormat("dd MMM yyyy")}`}
          />
          <ReportField style={reportStyle} lang={lang} label={l("location", lang)} value={place} />
        </div>
      </ReportSection>

      <ReportSection title={l("bestTitle", lang)} sectionKey="bestTitle" style={reportStyle} lang={lang}>
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
                    <span key={r} className="jd-chip jd-chip-neutral">{REASON_L[r][lang] ?? REASON_L[r].en}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ReportSection>

      <ReportSection title={l("allTitle", lang)} sectionKey="allTitle" style={reportStyle} lang={lang}>
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
      </ReportSection>

      <ReportFooter disclaimer={l("method", lang)} />
    </article>
  );
}
