import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { LeadForm } from "@/components/services/LeadForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FaqAccordion, type FaqAccordionItem } from "@/components/ui/FaqAccordion";
import { IconBadge } from "@/components/ui/IconBadge";
import { Monogram } from "@/components/ui/Monogram";
import { ContactHero } from "@/components/contact/ContactHero";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedClock } from "@/components/ui/icons/AnimatedClock";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedInstagram } from "@/components/ui/icons/AnimatedInstagram";
import { AnimatedFacebook } from "@/components/ui/icons/AnimatedFacebook";
import { CONTACT_EMAILS, CONTACT_PHONES, CONTACT_HOURS, SOCIAL_LINKS } from "@/lib/contactInfo";

const socialIcons = { instagram: AnimatedInstagram, facebook: AnimatedFacebook } as const;

type ContactAction = { label: string; href?: string; external?: boolean };

const contactPoints: {
  icon: typeof AnimatedMail;
  title: string;
  description: string;
  actions: ContactAction[];
}[] = [
  ...CONTACT_EMAILS.map((c) => ({
    icon: AnimatedMail,
    title: c.label,
    description: c.description,
    actions: [{ label: c.email, href: `mailto:${c.email}` }],
  })),
  {
    icon: AnimatedPhone,
    title: "Call us",
    description: "Speak to the team directly on any of these lines.",
    actions: CONTACT_PHONES.map((p, i) => ({
      label: i === 0 ? `${p.display} (primary)` : p.display,
      href: `tel:${p.tel}`,
    })),
  },
  {
    icon: AnimatedClock,
    title: "Response time",
    description: "We typically reply within one business day.",
    actions: [{ label: CONTACT_HOURS }],
  },
];

export const metadata = { title: "Contact — MyLoginn" };

export default async function ContactPage() {
  const [learnerCount, faqItems] = await Promise.all([
    prisma.user.count(),
    prisma.faqItem.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
  ]);

  const faqs: FaqAccordionItem[] = faqItems.map((f) => ({
    question: f.question,
    answer: f.answer,
    category: f.category,
  }));

  return (
    <Section className="overflow-hidden pt-14 sm:pt-14">
      <Container>
        <Breadcrumbs items={[{ label: "Contact" }]} className="mb-6" />

        <ContactHero learnerCount={learnerCount} />

        <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <RevealItem className="sm:col-span-2 lg:col-span-3">
                <WhatsAppButton />
              </RevealItem>
              {contactPoints.map((c) => (
                <RevealItem key={c.title}>
                  <Card className="card-shine group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
                    <IconBadge size="lg" className="relative text-brand-500 dark:text-brand-400">
                      <c.icon className="h-10 w-10" />
                    </IconBadge>
                    <div className="relative min-w-0">
                      <h3 className="mt-4 font-semibold">{c.title}</h3>
                      <p className="mt-2 text-sm text-muted">{c.description}</p>
                      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
                        {c.actions.map((a, i) => (
                          <span key={a.label} className="inline-flex min-w-0 items-center gap-2">
                            {i > 0 && (
                              <span className="text-border select-none" aria-hidden>
                                ·
                              </span>
                            )}
                            {a.href ? (
                              <a
                                href={a.href}
                                {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                className="break-all text-brand-500 underline-offset-4 transition-all duration-200 hover:text-brand-600 hover:underline"
                              >
                                {a.label}
                              </a>
                            ) : (
                              <span className="text-brand-500">{a.label}</span>
                            )}
                          </span>
                        ))}
                      </p>
                    </div>
                  </Card>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1} className="mt-14">
              <div className="flex items-center gap-3">
                <Monogram size="sm" />
                <div>
                  <h2 className="text-xl font-semibold">Follow MyLoginn</h2>
                  <p className="mt-0.5 text-sm text-muted">
                    Course drops, student wins & astrology updates — on Instagram and Facebook.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-4">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = socialIcons[s.key];
                  return (
                    <a
                      key={s.key}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-shine group relative flex min-w-[13rem] flex-1 items-center gap-4 overflow-hidden rounded-2xl border border-border-soft bg-surface p-4 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:flex-none"
                    >
                      <Icon className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{s.label}</p>
                        <p className="text-sm text-muted">{s.handle}</p>
                      </div>
                      <AnimatedArrow className="ml-auto h-5 w-5 shrink-0 text-brand-500 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-14">
              <h2 className="text-xl font-semibold">Frequently asked questions</h2>
              <p className="mt-2 text-sm text-muted">Search by keyword or browse by topic — can&apos;t find it? Just send us a message.</p>
              <FaqAccordion items={faqs} className="mt-6" searchable categoryTabs />
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <Reveal direction="left" delay={0.15}>
                <LeadForm
                  service="General Inquiry"
                  title="Send us a message"
                  submitLabel="Send message"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
