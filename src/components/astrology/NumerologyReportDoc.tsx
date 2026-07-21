import { DateTime } from "luxon";
import type { FullNumerologyProfile, NameAnalysis } from "@/lib/astrology/numerology";
import { NUMBER_TEXTS } from "@/lib/astrology/numerologyTexts";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import { cn } from "@/lib/cn";

const L: Record<string, Record<AstrologyLanguage, string>> = {
  kicker: { en: "MyLoginn Astrology · Numerology", ta: "மைலாகின் ஜோதிடம் · எண் கணிதம்", hi: "माईलॉगिन ज्योतिष · अंक ज्योतिष", te: "మైలాగిన్ జ్యోతిష్యం · సంఖ్యా శాస్త్రం", ml: "മൈലോഗിൻ ജ്യോതിഷം · സംഖ്യാശാസ്ത്രം" },
  title: { en: "Numerology Report", ta: "எண் கணித அறிக்கை", hi: "अंक ज्योतिष रिपोर्ट", te: "సంఖ్యా శాస్త్ర నివేదిక", ml: "സംഖ്യാശാസ്ത്ര റിപ്പോർട്ട്" },
  coreTitle: { en: "Core Numbers", ta: "முக்கிய எண்கள்", hi: "मुख्य अंक", te: "ముఖ్య సంఖ్యలు", ml: "പ്രധാന സംഖ്യകൾ" },
  psychic: { en: "Psychic (Moolank)", ta: "மன எண் (மூலாங்கம்)", hi: "मूलांक", te: "మూలాంకం", ml: "മൂലാങ്കം" },
  lifePath: { en: "Life Path / Destiny", ta: "விதி எண் (பாக்கியாங்கம்)", hi: "भाग्यांक", te: "భాగ్యాంకం", ml: "ഭാഗ്യാങ്കം" },
  nameNumber: { en: "Name number", ta: "பெயர் எண்", hi: "नामांक", te: "నామాంకం", ml: "നാമാങ്കം" },
  soul: { en: "Soul number", ta: "ஆன்மா எண்", hi: "आत्मांक", te: "ఆత్మ సంఖ్య", ml: "ആത്മ സംഖ്യ" },
  personality: { en: "Personality number", ta: "ஆளுமை எண்", hi: "व्यक्तित्व अंक", te: "వ్యక్తిత్వ సంఖ్య", ml: "വ്യക്തിത്വ സംഖ്യ" },
  planet: { en: "Ruling planet", ta: "ஆளும் கிரகம்", hi: "स्वामी ग्रह", te: "అధిపతి గ్రహం", ml: "അധിപ ഗ്രഹം" },
  luckyTitle: { en: "Lucky Elements", ta: "அதிர்ஷ்ட கூறுகள்", hi: "शुभ तत्व", te: "అదృష్ట అంశాలు", ml: "ഭാഗ്യ ഘടകങ്ങൾ" },
  luckyNumbers: { en: "Lucky numbers", ta: "அதிர்ஷ்ட எண்கள்", hi: "शुभ अंक", te: "అదృష్ట సంఖ్యలు", ml: "ഭാഗ്യ സംഖ്യകൾ" },
  luckyDates: { en: "Lucky dates (any month)", ta: "அதிர்ஷ்ட தேதிகள் (எந்த மாதமும்)", hi: "शुभ तिथियां (किसी भी माह)", te: "అదృష్ట తేదీలు (ఏ నెలలోనైనా)", ml: "ഭാഗ്യ തീയതികൾ (ഏത് മാസത്തിലും)" },
  luckyDays: { en: "Lucky days", ta: "அதிர்ஷ்ட நாட்கள்", hi: "शुभ दिन", te: "అదృష్ట రోజులు", ml: "ഭാഗ്യ ദിനങ്ങൾ" },
  luckyColors: { en: "Lucky colors", ta: "அதிர்ஷ்ட நிறங்கள்", hi: "शुभ रंग", te: "అదృష్ట రంగులు", ml: "ഭാഗ്യ നിറങ്ങൾ" },
  friendly: { en: "Compatible numbers", ta: "பொருந்தும் எண்கள்", hi: "अनुकूल अंक", te: "అనుకూల సంఖ్యలు", ml: "അനുകൂല സംഖ്യകൾ" },
  readingsTitle: { en: "Readings", ta: "பலன்கள்", hi: "फलादेश", te: "ఫలితాలు", ml: "ഫലങ്ങൾ" },
  essence: { en: "Essence", ta: "இயல்பு", hi: "स्वभाव", te: "స్వభావం", ml: "സ്വഭാവം" },
  career: { en: "Career", ta: "தொழில்", hi: "करियर", te: "వృత్తి", ml: "കരിയർ" },
  business: { en: "Business", ta: "வணிகம்", hi: "व्यापार", te: "వ్యాపారం", ml: "ബിസിനസ്" },
  marriage: { en: "Marriage compatibility", ta: "திருமண பொருத்தம்", hi: "विवाह अनुकूलता", te: "వివాహ పొంతన", ml: "വിവാഹ പൊരുത്തം" },
  health: { en: "Health", ta: "ஆரோக்கியம்", hi: "स्वास्थ्य", te: "ఆరోగ్యం", ml: "ആരോഗ്യം" },
  generated: { en: "Generated", ta: "உருவாக்கப்பட்டது", hi: "निर्मित", te: "రూపొందించబడింది", ml: "തയ്യാറാക്കിയത്" },
  name: { en: "Name", ta: "பெயர்", hi: "नाम", te: "పేరు", ml: "പേര്" },
  dob: { en: "Date of birth", ta: "பிறந்த தேதி", hi: "जन्म तिथि", te: "పుట్టిన తేదీ", ml: "ജനന തീയതി" },
  compareTitle: { en: "Name Comparison", ta: "பெயர் ஒப்பீடு", hi: "नाम तुलना", te: "పేర్ల పోలిక", ml: "പേരുകളുടെ താരതമ്യം" },
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
  },
};

const l = (key: string, lang: AstrologyLanguage) => L[key]?.[lang] ?? L[key]?.en ?? key;

const PLANET_L: Record<string, Record<AstrologyLanguage, string>> = {
  Sun: { en: "Sun", ta: "சூரியன்", hi: "सूर्य", te: "సూర్యుడు", ml: "സൂര്യൻ" },
  Moon: { en: "Moon", ta: "சந்திரன்", hi: "चंद्र", te: "చంద్రుడు", ml: "ചന്ദ്രൻ" },
  Mars: { en: "Mars", ta: "செவ்வாய்", hi: "मंगल", te: "కుజుడు", ml: "ചൊവ്വ" },
  Mercury: { en: "Mercury", ta: "புதன்", hi: "बुध", te: "బుధుడు", ml: "ബുധൻ" },
  Jupiter: { en: "Jupiter", ta: "குரு", hi: "बृहस्पति", te: "గురువు", ml: "വ്യാഴം" },
  Venus: { en: "Venus", ta: "சுக்கிரன்", hi: "शुक्र", te: "శుక్రుడు", ml: "ശുക്രൻ" },
  Saturn: { en: "Saturn", ta: "சனி", hi: "शनि", te: "శని", ml: "ശനി" },
  Rahu: { en: "Rahu", ta: "ராகு", hi: "राहु", te: "రాహువు", ml: "രാഹു" },
  Ketu: { en: "Ketu", ta: "கேது", hi: "केतु", te: "కేతువు", ml: "കേതു" },
};

const DAY_L: Record<string, Record<AstrologyLanguage, string>> = {
  Sunday: { en: "Sunday", ta: "ஞாயிறு", hi: "रविवार", te: "ఆదివారం", ml: "ഞായർ" },
  Monday: { en: "Monday", ta: "திங்கள்", hi: "सोमवार", te: "సోమవారం", ml: "തിങ്കൾ" },
  Tuesday: { en: "Tuesday", ta: "செவ்வாய்", hi: "मंगलवार", te: "మంగళవారం", ml: "ചൊവ്വ" },
  Wednesday: { en: "Wednesday", ta: "புதன்", hi: "बुधवार", te: "బుధవారం", ml: "ബുധൻ" },
  Thursday: { en: "Thursday", ta: "வியாழன்", hi: "गुरुवार", te: "గురువారం", ml: "വ്യാഴം" },
  Friday: { en: "Friday", ta: "வெள்ளி", hi: "शुक्रवार", te: "శుక్రవారం", ml: "വെള്ളി" },
  Saturday: { en: "Saturday", ta: "சனி", hi: "शनिवार", te: "శనివారం", ml: "ശനി" },
};

/** LUCKY_COLORS strings localized by root number, so non-English reports never show English color names. */
const COLOR_L: Record<number, Record<AstrologyLanguage, string>> = {
  1: { en: "Gold / Orange", ta: "தங்கம் / ஆரஞ்சு", hi: "स्वर्ण / नारंगी", te: "బంగారు / నారింజ", ml: "സ്വർണം / ഓറഞ്ച്" },
  2: { en: "White / Cream", ta: "வெள்ளை / கிரீம்", hi: "श्वेत / क्रीम", te: "తెలుపు / క్రీమ్", ml: "വെള്ള / ക്രീം" },
  3: { en: "Yellow / Purple", ta: "மஞ்சள் / ஊதா", hi: "पीला / बैंगनी", te: "పసుపు / ఊదా", ml: "മഞ്ഞ / പർപ്പിൾ" },
  4: { en: "Grey / Electric blue", ta: "சாம்பல் / மின் நீலம்", hi: "धूसर / चमकीला नीला", te: "బూడిద / మెరుపు నీలం", ml: "ചാരനിറം / തിളക്ക നീല" },
  5: { en: "Emerald green", ta: "மரகத பச்சை", hi: "पन्ना हरा", te: "మరకత ఆకుపచ్చ", ml: "മരതക പച്ച" },
  6: { en: "Blue / Pink", ta: "நீலம் / இளஞ்சிவப்பு", hi: "नीला / गुलाबी", te: "నీలం / గులాబీ", ml: "നീല / പിങ്ക്" },
  7: { en: "Sea green / White", ta: "கடல் பச்சை / வெள்ளை", hi: "समुद्री हरा / श्वेत", te: "సముద్రపు ఆకుపచ్చ / తెలుపు", ml: "കടൽപ്പച്ച / വെള്ള" },
  8: { en: "Dark blue / Black", ta: "அடர் நீலம் / கருப்பு", hi: "गहरा नीला / काला", te: "ముదురు నీలం / నలుపు", ml: "കടും നീല / കറുപ്പ്" },
  9: { en: "Red / Crimson", ta: "சிவப்பு / செம்மை", hi: "लाल / रक्तिम", te: "ఎరుపు / రక్తవర్ణం", ml: "ചുവപ്പ് / രക്തവർണം" },
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
  printMode = false,
}: {
  fullName: string;
  birthDate: string; // yyyy-MM-dd
  profile: FullNumerologyProfile;
  language: AstrologyLanguage;
  compare?: NameAnalysis[];
  printMode?: boolean;
}) {
  const lang = language;
  const dob = DateTime.fromISO(birthDate);

  const readings = [
    { key: "essence", number: profile.psychicNumber, text: NUMBER_TEXTS[profile.psychicNumber]?.essence[lang] },
    { key: "career", number: profile.destinyNumber, text: NUMBER_TEXTS[profile.destinyNumber]?.career[lang] },
    { key: "business", number: profile.nameNumber, text: NUMBER_TEXTS[profile.nameNumber]?.business[lang] },
    { key: "marriage", number: profile.destinyNumber, text: NUMBER_TEXTS[profile.destinyNumber]?.marriage[lang] },
    { key: "health", number: profile.psychicNumber, text: NUMBER_TEXTS[profile.psychicNumber]?.health[lang] },
  ].filter((r) => r.text);

  const luckyColors = [...new Set([profile.psychicNumber, profile.destinyNumber])]
    .map((n) => COLOR_L[n]?.[lang])
    .filter(Boolean);

  return (
    <article className={cn("jathagam-doc astro-print-page rounded-2xl", printMode ? "shadow-none" : "p-8 shadow-[0_10px_50px_rgba(16,29,58,0.12)] sm:p-10")}>
      <header className="mb-6 border-b-2 border-[var(--jd-gold-bright)] pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="jd-kicker">{l("kicker", lang)}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--jd-royal-deep)]">
              {l("title", lang)} — {fullName}
            </h1>
          </div>
          <div className="text-right text-[10px] leading-4 text-[var(--jd-ink-soft)]">
            <p>
              {l("generated", lang)} · {DateTime.now().toFormat("dd MMM yyyy")}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="jd-chip jd-chip-neutral">{l("name", lang)}: {fullName}</span>
          <span className="jd-chip jd-chip-neutral">{l("dob", lang)}: {dob.toFormat("dd MMM yyyy")}</span>
          <span className="jd-chip jd-chip-gold">{profile.psychicNumber} · {profile.destinyNumber} · {profile.nameNumber}</span>
        </div>
      </header>

      <section className="astro-report-section mb-5">
        <h2 className="jd-section-title mb-2.5">{l("coreTitle", lang)}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <CoreNumber label={l("psychic", lang)} value={profile.psychicNumber} planet={profile.rulingPlanets.psychic} lang={lang} />
          <CoreNumber label={l("lifePath", lang)} value={profile.lifePathNumber} planet={profile.rulingPlanets.destiny} lang={lang} />
          <CoreNumber label={l("nameNumber", lang)} value={profile.nameNumber} lang={lang} />
          <CoreNumber label={l("soul", lang)} value={profile.soulNumber} lang={lang} />
          <CoreNumber label={l("personality", lang)} value={profile.personalityNumber} lang={lang} />
        </div>
      </section>

      <section className="astro-report-section mb-5">
        <h2 className="jd-section-title mb-2.5">{l("luckyTitle", lang)}</h2>
        <div className="jd-card jd-soft grid grid-cols-1 gap-x-4 gap-y-2.5 p-4 sm:grid-cols-2">
          <div><p className="jd-label">{l("luckyNumbers", lang)}</p><p className="jd-value">{profile.luckyNumbers.join(", ")}</p></div>
          <div><p className="jd-label">{l("friendly", lang)}</p><p className="jd-value">{profile.friendlyNumbers.join(", ")}</p></div>
          <div><p className="jd-label">{l("luckyDates", lang)}</p><p className="jd-value">{profile.luckyDates.join(", ")}</p></div>
          <div><p className="jd-label">{l("luckyDays", lang)}</p><p className="jd-value">{profile.luckyDays.map((d) => DAY_L[d]?.[lang] ?? d).join(", ")}</p></div>
          <div className="sm:col-span-2"><p className="jd-label">{l("luckyColors", lang)}</p><p className="jd-value">{luckyColors.join(" · ")}</p></div>
        </div>
      </section>

      <section className="astro-report-section mb-5">
        <h2 className="jd-section-title mb-2.5">{l("readingsTitle", lang)}</h2>
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
      </section>

      {compare.length > 0 && (
        <section className="astro-report-section mb-5">
          <h2 className="jd-section-title mb-2.5">{l("compareTitle", lang)}</h2>
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
                      <span className={cn("jd-chip", n.isLucky ? "jd-chip-gold" : "jd-chip-neutral")}>{n.isLucky ? "✦" : "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-[9.5px] leading-4 text-[var(--jd-ink-soft)]">{l("compareHint", lang)}</p>
        </section>
      )}

      <footer className="mt-6 border-t border-[var(--jd-hairline)] pt-3 text-[10px] leading-4 text-[var(--jd-ink-soft)]">
        <p>{l("method", lang)}</p>
      </footer>
    </article>
  );
}
