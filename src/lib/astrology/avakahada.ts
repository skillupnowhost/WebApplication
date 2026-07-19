import { GANA_TABLE, YONI_TABLE, NADI_TABLE, VASHYA_GROUP, VARNA_RANK, type Gana, type Nadi, type VashyaGroup } from "./matching";
import { RASHIS, NAKSHATRAS } from "./constants";

/**
 * Avakahada Chakra: the classical per-nakshatra birth attributes (gana, yoni, nadi,
 * rajju, vedha, varna, vashya, bird, element) and the naming syllables of each pada.
 * All tables are standard Vedic/Tamil almanac reference data.
 */

/* ---- Rajju: five body-part groups ---- */
export type Rajju = "Paadha (foot)" | "Thodai (thigh)" | "Vayiru (belly)" | "Kandam (neck)" | "Siras (head)";

const RAJJU_GROUPS: Record<Rajju, number[]> = {
  "Paadha (foot)": [0, 8, 9, 17, 18, 26],
  "Thodai (thigh)": [1, 7, 10, 16, 19, 25],
  "Vayiru (belly)": [2, 6, 11, 15, 20, 24],
  "Kandam (neck)": [3, 5, 12, 14, 21, 23],
  "Siras (head)": [4, 13, 22],
};

export function rajjuOf(nakshatraIndex: number): Rajju {
  for (const [rajju, members] of Object.entries(RAJJU_GROUPS) as [Rajju, number[]][]) {
    if (members.includes(nakshatraIndex)) return rajju;
  }
  return "Paadha (foot)";
}

/* ---- Vedha (mutually afflicting star pairs) ---- */
const VEDHA_PAIRS: number[][] = [
  [0, 17], [1, 16], [2, 15], [3, 14], [5, 21], [6, 20], [7, 19], [8, 18], [9, 26], [10, 25], [11, 24], [12, 23], [4, 22, 13],
];

export function vedhaStarsOf(nakshatraIndex: number): number[] {
  const group = VEDHA_PAIRS.find((pair) => pair.includes(nakshatraIndex));
  return group ? group.filter((i) => i !== nakshatraIndex) : [];
}

/* ---- Panchapakshi bird (by star group and paksha) ---- */
const BIRDS_SHUKLA = ["Vulture", "Owl", "Crow", "Cock", "Peacock"] as const;
const BIRD_GROUP_BOUNDS = [5, 11, 16, 22, 27]; // star-count upper bounds for the five groups

export function birdOf(nakshatraIndex: number, paksha: "Shukla" | "Krishna"): string {
  let group = BIRD_GROUP_BOUNDS.findIndex((bound) => nakshatraIndex < bound);
  if (group === -1) group = 4;
  const birds = paksha === "Shukla" ? BIRDS_SHUKLA : [...BIRDS_SHUKLA].reverse();
  return birds[group];
}

/* ---- Naming syllables per pada (Avakahada Chakra, 27 × 4) ---- */
export const PADA_SYLLABLES: Array<{ latin: string[]; tamil: string[] }> = [
  { latin: ["Chu", "Che", "Cho", "La"], tamil: ["சு", "சே", "சோ", "ல"] },
  { latin: ["Li", "Lu", "Le", "Lo"], tamil: ["லி", "லூ", "லே", "லோ"] },
  { latin: ["A", "E", "U", "Ea"], tamil: ["அ", "இ", "உ", "எ"] },
  { latin: ["O", "Va", "Vi", "Vu"], tamil: ["ஓ", "வ", "வி", "வு"] },
  { latin: ["Ve", "Vo", "Ka", "Ki"], tamil: ["வே", "வோ", "க", "கி"] },
  { latin: ["Ku", "Gha", "Nga", "Chha"], tamil: ["கு", "க", "ங", "ச"] },
  { latin: ["Ke", "Ko", "Ha", "Hi"], tamil: ["கே", "கோ", "ஹ", "ஹி"] },
  { latin: ["Hu", "He", "Ho", "Da"], tamil: ["ஹு", "ஹே", "ஹோ", "ட"] },
  { latin: ["Di", "Du", "De", "Do"], tamil: ["டி", "டு", "டே", "டோ"] },
  { latin: ["Ma", "Mi", "Mu", "Me"], tamil: ["ம", "மி", "மு", "மெ"] },
  { latin: ["Mo", "Ta", "Ti", "Tu"], tamil: ["மோ", "ட", "டி", "டு"] },
  { latin: ["Te", "To", "Pa", "Pi"], tamil: ["டே", "டோ", "ப", "பி"] },
  { latin: ["Pu", "Sha", "Na", "Tha"], tamil: ["பூ", "ஷ", "ண", "ட"] },
  { latin: ["Pe", "Po", "Ra", "Ri"], tamil: ["பே", "போ", "ர", "ரி"] },
  { latin: ["Ru", "Re", "Ro", "Ta"], tamil: ["ரு", "ரே", "ரோ", "த"] },
  { latin: ["Ti", "Tu", "Te", "To"], tamil: ["தி", "தூ", "தே", "தோ"] },
  { latin: ["Na", "Ni", "Nu", "Ne"], tamil: ["ந", "நி", "நு", "நே"] },
  { latin: ["No", "Ya", "Yi", "Yu"], tamil: ["நோ", "ய", "யி", "யூ"] },
  { latin: ["Ye", "Yo", "Bha", "Bhi"], tamil: ["யே", "யோ", "ப", "பி"] },
  { latin: ["Bhu", "Dha", "Pha", "Dhha"], tamil: ["பூ", "தா", "பா", "தா"] },
  { latin: ["Bhe", "Bho", "Ja", "Ji"], tamil: ["பே", "போ", "ஜ", "ஜி"] },
  { latin: ["Ju", "Je", "Jo", "Gha"], tamil: ["ஜு", "ஜே", "ஜோ", "க"] },
  { latin: ["Ga", "Gi", "Gu", "Ge"], tamil: ["க", "கி", "கு", "கே"] },
  { latin: ["Go", "Sa", "Si", "Su"], tamil: ["கோ", "ச", "சி", "சு"] },
  { latin: ["Se", "So", "Da", "Di"], tamil: ["சே", "சோ", "த", "தி"] },
  { latin: ["Du", "Tha", "Jha", "Na"], tamil: ["து", "த", "ஞ", "ந"] },
  { latin: ["De", "Do", "Cha", "Chi"], tamil: ["தே", "தோ", "ச", "சி"] },
];

/* ---- Assembled avakahada profile ---- */
export type AvakahadaProfile = {
  gana: Gana;
  yoniAnimal: string;
  nadi: Nadi;
  rajju: Rajju;
  vedhaStars: string[];
  varna: string;
  vashya: VashyaGroup;
  bird: string;
  element: string;
  nameSyllables: { latin: string[]; tamil: string[] }; // all four padas of the birth star
  birthPadaSyllable: { latin: string; tamil: string };
};

const VARNA_NAMES: Record<number, string> = { 4: "Brahmin", 3: "Kshatriya", 2: "Vaishya", 1: "Shudra" };

export function computeAvakahada(params: {
  moonRashiIndex: number;
  nakshatraIndex: number;
  pada: number; // 1-4
  paksha: "Shukla" | "Krishna";
}): AvakahadaProfile {
  const { moonRashiIndex, nakshatraIndex, pada, paksha } = params;
  const syllables = PADA_SYLLABLES[nakshatraIndex];

  return {
    gana: GANA_TABLE[nakshatraIndex],
    yoniAnimal: YONI_TABLE[nakshatraIndex].animal,
    nadi: NADI_TABLE[nakshatraIndex],
    rajju: rajjuOf(nakshatraIndex),
    vedhaStars: vedhaStarsOf(nakshatraIndex).map((i) => NAKSHATRAS[i].english),
    varna: VARNA_NAMES[VARNA_RANK[moonRashiIndex]] ?? "—",
    vashya: VASHYA_GROUP[moonRashiIndex],
    bird: birdOf(nakshatraIndex, paksha),
    element: RASHIS[moonRashiIndex].element,
    nameSyllables: syllables,
    birthPadaSyllable: { latin: syllables.latin[pada - 1], tamil: syllables.tamil[pada - 1] },
  };
}
