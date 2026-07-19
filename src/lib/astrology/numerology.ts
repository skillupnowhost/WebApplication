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

const LUCKY_COLORS: Record<number, string> = {
  1: "Gold / Orange", 2: "White / Cream", 3: "Yellow / Purple", 4: "Grey / Electric blue",
  5: "Emerald green", 6: "Blue / Pink", 7: "Sea green / White", 8: "Dark blue / Black", 9: "Red / Crimson",
};

function reduceToSingleDigit(n: number): number {
  let value = n;
  while (value > 9) {
    value = String(value)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return value;
}

export type NumerologyProfile = {
  psychicNumber: number; // "moolank" — reduced day of birth
  destinyNumber: number; // "bhagyank" — reduced full birth date
  nameNumber: number; // Chaldean-reduced full name
  luckyColor: string;
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

/** Chaldean number → ruling planet, the basis for lucky days/colors in the standalone report. */
export const NUMBER_PLANETS: Record<number, { planet: string; day: string }> = {
  1: { planet: "Sun", day: "Sunday" },
  2: { planet: "Moon", day: "Monday" },
  3: { planet: "Jupiter", day: "Thursday" },
  4: { planet: "Rahu", day: "Sunday" },
  5: { planet: "Mercury", day: "Wednesday" },
  6: { planet: "Venus", day: "Friday" },
  7: { planet: "Ketu", day: "Monday" },
  8: { planet: "Saturn", day: "Saturday" },
  9: { planet: "Mars", day: "Tuesday" },
};

/** Chaldean friendship table: numbers that harmonise with each root number (marriage/business compatibility). */
export const FRIENDLY_NUMBERS: Record<number, number[]> = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 3, 5],
  3: [1, 3, 6, 9],
  4: [1, 5, 6, 7],
  5: [1, 2, 5, 6],
  6: [3, 4, 5, 6, 9],
  7: [2, 4, 6, 7],
  8: [3, 4, 5, 8],
  9: [1, 3, 6, 9],
};

export type FullNumerologyProfile = NumerologyProfile & {
  lifePathNumber: number; // = destiny/bhagyank, from the full birth date
  soulNumber: number; // vowels of the name
  personalityNumber: number; // consonants of the name
  luckyNumbers: number[];
  luckyDates: number[]; // days of any month
  luckyDays: string[];
  luckyColors: string[];
  friendlyNumbers: number[]; // harmonious partners' root numbers
  rulingPlanets: { psychic: string; destiny: string };
};

function chaldeanSum(text: string, filter?: (ch: string) => boolean): number {
  return text
    .toLowerCase()
    .split("")
    .filter((ch) => (filter ? filter(ch) : true))
    .reduce((sum, ch) => sum + (CHALDEAN_MAP[ch] ?? 0), 0);
}

export type NameAnalysis = {
  name: string;
  chaldeanTotal: number;
  nameNumber: number;
  soulNumber: number;
  personalityNumber: number;
  isLucky: boolean; // name number reduces to the psychic or destiny number
};

/** Chaldean analysis of a list of candidate names against the person's birth numbers. */
export function analyzeNames(names: string[], psychicNumber: number, destinyNumber: number): NameAnalysis[] {
  const targets = new Set([psychicNumber, destinyNumber]);
  return names
    .map((raw) => raw.trim())
    .filter((name) => name.length > 1)
    .map((name) => {
      const chaldeanTotal = chaldeanSum(name);
      const nameNumber = reduceToSingleDigit(chaldeanTotal || 1);
      return {
        name,
        chaldeanTotal,
        nameNumber,
        soulNumber: reduceToSingleDigit(chaldeanSum(name, (ch) => VOWELS.has(ch)) || 1),
        personalityNumber: reduceToSingleDigit(chaldeanSum(name, (ch) => !VOWELS.has(ch)) || 1),
        isLucky: targets.has(nameNumber),
      };
    });
}

export function fullNumerologyProfile(fullName: string, birthDate: Date): FullNumerologyProfile {
  const base = numerologyProfile(fullName, birthDate);
  const soulNumber = reduceToSingleDigit(chaldeanSum(fullName, (ch) => VOWELS.has(ch)) || 1);
  const personalityNumber = reduceToSingleDigit(chaldeanSum(fullName, (ch) => !VOWELS.has(ch)) || 1);

  const targets = new Set([base.psychicNumber, base.destinyNumber]);
  const luckyDates: number[] = [];
  for (let d = 1; d <= 31; d++) if (targets.has(reduceToSingleDigit(d))) luckyDates.push(d);

  const luckyDays = [...new Set([NUMBER_PLANETS[base.psychicNumber].day, NUMBER_PLANETS[base.destinyNumber].day])];
  const luckyColors = [...new Set([LUCKY_COLORS[base.psychicNumber], LUCKY_COLORS[base.destinyNumber]])];
  const friendlyNumbers = [...new Set([...FRIENDLY_NUMBERS[base.psychicNumber], ...FRIENDLY_NUMBERS[base.destinyNumber]])].sort();

  return {
    ...base,
    lifePathNumber: base.destinyNumber,
    soulNumber,
    personalityNumber,
    luckyNumbers: [...targets].sort(),
    luckyDates,
    luckyDays,
    luckyColors,
    friendlyNumbers,
    rulingPlanets: {
      psychic: NUMBER_PLANETS[base.psychicNumber].planet,
      destiny: NUMBER_PLANETS[base.destinyNumber].planet,
    },
  };
}

export function numerologyProfile(fullName: string, birthDate: Date): NumerologyProfile {
  const day = birthDate.getUTCDate();
  const psychicNumber = reduceToSingleDigit(day);

  const dateDigits = `${birthDate.getUTCFullYear()}${birthDate.getUTCMonth() + 1}${day}`;
  const destinyNumber = reduceToSingleDigit(
    dateDigits.split("").reduce((sum, d) => sum + Number(d), 0)
  );

  const nameSum = fullName
    .toLowerCase()
    .split("")
    .reduce((sum, ch) => sum + (CHALDEAN_MAP[ch] ?? 0), 0);
  const nameNumber = reduceToSingleDigit(nameSum || 1);

  return {
    psychicNumber,
    destinyNumber,
    nameNumber,
    luckyColor: LUCKY_COLORS[destinyNumber] ?? LUCKY_COLORS[1],
  };
}
