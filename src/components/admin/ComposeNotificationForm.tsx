"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Modal";
import { AnimatedSpeaker } from "@/components/ui/icons/AnimatedSpeaker";

const AUDIENCE_OPTIONS = [
  { label: "All users", value: "ALL" },
  { label: "All students", value: "STUDENT" },
  { label: "All mentors", value: "MENTOR" },
  { label: "Specific user", value: "USER" },
];

type UserOption = { label: string; value: string };

export function ComposeNotificationForm({ onSent }: { onSent?: () => void }) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"ALL" | "STUDENT" | "MENTOR" | "USER">("ALL");
  const [userId, setUserId] = useState("");
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (audience !== "USER" || userOptions.length > 0) return;
    fetch("/api/admin/notifications/recipients")
      .then((res) => res.json())
      .then((json) => setUserOptions(json.options ?? []));
  }, [audience, userOptions.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (audience === "USER" && !userId) {
      toast("error", "Pick a user to notify");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/admin/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, audience, userId: audience === "USER" ? userId : undefined }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast("error", json.error ?? "Couldn't send");
        return;
      }
      toast("success", `Sent to ${json.sent} recipient${json.sent === 1 ? "" : "s"}`);
      setTitle("");
      setBody("");
      onSent?.();
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border-soft bg-surface p-6 shadow-[var(--shadow-soft)]"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/25">
          <AnimatedSpeaker className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold">Compose & broadcast</h2>
          <p className="text-xs text-muted">Creates one in-app notification per targeted user, delivered instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New class scheduled" />
        <Select
          label="Send to"
          options={AUDIENCE_OPTIONS}
          value={audience}
          onChange={(e) => setAudience(e.target.value as typeof audience)}
        />
        {audience === "USER" && (
          <div className="sm:col-span-full">
            <Select
              label="User"
              options={userOptions}
              placeholder={userOptions.length ? "Choose a user…" : "Loading users…"}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
        )}
        <div className="sm:col-span-full">
          <Textarea label="Message" required rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={sending}>
          {sending ? "Sending…" : "Send notification"}
        </Button>
      </div>
    </form>
  );
}
