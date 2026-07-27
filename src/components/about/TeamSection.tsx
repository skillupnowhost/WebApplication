"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { Section, Container } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedCrown } from "@/components/ui/icons/AnimatedCrown";
import { AnimatedClock } from "@/components/ui/icons/AnimatedClock";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { PillBadge } from "@/components/about/PillBadge";
import { CornerTechIcons } from "@/components/about/CornerTechIcons";

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

export function LinkedinBadge({ href }: { href: string }) {
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

function LeaderCard({
  leader,
  featured,
  badgeLabel,
  badgeIcon: BadgeIcon = AnimatedCrown,
}: {
  leader: Leader;
  featured?: boolean;
  badgeLabel?: string;
  badgeIcon?: typeof AnimatedCrown;
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative isolate flex h-full flex-col items-center p-7 pb-8 text-center transition-all duration-300 ${
        featured ? "lg:scale-[1.06]" : ""
      }`}
    >
      {badgeLabel && (
        <span className="absolute -top-3.5 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full brand-gradient-bg px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-[var(--shadow-lift)]">
          <BadgeIcon className="h-3.5 w-3.5" />
          {badgeLabel}
        </span>
      )}

      {/* Portrait with soft blue glow, docked into an overlapping name tag */}
      <div className="relative z-10 mt-3 flex flex-col items-center">
        <div
          className="absolute left-1/2 top-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent-400) 45%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          className={`relative overflow-hidden rounded-full ring-1 ring-offset-2 ring-offset-transparent transition-all duration-300 group-hover:ring-accent-400/60 ${
            featured
              ? "h-32 w-32 ring-accent-400/45 sm:h-36 sm:w-36"
              : "h-28 w-28 ring-accent-400/30 sm:h-32 sm:w-32"
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
            <div className="flex h-full w-full items-center justify-center bg-accent-400/10">
              <AnimatedUser className="h-14 w-14 opacity-50" />
            </div>
          )}
        </div>

        {/* Name tag: rounded rectangle docked under the circle */}
        <div className="-mt-9 w-[calc(100%+1.25rem)] rounded-2xl border border-border-soft bg-surface-2 px-4 pb-3 pt-11 shadow-[var(--shadow-soft)]">
          <h3 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-foreground sm:text-sm">
            {leader.name}
          </h3>
          <p className="mt-0.5 text-[11px] font-medium tracking-wide text-brand-600 dark:text-brand-300 sm:text-xs">
            {leader.role}
          </p>
        </div>
      </div>

      {leader.bio && <p className="relative z-10 mt-4 text-sm leading-[1.7] text-muted">{leader.bio}</p>}

      {(leader.experienceYears != null || leader.linkedinUrl) && (
        <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2.5">
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

export function TeamSection({ founders, ceo }: { founders: Leader[]; ceo: Leader[] }) {
  if (founders.length === 0 && ceo.length === 0) return null;

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

        {founders.length > 0 && (
          <div className="relative mt-16">
            <Reveal>
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.26em] text-brand-600 dark:text-brand-300">
                Founders
              </p>
            </Reveal>
            <div className="relative mt-8">
              <ConnectingLine />
              <RevealGroup
                className={`grid grid-cols-1 items-start gap-8 sm:grid-cols-2 ${
                  founders.length >= 3 ? "lg:grid-cols-3" : "mx-auto lg:max-w-3xl"
                }`}
                stagger={0.15}
              >
                {founders.map((leader) => (
                  <RevealItem key={leader.id}>
                    <LeaderCard leader={leader} featured badgeLabel="Founder" badgeIcon={AnimatedCrown} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        )}

        {ceo.length > 0 && (
          <div className="relative mt-20">
            <Reveal>
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.26em] text-brand-600 dark:text-brand-300">
                Executive Leadership
              </p>
            </Reveal>
            <RevealGroup className="mx-auto mt-8 flex flex-wrap items-start justify-center gap-8" stagger={0.15}>
              {ceo.map((leader) => (
                <RevealItem key={leader.id} className="w-full max-w-sm">
                  <LeaderCard leader={leader} featured badgeLabel="CEO" badgeIcon={AnimatedStar} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}
      </Container>
    </Section>
  );
}
