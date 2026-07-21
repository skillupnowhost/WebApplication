"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { Section, Container } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedCrown } from "@/components/ui/icons/AnimatedCrown";
import { AnimatedClock } from "@/components/ui/icons/AnimatedClock";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedInstagram } from "@/components/ui/icons/AnimatedInstagram";
import { PillBadge } from "@/components/about/PillBadge";
import { CornerTechIcons } from "@/components/about/CornerTechIcons";
import { CONTACT_EMAILS, CONTACT_PHONES, SOCIAL_LINKS } from "@/lib/contactInfo";

export type Leader = {
  id: string;
  name: string;
  role: string;
  bio: string;
  category: "FOUNDER" | "CEO" | "STAFF";
  experienceYears: number | null;
  photoUrl: string;
  linkedinUrl: string;
};

function LinkedinBadge({ href }: { href: string }) {
  const id = "lb" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn profile"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 transition-all duration-300 hover:scale-110 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0a66c2" />
          </linearGradient>
        </defs>
        <path
          d="M8.3 10.1v7H5.9v-7Zm-1.2-3.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm3.4 3.6h2.3v1c.35-.6 1.2-1.25 2.5-1.25 2 0 3 1.3 3 3.5v3.75h-2.4v-3.4c0-1-.4-1.7-1.3-1.7-.75 0-1.2.5-1.4 1-.07.18-.1.42-.1.67v3.43h-2.4v-7Z"
          fill={`url(#${id})`}
        />
      </svg>
    </a>
  );
}

/** Thin curved glow connecting the team cards — purely decorative, hidden below lg. */
function ConnectingLine() {
  return (
    <svg
      className="pointer-events-none absolute left-0 right-0 top-[168px] hidden h-[3px] w-full lg:block"
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="team-line-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--brand-400)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--brand-500)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand-400)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M90 24 C 320 -6, 680 54, 910 24"
        stroke="url(#team-line-grad)"
        strokeWidth="1.5"
        strokeDasharray="1 7"
        strokeLinecap="round"
        fill="none"
        animate={{ strokeDashoffset: [0, -32] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {[90, 500, 910].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={i === 1 ? 34 : 24}
          r="3"
          fill="var(--brand-500)"
          animate={{ opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </svg>
  );
}

function LeaderCard({ leader, featured }: { leader: Leader; featured?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex h-full flex-col items-center rounded-[24px] border bg-surface p-7 text-center shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-lift)] ${
        featured
          ? "border-brand-200 hover:border-brand-400 lg:scale-[1.06]"
          : "border-border-soft hover:border-brand-300"
      }`}
    >
      {featured && (
        <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full brand-gradient-bg px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-[var(--shadow-lift)]">
          <AnimatedCrown className="h-3.5 w-3.5" />
          Leadership
        </span>
      )}

      {/* Portrait with soft ivory disc behind it */}
      <div className="relative mt-2">
        <div
          className={`absolute inset-0 -z-10 scale-[1.12] rounded-full ${
            featured ? "bg-brand-50 dark:bg-brand-900/20" : "bg-[#F3EEE4] dark:bg-surface-2"
          }`}
        />
        <div
          className={`relative overflow-hidden rounded-full ${
            featured ? "h-36 w-36 ring-4 ring-brand-400/50 sm:h-40 sm:w-40" : "h-28 w-28 sm:h-32 sm:w-32"
          }`}
        >
          {leader.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded portrait
            <img
              src={leader.photoUrl}
              alt={leader.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-50 dark:bg-brand-900/20">
              <AnimatedUser className="h-14 w-14 opacity-50" />
            </div>
          )}
        </div>
      </div>

      <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-[22px]">{leader.name}</h3>
      <p className="mt-1 text-sm font-semibold text-brand-600 dark:text-brand-300 sm:text-base">{leader.role}</p>

      {leader.bio && <p className="mt-3 text-sm leading-[1.7] text-muted">{leader.bio}</p>}

      {(leader.experienceYears != null || leader.linkedinUrl) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {leader.experienceYears != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-900/25 dark:text-brand-300">
              <AnimatedClock className="h-3.5 w-3.5" />
              {leader.experienceYears}+ yrs
            </span>
          )}
          {leader.linkedinUrl && <LinkedinBadge href={leader.linkedinUrl} />}
        </div>
      )}
    </motion.div>
  );
}

export function TeamSection({ leaders }: { leaders: Leader[] }) {
  if (leaders.length === 0) return null;

  return (
    <Section className="relative overflow-hidden bg-[#FBF9F5] dark:bg-surface-2">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.3]" />
      <CornerTechIcons />

      <Container>
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Leadership Team</p>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-4 flex justify-center">
              <PillBadge>01 &bull; Founding Team</PillBadge>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Meet <span className="shimmer-text-ink">Our Team</span>
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-[120px] rounded-full brand-gradient-bg" />
          </Reveal>
        </div>

        <div className="relative mt-16">
          <ConnectingLine />
          <RevealGroup className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={0.15}>
            {leaders.map((leader) => {
              const featured = leader.category === "CEO";
              return (
                <RevealItem
                  key={leader.id}
                  className={featured ? "order-last sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-sm lg:order-none lg:col-span-1" : ""}
                >
                  <LeaderCard leader={leader} featured={featured} />
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-20 max-w-xl text-center">
            <p className="text-lg font-bold tracking-tight text-foreground">MyLoginn Tech Private Limited</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Intelligence &bull; Innovation &bull; Integrity &bull; Impact
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted">
              <a href={`mailto:${CONTACT_EMAILS[0].email}`} className="inline-flex items-center gap-2 hover:text-brand-600 dark:hover:text-brand-300">
                <AnimatedMail className="h-4.5 w-4.5" />
                {CONTACT_EMAILS[0].email}
              </a>
              <a href={`tel:${CONTACT_PHONES[0].tel}`} className="inline-flex items-center gap-2 hover:text-brand-600 dark:hover:text-brand-300">
                <AnimatedPhone className="h-4.5 w-4.5" />
                {CONTACT_PHONES[0].display}
              </a>
              <a
                href={SOCIAL_LINKS[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-brand-600 dark:hover:text-brand-300"
              >
                <AnimatedInstagram className="h-4.5 w-4.5" />
                {SOCIAL_LINKS[0].handle}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
