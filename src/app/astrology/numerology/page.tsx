import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { NumerologyForm } from "@/components/astrology/NumerologyForm";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";

export const metadata = { title: "Numerology — MyLoginn Astrology" };

export default function AstrologyNumerologyPage() {
  return (
    <Section className="celestial-hero pt-14 sm:pt-14">
      <div className="starfield" aria-hidden />
      <Container className="max-w-xl">
        <AstroBreadcrumbs items={[{ label: "Numerology" }]} />
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Eyebrow>
              <AnimatedSparkle className="h-4 w-4" />
              MyLoginn Astrology
            </Eyebrow>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Decode your <span className="celestial-glow-text">numbers</span>
          </h1>
          <p className="mt-3 text-muted">
            Psychic, destiny, name, soul, and personality numbers with lucky dates, days, and colors — computed by the
            Chaldean method from your name and birth date.
          </p>
        </div>
        <NumerologyForm />
      </Container>
    </Section>
  );
}
