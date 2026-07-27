import type { Scheme } from "./schemes/types";
import { tamilScheme } from "./schemes/tamil";
import { malayalamScheme } from "./schemes/malayalam";

export type TransliterationLanguage = "ta" | "ml";

const SCHEMES: Record<TransliterationLanguage, Scheme> = {
  ta: tamilScheme,
  ml: malayalamScheme,
};

/** Every token in a map, longest string first, so the tokenizer greedily matches "th" before "t". */
function sortedTokens(map: Record<string, string>): string[] {
  return Object.keys(map).sort((a, b) => b.length - a.length);
}

type CompiledScheme = Scheme & { consonantTokens: string[]; vowelTokens: string[] };

const compiled: Partial<Record<TransliterationLanguage, CompiledScheme>> = {};

function getCompiled(lang: TransliterationLanguage): CompiledScheme {
  const cached = compiled[lang];
  if (cached) return cached;
  const scheme = SCHEMES[lang];
  const result: CompiledScheme = {
    ...scheme,
    consonantTokens: sortedTokens(scheme.consonants),
    vowelTokens: sortedTokens(scheme.vowelSigns),
  };
  compiled[lang] = result;
  return result;
}

function matchAt(text: string, pos: number, tokens: string[]): string | null {
  for (const token of tokens) {
    if (text.startsWith(token, pos)) return token;
  }
  return null;
}

/**
 * Best-effort phonetic conversion of romanized text into Tamil/Malayalam script,
 * syllable by syllable (consonant + vowel sign, or a lone consonant closed with
 * a virama). Non-letter characters (spaces, digits, punctuation) pass through
 * unchanged, so multi-word names and sentences round-trip correctly.
 *
 * This is a phonetic approximation, not a dictionary lookup — for common names
 * prefer `transliterateName` in `./index.ts`, which checks a curated name list
 * first and only falls back to this engine for unrecognized input.
 */
export function phoneticTransliterate(input: string, lang: TransliterationLanguage): string {
  const scheme = getCompiled(lang);
  let out = "";
  let i = 0;

  while (i < input.length) {
    const consonant = matchAt(input, i, scheme.consonantTokens);
    if (consonant) {
      const afterConsonant = i + consonant.length;
      const vowel = matchAt(input, afterConsonant, scheme.vowelTokens);
      if (vowel) {
        const sign = scheme.vowelSigns[vowel];
        out += scheme.consonants[consonant] + sign;
        i = afterConsonant + vowel.length;
        continue;
      }
      // No vowel follows — close the syllable with a virama unless this
      // consonant is itself the very end of a word boundary followed by
      // another consonant cluster (still needs the virama either way).
      out += scheme.consonants[consonant] + scheme.virama;
      i = afterConsonant;
      continue;
    }

    const vowel = matchAt(input, i, scheme.vowelTokens);
    if (vowel) {
      out += scheme.independentVowels[vowel] ?? scheme.vowelSigns[vowel];
      i += vowel.length;
      continue;
    }

    // Unrecognized character (space, digit, punctuation) — pass through.
    out += input[i];
    i += 1;
  }

  return out;
}
