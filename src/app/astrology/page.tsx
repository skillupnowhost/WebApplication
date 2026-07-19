import Link from "next/link";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { AstroBreadcrumbs } from "@/components/astrology/AstroBreadcrumbs";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";
import { AnimatedCelestialWheel } from "@/components/ui/icons/AnimatedCelestialWheel";
import { AnimatedMandala } from "@/components/ui/icons/AnimatedMandala";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { AnimatedOm } from "@/components/ui/icons/AnimatedOm";

export const metadata = { title: "MyLoginn Astrology — Your Divine Self-Discovery" };

const SERVICES = [
  {
    icon: AnimatedLayers,
    title: "Single Page Horoscope",
    desc: "A professional one-page jenma pathirikai — panchang, charts, dasha balance, doshas, and lucky details, print-ready.",
    href: "/astrology/new?depth=SUMMARY",
    cta: "Generate",
  },
  {
    icon: AnimatedMandala,
    title: "Complete Horoscope",
    desc: "The full multi-page jathagam: planetary strengths, dasha timeline, in-depth analysis, remedies, and predictions.",
    href: "/astrology/new?depth=FULL",
    cta: "Generate",
  },
  {
    icon: AnimatedUsers,
    title: "Horoscope Matching",
    desc: "Classical Ashtakoot Guna Milan — a 36-point marriage compatibility score with dosha checks and remedies.",
    href: "/astrology/match",
    cta: "Match now",
  },
  {
    icon: AnimatedOm,
    title: "Baby Naming",
    desc: "Lucky names from the real moon-nakshatra syllables, ranked by Chaldean numerology — with meanings.",
    href: "/astrology/naming",
    cta: "Find names",
  },
  {
    icon: AnimatedSparkle,
    title: "Numerology",
    desc: "Psychic, destiny, name, soul, and personality numbers — plus lucky dates, days, colors, and compatible numbers.",
    href: "/astrology/numerology",
    cta: "Reveal numbers",
  },
  {
    icon: AnimatedCelestialWheel,
    title: "Shubha Muhurtham",
    desc: "Scan any date range for auspicious days and time slots — clear of Rahu Kalam, Yamagandam, and Gulikai.",
    href: "/astrology/muhurtham",
    cta: "Find dates",
  },
];

export default function AstrologyLandingPage() {
  return (
    <>
      <Section className="celestial-hero pt-14 sm:pt-14">
        <div className="starfield" aria-hidden />
        <Container>
          <AstroBreadcrumbs />
          <div className="relative mx-auto max-w-2xl text-center">
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
                Understand your <span className="celestial-glow-text">stars</span>, computed precisely
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-lg text-muted">
                A real Vedic astrology engine — horoscopes, marriage matching, baby naming, numerology, and muhurtham
                finding, all computed live from real ephemeris data in English, Tamil, or Hindi.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/astrology/new" size="lg">
                  Generate my horoscope
                </Button>
                <Button href="/astrology/match" variant="secondary" size="lg">
                  Check marriage compatibility
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="pt-0 sm:pt-4">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex justify-center">
                <Eyebrow>What&apos;s inside</Eyebrow>
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Everything your <span className="celestial-glow-text">stars</span> can tell you
              </h2>
              <p className="mt-3 text-muted">
                Six classical sciences, one computation engine — pick a service and get a report in seconds.
              </p>
            </div>
          </Reveal>
          <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <RevealItem key={s.title}>
                <Link href={s.href} className="group block h-full">
                  <GlassCard className="celestial-card relative flex h-full flex-col overflow-hidden p-6 transition-transform duration-300 group-hover:-translate-y-1.5">
                    <s.icon className="h-9 w-9" />
                    <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{s.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
                      {s.cta}
                      <AnimatedArrow className="h-5 w-5" />
                    </span>
                  </GlassCard>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <GlassCard className="celestial-card relative overflow-hidden p-8 text-center sm:p-12">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-15">
                <AnimatedMandala className="h-full w-full" />
              </div>
              <h2 className="text-2xl font-semibold">Every report is computed, never templated</h2>
              <p className="mx-auto mt-3 max-w-md text-muted">
                Planetary positions from real ephemeris data, verified against professional panchangam software. View on
                screen or download a professional PDF.
              </p>
              <div className="mt-6 flex justify-center">
                <Button href="/astrology/new" size="lg">
                  Start now
                </Button>
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
