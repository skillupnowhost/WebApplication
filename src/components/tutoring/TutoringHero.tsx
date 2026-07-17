"use client";

import { ExplorerHero } from "@/components/ui/ExplorerHero";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedShield } from "@/components/ui/icons/AnimatedShield";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { AnimatedCalendar } from "@/components/ui/icons/AnimatedCalendar";
import { AnimatedBook } from "@/components/ui/icons/AnimatedBook";
import type { TutorData } from "@/components/tutoring/TutoringExplorer";

export function TutoringHero({ tutors, sessionsBooked }: { tutors: TutorData[]; sessionsBooked: number }) {
  const subjects = [...new Set(tutors.map((t) => t.subject))];
  const boards = [...new Set(tutors.flatMap((t) => t.boards))];
  const avgRating = tutors.length
    ? tutors.reduce((sum, t) => sum + t.rating, 0) / tutors.length
    : 0;

  const cluster = tutors.slice(0, 4).map((t) => {
    const initials = t.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
    return (
      <span
        key={t.id}
        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white sm:h-9 sm:w-9"
        style={{ background: t.avatarColor }}
        title={t.name}
      >
        {initials}
      </span>
    );
  });

  const marqueeItems = subjects.map((s) => (
    <span
      key={s}
      className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-1.5 text-sm font-medium text-foreground/80"
    >
      {s}
    </span>
  ));

  return (
    <ExplorerHero
      eyebrowIcon={AnimatedGraduation}
      eyebrowText="1:1 Mentorship"
      titleLead="Learning that fits"
      titleGradient="your schedule"
      description="Personalized tutoring for CBSE & State Board curricula — live classes, progress dashboards, and mentor feedback from 1st grade onward."
      chips={[
        { icon: AnimatedShield, text: "Verified tutors" },
        { icon: AnimatedStar, text: `${avgRating.toFixed(1)}★ avg. rating` },
        { icon: AnimatedCalendar, text: "Flexible scheduling" },
      ]}
      ctaHref="#tutors"
      ctaLabel="Browse tutors"
      ctaNote={`${subjects.length} subjects, ${tutors.length} tutors ready now`}
      heroIcon={AnimatedGraduation}
      heroValue={tutors.length}
      heroLabel="Expert tutors"
      cluster={cluster}
      clusterLabel={`${tutors.length} ${tutors.length === 1 ? "tutor" : "tutors"} ready to help`}
      stats={[
        { icon: AnimatedBook, label: "Subjects", value: subjects.length },
        { icon: AnimatedGraduation, label: "Boards covered", value: boards.length },
        { icon: AnimatedCalendar, label: "Sessions booked", value: sessionsBooked },
      ]}
      marqueeLabel="Subjects taught"
      marqueeItems={marqueeItems}
    />
  );
}
