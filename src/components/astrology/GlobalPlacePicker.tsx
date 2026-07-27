"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";
import { PlaceAutocomplete, type PlacePick } from "./PlaceAutocomplete";

/**
 * Worldwide birth-place picker: free-text autocomplete over every city, town,
 * or village (via the geocode API's Nominatim search, no country restriction),
 * plus a manual latitude/longitude fallback for users who already know their
 * exact coordinates. Same onChange/onPick contract as PlaceAutocomplete, so it
 * drops into BirthDetailsForm/MatchForm without touching submit wiring.
 */
export function GlobalPlacePicker({
  lang,
  value,
  onChange,
  onPick,
  error,
}: {
  lang: AstrologyLanguage;
  value: string;
  onChange: (text: string) => void;
  onPick: (pick: PlacePick | null) => void;
  error?: string;
}) {
  const [manual, setManual] = useState(false);
  const [pick, setPick] = useState<PlacePick | null>(null);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);

  function handlePick(p: PlacePick | null) {
    setPick(p);
    onPick(p);
  }

  async function useManualCoordinates() {
    const latitude = Number(lat);
    const longitude = Number(lon);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      setManualError(t(lang, "placeLatRangeError"));
      return;
    }
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      setManualError(t(lang, "placeLonRangeError"));
      return;
    }
    setManualError(null);
    setResolving(true);
    try {
      const res = await fetch(`/api/astrology/geocode/reverse?lat=${latitude}&lon=${longitude}&lang=${lang}`);
      const json = (await res.json()) as { place?: PlacePick };
      const resolved: PlacePick = json.place ?? { label: `${latitude}, ${longitude}`, latitude, longitude, timezone: "UTC" };
      onChange(resolved.label);
      handlePick(resolved);
    } finally {
      setResolving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {!manual ? (
        <PlaceAutocomplete
          label=""
          value={value}
          onChange={onChange}
          onPick={handlePick}
          error={error}
          lang={lang}
          placeholder={t(lang, "placeSearchGlobal")}
          searchingText={t(lang, "placeSearching")}
          noResultsText={t(lang, "placeNoResults")}
        />
      ) : (
        <div className="flex flex-col gap-3 rounded-xl border border-border-soft bg-surface-2/40 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t(lang, "placeLatitude")}
              inputMode="decimal"
              placeholder="11.0168"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <Input
              label={t(lang, "placeLongitude")}
              inputMode="decimal"
              placeholder="76.9558"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
          </div>
          {manualError && <span className="text-xs font-medium text-danger">{manualError}</span>}
          <button
            type="button"
            onClick={useManualCoordinates}
            disabled={resolving || !lat || !lon}
            className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
          >
            {resolving ? t(lang, "placeSearching") : t(lang, "placeUseCoordinates")}
          </button>
        </div>
      )}

      {pick && (pick.country || pick.state || pick.district || pick.timezone) && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-surface-2/50 px-3 py-2 text-xs text-muted sm:grid-cols-4">
          {pick.country && (
            <div>
              <dt className="font-medium text-foreground">{t(lang, "placeCountry")}</dt>
              <dd>{pick.country}</dd>
            </div>
          )}
          {pick.state && (
            <div>
              <dt className="font-medium text-foreground">{t(lang, "placeState")}</dt>
              <dd>{pick.state}</dd>
            </div>
          )}
          {pick.district && (
            <div>
              <dt className="font-medium text-foreground">{t(lang, "placeDistrict")}</dt>
              <dd>{pick.district}</dd>
            </div>
          )}
          <div>
            <dt className="font-medium text-foreground">{t(lang, "placeTimezone")}</dt>
            <dd>{pick.timezone}</dd>
          </div>
        </dl>
      )}

      <button
        type="button"
        onClick={() => {
          setManual((m) => !m);
          setManualError(null);
        }}
        className="self-start text-xs font-medium text-brand-600 underline-offset-2 hover:underline"
      >
        {manual ? t(lang, "placeSearchInstead") : t(lang, "placeManualEntry")}
      </button>
    </div>
  );
}
