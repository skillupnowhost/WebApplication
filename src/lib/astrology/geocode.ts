import tzLookup from "tz-lookup";
import { prisma } from "@/lib/prisma";
import { CONTACT_EMAIL } from "@/lib/contactInfo";

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  timezone: string;
  label: string;
};

type NominatimResult = { lat: string; lon: string; display_name: string };

/** Resolves a free-text birth place to coordinates + IANA timezone, caching by query so we respect Nominatim's rate limit. */
export async function geocodeBirthPlace(place: string): Promise<GeocodeResult | null> {
  const query = place.trim();
  if (!query) return null;
  const cacheKey = query.toLowerCase();

  const cached = await prisma.geocodeCache.findUnique({ where: { query: cacheKey } });
  if (cached) {
    return { latitude: cached.latitude, longitude: cached.longitude, timezone: cached.timezone, label: cached.label };
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url, {
    headers: { "User-Agent": `MyLoginn-Astrology/1.0 (${CONTACT_EMAIL})` },
  });
  if (!res.ok) return null;

  const results = (await res.json()) as NominatimResult[];
  const first = results[0];
  if (!first) return null;

  const latitude = parseFloat(first.lat);
  const longitude = parseFloat(first.lon);
  const timezone = tzLookup(latitude, longitude);

  await prisma.geocodeCache.upsert({
    where: { query: cacheKey },
    create: { query: cacheKey, latitude, longitude, timezone, label: first.display_name },
    update: { latitude, longitude, timezone, label: first.display_name },
  });

  return { latitude, longitude, timezone, label: first.display_name };
}
