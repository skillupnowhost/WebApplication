import type { PlanetName } from "./constants";
import { luckyNameTotals } from "./babyNames";

/**
 * Lucky correspondences: classical planetary attributions keyed by the Moon-sign lord,
 * combined with the numerology psychic/destiny numbers for dates and years.
 */

const PLANET_LUCKY: Record<PlanetName, { day: string; direction: string; metal: string; gemstone: string; deity: string }> = {
  Sun: { day: "Sunday", direction: "East", metal: "Gold", gemstone: "Ruby (Manikkam)", deity: "Lord Surya / Lord Shiva" },
  Moon: { day: "Monday", direction: "North-west", metal: "Silver", gemstone: "Pearl (Muthu)", deity: "Lord Shiva / Goddess Parvati" },
  Mars: { day: "Tuesday", direction: "South", metal: "Copper", gemstone: "Red Coral (Pavalam)", deity: "Lord Murugan / Hanuman" },
  Mercury: { day: "Wednesday", direction: "North", metal: "Bronze", gemstone: "Emerald (Maragatham)", deity: "Lord Vishnu" },
  Jupiter: { day: "Thursday", direction: "North-east", metal: "Gold", gemstone: "Yellow Sapphire (Pushparagam)", deity: "Lord Dakshinamurthy" },
  Venus: { day: "Friday", direction: "South-east", metal: "Silver", gemstone: "Diamond (Vairam)", deity: "Goddess Lakshmi" },
  Saturn: { day: "Saturday", direction: "West", metal: "Iron", gemstone: "Blue Sapphire (Neelam)", deity: "Lord Shani / Lord Ayyappa" },
  Rahu: { day: "Saturday", direction: "South-west", metal: "Lead", gemstone: "Hessonite (Gomedhagam)", deity: "Goddess Durga" },
  Ketu: { day: "Tuesday", direction: "North-west", metal: "Mixed metal", gemstone: "Cat's Eye (Vaiduryam)", deity: "Lord Ganesha" },
};

export type LuckyProfile = {
  numbers: number[]; // psychic + destiny + resonant two-digit totals
  day: string;
  direction: string;
  metal: string;
  gemstone: string;
  deity: string;
  dates: number[]; // days of any month that reduce to a lucky digit
  months: string[]; // month names whose count reduces to a lucky digit
  years: number[]; // next favourable years
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function reduceDigit(n: number): number {
  let v = n;
  while (v > 9) v = String(v).split("").reduce((s, d) => s + Number(d), 0);
  return v;
}

export function computeLuckyProfile(params: {
  moonRashiLord: PlanetName;
  psychicNumber: number;
  destinyNumber: number;
  fromYear: number;
}): LuckyProfile {
  const { moonRashiLord, psychicNumber, destinyNumber, fromYear } = params;
  const targets = new Set([psychicNumber, destinyNumber]);
  const attr = PLANET_LUCKY[moonRashiLord];

  const dates: number[] = [];
  for (let d = 1; d <= 31; d++) if (targets.has(reduceDigit(d))) dates.push(d);

  const months = MONTHS.filter((_, i) => targets.has(reduceDigit(i + 1)));

  const years: number[] = [];
  for (let y = fromYear; y < fromYear + 12 && years.length < 5; y++) {
    if (targets.has(reduceDigit(y))) years.push(y);
  }

  return {
    numbers: [psychicNumber, destinyNumber, ...luckyNameTotals([psychicNumber, destinyNumber]).slice(0, 6)],
    day: attr.day,
    direction: attr.direction,
    metal: attr.metal,
    gemstone: attr.gemstone,
    deity: attr.deity,
    dates,
    months,
    years,
  };
}
