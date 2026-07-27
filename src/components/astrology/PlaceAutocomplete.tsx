"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

export type PlacePick = {
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  state?: string;
  district?: string;
  placeId?: string;
};

/**
 * Free-text place input with live Nominatim suggestions (worldwide — any city,
 * town, or village). Selecting a suggestion also hands back coordinates +
 * timezone (+ country/state/district where available) so the server can skip
 * geocoding. Typing freely (no selection) still works — the API geocodes the
 * raw text. `lang` (if given) is forwarded to Nominatim's accept-language so
 * results prefer native-script names in the active report language.
 */
export function PlaceAutocomplete({
  label,
  value,
  onChange,
  onPick,
  error,
  placeholder,
  searchingText,
  noResultsText,
  lang,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  onPick: (pick: PlacePick | null) => void;
  error?: string;
  placeholder?: string;
  searchingText: string;
  noResultsText: string;
  lang?: string;
}) {
  const [suggestions, setSuggestions] = useState<PlacePick[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : "";
        const res = await fetch(`/api/astrology/geocode?q=${encodeURIComponent(q)}${langParam}`);
        const json = (await res.json()) as { suggestions: PlacePick[] };
        setSuggestions(json.suggestions);
        setOpen(true);
        setHighlighted(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      setSearching(false);
    };
  }, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(s: PlacePick) {
    skipNextFetch.current = true;
    onChange(s.label);
    onPick(s);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(suggestions.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      pick(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <Input
        label={label}
        value={value}
        placeholder={placeholder}
        error={error}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          onPick(null); // typed text invalidates any previously picked coordinates
        }}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      <AnimatePresence>
        {(open || searching) && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border-soft bg-surface shadow-xl"
          >
            {searching && <li className="px-4 py-2.5 text-sm text-muted">{searchingText}</li>}
            {!searching && open && suggestions.length === 0 && (
              <li className="px-4 py-2.5 text-sm text-muted">{noResultsText}</li>
            )}
            {!searching &&
              open &&
              suggestions.map((s, i) => (
                <li key={`${s.latitude},${s.longitude}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => pick(s)}
                    className={cn(
                      "block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-foreground transition-colors",
                      i === highlighted && "bg-surface-2"
                    )}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
