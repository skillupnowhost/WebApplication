import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/services/LeadForm";
import { AppWebDevHero } from "@/components/services/AppWebDevHero";
import { FeatureBentoGrid, type Feature } from "@/components/services/FeatureBentoGrid";
import { PillRow } from "@/components/services/PillRow";
import { HowItWorksTimeline, type TimelineStep } from "@/components/services/HowItWorksTimeline";
import { EngagementTiers, type EngagementTier } from "@/components/services/EngagementTiers";
import { FaqAccordion, type FaqAccordionItem } from "@/components/ui/FaqAccordion";

export const metadata = { title: "App & Website Development — MyLoginn" };

const features: Feature[] = [
  {
    iconKey: "webdev",
    title: "Full-stack development",
    description: "Modern, scalable apps and websites built end-to-end by senior engineers.",
    span: true,
  },
  {
    iconKey: "cloud",
    title: "Cloud infrastructure & DevOps",
    description: "CI/CD, monitoring and auto-scaling so you never worry about uptime.",
  },
  {
    iconKey: "network",
    title: "Real-time features",
    description: "Live data sync across dashboards, apps and admin panels out of the box.",
  },
  {
    iconKey: "cyber",
    title: "Security by default",
    description: "Auth, data protection and best practices baked into every build.",
  },
  {
    iconKey: "testing",
    title: "Tested & maintained",
    description: "Automated test coverage plus ongoing monitoring after launch.",
  },
];

const stack = ["Next.js", "React Native", "Node.js", "PostgreSQL", "Prisma", "Three.js", "Tailwind CSS", "AWS / Vercel"];

const processSteps: TimelineStep[] = [
  { title: "Discovery & scoping", description: "We map goals, users and technical constraints into a clear spec." },
  { title: "Design & prototype", description: "Interactive prototypes and a design system before a line of production code." },
  { title: "Build & QA", description: "Agile sprints with weekly demos, automated tests and code review." },
  { title: "Launch & handover", description: "Production deployment, documentation and a full source-code handover." },
  { title: "Ongoing care", description: "Optional retainer for monitoring, patching and feature iterations." },
];

const tiers: EngagementTier[] = [
  {
    name: "Fixed Scope",
    tagline: "For a well-defined product with a clear spec.",
    features: ["Detailed proposal & timeline", "Milestone-based delivery", "Fixed feature set", "30-day post-launch support"],
  },
  {
    name: "Dedicated Team",
    tagline: "For ongoing product development at speed.",
    features: [
      "Full-time engineering pod",
      "Weekly sprint demos",
      "Direct Slack / WhatsApp access",
      "Flexible scope as you learn",
    ],
    featured: true,
  },
  {
    name: "Care & Maintenance",
    tagline: "For products already live that need ongoing support.",
    features: ["Monitoring & uptime alerts", "Security patches", "Monthly feature budget", "Priority bug response"],
  },
];

/** Page-relevant FAQ categories for App & Website Development — see FAQ_CATEGORIES for the full admin list. */
const FAQ_PAGE_CATEGORIES = ["Project Assistance", "Technical Support", "AI Services"];

export default async function AppWebDevelopmentPage() {
  const faqItems = await prisma.faqItem.findMany({
    where: { category: { in: FAQ_PAGE_CATEGORIES } },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  const faqs: FaqAccordionItem[] = faqItems.map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <Section className="overflow-hidden pt-14 sm:pt-14">
      <Container>
        <Breadcrumbs items={[{ label: "Services" }, { label: "App & Web Development" }]} className="mb-6" />

        <AppWebDevHero techCount={stack.length} />

        <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <FeatureBentoGrid
              features={features}
              highlight={{ value: stack.length, suffix: "+", label: "technologies in our stack" }}
            />

            <div id="stack" className="scroll-mt-24">
              <PillRow title="Our stack" items={stack} />
            </div>

            <Reveal className="mt-14">
              <HowItWorksTimeline title="How we build" steps={processSteps} className="mt-0" />
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-semibold">Find your engagement model</h2>
              <p className="mt-2 text-sm text-muted">
                No fixed rate cards — every tier below is a starting point, scoped to your product after a discovery call.
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
              <LeadForm
                service="App & Website Development"
                title="Tell us about your project"
                submitLabel="Request a proposal"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
