"use client";

import { useRouter } from "next/navigation";
import { ClassCalendar, type ClassCardData } from "@/components/classes/ClassCalendar";
import { AnimatedVideoCamera } from "@/components/ui/icons/AnimatedVideoCamera";

export function UpcomingClasses({ classes, isLoggedIn }: { classes: ClassCardData[]; isLoggedIn: boolean }) {
  const router = useRouter();

  async function handleEnroll(id: string) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    const res = await fetch(`/api/classes/${id}/enroll`, { method: "POST" });
    if (res.ok) router.refresh();
  }

  if (classes.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <AnimatedVideoCamera className="h-6 w-6" /> Upcoming live classes
      </h2>
      <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-soft)]">
        <ClassCalendar classes={classes} variant="student" onEnroll={handleEnroll} />
      </div>
    </div>
  );
}
