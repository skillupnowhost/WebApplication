import { NextResponse } from "next/server";
import tzLookup from "tz-lookup";
import type { PlaceSuggestion } from "../route";

/**
 * Resolves a manually-entered lat/lon pair to a timezone + human label (and
 * country/state/district where Nominatim's reverse lookup has data), for the
 * "enter coordinates manually" fallback in GlobalPlacePicker.
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const lang = params.get("lang")?.trim() || "en";

  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const timezone = tzLookup(lat, lon);
  const fallback: PlaceSuggestion = { label: `${lat.toFixed(4)}, ${lon.toFixed(4)}`, latitude: lat, longitude: lon, timezone };

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", `${lang},en`);

  try {
    const res = await fetch(url, { headers: { "User-Agent": "MyLoginn-Astrology/1.0 (contact: mailloginn@gmail.com)" } });
    if (!res.ok) return NextResponse.json({ place: fallback });

    const json = (await res.json()) as {
      place_id?: number;
      display_name?: string;
      address?: { country?: string; state?: string; state_district?: string; county?: string; district?: string };
    };
    const a = json.address ?? {};
    const place: PlaceSuggestion = {
      label: json.display_name || fallback.label,
      latitude: lat,
      longitude: lon,
      timezone,
      country: a.country,
      state: a.state || a.state_district,
      district: a.county || a.state_district || a.district,
      placeId: json.place_id != null ? String(json.place_id) : undefined,
    };
    return NextResponse.json({ place });
  } catch {
    return NextResponse.json({ place: fallback });
  }
}
