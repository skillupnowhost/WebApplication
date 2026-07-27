"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedClose } from "@/components/ui/icons/AnimatedClose";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import type { GalleryItemData } from "@/components/gallery/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

export function GalleryLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItemData[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const item = items[index];
  const count = items.length;

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + count) % count);
  }, [index, count, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % count);
  }, [index, count, onNavigate]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && count > 1) goPrev();
      else if (e.key === "ArrowRight" && count > 1) goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext, count]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-label={item.caption || "Gallery photo"}
        onClick={onClose}
      >
        <button
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20 sm:right-6 sm:top-6"
        >
          <AnimatedClose className="h-6 w-6" />
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20 sm:left-6"
            >
              <AnimatedChevron direction="left" className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20 sm:right-6"
            >
              <AnimatedChevron direction="right" className="h-6 w-6" />
            </button>
          </>
        )}

        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex max-h-full max-w-4xl flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-[75vh] overflow-hidden rounded-2xl bg-black/20 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.caption || item.category}
              className="max-h-[75vh] w-auto max-w-full object-contain"
            />
          </div>
          <div className="mt-4 flex max-w-full flex-col items-center gap-1.5 text-center">
            {item.category && (
              <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                {item.category}
              </span>
            )}
            {item.caption && <p className="max-w-xl text-sm text-white/85 sm:text-base">{item.caption}</p>}
            {count > 1 && (
              <p className="text-xs text-white/50">
                {index + 1} / {count}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
