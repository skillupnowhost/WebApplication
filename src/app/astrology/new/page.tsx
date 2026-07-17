import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BirthDetailsForm } from "@/components/astrology/BirthDetailsForm";

export const metadata = { title: "Discover Your Horoscope — MyLoginn Astrology" };

export default function AstrologyNewPage() {
  return (
    <Section className="pt-14 sm:pt-14">
      <Container>
        <Breadcrumbs items={[{ label: "Astrology", href: "/astrology" }, { label: "New reading" }]} className="mb-6" />
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow>Your Cosmic Blueprint</Eyebrow>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Tell us when and where you were born</h1>
          <p className="mt-4 text-muted">
            We&apos;ll calculate your real birth chart from astronomical data — no guesswork, no generic sun-sign copy.
          </p>
        </div>

        <div className="mt-12">
          <BirthDetailsForm />
        </div>
      </Container>
    </Section>
  );
}
