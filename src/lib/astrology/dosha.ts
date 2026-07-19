import type { PlanetName } from "./constants";

export type DoshaPlanetInput = {
  planet: PlanetName;
  rashiIndex: number; // 0-11
};

export type DoshaFlag = {
  key: string;
  name: string;
  present: boolean;
  severity: "mild" | "moderate" | "strong" | null;
  explanation: string;
  remedies: string[];
};

function houseOf(rashiIndex: number, ascendantRashiIndex: number): number {
  return ((rashiIndex - ascendantRashiIndex + 12) % 12) + 1;
}

const MANGAL_HOUSES = new Set([1, 2, 4, 7, 8, 12]);

/** Mangal (Kuja) Dosha: Mars occupying houses 1, 2, 4, 7, 8, or 12 from the ascendant. */
export function checkMangalDosha(planets: DoshaPlanetInput[], ascendantRashiIndex: number): DoshaFlag {
  const mars = planets.find((p) => p.planet === "Mars");
  const house = mars ? houseOf(mars.rashiIndex, ascendantRashiIndex) : null;
  const present = house !== null && MANGAL_HOUSES.has(house);

  return {
    key: "mangal",
    name: "Mangal Dosha (Kuja Dosha)",
    present,
    severity: present ? (house === 7 || house === 8 ? "strong" : "moderate") : null,
    explanation: present
      ? `Mars is placed in house ${house} from the ascendant, one of the six houses classically associated with Mangal Dosha — this can bring friction or delay in marital harmony unless matched or pacified.`
      : "Mars does not occupy a Mangal Dosha house from the ascendant.",
    remedies: present
      ? [
          "Match with a partner who also carries Mangal Dosha (mutual cancellation).",
          "Worship Lord Hanuman on Tuesdays; recite the Hanuman Chalisa.",
          "Perform Kumbh Vivah or Mangal Shanti Puja before marriage, as advised by a family priest.",
          "Wear red coral (Moonga) only after consulting a qualified astrologer.",
        ]
      : [],
  };
}

/** Kaal Sarp Dosha: all seven classical planets hemmed on one side of the Rahu-Ketu axis. */
export function checkKaalSarpDosha(planets: DoshaPlanetInput[]): DoshaFlag {
  const rahu = planets.find((p) => p.planet === "Rahu");
  const ketu = planets.find((p) => p.planet === "Ketu");
  const classical = planets.filter((p) => !["Rahu", "Ketu"].includes(p.planet));

  let present = false;
  if (rahu && ketu && classical.length === 7) {
    const rahuLon = rahu.rashiIndex * 30;
    const inArc = (lon: number) => {
      const span = (lon - rahuLon + 360) % 360;
      return span <= 180;
    };
    const sides = classical.map((p) => inArc(p.rashiIndex * 30));
    present = sides.every((s) => s === sides[0]);
  }

  return {
    key: "kaalSarp",
    name: "Kaal Sarp Dosha",
    present,
    severity: present ? "moderate" : null,
    explanation: present
      ? "All seven classical planets fall on one side of the Rahu-Ketu axis, the classical signature of Kaal Sarp Dosha — often linked to a life theme of delayed but ultimately karmic rewards."
      : "The classical planets are not fully hemmed between Rahu and Ketu.",
    remedies: present
      ? [
          "Perform Kaal Sarp Dosha Nivaran Puja at a Rahu-Ketu-associated temple (e.g. Trimbakeshwar).",
          "Recite the Maha Mrityunjaya Mantra regularly.",
          "Donate food and clothing on Saturdays and Amavasya (new moon) days.",
        ]
      : [],
  };
}

/** Pitru Dosha: Rahu or Ketu occupying the 9th house (house of the father/ancestors), or Sun conjunct Rahu. */
export function checkPitruDosha(planets: DoshaPlanetInput[], ascendantRashiIndex: number): DoshaFlag {
  const rahu = planets.find((p) => p.planet === "Rahu");
  const ketu = planets.find((p) => p.planet === "Ketu");
  const sun = planets.find((p) => p.planet === "Sun");

  const nodeInNinth =
    (rahu && houseOf(rahu.rashiIndex, ascendantRashiIndex) === 9) ||
    (ketu && houseOf(ketu.rashiIndex, ascendantRashiIndex) === 9);
  const sunWithRahu = sun && rahu && sun.rashiIndex === rahu.rashiIndex;
  const present = Boolean(nodeInNinth || sunWithRahu);

  return {
    key: "pitru",
    name: "Pitru Dosha",
    present,
    severity: present ? (nodeInNinth && sunWithRahu ? "strong" : "moderate") : null,
    explanation: present
      ? nodeInNinth
        ? "Rahu/Ketu occupies the 9th house of ancestors — the classical indication of unresolved ancestral karma affecting fortune and lineage blessings."
        : "The Sun is conjunct Rahu, shadowing the significator of the father — a classical Pitru Dosha signature."
      : "Neither node afflicts the 9th house, and the Sun is free of Rahu's conjunction.",
    remedies: present
      ? [
          "Perform Tarpanam for ancestors on Amavasya (new moon) days.",
          "Offer food to elders, cows, and crows on Saturdays.",
          "Perform Pitru Paksha rites annually at a sacred river or temple tank.",
        ]
      : [],
  };
}

/** Guru Chandal Dosha: Jupiter sharing a sign with Rahu or Ketu. */
export function checkGuruChandalDosha(planets: DoshaPlanetInput[]): DoshaFlag {
  const jupiter = planets.find((p) => p.planet === "Jupiter");
  const rahu = planets.find((p) => p.planet === "Rahu");
  const ketu = planets.find((p) => p.planet === "Ketu");
  const withRahu = Boolean(jupiter && rahu && jupiter.rashiIndex === rahu.rashiIndex);
  const withKetu = Boolean(jupiter && ketu && jupiter.rashiIndex === ketu.rashiIndex);
  const present = withRahu || withKetu;

  return {
    key: "guruChandal",
    name: "Guru Chandal Dosha",
    present,
    severity: present ? (withRahu ? "moderate" : "mild") : null,
    explanation: present
      ? `Jupiter is conjunct ${withRahu ? "Rahu" : "Ketu"} — wisdom and judgement can be clouded by unconventional influences during Jupiter periods.`
      : "Jupiter is not conjunct either lunar node.",
    remedies: present
      ? [
          "Recite the Guru mantra (Om Gram Greem Groum Sah Gurave Namah) on Thursdays.",
          "Respect teachers and elders; offer yellow items (chana dal, turmeric) on Thursdays.",
          "Wear yellow sapphire only after professional astrological consultation.",
        ]
      : [],
  };
}

/** Kemadruma Dosha: no classical planet (besides the Sun) conjunct the Moon or in the 2nd/12th sign from it. */
export function checkKemadrumaDosha(planets: DoshaPlanetInput[]): DoshaFlag {
  const moon = planets.find((p) => p.planet === "Moon");
  const supporters = planets.filter((p) => !["Moon", "Sun", "Rahu", "Ketu"].includes(p.planet));
  let present = false;
  if (moon) {
    const neighbours = new Set([moon.rashiIndex, (moon.rashiIndex + 1) % 12, (moon.rashiIndex + 11) % 12]);
    present = !supporters.some((p) => neighbours.has(p.rashiIndex));
  }

  return {
    key: "kemadruma",
    name: "Kemadruma Dosha",
    present,
    severity: present ? "mild" : null,
    explanation: present
      ? "No classical planet supports the Moon from its own, 2nd, or 12th sign — classically linked to phases of emotional isolation that call for conscious community and routine."
      : "The Moon is supported by planets in its own or adjacent signs.",
    remedies: present
      ? [
          "Worship Lord Shiva with milk abhishekam on Mondays.",
          "Wear a pearl (Moti) in silver only after professional consultation.",
          "Keep a regular moon-facing meditation or fasting practice on full-moon days.",
        ]
      : [],
  };
}

/** Shani Dosha: Saturn occupying the 1st or 8th house from the ascendant. */
export function checkShaniDosha(planets: DoshaPlanetInput[], ascendantRashiIndex: number): DoshaFlag {
  const saturn = planets.find((p) => p.planet === "Saturn");
  const house = saturn ? houseOf(saturn.rashiIndex, ascendantRashiIndex) : null;
  const present = house === 1 || house === 8;

  return {
    key: "shani",
    name: "Shani Dosha",
    present,
    severity: present ? (house === 8 ? "moderate" : "mild") : null,
    explanation: present
      ? `Saturn occupies house ${house} from the ascendant — periods of Saturn can bring heavier responsibility, delay, and tests of endurance.`
      : "Saturn does not occupy the 1st or 8th house from the ascendant.",
    remedies: present
      ? [
          "Light a sesame-oil lamp before Lord Shani or Hanuman on Saturdays.",
          "Donate black sesame, iron, or blankets to the needy on Saturdays.",
          "Recite the Shani Gayatri or Hanuman Chalisa regularly.",
        ]
      : [],
  };
}

export function computeDoshas(planets: DoshaPlanetInput[], ascendantRashiIndex: number): DoshaFlag[] {
  return [
    checkMangalDosha(planets, ascendantRashiIndex),
    checkKaalSarpDosha(planets),
    checkPitruDosha(planets, ascendantRashiIndex),
    checkGuruChandalDosha(planets),
    checkKemadrumaDosha(planets),
    checkShaniDosha(planets, ascendantRashiIndex),
  ];
}
