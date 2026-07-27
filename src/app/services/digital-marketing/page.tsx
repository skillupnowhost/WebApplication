import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/services/LeadForm";
import { DigitalMarketingHero } from "@/components/services/DigitalMarketingHero";
import { FeatureBentoGrid } from "@/components/services/FeatureBentoGrid";
import { HowItWorksTimeline } from "@/components/services/HowItWorksTimeline";
import { PillRow } from "@/components/services/PillRow";
import { EngagementTiers, type EngagementTier } from "@/components/services/EngagementTiers";
import { FaqAccordion, type FaqAccordionItem } from "@/components/ui/FaqAccordion";

export const metadata = { title: "Digital Marketing Services — MyLoginn" };

const channels = [
  "Meta & Instagram Ads",
  "Google Search & Display",
  "WhatsApp Automation",
  "SEO & Content",
  "Marketplace Ads",
  "Influencer Collabs",
  "Email & CRM Flows",
  "Analytics & Attribution",
];

const tiers: EngagementTier[] = [
  {
    name: "Launch",
    tagline: "For businesses testing their first AI-driven campaigns.",
    features: ["1–2 active channels", "Monthly strategy call", "Core analytics dashboard", "WhatsApp lead capture"],
  },
  {
    name: "Growth",
    tagline: "For teams ready to scale spend across channels.",
    features: [
      "3–5 active channels",
      "Weekly optimization",
      "Dedicated growth strategist",
      "Full-funnel WhatsApp automation",
      "Custom reporting dashboard",
    ],
    featured: true,
  },
  {
    name: "Scale",
    tagline: "For established brands running always-on performance marketing.",
    features: [
      "Unlimited channels",
      "Daily optimization",
      "Dedicated pod — strategist, analyst & creative",
      "Priority support & SLAs",
    ],
  },
];

/** Page-relevant FAQ categories for Digital Marketing — see FAQ_CATEGORIES for the full admin list. */
const FAQ_PAGE_CATEGORIES = ["AI Services", "General Company Information", "Payments & EMI"];

export default async function DigitalMarketingServicesPage() {
  const faqItems = await prisma.faqItem.findMany({
    where: { category: { in: FAQ_PAGE_CATEGORIES } },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  const faqs: FaqAccordionItem[] = faqItems.map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <Section className="overflow-hidden pt-14 sm:pt-14">
      <Container>
        <Breadcrumbs items={[{ label: "Services" }, { label: "Digital Marketing" }]} className="mb-6" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <DigitalMarketingHero />
            <FeatureBentoGrid />
            <PillRow title="Channels we run" items={channels} className="mt-14" />
            <HowItWorksTimeline />

            <Reveal className="mt-14">
              <h2 className="font-semibold">Find your engagement model</h2>
              <p className="mt-2 text-sm text-muted">
                No fixed rate cards — every tier below is a starting point, tailored to your channels and budget.
              </p>
              <EngagementTiers tiers={tiers} />
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-semibold">Frequently asked questions</h2>
              <FaqAccordion items={faqs} className="mt-5" />
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <div id="lead-form" className="scroll-mt-24 lg:sticky lg:top-24">
              <LeadForm service="Digital Marketing" variant="dynamic" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
