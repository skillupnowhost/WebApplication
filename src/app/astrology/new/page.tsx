import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { BirthDetailsForm } from "@/components/astrology/BirthDetailsForm";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";
import { parseAstrologyLanguage } from "@/lib/astrology/i18n";

export const metadata = { title: "Generate your horoscope — MyLoginn Astrology" };

export default async function AstrologyNewPage({
  searchParams,
}: {
  searchParams: Promise<{ depth?: string; lang?: string }>;
}) {
  const { depth, lang } = await searchParams;
  const defaultDepth = depth === "FULL" ? depth : "SUMMARY";
  const language = parseAstrologyLanguage(lang);
  return (
    <Section className="celestial-hero pt-14 sm:pt-14">
      <div className="starfield-celestial" aria-hidden />
      <Container className="max-w-3xl">
        <AstroBreadcrumbs items={[{ label: "Generate Horoscope" }]} />
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Eyebrow>
              <AnimatedMoonStar className="h-4 w-4" />
              MyLoginn Astrology
            </Eyebrow>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Tell us your <span className="celestial-glow-text">birth details</span>
          </h1>
          <p className="mt-3 text-muted">
            One page, four required fields. Every calculation is computed live from your exact birth instant — nothing here is templated.
          </p>
        </div>
        <BirthDetailsForm defaultDepth={defaultDepth} language={language} />
      </Container>
    </Section>
  );
}
