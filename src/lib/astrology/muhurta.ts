import { DateTime } from "luxon";
import type { PlanetName } from "./constants";

/**
 * Day-muhurta engine: all windows are derived from the local sunrise/sunset by the
 * classical fixed weekday rules — Rahu Kalam / Yamagandam / Gulikai (eighths of daylight),
 * Abhijit (the 8th of 15 day-muhurtas), planetary horas, and the Choghadiya sequence.
 */

export type TimeWindow = {
  key: string;
  label: string;
  start: string; // ISO local
  end: string;
  kind: "auspicious" | "inauspicious" | "neutral";
};

// Zero-based daylight-eighth index per weekday (0 = Sunday .. 6 = Saturday).
const RAHU_SEGMENT = [7, 1, 6, 4, 5, 3, 2];
const YAMA_SEGMENT = [4, 3, 2, 1, 0, 6, 5];
const GULIKA_SEGMENT = [6, 5, 4, 3, 2, 1, 0];

const HORA_SEQUENCE: PlanetName[] = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];
const BENEFIC_HORA = new Set<PlanetName>(["Jupiter", "Venus", "Mercury", "Moon"]);

const CHOGHADIYA_ORDER = ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"] as const;
const CHOGHADIYA_DAY_START = [0, 3, 6, 2, 5, 1, 4]; // index into CHOGHADIYA_ORDER per weekday (Sun..Sat)
const CHOGHADIYA_KIND: Record<(typeof CHOGHADIYA_ORDER)[number], TimeWindow["kind"]> = {
  Amrit: "auspicious", Shubh: "auspicious", Labh: "auspicious", Chal: "neutral",
  Udveg: "inauspicious", Kaal: "inauspicious", Rog: "inauspicious",
};

function segmentWindow(sunrise: DateTime, dayLengthMin: number, index: number, parts: number): { start: DateTime; end: DateTime } {
  const span = dayLengthMin / parts;
  return { start: sunrise.plus({ minutes: span * index }), end: sunrise.plus({ minutes: span * (index + 1) }) };
}

export type DayMuhurta = {
  rahuKalam: TimeWindow;
  yamagandam: TimeWindow;
  gulikai: TimeWindow;
  abhijit: TimeWindow;
  auspiciousHoras: TimeWindow[]; // benefic-lord horas of the daylight hours ("nalla neram")
  choghadiya: TimeWindow[]; // all 8 daylight choghadiya windows
};

export function computeDayMuhurta(sunriseIso: string, sunsetIso: string): DayMuhurta {
  const sunrise = DateTime.fromISO(sunriseIso, { setZone: true });
  const sunset = DateTime.fromISO(sunsetIso, { setZone: true });
  const dayLengthMin = sunset.diff(sunrise, "minutes").minutes;
  const weekday = sunrise.weekday % 7; // luxon 1=Mon..7=Sun -> 0=Sun..6=Sat

  const toWindow = (key: string, label: string, w: { start: DateTime; end: DateTime }, kind: TimeWindow["kind"]): TimeWindow => ({
    key, label, start: w.start.toISO()!, end: w.end.toISO()!, kind,
  });

  const rahuKalam = toWindow("rahuKalam", "Rahu Kalam", segmentWindow(sunrise, dayLengthMin, RAHU_SEGMENT[weekday], 8), "inauspicious");
  const yamagandam = toWindow("yamagandam", "Yamagandam", segmentWindow(sunrise, dayLengthMin, YAMA_SEGMENT[weekday], 8), "inauspicious");
  const gulikai = toWindow("gulikai", "Gulikai Kalam", segmentWindow(sunrise, dayLengthMin, GULIKA_SEGMENT[weekday], 8), "inauspicious");
  const abhijit = toWindow("abhijit", "Abhijit Muhurta", segmentWindow(sunrise, dayLengthMin, 7, 15), "auspicious");

  // Daylight horas: 12 equal parts, first hora ruled by the weekday lord, then the fixed hora sequence.
  const weekdayLords: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const startIdx = HORA_SEQUENCE.indexOf(weekdayLords[weekday]);
  const horaSpan = dayLengthMin / 12;
  const auspiciousHoras: TimeWindow[] = [];
  for (let i = 0; i < 12; i++) {
    const lord = HORA_SEQUENCE[(startIdx + i) % 7];
    if (!BENEFIC_HORA.has(lord)) continue;
    auspiciousHoras.push(
      toWindow(`hora-${i}`, `${lord} Hora`, { start: sunrise.plus({ minutes: horaSpan * i }), end: sunrise.plus({ minutes: horaSpan * (i + 1) }) }, "auspicious")
    );
  }

  const choghadiya: TimeWindow[] = Array.from({ length: 8 }, (_, i) => {
    const name = CHOGHADIYA_ORDER[(CHOGHADIYA_DAY_START[weekday] + i) % 7];
    return toWindow(`chog-${i}`, name, segmentWindow(sunrise, dayLengthMin, i, 8), CHOGHADIYA_KIND[name]);
  });

  return { rahuKalam, yamagandam, gulikai, abhijit, auspiciousHoras, choghadiya };
}
