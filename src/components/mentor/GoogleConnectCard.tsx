"use client";

import { Button } from "@/components/ui/Button";
import { AnimatedCalendar } from "@/components/ui/icons/AnimatedCalendar";

export function GoogleConnectCard({ connected, returnTo }: { connected: boolean; returnTo: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border-soft bg-surface px-5 py-4">
      <span className="flex items-center gap-3">
        <AnimatedCalendar className="h-8 w-8 shrink-0" />
        <span>
          <span className="block text-sm font-semibold">
            {connected ? "Google Calendar & Drive connected" : "Connect Google Calendar & Drive"}
          </span>
          <span className="block text-xs text-muted">
            {connected
              ? "Classes you schedule sync to your real Calendar, and recordings upload to your Drive automatically."
              : "Without this, classes still work — they just won't sync to Calendar or auto-upload recordings."}
          </span>
        </span>
      </span>
      <Button
        size="sm"
        variant={connected ? "secondary" : "primary"}
        href={`/api/integrations/google/connect?returnTo=${encodeURIComponent(returnTo)}`}
      >
        {connected ? "Reconnect" : "Connect Google"}
      </Button>
    </div>
  );
}
