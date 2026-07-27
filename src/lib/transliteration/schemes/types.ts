/** A romanized token (e.g. "th", "ng", "aa") mapped to its native-script glyph. Longer tokens are tried first. */
export type TokenMap = Record<string, string>;

export type Scheme = {
  /** Consonant clusters, inherent-vowel form (e.g. "th" -> த meaning "tha"). Keys sorted longest-first at lookup time. */
  consonants: TokenMap;
  /** Vowel signs (matras) that attach to a consonant, replacing its inherent "a". Empty string key not included — inherent vowel needs no sign. */
  vowelSigns: TokenMap;
  /** Independent vowel glyphs, used at the start of a syllable with no preceding consonant. */
  independentVowels: TokenMap;
  /** Virama / pulli — strips a consonant's inherent vowel when it closes a syllable with no following vowel. */
  virama: string;
};
