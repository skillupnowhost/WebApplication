import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";

/** "MyLoginn Astrology" masthead — appears at the top of every report style and as page 1 of the print/PDF output. */
export function ReportHeader({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-soft pb-4">
      <div className="flex items-center gap-3">
        <AnimatedMoonStar className="h-9 w-9" />
        <div>
          <p className="text-lg font-bold leading-tight">
            MyLoginn <span className="brand-gradient-text">Astrology</span>
          </p>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Divine Self-Insight</p>
    </div>
  );
}
