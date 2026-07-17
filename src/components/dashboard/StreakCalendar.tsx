"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import { AnimatedFlame } from "@/components/ui/icons/AnimatedFlame";
import { cn } from "@/lib/cn";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Props = {
  /** "YYYY-MM-DD" keys of days the user was active, ascending. */
  activeDays: string[];
  /** Today's key in the platform timezone, computed server-side. */
  todayKey: string;
  currentStreak: number;
  longestStreak: number;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const gridVariants = {
  center: { transition: { staggerChildren: 0.012 } },
};

const cellVariants = {
  enter: { opacity: 0, scale: 0.6 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const } },
};

export function StreakCalendar({ activeDays, todayKey, currentStreak, longestStreak }: Props) {
  const [ty, tm] = todayKey.split("-").map(Number);
  const [view, setView] = useState({ year: ty, month: tm }); // month is 1-based
  const [direction, setDirection] = useState(0);

  const activeSet = useMemo(() => new Set(activeDays), [activeDays]);

  const earliest = activeDays[0] ?? todayKey;
  const [ey, em] = earliest.split("-").map(Number);
  const atEarliest = view.year === ey && view.month === em;
  const atCurrent = view.year === ty && view.month === tm;

  const moveMonth = (delta: number) => {
    setDirection(delta);
    setView((v) => {
      const next = new Date(v.year, v.month - 1 + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() + 1 };
    });
  };

  const firstWeekday = new Date(view.year, view.month - 1, 1).getDay();
  const daysInMonth = new Date(view.year, view.month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${view.year}-${view.month}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="text-sm font-semibold"
          >
            {MONTHS[view.month - 1]} {view.year}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center gap-1">
          <NavButton onClick={() => moveMonth(-1)} disabled={atEarliest} label="Previous month">
            <AnimatedChevron direction="left" className="h-3.5 w-3.5" />
          </NavButton>
          <NavButton onClick={() => moveMonth(1)} disabled={atCurrent} label="Next month">
            <AnimatedChevron direction="right" className="h-3.5 w-3.5" />
          </NavButton>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center sm:gap-1.5">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-1 text-[9px] font-semibold uppercase tracking-wide text-muted sm:text-[10px]">
            {d}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${view.year}-${view.month}`}
          initial={{ opacity: 0, x: direction * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          variants={gridVariants}
          className="grid grid-cols-7 gap-1 sm:gap-1.5"
        >
          {cells.map((day, i) => {
            if (day === null) return <span key={`pad-${i}`} />;
            const key = `${view.year}-${pad(view.month)}-${pad(day)}`;
            const isActive = activeSet.has(key);
            const isToday = key === todayKey;
            const isFuture = key > todayKey;
            const col = i % 7;
            const prevKey = `${view.year}-${pad(view.month)}-${pad(day - 1)}`;
            const chained = col > 0 && day > 1 && isActive && activeSet.has(prevKey);

            return (
              <div key={key} className="relative flex aspect-square items-center justify-center">
                {chained && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-[60%] w-[75%] -translate-y-1/2 bg-brand-500/50"
                    style={{ left: "-37.5%" }}
                  />
                )}
                <motion.span
                  variants={cellVariants}
                  whileHover={!isActive && !isFuture ? { scale: 1.12 } : undefined}
                  title={isActive ? `Active on ${day} ${MONTHS[view.month - 1].slice(0, 3)}` : undefined}
                  className={cn(
                    "relative z-10 flex aspect-square w-full items-center justify-center rounded-full text-[11px] font-medium transition-colors sm:text-xs",
                    isActive
                      ? "brand-gradient-bg font-semibold text-white shadow-[0_2px_8px_rgba(108,77,255,0.35)]"
                      : isFuture
                        ? "text-muted/40"
                        : "text-muted hover:bg-surface-2",
                  )}
                >
                  {isToday && (
                    <motion.span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-full",
                        isActive ? "ring-2 ring-brand-300" : "ring-2 ring-brand-400",
                      )}
                      animate={{ scale: [1, 1.22, 1], opacity: [0.9, 0, 0.9] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  {isToday && !isActive && (
                    <span aria-hidden className="absolute inset-0 rounded-full ring-2 ring-brand-400" />
                  )}
                  {day}
                </motion.span>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-surface-2 pt-3">
        <span className="flex items-center gap-2">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-brand-500/15"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <AnimatedFlame className="relative h-5 w-5" />
          </span>
          <span className="text-xs">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStreak}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="font-semibold"
              >
                {currentStreak}
              </motion.span>
            </AnimatePresence>{" "}
            <span className="font-medium text-muted">day{currentStreak === 1 ? "" : "s"} current</span>
          </span>
        </span>
        <span className="text-xs text-muted">
          Best: <span className="font-semibold text-foreground">{longestStreak}</span> day{longestStreak === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

function NavButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.88 }}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
        disabled ? "cursor-not-allowed opacity-30" : "hover:bg-surface-2",
      )}
    >
      {children}
    </motion.button>
  );
}
