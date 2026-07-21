import type { PlanetName } from "./constants";

export type MoonInput = {
  rashiIndex: number; // 0-11
  nakshatraIndex: number; // 0-26
  rashiLord: PlanetName;
};

export type KootaResult = {
  key: string;
  name: string;
  maxPoints: number;
  points: number;
  note: string;
};

export type AshtakootResult = {
  totalPoints: number;
  maxPoints: 36;
  kootas: KootaResult[];
  verdict: "Excellent" | "Good" | "Average" | "Not Recommended";
};

/* ---- Varna (1 pt) ---- */
export const VARNA_RANK: Record<number, number> = {
  3: 4, 7: 4, 11: 4, // Cancer, Scorpio, Pisces -> Brahmin
  0: 3, 4: 3, 8: 3, // Aries, Leo, Sagittarius -> Kshatriya
  1: 2, 5: 2, 9: 2, // Taurus, Virgo, Capricorn -> Vaishya
  2: 1, 6: 1, 10: 1, // Gemini, Libra, Aquarius -> Shudra
};

function varnaKoota(bride: MoonInput, groom: MoonInput): KootaResult {
  const points = VARNA_RANK[groom.rashiIndex] >= VARNA_RANK[bride.rashiIndex] ? 1 : 0;
  return { key: "varna", name: "Varna (spiritual compatibility)", maxPoints: 1, points, note: points ? "Groom's varna is equal to or higher than the bride's." : "Groom's varna ranks below the bride's." };
}

/* ---- Vashya (2 pts) — simplified whole-sign dominance groups ---- */
export type VashyaGroup = "Chatushpada" | "Manava" | "Jalachara" | "Vanachara" | "Keeta";
export const VASHYA_GROUP: Record<number, VashyaGroup> = {
  0: "Chatushpada", 1: "Chatushpada", 9: "Chatushpada",
  2: "Manava", 5: "Manava", 6: "Manava", 8: "Manava", 10: "Manava",
  3: "Jalachara", 11: "Jalachara",
  4: "Vanachara",
  7: "Keeta",
};
const VASHYA_COMPAT: Record<string, number> = {
  "Chatushpada-Chatushpada": 2, "Manava-Manava": 2, "Jalachara-Jalachara": 2, "Vanachara-Vanachara": 2, "Keeta-Keeta": 2,
  "Manava-Chatushpada": 1, "Chatushpada-Manava": 1,
  "Jalachara-Vanachara": 1, "Vanachara-Jalachara": 1,
  "Manava-Jalachara": 1, "Jalachara-Manava": 1,
};

function vashyaKoota(bride: MoonInput, groom: MoonInput): KootaResult {
  const g1 = VASHYA_GROUP[bride.rashiIndex];
  const g2 = VASHYA_GROUP[groom.rashiIndex];
  const points = VASHYA_COMPAT[`${g1}-${g2}`] ?? 0;
  return { key: "vashya", name: "Vashya (mutual control/attraction)", maxPoints: 2, points, note: `Bride's sign group (${g1}) and groom's sign group (${g2}).` };
}

/* ---- Tara (3 pts) ---- */
const INAUSPICIOUS_TARA_POSITIONS = new Set([3, 5, 7]);

function taraDirectionScore(fromIdx: number, toIdx: number): number {
  const count = ((toIdx - fromIdx + 27) % 27) + 1;
  const taraPosition = ((count - 1) % 9) + 1;
  return INAUSPICIOUS_TARA_POSITIONS.has(taraPosition) ? 0 : 1.5;
}

function taraKoota(bride: MoonInput, groom: MoonInput): KootaResult {
  const points = taraDirectionScore(bride.nakshatraIndex, groom.nakshatraIndex) + taraDirectionScore(groom.nakshatraIndex, bride.nakshatraIndex);
  return { key: "tara", name: "Tara (birth-star compatibility)", maxPoints: 3, points, note: points === 3 ? "Both counting directions fall on auspicious stars." : points === 0 ? "Both counting directions fall on inauspicious stars." : "One counting direction is inauspicious." };
}

/* ---- Yoni (4 pts) ---- */
export const YONI_TABLE: Array<{ animal: string; gender: "M" | "F" }> = [
  { animal: "Horse", gender: "M" }, { animal: "Elephant", gender: "M" }, { animal: "Goat", gender: "F" },
  { animal: "Serpent", gender: "M" }, { animal: "Serpent", gender: "F" }, { animal: "Dog", gender: "F" },
  { animal: "Cat", gender: "F" }, { animal: "Goat", gender: "M" }, { animal: "Cat", gender: "M" },
  { animal: "Rat", gender: "M" }, { animal: "Rat", gender: "F" }, { animal: "Cow", gender: "F" },
  { animal: "Buffalo", gender: "F" }, { animal: "Tiger", gender: "F" }, { animal: "Buffalo", gender: "M" },
  { animal: "Tiger", gender: "M" }, { animal: "Deer", gender: "F" }, { animal: "Deer", gender: "M" },
  { animal: "Dog", gender: "M" }, { animal: "Monkey", gender: "M" }, { animal: "Mongoose", gender: "M" },
  { animal: "Monkey", gender: "F" }, { animal: "Lion", gender: "F" }, { animal: "Horse", gender: "F" },
  { animal: "Lion", gender: "M" }, { animal: "Cow", gender: "M" }, { animal: "Elephant", gender: "F" },
];

const YONI_ENEMY_PAIRS = new Set([
  "Cow-Tiger", "Tiger-Cow", "Elephant-Lion", "Lion-Elephant", "Horse-Buffalo", "Buffalo-Horse",
  "Dog-Deer", "Deer-Dog", "Goat-Monkey", "Monkey-Goat", "Serpent-Mongoose", "Mongoose-Serpent", "Rat-Cat", "Cat-Rat",
]);

function yoniKoota(bride: MoonInput, groom: MoonInput): KootaResult {
  const a = YONI_TABLE[bride.nakshatraIndex];
  const b = YONI_TABLE[groom.nakshatraIndex];
  let points: number;
  if (a.animal === b.animal && a.gender === b.gender) points = 4;
  else if (a.animal === b.animal) points = 3;
  else if (YONI_ENEMY_PAIRS.has(`${a.animal}-${b.animal}`)) points = 0;
  else points = 2;
  return { key: "yoni", name: "Yoni (intimate temperament)", maxPoints: 4, points, note: `Bride's yoni is ${a.animal}, groom's is ${b.animal}.` };
}

/* ---- Graha Maitri (5 pts) — Naisargika (natural) planetary friendship table ---- */
const FRIENDSHIP: Record<PlanetName, { friends: PlanetName[]; enemies: PlanetName[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] },
  Rahu: { friends: [], enemies: [] },
  Ketu: { friends: [], enemies: [] },
};

function relation(a: PlanetName, b: PlanetName): "friend" | "enemy" | "neutral" {
  if (a === b) return "friend";
  if (FRIENDSHIP[a].friends.includes(b)) return "friend";
  if (FRIENDSHIP[a].enemies.includes(b)) return "enemy";
  return "neutral";
}

function grahaMaitriKoota(bride: MoonInput, groom: MoonInput): KootaResult {
  const r1 = relation(bride.rashiLord, groom.rashiLord);
  const r2 = relation(groom.rashiLord, bride.rashiLord);
  const table: Record<string, number> = {
    "friend-friend": 5, "friend-neutral": 4, "neutral-friend": 4, "neutral-neutral": 3,
    "friend-enemy": 1, "enemy-friend": 1, "neutral-enemy": 1, "enemy-neutral": 1, "enemy-enemy": 0,
  };
  const points = table[`${r1}-${r2}`] ?? 3;
  return { key: "grahaMaitri", name: "Graha Maitri (planetary friendship)", maxPoints: 5, points, note: `Rashi lords: ${bride.rashiLord} & ${groom.rashiLord} — ${r1}/${r2}.` };
}

/* ---- Gana (6 pts) ---- */
export type Gana = "Deva" | "Manushya" | "Rakshasa";
export const GANA_TABLE: Gana[] = [
  "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva",
];

function ganaKoota(bride: MoonInput, groom: MoonInput): KootaResult {
  const g1 = GANA_TABLE[bride.nakshatraIndex];
  const g2 = GANA_TABLE[groom.nakshatraIndex];
  let points: number;
  if (g1 === g2) points = 6;
  else if ((g1 === "Deva" && g2 === "Rakshasa") || (g1 === "Rakshasa" && g2 === "Deva")) points = 0;
  else points = 5;
  return { key: "gana", name: "Gana (temperament group)", maxPoints: 6, points, note: `Bride is ${g1} gana, groom is ${g2} gana.` };
}

/* ---- Bhakoot (7 pts) ---- */
const BHAKOOT_DOSHA_DISTANCES = new Set([2, 5, 6, 8, 9, 12]);

function bhakootKoota(bride: MoonInput, groom: MoonInput): KootaResult {
  const distance = ((groom.rashiIndex - bride.rashiIndex + 12) % 12) + 1;
  const dosha = BHAKOOT_DOSHA_DISTANCES.has(distance);
  return { key: "bhakoot", name: "Bhakoot (sign-distance harmony)", maxPoints: 7, points: dosha ? 0 : 7, note: dosha ? "Bhakoot Dosha present — the moon-sign distance falls in an inauspicious count." : "Moon-sign distance is harmonious." };
}

/* ---- Nadi (8 pts) — health/genetic compatibility, classical Aadi/Madhya/Antya cycle ---- */
export type Nadi = "Aadi" | "Madhya" | "Antya";
export const NADI_TABLE: Nadi[] = [
  "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi", "Aadi", "Madhya", "Antya",
  "Antya", "Madhya", "Aadi", "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi",
  "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi", "Aadi", "Madhya", "Antya",
];

function nadiKoota(bride: MoonInput, groom: MoonInput): KootaResult {
  const n1 = NADI_TABLE[bride.nakshatraIndex];
  const n2 = NADI_TABLE[groom.nakshatraIndex];
  const dosha = n1 === n2;
  return { key: "nadi", name: "Nadi (health & genetic compatibility)", maxPoints: 8, points: dosha ? 0 : 8, note: dosha ? `Nadi Dosha present — both share the ${n1} nadi.` : `Different nadis (${n1} / ${n2}) — no dosha.` };
}

export function computeAshtakoot(bride: MoonInput, groom: MoonInput): AshtakootResult {
  const kootas = [
    varnaKoota(bride, groom),
    vashyaKoota(bride, groom),
    taraKoota(bride, groom),
    yoniKoota(bride, groom),
    grahaMaitriKoota(bride, groom),
    ganaKoota(bride, groom),
    bhakootKoota(bride, groom),
    nadiKoota(bride, groom),
  ];
  const totalPoints = Math.round(kootas.reduce((sum, k) => sum + k.points, 0) * 10) / 10;

  let verdict: AshtakootResult["verdict"];
  if (totalPoints >= 28) verdict = "Excellent";
  else if (totalPoints >= 21) verdict = "Good";
  else if (totalPoints >= 18) verdict = "Average";
  else verdict = "Not Recommended";

  return { totalPoints, maxPoints: 36, kootas, verdict };
}
