"use client";

import { motion } from "framer-motion";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedShield } from "@/components/ui/icons/AnimatedShield";

export type Partner = { id: string; name: string; logoUrl: string; websiteUrl: string };

export function PartnersSection({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>
                <AnimatedShield className="h-4.5 w-4.5" />
                Our partners
              </Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Trusted alliances</h2>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4" stagger={0.05}>
          {partners.map((p) => {
            const content = p.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded partner logo
              <img
                src={p.logoUrl}
                alt={p.name}
                className="max-h-14 w-auto max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
              />
            ) : (
              <span className="text-center text-sm font-semibold text-foreground/80">{p.name}</span>
            );
            const cardClass =
              "group flex h-28 items-center justify-center rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]";
            return (
              <RevealItem key={p.id}>
                {p.websiteUrl ? (
                  <motion.a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25 }}
                    className={cardClass}
                  >
                    {content}
                  </motion.a>
                ) : (
                  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.25 }} className={cardClass}>
                    {content}
                  </motion.div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}
