"use client";

import { useMemo } from "react";
import { useLiveData } from "@/components/admin/useLiveData";
import { ClassCalendar, type ClassCardData } from "./ClassCalendar";

type MentorClassRow = {
  id: string;
  title: string;
  subject: string;
  startsAt: string;
  endsAt: string;
  status: ClassCardData["status"];
  joinUrl: string;
  recordingAccessTier: ClassCardData["recordingAccessTier"];
  googleEventLink: string | null;
  recordings: number;
};

export function MentorClassesCalendar({ mentorName }: { mentorName: string }) {
  const { data, loading } = useLiveData<{ rows: MentorClassRow[] }>("/api/mentor/classes");
  const classes: ClassCardData[] = useMemo(
    () =>
      (data?.rows ?? []).map((r) => ({
        id: r.id,
        title: r.title,
        subject: r.subject,
        mentorName,
        startsAt: r.startsAt,
        endsAt: r.endsAt,
        status: r.status,
        joinUrl: r.joinUrl,
        googleEventLink: r.googleEventLink,
        recordingAccessTier: r.recordingAccessTier,
        hasRecording: r.recordings > 0,
        canAccessRecording: true,
      })),
    [data, mentorName]
  );

  if (loading) return null;
  return <ClassCalendar classes={classes} variant="mentor" />;
}
