"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { GlassCard } from "@/components/ui/Card";
import { AnimatedChatbot } from "@/components/ui/icons/AnimatedChatbot";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";
import { cn } from "@/lib/cn";

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * "Ask about your chart" — a per-report chat scoped to this person's computed
 * Mandi (Gulika) placement. Backed by /api/astrology/reports/[id]/chat, which
 * feeds the actual house/rashi/nakshatra into the model and instructs it to
 * reply in the report's language, so this needs no per-language answer text
 * of its own — only the surrounding UI copy is translated (see i18n.ts).
 */
export function AstroChat({ reportId, lang, hasMandi }: { reportId: string; lang: AstrologyLanguage; hasMandi: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || loading) return;

      const history: ChatMessage[] = [...messages, { role: "user", content: question }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
      setLoading(true);

      const appendToReply = (updater: (prev: string) => string) =>
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") next[next.length - 1] = { ...last, content: updater(last.content) };
          return next;
        });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`/api/astrology/reports/${reportId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          appendToReply(() => data?.error ?? t(lang, "chatUnavailable"));
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) appendToReply((prev) => prev + chunk);
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          appendToReply((prev) => (prev ? prev : t(lang, "chatUnavailable")));
        }
      } finally {
        abortRef.current = null;
        setLoading(false);
      }
    },
    [messages, loading, reportId, lang]
  );

  return (
    <GlassCard className="astro-no-print celestial-card relative overflow-hidden p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <AnimatedChatbot className="h-8 w-8 shrink-0" />
        <div className="min-w-0">
          <h2 className="text-base font-semibold">{t(lang, "chatTitle")}</h2>
          <p className="text-xs text-muted">{t(lang, "chatSubtitle")}</p>
        </div>
      </div>

      <div ref={scrollRef} className="mb-3 flex max-h-80 flex-col gap-2.5 overflow-y-auto overscroll-contain rounded-xl bg-surface-2/40 p-3">
        {messages.length === 0 && (
          <p className="rounded-2xl rounded-bl-md border border-border-soft bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
            {t(lang, "chatGreeting")}
          </p>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md brand-gradient-bg px-3.5 py-2.5 text-sm text-white shadow-[0_4px_14px_rgba(108,77,255,0.3)]">
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border-soft bg-surface px-3.5 py-2.5 text-sm leading-relaxed">
                {loading && i === messages.length - 1 && m.content === "" ? (
                  <span className="flex items-center gap-1 py-1" aria-label="…">
                    {[0, 0.15, 0.3].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full brand-gradient-bg"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: d }}
                      />
                    ))}
                  </span>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                )}
              </div>
            </div>
          )
        )}
      </div>

      <AnimatePresence>
        {!hasMandi && messages.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2 text-xs text-muted">
            {t(lang, "chatUnavailable")}
          </motion.p>
        )}
      </AnimatePresence>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 rounded-2xl border border-border-soft bg-surface-2/60 px-3 py-1.5 transition-colors focus-within:border-brand-400"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          disabled={!hasMandi}
          placeholder={t(lang, "chatPlaceholder")}
          className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || !hasMandi}
          aria-label={t(lang, "chatSendAria")}
          className={cn(
            "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full brand-gradient-bg text-white shadow-[0_4px_14px_rgba(108,77,255,0.35)] transition-all duration-200 hover:scale-105 active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          )}
        >
          <Send className="h-3.5 w-3.5 -translate-x-px" />
        </button>
      </form>
    </GlassCard>
  );
}
