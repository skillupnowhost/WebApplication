import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { MuhurthamForm } from "@/components/astrology/MuhurthamForm";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { AnimatedCelestialWheel } from "@/components/ui/icons/AnimatedCelestialWheel";

export const metadata = { title: "Shubha Muhurtham — MyLoginn Astrology" };

export default function AstrologyMuhurthamPage() {
  return (
    <Section className="celestial-hero pt-14 sm:pt-14">
      <div className="starfield" aria-hidden />
      <Container className="max-w-xl">
        <AstroBreadcrumbs items={[{ label: "Muhurtham" }]} />
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Eyebrow>
              <AnimatedCelestialWheel className="h-4 w-4" />
              MyLoginn Astrology
            </Eyebrow>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Pick the <span className="celestial-glow-text">auspicious day</span>
          </h1>
          <p className="mt-3 text-muted">
            Scans every day in your range with the real sunrise panchangam — nakshatra, tithi, yoga — and returns the
            best dates with time slots clear of Rahu Kalam, Yamagandam, and Gulikai.
          </p>
        </div>
        <MuhurthamForm />
      </Container>
    </Section>
  );
}
