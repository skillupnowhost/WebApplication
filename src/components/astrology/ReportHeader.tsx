import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";

export function ReportHeader({ pageLabel }: { pageLabel?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-amber-500/30 pb-4">
      <div className="flex items-center gap-2.5">
        <AnimatedMoonStar className="h-6 w-6" />
        <span className="celestial-glow-text text-sm font-bold tracking-wide uppercase">MyLoginn Astrology</span>
      </div>
      {pageLabel && <span className="text-xs text-muted">{pageLabel}</span>}
    </div>
  );
}
