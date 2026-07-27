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
    { name: "Chudamani", tamil: "சுடாமணி", meaning: "Crest jewel of light", gender: "boy" },
    { name: "Chudarvizhi", tamil: "சுடர்விழி", meaning: "Bright-eyed", gender: "girl" },
    { name: "Chudarkodi", tamil: "சுடர்க்கொடி", meaning: "Radiant banner", gender: "girl" },
  ],
  che: [
    { name: "Chezhiyan", tamil: "செழியன்", meaning: "Prosperous king", gender: "boy" },
    { name: "Chembian", tamil: "செம்பியன்", meaning: "Of the Chola lineage", gender: "boy" },
    { name: "Chellam", tamil: "செல்லம்", meaning: "Beloved darling", gender: "girl" },
    { name: "Chenthamarai", tamil: "செந்தாமரை", meaning: "Red lotus", gender: "girl" },
  ],
  cho: [
    { name: "Cholan", tamil: "சோழன்", meaning: "Of the Chola dynasty", gender: "boy" },
    { name: "Chozhiya", tamil: "சோழியா", meaning: "Belonging to Chola land", gender: "girl" },
  ],
  la: [
    { name: "Lakshan", tamil: "லக்ஷன்", meaning: "Auspicious mark", gender: "boy" },
    { name: "Lakshman", tamil: "லக்ஷ்மண்", meaning: "Devoted brother of Rama", gender: "boy" },
    { name: "Lakshita", tamil: "லக்ஷிதா", meaning: "Distinguished", gender: "girl" },
    { name: "Lavanya", tamil: "லாவண்யா", meaning: "Grace, beauty", gender: "girl" },
    { name: "Lakshmi", tamil: "லக்ஷ்மி", meaning: "Goddess of wealth", gender: "girl" },
    { name: "Lalitha", tamil: "லலிதா", meaning: "Charming, graceful", gender: "girl" },
  ],
  li: [
    { name: "Likhit", tamil: "லிகித்", meaning: "Written, destined", gender: "boy" },
    { name: "Lingesh", tamil: "லிங்கேஷ்", meaning: "Lord Shiva", gender: "boy" },
    { name: "Lithika", tamil: "லிதிகா", meaning: "Good fortune", gender: "girl" },
    { name: "Lipika", tamil: "லிபிகா", meaning: "One who writes, scribe", gender: "girl" },
  ],
  lu: [
    { name: "Lupin", tamil: "லுபின்", meaning: "Bright flower", gender: "boy" },
    { name: "Luvan", tamil: "லுவன்", meaning: "Son of Rama (Luv)", gender: "boy" },
  ],
  le: [
    { name: "Lenin", tamil: "லெனின்", meaning: "Bold spirit", gender: "boy" },
    { name: "Leela", tamil: "லீலா", meaning: "Divine play", gender: "girl" },
  ],
  lo: [
    { name: "Logan", tamil: "லோகன்", meaning: "Of the world", gender: "boy" },
    { name: "Lokesh", tamil: "லோகேஷ்", meaning: "Lord of the world", gender: "boy" },
    { name: "Logitha", tamil: "லோகிதா", meaning: "Light of the world", gender: "girl" },
    { name: "Lohita", tamil: "லோஹிதா", meaning: "Red, ruby-hued", gender: "girl" },
  ],
  a: [
    { name: "Aarav", tamil: "ஆரவ்", meaning: "Peaceful melody", gender: "boy" },
    { name: "Akilan", tamil: "அகிலன்", meaning: "Master of all worlds", gender: "boy" },
    { name: "Arjun", tamil: "அர்ஜுன்", meaning: "Bright, shining warrior", gender: "boy" },
    { name: "Ashwin", tamil: "அஸ்வின்", meaning: "Star of the horsemen", gender: "boy" },
    { name: "Anika", tamil: "அனிகா", meaning: "Graceful brilliance", gender: "girl" },
    { name: "Amudha", tamil: "அமுதா", meaning: "Nectar-sweet", gender: "girl" },
    { name: "Anjali", tamil: "அஞ்சலி", meaning: "Offering with folded hands", gender: "girl" },
    { name: "Aishwarya", tamil: "ஐஸ்வர்யா", meaning: "Prosperity, wealth", gender: "girl" },
  ],
  e: [
    { name: "Ilamparithi", tamil: "இளம்பரிதி", meaning: "Young sun", gender: "boy" },
    { name: "Eswar", tamil: "ஈஸ்வர்", meaning: "Lord Shiva, the supreme", gender: "boy" },
    { name: "Iniya", tamil: "இனியா", meaning: "Sweet-natured", gender: "girl" },
    { name: "Easwari", tamil: "ஈஸ்வரி", meaning: "The goddess", gender: "girl" },
  ],
  u: [
    { name: "Udhayan", tamil: "உதயன்", meaning: "Rising dawn", gender: "boy" },
    { name: "Umapathi", tamil: "உமாபதி", meaning: "Consort of Uma (Shiva)", gender: "boy" },
    { name: "Uma", tamil: "உமா", meaning: "Goddess Parvati", gender: "girl" },
    { name: "Urvashi", tamil: "உர்வசி", meaning: "Celestial beauty", gender: "girl" },
  ],
  ea: [
    { name: "Ezhilan", tamil: "எழிலன்", meaning: "Handsome one", gender: "boy" },
    { name: "Ezhilarasi", tamil: "எழிலரசி", meaning: "Queen of beauty", gender: "girl" },
    { name: "Ezhilmathi", tamil: "எழிலமதி", meaning: "Beautiful wisdom", gender: "girl" },
  ],
  o: [
    { name: "Oviyan", tamil: "ஓவியன்", meaning: "Artist", gender: "boy" },
    { name: "Omkar", tamil: "ஓம்கார்", meaning: "Sacred sound Om", gender: "boy" },
    { name: "Oviya", tamil: "ஓவியா", meaning: "Beautiful painting", gender: "girl" },
    { name: "Oviyanayaki", tamil: "ஓவியநாயகி", meaning: "Queen of art", gender: "girl" },
  ],
  va: [
    { name: "Varun", tamil: "வருண்", meaning: "Lord of rain", gender: "boy" },
    { name: "Vasanth", tamil: "வசந்த்", meaning: "Spring season", gender: "boy" },
    { name: "Varsha", tamil: "வர்ஷா", meaning: "Blessed rain", gender: "girl" },
    { name: "Varalakshmi", tamil: "வரலட்சுமி", meaning: "Goddess bestowing boons", gender: "girl" },
  ],
  vi: [
    { name: "Vihaan", tamil: "விஹான்", meaning: "First light of dawn", gender: "boy" },
    { name: "Vijay", tamil: "விஜய்", meaning: "Victory", gender: "boy" },
    { name: "Vidya", tamil: "வித்யா", meaning: "Knowledge", gender: "girl" },
    { name: "Vimala", tamil: "விமலா", meaning: "Pure, spotless", gender: "girl" },
  ],
  vu: [{ name: "Vurshan", tamil: "வுர்ஷன்", meaning: "Strong protector", gender: "boy" }],
  ve: [
    { name: "Velan", tamil: "வேலன்", meaning: "Lord Murugan", gender: "boy" },
    { name: "Vetrivel", tamil: "வெற்றிவேல்", meaning: "Victorious spear of Murugan", gender: "boy" },
    { name: "Vennila", tamil: "வெண்ணிலா", meaning: "White moon", gender: "girl" },
    { name: "Vedhika", tamil: "வேதிகா", meaning: "Altar, one connected to the Vedas", gender: "girl" },
  ],
  vo: [{ name: "Voshan", tamil: "வோஷன்", meaning: "Gift of light", gender: "boy" }],
  ka: [
    { name: "Karthik", tamil: "கார்த்திக்", meaning: "Son of Shiva", gender: "boy" },
    { name: "Karthikeyan", tamil: "கார்த்திகேயன்", meaning: "Lord Murugan", gender: "boy" },
    { name: "Kavya", tamil: "காவ்யா", meaning: "Poetry", gender: "girl" },
    { name: "Kalyani", tamil: "கல்யாணி", meaning: "Auspicious one", gender: "girl" },
  ],
  ki: [
    { name: "Kiran", tamil: "கிரண்", meaning: "Ray of light", gender: "boy" },
    { name: "Kishore", tamil: "கிஷோர்", meaning: "Young prince", gender: "boy" },
    { name: "Kirthana", tamil: "கீர்த்தனா", meaning: "Devotional song", gender: "girl" },
    { name: "Kimaya", tamil: "கிமயா", meaning: "Miracle", gender: "girl" },
  ],
  ku: [
    { name: "Kumaran", tamil: "குமரன்", meaning: "Youthful god", gender: "boy" },
    { name: "Kuberan", tamil: "குபேரன்", meaning: "God of wealth", gender: "boy" },
    { name: "Kuyili", tamil: "குயிலி", meaning: "Sweet-voiced cuckoo", gender: "girl" },
    { name: "Kuzhali", tamil: "குழலி", meaning: "One with lovely tresses", gender: "girl" },
  ],
  gha: [{ name: "Ghanan", tamil: "கனன்", meaning: "Thundercloud", gender: "boy" }],
  nga: [{ name: "Ngaya", tamil: "ஙயா", meaning: "Gentle soul", gender: "girl" }],
  chha: [{ name: "Chhaya", tamil: "சாயா", meaning: "Divine shadow", gender: "girl" }],
  ke: [
    { name: "Kethan", tamil: "கேதன்", meaning: "Banner of victory", gender: "boy" },
    { name: "Keshav", tamil: "கேசவ்", meaning: "Lord Krishna", gender: "boy" },
    { name: "Kezhini", tamil: "கேழினி", meaning: "Bright companion", gender: "girl" },
    { name: "Keerthi", tamil: "கீர்த்தி", meaning: "Fame", gender: "girl" },
  ],
  ko: [
    { name: "Kovalan", tamil: "கோவலன்", meaning: "Cowherd prince", gender: "boy" },
    { name: "Kodeeswaran", tamil: "கோடீஸ்வரன்", meaning: "Lord of crores (wealthy)", gender: "boy" },
    { name: "Kopika", tamil: "கோபிகா", meaning: "Devotee of Krishna", gender: "girl" },
    { name: "Kokila", tamil: "கோகிலா", meaning: "Cuckoo bird, sweet voice", gender: "girl" },
  ],
  ha: [
    { name: "Harish", tamil: "ஹரீஷ்", meaning: "Lord Vishnu", gender: "boy" },
    { name: "Hariharan", tamil: "ஹரிஹரன்", meaning: "Vishnu and Shiva combined", gender: "boy" },
    { name: "Harini", tamil: "ஹரிணி", meaning: "Graceful deer", gender: "girl" },
    { name: "Haritha", tamil: "ஹரிதா", meaning: "Green, of nature", gender: "girl" },
  ],
  hi: [
    { name: "Hithesh", tamil: "ஹிதேஷ்", meaning: "Well-wisher", gender: "boy" },
    { name: "Himesh", tamil: "ஹிமேஷ்", meaning: "Lord of snow", gender: "boy" },
    { name: "Hithanya", tamil: "ஹிதன்யா", meaning: "Kind-hearted", gender: "girl" },
    { name: "Hima", tamil: "ஹிமா", meaning: "Snow, cool one", gender: "girl" },
  ],
  hu: [{ name: "Hutheesh", tamil: "ஹுதீஷ்", meaning: "Sacred fire", gender: "boy" }],
  he: [
    { name: "Hemanth", tamil: "ஹேமந்த்", meaning: "Golden season", gender: "boy" },
    { name: "Heramban", tamil: "ஹேரம்பன்", meaning: "Another name of Ganesha", gender: "boy" },
    { name: "Hema", tamil: "ஹேமா", meaning: "Golden one", gender: "girl" },
    { name: "Hemalatha", tamil: "ஹேமலதா", meaning: "Golden creeper", gender: "girl" },
  ],
  ho: [{ name: "Hovan", tamil: "ஹோவன்", meaning: "Gift of God", gender: "boy" }],
  da: [
    { name: "Daksh", tamil: "தக்ஷ்", meaning: "Capable, skilled", gender: "boy" },
    { name: "Darshan", tamil: "தர்ஷன்", meaning: "Vision, sight of the divine", gender: "boy" },
    { name: "Dakshina", tamil: "தக்ஷிணா", meaning: "Generous offering", gender: "girl" },
    { name: "Damayanthi", tamil: "தமயந்தி", meaning: "Legendary princess", gender: "girl" },
  ],
  di: [
    { name: "Dinesh", tamil: "தினேஷ்", meaning: "Lord of the day", gender: "boy" },
    { name: "Dileep", tamil: "திலீப்", meaning: "Protector, ancestor of Rama", gender: "boy" },
    { name: "Divya", tamil: "திவ்யா", meaning: "Divine light", gender: "girl" },
    { name: "Dipika", tamil: "தீபிகா", meaning: "Small lamp", gender: "girl" },
  ],
  du: [
    { name: "Durai", tamil: "துரை", meaning: "Chief, leader", gender: "boy" },
    { name: "Dushyanth", tamil: "துஷ்யந்த்", meaning: "Legendary king", gender: "boy" },
    { name: "Durga", tamil: "துர்கா", meaning: "Invincible goddess", gender: "girl" },
    { name: "Duraiselvi", tamil: "துரைச்செல்வி", meaning: "Noble wealth", gender: "girl" },
  ],
  de: [
    { name: "Devan", tamil: "தேவன்", meaning: "Divine being", gender: "boy" },
    { name: "Deepan", tamil: "தீபன்", meaning: "One who illuminates", gender: "boy" },
    { name: "Devika", tamil: "தேவிகா", meaning: "Little goddess", gender: "girl" },
    { name: "Deivanai", tamil: "தெய்வானை", meaning: "Consort of Lord Murugan", gender: "girl" },
  ],
  do: [{ name: "Dorai", tamil: "டோரை", meaning: "Noble lord", gender: "boy" }],
  ma: [
    { name: "Madhavan", tamil: "மாதவன்", meaning: "Lord Krishna", gender: "boy" },
    { name: "Mahil", tamil: "மகில்", meaning: "Joyful", gender: "boy" },
    { name: "Manikandan", tamil: "மணிகண்டன்", meaning: "Lord Ayyappan", gender: "boy" },
    { name: "Mahima", tamil: "மகிமா", meaning: "Glory", gender: "girl" },
    { name: "Malar", tamil: "மலர்", meaning: "Blossoming flower", gender: "girl" },
    { name: "Meenakshi", tamil: "மீனாட்சி", meaning: "Fish-eyed goddess", gender: "girl" },
  ],
  mi: [
    { name: "Mithran", tamil: "மித்ரன்", meaning: "Friend, the sun", gender: "boy" },
    { name: "Mihir", tamil: "மிஹிர்", meaning: "The sun", gender: "boy" },
    { name: "Mithra", tamil: "மித்ரா", meaning: "Companion of light", gender: "girl" },
    { name: "Minnal", tamil: "மின்னல்", meaning: "Lightning, brilliance", gender: "girl" },
  ],
  mu: [
    { name: "Mugilan", tamil: "முகிலன்", meaning: "Lord of clouds", gender: "boy" },
    { name: "Mukund", tamil: "முகுந்த்", meaning: "Giver of liberation", gender: "boy" },
    { name: "Muthu", tamil: "முத்து", meaning: "Pearl", gender: "boy" },
    { name: "Muthulakshmi", tamil: "முத்துலக்ஷ்மி", meaning: "Pearl of fortune", gender: "girl" },
    { name: "Mullai", tamil: "முல்லை", meaning: "Jasmine flower", gender: "girl" },
  ],
  me: [
    { name: "Meyyan", tamil: "மெய்யன்", meaning: "Truthful one", gender: "boy" },
    { name: "Meghan", tamil: "மேகன்", meaning: "Cloud", gender: "boy" },
    { name: "Meghana", tamil: "மேகனா", meaning: "Bearer of rain", gender: "girl" },
    { name: "Meghala", tamil: "மேகலா", meaning: "Girdle, ornament", gender: "girl" },
  ],
  mo: [
    { name: "Mohan", tamil: "மோகன்", meaning: "Enchanting", gender: "boy" },
    { name: "Mohit", tamil: "மோஹித்", meaning: "Charmed, captivated", gender: "boy" },
    { name: "Mohana", tamil: "மோகனா", meaning: "Charming melody", gender: "girl" },
    { name: "Monisha", tamil: "மோனிஷா", meaning: "Queen of the mind", gender: "girl" },
  ],
  ta: [
    { name: "Tarun", tamil: "தருண்", meaning: "Youthful", gender: "boy" },
    { name: "Tanish", tamil: "தனிஷ்", meaning: "Ambition, desire", gender: "boy" },
    { name: "Tanvi", tamil: "தன்வி", meaning: "Slender beauty", gender: "girl" },
    { name: "Tanuja", tamil: "தனுஜா", meaning: "Daughter", gender: "girl" },
  ],
  ti: [
    { name: "Tilak", tamil: "திலக்", meaning: "Auspicious mark", gender: "boy" },
    { name: "Tirumal", tamil: "திருமால்", meaning: "Lord Vishnu", gender: "boy" },
    { name: "Tirumalai", tamil: "திருமலை", meaning: "Sacred hill of Lord Venkatesha", gender: "boy" },
    { name: "Tishya", tamil: "திஷ்யா", meaning: "Auspicious star", gender: "girl" },
    { name: "Tilottama", tamil: "திலோத்தமா", meaning: "Celestial beauty", gender: "girl" },
  ],
  tu: [
    { name: "Tulasiram", tamil: "துளசிராம்", meaning: "Sacred basil of Rama", gender: "boy" },
    { name: "Tushar", tamil: "துஷார்", meaning: "Snow, frost", gender: "boy" },
    { name: "Tulasi", tamil: "துளசி", meaning: "Sacred basil", gender: "girl" },
    { name: "Tulika", tamil: "துலிகா", meaning: "Paintbrush, artistic", gender: "girl" },
  ],
  te: [
    { name: "Tejas", tamil: "தேஜஸ்", meaning: "Brilliance", gender: "boy" },
    { name: "Teeran", tamil: "தீரன்", meaning: "Brave one", gender: "boy" },
    { name: "Tejaswini", tamil: "தேஜஸ்வினி", meaning: "Radiant one", gender: "girl" },
    { name: "Tejal", tamil: "தேஜல்", meaning: "Radiant", gender: "girl" },
  ],
  to: [
    { name: "Tolan", tamil: "தோழன்", meaning: "Trusted friend", gender: "boy" },
    { name: "Tondaiman", tamil: "தொண்டைமான்", meaning: "Ancient Tamil chieftain title", gender: "boy" },
    { name: "Tolani", tamil: "தோழினி", meaning: "Trusted female friend", gender: "girl" },
  ],
  pa: [
    { name: "Pranav", tamil: "பிரணவ்", meaning: "Sacred Om", gender: "boy" },
    { name: "Parthiban", tamil: "பார்த்திபன்", meaning: "King, name of Arjuna", gender: "boy" },
    { name: "Pavithra", tamil: "பவித்ரா", meaning: "Pure", gender: "girl" },
    { name: "Padmavathi", tamil: "பத்மாவதி", meaning: "Lotus-like lady", gender: "girl" },
  ],
  pi: [
    { name: "Pithan", tamil: "பித்தன்", meaning: "Devotee of Shiva", gender: "boy" },
    { name: "Piriya", tamil: "பிரியா", meaning: "Beloved", gender: "girl" },
  ],
  pu: [
    { name: "Pugazhan", tamil: "புகழன்", meaning: "Renowned", gender: "boy" },
    { name: "Purushothaman", tamil: "புருஷோத்தமன்", meaning: "Supreme being (Vishnu)", gender: "boy" },
    { name: "Pushpa", tamil: "புஷ்பா", meaning: "Flower", gender: "girl" },
    { name: "Punitha", tamil: "புனிதா", meaning: "Pure, sacred", gender: "girl" },
  ],
  sha: [
    { name: "Shakthivel", tamil: "சக்திவேல்", meaning: "Spear of power", gender: "boy" },
    { name: "Shanmugam", tamil: "ஷண்முகம்", meaning: "Six-faced Lord Murugan", gender: "boy" },
    { name: "Shalini", tamil: "ஷாலினி", meaning: "Modest, praiseworthy", gender: "girl" },
    { name: "Sharanya", tamil: "ஷரண்யா", meaning: "Refuge, protector", gender: "girl" },
  ],
  na: [
    { name: "Naveen", tamil: "நவீன்", meaning: "Ever new", gender: "boy" },
    { name: "Narayanan", tamil: "நாராயணன்", meaning: "Lord Vishnu", gender: "boy" },
    { name: "Nandhini", tamil: "நந்தினி", meaning: "Daughter of joy", gender: "girl" },
    { name: "Nandhitha", tamil: "நந்திதா", meaning: "Delighted, pleased", gender: "girl" },
  ],
  tha: [
    { name: "Thamizhan", tamil: "தமிழன்", meaning: "Son of Tamil", gender: "boy" },
    { name: "Thanigaivel", tamil: "தணிகைவேல்", meaning: "Lord Murugan of Thanigai hill", gender: "boy" },
    { name: "Thamarai", tamil: "தாமரை", meaning: "Lotus", gender: "girl" },
    { name: "Tharani", tamil: "தரணி", meaning: "The earth", gender: "girl" },
  ],
  pe: [{ name: "Perarasu", tamil: "பேரரசு", meaning: "Great emperor", gender: "boy" }],
  po: [
    { name: "Ponnan", tamil: "பொன்னன்", meaning: "Golden one", gender: "boy" },
    { name: "Ponraj", tamil: "பொன்ராஜ்", meaning: "Golden king", gender: "boy" },
    { name: "Ponni", tamil: "பொன்னி", meaning: "Golden river", gender: "girl" },
    { name: "Ponvizhi", tamil: "பொன்விழி", meaning: "Golden eyes", gender: "girl" },
  ],
  ra: [
    { name: "Raghav", tamil: "ராகவ்", meaning: "Descendant of Raghu", gender: "boy" },
    { name: "Rajesh", tamil: "ராஜேஷ்", meaning: "King, ruler", gender: "boy" },
    { name: "Ramya", tamil: "ரம்யா", meaning: "Delightful", gender: "girl" },
    { name: "Radhika", tamil: "ராதிகா", meaning: "Beloved of Krishna", gender: "girl" },
  ],
  ri: [
    { name: "Rishab", tamil: "ரிஷப்", meaning: "Excellent, mighty", gender: "boy" },
    { name: "Rithvik", tamil: "ரித்விக்", meaning: "One who performs rituals", gender: "boy" },
    { name: "Rithika", tamil: "ரித்திகா", meaning: "Flowing stream of truth", gender: "girl" },
    { name: "Riya", tamil: "ரியா", meaning: "Singer", gender: "girl" },
  ],
  ru: [
    { name: "Rudran", tamil: "ருத்ரன்", meaning: "Form of Shiva", gender: "boy" },
    { name: "Rudresh", tamil: "ருத்ரேஷ்", meaning: "Lord of the Rudras", gender: "boy" },
    { name: "Rukmani", tamil: "ருக்மணி", meaning: "Radiant consort", gender: "girl" },
    { name: "Ruchi", tamil: "ருசி", meaning: "Taste, liking", gender: "girl" },
  ],
  re: [
    { name: "Revanth", tamil: "ரேவந்த்", meaning: "Son of the sun", gender: "boy" },
    { name: "Renganathan", tamil: "ரெங்கநாதன்", meaning: "Lord of Srirangam", gender: "boy" },
    { name: "Renuka", tamil: "ரேணுகா", meaning: "Mother of Parashurama", gender: "girl" },
    { name: "Revathi", tamil: "ரேவதி", meaning: "Wealthy, star name", gender: "girl" },
  ],
  ro: [
    { name: "Rohan", tamil: "ரோகன்", meaning: "Ascending", gender: "boy" },
    { name: "Rohit", tamil: "ரோஹித்", meaning: "Red, rising sun", gender: "boy" },
    { name: "Rohini", tamil: "ரோகிணி", meaning: "Star of growth", gender: "girl" },
    { name: "Roopa", tamil: "ரூபா", meaning: "Beautiful form", gender: "girl" },
  ],
  ni: [
    { name: "Nithilan", tamil: "நிதிலன்", meaning: "Pearl", gender: "boy" },
    { name: "Nikhil", tamil: "நிகில்", meaning: "Entire, complete", gender: "boy" },
    { name: "Nithya", tamil: "நித்யா", meaning: "Eternal", gender: "girl" },
    { name: "Nila", tamil: "நிலா", meaning: "Moon", gender: "girl" },
  ],
  nu: [
    { name: "Nuthan", tamil: "நூதன்", meaning: "Novel, fresh", gender: "boy" },
    { name: "Nupura", tamil: "நூபுரா", meaning: "Anklet", gender: "girl" },
  ],
  ne: [
    { name: "Nesan", tamil: "நேசன்", meaning: "Loving friend", gender: "boy" },
    { name: "Neelakandan", tamil: "நீலகண்டன்", meaning: "Blue-throated Shiva", gender: "boy" },
    { name: "Nesam", tamil: "நேசம்", meaning: "Affection", gender: "girl" },
    { name: "Neelaveni", tamil: "நீலவேணி", meaning: "Dark tresses", gender: "girl" },
  ],
  no: [{ name: "Nolan", tamil: "நோலன்", meaning: "Noble champion", gender: "boy" }],
  ya: [
    { name: "Yash", tamil: "யஷ்", meaning: "Fame, success", gender: "boy" },
    { name: "Yadhav", tamil: "யாதவ்", meaning: "Descendant of Yadu (Krishna)", gender: "boy" },
    { name: "Yazhini", tamil: "யாழினி", meaning: "Sweet as the yazh harp", gender: "girl" },
    { name: "Yamuna", tamil: "யமுனா", meaning: "Sacred river", gender: "girl" },
  ],
  yi: [{ name: "Yishan", tamil: "யிஷான்", meaning: "Blessed mountain", gender: "boy" }],
  yu: [
    { name: "Yuvan", tamil: "யுவன்", meaning: "Youthful, energetic", gender: "boy" },
    { name: "Yuvaraj", tamil: "யுவராஜ்", meaning: "Young prince", gender: "boy" },
    { name: "Yuvana", tamil: "யுவனா", meaning: "Young and bright", gender: "girl" },
    { name: "Yuktha", tamil: "யுக்தா", meaning: "Wisdom, cleverness", gender: "girl" },
  ],
  ye: [
    { name: "Yeshwanth", tamil: "யேஷ்வந்த்", meaning: "Glorious achiever", gender: "boy" },
    { name: "Yeshoda", tamil: "யசோதா", meaning: "Mother of Krishna", gender: "girl" },
  ],
  yo: [
    { name: "Yogan", tamil: "யோகன்", meaning: "Fortunate union", gender: "boy" },
    { name: "Yogesh", tamil: "யோகேஷ்", meaning: "Lord of yoga", gender: "boy" },
    { name: "Yogitha", tamil: "யோகிதா", meaning: "Disciplined one", gender: "girl" },
    { name: "Yogeshwari", tamil: "யோகேஸ்வரி", meaning: "Goddess of yoga", gender: "girl" },
  ],
  bha: [
    { name: "Bharath", tamil: "பரத்", meaning: "Upholder of the land", gender: "boy" },
    { name: "Bhaskar", tamil: "பாஸ்கர்", meaning: "The sun", gender: "boy" },
    { name: "Bhavana", tamil: "பாவனா", meaning: "Pure feeling", gender: "girl" },
    { name: "Bhairavi", tamil: "பைரவி", meaning: "Fierce goddess", gender: "girl" },
  ],
  bhi: [{ name: "Bhishan", tamil: "பீஷன்", meaning: "Formidable", gender: "boy" }],
  bhu: [
    { name: "Bhuvanesh", tamil: "புவனேஷ்", meaning: "Lord of the world", gender: "boy" },
    { name: "Bhuvana", tamil: "புவனா", meaning: "The living world", gender: "girl" },
    { name: "Bhoomika", tamil: "பூமிகா", meaning: "Of the earth", gender: "girl" },
  ],
  dha: [
    { name: "Dhanush", tamil: "தனுஷ்", meaning: "Divine bow", gender: "boy" },
    { name: "Dhananjay", tamil: "தனஞ்சய்", meaning: "Winner of wealth (Arjuna)", gender: "boy" },
    { name: "Dhanya", tamil: "தன்யா", meaning: "Blessed", gender: "girl" },
    { name: "Dhanalakshmi", tamil: "தனலட்சுமி", meaning: "Goddess of wealth", gender: "girl" },
  ],
  pha: [{ name: "Phanindra", tamil: "பணீந்திரா", meaning: "King of serpents", gender: "boy" }],
  dhha: [
    { name: "Dharan", tamil: "தரன்", meaning: "Bearer of the earth", gender: "boy" },
    { name: "Dhaatri", tamil: "தாத்ரி", meaning: "Nurturer, the earth", gender: "girl" },
  ],
  bhe: [{ name: "Bhemesh", tamil: "பேமேஷ்", meaning: "Mighty lord", gender: "boy" }],
  bho: [{ name: "Bhoopathi", tamil: "பூபதி", meaning: "King of the land", gender: "boy" }],
  ja: [
    { name: "Jayanth", tamil: "ஜெயந்த்", meaning: "Victorious", gender: "boy" },
    { name: "Jagadish", tamil: "ஜகதீஷ்", meaning: "Lord of the universe", gender: "boy" },
    { name: "Janani", tamil: "ஜனனி", meaning: "Mother of all", gender: "girl" },
    { name: "Jayanthi", tamil: "ஜெயந்தி", meaning: "Victory, anniversary", gender: "girl" },
  ],
  ji: [
    { name: "Jivan", tamil: "ஜீவன்", meaning: "Life itself", gender: "boy" },
    { name: "Jitesh", tamil: "ஜிதேஷ்", meaning: "Conqueror", gender: "boy" },
    { name: "Jithya", tamil: "ஜித்யா", meaning: "Ever-winning", gender: "girl" },
    { name: "Jivika", tamil: "ஜீவிகா", meaning: "Livelihood, life force", gender: "girl" },
  ],
  ju: [{ name: "Jugal", tamil: "ஜுகல்", meaning: "Inseparable pair", gender: "boy" }],
  je: [
    { name: "Jeyam", tamil: "ஜெயம்", meaning: "Victory", gender: "boy" },
    { name: "Jeevanandham", tamil: "ஜீவானந்தம்", meaning: "Bliss of life", gender: "boy" },
    { name: "Jenitha", tamil: "ஜெனிதா", meaning: "Born to win", gender: "girl" },
    { name: "Jeyalakshmi", tamil: "ஜெயலட்சுமி", meaning: "Goddess of victory", gender: "girl" },
  ],
  jo: [
    { name: "Jothiran", tamil: "ஜோதிரன்", meaning: "Bearer of light", gender: "boy" },
    { name: "Jothi", tamil: "ஜோதி", meaning: "Sacred flame", gender: "girl" },
    { name: "Jothsna", tamil: "ஜோத்ஸ்னா", meaning: "Moonlight", gender: "girl" },
  ],
  ga: [
    { name: "Ganesh", tamil: "கணேஷ்", meaning: "Lord of beginnings", gender: "boy" },
    { name: "Gajendran", tamil: "கஜேந்திரன்", meaning: "Lord of elephants", gender: "boy" },
    { name: "Gayathri", tamil: "காயத்ரி", meaning: "Sacred hymn", gender: "girl" },
    { name: "Gandhimathi", tamil: "காந்திமதி", meaning: "Fragrant wisdom", gender: "girl" },
  ],
  gi: [
    { name: "Girivasan", tamil: "கிரிவாசன்", meaning: "Dweller of hills", gender: "boy" },
    { name: "Girish", tamil: "கிரீஷ்", meaning: "Lord of mountains (Shiva)", gender: "boy" },
    { name: "Githanjali", tamil: "கீதாஞ்சலி", meaning: "Offering of songs", gender: "girl" },
    { name: "Girija", tamil: "கிரிஜா", meaning: "Daughter of the mountain (Parvati)", gender: "girl" },
  ],
  gu: [
    { name: "Gugan", tamil: "குகன்", meaning: "Lord Murugan of the cave", gender: "boy" },
    { name: "Gunasundari", tamil: "குணசுந்தரி", meaning: "One with virtuous beauty", gender: "girl" },
  ],
  ge: [
    { name: "Gejan", tamil: "கேஜன்", meaning: "Resounding fame", gender: "boy" },
    { name: "Geetha", tamil: "கீதா", meaning: "Song, the Bhagavad Gita", gender: "girl" },
  ],
  go: [
    { name: "Gopal", tamil: "கோபால்", meaning: "Protector of cows", gender: "boy" },
    { name: "Govindan", tamil: "கோவிந்தன்", meaning: "Lord Krishna", gender: "boy" },
    { name: "Gomathi", tamil: "கோமதி", meaning: "Radiant wisdom", gender: "girl" },
    { name: "Gowri", tamil: "கௌரி", meaning: "Fair goddess, Parvati", gender: "girl" },
  ],
  sa: [
    { name: "Sarvesh", tamil: "சர்வேஷ்", meaning: "Lord of all", gender: "boy" },
    { name: "Saravanan", tamil: "சரவணன்", meaning: "Lord Murugan, born in reeds", gender: "boy" },
    { name: "Sahana", tamil: "சஹானா", meaning: "Patient melody", gender: "girl" },
    { name: "Saranya", tamil: "சரண்யா", meaning: "Refuge", gender: "girl" },
  ],
  si: [
    { name: "Sivan", tamil: "சிவன்", meaning: "The auspicious one", gender: "boy" },
    { name: "Siddharth", tamil: "சித்தார்த்", meaning: "One who has achieved his goal", gender: "boy" },
    { name: "Sithara", tamil: "சிதாரா", meaning: "Star", gender: "girl" },
    { name: "Sindhu", tamil: "சிந்து", meaning: "River, ocean", gender: "girl" },
  ],
  su: [
    { name: "Suriya", tamil: "சூரியா", meaning: "The sun", gender: "boy" },
    { name: "Sundar", tamil: "சுந்தர்", meaning: "Beautiful one", gender: "boy" },
    { name: "Subhasri", tamil: "சுபஸ்ரீ", meaning: "Auspicious wealth", gender: "girl" },
    { name: "Sudha", tamil: "சுதா", meaning: "Nectar", gender: "girl" },
  ],
  se: [
    { name: "Sekar", tamil: "சேகர்", meaning: "Crest jewel", gender: "boy" },
    { name: "Senthil", tamil: "செந்தில்", meaning: "Lord Murugan", gender: "boy" },
    { name: "Selvi", tamil: "செல்வி", meaning: "Prosperous maiden", gender: "girl" },
    { name: "Selvarani", tamil: "செல்வராணி", meaning: "Queen of wealth", gender: "girl" },
  ],
  so: [
    { name: "Somesh", tamil: "சோமேஷ்", meaning: "Lord of the moon", gender: "boy" },
    { name: "Soundarajan", tamil: "சவுந்தரராஜன்", meaning: "King of beauty", gender: "boy" },
    { name: "Sowmiya", tamil: "சௌமியா", meaning: "Gentle grace", gender: "girl" },
    { name: "Sowmya", tamil: "சௌம்யா", meaning: "Gentle, pleasant", gender: "girl" },
  ],
  jha: [{ name: "Jhalan", tamil: "ஜலன்", meaning: "Sparkling water", gender: "boy" }],
  cha: [
    { name: "Chandran", tamil: "சந்திரன்", meaning: "The moon", gender: "boy" },
    { name: "Chandrasekar", tamil: "சந்திரசேகர்", meaning: "Moon-crested Shiva", gender: "boy" },
    { name: "Charumathi", tamil: "சாருமதி", meaning: "Beautiful intellect", gender: "girl" },
    { name: "Chandrika", tamil: "சந்திரிகா", meaning: "Moonlight", gender: "girl" },
  ],
  chi: [
    { name: "Chidambaram", tamil: "சிதம்பரம்", meaning: "Hall of consciousness", gender: "boy" },
    { name: "Chinmay", tamil: "சின்மய்", meaning: "Full of consciousness, bliss", gender: "boy" },
    { name: "Chithra", tamil: "சித்ரா", meaning: "Bright artwork", gender: "girl" },
    { name: "Chinmayi", tamil: "சின்மயி", meaning: "Full of consciousness", gender: "girl" },
  ],
};

/** Latin syllable (lowercase) -> Tamil syllable, flattened from the Avakahada pada table. */
const SYLLABLE_TAMIL_MAP: Record<string, string> = {};
for (const { latin, tamil } of PADA_SYLLABLES) {
  latin.forEach((l, i) => {
    SYLLABLE_TAMIL_MAP[l.toLowerCase()] = tamil[i];
  });
}

type SuffixEntry = { suf: string; tamilSuf: string; meaning: string };

/** Common Tamil/Sanskrit-Tamil name-forming endings, combined with each pada syllable to generate a large bank of names beyond the curated pool. */
const BOY_SUFFIXES: SuffixEntry[] = [
  { suf: "an", tamilSuf: "ன்", meaning: "Noble one" },
  { suf: "esh", tamilSuf: "ேஷ்", meaning: "Lord" },
  { suf: "ish", tamilSuf: "ீஷ்", meaning: "Supreme lord" },
  { suf: "raj", tamilSuf: "ராஜ்", meaning: "King" },
  { suf: "kumar", tamilSuf: "குமார்", meaning: "Prince" },
  { suf: "dev", tamilSuf: "தேவ்", meaning: "Divine one" },
  { suf: "nath", tamilSuf: "நாத்", meaning: "Protector, lord" },
  { suf: "vel", tamilSuf: "வேல்", meaning: "Spear-bearer, Lord Murugan" },
  { suf: "kanth", tamilSuf: "காந்த்", meaning: "Radiant, beloved" },
  { suf: "varman", tamilSuf: "வர்மன்", meaning: "Shield, protector" },
  { suf: "chandran", tamilSuf: "சந்திரன்", meaning: "Moon-like" },
  { suf: "prasad", tamilSuf: "பிரசாத்", meaning: "Divine gift" },
  { suf: "pathi", tamilSuf: "பதி", meaning: "Master, lord" },
  { suf: "eshwaran", tamilSuf: "ஈஸ்வரன்", meaning: "Supreme lord" },
  { suf: "moorthy", tamilSuf: "மூர்த்தி", meaning: "Form of the divine" },
  { suf: "samy", tamilSuf: "சாமி", meaning: "Lord, deity" },
  { suf: "bhushan", tamilSuf: "பூஷன்", meaning: "Ornament, jewel" },
  { suf: "sekaran", tamilSuf: "சேகரன்", meaning: "Crest, crown" },
  { suf: "anand", tamilSuf: "ஆனந்த்", meaning: "Bliss" },
  { suf: "karan", tamilSuf: "கரன்", meaning: "Doer, creator" },
  { suf: "veeran", tamilSuf: "வீரன்", meaning: "Brave warrior" },
  { suf: "selvan", tamilSuf: "செல்வன்", meaning: "Wealthy one" },
  { suf: "arasan", tamilSuf: "அரசன்", meaning: "King" },
  { suf: "mannan", tamilSuf: "மன்னன்", meaning: "Sovereign king" },
  { suf: "giri", tamilSuf: "கிரி", meaning: "Mountain" },
  { suf: "balan", tamilSuf: "பாலன்", meaning: "Young, strong one" },
  { suf: "narayan", tamilSuf: "நாராயண்", meaning: "The supreme being" },
  { suf: "prakash", tamilSuf: "பிரகாஷ்", meaning: "Brilliance, light" },
  { suf: "kannan", tamilSuf: "கண்ணன்", meaning: "Lord Krishna" },
  { suf: "murugan", tamilSuf: "முருகன்", meaning: "Lord Murugan" },
  { suf: "eswaran", tamilSuf: "ஈஸ்வரன்", meaning: "The supreme lord" },
  { suf: "vardhan", tamilSuf: "வர்தன்", meaning: "One who prospers" },
  { suf: "kirthan", tamilSuf: "கீர்தன்", meaning: "One who is praised" },
  { suf: "dharan", tamilSuf: "தரன்", meaning: "Bearer, upholder" },
  { suf: "jothi", tamilSuf: "ஜோதி", meaning: "Light, flame" },
  { suf: "kumaran", tamilSuf: "குமரன்", meaning: "Youthful prince" },
  { suf: "eshan", tamilSuf: "ேஷன்", meaning: "Lord, ruler" },
];

const GIRL_SUFFIXES: SuffixEntry[] = [
  { suf: "a", tamilSuf: "ா", meaning: "Graceful one" },
  { suf: "ika", tamilSuf: "இகா", meaning: "Little precious one" },
  { suf: "ini", tamilSuf: "இனி", meaning: "Sweetness" },
  { suf: "itha", tamilSuf: "ிதா", meaning: "One who gives" },
  { suf: "priya", tamilSuf: "பிரியா", meaning: "Beloved" },
  { suf: "devi", tamilSuf: "தேவி", meaning: "Goddess" },
  { suf: "kala", tamilSuf: "கலா", meaning: "Art, grace" },
  { suf: "mathi", tamilSuf: "மதி", meaning: "Wisdom" },
  { suf: "nayaki", tamilSuf: "நாயகி", meaning: "Queen, leading lady" },
  { suf: "sri", tamilSuf: "ஸ்ரீ", meaning: "Prosperity, radiance" },
  { suf: "lakshmi", tamilSuf: "லட்சுமி", meaning: "Goddess of wealth" },
  { suf: "vathi", tamilSuf: "வதி", meaning: "One who possesses" },
  { suf: "eshwari", tamilSuf: "ஈஸ்வரி", meaning: "Goddess" },
  { suf: "mozhi", tamilSuf: "மொழி", meaning: "Language, sweet speech" },
  { suf: "valli", tamilSuf: "வள்ளி", meaning: "Consort of Lord Murugan" },
  { suf: "bhavani", tamilSuf: "பவானி", meaning: "Goddess Parvati" },
  { suf: "kanni", tamilSuf: "கன்னி", meaning: "Maiden" },
  { suf: "selvi", tamilSuf: "செல்வி", meaning: "Prosperous maiden" },
  { suf: "mala", tamilSuf: "மாலா", meaning: "Garland" },
  { suf: "sundari", tamilSuf: "சுந்தரி", meaning: "Beautiful one" },
  { suf: "kodi", tamilSuf: "கொடி", meaning: "Creeper, banner" },
  { suf: "rani", tamilSuf: "ராணி", meaning: "Queen" },
  { suf: "bharathi", tamilSuf: "பாரதி", meaning: "Goddess of learning" },
  { suf: "anjali", tamilSuf: "அஞ்சலி", meaning: "Offering" },
  { suf: "amudha", tamilSuf: "அமுதா", meaning: "Nectar-sweet" },
  { suf: "vizhi", tamilSuf: "விழி", meaning: "Eyes" },
  { suf: "kanmani", tamilSuf: "கண்மணி", meaning: "Apple of the eye, precious one" },
  { suf: "nila", tamilSuf: "நிலா", meaning: "Moon" },
  { suf: "malar", tamilSuf: "மலர்", meaning: "Blossoming flower" },
  { suf: "kanya", tamilSuf: "கன்யா", meaning: "Maiden" },
  { suf: "amirtha", tamilSuf: "அமிர்தா", meaning: "Nectar of immortality" },
  { suf: "gowri", tamilSuf: "கௌரி", meaning: "Fair goddess, Parvati" },
  { suf: "chithra", tamilSuf: "சித்ரா", meaning: "Bright, picturesque" },
  { suf: "ranjani", tamilSuf: "ரஞ்சனி", meaning: "One who delights" },
  { suf: "vani", tamilSuf: "வாணி", meaning: "Goddess of speech" },
  { suf: "leka", tamilSuf: "லேகா", meaning: "Fine line, artistry" },
];

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Three or more vowels in a row reads unnaturally in Tamil phonotactics — reject those combinations. */
function hasVowelClash(word: string): boolean {
  return /[aeiou]{3,}/i.test(word);
}

/** Every syllable + suffix combination, filtered for length and vowel clashes, deduped against the curated pool. */
function buildGeneratedPool(): Record<string, PoolName[]> {
  const pool: Record<string, PoolName[]> = {};
  for (const syl of Object.keys(NAME_POOL)) {
    const tamilPrefix = SYLLABLE_TAMIL_MAP[syl] ?? "";
    const curatedLower = new Set(NAME_POOL[syl].map((n) => n.name.toLowerCase()));
    const entries: PoolName[] = [];
    const banks: [SuffixEntry[], "boy" | "girl"][] = [
      [BOY_SUFFIXES, "boy"],
      [GIRL_SUFFIXES, "girl"],
    ];
    for (const [bank, gender] of banks) {
      for (const { suf, tamilSuf, meaning } of bank) {
        const raw = syl + suf;
        if (raw.length < 4 || hasVowelClash(raw) || curatedLower.has(raw)) continue;
        entries.push({ name: capitalizeFirst(raw), tamil: tamilPrefix + tamilSuf, meaning, gender });
      }
    }
    pool[syl] = entries;
  }
  return pool;
}

const GENERATED_POOL = buildGeneratedPool();

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
  /**
   * When true, draws on the full generated name bank (every pada syllable, curated +
   * algorithmically generated) instead of just the curated birth-pada/preferred-letter
   * set — needed to reach large requested counts (500/1000/5000). Birth-pada and lucky
   * matches still rank first. Leave false for the default quality-curated view.
   */
  expandNames?: boolean;
}): BabyNamePrediction {
  const { nakshatraIndex, pada, psychicNumber, destinyNumber, preferredLetter, limitPerGender = Infinity, expandNames = false } = params;
  const syllables = PADA_SYLLABLES[nakshatraIndex];
  const birthSyllable = syllables.latin[pada - 1];
  const targets = new Set([psychicNumber, destinyNumber]);
  const luckyTotals = luckyNameTotals([psychicNumber, destinyNumber]);
  const letter = preferredLetter?.trim().toLowerCase() || undefined;

  const sourceSyllables = new Set(syllables.latin.map((s) => s.toLowerCase()));
  if (letter) {
    for (const key of Object.keys(NAME_POOL)) if (key.startsWith(letter)) sourceSyllables.add(key);
  }
  const searchSyllables = expandNames ? Object.keys(NAME_POOL) : Array.from(sourceSyllables);

  const all: BabyNameSuggestion[] = [];
  for (const syl of searchSyllables) {
    const pool = expandNames ? [...(NAME_POOL[syl] ?? []), ...(GENERATED_POOL[syl] ?? [])] : (NAME_POOL[syl] ?? []);
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
