"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  hint?: string;
};

/** Eye that blinks shut/open as visibility toggles — the lid draws across the pupil. */
function AnimatedEyeToggle({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden>
      <motion.path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        initial={false}
        animate={{ scaleY: visible ? 1 : 0.28 }}
        style={{ transformOrigin: "12px 12px" }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="2.6"
        stroke="currentColor"
        strokeWidth="1.7"
        initial={false}
        animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
        style={{ transformOrigin: "12px 12px" }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
      />
      <motion.path
        d="M4 19 20 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: visible ? 0 : 1, opacity: visible ? 0 : 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </svg>
  );
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            className={cn(
              "w-full rounded-xl border border-border-soft bg-surface px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted transition-all duration-200 outline-none",
              "hover:border-brand-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:focus:ring-brand-900/30",
              error && "border-danger focus:border-danger focus:ring-danger/10",
              className
            )}
            {...rest}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted transition-colors duration-200 hover:text-foreground"
          >
            <AnimatedEyeToggle visible={visible} />
          </button>
        </div>
        {error ? (
          <span className="text-xs font-medium text-danger">{error}</span>
        ) : hint ? (
          <span className="text-xs text-muted">{hint}</span>
        ) : null}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
