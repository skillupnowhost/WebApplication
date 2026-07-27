"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import type { AstrologyLanguage } from "@/lib/astrology/i18n";
import { cn } from "@/lib/cn";

/**
 * Free-text Kulam (clan/gotra) input with live DB-backed suggestions —
 * mirrors PlaceAutocomplete's debounce/dropdown pattern, minus the lat/lon pick.
 */
export function KulamInput({
  label,
  lang,
  value,
  onChange,
  error,
}: {
  label: string;
  lang: AstrologyLanguage;
  value: string;
  onChange: (text: string) => void;
  error?: string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    const q = value.trim();
    if (q.length < 1) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/astrology/kulam?q=${encodeURIComponent(q)}&lang=${lang}`);
        const json = (await res.json()) as { suggestions: string[] };
        setSuggestions(json.suggestions);
        setOpen(json.suggestions.length > 0);
        setHighlighted(-1);
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [value, lang]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(name: string) {
    skipNextFetch.current = true;
    onChange(name);
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
        error={error}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border-soft bg-surface shadow-xl"
          >
            {suggestions.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => pick(s)}
                  className={cn(
                    "block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-foreground transition-colors",
                    i === highlighted && "bg-surface-2"
                  )}
                >
                  {s}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
