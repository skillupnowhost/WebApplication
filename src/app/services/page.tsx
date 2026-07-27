import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesOverview } from "@/components/services/ServicesOverview";
import type { ServiceCategory } from "@/components/services/ServiceCategoryCard";
import { AnimatedAi } from "@/components/ui/icons/AnimatedAi";
import { AnimatedCode } from "@/components/ui/icons/AnimatedCode";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedChecklist } from "@/components/ui/icons/AnimatedChecklist";
import { AnimatedBriefcase } from "@/components/ui/icons/AnimatedBriefcase";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedUploadCloud } from "@/components/ui/icons/AnimatedUploadCloud";
import { AnimatedTrending } from "@/components/ui/icons/AnimatedTrending";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";

export const metadata = { title: "Services & What We Do — MyLoginn" };

// The 8 categories from the client spec. Web Development and Digital
// Transformation Services are the two that already have dedicated deep-dive
// pages (App & Web Development, Digital Marketing) — those cards link
// through instead of duplicating that content. The other 6 are informational
// cards that route to /contact; none of them get an invented placeholder page.
const categories: ServiceCategory[] = [
  {
    title: "AI & Generative AI Solutions",
    description: "Custom AI copilots, chat assistants and generative workflows built around your data and product.",
    icon: AnimatedAi,
    href: "/contact",
    ctaLabel: "Get in touch",
  },
  {
    title: "Web Development",
    description: "Full-stack, production-grade websites and web apps — from marketing sites to complex dashboards.",
    icon: AnimatedCode,
    href: "/services/app-web-development",
    ctaLabel: "Explore this service",
    dedicated: true,
  },
  {
    title: "Mobile App Development",
    description: "Native-feeling iOS & Android apps, built cross-platform and shipped to both stores.",
    icon: AnimatedPhone,
    href: "/contact",
    ctaLabel: "Get in touch",
  },
  {
    title: "Automation & Testing",
    description: "Workflow automation, CI pipelines and automated test coverage so releases stay fast and safe.",
    icon: AnimatedChecklist,
    href: "/contact",
    ctaLabel: "Get in touch",
  },
  {
    title: "Internship Programs",
    description: "Structured, mentor-led internships that turn students into job-ready engineers and marketers.",
    icon: AnimatedBriefcase,
    href: "/contact",
    ctaLabel: "Get in touch",
  },
  {
    title: "Software Training",
    description: "Cohort-based and 1:1 training tracks across modern stacks, guided by working engineers.",
    icon: AnimatedGraduation,
    href: "/contact",
    ctaLabel: "Get in touch",
  },
  {
    title: "Cloud & API Integration",
    description: "Cloud infrastructure, third-party API integrations and backend services that scale with you.",
    icon: AnimatedUploadCloud,
    href: "/contact",
    ctaLabel: "Get in touch",
  },
  {
    title: "Digital Transformation Services",
    description: "AI-driven growth strategy, campaigns and automation that modernize how you reach customers.",
    icon: AnimatedTrending,
    href: "/services/digital-marketing",
    ctaLabel: "Explore this service",
    dedicated: true,
  },
];

const dedicatedCount = categories.filter((c) => c.dedicated).length;

export default function ServicesPage() {
  return (
    <Section className="overflow-hidden pt-14 sm:pt-14">
      <Container>
        <Breadcrumbs items={[{ label: "Services" }]} className="mb-6" />

        <ServicesHero categoryCount={categories.length} dedicatedCount={dedicatedCount} />

        <div id="categories" className="mt-16 scroll-mt-24 sm:mt-20">
          <Reveal>
            <h2 className="font-semibold">What we offer</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Two of these — App &amp; Web Development and Digital Marketing — have full deep-dive pages with our
              process, stack and engagement tiers. The rest are here to give you the lay of the land; reach out and
              we&apos;ll scope it with you.
            </p>
          </Reveal>

          <div className="mt-8">
            <ServicesOverview categories={categories} />
          </div>
        </div>

        <Reveal className="mt-16 sm:mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-border-soft bg-gradient-to-br from-brand-50 to-surface-2 p-8 text-center dark:from-brand-900/20 dark:to-surface-2 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(108,77,255,0.2),transparent_70%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.18),transparent_70%)]"
            />
            <h2 className="text-xl font-semibold sm:text-2xl">Not sure which service fits?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
              Tell us what you&apos;re trying to build or learn — we&apos;ll point you at the right team, program or
              engagement model.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button href="/contact" variant="primary" size="lg" icon={<AnimatedArrow className="h-4.5 w-4.5" />}>
                Talk to our team
              </Button>
              <Button href="/courses" variant="secondary" size="lg">
                Browse courses instead
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
