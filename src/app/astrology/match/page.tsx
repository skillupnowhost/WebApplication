import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { MatchForm } from "@/components/astrology/MatchForm";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { parseAstrologyLanguage } from "@/lib/astrology/i18n";

export const metadata = { title: "Marriage compatibility — MyLoginn Astrology" };

export default async function AstrologyMatchPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const language = parseAstrologyLanguage(lang);
  return (
    <Section className="celestial-hero pt-14 sm:pt-14">
      <div className="starfield-celestial" aria-hidden />
      <Container className="max-w-3xl">
        <AstroBreadcrumbs items={[{ label: "Matching" }]} />
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Eyebrow>
              <AnimatedUsers className="h-4 w-4" />
              Marriage Compatibility
            </Eyebrow>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Check your <span className="celestial-glow-text">Ashtakoot</span> match
          </h1>
          <p className="mt-3 text-muted">Enter both birth details for a classical 36-point Guna Milan compatibility score.</p>
        </div>
        <MatchForm language={language} />
      </Container>
    </Section>
  );
}
