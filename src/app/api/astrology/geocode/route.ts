import { NextResponse } from "next/server";
import tzLookup from "tz-lookup";

export type PlaceSuggestion = {
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

// Module-level cache: Nominatim asks for politeness, and users often type the same prefixes.
const cache = new Map<string, PlaceSuggestion[]>();

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) return NextResponse.json({ suggestions: [] });

  const key = q.toLowerCase();
  const cached = cache.get(key);
  if (cached) return NextResponse.json({ suggestions: cached });

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "5");

  try {
    const res = await fetch(url, { headers: { "User-Agent": "MyLoginn-Astrology/1.0 (contact: mailloginn@gmail.com)" } });
    if (!res.ok) return NextResponse.json({ suggestions: [] });

    const results = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
    const suggestions: PlaceSuggestion[] = results.map((r) => {
      const latitude = Number(r.lat);
      const longitude = Number(r.lon);
      return { label: r.display_name, latitude, longitude, timezone: tzLookup(latitude, longitude) };
    });

    if (cache.size > 500) cache.clear();
    cache.set(key, suggestions);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
