"use client";

import { motion } from "framer-motion";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedTrophy } from "@/components/ui/icons/AnimatedTrophy";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";

export type Client = { id: string; name: string; logoUrl: string; websiteUrl: string; description: string };

export function ClientsSection({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null;

  return (
    <Section className="bg-surface-2/50">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>
                <AnimatedTrophy className="h-4.5 w-4.5" />
                Our clients
              </Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Who we&apos;ve worked with</h2>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {clients.map((c) => (
            <RevealItem key={c.id}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex h-full flex-col rounded-2xl border border-border-soft bg-surface p-6 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex h-12 items-center">
                  {c.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded client logo
                    <img src={c.logoUrl} alt={c.name} className="h-full max-w-[9rem] object-contain object-left" />
                  ) : (
                    <span className="text-lg font-bold text-foreground/80">{c.name}</span>
                  )}
                </div>
                {c.description && <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{c.description}</p>}
                {c.websiteUrl && (
                  <a
                    href={c.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-300"
                  >
                    Visit site
                    <AnimatedArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                )}
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
