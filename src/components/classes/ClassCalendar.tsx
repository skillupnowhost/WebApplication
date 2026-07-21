"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import { AnimatedVideoCamera } from "@/components/ui/icons/AnimatedVideoCamera";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { cn } from "@/lib/cn";
import { ClassDetailsModal } from "./ClassDetailsModal";

export type ClassCardData = {
  id: string;
  title: string;
  subject: string;
  mentorName: string;
  startsAt: string;
  endsAt: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  joinUrl: string;
  googleEventLink?: string | null;
  recordingAccessTier: "FREE" | "STANDARD" | "PREMIUM";
  hasRecording?: boolean;
  canAccessRecording?: boolean;
  isEnrolled?: boolean;
};

type Variant = "admin" | "mentor" | "student";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const gridVariants = { center: { transition: { staggerChildren: 0.012 } } };
const cellVariants = {
  enter: { opacity: 0, scale: 0.6 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ClassCalendar({
  classes,
  variant,
  onEnroll,
}: {
  classes: ClassCardData[];
  variant: Variant;
  onEnroll?: (id: string) => void;
}) {
  const [now] = useState(() => Date.now());
  const today = useMemo(() => new Date(now), [now]);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const [direction, setDirection] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [openClass, setOpenClass] = useState<ClassCardData | null>(null);
  const todayKey = dayKey(today);

  const byDay = useMemo(() => {
    const map = new Map<string, ClassCardData[]>();
    for (const c of classes) {
      const key = dayKey(new Date(c.startsAt));
      const list = map.get(key) ?? [];
      list.push(c);
      map.set(key, list);
    }
    return map;
  }, [classes]);

  const moveMonth = (delta: number) => {
    setDirection(delta);
    setSelectedDay(null);
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

  const agenda = useMemo(() => {
    const list = selectedDay
      ? (byDay.get(selectedDay) ?? [])
      : classes.filter((c) => new Date(c.endsAt).getTime() >= now);
    return [...list].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()).slice(0, 12);
  }, [selectedDay, byDay, classes, now]);

  return (
    <div className="mx-auto w-full max-w-[300px] sm:max-w-[320px]">
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
          <NavButton onClick={() => moveMonth(-1)} label="Previous month">
            <AnimatedChevron direction="left" className="h-3.5 w-3.5" />
          </NavButton>
          <NavButton onClick={() => moveMonth(1)} label="Next month">
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
            const dayClasses = byDay.get(key) ?? [];
            const hasClasses = dayClasses.length > 0;
            const isToday = key === todayKey;
            const isSelected = key === selectedDay;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay((prev) => (prev === key ? null : key))}
                className="relative flex aspect-square items-center justify-center"
              >
                <motion.span
                  variants={cellVariants}
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "relative z-10 flex aspect-square w-full flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium transition-colors sm:text-xs",
                    isSelected
                      ? "brand-gradient-bg font-semibold text-white shadow-[0_2px_8px_rgba(108,77,255,0.35)]"
                      : "text-muted hover:bg-surface-2"
                  )}
                >
                  {isToday && !isSelected && (
                    <span aria-hidden className="absolute inset-0 rounded-full ring-2 ring-brand-400" />
                  )}
                  {day}
                  {hasClasses && (
                    <span
                      className={cn(
                        "h-1 w-1 rounded-full",
                        isSelected ? "bg-white" : "bg-brand-500"
                      )}
                    />
                  )}
                </motion.span>
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 border-t border-surface-2 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          {selectedDay ? "Classes that day" : "Upcoming classes"}
        </p>
        {agenda.length === 0 ? (
          <p className="text-sm text-muted">No classes to show.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {agenda.map((c) => (
              <motion.button
                key={c.id}
                type="button"
                onClick={() => setOpenClass(c)}
                whileHover={{ x: 3 }}
                className="card-shine flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border border-border-soft bg-surface px-4 py-3 text-left transition-all duration-200 hover:shadow-[var(--shadow-soft)]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <AnimatedVideoCamera className="h-6 w-6 shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{c.title}</span>
                    <span className="block truncate text-xs text-muted">
                      {c.mentorName} · {new Date(c.startsAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                    </span>
                  </span>
                </span>
                <StatusBadge status={c.status.toLowerCase()} />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <ClassDetailsModal
        cls={openClass}
        variant={variant}
        onClose={() => setOpenClass(null)}
        onEnroll={onEnroll}
      />
    </div>
  );
}

function NavButton({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-surface-2"
    >
      {children}
    </motion.button>
  );
}

