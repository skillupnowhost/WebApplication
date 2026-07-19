import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { NamingForm } from "@/components/astrology/NamingForm";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { AnimatedOm } from "@/components/ui/icons/AnimatedOm";

export const metadata = { title: "Baby Naming — MyLoginn Astrology" };

export default function AstrologyNamingPage() {
  return (
    <Section className="celestial-hero pt-14 sm:pt-14">
      <div className="starfield" aria-hidden />
      <Container className="max-w-xl">
        <AstroBreadcrumbs items={[{ label: "Baby Naming" }]} />
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Eyebrow>
              <AnimatedOm className="h-4 w-4" />
              MyLoginn Astrology
            </Eyebrow>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Find your baby&apos;s <span className="celestial-glow-text">lucky name</span>
          </h1>
          <p className="mt-3 text-muted">
            Real moon-nakshatra syllables from the birth instant, crossed with Chaldean numerology — the same method as
            classical name books.
          </p>
        </div>
        <NamingForm />
      </Container>
    </Section>
  );
}
