import { computeTropicalAscendant } from "./ephemeris";
import { toSidereal } from "./ayanamsa";
import { rashiFromSidereal, nakshatraFromSidereal } from "./panchanga";
import type { RashiInfo, NakshatraInfo } from "./constants";
import type { AstrologyLanguage } from "./i18n";

/** Short chart-cell abbreviation for Mandi/Gulika, matching the 2-3 letter style of PLANET_ABBR_L. */
export const MANDI_ABBR: Record<AstrologyLanguage, string> = {
  en: "Md",
  ta: "மாந்",
  hi: "मां",
  te: "మాం",
  ml: "മാ",
  kn: "ಮಾಂ",
  bn: "মান",
  mr: "मां",
  gu: "માં",
  pa: "ਮਾਂ",
  ur: "مند",
};

/**
 * Mandi (Gulika/Maandi) — the upagraha classically placed by taking the ascendant
 * degree rising at the moment its ruling eighth of the day begins (already computed
 * as `muhurta.gulikai.start` in muhurta.ts). Same ascendant formula as the main chart,
 * evaluated at a different instant, then run through the standard rashi/nakshatra/house lookups.
 */
export type MandiPosition = {
  siderealLongitude: number;
  rashi: RashiInfo;
  nakshatra: NakshatraInfo & { pada: number; fractionElapsed: number };
  houseFromAscendant: number;
};

function houseOf(rashiIndex: number, ascendantRashiIndex: number): number {
  return ((rashiIndex - ascendantRashiIndex + 12) % 12) + 1;
}

export function computeMandi(params: {
  gulikaStartIso: string;
  latitude: number;
  longitude: number;
  ayanamsaUsed: number;
  ascendantRashiIndex: number;
}): MandiPosition {
  const at = new Date(params.gulikaStartIso);
  const tropicalLongitude = computeTropicalAscendant(at, params.latitude, params.longitude);
  const siderealLongitude = toSidereal(tropicalLongitude, params.ayanamsaUsed);
  const rashi = rashiFromSidereal(siderealLongitude);

  return {
    siderealLongitude,
    rashi,
    nakshatra: nakshatraFromSidereal(siderealLongitude),
    houseFromAscendant: houseOf(rashi.index, params.ascendantRashiIndex),
  };
}

/** Classical per-house Mandi themes — bilingual, one line each, in the same measured tone as the dosha explanations. */
export const MANDI_HOUSE_THEME: Record<number, { en: string; ta: string }> = {
  1: { en: "Health and temperament need steady self-care; guard against lethargy.", ta: "உடல்நலம் மற்றும் மனநிலையில் தொடர்ச்சியான கவனம் தேவை; சோம்பலை தவிர்க்கவும்." },
  2: { en: "Family finances and speech benefit from patience and careful planning.", ta: "குடும்ப நிதி மற்றும் பேச்சில் பொறுமையும் திட்டமிடலும் நன்மை தரும்." },
  3: { en: "Courage and sibling bonds grow through quiet, sustained effort.", ta: "துணிச்சலும் உடன்பிறப்பு உறவும் அமைதியான, தொடர்ச்சியான முயற்சியால் வளரும்." },
  4: { en: "Home and inner peace call for deliberate, unhurried decisions.", ta: "வீடும் மன அமைதியும் அவசரமில்லாத, சிந்தித்த முடிவுகளை கோருகின்றன." },
  5: { en: "Intellect and children's matters favour careful, methodical planning.", ta: "அறிவும் குழந்தைகள் விஷயங்களும் கவனமான, முறையான திட்டமிடலை விரும்புகின்றன." },
  6: { en: "A naturally strong placement against rivals, debts, and illness.", ta: "எதிரிகள், கடன், நோய் ஆகியவற்றுக்கு எதிராக இயற்கையாகவே வலுவான அமைவு." },
  7: { en: "Partnerships mature slowly; avoid rushing major relationship decisions.", ta: "கூட்டாண்மைகள் மெதுவாக முதிர்ச்சியடையும்; முக்கிய உறவு முடிவுகளில் அவசரப்பட வேண்டாம்." },
  8: { en: "Longevity and transformation themes call for a calm, disciplined routine.", ta: "ஆயுள் மற்றும் மாற்ற தலைப்புகளுக்கு அமைதியான, ஒழுங்குபடுத்தப்பட்ட வழக்கம் தேவை." },
  9: { en: "Fortune and faith deepen through steady, traditional practice rather than shortcuts.", ta: "அதிர்ஷ்டமும் நம்பிக்கையும் குறுக்குவழிகளை விட நிலையான, பாரம்பரிய பயிற்சியால் ஆழமடையும்." },
  10: { en: "Career progress rewards patient, methodical effort over quick wins.", ta: "தொழில் முன்னேற்றம் விரைவான வெற்றியை விட பொறுமையான, முறையான முயற்சியை பரிசளிக்கும்." },
  11: { en: "Gains and networks build gradually through consistent, honest dealing.", ta: "லாபமும் தொடர்புகளும் நேர்மையான, தொடர்ச்சியான நடத்தை மூலம் படிப்படியாக வளரும்." },
  12: { en: "A reflective placement well suited to spiritual practice and quiet retreat.", ta: "ஆன்மீக பயிற்சிக்கும் அமைதியான தனிமைக்கும் ஏற்ற சிந்தனையான அமைவு." },
};
