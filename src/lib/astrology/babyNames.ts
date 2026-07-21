import { PADA_SYLLABLES } from "./avakahada";

/**
 * Baby-name prediction: classical nakshatra-pada starting syllables (Avakahada Chakra)
 * crossed with Chaldean numerology. A name is "lucky" when its Chaldean total reduces
 * to the child's psychic or destiny number — the same method as printed name books.
 */

const CHALDEAN_MAP: Record<string, number> = {
  a: 1, i: 1, j: 1, q: 1, y: 1,
  b: 2, k: 2, r: 2,
  c: 3, g: 3, l: 3, s: 3,
  d: 4, m: 4, t: 4,
  e: 5, h: 5, n: 5, x: 5,
  u: 6, v: 6, w: 6,
  o: 7, z: 7,
  f: 8, p: 8,
};

export function chaldeanTotal(name: string): number {
  return name
    .toLowerCase()
    .split("")
    .reduce((sum, ch) => sum + (CHALDEAN_MAP[ch] ?? 0), 0);
}

function reduceDigit(n: number): number {
  let v = n;
  while (v > 9) v = String(v).split("").reduce((s, d) => s + Number(d), 0);
  return v;
}

/** Two-digit name totals (10-69) that reduce to any of the target single digits — the "lucky totals" series. */
export function luckyNameTotals(targets: number[]): number[] {
  const wanted = new Set(targets.map(reduceDigit));
  const series: number[] = [];
  for (let n = 10; n <= 69; n++) {
    if (wanted.has(reduceDigit(n))) series.push(n);
  }
  return series;
}

type PoolName = { name: string; tamil: string; meaning: string; gender: "boy" | "girl" };

/** Curated classical + modern names grouped by starting syllable (lowercase Latin). */
const NAME_POOL: Record<string, PoolName[]> = {
  chu: [
    { name: "Chudar", tamil: "சுடர்", meaning: "Radiant flame", gender: "boy" },
    { name: "Chudarvizhi", tamil: "சுடர்விழி", meaning: "Bright-eyed", gender: "girl" },
  ],
  che: [
    { name: "Chezhiyan", tamil: "செழியன்", meaning: "Prosperous king", gender: "boy" },
    { name: "Chellam", tamil: "செல்லம்", meaning: "Beloved darling", gender: "girl" },
  ],
  cho: [
    { name: "Cholan", tamil: "சோழன்", meaning: "Of the Chola dynasty", gender: "boy" },
  ],
  la: [
    { name: "Lakshan", tamil: "லக்ஷன்", meaning: "Auspicious mark", gender: "boy" },
    { name: "Lakshita", tamil: "லக்ஷிதா", meaning: "Distinguished", gender: "girl" },
    { name: "Lavanya", tamil: "லாவண்யா", meaning: "Grace, beauty", gender: "girl" },
  ],
  li: [
    { name: "Likhit", tamil: "லிகித்", meaning: "Written, destined", gender: "boy" },
    { name: "Lithika", tamil: "லிதிகா", meaning: "Good fortune", gender: "girl" },
  ],
  lu: [{ name: "Lupin", tamil: "லுபின்", meaning: "Bright flower", gender: "boy" }],
  le: [{ name: "Lenin", tamil: "லெனின்", meaning: "Bold spirit", gender: "boy" }],
  lo: [{ name: "Logan", tamil: "லோகன்", meaning: "Of the world", gender: "boy" }, { name: "Logitha", tamil: "லோகிதா", meaning: "Light of the world", gender: "girl" }],
  a: [
    { name: "Aarav", tamil: "ஆரவ்", meaning: "Peaceful melody", gender: "boy" },
    { name: "Akilan", tamil: "அகிலன்", meaning: "Master of all worlds", gender: "boy" },
    { name: "Anika", tamil: "அனிகா", meaning: "Graceful brilliance", gender: "girl" },
    { name: "Amudha", tamil: "அமுதா", meaning: "Nectar-sweet", gender: "girl" },
  ],
  e: [
    { name: "Ilamparithi", tamil: "இளம்பரிதி", meaning: "Young sun", gender: "boy" },
    { name: "Iniya", tamil: "இனியா", meaning: "Sweet-natured", gender: "girl" },
  ],
  u: [
    { name: "Udhayan", tamil: "உதயன்", meaning: "Rising dawn", gender: "boy" },
    { name: "Uma", tamil: "உமா", meaning: "Goddess Parvati", gender: "girl" },
  ],
  ea: [{ name: "Ezhilan", tamil: "எழிலன்", meaning: "Handsome one", gender: "boy" }, { name: "Ezhilarasi", tamil: "எழிலரசி", meaning: "Queen of beauty", gender: "girl" }],
  o: [{ name: "Oviyan", tamil: "ஓவியன்", meaning: "Artist", gender: "boy" }, { name: "Oviya", tamil: "ஓவியா", meaning: "Beautiful painting", gender: "girl" }],
  va: [
    { name: "Varun", tamil: "வருண்", meaning: "Lord of rain", gender: "boy" },
    { name: "Varsha", tamil: "வர்ஷா", meaning: "Blessed rain", gender: "girl" },
  ],
  vi: [
    { name: "Vihaan", tamil: "விஹான்", meaning: "First light of dawn", gender: "boy" },
    { name: "Vidya", tamil: "வித்யா", meaning: "Knowledge", gender: "girl" },
  ],
  vu: [{ name: "Vurshan", tamil: "வுர்ஷன்", meaning: "Strong protector", gender: "boy" }],
  ve: [
    { name: "Velan", tamil: "வேலன்", meaning: "Lord Murugan", gender: "boy" },
    { name: "Vennila", tamil: "வெண்ணிலா", meaning: "White moon", gender: "girl" },
  ],
  vo: [{ name: "Voshan", tamil: "வோஷன்", meaning: "Gift of light", gender: "boy" }],
  ka: [
    { name: "Karthik", tamil: "கார்த்திக்", meaning: "Son of Shiva", gender: "boy" },
    { name: "Kavya", tamil: "காவ்யா", meaning: "Poetry", gender: "girl" },
  ],
  ki: [
    { name: "Kiran", tamil: "கிரண்", meaning: "Ray of light", gender: "boy" },
    { name: "Kirthana", tamil: "கீர்த்தனா", meaning: "Devotional song", gender: "girl" },
  ],
  ku: [
    { name: "Kumaran", tamil: "குமரன்", meaning: "Youthful god", gender: "boy" },
    { name: "Kuyili", tamil: "குயிலி", meaning: "Sweet-voiced cuckoo", gender: "girl" },
  ],
  gha: [{ name: "Ghanan", tamil: "கனன்", meaning: "Thundercloud", gender: "boy" }],
  nga: [{ name: "Ngaya", tamil: "ஙயா", meaning: "Gentle soul", gender: "girl" }],
  chha: [{ name: "Chhaya", tamil: "சாயா", meaning: "Divine shadow", gender: "girl" }],
  ke: [
    { name: "Kethan", tamil: "கேதன்", meaning: "Banner of victory", gender: "boy" },
    { name: "Kezhini", tamil: "கேழினி", meaning: "Bright companion", gender: "girl" },
  ],
  ko: [
    { name: "Kovalan", tamil: "கோவலன்", meaning: "Cowherd prince", gender: "boy" },
    { name: "Kopika", tamil: "கோபிகா", meaning: "Devotee of Krishna", gender: "girl" },
  ],
  ha: [
    { name: "Harish", tamil: "ஹரீஷ்", meaning: "Lord Vishnu", gender: "boy" },
    { name: "Harini", tamil: "ஹரிணி", meaning: "Graceful deer", gender: "girl" },
  ],
  hi: [{ name: "Hithesh", tamil: "ஹிதேஷ்", meaning: "Well-wisher", gender: "boy" }, { name: "Hithanya", tamil: "ஹிதன்யா", meaning: "Kind-hearted", gender: "girl" }],
  hu: [{ name: "Hutheesh", tamil: "ஹுதீஷ்", meaning: "Sacred fire", gender: "boy" }],
  he: [{ name: "Hemanth", tamil: "ஹேமந்த்", meaning: "Golden season", gender: "boy" }, { name: "Hema", tamil: "ஹேமா", meaning: "Golden one", gender: "girl" }],
  ho: [{ name: "Hovan", tamil: "ஹோவன்", meaning: "Gift of God", gender: "boy" }],
  da: [
    { name: "Daksh", tamil: "தக்ஷ்", meaning: "Capable, skilled", gender: "boy" },
    { name: "Dakshina", tamil: "தக்ஷிணா", meaning: "Generous offering", gender: "girl" },
  ],
  di: [
    { name: "Dinesh", tamil: "தினேஷ்", meaning: "Lord of the day", gender: "boy" },
    { name: "Divya", tamil: "திவ்யா", meaning: "Divine light", gender: "girl" },
  ],
  du: [{ name: "Durai", tamil: "துரை", meaning: "Chief, leader", gender: "boy" }, { name: "Durga", tamil: "துர்கா", meaning: "Invincible goddess", gender: "girl" }],
  de: [
    { name: "Devan", tamil: "தேவன்", meaning: "Divine being", gender: "boy" },
    { name: "Devika", tamil: "தேவிகா", meaning: "Little goddess", gender: "girl" },
  ],
  do: [{ name: "Dorai", tamil: "டோரை", meaning: "Noble lord", gender: "boy" }],
  ma: [
    { name: "Madhavan", tamil: "மாதவன்", meaning: "Lord Krishna", gender: "boy" },
    { name: "Mahil", tamil: "மகில்", meaning: "Joyful", gender: "boy" },
    { name: "Mahima", tamil: "மகிமா", meaning: "Glory", gender: "girl" },
    { name: "Malar", tamil: "மலர்", meaning: "Blossoming flower", gender: "girl" },
  ],
  mi: [
    { name: "Mithran", tamil: "மித்ரன்", meaning: "Friend, the sun", gender: "boy" },
    { name: "Mithra", tamil: "மித்ரா", meaning: "Companion of light", gender: "girl" },
  ],
  mu: [
    { name: "Mugilan", tamil: "முகிலன்", meaning: "Lord of clouds", gender: "boy" },
    { name: "Mukund", tamil: "முகுந்த்", meaning: "Giver of liberation", gender: "boy" },
    { name: "Muthulakshmi", tamil: "முத்துலக்ஷ்மி", meaning: "Pearl of fortune", gender: "girl" },
  ],
  me: [
    { name: "Meyyan", tamil: "மெய்யன்", meaning: "Truthful one", gender: "boy" },
    { name: "Meghana", tamil: "மேகனா", meaning: "Bearer of rain", gender: "girl" },
  ],
  mo: [{ name: "Mohan", tamil: "மோகன்", meaning: "Enchanting", gender: "boy" }, { name: "Mohana", tamil: "மோகனா", meaning: "Charming melody", gender: "girl" }],
  ta: [
    { name: "Tarun", tamil: "தருண்", meaning: "Youthful", gender: "boy" },
    { name: "Tanvi", tamil: "தன்வி", meaning: "Slender beauty", gender: "girl" },
  ],
  ti: [{ name: "Tilak", tamil: "திலக்", meaning: "Auspicious mark", gender: "boy" }, { name: "Tishya", tamil: "திஷ்யா", meaning: "Auspicious star", gender: "girl" }],
  tu: [{ name: "Tulasiram", tamil: "துளசிராம்", meaning: "Sacred basil of Rama", gender: "boy" }, { name: "Tulasi", tamil: "துளசி", meaning: "Sacred basil", gender: "girl" }],
  te: [{ name: "Tejas", tamil: "தேஜஸ்", meaning: "Brilliance", gender: "boy" }, { name: "Tejaswini", tamil: "தேஜஸ்வினி", meaning: "Radiant one", gender: "girl" }],
  to: [{ name: "Tolan", tamil: "தோழன்", meaning: "Trusted friend", gender: "boy" }],
  pa: [
    { name: "Pranav", tamil: "பிரணவ்", meaning: "Sacred Om", gender: "boy" },
    { name: "Pavithra", tamil: "பவித்ரா", meaning: "Pure", gender: "girl" },
  ],
  pi: [{ name: "Pithan", tamil: "பித்தன்", meaning: "Devotee of Shiva", gender: "boy" }],
  pu: [
    { name: "Pugazhan", tamil: "புகழன்", meaning: "Renowned", gender: "boy" },
    { name: "Pushpa", tamil: "புஷ்பா", meaning: "Flower", gender: "girl" },
  ],
  sha: [{ name: "Shakthivel", tamil: "சக்திவேல்", meaning: "Spear of power", gender: "boy" }, { name: "Shalini", tamil: "ஷாலினி", meaning: "Modest, praiseworthy", gender: "girl" }],
  na: [
    { name: "Naveen", tamil: "நவீன்", meaning: "Ever new", gender: "boy" },
    { name: "Nandhini", tamil: "நந்தினி", meaning: "Daughter of joy", gender: "girl" },
  ],
  tha: [{ name: "Thamizhan", tamil: "தமிழன்", meaning: "Son of Tamil", gender: "boy" }, { name: "Thamarai", tamil: "தாமரை", meaning: "Lotus", gender: "girl" }],
  pe: [{ name: "Perarasu", tamil: "பேரரசு", meaning: "Great emperor", gender: "boy" }],
  po: [{ name: "Ponnan", tamil: "பொன்னன்", meaning: "Golden one", gender: "boy" }, { name: "Ponni", tamil: "பொன்னி", meaning: "Golden river", gender: "girl" }],
  ra: [
    { name: "Raghav", tamil: "ராகவ்", meaning: "Descendant of Raghu", gender: "boy" },
    { name: "Ramya", tamil: "ரம்யா", meaning: "Delightful", gender: "girl" },
  ],
  ri: [{ name: "Rishab", tamil: "ரிஷப்", meaning: "Excellent, mighty", gender: "boy" }, { name: "Rithika", tamil: "ரித்திகா", meaning: "Flowing stream of truth", gender: "girl" }],
  ru: [
    { name: "Rudran", tamil: "ருத்ரன்", meaning: "Form of Shiva", gender: "boy" },
    { name: "Rukmani", tamil: "ருக்மணி", meaning: "Radiant consort", gender: "girl" },
  ],
  re: [
    { name: "Revanth", tamil: "ரேவந்த்", meaning: "Son of the sun", gender: "boy" },
    { name: "Renuka", tamil: "ரேணுகா", meaning: "Mother of Parashurama", gender: "girl" },
  ],
  ro: [
    { name: "Rohan", tamil: "ரோகன்", meaning: "Ascending", gender: "boy" },
    { name: "Rohini", tamil: "ரோகிணி", meaning: "Star of growth", gender: "girl" },
  ],
  ni: [
    { name: "Nithilan", tamil: "நிதிலன்", meaning: "Pearl", gender: "boy" },
    { name: "Nithya", tamil: "நித்யா", meaning: "Eternal", gender: "girl" },
  ],
  nu: [{ name: "Nuthan", tamil: "நூதன்", meaning: "Novel, fresh", gender: "boy" }],
  ne: [{ name: "Nesan", tamil: "நேசன்", meaning: "Loving friend", gender: "boy" }, { name: "Nesam", tamil: "நேசம்", meaning: "Affection", gender: "girl" }],
  no: [{ name: "Nolan", tamil: "நோலன்", meaning: "Noble champion", gender: "boy" }],
  ya: [
    { name: "Yash", tamil: "யஷ்", meaning: "Fame, success", gender: "boy" },
    { name: "Yazhini", tamil: "யாழினி", meaning: "Sweet as the yazh harp", gender: "girl" },
  ],
  yi: [{ name: "Yishan", tamil: "யிஷான்", meaning: "Blessed mountain", gender: "boy" }],
  yu: [{ name: "Yuvan", tamil: "யுவன்", meaning: "Youthful, energetic", gender: "boy" }, { name: "Yuvana", tamil: "யுவனா", meaning: "Young and bright", gender: "girl" }],
  ye: [{ name: "Yeshwanth", tamil: "யேஷ்வந்த்", meaning: "Glorious achiever", gender: "boy" }],
  yo: [{ name: "Yogan", tamil: "யோகன்", meaning: "Fortunate union", gender: "boy" }, { name: "Yogitha", tamil: "யோகிதா", meaning: "Disciplined one", gender: "girl" }],
  bha: [{ name: "Bharath", tamil: "பரத்", meaning: "Upholder of the land", gender: "boy" }, { name: "Bhavana", tamil: "பாவனா", meaning: "Pure feeling", gender: "girl" }],
  bhi: [{ name: "Bhishan", tamil: "பீஷன்", meaning: "Formidable", gender: "boy" }],
  bhu: [{ name: "Bhuvanesh", tamil: "புவனேஷ்", meaning: "Lord of the world", gender: "boy" }, { name: "Bhuvana", tamil: "புவனா", meaning: "The living world", gender: "girl" }],
  dha: [{ name: "Dhanush", tamil: "தனுஷ்", meaning: "Divine bow", gender: "boy" }, { name: "Dhanya", tamil: "தன்யா", meaning: "Blessed", gender: "girl" }],
  pha: [{ name: "Phanindra", tamil: "பணீந்திரா", meaning: "King of serpents", gender: "boy" }],
  dhha: [{ name: "Dharan", tamil: "தரன்", meaning: "Bearer of the earth", gender: "boy" }],
  bhe: [{ name: "Bhemesh", tamil: "பேமேஷ்", meaning: "Mighty lord", gender: "boy" }],
  bho: [{ name: "Bhoopathi", tamil: "பூபதி", meaning: "King of the land", gender: "boy" }],
  ja: [
    { name: "Jayanth", tamil: "ஜெயந்த்", meaning: "Victorious", gender: "boy" },
    { name: "Janani", tamil: "ஜனனி", meaning: "Mother of all", gender: "girl" },
  ],
  ji: [{ name: "Jivan", tamil: "ஜீவன்", meaning: "Life itself", gender: "boy" }, { name: "Jithya", tamil: "ஜித்யா", meaning: "Ever-winning", gender: "girl" }],
  ju: [{ name: "Jugal", tamil: "ஜுகல்", meaning: "Inseparable pair", gender: "boy" }],
  je: [{ name: "Jeyam", tamil: "ஜெயம்", meaning: "Victory", gender: "boy" }, { name: "Jenitha", tamil: "ஜெனிதா", meaning: "Born to win", gender: "girl" }],
  jo: [{ name: "Jothi", tamil: "ஜோதி", meaning: "Sacred flame", gender: "girl" }, { name: "Jothiran", tamil: "ஜோதிரன்", meaning: "Bearer of light", gender: "boy" }],
  ga: [
    { name: "Ganesh", tamil: "கணேஷ்", meaning: "Lord of beginnings", gender: "boy" },
    { name: "Gayathri", tamil: "காயத்ரி", meaning: "Sacred hymn", gender: "girl" },
  ],
  gi: [{ name: "Girivasan", tamil: "கிரிவாசன்", meaning: "Dweller of hills", gender: "boy" }, { name: "Githanjali", tamil: "கீதாஞ்சலி", meaning: "Offering of songs", gender: "girl" }],
  gu: [{ name: "Gugan", tamil: "குகன்", meaning: "Lord Murugan of the cave", gender: "boy" }],
  ge: [{ name: "Gejan", tamil: "கேஜன்", meaning: "Resounding fame", gender: "boy" }],
  go: [{ name: "Gopal", tamil: "கோபால்", meaning: "Protector of cows", gender: "boy" }, { name: "Gomathi", tamil: "கோமதி", meaning: "Radiant wisdom", gender: "girl" }],
  sa: [
    { name: "Sarvesh", tamil: "சர்வேஷ்", meaning: "Lord of all", gender: "boy" },
    { name: "Sahana", tamil: "சஹானா", meaning: "Patient melody", gender: "girl" },
  ],
  si: [{ name: "Sivan", tamil: "சிவன்", meaning: "The auspicious one", gender: "boy" }, { name: "Sithara", tamil: "சிதாரா", meaning: "Star", gender: "girl" }],
  su: [
    { name: "Suriya", tamil: "சூரியா", meaning: "The sun", gender: "boy" },
    { name: "Subhasri", tamil: "சுபஸ்ரீ", meaning: "Auspicious wealth", gender: "girl" },
  ],
  se: [{ name: "Sekar", tamil: "சேகர்", meaning: "Crest jewel", gender: "boy" }, { name: "Selvi", tamil: "செல்வி", meaning: "Prosperous maiden", gender: "girl" }],
  so: [{ name: "Somesh", tamil: "சோமேஷ்", meaning: "Lord of the moon", gender: "boy" }, { name: "Sowmiya", tamil: "சௌமியா", meaning: "Gentle grace", gender: "girl" }],
  jha: [{ name: "Jhalan", tamil: "ஜலன்", meaning: "Sparkling water", gender: "boy" }],
  cha: [{ name: "Chandran", tamil: "சந்திரன்", meaning: "The moon", gender: "boy" }, { name: "Charumathi", tamil: "சாருமதி", meaning: "Beautiful intellect", gender: "girl" }],
  chi: [{ name: "Chidambaram", tamil: "சிதம்பரம்", meaning: "Hall of consciousness", gender: "boy" }, { name: "Chithra", tamil: "சித்ரா", meaning: "Bright artwork", gender: "girl" }],
};

export type BabyNameSuggestion = PoolName & {
  chaldeanTotal: number;
  reducedNumber: number;
  isLucky: boolean;
  syllable: string;
};

export type BabyNamePrediction = {
  syllables: { latin: string[]; tamil: string[] };
  birthPadaSyllable: { latin: string; tamil: string };
  luckyTotals: number[];
  boys: BabyNameSuggestion[];
  girls: BabyNameSuggestion[];
};

/**
 * Names starting with any of the birth star's pada syllables, scored by Chaldean total.
 * Lucky = total reduces to the psychic or destiny number. A preferred starting letter
 * (standalone naming module) pulls in that letter's pools too and ranks them highest;
 * after that, birth-pada names sort first, then lucky names, then by score.
 */
export function predictBabyNames(params: {
  nakshatraIndex: number;
  pada: number;
  psychicNumber: number;
  destinyNumber: number;
  preferredLetter?: string;
  limitPerGender?: number;
}): BabyNamePrediction {
  const { nakshatraIndex, pada, psychicNumber, destinyNumber, preferredLetter, limitPerGender = 6 } = params;
  const syllables = PADA_SYLLABLES[nakshatraIndex];
  const birthSyllable = syllables.latin[pada - 1];
  const targets = new Set([psychicNumber, destinyNumber]);
  const luckyTotals = luckyNameTotals([psychicNumber, destinyNumber]);
  const letter = preferredLetter?.trim().toLowerCase() || undefined;

  const sourceSyllables = new Set(syllables.latin.map((s) => s.toLowerCase()));
  if (letter) {
    for (const key of Object.keys(NAME_POOL)) if (key.startsWith(letter)) sourceSyllables.add(key);
  }

  const all: BabyNameSuggestion[] = [];
  for (const syl of sourceSyllables) {
    const pool = NAME_POOL[syl] ?? [];
    for (const entry of pool) {
      const total = chaldeanTotal(entry.name);
      const reduced = ((total - 1) % 9) + 1;
      all.push({
        ...entry,
        chaldeanTotal: total,
        reducedNumber: reduced,
        isLucky: targets.has(reduced),
        syllable: syl,
      });
    }
  }

  const rank = (s: BabyNameSuggestion) =>
    (letter && s.name.toLowerCase().startsWith(letter) ? 4 : 0) +
    (s.syllable === birthSyllable.toLowerCase() || s.syllable === birthSyllable ? 2 : 0) +
    (s.isLucky ? 1 : 0);
  const sorted = [...all].sort((a, b) => rank(b) - rank(a) || a.name.localeCompare(b.name));

  return {
    syllables,
    birthPadaSyllable: { latin: birthSyllable, tamil: syllables.tamil[pada - 1] },
    luckyTotals,
    boys: sorted.filter((n) => n.gender === "boy").slice(0, limitPerGender),
    girls: sorted.filter((n) => n.gender === "girl").slice(0, limitPerGender),
  };
}
