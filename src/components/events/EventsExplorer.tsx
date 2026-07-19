"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedCalendar } from "@/components/ui/icons/AnimatedCalendar";
import { AnimatedMapPin } from "@/components/ui/icons/AnimatedMapPin";
import { AnimatedVideoCamera } from "@/components/ui/icons/AnimatedVideoCamera";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedClock } from "@/components/ui/icons/AnimatedClock";
import { useTiltSpotlight } from "@/hooks/useTiltSpotlight";

export type EventData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  mode: string;
  startsAt: string;
  endsAt: string | null;
  location: string;
  coverImageUrl: string;
  registerUrl: string;
};

const MESHES = [
  "radial-gradient(120% 140% at 12% 18%, rgba(192,132,252,.85) 0%, transparent 55%), radial-gradient(120% 140% at 88% 30%, rgba(34,211,238,.7) 0%, transparent 55%), linear-gradient(135deg, #6d28d9, #4f46e5)",
  "radial-gradient(120% 140% at 14% 20%, rgba(125,211,252,.85) 0%, transparent 55%), radial-gradient(120% 140% at 85% 28%, rgba(52,211,153,.65) 0%, transparent 55%), linear-gradient(135deg, #0369a1, #0e7490)",
  "radial-gradient(120% 140% at 12% 20%, rgba(110,231,183,.8) 0%, transparent 55%), radial-gradient(120% 140% at 88% 26%, rgba(253,224,71,.55) 0%, transparent 55%), linear-gradient(135deg, #047857, #0d9488)",
  "radial-gradient(120% 140% at 14% 18%, rgba(253,164,175,.85) 0%, transparent 55%), radial-gradient(120% 140% at 86% 30%, rgba(251,191,36,.6) 0%, transparent 55%), linear-gradient(135deg, #be123c, #c2410c)",
];

const EASE = [0.16, 1, 0.3, 1] as const;

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    time: d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
    full: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
  };
}

function EventCard({ event, index }: { event: EventData; index: number }) {
  const { rotateX, rotateY, spotlightBg, onMouseMove, onMouseLeave } = useTiltSpotlight();
  const when = formatDateTime(event.startsAt);
  const mesh = MESHES[index % MESHES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: EASE }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="[transform-style:preserve-3d]"
    >
      <div className="card-shine group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-soft bg-surface shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
        <motion.div style={{ background: spotlightBg }} className="pointer-events-none absolute inset-0 z-10" aria-hidden />

        <div
          className="relative h-40 w-full"
          style={
            event.coverImageUrl
              ? { backgroundImage: `url(${event.coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { backgroundImage: mesh }
          }
        >
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-1.5 text-center leading-none shadow-[var(--shadow-soft)] backdrop-blur-sm">
            <span className="flex flex-col items-center">
              <span className="text-sm font-bold text-brand-600">{when.day}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-500">{when.month}</span>
            </span>
          </div>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {event.mode === "ONLINE" ? <AnimatedVideoCamera className="h-3.5 w-3.5" /> : <AnimatedMapPin className="h-3.5 w-3.5" />}
            {event.mode}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col p-5">
          {event.category && (
            <span className="mb-2 inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:bg-brand-900/25 dark:text-brand-300">
              {event.category}
            </span>
          )}
          <h3 className="text-lg font-semibold leading-snug">{event.title}</h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{event.description}</p>

          <div className="mt-4 space-y-1.5 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <AnimatedClock className="h-4 w-4" />
              {when.full}, {when.time}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <AnimatedMapPin className="h-4 w-4" />
                {event.location}
              </span>
            )}
          </div>

          <a
            href={event.registerUrl || "/contact"}
            target={event.registerUrl ? "_blank" : undefined}
            rel={event.registerUrl ? "noopener noreferrer" : undefined}
            className="group/cta mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-500"
          >
            {event.registerUrl ? "Register" : "Get in touch"}
            <AnimatedArrow className="h-5 w-5 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function EventsExplorer({ events }: { events: EventData[] }) {
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...new Set(events.map((e) => e.category).filter(Boolean))],
    [events]
  );

  const now = new Date().getTime();
  const upcoming = events.filter((e) => new Date(e.startsAt).getTime() >= now);
  const past = events.filter((e) => new Date(e.startsAt).getTime() < now);

  const filterFn = (e: EventData) => category === "All" || e.category === category;
  const filteredUpcoming = upcoming.filter(filterFn);
  const filteredPast = past.filter(filterFn);

  return (
    <div id="events-list" className="scroll-mt-24">
      {categories.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`relative cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                category === c ? "text-white" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {category === c && (
                <motion.span
                  layoutId="event-filter-pill"
                  className="absolute inset-0 -z-10 rounded-full brand-gradient-bg shadow-[var(--shadow-soft)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center gap-2.5">
          <AnimatedCalendar className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Upcoming</h2>
        </div>
        <AnimatePresence mode="popLayout">
          {filteredUpcoming.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUpcoming.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl border border-dashed border-border-soft bg-surface-2/50 p-8 text-center text-sm text-muted">
              No upcoming events right now — check back soon.
            </p>
          )}
        </AnimatePresence>
      </div>

      {filteredPast.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-semibold text-muted">Past events</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 opacity-75 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPast.map((e, i) => (
              <EventCard key={e.id} event={e} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
