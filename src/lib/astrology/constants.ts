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
  element: "Fire" | "Earth" | "Air" | "Water";
  lord: PlanetName;
};

export const RASHIS: RashiInfo[] = [
  { index: 0, english: "Aries", sanskrit: "Mesha", tamil: "மேஷம்", hindi: "मेष", telugu: "మేషం", malayalam: "മേടം", element: "Fire", lord: "Mars" },
  { index: 1, english: "Taurus", sanskrit: "Vrishabha", tamil: "ரிஷபம்", hindi: "वृषभ", telugu: "వృషభం", malayalam: "ഇടവം", element: "Earth", lord: "Venus" },
  { index: 2, english: "Gemini", sanskrit: "Mithuna", tamil: "மிதுனம்", hindi: "मिथुन", telugu: "మిథునం", malayalam: "മിഥുനം", element: "Air", lord: "Mercury" },
  { index: 3, english: "Cancer", sanskrit: "Karka", tamil: "கடகம்", hindi: "कर्क", telugu: "కర్కాటకం", malayalam: "കർക്കടകം", element: "Water", lord: "Moon" },
  { index: 4, english: "Leo", sanskrit: "Simha", tamil: "சிம்மம்", hindi: "सिंह", telugu: "సింహం", malayalam: "ചിങ്ങം", element: "Fire", lord: "Sun" },
  { index: 5, english: "Virgo", sanskrit: "Kanya", tamil: "கன்னி", hindi: "कन्या", telugu: "కన్య", malayalam: "കന്നി", element: "Earth", lord: "Mercury" },
  { index: 6, english: "Libra", sanskrit: "Tula", tamil: "துலாம்", hindi: "तुला", telugu: "తుల", malayalam: "തുലാം", element: "Air", lord: "Venus" },
  { index: 7, english: "Scorpio", sanskrit: "Vrischika", tamil: "விருச்சிகம்", hindi: "वृश्चिक", telugu: "వృశ్చికం", malayalam: "വൃശ്ചികം", element: "Water", lord: "Mars" },
  { index: 8, english: "Sagittarius", sanskrit: "Dhanu", tamil: "தனுசு", hindi: "धनु", telugu: "ధనుస్సు", malayalam: "ധനു", element: "Fire", lord: "Jupiter" },
  { index: 9, english: "Capricorn", sanskrit: "Makara", tamil: "மகரம்", hindi: "मकर", telugu: "మకరం", malayalam: "മകരം", element: "Earth", lord: "Saturn" },
  { index: 10, english: "Aquarius", sanskrit: "Kumbha", tamil: "கும்பம்", hindi: "कुंभ", telugu: "కుంభం", malayalam: "കുംഭം", element: "Air", lord: "Saturn" },
  { index: 11, english: "Pisces", sanskrit: "Meena", tamil: "மீனம்", hindi: "मीन", telugu: "మీనం", malayalam: "മീനം", element: "Water", lord: "Jupiter" },
];

export type NakshatraInfo = {
  index: number; // 0-26
  english: string;
  tamil: string;
  hindi: string;
  telugu: string;
  malayalam: string;
  lord: PlanetName;
};

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0, english: "Ashwini", tamil: "அசுவினி", hindi: "अश्विनी", telugu: "అశ్విని", malayalam: "അശ്വതി", lord: "Ketu" },
  { index: 1, english: "Bharani", tamil: "பரணி", hindi: "भरणी", telugu: "భరణి", malayalam: "ഭരണി", lord: "Venus" },
  { index: 2, english: "Krittika", tamil: "கார்த்திகை", hindi: "कृत्तिका", telugu: "కృత్తిక", malayalam: "കാർത്തിക", lord: "Sun" },
  { index: 3, english: "Rohini", tamil: "ரோகிணி", hindi: "रोहिणी", telugu: "రోహిణి", malayalam: "രോഹിണി", lord: "Moon" },
  { index: 4, english: "Mrigashira", tamil: "மிருகசீரிஷம்", hindi: "मृगशिरा", telugu: "మృగశిర", malayalam: "മകയിരം", lord: "Mars" },
  { index: 5, english: "Ardra", tamil: "திருவாதிரை", hindi: "आर्द्रा", telugu: "ఆరుద్ర", malayalam: "തിരുവാതിര", lord: "Rahu" },
  { index: 6, english: "Punarvasu", tamil: "புனர்பூசம்", hindi: "पुनर्वसु", telugu: "పునర్వసు", malayalam: "പുണർതം", lord: "Jupiter" },
  { index: 7, english: "Pushya", tamil: "பூசம்", hindi: "पुष्य", telugu: "పుష్యమి", malayalam: "പൂയം", lord: "Saturn" },
  { index: 8, english: "Ashlesha", tamil: "ஆயில்யம்", hindi: "आश्लेषा", telugu: "ఆశ్లేష", malayalam: "ആയില്യം", lord: "Mercury" },
  { index: 9, english: "Magha", tamil: "மகம்", hindi: "मघा", telugu: "మఖ", malayalam: "മകം", lord: "Ketu" },
  { index: 10, english: "Purva Phalguni", tamil: "பூரம்", hindi: "पूर्वा फाल्गुनी", telugu: "పుబ్బ", malayalam: "പൂരം", lord: "Venus" },
  { index: 11, english: "Uttara Phalguni", tamil: "உத்திரம்", hindi: "उत्तरा फाल्गुनी", telugu: "ఉత్తర", malayalam: "ഉത്രം", lord: "Sun" },
  { index: 12, english: "Hasta", tamil: "அஸ்தம்", hindi: "हस्त", telugu: "హస్త", malayalam: "അത്തം", lord: "Moon" },
  { index: 13, english: "Chitra", tamil: "சித்திரை", hindi: "चित्रा", telugu: "చిత్త", malayalam: "ചിത്തിര", lord: "Mars" },
  { index: 14, english: "Swati", tamil: "சுவாதி", hindi: "स्वाति", telugu: "స్వాతి", malayalam: "ചോതി", lord: "Rahu" },
  { index: 15, english: "Vishakha", tamil: "விசாகம்", hindi: "विशाखा", telugu: "విశాఖ", malayalam: "വിശാഖം", lord: "Jupiter" },
  { index: 16, english: "Anuradha", tamil: "அனுஷம்", hindi: "अनुराधा", telugu: "అనూరాధ", malayalam: "അനിഴം", lord: "Saturn" },
  { index: 17, english: "Jyeshtha", tamil: "கேட்டை", hindi: "ज्येष्ठा", telugu: "జ్యేష్ఠ", malayalam: "തൃക്കേട്ട", lord: "Mercury" },
  { index: 18, english: "Mula", tamil: "மூலம்", hindi: "मूल", telugu: "మూల", malayalam: "മൂലം", lord: "Ketu" },
  { index: 19, english: "Purva Ashadha", tamil: "பூராடம்", hindi: "पूर्वाषाढ़ा", telugu: "పూర్వాషాఢ", malayalam: "പൂരാടം", lord: "Venus" },
  { index: 20, english: "Uttara Ashadha", tamil: "உத்திராடம்", hindi: "उत्तराषाढ़ा", telugu: "ఉత్తరాషాఢ", malayalam: "ഉത്രാടം", lord: "Sun" },
  { index: 21, english: "Shravana", tamil: "திருவோணம்", hindi: "श्रवण", telugu: "శ్రవణం", malayalam: "തിരുവോണം", lord: "Moon" },
  { index: 22, english: "Dhanishta", tamil: "அவிட்டம்", hindi: "धनिष्ठा", telugu: "ధనిష్ఠ", malayalam: "അവിട്ടം", lord: "Mars" },
  { index: 23, english: "Shatabhisha", tamil: "சதயம்", hindi: "शतभिषा", telugu: "శతభిషం", malayalam: "ചതയം", lord: "Rahu" },
  { index: 24, english: "Purva Bhadrapada", tamil: "பூரட்டாதி", hindi: "पूर्वाभाद्रपद", telugu: "పూర్వాభాద్ర", malayalam: "പൂരുരുട്ടാതി", lord: "Jupiter" },
  { index: 25, english: "Uttara Bhadrapada", tamil: "உத்திரட்டாதி", hindi: "उत्तराभाद्रपद", telugu: "ఉత్తరాభాద్ర", malayalam: "ഉത്രട്ടാതി", lord: "Saturn" },
  { index: 26, english: "Revati", tamil: "ரேவதி", hindi: "रेवती", telugu: "రేవతి", malayalam: "രേവതി", lord: "Mercury" },
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
