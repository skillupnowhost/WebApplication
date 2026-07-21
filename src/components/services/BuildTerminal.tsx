"use client";

import { motion } from "framer-motion";

const lines: { text: string; tone: "muted" | "success" | "command" }[] = [
  { text: "$ myloginn create-product --stack next,react-native,node", tone: "command" },
  { text: "✓ architecture & data model reviewed", tone: "success" },
  { text: "✓ design system generated", tone: "success" },
  { text: "✓ animations tuned to 60fps", tone: "success" },
  { text: "✓ ready for production deploy", tone: "success" },
];

const toneClass: Record<(typeof lines)[number]["tone"], string> = {
  muted: "text-muted",
  success: "text-emerald-500 dark:text-emerald-400",
  command: "text-brand-500 dark:text-brand-300",
};

/** Decorative "build pipeline" terminal panel for the app/web-development hero — illustrates the workflow, not literal metrics. */
export function BuildTerminal({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
      whileHover={{ rotate: 0, y: -4 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-panel card-shine relative w-full max-w-md overflow-hidden rounded-2xl shadow-[var(--shadow-lift)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-border-soft/70 bg-surface-2/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] font-medium text-muted">build.sh</span>
      </div>
      <div className="flex flex-col gap-2 p-4 font-mono text-[12.5px] leading-relaxed sm:text-[13px]">
        {lines.map((line, i) => (
          <motion.p
            key={line.text}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.9 + i * 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={toneClass[line.tone]}
          >
            {line.text}
          </motion.p>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ delay: 0.9 + lines.length * 0.35, duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
          className="mt-0.5 inline-block h-3.5 w-1.5 bg-brand-400"
          aria-hidden
        />
      </div>
    </motion.div>
  );
}
