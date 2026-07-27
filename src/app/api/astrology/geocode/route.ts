import { NextResponse } from "next/server";
import tzLookup from "tz-lookup";
import { randomUUID } from "crypto";

export type PlaceSuggestion = {
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  state?: string;
  district?: string;
  placeId?: string;
};

type NominatimAddress = {
  country?: string;
  state?: string;
  state_district?: string;
  county?: string;
  district?: string;
};

type NominatimResult = {
  place_id?: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
};

// Module-level cache: Nominatim asks for politeness, and users often type the same prefixes.
// Also shields the (metered) Google path from repeat lookups within the same server lifetime.
const cache = new Map<string, PlaceSuggestion[]>();

function fromNominatim(r: NominatimResult): PlaceSuggestion {
  const latitude = Number(r.lat);
  const longitude = Number(r.lon);
  const a = r.address ?? {};
  return {
    label: r.display_name,
    latitude,
    longitude,
    timezone: tzLookup(latitude, longitude),
    country: a.country,
    state: a.state || a.state_district,
    district: a.county || a.state_district || a.district,
    placeId: r.place_id != null ? String(r.place_id) : undefined,
  };
}

async function fetchNominatimSuggestions(q: string, lang: string): Promise<PlaceSuggestion[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "6");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", `${lang},en`);

  const res = await fetch(url, { headers: { "User-Agent": "MyLoginn-Astrology/1.0 (contact: mailloginn@gmail.com)" } });
  if (!res.ok) return [];

  const results = (await res.json()) as NominatimResult[];
  return results.map(fromNominatim);
}

// ---------------------------------------------------------------------------
// Google Places path (only used when GOOGLE_MAPS_API_KEY is configured).
//
// Google's Places Autocomplete response has no lat/lng — the normal Google
// flow defers that to a follow-up "Place Details" call made only for the one
// prediction the user finally picks. This app's contract is different: every
// row rendered in the dropdown (PlaceAutocomplete.tsx) already carries
// lat/lon/timezone so a click needs zero extra network round-trip. To keep
// that contract without touching the client, we resolve all (up to 6)
// predictions in parallel using the Geocoding API's place_id lookup, which
// returns geometry + address_components in the same call — simpler than
// wiring a per-prediction Place Details (New) request and billed under the
// separate Geocoding SKU rather than Details, so it doesn't interfere with
// the Autocomplete session-token pricing below.
// ---------------------------------------------------------------------------

type GoogleAutocompletePrediction = {
  place_id: string;
  description: string;
};

type GoogleAutocompleteResponse = {
  status: string;
  predictions?: GoogleAutocompletePrediction[];
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GoogleGeocodeResult = {
  formatted_address: string;
  address_components?: GoogleAddressComponent[];
  geometry: { location: { lat: number; lng: number } };
};

type GoogleGeocodeResponse = {
  status: string;
  results?: GoogleGeocodeResult[];
};

// Soft bias only (southwest lat,lng | northeast lat,lng) — Google's `bounds` param nudges
// ranking toward India without excluding results elsewhere, since birth places are worldwide.
const INDIA_BOUNDS = "6.5,68.0|37.5,97.5";

function fromGoogleGeocode(placeId: string, fallbackLabel: string, r: GoogleGeocodeResult): PlaceSuggestion {
  const latitude = r.geometry.location.lat;
  const longitude = r.geometry.location.lng;
  const comps = r.address_components ?? [];
  const find = (...types: string[]) => comps.find((c) => types.some((t) => c.types.includes(t)))?.long_name;
  return {
    label: r.formatted_address || fallbackLabel,
    latitude,
    longitude,
    timezone: tzLookup(latitude, longitude),
    country: find("country"),
    state: find("administrative_area_level_1"),
    district: find("administrative_area_level_2", "administrative_area_level_3", "locality"),
    placeId,
  };
}

/**
 * Resolves suggestions via Google Places Autocomplete + per-prediction Geocoding lookups.
 * Throws on hard failures (network error, non-2xx, or a Google error status) so the caller
 * can fall back to Nominatim; returns [] only for a legitimate "no matches" result.
 */
async function fetchGoogleSuggestions(q: string, lang: string, apiKey: string): Promise<PlaceSuggestion[]> {
  // One session token per query: a full session lifecycle (reused across keystrokes until a
  // final Details call) isn't practical in a stateless route, and since lat/lng here come from
  // the Geocoding API rather than Place Details, the Autocomplete+Details session discount
  // doesn't apply to this flow anyway. A fresh UUID per request is a reasonable, simple choice.
  const sessionToken = randomUUID();

  const acUrl = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  acUrl.searchParams.set("input", q);
  acUrl.searchParams.set("key", apiKey);
  acUrl.searchParams.set("language", lang);
  acUrl.searchParams.set("sessiontoken", sessionToken);
  acUrl.searchParams.set("bounds", INDIA_BOUNDS);

  const acRes = await fetch(acUrl);
  if (!acRes.ok) throw new Error(`Google Autocomplete HTTP ${acRes.status}`);
  const acJson = (await acRes.json()) as GoogleAutocompleteResponse;
  if (acJson.status === "ZERO_RESULTS") return [];
  if (acJson.status !== "OK") throw new Error(`Google Autocomplete status ${acJson.status}`);

  const predictions = (acJson.predictions ?? []).slice(0, 6);
  if (predictions.length === 0) return [];

  const resolved = await Promise.all(
    predictions.map(async (p): Promise<PlaceSuggestion | null> => {
      try {
        const geoUrl = new URL("https://maps.googleapis.com/maps/api/geocode/json");
        geoUrl.searchParams.set("place_id", p.place_id);
        geoUrl.searchParams.set("key", apiKey);
        geoUrl.searchParams.set("language", lang);

        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok) return null;
        const geoJson = (await geoRes.json()) as GoogleGeocodeResponse;
        const first = geoJson.results?.[0];
        if (geoJson.status !== "OK" || !first) return null;

        return fromGoogleGeocode(p.place_id, p.description, first);
      } catch {
        return null;
      }
    })
  );

  return resolved.filter((s): s is PlaceSuggestion => s !== null);
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const q = params.get("q")?.trim() ?? "";
  const lang = params.get("lang")?.trim() || "en";
  if (q.length < 3) return NextResponse.json({ suggestions: [] });

  const key = `${lang}:${q.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached) return NextResponse.json({ suggestions: cached });

  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    let suggestions: PlaceSuggestion[];
    if (googleApiKey) {
      try {
        suggestions = await fetchGoogleSuggestions(q, lang, googleApiKey);
      } catch {
        // Google failed hard (quota, network, bad status) — degrade to Nominatim rather than
        // leaving the search box empty for the user mid-typing.
        suggestions = await fetchNominatimSuggestions(q, lang);
      }
    } else {
      // No key configured: behavior is unchanged from before Google support was added.
      suggestions = await fetchNominatimSuggestions(q, lang);
    }

    if (cache.size > 500) cache.clear();
    cache.set(key, suggestions);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
