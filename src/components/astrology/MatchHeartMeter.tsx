"use client";

import { AnimatedHeart } from "@/components/ui/icons/AnimatedHeart";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";

export function MatchHeartMeter({
  totalPoints,
  maxPoints,
  verdict,
  lang,
}: {
  totalPoints: number;
  maxPoints: number;
  verdict: string;
  lang: AstrologyLanguage;
}) {
  const fraction = maxPoints > 0 ? totalPoints / maxPoints : 0;
  const percent = Math.round(fraction * 100);
  const stars = Math.round(fraction * 10 * 10) / 10;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-40 w-40 sm:h-48 sm:w-48">
        <AnimatedHeart className="h-full w-full drop-shadow-[0_10px_28px_rgba(244,63,94,0.35)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 text-center">
          <span className="text-4xl font-bold text-white drop-shadow-sm sm:text-5xl">{percent}%</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-white/90">{t(lang, "scorePercent")}</span>
        </div>
      </div>

      <div className="grid w-full max-w-xs grid-cols-3 gap-2.5 text-center">
        <div className="celestial-card rounded-xl px-2 py-2.5">
          <p className="celestial-glow-text text-lg font-bold">
            {percent}
            <span className="text-xs font-medium text-muted">/100</span>
          </p>
          <p className="mt-0.5 text-[10px] font-medium leading-tight text-muted">{t(lang, "scoreOutOf100")}</p>
        </div>
        <div className="celestial-card rounded-xl px-2 py-2.5">
          <p className="celestial-glow-text text-lg font-bold">{percent}%</p>
          <p className="mt-0.5 text-[10px] font-medium leading-tight text-muted">{t(lang, "scorePercent")}</p>
        </div>
        <div className="celestial-card rounded-xl px-2 py-2.5">
          <p className="celestial-glow-text text-lg font-bold">
            {stars}
            <span className="text-xs font-medium text-muted">/10 ★</span>
          </p>
          <p className="mt-0.5 text-[10px] font-medium leading-tight text-muted">{t(lang, "scoreStars")}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700">
          {t(lang, "totalScoreLabel")}: {totalPoints}/{maxPoints}
        </span>
        <span className="rounded-full bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-700">{verdict}</span>
      </div>
    </div>
  );
}
