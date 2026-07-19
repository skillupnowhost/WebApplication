import { DateTime } from "luxon";
import { ChartWheel } from "./charts/ChartWheel";
import { rashiLabel, nakshatraLabel } from "@/lib/astrology/chartLayout";
import { AYANAMSA_NAMES, type AstrologySystem } from "@/lib/astrology/ayanamsa";
import { PLANET_ABBR, RASHIS } from "@/lib/astrology/constants";
import { formatDegreesInSign } from "@/lib/astrology/panchanga";
import type { ReportView } from "@/lib/astrology/report";
import type { SiderealPlanet } from "@/lib/astrology/chart";
import { t, type AstrologyLanguage, type AstrologyDictionaryKey } from "@/lib/astrology/i18n";
import { lv, horaLabel, LUXON_LOCALE, DASHA_THEMES_L } from "@/lib/astrology/reportL10n";
import type { TimeWindow } from "@/lib/astrology/muhurta";
import type { PlanetName } from "@/lib/astrology/constants";
import { cn } from "@/lib/cn";

/* Localized labels for the document — every language fully written, no mixing. */
const L: Record<string, Record<AstrologyLanguage, string>> = {
  personal: { en: "Personal Details", ta: "தனிப்பட்ட விவரங்கள்", hi: "व्यक्तिगत विवरण", te: "వ్యక్తిగత వివరాలు", ml: "വ്യക്തിഗത വിവരങ്ങൾ" },
  panchang: { en: "Panchang", ta: "பஞ்சாங்கம்", hi: "पंचांग", te: "పంచాంగం", ml: "പഞ്ചാംഗം" },
  birthDetails: { en: "Birth Details", ta: "ஜனன விவரங்கள்", hi: "जन्म विवरण", te: "జనన వివరాలు", ml: "ജനന വിവരങ്ങൾ" },
  planetary: { en: "Planetary Positions (Nirayana)", ta: "கிரக ஸ்புடம் (நிராயனம்)", hi: "ग्रह स्थिति (निरयन)", te: "గ్రహ స్థితులు (నిరయన)", ml: "ഗ്രഹനിലകൾ (നിരയന)" },
  charts: { en: "Rasi & Navamsa Charts", ta: "ராசி மற்றும் நவாம்ச கட்டங்கள்", hi: "राशि एवं नवांश कुंडली", te: "రాశి & నవాంశ చక్రాలు", ml: "രാശി & നവാംശ ചാർട്ടുകൾ" },
  strength: { en: "Planet Strength", ta: "கிரக பலம்", hi: "ग्रह बल", te: "గ్రహ బలం", ml: "ഗ്രഹ ബലം" },
  dasha: { en: "Vimshottari Dasha", ta: "விம்சோத்தரி தசை", hi: "विंशोत्तरी दशा", te: "వింశోత్తరీ దశ", ml: "വിംശോത്തരി ദശ" },
  dosha: { en: "Dosha Analysis & Remedies", ta: "தோஷங்கள் மற்றும் பரிகாரங்கள்", hi: "दोष विश्लेषण एवं उपाय", te: "దోష విశ్లేషణ & పరిహారాలు", ml: "ദോഷ വിശകലനവും പരിഹാരങ്ങളും" },
  lucky: { en: "Lucky Information", ta: "அதிர்ஷ்ட விவரங்கள்", hi: "शुभ जानकारी", te: "అదృష్ట వివరాలు", ml: "ഭാഗ്യ വിവരങ്ങൾ" },
  muhurtham: { en: "Day Muhurtham (Birth Date)", ta: "நாள் முகூர்த்தம் (பிறந்த நாள்)", hi: "दिन मुहूर्त (जन्म दिनांक)", te: "దిన ముహూర్తం (జనన తేదీ)", ml: "ദിന മുഹൂർത്തം (ജനന തീയതി)" },
  babyNames: { en: "Baby Name Prediction", ta: "குழந்தை பெயர் பரிந்துரை", hi: "शिशु नाम सुझाव", te: "శిశువు పేరు సూచనలు", ml: "കുഞ്ഞിന്റെ പേര് നിർദ്ദേശങ്ങൾ" },
  summary: { en: "Astrological Summary", ta: "ஜோதிட சுருக்கம்", hi: "ज्योतिष सारांश", te: "జ్యోతిష్య సారాంశం", ml: "ജ്യോതിഷ സംഗ്രഹം" },
  inDepth: { en: "In-Depth Analysis", ta: "விரிவான பலன்கள்", hi: "विस्तृत फल", te: "విస్తృత ఫలితాలు", ml: "വിശദമായ ഫലങ്ങൾ" },
  rasiChart: { en: "Rasi", ta: "ராசி", hi: "राशि", te: "రాశి", ml: "രാശി" },
  navamsaChart: { en: "Navamsa", ta: "நவாம்சம்", hi: "नवांश", te: "నవాంశ", ml: "നവാംശം" },
  headerSummary: { en: "Jenma Pathirikai", ta: "ஜென்ம பத்திரிகை", hi: "जन्म पत्रिका", te: "జన్మ పత్రిక", ml: "ജന്മ പത്രിക" },
  headerFull: { en: "Complete Jathagam", ta: "முழு ஜாதகம்", hi: "संपूर्ण कुंडली", te: "సంపూర్ణ జాతకం", ml: "സമ്പൂർണ്ണ ജാതകം" },
  confidential: { en: "CONFIDENTIAL", ta: "ரகசியம்", hi: "गोपनीय", te: "గోప్యం", ml: "രഹസ്യം" },
  reportIdL: { en: "Report ID", ta: "அறிக்கை எண்", hi: "रिपोर्ट क्रमांक", te: "నివేదిక ఐడి", ml: "റിപ്പോർട്ട് ഐഡി" },
  generatedL: { en: "Generated", ta: "உருவாக்கப்பட்டது", hi: "निर्मित", te: "రూపొందించబడింది", ml: "തയ്യാറാക്കിയത്" },
  rasiWord: { en: "Rasi", ta: "ராசி", hi: "राशि", te: "రాశి", ml: "രാശി" },
  lagnaWord: { en: "Lagna", ta: "லக்னம்", hi: "लग्न", te: "లగ్నం", ml: "ലഗ്നം" },
  padaL: { en: "Pada", ta: "பாதம்", hi: "पद", te: "పాదం", ml: "പാദം" },
  name: { en: "Name", ta: "பெயர்", hi: "नाम", te: "పేరు", ml: "പേര്" },
  gender: { en: "Gender", ta: "பாலினம்", hi: "लिंग", te: "లింగం", ml: "ലിംഗം" },
  father: { en: "Father", ta: "தந்தை", hi: "पिता", te: "తండ్రి", ml: "അച്ഛൻ" },
  mother: { en: "Mother", ta: "தாய்", hi: "माता", te: "తల్లి", ml: "അമ്മ" },
  parents: { en: "Parents", ta: "பெற்றோர்", hi: "माता-पिता", te: "తల్లిదండ్రులు", ml: "മാതാപിതാക്കൾ" },
  marital: { en: "Marital status", ta: "திருமண நிலை", hi: "वैवाहिक स्थिति", te: "వైవాహిక స్థితి", ml: "വൈവാഹിക നില" },
  phone: { en: "Phone", ta: "தொலைபேசி", hi: "फ़ोन", te: "ఫోన్", ml: "ഫോൺ" },
  email: { en: "Email", ta: "மின்னஞ்சல்", hi: "ईमेल", te: "ఇమెయిల్", ml: "ഇമെയിൽ" },
  occupation: { en: "Occupation", ta: "தொழில்", hi: "व्यवसाय", te: "వృత్తి", ml: "തൊഴിൽ" },
  businessType: { en: "Business type", ta: "தொழில் வகை", hi: "व्यवसाय प्रकार", te: "వ్యాపార రకం", ml: "ബിസിനസ് തരം" },
  salary: { en: "Salary / income", ta: "சம்பளம் / வருமானம்", hi: "वेतन / आय", te: "జీతం / ఆదాయం", ml: "ശമ്പളം / വരുമാനം" },
  community: { en: "Community", ta: "சமூகம்", hi: "समुदाय", te: "సామాజిక వర్గం", ml: "സമുദായം" },
  caste: { en: "Caste", ta: "ஜாதி", hi: "जाति", te: "కులం", ml: "ജാതി" },
  gothram: { en: "Gothram", ta: "கோத்திரம்", hi: "गोत्र", te: "గోత్రం", ml: "ഗോത്രം" },
  dob: { en: "Date of birth", ta: "பிறந்த தேதி", hi: "जन्म तिथि", te: "పుట్టిన తేదీ", ml: "ജനന തീയതി" },
  tob: { en: "Time of birth", ta: "பிறந்த நேரம்", hi: "जन्म समय", te: "పుట్టిన సమయం", ml: "ജനന സമയം" },
  place: { en: "Place", ta: "பிறந்த ஊர்", hi: "जन्म स्थान", te: "జన్మస్థలం", ml: "ജനന സ്ഥലം" },
  coordinates: { en: "Coordinates", ta: "ஆயத்தொலைவுகள்", hi: "निर्देशांक", te: "అక్షాంశాలు", ml: "കോർഡിനേറ്റുകൾ" },
  systemL: { en: "System", ta: "ஜோதிட முறை", hi: "पद्धति", te: "పద్ధతి", ml: "രീതി" },
  sunrise: { en: "Sunrise", ta: "சூரிய உதயம்", hi: "सूर्योदय", te: "సూర్యోదయం", ml: "സൂര്യോദയം" },
  sunset: { en: "Sunset", ta: "சூரிய அஸ்தமனம்", hi: "सूर्यास्त", te: "సూర్యాస్తమయం", ml: "സൂര്യാസ്തമയം" },
  moonrise: { en: "Moonrise", ta: "சந்திர உதயம்", hi: "चंद्रोदय", te: "చంద్రోదయం", ml: "ചന്ദ്രോദയം" },
  moonset: { en: "Moonset", ta: "சந்திர அஸ்தமனம்", hi: "चंद्रास्त", te: "చంద్రాస్తమయం", ml: "ചന്ദ്രാസ്തമയം" },
  tamilDateL: { en: "Tamil date", ta: "தமிழ் தேதி", hi: "तमिल तिथि", te: "తమిళ తేదీ", ml: "തമിഴ് തീയതി" },
  sakaKaliL: { en: "Saka / Kali year", ta: "சக / கலி ஆண்டு", hi: "शक / कलि वर्ष", te: "శక / కలి సంవత్సరం", ml: "ശക / കലി വർഷം" },
  ayanamsaL: { en: "Ayanamsa", ta: "அயனாம்சம்", hi: "अयनांश", te: "అయనాంశం", ml: "അയനാംശം" },
  udayadiL: { en: "Udayadi Nazhigai", ta: "உதயாதி நாழிகை", hi: "उदयादि नाड़िका", te: "ఉదయాది ఘడియలు", ml: "ഉദയാദി നാഴിക" },
  tithiL: { en: "Tithi", ta: "திதி", hi: "तिथि", te: "తిథి", ml: "തിഥി" },
  yogaL: { en: "Yoga", ta: "யோகம்", hi: "योग", te: "యోగం", ml: "യോഗം" },
  karanaL: { en: "Karana", ta: "கரணம்", hi: "करण", te: "కరణం", ml: "കരണം" },
  vaaraL: { en: "Vaara", ta: "கிழமை", hi: "वार", te: "వారం", ml: "ദിവസം" },
  rituL: { en: "Ritu (season)", ta: "ருது (பருவம்)", hi: "ऋतु", te: "ఋతువు", ml: "ഋതു" },
  ayanaL: { en: "Ayana", ta: "அயனம்", hi: "अयन", te: "అయనం", ml: "അയനം" },
  solarMonthL: { en: "Solar month", ta: "சூரிய மாதம்", hi: "सौर मास", te: "సౌర మాసం", ml: "സൗര മാസം" },
  starLordL: { en: "Star lord", ta: "நட்சத்திர அதிபதி", hi: "नक्षत्र स्वामी", te: "నక్షత్రాధిపతి", ml: "നക്ഷത്രാധിപൻ" },
  janmaRasi: { en: "Janma Rasi", ta: "ஜென்ம ராசி", hi: "जन्म राशि", te: "జన్మ రాశి", ml: "ജന്മ രാശി" },
  nakPada: { en: "Nakshatra · Pada", ta: "நட்சத்திரம் · பாதம்", hi: "नक्षत्र · पद", te: "నక్షత్రం · పాదం", ml: "നക്ഷത്രം · പാദം" },
  lagnaAsc: { en: "Lagna (Ascendant)", ta: "லக்னம்", hi: "लग्न", te: "లగ్నం", ml: "ലഗ്നം" },
  sunSign: { en: "Sun sign", ta: "சூரிய ராசி", hi: "सूर्य राशि", te: "సూర్య రాశి", ml: "സൂര്യ രാശി" },
  ganaL: { en: "Gana", ta: "கணம்", hi: "गण", te: "గణం", ml: "ഗണം" },
  yoniL: { en: "Yoni (animal)", ta: "யோனி (விலங்கு)", hi: "योनि", te: "యోని", ml: "യോനി" },
  nadiL: { en: "Nadi", ta: "நாடி", hi: "नाड़ी", te: "నాడి", ml: "നാഡി" },
  rajjuL: { en: "Rajju", ta: "ரஜ்ஜு", hi: "रज्जु", te: "రజ్జు", ml: "രജ്ജു" },
  varnaL: { en: "Varna", ta: "வர்ணம்", hi: "वर्ण", te: "వర్ణం", ml: "വർണം" },
  vashyaL: { en: "Vashya", ta: "வசியம்", hi: "वश्य", te: "వశ్య", ml: "വശ്യം" },
  birdL: { en: "Bird (Panchapakshi)", ta: "பறவை (பஞ்சபட்சி)", hi: "पक्षी (पंचपक्षी)", te: "పక్షి (పంచపక్షి)", ml: "പക്ഷി (പഞ്ചപക്ഷി)" },
  elementL: { en: "Element", ta: "பூதம் (தத்துவம்)", hi: "तत्व", te: "తత్వం", ml: "തത്വം" },
  colPlanet: { en: "Planet", ta: "கிரகம்", hi: "ग्रह", te: "గ్రహం", ml: "ഗ്രഹം" },
  colDegree: { en: "Degree", ta: "பாகை", hi: "अंश", te: "భాగలు", ml: "ഭാഗ" },
  colSign: { en: "Sign", ta: "ராசி", hi: "राशि", te: "రాశి", ml: "രാശി" },
  colHouse: { en: "House", ta: "பாவம்", hi: "भाव", te: "భావం", ml: "ഭാവം" },
  colNavamsa: { en: "Navamsa", ta: "நவாம்சம்", hi: "नवांश", te: "నవాంశ", ml: "നവാംശം" },
  colDignity: { en: "Dignity", ta: "தன்மை", hi: "स्थिति", te: "స్థితి", ml: "നില" },
  colStatus: { en: "Status", ta: "நிலை", hi: "अवस्था", te: "అవస్థ", ml: "അവസ്ഥ" },
  strengthNote: {
    en: "Dignity-based score: exaltation, own/friendly sign, retrogression, combustion & aspects.",
    ta: "கிரக நிலை அடிப்படையிலான மதிப்பெண்: உச்சம், ஆட்சி/நட்பு வீடு, வக்கிரம், அஸ்தமனம், பார்வைகள்.",
    hi: "गरिमा-आधारित अंक: उच्च, स्व/मित्र राशि, वक्री, अस्त और दृष्टियां।",
    te: "గ్రహ స్థితి ఆధారిత స్కోరు: ఉచ్ఛ, స్వ/మిత్ర క్షేత్రం, వక్రం, అస్తంగతం, దృష్టులు.",
    ml: "ഗ്രഹനില അടിസ്ഥാന സ്കോർ: ഉച്ചം, സ്വ/മിത്ര ക്ഷേത്രം, വക്രം, അസ്തമയം, ദൃഷ്ടികൾ.",
  },
  balanceBirth: { en: "Balance at birth", ta: "பிறப்பில் மீதி தசை", hi: "जन्म पर शेष दशा", te: "జనన సమయ మిగులు దశ", ml: "ജനനസമയ ബാക്കി ദശ" },
  currentPeriod: { en: "Current period", ta: "நடப்பு தசை", hi: "वर्तमान दशा", te: "ప్రస్తుత దశ", ml: "നിലവിലെ ദശ" },
  yAbbr: { en: "y", ta: "வ", hi: "व", te: "సం", ml: "വ" },
  mAbbr: { en: "m", ta: "மா", hi: "मा", te: "నె", ml: "മാ" },
  dAbbr: { en: "d", ta: "நா", hi: "दि", te: "రో", ml: "ദി" },
  dashaWord: { en: "dasha", ta: "தசை", hi: "दशा", te: "దశ", ml: "ദശ" },
  clearL: { en: "Clear", ta: "இல்லை", hi: "नहीं है", te: "లేదు", ml: "ഇല്ല" },
  noDoshaText: {
    en: "No major doshas detected in this chart — a harmonious planetary spread.",
    ta: "இந்த ஜாதகத்தில் பெரிய தோஷங்கள் எதுவும் இல்லை — நல்ல கிரக அமைப்பு.",
    hi: "इस कुंडली में कोई प्रमुख दोष नहीं — शुभ ग्रह स्थिति।",
    te: "ఈ జాతకంలో ప్రధాన దోషాలు లేవు — అనుకూల గ్రహ అమరిక.",
    ml: "ഈ ജാതകത്തിൽ പ്രധാന ദോഷങ്ങളില്ല — അനുകൂല ഗ്രഹനില.",
  },
  luckyNumbers: { en: "Lucky numbers", ta: "அதிர்ஷ்ட எண்கள்", hi: "शुभ अंक", te: "అదృష్ట సంఖ్యలు", ml: "ഭാഗ്യ സംഖ്യകൾ" },
  luckyColour: { en: "Lucky colour", ta: "அதிர்ஷ்ட நிறம்", hi: "शुभ रंग", te: "అదృష్ట రంగు", ml: "ഭാഗ്യ നിറം" },
  luckyDay: { en: "Lucky day", ta: "அதிர்ஷ்ட நாள்", hi: "शुभ दिन", te: "అదృష్ట రోజు", ml: "ഭാഗ്യ ദിനം" },
  luckyDirection: { en: "Lucky direction", ta: "அதிர்ஷ்ட திசை", hi: "शुभ दिशा", te: "అదృష్ట దిశ", ml: "ഭാഗ്യ ദിശ" },
  luckyMetal: { en: "Lucky metal", ta: "அதிர்ஷ்ட உலோகம்", hi: "शुभ धातु", te: "అదృష్ట లోహం", ml: "ഭാഗ്യ ലോഹം" },
  gemstoneL: { en: "Gemstone", ta: "ரத்தினக்கல்", hi: "रत्न", te: "రత్నం", ml: "രത്നം" },
  luckyDates: { en: "Lucky dates", ta: "அதிர்ஷ்ட தேதிகள்", hi: "शुभ तिथियां", te: "అదృష్ట తేదీలు", ml: "ഭാഗ്യ തീയതികൾ" },
  favYears: { en: "Favourable years", ta: "சாதக ஆண்டுகள்", hi: "अनुकूल वर्ष", te: "అనుకూల సంవత్సరాలు", ml: "അനുകൂല വർഷങ്ങൾ" },
  deityL: { en: "Guiding deity", ta: "வழிபடு தெய்வம்", hi: "इष्ट देव", te: "ఇష్ట దైవం", ml: "ഇഷ്ട ദേവത" },
  luckyMonths: { en: "Lucky months", ta: "அதிர்ஷ்ட மாதங்கள்", hi: "शुभ मास", te: "అదృష్ట నెలలు", ml: "ഭാഗ്യ മാസങ്ങൾ" },
  choghadiyaNote: {
    en: "Choghadiya sequence from sunrise → sunset on the birth date.",
    ta: "பிறந்த நாளில் சூரிய உதயம் முதல் அஸ்தமனம் வரை சோகடியா வரிசை.",
    hi: "जन्म दिनांक पर सूर्योदय से सूर्यास्त तक चौघड़िया क्रम।",
    te: "జనన తేదీన సూర్యోదయం నుండి సూర్యాస్తమయం వరకు చౌఘడియా క్రమం.",
    ml: "ജനന തീയതിയിൽ സൂര്യോദയം മുതൽ അസ്തമയം വരെ ചൗഘടിയ ക്രമം.",
  },
  sunUnavailable: {
    en: "Sunrise/sunset unavailable for this location.",
    ta: "இந்த இடத்திற்கு சூரிய உதய/அஸ்தமன நேரம் கிடைக்கவில்லை.",
    hi: "इस स्थान के लिए सूर्योदय/सूर्यास्त उपलब्ध नहीं।",
    te: "ఈ ప్రదేశానికి సూర్యోదయ/సూర్యాస్తమయ సమయం అందుబాటులో లేదు.",
    ml: "ഈ സ്ഥലത്തിന് സൂര്യോദയ/അസ്തമയ സമയം ലഭ്യമല്ല.",
  },
  nameSyllables: { en: "Name syllables", ta: "பெயர் எழுத்துகள்", hi: "नाम अक्षर", te: "పేరు అక్షరాలు", ml: "പേര് അക്ഷരങ്ങൾ" },
  luckyTotals: { en: "Lucky name totals", ta: "அதிர்ஷ்ட பெயர் எண்கள்", hi: "शुभ नाम अंक", te: "అదృష్ట పేరు మొత్తాలు", ml: "ഭാഗ്യ പേര് തുകകൾ" },
  boys: { en: "Boys", ta: "ஆண் பெயர்கள்", hi: "लड़कों के नाम", te: "అబ్బాయిల పేర్లు", ml: "ആൺകുട്ടികളുടെ പേരുകൾ" },
  girls: { en: "Girls", ta: "பெண் பெயர்கள்", hi: "लड़कियों के नाम", te: "అమ్మాయిల పేర్లు", ml: "പെൺകുട്ടികളുടെ പേരുകൾ" },
  chaldeanNote: {
    en: "Chaldean totals highlighted in gold reduce to the psychic ({p}) or destiny ({d}) number.",
    ta: "தங்க நிறத்தில் உள்ள கல்தேயன் எண்கள் மன எண் ({p}) அல்லது விதி எண் ({d}) உடன் பொருந்துகின்றன.",
    hi: "स्वर्ण रंग में चिह्नित कैल्डियन योग मूलांक ({p}) या भाग्यांक ({d}) में घटते हैं।",
    te: "బంగారు రంగులో గుర్తించిన కల్దీయన్ మొత్తాలు మూలాంకం ({p}) లేదా భాగ్యాంకం ({d})కి సరిపోతాయి.",
    ml: "സ്വർണ്ണ നിറത്തിൽ അടയാളപ്പെടുത്തിയ കൽദിയൻ തുകകൾ മൂലാങ്കം ({p}) അല്ലെങ്കിൽ ഭാഗ്യാങ്കം ({d}) ആയി യോജിക്കുന്നു.",
  },
  dashaTimeline: { en: "Dasha Timeline by Age", ta: "வயது வாரியான தசா அட்டவணை", hi: "आयु अनुसार दशा सारणी", te: "వయస్సు వారీ దశా పట్టిక", ml: "പ്രായം അനുസരിച്ച് ദശാ പട്ടിക" },
  ageL: { en: "Age", ta: "வயது", hi: "आयु", te: "వయస్సు", ml: "പ്രായം" },
  mahaL: { en: "Mahadasha", ta: "மகா தசை", hi: "महादशा", te: "మహాదశ", ml: "മഹാദശ" },
  antarL: { en: "Antardasha", ta: "அந்தர் தசை", hi: "अंतर्दशा", te: "అంతర్దశ", ml: "അന്തർദശ" },
  themeL: { en: "Theme", ta: "பலன்", hi: "फल", te: "ఫలం", ml: "ഫലം" },
  footerDisclaimer: {
    en: "Predictions are traditional guidance, not a substitute for professional advice.",
    ta: "பலன்கள் பாரம்பரிய வழிகாட்டுதல் மட்டுமே; தொழில்முறை ஆலோசனைக்கு மாற்று அல்ல.",
    hi: "फलादेश पारंपरिक मार्गदर्शन है, पेशेवर सलाह का विकल्प नहीं।",
    te: "ఫలితాలు సాంప్రదాయ మార్గదర్శకత్వం మాత్రమే; వృత్తిపర సలహాకు ప్రత్యామ్నాయం కాదు.",
    ml: "ഫലങ്ങൾ പരമ്പരാഗത മാർഗനിർദേശം മാത്രം; പ്രൊഫഷണൽ ഉപദേശത്തിന് പകരമല്ല.",
  },
};

function l(key: string, lang: AstrologyLanguage): string {
  return L[key]?.[lang] ?? L[key]?.en ?? key;
}

const SYSTEM_KEY: Record<AstrologySystem, AstrologyDictionaryKey> = {
  THIRUKKANITHAM: "systemThirukkanitham",
  VAKYA: "systemVakya",
  KP: "systemKP",
  RAMAN: "systemRaman",
};

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("astro-report-section mb-5", className)}>
      <h2 className="jd-section-title mb-2.5">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="jd-label">{label}</p>
      <p className="jd-value truncate">{value}</p>
    </div>
  );
}

export function ReportViewer({ view, printMode = false }: { view: ReportView; printMode?: boolean }) {
  const { language: lang } = view;
  const locale = LUXON_LOCALE[lang];
  const sun = view.planets.find((p) => p.planet === "Sun")!;
  const moon = view.planets.find((p) => p.planet === "Moon")!;
  const birthLocal = DateTime.fromISO(view.birthLocalIso, { setZone: true }).setLocale(locale);
  const isFull = view.depth === "FULL";

  const fmtTime = (iso: string | null) => (iso ? DateTime.fromISO(iso, { setZone: true }).setLocale(locale).toFormat("hh:mm a") : "—");
  const fmtDate = (iso: string) => DateTime.fromISO(iso, { setZone: true }).setLocale(locale).toFormat("dd MMM yyyy");
  const windowLabel = (w: TimeWindow) => `${fmtTime(w.start)} – ${fmtTime(w.end)}`;
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

  const navamsaPlanets: SiderealPlanet[] = view.planets.map((p) => ({
    ...p,
    rashi: RASHIS[view.navamsaIndices[p.planet] ?? p.rashi.index],
  }));

  const presentDoshas = view.doshas.filter((d) => d.present);
  const absentDoshas = view.doshas.filter((d) => !d.present);
  const upcomingDashas = view.dashaPeriods.slice(0, 4);
  const headlineSection = view.narrative.sections[0];
  const remainingSections = view.narrative.sections.slice(1);

  const systemTitle = t(lang, SYSTEM_KEY[view.system]);
  const pakshaText = lang === "en" ? view.panchanga.tithi.paksha : lv(lang, `${view.panchanga.tithi.paksha} Paksha`);
  const tamilDateText =
    lang === "ta"
      ? `${view.tamilDate.yearNameTamil} · ${view.tamilDate.monthTamil} ${view.tamilDate.day}`
      : `${view.tamilDate.yearName} · ${view.tamilDate.monthEnglish} ${view.tamilDate.day}`;
  const solarMonthText = lang === "ta" ? view.tamilDate.monthTamil : view.tamilDate.monthEnglish;
  const rituText = lang === "ta" ? view.ritu.tamil : lv(lang, view.ritu.english);
  const ayanaText = lang === "ta" ? view.ayana.tamil : lv(lang, view.ayana.english);

  return (
    <article
      className={cn(
        "jathagam-doc astro-print-page rounded-2xl",
        view.reportStyle === "TRADITIONAL" && "jd-style-traditional",
        view.reportStyle === "MODERN" && "jd-style-modern",
        printMode ? "shadow-none" : "p-8 shadow-[0_10px_50px_rgba(16,29,58,0.12)] sm:p-10"
      )}
    >
      {/* ---- Header ---- */}
      <header className="mb-6 border-b-2 border-[var(--jd-gold-bright)] pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="jd-kicker">MyLoginn Astrology · {systemTitle}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--jd-royal-deep)]">
              {isFull ? l("headerFull", lang) : l("headerSummary", lang)} — {view.fullName}
            </h1>
          </div>
          <div className="text-right text-[10px] leading-4 text-[var(--jd-ink-soft)]">
            <p className="jd-chip jd-chip-gold mb-1">{l("confidential", lang)}</p>
            <p>
              {l("reportIdL", lang)} · {view.reportId.slice(-8).toUpperCase()}
            </p>
            <p>
              {l("generatedL", lang)} · {fmtDate(view.createdAt)}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="jd-chip jd-chip-neutral">☽ {rashiLabel(moon.rashi.index, lang)} {l("rasiWord", lang)}</span>
          <span className="jd-chip jd-chip-neutral">
            ✦ {nakshatraLabel(moon.nakshatra, lang)} · {l("padaL", lang)} {moon.nakshatra.pada}
          </span>
          <span className="jd-chip jd-chip-neutral">↑ {rashiLabel(view.ascendant.rashi.index, lang)} {l("lagnaWord", lang)}</span>
          <span className="jd-chip jd-chip-neutral">☉ {rashiLabel(sun.rashi.index, lang)}</span>
        </div>
      </header>

      {/* ---- Personal details ---- */}
      <Section title={l("personal", lang)}>
        <div className="jd-card jd-soft grid grid-cols-2 gap-x-4 gap-y-2.5 p-4 sm:grid-cols-4">
          <Field label={l("name", lang)} value={view.fullName} />
          <Field label={l("gender", lang)} value={view.gender ? lv(lang, cap(view.gender)) : "—"} />
          <Field label={l("dob", lang)} value={birthLocal.toFormat("dd MMM yyyy (cccc)")} />
          <Field label={l("tob", lang)} value={view.birthTimeKnown ? birthLocal.toFormat("hh:mm a") : lv(lang, "Unknown (12:00 assumed)")} />
          <Field label={l("place", lang)} value={view.birthPlace} />
          <Field label={l("coordinates", lang)} value={`${view.latitude.toFixed(2)}°, ${view.longitude.toFixed(2)}° · ${view.timezone}`} />
          <Field label={l("systemL", lang)} value={systemTitle} />
          {view.fatherName && <Field label={l("father", lang)} value={view.fatherName} />}
          {view.motherName && <Field label={l("mother", lang)} value={view.motherName} />}
          {!view.fatherName && !view.motherName && view.parentsNames && <Field label={l("parents", lang)} value={view.parentsNames} />}
          {view.maritalStatus && <Field label={l("marital", lang)} value={lv(lang, cap(view.maritalStatus))} />}
          {view.phone && <Field label={l("phone", lang)} value={view.phone} />}
          {view.email && <Field label={l("email", lang)} value={view.email} />}
          {view.occupation && <Field label={l("occupation", lang)} value={view.occupation} />}
          {view.businessType && <Field label={l("businessType", lang)} value={view.businessType} />}
          {view.salary && <Field label={l("salary", lang)} value={view.salary} />}
          {view.community && <Field label={l("community", lang)} value={view.community} />}
          {view.caste && <Field label={l("caste", lang)} value={view.caste} />}
          {view.gothram && <Field label={l("gothram", lang)} value={view.gothram} />}
        </div>
      </Section>

      {/* ---- Panchang ---- */}
      <Section title={l("panchang", lang)}>
        <div className="jd-card grid grid-cols-2 gap-x-4 gap-y-2.5 p-4 sm:grid-cols-4">
          <Field label={l("sunrise", lang)} value={fmtTime(view.riseSet.sunrise)} />
          <Field label={l("sunset", lang)} value={fmtTime(view.riseSet.sunset)} />
          <Field label={l("moonrise", lang)} value={fmtTime(view.riseSet.moonrise)} />
          <Field label={l("moonset", lang)} value={fmtTime(view.riseSet.moonset)} />
          <Field label={l("tamilDateL", lang)} value={tamilDateText} />
          <Field label={l("sakaKaliL", lang)} value={`${view.tamilDate.sakaYear} / ${view.tamilDate.kaliYear}`} />
          <Field label={`${l("ayanamsaL", lang)} (${AYANAMSA_NAMES[view.system]})`} value={`${view.ayanamsaUsed.toFixed(4)}°`} />
          <Field label={l("udayadiL", lang)} value={view.udayadi ? `${view.udayadi.nazhigai} ${lang === "ta" ? "நா" : "Na"} ${view.udayadi.vinadi} ${lang === "ta" ? "வி" : "Vi"}` : "—"} />
          <Field label={l("tithiL", lang)} value={`${pakshaText} ${lv(lang, view.panchanga.tithi.name)}`} />
          <Field label={l("yogaL", lang)} value={lv(lang, view.panchanga.yoga.name)} />
          <Field label={l("karanaL", lang)} value={lv(lang, view.panchanga.karana.name)} />
          <Field label={l("vaaraL", lang)} value={lv(lang, view.panchanga.vaara.name)} />
          <Field label={l("rituL", lang)} value={rituText} />
          <Field label={l("ayanaL", lang)} value={ayanaText} />
          <Field label={l("solarMonthL", lang)} value={solarMonthText} />
          <Field label={l("starLordL", lang)} value={lv(lang, moon.nakshatra.lord)} />
        </div>
      </Section>

      {/* ---- Birth details / Avakahada ---- */}
      <Section title={l("birthDetails", lang)}>
        <div className="jd-card grid grid-cols-2 gap-x-4 gap-y-2.5 p-4 sm:grid-cols-4">
          <Field label={l("janmaRasi", lang)} value={rashiLabel(moon.rashi.index, lang)} />
          <Field label={l("nakPada", lang)} value={`${nakshatraLabel(moon.nakshatra, lang)} · ${moon.nakshatra.pada}`} />
          <Field label={l("lagnaAsc", lang)} value={rashiLabel(view.ascendant.rashi.index, lang)} />
          <Field label={l("sunSign", lang)} value={rashiLabel(sun.rashi.index, lang)} />
          <Field label={l("ganaL", lang)} value={lv(lang, view.avakahada.gana)} />
          <Field label={l("yoniL", lang)} value={lv(lang, view.avakahada.yoniAnimal)} />
          <Field label={l("nadiL", lang)} value={lv(lang, view.avakahada.nadi)} />
          <Field label={l("rajjuL", lang)} value={lv(lang, view.avakahada.rajju)} />
          <Field label={l("varnaL", lang)} value={lv(lang, view.avakahada.varna)} />
          <Field label={l("vashyaL", lang)} value={lv(lang, view.avakahada.vashya)} />
          <Field label={l("birdL", lang)} value={lv(lang, view.avakahada.bird)} />
          <Field label={l("elementL", lang)} value={lv(lang, view.avakahada.element)} />
        </div>
      </Section>

      {/* ---- Charts ---- */}
      <Section title={l("charts", lang)} className="jd-charts">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { title: l("rasiChart", lang), asc: view.ascendant.rashi.index, planets: view.planets },
            { title: l("navamsaChart", lang), asc: view.navamsaLagnaIndex, planets: navamsaPlanets },
          ].map((c) => (
            <div key={c.title} className="jd-card p-3">
              <p className="jd-label mb-2 text-center">{c.title}</p>
              <div className="mx-auto aspect-square w-full max-w-[250px] text-[var(--jd-ink)]">
                <ChartWheel
                  chartStyle={view.chartStyle}
                  ascendantRashiIndex={c.asc}
                  planets={c.planets}
                  language={lang}
                  center={{
                    title: c.title,
                    lines: [
                      birthLocal.toFormat("dd - MMMM - yyyy"),
                      view.birthTimeKnown ? birthLocal.toFormat("hh : mm a") : "",
                    ].filter(Boolean),
                    footer: nakshatraLabel(moon.nakshatra, lang),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Planetary positions ---- */}
      <Section title={l("planetary", lang)}>
        <div className="jd-card overflow-x-auto p-2">
          <table className="jd-table">
            <thead>
              <tr>
                <th>{l("colPlanet", lang)}</th>
                <th>{l("colDegree", lang)}</th>
                <th>{l("colSign", lang)}</th>
                <th>{l("nakPada", lang)}</th>
                <th>{l("colHouse", lang)}</th>
                <th>{l("colNavamsa", lang)}</th>
                <th>{l("colDignity", lang)}</th>
                <th>{l("colStatus", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {view.planets.map((p) => {
                const s = view.strengths.find((x) => x.planet === p.planet);
                return (
                  <tr key={p.planet}>
                    <td className="font-semibold">
                      {lv(lang, p.planet)} <span className="text-[var(--jd-ink-soft)]">({PLANET_ABBR[p.planet]})</span>
                    </td>
                    <td>{formatDegreesInSign(p.siderealLongitude)}</td>
                    <td>{rashiLabel(p.rashi.index, lang)}</td>
                    <td>
                      {nakshatraLabel(p.nakshatra, lang)} · {p.nakshatra.pada}
                    </td>
                    <td>{p.houseFromAscendant}</td>
                    <td>{rashiLabel(view.navamsaIndices[p.planet] ?? 0, lang)}</td>
                    <td>{s ? lv(lang, s.dignity) : "—"}</td>
                    <td>
                      {p.isRetrograde && <span title="Retrograde">℞ </span>}
                      {s?.isCombust && <span className="text-[var(--jd-bad)]">{lv(lang, "Combust")}</span>}
                      {!p.isRetrograde && !s?.isCombust && "—"}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="font-semibold">{lv(lang, "Lagna")}</td>
                <td>{formatDegreesInSign(view.ascendant.siderealLongitude)}</td>
                <td>{rashiLabel(view.ascendant.rashi.index, lang)}</td>
                <td colSpan={2}>—</td>
                <td>{rashiLabel(view.navamsaLagnaIndex, lang)}</td>
                <td colSpan={2}>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- Strength + Dasha ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Section title={l("strength", lang)}>
          <div className="jd-card flex flex-col gap-2 p-4">
            {[...view.strengths]
              .sort((a, b) => a.rank - b.rank)
              .map((s) => (
                <div key={s.planet} className="flex items-center gap-2.5">
                  <span className="w-16 shrink-0 text-[11px] font-semibold">{lv(lang, s.planet)}</span>
                  <div className="jd-bar flex-1">
                    <span style={{ width: `${s.score}%` }} />
                  </div>
                  <span className="w-9 shrink-0 text-right text-[10.5px] font-semibold text-[var(--jd-ink-soft)]">{s.score}%</span>
                </div>
              ))}
            <p className="mt-1 text-[9.5px] leading-4 text-[var(--jd-ink-soft)]">{l("strengthNote", lang)}</p>
          </div>
        </Section>

        <Section title={l("dasha", lang)}>
          <div className="jd-card p-4">
            <div className="mb-3 grid grid-cols-2 gap-2.5">
              <Field
                label={l("balanceBirth", lang)}
                value={`${lv(lang, view.dashaBalance.lord)} — ${view.dashaBalance.years}${l("yAbbr", lang)} ${view.dashaBalance.months}${l("mAbbr", lang)} ${view.dashaBalance.days}${l("dAbbr", lang)}`}
              />
              {view.currentDasha && (
                <Field
                  label={l("currentPeriod", lang)}
                  value={`${lv(lang, view.currentDasha.mahaLord)} / ${lv(lang, view.currentDasha.antarLord)} · ${fmtDate(view.currentDasha.antarEndDate)}`}
                />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {upcomingDashas.map((d) => (
                <div key={d.startDate} className="flex items-baseline justify-between gap-2 border-b border-[var(--jd-hairline)] pb-1 text-[11px] last:border-0">
                  <span className="font-semibold text-[var(--jd-royal)]">{lv(lang, d.lord)}</span>
                  <span className="text-[var(--jd-ink-soft)]">
                    {fmtDate(d.startDate)} → {fmtDate(d.endDate)}
                  </span>
                </div>
              ))}
            </div>
            {view.currentDasha && (
              <p className="mt-2 text-[10px] leading-4 text-[var(--jd-ink-soft)]">
                {lang === "en"
                  ? `${view.currentDasha.mahaLord} periods emphasise ${DASHA_THEMES_L[view.currentDasha.mahaLord as PlanetName]?.en}.`
                  : `${lv(lang, view.currentDasha.mahaLord)} ${l("dashaWord", lang)}: ${DASHA_THEMES_L[view.currentDasha.mahaLord as PlanetName]?.[lang]}.`}
              </p>
            )}
          </div>
        </Section>
      </div>

      {/* ---- Doshas ---- */}
      <Section title={l("dosha", lang)}>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {absentDoshas.map((d) => (
            <span key={d.key} className="jd-chip jd-chip-good">
              ✓ {lv(lang, d.name)} — {l("clearL", lang)}
            </span>
          ))}
        </div>
        {presentDoshas.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {presentDoshas.map((d) => (
              <div key={d.key} className="jd-card border-l-[3px] border-l-[var(--jd-bad)] p-3.5">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-[12px] font-bold">{lv(lang, d.name)}</p>
                  <span className="jd-chip jd-chip-bad">{lv(lang, d.severity ?? "present")}</span>
                </div>
                <p className="mb-1.5 text-[10.5px] leading-4 text-[var(--jd-ink-soft)]">{d.explanation}</p>
                <ul className="flex flex-col gap-0.5">
                  {d.remedies.slice(0, 3).map((r) => (
                    <li key={r} className="flex gap-1.5 text-[10.5px] leading-4">
                      <span className="text-[var(--jd-gold)]">✦</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-[var(--jd-ink-soft)]">{l("noDoshaText", lang)}</p>
        )}
      </Section>

      {/* ---- Lucky info + Muhurtham ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Section title={l("lucky", lang)}>
          <div className="jd-card jd-soft grid grid-cols-2 gap-x-4 gap-y-2.5 p-4">
            <Field label={l("luckyNumbers", lang)} value={view.lucky.numbers.slice(0, 8).join(", ")} />
            <Field label={l("luckyColour", lang)} value={lv(lang, view.numerology.luckyColor)} />
            <Field label={l("luckyDay", lang)} value={lv(lang, view.lucky.day)} />
            <Field label={l("luckyDirection", lang)} value={lv(lang, view.lucky.direction)} />
            <Field label={l("luckyMetal", lang)} value={lv(lang, view.lucky.metal)} />
            <Field label={l("gemstoneL", lang)} value={lv(lang, view.lucky.gemstone)} />
            <Field label={l("luckyDates", lang)} value={view.lucky.dates.join(", ")} />
            <Field label={l("favYears", lang)} value={view.lucky.years.join(", ")} />
            <Field label={l("deityL", lang)} value={lv(lang, view.lucky.deity)} />
            <Field label={l("luckyMonths", lang)} value={view.lucky.months.map((m) => lv(lang, m)).join(", ") || "—"} />
          </div>
        </Section>

        <Section title={l("muhurtham", lang)}>
          <div className="jd-card p-4">
            {view.muhurta ? (
              <>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="jd-chip jd-chip-good">
                    {lv(lang, "Abhijit")} · {windowLabel(view.muhurta.abhijit)}
                  </span>
                  {view.muhurta.auspiciousHoras.slice(0, 3).map((h) => (
                    <span key={h.key} className="jd-chip jd-chip-good">
                      {horaLabel(lang, h.label)} · {windowLabel(h)}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="jd-chip jd-chip-bad">
                    {lv(lang, "Rahu Kalam")} · {windowLabel(view.muhurta.rahuKalam)}
                  </span>
                  <span className="jd-chip jd-chip-bad">
                    {lv(lang, "Yamagandam")} · {windowLabel(view.muhurta.yamagandam)}
                  </span>
                  <span className="jd-chip jd-chip-bad">
                    {lv(lang, "Gulikai")} · {windowLabel(view.muhurta.gulikai)}
                  </span>
                </div>
                <div className="mt-2.5 flex overflow-hidden rounded-md border border-[var(--jd-hairline)]">
                  {view.muhurta.choghadiya.map((c) => (
                    <div
                      key={c.key}
                      title={`${lv(lang, c.label)} ${windowLabel(c)}`}
                      className={cn(
                        "flex-1 py-1 text-center text-[8.5px] font-semibold",
                        c.kind === "auspicious" && "bg-emerald-50 text-emerald-700",
                        c.kind === "inauspicious" && "bg-red-50 text-red-700",
                        c.kind === "neutral" && "bg-[var(--jd-paper-soft)] text-[var(--jd-ink-soft)]"
                      )}
                    >
                      {lv(lang, c.label)}
                    </div>
                  ))}
                </div>
                <p className="mt-1.5 text-[9.5px] text-[var(--jd-ink-soft)]">{l("choghadiyaNote", lang)}</p>
              </>
            ) : (
              <p className="text-[11px] text-[var(--jd-ink-soft)]">{l("sunUnavailable", lang)}</p>
            )}
          </div>
        </Section>
      </div>

      {/* ---- Baby names ---- */}
      <Section title={l("babyNames", lang)}>
        <div className="jd-card p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="jd-label">
              {l("nameSyllables", lang)} ({nakshatraLabel(moon.nakshatra, lang)}):
            </span>
            {view.babyNames.syllables.latin.map((s, i) => (
              <span
                key={s + i}
                className={cn("jd-chip", i === moon.nakshatra.pada - 1 ? "jd-chip-gold" : "jd-chip-neutral")}
              >
                {view.babyNames.syllables.tamil[i]} · {s}
              </span>
            ))}
            <span className="jd-label ml-auto">
              {l("luckyTotals", lang)}: {view.babyNames.luckyTotals.slice(0, 8).join(", ")}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { heading: l("boys", lang), names: view.babyNames.boys },
              { heading: l("girls", lang), names: view.babyNames.girls },
            ].map((group) => (
              <div key={group.heading}>
                <p className="jd-label mb-1.5">{group.heading}</p>
                <table className="jd-table">
                  <tbody>
                    {group.names.map((n) => (
                      <tr key={n.name}>
                        <td className="font-semibold">
                          {n.name} <span className="font-normal text-[var(--jd-ink-soft)]">{n.tamil}</span>
                        </td>
                        <td className="text-[10px] text-[var(--jd-ink-soft)]">{n.meaning}</td>
                        <td className="text-right">
                          <span className={cn("jd-chip", n.isLucky ? "jd-chip-gold" : "jd-chip-neutral")}>{n.chaldeanTotal}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[9.5px] leading-4 text-[var(--jd-ink-soft)]">
            {l("chaldeanNote", lang).replace("{p}", String(view.numerology.psychicNumber)).replace("{d}", String(view.numerology.destinyNumber))}
          </p>
        </div>
      </Section>

      {/* ---- Narrative summary ---- */}
      <Section title={l("summary", lang)} className={isFull ? undefined : "mb-2"}>
        <div className="jd-card jd-soft p-4">
          <h3 className="mb-1.5 text-[13px] font-bold text-[var(--jd-royal-deep)]">{view.narrative.headline}</h3>
          {headlineSection && <p className="text-[11.5px] leading-5 text-[var(--jd-ink)]">{headlineSection.body}</p>}
        </div>
      </Section>

      {/* ---- Full-depth extras ---- */}
      {isFull && (
        <>
          <Section title={l("dashaTimeline", lang)} className="astro-page-break">
            <div className="jd-card overflow-x-auto p-2">
              <table className="jd-table">
                <thead>
                  <tr>
                    <th>{l("ageL", lang)}</th>
                    <th>{l("mahaL", lang)}</th>
                    <th>{l("antarL", lang)}</th>
                    <th>{l("themeL", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {view.ageBands.map((band) => (
                    <tr key={band.fromAge}>
                      <td>
                        {band.fromAge}–{band.toAge}
                      </td>
                      <td className="font-semibold">{lv(lang, band.mahaLord)}</td>
                      <td>{lv(lang, band.antarLord)}</td>
                      <td className="text-[10px] text-[var(--jd-ink-soft)]">{DASHA_THEMES_L[band.mahaLord as PlanetName]?.[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {remainingSections.length > 0 && (
            <Section title={l("inDepth", lang)}>
              <div className="flex flex-col gap-3">
                {remainingSections.map((s) => (
                  <div key={s.heading} className="jd-card p-4">
                    <h3 className="mb-1 text-[12px] font-bold text-[var(--jd-royal-deep)]">{s.heading}</h3>
                    <p className="text-[11px] leading-5 text-[var(--jd-ink)]">{s.body}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </>
      )}

      {/* ---- Footer ---- */}
      <footer className="mt-6 border-t border-[var(--jd-hairline)] pt-3 text-center">
        <p className="text-[9.5px] leading-4 text-[var(--jd-ink-soft)]">
          Drik (astronomical) ephemeris · {AYANAMSA_NAMES[view.system]} ayanamsa {view.ayanamsaUsed.toFixed(2)}° · Vimshottari dasha · Chaldean numerology.
          {view.system === "VAKYA" && " Note: classical Vakya tables are not machine-computable; positions use the modern Drik method."}{" "}
          {l("footerDisclaimer", lang)}
        </p>
        <p className="jd-kicker mt-2">✦ சுபம் ✦</p>
      </footer>
    </article>
  );
}
