import type { NameEntry } from "./namesDictionary";

/** Multi-character clusters normalized before single-character substitution — order matters (longest first). */
const CLUSTER_NORMALIZATION: [RegExp, string][] = [
  [/th|dh/g, "t"],
  [/sh|ch/g, "s"],
  [/ph|bh/g, "p"],
  [/gh|kh/g, "k"],
  [/ng|ny|nj/g, "n"],
  [/zh/g, "z"],
];

const CHAR_NORMALIZATION: [RegExp, string][] = [
  [/[gk]/g, "k"],
  [/[cs]/g, "s"],
  [/[bp]/g, "p"],
  [/[dt]/g, "t"],
  [/w/g, "v"],
  [/h/g, ""],
];

/** Reduces a romanized name to its consonant "skeleton" so near-miss spellings (e.g. extra/dropped vowels, th/dh) still match. */
export function consonantSkeleton(input: string): string {
  let s = input.toLowerCase().replace(/[^a-z]/g, "");
  for (const [pattern, replacement] of CLUSTER_NORMALIZATION) s = s.replace(pattern, replacement);
  s = s.replace(/[aeiou]/g, "");
  for (const [pattern, replacement] of CHAR_NORMALIZATION) s = s.replace(pattern, replacement);
  return s.replace(/(.)\1+/g, "$1");
}

/**
 * Same spelling-variant folding as consonantSkeleton, but keeping vowels. Vowel-stripped
 * skeletons of short names collapse fast (e.g. "samidurai" and "chandra" both reduce
 * toward 4-letter skeletons one edit apart) even though the words don't sound alike —
 * this fuller form is used as a sanity gate on top of the skeleton fuzzy match, below.
 */
function fullNormalized(input: string): string {
  let s = input.toLowerCase().replace(/[^a-z]/g, "");
  for (const [pattern, replacement] of CLUSTER_NORMALIZATION) s = s.replace(pattern, replacement);
  for (const [pattern, replacement] of CHAR_NORMALIZATION) s = s.replace(pattern, replacement);
  return s.replace(/(.)\1+/g, "$1");
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

export type DictionaryMatch = { native: string; alias: string; score: number };

/**
 * Ranks dictionary entries against a romanized query: exact alias match first,
 * then prefix matches, then fuzzy consonant-skeleton matches within a small
 * edit-distance budget. Lower `score` is a better match.
 */
export function matchDictionary(query: string, entries: NameEntry[], limit = 6): DictionaryMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const qSkeleton = consonantSkeleton(q);
  const qFull = fullNormalized(q);

  const results: DictionaryMatch[] = [];

  for (const entry of entries) {
    let best: DictionaryMatch | null = null;
    for (const alias of entry.aliases) {
      let score: number | null = null;
      const aliasSkeleton = consonantSkeleton(alias);
      const distance = levenshtein(qSkeleton, aliasSkeleton);
      const threshold = qSkeleton.length <= 4 ? 1 : 2;

      if (alias === q) {
        // Exact spelling match.
        score = 0;
      } else if (alias.startsWith(q)) {
        // Query is a prefix of a longer known name — normal incremental typing
        // (e.g. "sami" while aiming for "saminathan"). Always a confident match.
        score = 1 + (alias.length - q.length) * 0.05;
      } else if (q.startsWith(alias) && q.length - alias.length <= 2) {
        // Query is a short known alias plus a tiny trailing remainder (typo/suffix).
        score = 1.2 + (q.length - alias.length) * 0.1;
      } else if (distance <= threshold) {
        // Everything else falls back to the fuzzy consonant-skeleton distance, so a
        // close full-name match like "saminathi" -> "saminathan" isn't out-ranked by a
        // short alias that only explains a fraction of what was typed. But the skeleton
        // alone is too lossy for short names (all vowels gone, ch/sh/s merged) — e.g.
        // "samidurai" and "chandra" both reduce to 4-letter skeletons one edit apart
        // despite not sounding alike at all. Gate the fuzzy branch on full-word (vowels
        // kept) similarity too, so only genuine near-misses survive.
        const aliasFull = fullNormalized(alias);
        const fullDistance = levenshtein(qFull, aliasFull);
        const fullRatio = fullDistance / Math.max(qFull.length, aliasFull.length, 1);
        if (fullRatio <= 0.25) score = 3 + distance;
      }

      if (score !== null && (best === null || score < best.score)) {
        best = { native: entry.native, alias, score };
      }
    }
    if (best) results.push(best);
  }

  results.sort((a, b) => a.score - b.score);
  return results.slice(0, limit);
}
