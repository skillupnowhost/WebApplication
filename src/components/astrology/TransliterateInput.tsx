"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { suggestionsFor, transliteratePreview, type NameSuggestion } from "@/lib/transliteration";
import { LANGUAGE_LABELS, type AstrologyLanguage } from "@/lib/astrology/i18n";
import { cn } from "@/lib/cn";

const PLAIN_LATIN = /^[a-zA-Z\s'.-]*$/;
const FAST_PATH_LANGS: AstrologyLanguage[] = ["ta", "ml"];

/**
 * Name input that transliterates as the user types once the astrology form's language
 * isn't English. Tamil/Malayalam use a fast local dictionary + phonetic engine (instant,
 * offline). Every other language (hi/te/kn/bn/mr/gu/pa/ur) calls a server-side LLM
 * transliteration route (debounced, cached) for real script coverage beyond the two
 * hand-built engines. For English it behaves as a plain text input.
 */
export function TransliterateInput({
  label,
  error,
  hint,
  placeholder,
  value,
  onChange,
  lang,
  id,
}: {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  lang: AstrologyLanguage;
  id?: string;
}) {
  const active = lang !== "en";
  const fastPath = FAST_PATH_LANGS.includes(lang);
  const [draft, setDraft] = useState(active && PLAIN_LATIN.test(value) ? value : "");
  const [manualPick, setManualPick] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [llmResult, setLlmResult] = useState("");
  const [llmLoading, setLlmLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);
  const prevLang = useRef(lang);
  const draftRef = useRef(draft);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  // Hand off a name typed while a Latin-script language was active straight into the draft
  // when the user switches to a script language, instead of discarding what they already typed.
  useEffect(() => {
    if (prevLang.current !== lang && active && !draft && value && PLAIN_LATIN.test(value)) {
      setDraft(value);
    }
    prevLang.current = lang;
  }, [lang, active, draft, value]);

  // LLM-assisted path: debounced call to the server transliteration route, cached there.
  useEffect(() => {
    if (!active || fastPath) return;
    const q = draft.trim();
    if (!q || q === llmResult) {
      // Empty draft, or the draft already IS the previously-applied result (e.g. right after
      // it was written back into the box below) — nothing new to look up.
      if (!q) setLlmResult("");
      return;
    }
    setLlmLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/astrology/transliterate?word=${encodeURIComponent(q)}&lang=${lang}`);
        const json = (await res.json()) as { result: string };
        setLlmResult(json.result);
        setHighlighted(-1);
        // Auto-confirm the single LLM candidate into both the real value and the visible box —
        // but only if the user hasn't typed further (or made an explicit pick) since this request went out.
        if (!manualPick && draftRef.current.trim() === q) {
          setDraft(json.result);
          onChange(json.result);
        }
      } catch {
        setLlmResult(q);
      } finally {
        setLlmLoading(false);
      }
    }, 450);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, llmResult, lang, active, fastPath]);

  if (!active) {
    return (
      <Input
        id={id}
        label={label}
        error={error}
        hint={hint}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  const scriptLang = lang as "ta" | "ml";
  const suggestions: NameSuggestion[] = fastPath && draft.trim() ? suggestionsFor(draft, scriptLang) : [];
  // Non-fast-path languages only ever get one LLM-backed candidate — surface it through the
  // same chip shape as the fast path so the UI (and keyboard nav) can treat both uniformly.
  const llmSuggestion: NameSuggestion | null =
    !fastPath && !llmLoading && llmResult && draft.trim() ? { value: llmResult, native: llmResult, alias: draft.trim() } : null;
  const visibleSuggestions: NameSuggestion[] = fastPath ? suggestions : llmSuggestion ? [llmSuggestion] : [];
  const autoValue = fastPath && draft.trim() ? transliteratePreview(draft, scriptLang) : llmResult;
  const committed = manualPick ?? autoValue;

  function commitDraft(next: string) {
    setDraft(next);
    setManualPick(null);
    setHighlighted(-1);
    setSuggestionsHidden(false);
    if (fastPath) onChange(next.trim() ? transliteratePreview(next, scriptLang) : "");
    // LLM path calls onChange itself once the debounced result resolves.
  }

  // Used for both the fast-path chip click and the LLM-path single-candidate chip. Updates the
  // visible box itself (not just the caption below it) so the picked value is actually shown —
  // typing again afterwards resumes normal draft/suggestion behavior via commitDraft above.
  function pick(suggestion: NameSuggestion) {
    setDraft(suggestion.value);
    setManualPick(suggestion.value);
    onChange(suggestion.value);
    setHighlighted(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestionsHidden || visibleSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(visibleSuggestions.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && highlighted < visibleSuggestions.length) {
        e.preventDefault();
        pick(visibleSuggestions[highlighted]);
      }
    } else if (e.key === "Escape") {
      setSuggestionsHidden(true);
      setHighlighted(-1);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={draft}
        placeholder={placeholder}
        onFocus={() => {
          setFocused(true);
          setSuggestionsHidden(false);
        }}
        onBlur={() => setFocused(false)}
        onChange={(e) => commitDraft(e.target.value)}
        onKeyDown={onKeyDown}
        aria-invalid={error ? true : undefined}
        className={cn(
          "w-full cursor-text rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted transition-all duration-200 outline-none",
          "hover:border-brand-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:focus:ring-brand-900/30",
          error && "border-danger focus:border-danger focus:ring-danger/10"
        )}
      />

      {(committed || llmLoading) && (
        <p className="flex items-baseline gap-1.5 truncate text-sm">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {LANGUAGE_LABELS[lang]}
          </span>
          {llmLoading && !fastPath ? (
            <span className="text-muted">…</span>
          ) : (
            <span className="truncate font-semibold text-brand-600 dark:text-brand-300">{committed}</span>
          )}
        </p>
      )}

      <AnimatePresence>
        {focused && !suggestionsHidden && visibleSuggestions.length > 0 && (
          <motion.div
            key="suggestion-chips"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex flex-wrap gap-1.5"
          >
            {visibleSuggestions.map((s, i) => (
              <button
                key={s.value + s.native}
                type="button"
                onMouseEnter={() => setHighlighted(i)}
                // onMouseDown (not onClick) fires before the input's onBlur, so the pick registers.
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(s);
                }}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1 text-sm font-medium transition-all duration-150",
                  committed === s.value || i === highlighted
                    ? "border-amber-400/60 bg-[color-mix(in_oklab,var(--color-amber-500)_12%,transparent)]"
                    : "border-border-soft bg-surface hover:border-amber-400/30"
                )}
              >
                {s.native}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error ? (
        <span className="text-xs font-medium text-danger">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </div>
  );
}
