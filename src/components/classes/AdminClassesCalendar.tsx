"use client";

import { useMemo } from "react";
import { useLiveData } from "@/components/admin/useLiveData";
import { ClassCalendar, type ClassCardData } from "./ClassCalendar";

type AdminClassRow = {
  id: string;
  title: string;
  mentor: string;
  subject: string;
  startsAt: string;
  endsAt: string;
  status: ClassCardData["status"];
  recordingAccessTier: ClassCardData["recordingAccessTier"];
  joinUrl: string;
  googleEventLink: string | null;
  recordings: number;
};

export function AdminClassesCalendar() {
  const { data, loading } = useLiveData<{ rows: AdminClassRow[] }>("/api/admin/classes");
  const classes: ClassCardData[] = useMemo(
    () =>
      (data?.rows ?? []).map((r) => ({
        id: r.id,
        title: r.title,
        subject: r.subject,
        mentorName: r.mentor,
        startsAt: r.startsAt,
        endsAt: r.endsAt,
        status: r.status,
        joinUrl: r.joinUrl,
        googleEventLink: r.googleEventLink,
        recordingAccessTier: r.recordingAccessTier,
        hasRecording: r.recordings > 0,
        canAccessRecording: true,
      })),
    [data]
  );

  if (loading) return null;
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-soft)]">
      <ClassCalendar classes={classes} variant="admin" />
    </div>
  );
}
