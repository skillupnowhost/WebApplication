"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AnimatedCalendar } from "@/components/ui/icons/AnimatedCalendar";
import { AnimatedVideoCamera } from "@/components/ui/icons/AnimatedVideoCamera";
import { buildGoogleCalendarLink } from "@/lib/googleCalendarLink";
import type { ClassCardData } from "./ClassCalendar";

function isJoinWindow(cls: ClassCardData) {
  const now = Date.now();
  const starts = new Date(cls.startsAt).getTime();
  const ends = new Date(cls.endsAt).getTime();
  return now >= starts - 10 * 60_000 && now <= ends + 30 * 60_000;
}

export function ClassDetailsModal({
  cls,
  variant,
  onClose,
  onEnroll,
}: {
  cls: ClassCardData | null;
  variant: "admin" | "mentor" | "student";
  onClose: () => void;
  onEnroll?: (id: string) => void;
}) {
  const [recordingState, setRecordingState] = useState<"idle" | "loading" | "error">("idle");

  if (!cls) return null;

  const canJoin =
    cls.status !== "CANCELLED" &&
    (variant !== "student" || cls.isEnrolled) &&
    (variant === "admin" || isJoinWindow(cls) || cls.status === "LIVE");

  async function watchRecording() {
    if (!cls) return;
    setRecordingState("loading");
    try {
      const res = await fetch(`/api/classes/${cls.id}/recording`);
      const json = await res.json();
      if (!res.ok) {
        setRecordingState("error");
        return;
      }
      window.open(json.webViewLink, "_blank", "noopener,noreferrer");
      setRecordingState("idle");
    } catch {
      setRecordingState("error");
    }
  }

  return (
    <Modal open={Boolean(cls)} onClose={onClose} title={cls.title} subtitle={`${cls.subject} · ${cls.mentorName}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={cls.status.toLowerCase()} />
          <StatusBadge status={cls.recordingAccessTier.toLowerCase()} />
        </div>

        <p className="text-sm text-muted">
          {new Date(cls.startsAt).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })} —{" "}
          {new Date(cls.endsAt).toLocaleTimeString("en-IN", { timeStyle: "short" })}
        </p>

        <div className="flex flex-wrap gap-3">
          {canJoin && (
            <Button size="sm" href={`/classes/${cls.id}/room`} icon={<AnimatedVideoCamera className="h-4.5 w-4.5" />}>
              Join live class
            </Button>
          )}
          {variant === "student" && !cls.isEnrolled && cls.status === "SCHEDULED" && (
            <Button size="sm" variant="secondary" onClick={() => onEnroll?.(cls.id)}>
              Enroll
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            href={buildGoogleCalendarLink({
              title: cls.title,
              description: `Join: ${cls.joinUrl}`,
              startsAt: cls.startsAt,
              endsAt: cls.endsAt,
            })}
            target="_blank"
            rel="noopener noreferrer"
            icon={<AnimatedCalendar className="h-4.5 w-4.5" />}
          >
            Add to Google Calendar
          </Button>
          {cls.googleEventLink && (
            <Button size="sm" variant="ghost" href={cls.googleEventLink} target="_blank" rel="noopener noreferrer">
              View synced event
            </Button>
          )}
        </div>

        {cls.hasRecording && (
          <div className="rounded-2xl border border-border-soft bg-surface-2 px-4 py-3">
            {cls.canAccessRecording ? (
              <Button size="sm" variant="secondary" onClick={watchRecording} disabled={recordingState === "loading"}>
                {recordingState === "loading" ? "Loading…" : "Watch recording"}
              </Button>
            ) : (
              <p className="text-sm text-muted">
                This recording requires the <span className="font-semibold">{cls.recordingAccessTier}</span> tutoring tier.
              </p>
            )}
            {recordingState === "error" && <p className="mt-2 text-xs text-danger">Couldn&apos;t load the recording.</p>}
          </div>
        )}
      </div>
    </Modal>
  );
}
