"use client";

import { useEffect, useMemo, useState } from "react";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";
import { cn } from "@/lib/cn";

/* Easy, responsive date & time pickers for the astrology forms: plain
   dropdowns instead of the native mm/dd/yyyy calendar (painful for birth
   years decades back) and a 12-hour Hour/Minute + AM/PM row instead of
   the native --:-- widget. Values stay "yyyy-MM-dd" / "HH:mm" strings so
   schemas and APIs are untouched. Month names come from the platform's
   Intl data in the active report language. */

const LOCALE: Record<AstrologyLanguage, string> = { en: "en", ta: "ta", hi: "hi", te: "te", ml: "ml" };

const selectClass =
  "astro-compact w-full cursor-pointer rounded-xl border border-border-soft bg-surface text-sm text-foreground outline-none";

function FieldShell({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-danger">{error}</span>}
    </div>
  );
}

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
  const currentYear = new Date().getFullYear();
  const yearList = useMemo(
    () => years ?? Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i),
    [years, currentYear]
  );
  const months = useMemo(
    () => Array.from({ length: 12 }, (_, m) => new Date(2000, m, 1).toLocaleString(LOCALE[lang] ?? "en", { month: "long" })),
    [lang]
  );

  const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const [pYear, pMon, pDay] = parsed ? [parsed[1], parsed[2], parsed[3]] : ["", "", ""];
  const [day, setDay] = useState(pDay);
  const [mon, setMon] = useState(pMon);
  const [year, setYear] = useState(pYear);
  useEffect(() => {
    setDay(pDay);
    setMon(pMon);
    setYear(pYear);
  }, [pDay, pMon, pYear]);

  const daysInMonth = mon && year ? new Date(Number(year), Number(mon), 0).getDate() : 31;

  function update(nd: string, nm: string, ny: string) {
    let dd = nd;
    if (dd && nm && ny) {
      const maxDay = new Date(Number(ny), Number(nm), 0).getDate();
      if (Number(dd) > maxDay) dd = String(maxDay).padStart(2, "0");
    }
    setDay(dd);
    setMon(nm);
    setYear(ny);
    if (dd && nm && ny) onChange(`${ny}-${nm}-${dd}`);
  }

  const invalid = error ? true : undefined;
  return (
    <FieldShell label={label} error={error}>
      <div className="grid grid-cols-[1fr_1.5fr_1.1fr] gap-2">
        <select
          aria-label={t(lang, "day")}
          aria-invalid={invalid}
          className={selectClass}
          value={day}
          disabled={disabled}
          onChange={(e) => update(e.target.value, mon, year)}
        >
          <option value="">{t(lang, "day")}</option>
          {Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, "0")).map((dd) => (
            <option key={dd} value={dd}>
              {Number(dd)}
            </option>
          ))}
        </select>
        <select
          aria-label={t(lang, "month")}
          aria-invalid={invalid}
          className={selectClass}
          value={mon}
          disabled={disabled}
          onChange={(e) => update(day, e.target.value, year)}
        >
          <option value="">{t(lang, "month")}</option>
          {months.map((name, i) => (
            <option key={name} value={String(i + 1).padStart(2, "0")}>
              {name}
            </option>
          ))}
        </select>
        <select
          aria-label={t(lang, "year")}
          aria-invalid={invalid}
          className={selectClass}
          value={year}
          disabled={disabled}
          onChange={(e) => update(day, mon, e.target.value)}
        >
          <option value="">{t(lang, "year")}</option>
          {yearList.map((yy) => (
            <option key={yy} value={String(yy)}>
              {yy}
            </option>
          ))}
        </select>
      </div>
    </FieldShell>
  );
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
  const parsed = /^(\d{2}):(\d{2})$/.exec(value);
  const h24 = parsed ? Number(parsed[1]) : null;
  const pHour = h24 !== null ? String(((h24 + 11) % 12) + 1) : "";
  const pMin = parsed ? parsed[2] : "";
  const pPm = h24 !== null && h24 >= 12;

  const [hour, setHour] = useState(pHour);
  const [minute, setMinute] = useState(pMin);
  const [pm, setPm] = useState(pPm);
  useEffect(() => {
    setHour(pHour);
    setMinute(pMin);
    setPm(pPm);
  }, [pHour, pMin, pPm]);

  function emit(h: string, min: string, isPm: boolean) {
    setHour(h);
    setMinute(min);
    setPm(isPm);
    if (!h) return;
    const mm = min || "00";
    let hh = Number(h) % 12;
    if (isPm) hh += 12;
    onChange(`${String(hh).padStart(2, "0")}:${mm}`);
  }

  const invalid = error ? true : undefined;
  return (
    <FieldShell label={label} error={error}>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
        <select
          aria-label={t(lang, "hour")}
          aria-invalid={invalid}
          className={selectClass}
          value={hour}
          disabled={disabled}
          onChange={(e) => emit(e.target.value, minute, pm)}
        >
          <option value="">{t(lang, "hour")}</option>
          {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <select
          aria-label={t(lang, "minute")}
          aria-invalid={invalid}
          className={selectClass}
          value={minute}
          disabled={disabled}
          onChange={(e) => emit(hour, e.target.value, pm)}
        >
          <option value="">{t(lang, "minute")}</option>
          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <div
          className={cn(
            "flex overflow-hidden rounded-xl border border-border-soft bg-surface",
            disabled && "pointer-events-none opacity-55"
          )}
        >
          {(["AM", "PM"] as const).map((p) => {
            const active = (p === "PM") === pm;
            return (
              <button
                key={p}
                type="button"
                disabled={disabled}
                onClick={() => emit(hour, minute, p === "PM")}
                className={cn(
                  "cursor-pointer px-3 text-sm font-semibold transition-colors duration-200",
                  active ? "bg-amber-500/15 text-amber-700" : "text-muted hover:text-foreground"
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    </FieldShell>
  );
}
