import type { AstrologyLanguage } from "@/lib/astrology/i18n";

/* Wraps each word in a deterministic rotation/baseline class (see .hw-jit-*
   in astrology-fonts.css) so the Traditional/handwritten report style avoids
   a robotic, identical-every-letter look. Jitter is applied per WORD, never
   per character — Indic scripts render conjuncts/vowel signs as shaped
   ligatures, so splitting a word into per-character spans would break glyph
   shaping. The class assignment is index-based (word index % 6), not
   Math.random(), so server render, client hydration, and the Playwright PDF
   render all produce byte-identical output. Urdu (Nastaliq) skips jitter
   entirely: the script's own cursive joining would be visually broken by
   forcing each word into its own inline-block. */
export function HandwrittenText({ text, lang }: { text: string; lang: AstrologyLanguage }) {
  if (lang === "ur") return <>{text}</>;

  const words = text.split(/(\s+)/);
  let wordIndex = 0;
  return (
    <>
      {words.map((chunk, i) => {
        if (/^\s+$/.test(chunk) || chunk === "") return <span key={i}>{chunk}</span>;
        const jit = wordIndex % 6;
        wordIndex += 1;
        return (
          <span key={i} className={`hw-word hw-jit-${jit}`}>
            {chunk}
          </span>
        );
      })}
    </>
  );
}
