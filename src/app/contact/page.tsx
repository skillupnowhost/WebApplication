import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { LeadForm } from "@/components/services/LeadForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { IconBadge } from "@/components/ui/IconBadge";
import { ContactHero } from "@/components/contact/ContactHero";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedChat } from "@/components/ui/icons/AnimatedChat";
import { AnimatedClock } from "@/components/ui/icons/AnimatedClock";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { toWhatsAppLink } from "@/lib/whatsapp";
import { CONTACT_EMAIL, CONTACT_PHONES, WHATSAPP_PHONE, CONTACT_HOURS } from "@/lib/contactInfo";

type ContactAction = { label: string; href?: string; external?: boolean };

const contactPoints: {
  icon: typeof AnimatedMail;
  title: string;
  description: string;
  actions: ContactAction[];
  featured?: boolean;
}[] = [
  {
    icon: AnimatedChat,
    title: "WhatsApp",
    description: "Fastest way to reach the team — most chats get a reply in minutes during business hours.",
    actions: [
      {
        label: "Chat with us on WhatsApp",
        href: toWhatsAppLink(WHATSAPP_PHONE, "Hi MyLoginn team! I have a question.") ?? undefined,
        external: true,
      },
    ],
    featured: true,
  },
  {
    icon: AnimatedMail,
    title: "Email us",
    description: "For admissions, partnerships, or general questions.",
    actions: [{ label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` }],
  },
  {
    icon: AnimatedPhone,
    title: "Call us",
    description: "Speak to the team directly on any of these lines.",
    actions: CONTACT_PHONES.map((p) => ({ label: p.display, href: `tel:${p.tel}` })),
  },
  {
    icon: AnimatedClock,
    title: "Response time",
    description: "We typically reply within one business day.",
    actions: [{ label: CONTACT_HOURS }],
  },
];

const faqs = [
  {
    question: "What's the fastest way to get a response?",
    answer:
      "WhatsApp — most messages are answered within minutes during business hours. Email and the form on this page are typically answered within one business day.",
  },
  {
    question: "I want to talk about a partnership or bulk enrollment. Who do I contact?",
    answer:
      "Use the form on this page and select the closest topic, or email us directly. Partnership and institutional enquiries are routed to our leadership team.",
  },
  {
    question: "Can I get support for a course, internship or tutoring session I'm already enrolled in?",
    answer:
      "Yes — mention your enrollment or booking details in your message so we can pull up your account quickly. For live class issues, your mentor's contact is also on your dashboard.",
  },
  {
    question: "Do you offer support outside business hours?",
    answer:
      `We're online ${CONTACT_HOURS}. Messages sent outside these hours are queued and answered first thing the next business day.`,
  },
];

export const metadata = { title: "Contact — MyLoginn" };

export default async function ContactPage() {
  const learnerCount = await prisma.user.count();

  return (
    <Section className="overflow-hidden pt-14 sm:pt-14">
      <Container>
        <Breadcrumbs items={[{ label: "Contact" }]} className="mb-6" />

        <ContactHero learnerCount={learnerCount} />

        <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {contactPoints.map((c) => (
                <RevealItem key={c.title} className={c.featured ? "sm:col-span-2" : ""}>
                  <Card
                    className={`card-shine group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] ${
                      c.featured ? "sm:flex sm:items-center sm:gap-6 sm:p-7" : ""
                    }`}
                  >
                    {c.featured && (
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(120%_60%_at_0%_0%,var(--brand-50),transparent_60%)] dark:bg-[radial-gradient(120%_60%_at_0%_0%,rgba(108,77,255,0.12),transparent_60%)]"
                      />
                    )}
                    <IconBadge size="lg" className="relative text-brand-500 dark:text-brand-400">
                      <c.icon className="h-10 w-10" />
                    </IconBadge>
                    <div className="relative min-w-0 sm:flex-1">
                      <h3 className="mt-4 font-semibold sm:mt-0">{c.title}</h3>
                      <p className="mt-2 text-sm text-muted">{c.description}</p>
                      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
                        {c.actions.map((a, i) => (
                          <span key={a.label} className="inline-flex items-center gap-2">
                            {i > 0 && (
                              <span className="text-border select-none" aria-hidden>
                                ·
                              </span>
                            )}
                            {a.href ? (
                              <a
                                href={a.href}
                                {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                className="text-brand-500 underline-offset-4 transition-all duration-200 hover:text-brand-600 hover:underline"
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
                    {c.featured && (
                      <AnimatedArrow className="relative mt-4 hidden h-6 w-6 shrink-0 text-brand-500 transition-transform duration-300 group-hover:translate-x-1 sm:mt-0 sm:block" />
                    )}
                  </Card>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1} className="mt-14">
              <h2 className="text-xl font-semibold">Frequently asked questions</h2>
              <p className="mt-2 text-sm text-muted">Can&apos;t find what you&apos;re looking for? Just send us a message.</p>
              <FaqAccordion items={faqs} className="mt-6" />
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
