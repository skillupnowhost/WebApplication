export type PlanetName = "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Rahu" | "Ketu";

export const NAVAGRAHA: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

export const PLANET_ABBR: Record<PlanetName, string> = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
};

export type RashiInfo = {
  index: number; // 0-11, 0 = Aries
  english: string;
  sanskrit: string;
  tamil: string;
  hindi: string;
  telugu: string;
  malayalam: string;
  kannada: string;
  bengali: string;
  marathi: string;
  gujarati: string;
  punjabi: string;
  urdu: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  lord: PlanetName;
};

export const RASHIS: RashiInfo[] = [
  { index: 0, english: "Aries", sanskrit: "Mesha", tamil: "மேஷம்", hindi: "मेष", telugu: "మేషం", malayalam: "മേടം", kannada: "ಮೇಷ", bengali: "মেষ", marathi: "मेष", gujarati: "મેષ", punjabi: "ਮੇਖ", urdu: "حمل", element: "Fire", lord: "Mars" },
  { index: 1, english: "Taurus", sanskrit: "Vrishabha", tamil: "ரிஷபம்", hindi: "वृषभ", telugu: "వృషభం", malayalam: "ഇടവം", kannada: "ವೃಷಭ", bengali: "বৃষ", marathi: "वृषभ", gujarati: "વૃષભ", punjabi: "ਬ੍ਰਿਖ", urdu: "ثور", element: "Earth", lord: "Venus" },
  { index: 2, english: "Gemini", sanskrit: "Mithuna", tamil: "மிதுனம்", hindi: "मिथुन", telugu: "మిథునం", malayalam: "മിഥുനം", kannada: "ಮಿಥುನ", bengali: "মিথুন", marathi: "मिथुन", gujarati: "મિથુન", punjabi: "ਮਿਥੁਨ", urdu: "جوزا", element: "Air", lord: "Mercury" },
  { index: 3, english: "Cancer", sanskrit: "Karka", tamil: "கடகம்", hindi: "कर्क", telugu: "కర్కాటకం", malayalam: "കർക്കടകം", kannada: "ಕರ್ಕಾಟಕ", bengali: "কর্কট", marathi: "कर्क", gujarati: "કર્ક", punjabi: "ਕਰਕ", urdu: "سرطان", element: "Water", lord: "Moon" },
  { index: 4, english: "Leo", sanskrit: "Simha", tamil: "சிம்மம்", hindi: "सिंह", telugu: "సింహం", malayalam: "ചിങ്ങം", kannada: "ಸಿಂಹ", bengali: "সিংহ", marathi: "सिंह", gujarati: "સિંહ", punjabi: "ਸਿੰਘ", urdu: "اسد", element: "Fire", lord: "Sun" },
  { index: 5, english: "Virgo", sanskrit: "Kanya", tamil: "கன்னி", hindi: "कन्या", telugu: "కన్య", malayalam: "കന്നി", kannada: "ಕನ್ಯಾ", bengali: "কন্যা", marathi: "कन्या", gujarati: "કન્યા", punjabi: "ਕੰਨਿਆ", urdu: "سنبلہ", element: "Earth", lord: "Mercury" },
  { index: 6, english: "Libra", sanskrit: "Tula", tamil: "துலாம்", hindi: "तुला", telugu: "తుల", malayalam: "തുലാം", kannada: "ತುಲಾ", bengali: "তুলা", marathi: "तूळ", gujarati: "તુલા", punjabi: "ਤੁਲਾ", urdu: "میزان", element: "Air", lord: "Venus" },
  { index: 7, english: "Scorpio", sanskrit: "Vrischika", tamil: "விருச்சிகம்", hindi: "वृश्चिक", telugu: "వృశ్చికం", malayalam: "വൃശ്ചികം", kannada: "ವೃಶ್ಚಿಕ", bengali: "বৃশ্চিক", marathi: "वृश्चिक", gujarati: "વૃશ્ચિક", punjabi: "ਬ੍ਰਿਸਚਿਕ", urdu: "عقرب", element: "Water", lord: "Mars" },
  { index: 8, english: "Sagittarius", sanskrit: "Dhanu", tamil: "தனுசு", hindi: "धनु", telugu: "ధనుస్సు", malayalam: "ധനു", kannada: "ಧನು", bengali: "ধনু", marathi: "धनु", gujarati: "ધન", punjabi: "ਧਨੁ", urdu: "قوس", element: "Fire", lord: "Jupiter" },
  { index: 9, english: "Capricorn", sanskrit: "Makara", tamil: "மகரம்", hindi: "मकर", telugu: "మకరం", malayalam: "മകരം", kannada: "ಮಕರ", bengali: "মকর", marathi: "मकर", gujarati: "મકર", punjabi: "ਮਕਰ", urdu: "جدی", element: "Earth", lord: "Saturn" },
  { index: 10, english: "Aquarius", sanskrit: "Kumbha", tamil: "கும்பம்", hindi: "कुंभ", telugu: "కుంభం", malayalam: "കുംഭം", kannada: "ಕುಂಭ", bengali: "কুম্ভ", marathi: "कुंभ", gujarati: "કુંભ", punjabi: "ਕੁੰਭ", urdu: "دلو", element: "Air", lord: "Saturn" },
  { index: 11, english: "Pisces", sanskrit: "Meena", tamil: "மீனம்", hindi: "मीन", telugu: "మీనం", malayalam: "മീനം", kannada: "ಮೀನ", bengali: "মীন", marathi: "मीन", gujarati: "મીન", punjabi: "ਮੀਨ", urdu: "حوت", element: "Water", lord: "Jupiter" },
];

export type NakshatraInfo = {
  index: number; // 0-26
  english: string;
  tamil: string;
  hindi: string;
  telugu: string;
  malayalam: string;
  kannada: string;
  bengali: string;
  marathi: string;
  gujarati: string;
  punjabi: string;
  urdu: string;
  lord: PlanetName;
};

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0, english: "Ashwini", tamil: "அசுவினி", hindi: "अश्विनी", telugu: "అశ్విని", malayalam: "അശ്വതി", kannada: "ಅಶ್ವಿನಿ", bengali: "অশ্বিনী", marathi: "अश्विनी", gujarati: "અશ્વિની", punjabi: "ਅਸ਼ਵਨੀ", urdu: "اشونی", lord: "Ketu" },
  { index: 1, english: "Bharani", tamil: "பரணி", hindi: "भरणी", telugu: "భరణి", malayalam: "ഭരണി", kannada: "ಭರಣಿ", bengali: "ভরণী", marathi: "भरणी", gujarati: "ભરણી", punjabi: "ਭਰਣੀ", urdu: "بھرنی", lord: "Venus" },
  { index: 2, english: "Krittika", tamil: "கார்த்திகை", hindi: "कृत्तिका", telugu: "కృత్తిక", malayalam: "കാർത്തിക", kannada: "ಕೃತ್ತಿಕಾ", bengali: "কৃত্তিকা", marathi: "कृत्तिका", gujarati: "કૃત્તિકા", punjabi: "ਕ੍ਰਿਤਿਕਾ", urdu: "کرتیکا", lord: "Sun" },
  { index: 3, english: "Rohini", tamil: "ரோகிணி", hindi: "रोहिणी", telugu: "రోహిణి", malayalam: "രോഹിണി", kannada: "ರೋಹಿಣಿ", bengali: "রোহিণী", marathi: "रोहिणी", gujarati: "રોહિણી", punjabi: "ਰੋਹਿਣੀ", urdu: "روہنی", lord: "Moon" },
  { index: 4, english: "Mrigashira", tamil: "மிருகசீரிஷம்", hindi: "मृगशिरा", telugu: "మృగశిర", malayalam: "മകയിരം", kannada: "ಮೃಗಶಿರಾ", bengali: "মৃগশিরা", marathi: "मृगशीर्ष", gujarati: "મૃગશીર્ષ", punjabi: "ਮ੍ਰਿਗਸ਼ਿਰਾ", urdu: "مرگشرا", lord: "Mars" },
  { index: 5, english: "Ardra", tamil: "திருவாதிரை", hindi: "आर्द्रा", telugu: "ఆరుద్ర", malayalam: "തിരുവാതിര", kannada: "ಆರ್ದ್ರಾ", bengali: "আর্দ্রা", marathi: "आर्द्रा", gujarati: "આર્દ્રા", punjabi: "ਆਰਦਰਾ", urdu: "آردرا", lord: "Rahu" },
  { index: 6, english: "Punarvasu", tamil: "புனர்பூசம்", hindi: "पुनर्वसु", telugu: "పునర్వసు", malayalam: "പുണർതം", kannada: "ಪುನರ್ವಸು", bengali: "পুনর্বসু", marathi: "पुनर्वसू", gujarati: "પુનર્વસુ", punjabi: "ਪੁਨਰਵਸੂ", urdu: "پنرواسو", lord: "Jupiter" },
  { index: 7, english: "Pushya", tamil: "பூசம்", hindi: "पुष्य", telugu: "పుష్యమి", malayalam: "പൂയം", kannada: "ಪುಷ್ಯ", bengali: "পুষ্যা", marathi: "पुष्य", gujarati: "પુષ્ય", punjabi: "ਪੁਸ਼ਯ", urdu: "پُشیہ", lord: "Saturn" },
  { index: 8, english: "Ashlesha", tamil: "ஆயில்யம்", hindi: "आश्लेषा", telugu: "ఆశ్లేష", malayalam: "ആയില്യം", kannada: "ಆಶ್ಲೇಷಾ", bengali: "আশ্লেষা", marathi: "आश्लेषा", gujarati: "આશ્લેષા", punjabi: "ਆਸ਼ਲੇਸ਼ਾ", urdu: "اشلیشا", lord: "Mercury" },
  { index: 9, english: "Magha", tamil: "மகம்", hindi: "मघा", telugu: "మఖ", malayalam: "മകം", kannada: "ಮಘಾ", bengali: "মঘা", marathi: "मघा", gujarati: "મઘા", punjabi: "ਮਘਾ", urdu: "مگھا", lord: "Ketu" },
  { index: 10, english: "Purva Phalguni", tamil: "பூரம்", hindi: "पूर्वा फाल्गुनी", telugu: "పుబ్బ", malayalam: "പൂരം", kannada: "ಪೂರ್ವ ಫಲ್ಗುಣಿ", bengali: "পূর্বফাল্গুনী", marathi: "पूर्वा फाल्गुनी", gujarati: "પૂર્વા ફાલ્ગુની", punjabi: "ਪੂਰਵਾ ਫਾਲਗੁਨੀ", urdu: "پوروا پھالگنی", lord: "Venus" },
  { index: 11, english: "Uttara Phalguni", tamil: "உத்திரம்", hindi: "उत्तरा फाल्गुनी", telugu: "ఉత్తర", malayalam: "ഉത്രം", kannada: "ಉತ್ತರ ಫಲ್ಗುಣಿ", bengali: "উত্তরফাল্গুনী", marathi: "उत्तरा फाल्गुनी", gujarati: "ઉત્તરા ફાલ્ગુની", punjabi: "ਉਤਰਾ ਫਾਲਗੁਨੀ", urdu: "اتّرا پھالگنی", lord: "Sun" },
  { index: 12, english: "Hasta", tamil: "அஸ்தம்", hindi: "हस्त", telugu: "హస్త", malayalam: "അത്തം", kannada: "ಹಸ್ತ", bengali: "হস্তা", marathi: "हस्त", gujarati: "હસ્ત", punjabi: "ਹਸਤ", urdu: "ہست", lord: "Moon" },
  { index: 13, english: "Chitra", tamil: "சித்திரை", hindi: "चित्रा", telugu: "చిత్త", malayalam: "ചിത്തിര", kannada: "ಚಿತ್ರಾ", bengali: "চিত্রা", marathi: "चित्रा", gujarati: "ચિત્રા", punjabi: "ਚਿਤਰਾ", urdu: "چترا", lord: "Mars" },
  { index: 14, english: "Swati", tamil: "சுவாதி", hindi: "स्वाति", telugu: "స్వాతి", malayalam: "ചോതി", kannada: "ಸ್ವಾತಿ", bengali: "স্বাতী", marathi: "स्वाती", gujarati: "સ્વાતિ", punjabi: "ਸਵਾਤੀ", urdu: "سواتی", lord: "Rahu" },
  { index: 15, english: "Vishakha", tamil: "விசாகம்", hindi: "विशाखा", telugu: "విశాఖ", malayalam: "വിശാഖം", kannada: "ವಿಶಾಖಾ", bengali: "বিশাখা", marathi: "विशाखा", gujarati: "વિશાખા", punjabi: "ਵਿਸ਼ਾਖਾ", urdu: "وشاکھا", lord: "Jupiter" },
  { index: 16, english: "Anuradha", tamil: "அனுஷம்", hindi: "अनुराधा", telugu: "అనూరాధ", malayalam: "അനിഴം", kannada: "ಅನುರಾಧಾ", bengali: "অনুরাধা", marathi: "अनुराधा", gujarati: "અનુરાધા", punjabi: "ਅਨੁਰਾਧਾ", urdu: "انورادھا", lord: "Saturn" },
  { index: 17, english: "Jyeshtha", tamil: "கேட்டை", hindi: "ज्येष्ठा", telugu: "జ్యేష్ఠ", malayalam: "തൃക്കേട്ട", kannada: "ಜ್ಯೇಷ್ಠಾ", bengali: "জ্যেষ্ঠা", marathi: "ज्येष्ठा", gujarati: "જ્યેષ્ઠા", punjabi: "ਜਯੇਸ਼ਠਾ", urdu: "جیشٹھا", lord: "Mercury" },
  { index: 18, english: "Mula", tamil: "மூலம்", hindi: "मूल", telugu: "మూల", malayalam: "മൂലം", kannada: "ಮೂಲ", bengali: "মূলা", marathi: "मूळ", gujarati: "મૂળ", punjabi: "ਮੂਲ", urdu: "مولا", lord: "Ketu" },
  { index: 19, english: "Purva Ashadha", tamil: "பூராடம்", hindi: "पूर्वाषाढ़ा", telugu: "పూర్వాషాఢ", malayalam: "പൂരാടം", kannada: "ಪೂರ್ವಾಷಾಢ", bengali: "পূর্বাষাঢ়া", marathi: "पूर्वाषाढा", gujarati: "પૂર્વાષાઢા", punjabi: "ਪੂਰਵਾਸ਼ਾਢਾ", urdu: "پوروآشاڈھا", lord: "Venus" },
  { index: 20, english: "Uttara Ashadha", tamil: "உத்திராடம்", hindi: "उत्तराषाढ़ा", telugu: "ఉత్తరాషాఢ", malayalam: "ഉത്രാടം", kannada: "ಉತ್ತರಾಷಾಢ", bengali: "উত্তরাষাঢ়া", marathi: "उत्तराषाढा", gujarati: "ઉત્તરાષાઢા", punjabi: "ਉਤਰਾਸ਼ਾਢਾ", urdu: "اتراآشاڈھا", lord: "Sun" },
  { index: 21, english: "Shravana", tamil: "திருவோணம்", hindi: "श्रवण", telugu: "శ్రవణం", malayalam: "തിരുവോണം", kannada: "ಶ್ರವಣ", bengali: "শ্রবণা", marathi: "श्रावण", gujarati: "શ્રવણ", punjabi: "ਸ਼ਰਵਣ", urdu: "شرون", lord: "Moon" },
  { index: 22, english: "Dhanishta", tamil: "அவிட்டம்", hindi: "धनिष्ठा", telugu: "ధనిష్ఠ", malayalam: "അവിട്ടം", kannada: "ಧನಿಷ್ಠಾ", bengali: "ধনিষ্ঠা", marathi: "धनिष्ठा", gujarati: "ધનિષ્ઠા", punjabi: "ਧਨਿਸ਼ਠਾ", urdu: "دھنشٹھا", lord: "Mars" },
  { index: 23, english: "Shatabhisha", tamil: "சதயம்", hindi: "शतभिषा", telugu: "శతభిషం", malayalam: "ചതയം", kannada: "ಶತಭಿಷ", bengali: "শতভিষা", marathi: "शततारका", gujarati: "શતભિષા", punjabi: "ਸ਼ਤਭਿਸ਼ਾ", urdu: "شتبھشا", lord: "Rahu" },
  { index: 24, english: "Purva Bhadrapada", tamil: "பூரட்டாதி", hindi: "पूर्वाभाद्रपद", telugu: "పూర్వాభాద్ర", malayalam: "പൂരുരുട്ടാതി", kannada: "ಪೂರ್ವಾಭಾದ್ರ", bengali: "পূর্বভাদ্রপদ", marathi: "पूर्वा भाद्रपदा", gujarati: "પૂર્વાભાદ્રપદા", punjabi: "ਪੂਰਵਾਭਾਦ੍ਰਪਦ", urdu: "پوروا بھادرپد", lord: "Jupiter" },
  { index: 25, english: "Uttara Bhadrapada", tamil: "உத்திரட்டாதி", hindi: "उत्तराभाद्रपद", telugu: "ఉత్తరాభాద్ర", malayalam: "ഉത്രട്ടാതി", kannada: "ಉತ್ತರಾಭಾದ್ರ", bengali: "উত্তরভাদ্রপদ", marathi: "उत्तरा भाद्रपदा", gujarati: "ઉત્તરાભાદ્રપદા", punjabi: "ਉਤਰਾਭਾਦ੍ਰਪਦ", urdu: "اتّرا بھادرپد", lord: "Saturn" },
  { index: 26, english: "Revati", tamil: "ரேவதி", hindi: "रेवती", telugu: "రేవతి", malayalam: "രേവതി", kannada: "ರೇವತಿ", bengali: "রেবতী", marathi: "रेवती", gujarati: "રેવતી", punjabi: "ਰੇਵਤੀ", urdu: "ریوتی", lord: "Mercury" },
];

export const NAKSHATRA_LORDS: PlanetName[] = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

export const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami",
  "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
];

export const YOGA_NAMES = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti",
  "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata",
  "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
];

export const KARANA_NAMES_MOVABLE = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];
export const KARANA_NAMES_FIXED = ["Kimstughna", "Shakuni", "Chatushpada", "Naga"];

export const VAARA_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const VAARA_LORDS: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

/** Event types the Shubha Muhurtham finder supports. Kept here (pure data) so client-side validation can import it without pulling in the ephemeris. */
export const MUHURTHAM_EVENTS = [
  "marriage",
  "engagement",
  "griha_pravesam",
  "business_opening",
  "naming_ceremony",
  "education_start",
  "travel",
  "vehicle_purchase",
] as const;

export type MuhurthamEventType = (typeof MUHURTHAM_EVENTS)[number];
