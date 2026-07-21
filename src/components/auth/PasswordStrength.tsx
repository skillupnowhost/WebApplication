"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const requirements = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
] as const;

const levels = [
  { label: "Too weak", color: "var(--danger)" },
  { label: "Getting there", color: "var(--warning)" },
  { label: "Almost strong", color: "var(--accent-500)" },
  { label: "Strong password", color: "var(--success)" },
] as const;

/** Live meter + requirement checklist that mirrors the zod password rules. */
export function PasswordStrength({ value }: { value: string }) {
  const met = requirements.filter((r) => r.test(value)).length;
  const level = levels[met];

  return (
    <AnimatePresence>
      {value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-2 pt-1">
            <div className="flex flex-1 gap-1.5">
              {requirements.map((_, i) => (
                <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    className="h-full w-full origin-left rounded-full"
                    style={{ background: level.color }}
                    initial={false}
                    animate={{ scaleX: i < met ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              ))}
            </div>
            <motion.span
              key={level.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium"
              style={{ color: level.color }}
            >
              {level.label}
            </motion.span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {requirements.map((req) => {
              const ok = req.test(value);
              return (
                <span
                  key={req.label}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs transition-colors duration-300",
                    ok ? "text-success" : "text-muted"
                  )}
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
                    <motion.circle
                      cx="6"
                      cy="6"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      initial={false}
                      animate={{ opacity: ok ? 0 : 1 }}
                    />
                    <motion.path
                      d="M2.8 6.2 5 8.4 9.2 3.8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: ok ? 1 : 0, opacity: ok ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </svg>
                  {req.label}
                </span>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
