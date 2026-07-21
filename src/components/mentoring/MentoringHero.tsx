"use client";

import { ExplorerHero } from "@/components/ui/ExplorerHero";
import { Avatar } from "@/components/ui/Avatar";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { AnimatedFolder } from "@/components/ui/icons/AnimatedFolder";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedTrophy } from "@/components/ui/icons/AnimatedTrophy";
import { AnimatedRocket } from "@/components/ui/icons/AnimatedRocket";
import { AnimatedShield } from "@/components/ui/icons/AnimatedShield";
import type { MentorData } from "@/components/mentoring/MentorGrid";

export function MentoringHero({
  mentors,
  projectsMentored,
  activeProjects,
}: {
  mentors: MentorData[];
  projectsMentored: number;
  activeProjects: number;
}) {
  const cluster = mentors.slice(0, 4).map((m) => (
    <Avatar key={m.id} name={m.name} avatarColor={m.avatarColor} avatarUrl={m.avatarUrl} size={34} />
  ));

  return (
    <ExplorerHero
      eyebrowIcon={AnimatedUsers}
      eyebrowText="Real Humans, Real Guidance"
      titleLead="Build with people who"
      titleGradient="have shipped it before"
      description="Every capstone project on MyLoginn is paired with a real mentor — a working professional who reviews your work, unblocks you, and holds the bar high."
      chips={[
        { icon: AnimatedRocket, text: "Hands-on project reviews" },
        { icon: AnimatedShield, text: "Working industry professionals" },
        { icon: AnimatedSparkle, text: "1:1 guidance, not templates" },
      ]}
      ctaHref="/projects"
      ctaLabel="See mentored projects"
      ctaNote="Want a mentor? Start a project"
      heroIcon={AnimatedUsers}
      heroValue={mentors.length}
      heroLabel="Active mentors"
      cluster={cluster}
      clusterLabel="Mentors currently guiding learner projects"
      stats={[{ icon: AnimatedFolder, label: "Projects mentored", value: projectsMentored }, { icon: AnimatedTrophy, label: "Active projects", value: activeProjects }]}
    />
  );
}
