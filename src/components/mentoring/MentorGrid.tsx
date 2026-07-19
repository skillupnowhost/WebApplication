"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Avatar } from "@/components/ui/Avatar";
import { AnimatedFolder } from "@/components/ui/icons/AnimatedFolder";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";

export type MentorProject = { id: string; title: string; status: string };

export type MentorData = {
  id: string;
  name: string;
  avatarColor: string;
  avatarUrl: string | null;
  projects: MentorProject[];
};

function MentorCard({ mentor }: { mentor: MentorData }) {
  const activeCount = mentor.projects.filter((p) => p.status !== "completed").length;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl brand-gradient-bg text-white shadow-[var(--shadow-lift)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 80%)",
        }}
      />
      <div className="pointer-events-none absolute -top-14 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-black/15 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col items-center p-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
          <AnimatedSparkle className="h-3.5 w-3.5" />
          Mentor
        </span>

        <Avatar
          name={mentor.name}
          avatarColor={mentor.avatarColor}
          avatarUrl={mentor.avatarUrl}
          size={84}
          className="mt-5 text-2xl shadow-[0_10px_28px_rgba(0,0,0,0.3)] ring-4 ring-white/20"
        />

        <h3 className="mt-4 text-lg font-bold tracking-tight">{mentor.name}</h3>

        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          <AnimatedFolder className="h-3.5 w-3.5" />
          {mentor.projects.length} project{mentor.projects.length === 1 ? "" : "s"} mentored
        </span>

        {activeCount > 0 && (
          <p className="mt-3 text-xs text-white/75">Currently guiding {activeCount} active project{activeCount === 1 ? "" : "s"}</p>
        )}
      </div>
    </motion.div>
  );
}

function EmptyNotice() {
  return (
    <div className="rounded-3xl border border-dashed border-border-soft bg-surface-2/50 p-10 text-center text-sm text-muted">
      No mentors added yet — add a mentor account from the admin dashboard.
    </div>
  );
}

export function MentorGrid({ mentors }: { mentors: MentorData[] }) {
  if (mentors.length === 0) {
    return (
      <Reveal>
        <EmptyNotice />
      </Reveal>
    );
  }

  return (
    <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
      {mentors.map((m) => (
        <RevealItem key={m.id}>
          <MentorCard mentor={m} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
