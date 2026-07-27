"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";
import { AnimatedCalendarGlyph } from "@/components/ui/icons/AnimatedCalendarGlyph";
import { AnimatedClockGlyph } from "@/components/ui/icons/AnimatedClockGlyph";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import { cn } from "@/lib/cn";

/* Modern, premium date & time pickers for the astrology forms: a popover
   month calendar (with a one-tap month/year quick-jump so decades-back birth
   years stay a couple of clicks, not dozens of "previous month" presses, plus
   Today/Yesterday shortcuts) and a round analog clock-face time picker.
   Values stay "yyyy-MM-dd" / "HH:mm" strings so schemas and APIs are untouched.
   Exported names/props match the previous dropdown-based implementation so
   every call site (BirthDetailsForm, MatchForm, MuhurthamForm, NamingForm,
   NumerologyForm) needs no changes beyond this file's internals. */

const LOCALE: Record<AstrologyLanguage, string> = {
  en: "en", ta: "ta", hi: "hi", te: "te", ml: "ml", kn: "kn", bn: "bn", mr: "mr", gu: "gu", pa: "pa", ur: "ur",
};

function FieldShell({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-danger">{error}</span>}
    </div>
  );
}

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, onOutside: () => void) {
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onOutside();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [ref, onOutside]);
}

const triggerClass =
  "flex w-full cursor-pointer items-center gap-2 rounded-xl border border-border-soft bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors hover:border-amber-400/50 focus:ring-2 focus:ring-amber-400/30 disabled:cursor-not-allowed disabled:opacity-55";

const popoverClass =
  "absolute left-0 z-30 mt-1.5 w-[19rem] max-w-[92vw] rounded-2xl border border-border-soft bg-surface p-3 shadow-2xl";

const navBtnClass =
  "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground";

export function DateSelect({
  label,
  value,
  onChange,
  error,
  lang,
  years,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  lang: AstrologyLanguage;
  /** Selectable years, in display order. Defaults to current year back to 1920 (birth dates). */
  years?: number[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [quickJump, setQuickJump] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useOutsideClick(rootRef, () => setOpen(false));

  const currentYear = new Date().getFullYear();
  const yearList = useMemo(() => years ?? Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i), [years, currentYear]);
  const lo = Math.min(...yearList);
  const hi = Math.max(...yearList);

  const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const selYear = parsed ? Number(parsed[1]) : null;
  const selMonth = parsed ? Number(parsed[2]) : null;
  const selDay = parsed ? Number(parsed[3]) : null;

  const fallbackYear = Math.min(Math.max(currentYear, lo), hi);
  const [viewYear, setViewYear] = useState(selYear ?? fallbackYear);
  const [viewMonth, setViewMonth] = useState(selMonth ?? 1);

  useEffect(() => {
    if (!open) return;
    setViewYear(selYear ?? fallbackYear);
    setViewMonth(selMonth ?? 1);
    setQuickJump(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const monthNames = useMemo(
    () => Array.from({ length: 12 }, (_, m) => new Date(2000, m, 1).toLocaleString(LOCALE[lang] ?? "en", { month: "long" })),
    [lang]
  );
  const weekdayShort = useMemo(
    () => Array.from({ length: 7 }, (_, d) => new Date(2023, 0, 1 + d).toLocaleString(LOCALE[lang] ?? "en", { weekday: "narrow" })),
    [lang]
  );

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay();

  function commit(y: number, m: number, d: number) {
    onChange(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    setOpen(false);
  }

  function goToday() {
    const now = new Date();
    const y = Math.min(Math.max(now.getFullYear(), lo), hi);
    commit(y, now.getMonth() + 1, now.getDate());
  }
  function goYesterday() {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const y = Math.min(Math.max(now.getFullYear(), lo), hi);
    commit(y, now.getMonth() + 1, now.getDate());
  }

  function prevMonth() {
    if (viewMonth === 1) {
      if (viewYear - 1 < lo) return;
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else setViewMonth(viewMonth - 1);
  }
  function nextMonth() {
    if (viewMonth === 12) {
      if (viewYear + 1 > hi) return;
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else setViewMonth(viewMonth + 1);
  }

  const displayValue = selYear && selMonth && selDay ? `${selDay} ${monthNames[selMonth - 1]} ${selYear}` : "";
  const invalid = error ? true : undefined;

  return (
    <FieldShell label={label} error={error}>
      <div ref={rootRef} className="relative">
        <button type="button" disabled={disabled} aria-invalid={invalid} onClick={() => setOpen((o) => !o)} className={triggerClass}>
          <AnimatedCalendarGlyph className="h-4 w-4" />
          <span className={cn("flex-1 text-left", !displayValue && "text-muted")}>{displayValue || label}</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className={popoverClass}
            >
              <AnimatePresence mode="wait" initial={false}>
                {!quickJump ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <button type="button" onClick={prevMonth} className={navBtnClass} aria-label="Previous month">
                        <AnimatedChevron direction="left" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickJump(true)}
                        className="cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2 hover:text-amber-600"
                      >
                        {monthNames[viewMonth - 1]} {viewYear}
                      </button>
                      <button type="button" onClick={nextMonth} className={navBtnClass} aria-label="Next month">
                        <AnimatedChevron direction="right" className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted">
                      {weekdayShort.map((w, i) => (
                        <span key={i}>{w}</span>
                      ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-1">
                      {Array.from({ length: firstWeekday }).map((_, i) => (
                        <span key={`e${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                        const active = selYear === viewYear && selMonth === viewMonth && selDay === d;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => commit(viewYear, viewMonth, d)}
                            className={cn(
                              "aspect-square cursor-pointer rounded-lg text-xs font-medium transition-colors",
                              active ? "bg-amber-500 text-white shadow-sm" : "text-foreground hover:bg-surface-2"
                            )}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="quickJump"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="flex flex-col gap-2.5 py-1"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        aria-label={t(lang, "year")}
                        value={viewYear}
                        onChange={(e) => setViewYear(Number(e.target.value))}
                        className="cursor-pointer rounded-lg border border-border-soft bg-surface px-2 py-2 text-sm"
                      >
                        {yearList.map((yy) => (
                          <option key={yy} value={yy}>
                            {yy}
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label={t(lang, "month")}
                        value={viewMonth}
                        onChange={(e) => {
                          // Year → Month is the natural end of the quick-jump sequence:
                          // picking a month auto-returns to the calendar grid, no extra tap needed.
                          setViewMonth(Number(e.target.value));
                          setQuickJump(false);
                        }}
                        className="cursor-pointer rounded-lg border border-border-soft bg-surface px-2 py-2 text-sm"
                      >
                        {monthNames.map((name, i) => (
                          <option key={name} value={i + 1}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuickJump(false)}
                      className="cursor-pointer self-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-500/20"
                    >
                      {monthNames[viewMonth - 1]} {viewYear} ✓
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-3 flex gap-2 border-t border-border-soft pt-2.5">
                <button
                  type="button"
                  onClick={goToday}
                  className="flex-1 cursor-pointer rounded-lg bg-surface-2 px-2 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-amber-500/15 hover:text-amber-700"
                >
                  {t(lang, "today")}
                </button>
                <button
                  type="button"
                  onClick={goYesterday}
                  className="flex-1 cursor-pointer rounded-lg bg-surface-2 px-2 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-amber-500/15 hover:text-amber-700"
                >
                  {t(lang, "yesterday")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FieldShell>
  );
}

const CX = 90;
const CY = 84;
const R = 68;

function dialPos(index: number) {
  const angle = ((index * 30 - 90) * Math.PI) / 180;
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
}

export function TimeSelect({
  label,
  value,
  onChange,
  error,
  lang,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  lang: AstrologyLanguage;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const [typeInstead, setTypeInstead] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useOutsideClick(rootRef, () => setOpen(false));

  const parsed = /^(\d{2}):(\d{2})$/.exec(value);
  const h24 = parsed ? Number(parsed[1]) : null;
  const hour12 = h24 !== null ? ((h24 + 11) % 12) + 1 : null;
  const minute = parsed ? Number(parsed[2]) : null;
  const pm = h24 !== null && h24 >= 12;

  useEffect(() => {
    if (open) {
      setMode("hour");
      setTypeInstead(false);
    }
  }, [open]);

  function emit(h12: number, min: number, isPm: boolean) {
    let hh = h12 % 12;
    if (isPm) hh += 12;
    onChange(`${String(hh).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }

  function pickHour(h: number) {
    emit(h, minute ?? 0, pm);
    setMode("minute");
  }
  function pickMinute(m: number) {
    emit(hour12 ?? 12, m, pm);
    setOpen(false);
  }
  function togglePm(isPm: boolean) {
    emit(hour12 ?? 12, minute ?? 0, isPm);
  }

  const displayValue =
    h24 !== null && minute !== null
      ? `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${pm ? "PM" : "AM"}`
      : "";
  const invalid = error ? true : undefined;

  const hourMarks = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
  const minuteMarks = Array.from({ length: 12 }, (_, i) => i * 5);

  // Dial pointer: when the popover opens on an already-set value, this resolves
  // to that hour/minute immediately (both are derived straight from `value`,
  // not from state reset on open), so the hand and highlighted mark appear
  // pointing at the current time on first paint, not a neutral state.
  const activeHourIdx = hour12 !== null ? (hour12 === 12 ? 0 : hour12) : null;
  const activeMinuteIdx = minute !== null && minute % 5 === 0 ? minute / 5 : null;
  const activeDialIdx = mode === "hour" ? activeHourIdx : activeMinuteIdx;
  const handTarget = activeDialIdx !== null ? dialPos(activeDialIdx) : null;

  return (
    <FieldShell label={label} error={error}>
      <div ref={rootRef} className="relative">
        <button type="button" disabled={disabled} aria-invalid={invalid} onClick={() => setOpen((o) => !o)} className={triggerClass}>
          <AnimatedClockGlyph className="h-4 w-4" />
          <span className={cn("flex-1 text-left", !displayValue && "text-muted")}>{displayValue || label}</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className={cn(popoverClass, "flex flex-col items-center")}
            >
              <div className="mb-2 flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {hour12 !== null ? String(hour12).padStart(2, "0") : "--"}
                  <span className={cn(mode === "minute" && "text-amber-600")}>:{minute !== null ? String(minute).padStart(2, "0") : "--"}</span>
                </span>
                <div className="flex overflow-hidden rounded-full border border-border-soft bg-surface-2">
                  {(["AM", "PM"] as const).map((p) => {
                    const active = (p === "PM") === pm;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePm(p === "PM")}
                        className={cn(
                          "cursor-pointer px-2.5 py-1 text-xs font-semibold transition-colors",
                          active ? "bg-amber-500/15 text-amber-700" : "text-muted hover:text-foreground"
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!typeInstead ? (
                <>
                  <div className="mb-1 flex w-full justify-center gap-1.5 text-[11px] font-medium">
                    <button
                      type="button"
                      onClick={() => setMode("hour")}
                      className={cn("cursor-pointer rounded-full px-2.5 py-1", mode === "hour" ? "bg-amber-500/15 text-amber-700" : "text-muted")}
                    >
                      {t(lang, "hour")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("minute")}
                      className={cn("cursor-pointer rounded-full px-2.5 py-1", mode === "minute" ? "bg-amber-500/15 text-amber-700" : "text-muted")}
                    >
                      {t(lang, "minute")}
                    </button>
                  </div>
                  <svg viewBox="0 0 180 168" className="h-44 w-44">
                    <circle cx={CX} cy={CY} r={R + 16} className="fill-surface-2" />
                    {handTarget && (
                      <motion.line
                        x1={CX}
                        y1={CY}
                        animate={{ x2: handTarget.x, y2: handTarget.y }}
                        initial={false}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        className="stroke-amber-500/60"
                      />
                    )}
                    <circle cx={CX} cy={CY} r="2.5" className="fill-amber-500" />
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.g
                        key={mode}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        style={{ transformOrigin: `${CX}px ${CY}px` }}
                      >
                        {mode === "hour"
                          ? hourMarks.map((h) => {
                              const idx = h === 12 ? 0 : h;
                              const { x, y } = dialPos(idx);
                              const active = hour12 === h;
                              return (
                                <g key={h} onClick={() => pickHour(h)} className="cursor-pointer">
                                  <circle cx={x} cy={y} r="13" className={active ? "fill-amber-500" : "fill-surface transition-colors hover:fill-amber-500/20"} />
                                  <text x={x} y={y + 4} textAnchor="middle" className={cn("select-none text-[11px] font-semibold", active ? "fill-white" : "fill-foreground")}>
                                    {h}
                                  </text>
                                </g>
                              );
                            })
                          : minuteMarks.map((m, idx) => {
                              const { x, y } = dialPos(idx);
                              const active = minute === m;
                              return (
                                <g key={m} onClick={() => pickMinute(m)} className="cursor-pointer">
                                  <circle cx={x} cy={y} r="13" className={active ? "fill-amber-500" : "fill-surface transition-colors hover:fill-amber-500/20"} />
                                  <text x={x} y={y + 4} textAnchor="middle" className={cn("select-none text-[11px] font-semibold", active ? "fill-white" : "fill-foreground")}>
                                    {String(m).padStart(2, "0")}
                                  </text>
                                </g>
                              );
                            })}
                      </motion.g>
                    </AnimatePresence>
                  </svg>
                </>
              ) : (
                <div className="grid w-full grid-cols-2 gap-2 py-2">
                  <select
                    aria-label={t(lang, "hour")}
                    value={hour12 ?? ""}
                    onChange={(e) => emit(Number(e.target.value), minute ?? 0, pm)}
                    className="cursor-pointer rounded-lg border border-border-soft bg-surface px-2 py-2 text-sm"
                  >
                    <option value="" disabled>
                      {t(lang, "hour")}
                    </option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label={t(lang, "minute")}
                    value={minute ?? ""}
                    onChange={(e) => emit(hour12 ?? 12, Number(e.target.value), pm)}
                    className="cursor-pointer rounded-lg border border-border-soft bg-surface px-2 py-2 text-sm"
                  >
                    <option value="" disabled>
                      {t(lang, "minute")}
                    </option>
                    {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => setTypeInstead((v) => !v)}
                className="mt-2 cursor-pointer text-xs font-medium text-muted underline decoration-dotted underline-offset-2 hover:text-foreground"
              >
                {typeInstead ? "Use clock" : "Type instead"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FieldShell>
  );
}
