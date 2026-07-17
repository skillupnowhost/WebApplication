const MASTER_NUMBERS = [11, 22, 33];

function digitSum(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

/** Reduces to a single digit, except it stops early on a master number (11/22/33). */
function reduceToLifeNumber(n: number): number {
  let value = n;
  while (value > 9 && !MASTER_NUMBERS.includes(value)) {
    value = digitSum(value);
  }
  return value;
}

/** Life-path number from the birth date's digit sum. */
export function lifePathNumber(birthDate: Date): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  const total = digitSum(day) + digitSum(month) + digitSum(year);
  return reduceToLifeNumber(total);
}

/** Chaldean numerology letter values — 9 is deliberately unassigned in this system. */
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

/** Destiny/name number via Chaldean numerology, reduced the same way as the life-path number. */
export function nameNumber(fullName: string): number {
  const total = fullName
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .reduce((sum, letter) => sum + (CHALDEAN_MAP[letter] ?? 0), 0);
  return reduceToLifeNumber(total);
}

const LUCKY_COLORS: Record<number, string> = {
  1: "Gold", 2: "White", 3: "Yellow", 4: "Grey", 5: "Green",
  6: "Blue", 7: "Violet", 8: "Dark blue", 9: "Red", 11: "Silver", 22: "Copper", 33: "Turquoise",
};

export function numerologyProfile(fullName: string, birthDate: Date) {
  const lifePath = lifePathNumber(birthDate);
  const destiny = nameNumber(fullName);
  return {
    lifePath,
    destiny,
    luckyNumber: lifePath,
    luckyColor: LUCKY_COLORS[lifePath] ?? LUCKY_COLORS[reduceToLifeNumber(lifePath)],
  };
}
