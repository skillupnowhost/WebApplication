import tzLookup from "tz-lookup";
import { prisma } from "@/lib/prisma";

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  timezone: string;
  label: string;
};

/** Resolves a free-text birth place to coordinates + IANA timezone, caching results in GeocodeCache. */
export async function geocodePlace(query: string): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const cached = await prisma.geocodeCache.findUnique({ where: { query: trimmed } });
  if (cached) {
    return { latitude: cached.latitude, longitude: cached.longitude, timezone: cached.timezone, label: cached.label };
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url, { headers: { "User-Agent": "MyLoginn-Astrology/1.0 (contact: mailloginn@gmail.com)" } });
  if (!res.ok) return null;

  const results = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  const first = results[0];
  if (!first) return null;

  const latitude = Number(first.lat);
  const longitude = Number(first.lon);
  const timezone = tzLookup(latitude, longitude);
  const label = first.display_name;

  await prisma.geocodeCache.create({ data: { query: trimmed, latitude, longitude, timezone, label } });

  return { latitude, longitude, timezone, label };
}
