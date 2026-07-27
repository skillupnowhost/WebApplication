"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedChat } from "@/components/ui/icons/AnimatedChat";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { AnimatedBriefcase } from "@/components/ui/icons/AnimatedBriefcase";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { IconBadge } from "@/components/ui/IconBadge";
import { toWhatsAppLink, formatPhoneDisplay } from "@/lib/whatsapp";
import { WHATSAPP_PHONE } from "@/lib/contactInfo";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Only one number is actually WhatsApp-enabled (WHATSAPP_PHONE). Rather than fabricating
 * separate WhatsApp numbers for "Admissions" / "Support" / "Business", every topic below
 * deep-links to that same number with a different prefilled message — so the visitor still
 * gets to "choose the right conversation" without us inventing contact numbers that don't exist.
 */
const WHATSAPP_TOPICS = [
  {
    key: "admissions",
    label: "Admissions",
    description: "Courses, internships & enrollment",
    icon: AnimatedGraduation,
    message: "Hi MyLoginn team! I'd like to know more about admissions — courses, internships & enrollment.",
  },
  {
    key: "support",
    label: "Support",
    description: "Help with something you're already enrolled in",
    icon: AnimatedUsers,
    message: "Hi MyLoginn team! I need support with a course, internship or session I'm already enrolled in.",
  },
  {
    key: "business",
    label: "Business Enquiries",
    description: "Partnerships & bulk enrollment",
    icon: AnimatedBriefcase,
    message: "Hi MyLoginn team! I'd like to talk about a partnership or business enquiry.",
  },
] as const;

/** One common WhatsApp entry point — opens a small picker of quick-start conversations, all on the same business number. */
export function WhatsAppButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="card-shine group relative flex w-full cursor-pointer items-center gap-5 overflow-hidden rounded-2xl border border-border-soft bg-surface p-6 text-left shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] sm:p-7"
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(120%_60%_at_0%_0%,var(--brand-50),transparent_60%)] dark:bg-[radial-gradient(120%_60%_at_0%_0%,rgba(108,77,255,0.12),transparent_60%)]" />
        <IconBadge size="lg" className="relative text-brand-500 dark:text-brand-400">
          <AnimatedChat className="h-10 w-10" />
        </IconBadge>
        <div className="relative min-w-0 flex-1">
          <h3 className="font-semibold">WhatsApp</h3>
          <p className="mt-2 text-sm text-muted">
            Fastest way to reach us — tap to pick a topic and start chatting in seconds.
          </p>
        </div>
        <AnimatedArrow
          className={cn(
            "relative hidden h-6 w-6 shrink-0 text-brand-500 transition-transform duration-300 sm:block",
            open ? "rotate-90" : "group-hover:translate-x-1"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            role="menu"
            className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border-soft bg-surface p-2 shadow-[var(--shadow-lift)] sm:left-auto sm:w-[22rem]"
          >
            <p className="px-3 pb-2 pt-1.5 text-xs text-muted">
              All chats go to our WhatsApp line — {formatPhoneDisplay(WHATSAPP_PHONE)}
            </p>
            {WHATSAPP_TOPICS.map((t) => (
              <a
                key={t.key}
                role="menuitem"
                href={toWhatsAppLink(WHATSAPP_PHONE, t.message) ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 hover:bg-surface-2"
              >
                <t.icon className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover/item:scale-110" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{t.label}</span>
                  <span className="block text-xs text-muted">{t.description}</span>
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
