import { phoneticTransliterate, type TransliterationLanguage } from "./engine";
import { TAMIL_NAMES, MALAYALAM_NAMES } from "./namesDictionary";
import { matchDictionary } from "./match";

export type { TransliterationLanguage } from "./engine";

function dictionaryFor(lang: TransliterationLanguage) {
  return lang === "ta" ? TAMIL_NAMES : MALAYALAM_NAMES;
}

/**
 * A confident dictionary hit wins over the phonetic guess; otherwise falls back
 * to the engine. The threshold (4.5) admits exact/prefix matches (score < 2) and
 * close fuzzy matches (distance-1, score 4) — e.g. "saminathi" -> சாமிநாதன் — while
 * still excluding weak two-edit fuzzy guesses, which stay available as chips only.
 */
function bestGuessForWord(word: string, lang: TransliterationLanguage): string {
  if (!word) return "";
  const [top] = matchDictionary(word, dictionaryFor(lang), 1);
  if (top && top.score <= 4.5) return top.native;
  return phoneticTransliterate(word, lang);
}

/** Live best-effort preview of the whole field, word by word — used to render the input's ghost/primary conversion. */
export function transliteratePreview(input: string, lang: TransliterationLanguage): string {
  return input
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) ? part : bestGuessForWord(part, lang)))
    .join("");
}

export type NameSuggestion = { value: string; native: string; alias: string };

/**
 * Suggestions for the word currently being typed (the last whitespace-delimited
 * token) — earlier words in a multi-word name are locked to their own best
 * guess so completed words don't jump around while the user keeps typing.
 * Combines curated-name matches (dictionary, fuzzy-tolerant) with a phonetic
 * fallback so there's always at least one usable suggestion.
 */
export function suggestionsFor(input: string, lang: TransliterationLanguage): NameSuggestion[] {
  const trailingSpace = /\s$/.test(input);
  const words = input.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lastWord = words[words.length - 1];
  const lockedPrefix = words
    .slice(0, -1)
    .map((w) => bestGuessForWord(w, lang))
    .join(" ");
  const prefix = lockedPrefix ? `${lockedPrefix} ` : "";
  const suffix = trailingSpace ? " " : "";

  const seen = new Set<string>();
  const results: NameSuggestion[] = [];

  for (const match of matchDictionary(lastWord, dictionaryFor(lang), 5)) {
    if (seen.has(match.native)) continue;
    seen.add(match.native);
    results.push({ value: `${prefix}${match.native}${suffix}`, native: match.native, alias: match.alias });
  }

  const phonetic = phoneticTransliterate(lastWord, lang);
  if (phonetic && !seen.has(phonetic)) {
    results.push({ value: `${prefix}${phonetic}${suffix}`, native: phonetic, alias: lastWord });
  }

  return results.slice(0, 6);
}
