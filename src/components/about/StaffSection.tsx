"use client";

import { motion } from "framer-motion";
import { Section, Container } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedCode } from "@/components/ui/icons/AnimatedCode";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";
import { AnimatedSettings } from "@/components/ui/icons/AnimatedSettings";
import { AnimatedBriefcase } from "@/components/ui/icons/AnimatedBriefcase";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { PillBadge } from "@/components/about/PillBadge";
import { LinkedinBadge } from "@/components/about/TeamSection";

export type TeamDepartment = "DEVELOPMENT" | "TUTORING" | "ASTROLOGY" | "OPERATIONS" | "ADMINISTRATION";

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialization: string;
  photoUrl: string;
  linkedinUrl: string;
  department: TeamDepartment | null;
};

const DEPARTMENTS: { key: TeamDepartment; label: string; icon: typeof AnimatedCode }[] = [
  { key: "DEVELOPMENT", label: "Development Team", icon: AnimatedCode },
  { key: "TUTORING", label: "Tutoring Team", icon: AnimatedGraduation },
  { key: "ASTROLOGY", label: "Astrology Team", icon: AnimatedMoonStar },
  { key: "OPERATIONS", label: "Operations & Support Team", icon: AnimatedSettings },
  { key: "ADMINISTRATION", label: "Administration Team", icon: AnimatedBriefcase },
];

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative isolate flex h-full flex-col items-center p-7 pb-8 text-center transition-all duration-300"
    >
      {/* Portrait with soft blue glow, docked into an overlapping name tag — matches the Founders/CEO cards */}
      <div className="relative z-10 mt-3 flex flex-col items-center">
        <div
          className="absolute left-1/2 top-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent-400) 45%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="relative h-28 w-28 overflow-hidden rounded-full ring-1 ring-accent-400/30 ring-offset-2 ring-offset-transparent transition-all duration-300 group-hover:ring-accent-400/60 sm:h-32 sm:w-32">
          {member.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded staff photo
            <img
              src={member.photoUrl}
              alt={member.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent-400/10">
              <AnimatedUser className="h-14 w-14 opacity-50" />
            </div>
          )}
        </div>

        {/* Name tag: rounded rectangle docked under the circle */}
        <div className="-mt-9 w-[calc(100%+1.25rem)] rounded-2xl border border-border-soft bg-surface-2 px-4 pb-3 pt-11 shadow-[var(--shadow-soft)]">
          <h3 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-foreground sm:text-sm">
            {member.name}
          </h3>
          <p className="mt-0.5 text-[11px] font-medium tracking-wide text-brand-600 dark:text-brand-300 sm:text-xs">
            {member.role}
          </p>
        </div>
      </div>

      {member.bio && <p className="relative z-10 mt-4 text-sm leading-[1.7] text-muted">{member.bio}</p>}

      {(member.specialization || member.linkedinUrl) && (
        <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {member.specialization && (
            <span className="inline-block truncate rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-900/25 dark:text-brand-300">
              {member.specialization}
            </span>
          )}
          {member.linkedinUrl && <LinkedinBadge href={member.linkedinUrl} />}
        </div>
      )}
    </motion.div>
  );
}

function DepartmentGroup({
  label,
  icon: Icon,
  members,
}: {
  label: string;
  icon: typeof AnimatedCode;
  members: StaffMember[];
}) {
  if (members.length === 0) return null;

  return (
    <div className="mt-14 first:mt-0">
      <Reveal>
        <div className="flex items-center gap-3">
          <IconBadge size="sm" className="bg-brand-50 dark:bg-brand-900/25">
            <Icon className="h-6.5 w-6.5" />
          </IconBadge>
          <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{label}</h3>
        </div>
      </Reveal>
      <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {members.map((m) => (
          <RevealItem key={m.id}>
            <StaffCard member={m} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

export function StaffSection({ staff }: { staff: StaffMember[] }) {
  if (staff.length === 0) return null;

  const unassigned = staff.filter((s) => s.department == null);

  return (
    <Section className="bg-[#FBF9F5] dark:bg-surface-2">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <PillBadge>Our team</PillBadge>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">The people behind MyLoginn</h2>
            <div className="mx-auto mt-4 h-[3px] w-[80px] rounded-full brand-gradient-bg" />
          </Reveal>
        </div>

        <div className="mt-12">
          {DEPARTMENTS.map((dept) => (
            <DepartmentGroup
              key={dept.key}
              label={dept.label}
              icon={dept.icon}
              members={staff.filter((s) => s.department === dept.key)}
            />
          ))}
          <DepartmentGroup label="Team" icon={AnimatedUsers} members={unassigned} />
        </div>
      </Container>
    </Section>
  );
}
