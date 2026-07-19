"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedCrown } from "@/components/ui/icons/AnimatedCrown";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedClock } from "@/components/ui/icons/AnimatedClock";

export type Leader = {
  id: string;
  name: string;
  role: string;
  bio: string;
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/25"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0a66c2" />
          </linearGradient>
        </defs>
        <path
          d="M8.3 10.1v7H5.9v-7Zm-1.2-3.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm3.4 3.6h2.3v1c.35-.6 1.2-1.25 2.5-1.25 2 0 3 1.3 3 3.5v3.75h-2.4v-3.4c0-1-.4-1.7-1.3-1.7-.75 0-1.2.5-1.4 1-.07.18-.1.42-.1.67v3.43h-2.4v-7Z"
          fill="#fff"
        />
      </svg>
    </a>
  );
}

function LeaderCard({ leader, featured }: { leader: Leader; featured?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative isolate flex h-[26rem] flex-col overflow-hidden rounded-3xl brand-gradient-bg text-white shadow-[var(--shadow-lift)] sm:h-[30rem]"
    >
      {/* Cinematic backdrop texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 80%)",
        }}
      />
      <div className="pointer-events-none absolute -top-16 -right-14 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-14 h-56 w-56 rounded-full bg-black/15 blur-3xl" />

      {/* Category ribbon */}
      <div className="relative z-20 flex justify-start p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          {featured ? <AnimatedCrown className="h-4 w-4" /> : <AnimatedSparkle className="h-4 w-4" />}
          {featured ? "Chief Executive Officer" : "Founder"}
        </span>
      </div>

      {/* Spotlight glow beneath the portrait */}
      <div className="pointer-events-none absolute bottom-24 left-1/2 h-16 w-52 -translate-x-1/2 rounded-[100%] bg-white/20 blur-2xl sm:bottom-28" />

      {/* Portrait */}
      <div className="relative z-10 flex flex-1 items-end justify-center px-4">
        {leader.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded cutout of arbitrary aspect ratio
          <img
            src={leader.photoUrl}
            alt={leader.name}
            className="h-full max-h-[19rem] w-auto object-contain object-bottom drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.03] sm:max-h-[23rem]"
          />
        ) : (
          <AnimatedUser className="h-32 w-32 opacity-40 sm:h-40 sm:w-40" />
        )}
      </div>

      {/* Text panel */}
      <div className="relative z-20 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-6 pb-6 pt-10 sm:px-7 sm:pb-7">
        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{leader.name}</h3>
        <p className="mt-1 text-sm font-medium text-white/80 sm:text-base">{leader.role}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          {leader.experienceYears != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <AnimatedClock className="h-3.5 w-3.5" />
              {leader.experienceYears}+ yrs experience
            </span>
          )}
          {leader.linkedinUrl && <LinkedinBadge href={leader.linkedinUrl} />}
        </div>
        {leader.bio && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75">{leader.bio}</p>}
      </div>
    </motion.div>
  );
}

function EmptyLeaderNotice({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border-soft bg-surface-2/50 p-10 text-center text-sm text-muted">
      No {label} added yet — add one from the admin dashboard.
    </div>
  );
}

export function LeadershipSection({ founders, ceo }: { founders: Leader[]; ceo: Leader | null }) {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>
                <AnimatedCrown className="h-4.5 w-4.5" />
                Leadership
              </Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Meet the founders</h2>
          </Reveal>
        </div>

        <div className="mt-12">
          {founders.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8" stagger={0.12}>
              {founders.map((f) => (
                <RevealItem key={f.id}>
                  <LeaderCard leader={f} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal>
              <EmptyLeaderNotice label="founders" />
            </Reveal>
          )}
        </div>

        <div className="mx-auto mt-20 max-w-2xl text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Led by</h2>
          </Reveal>
        </div>
        <div className="mx-auto mt-12 max-w-md">
          {ceo ? (
            <Reveal scale>
              <LeaderCard leader={ceo} featured />
            </Reveal>
          ) : (
            <Reveal>
              <EmptyLeaderNotice label="CEO profile" />
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  );
}
