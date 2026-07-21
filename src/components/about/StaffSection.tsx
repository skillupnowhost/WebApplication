"use client";

import { motion } from "framer-motion";
import { Section, Container } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { PillBadge } from "@/components/about/PillBadge";

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  specialization: string;
  photoUrl: string;
};

export function StaffSection({ staff }: { staff: StaffMember[] }) {
  if (staff.length === 0) return null;

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

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {staff.map((s) => (
            <RevealItem key={s.id}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex h-full items-center gap-4 rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2">
                  {s.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded staff photo
                    <img src={s.photoUrl} alt={s.name} className="h-full w-full object-cover" />
                  ) : (
                    <AnimatedUser className="h-7 w-7 opacity-60" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{s.name}</p>
                  <p className="truncate text-sm text-muted">{s.role}</p>
                  {s.specialization && (
                    <span className="mt-1.5 inline-block truncate rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-600 dark:bg-brand-900/25 dark:text-brand-300">
                      {s.specialization}
                    </span>
                  )}
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
