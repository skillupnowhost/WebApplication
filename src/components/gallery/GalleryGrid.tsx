"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedCameraCapture } from "@/components/ui/icons/AnimatedCameraCapture";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { CATEGORY_ORDER, type GalleryItemData } from "@/components/gallery/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: EASE }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border-soft bg-surface-2/50 px-6 py-20 text-center"
    >
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface shadow-[var(--shadow-soft)]"
      >
        <AnimatedCameraCapture className="h-9 w-9" />
      </motion.span>
      <h3 className="mt-5 text-lg font-semibold text-foreground">No photos yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">
        We&apos;re building this album — check back soon for snapshots from events, workshops and life at MyLoginn.
      </p>
    </motion.div>
  );
}

function GalleryCard({ item, index, onOpen }: { item: GalleryItemData; index: number; onOpen: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: (index % 8) * 0.04, ease: EASE }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open photo${item.caption ? `: ${item.caption}` : ""}`}
        className="card-shine group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border border-border-soft bg-surface-2 text-left shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.caption || item.category}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {item.category && (
            <span className="mb-1.5 inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              {item.category}
            </span>
          )}
          {item.caption && <p className="line-clamp-2 text-sm font-medium text-white">{item.caption}</p>}
        </div>
      </button>
    </motion.div>
  );
}

export function GalleryGrid({ items }: { items: GalleryItemData[] }) {
  const [category, setCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const present = CATEGORY_ORDER.filter((c) => items.some((i) => i.category === c));
    return ["All", ...present];
  }, [items]);

  const filtered = useMemo(
    () => (category === "All" ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  if (items.length === 0) {
    return (
      <div id="gallery-grid" className="scroll-mt-24">
        <EmptyState />
      </div>
    );
  }

  return (
    <div id="gallery-grid" className="scroll-mt-24">
      {categories.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`relative cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                category === c ? "text-white" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {category === c && (
                <motion.span
                  layoutId="gallery-filter-pill"
                  className="absolute inset-0 -z-10 rounded-full brand-gradient-bg shadow-[var(--shadow-soft)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center gap-2.5">
        <AnimatedSparkle className="h-5 w-5" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {filtered.length} photo{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          >
            {filtered.map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} onOpen={() => setLightboxIndex(i)} />
            ))}
          </motion.div>
        ) : (
          <p className="mt-5 rounded-2xl border border-dashed border-border-soft bg-surface-2/50 p-8 text-center text-sm text-muted">
            No photos in this category yet.
          </p>
        )}
      </AnimatePresence>

      {lightboxIndex !== null && (
        <GalleryLightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
