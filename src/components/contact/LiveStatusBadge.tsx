"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CONTACT_HOURS_RANGE } from "@/lib/contactInfo";

function computeStatus() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);

  const weekdayLabel = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayLabel);

  const isOpen =
    (CONTACT_HOURS_RANGE.days as readonly number[]).includes(weekdayIndex) &&
    hour >= CONTACT_HOURS_RANGE.startHour &&
    hour < CONTACT_HOURS_RANGE.endHour;

  return isOpen;
}

/** Live open/closed pill computed client-side from Asia/Kolkata business hours (see CONTACT_HOURS_RANGE). */
export function LiveStatusBadge({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setIsOpen(computeStatus());
    const id = setInterval(() => setIsOpen(computeStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (isOpen === null) return null;

  return (
    <motion.span
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={
        className ??
        "inline-flex items-center gap-2.5 rounded-full border border-border-soft bg-surface/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600 shadow-[var(--shadow-soft)] backdrop-blur-sm dark:text-brand-300"
      }
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-70 ${isOpen ? "animate-ping bg-emerald-400" : "bg-amber-400"}`}
        />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${isOpen ? "bg-emerald-500" : "bg-amber-500"}`} />
      </span>
      {isOpen ? "Team online now" : "Outside business hours"}
    </motion.span>
  );
}
