import * as Astronomy from "astronomy-engine";

/** Lahiri (Chitrapaksha) ayanamsa, degrees, at the 2000-01-01T12:00 TT epoch. */
const AYANAMSA_AT_J2000 = 23.85328;

/** General precession rate of the equinoxes, arcsec/year, converted to degrees/year. */
const PRECESSION_DEG_PER_YEAR = 50.2388475 / 3600;

/**
 * Linear approximation of the Lahiri ayanamsa (tropical → sidereal correction).
 * Accurate to within a few arcminutes across recent centuries — sufficient for
 * rashi/nakshatra-level astrology, not for sub-arcsecond ephemeris work.
 */
export function lahiriAyanamsa(date: Date): number {
  const julianCenturiesTT = new Astronomy.AstroTime(date).tt / 36525;
  const yearsSinceJ2000 = julianCenturiesTT * 100;
  return AYANAMSA_AT_J2000 + yearsSinceJ2000 * PRECESSION_DEG_PER_YEAR;
}

export function toSidereal(tropicalLongitudeDeg: number, ayanamsaDeg: number): number {
  const sidereal = tropicalLongitudeDeg - ayanamsaDeg;
  return sidereal < 0 ? sidereal + 360 : sidereal % 360;
}
