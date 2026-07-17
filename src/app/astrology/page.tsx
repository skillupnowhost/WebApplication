import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedBulb } from "@/components/ui/icons/AnimatedBulb";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";

export const metadata = { title: "MyLoginn Astrology — Your Divine Self-Discovery" };

const FEATURES = [
  {
    icon: AnimatedSparkle,
    title: "Real astronomical calculations",
    desc: "Every rashi, nakshatra, and planetary position is computed from your exact birth instant — not a generic sun-sign template.",
  },
  {
    icon: AnimatedBulb,
    title: "Three voices, your choice",
    desc: "Read it as a warm story, a professional printed report, or a dynamic animated reveal — same chart, your preferred style.",
  },
  {
    icon: AnimatedLayers,
    title: "Summary or deep dive",
    desc: "A concise single-page reading, or a full multi-page report with 5-year age-band predictions and numerology.",
  },
];

export default function AstrologyLandingPage() {
  return (
    <>
      <Section className="pt-14 sm:pt-14">
        <Container>
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="aurora-blob pointer-events-none absolute -left-24 -top-10 h-64 w-64 opacity-30" />
            <div className="aurora-blob-alt pointer-events-none absolute -right-16 top-10 h-56 w-56 opacity-25" />
            <Reveal>
              <div className="flex justify-center">
                <Eyebrow>
                  <AnimatedMoonStar className="h-4 w-4" />
                  MyLoginn Astrology
                </Eyebrow>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                Understand your <span className="brand-gradient-text">stars</span>, on your own terms
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-muted">
                Enter your birth details once and get a divine, precisely calculated horoscope — zodiac, age-based
                predictions, numerology, and marriage matching — without ever visiting an astrologer.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button href="/astrology/new" size="lg">
                  Reveal my horoscope
                </Button>
              </div>
            </Reveal>
          </div>

          <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <RevealItem key={f.title}>
                <GlassCard className="card-shine relative h-full overflow-hidden p-6">
                  <f.icon className="h-9 w-9" />
                  <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted">{f.desc}</p>
                </GlassCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
