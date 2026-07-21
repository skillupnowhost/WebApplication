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
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";

export const metadata = { title: "MyLoginn Astrology — Your Divine Self-Discovery" };

const SERVICES = [
  {
    icon: AnimatedLayers,
    title: "Single Page Horoscope",
    desc: "A professional one-page jenma pathirikai — panchang, charts, dasha balance, doshas, and lucky details, print-ready.",
    href: "/astrology/new?depth=SUMMARY",
    cta: "Generate",
    featured: true,
    index: "01",
  },
  {
    icon: AnimatedMandala,
    title: "Complete Horoscope",
    desc: "The full multi-page jathagam: planetary strengths, dasha timeline, in-depth analysis, remedies, and predictions.",
    href: "/astrology/new?depth=FULL",
    cta: "Generate",
    featured: true,
    index: "02",
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

const FEATURED = SERVICES.filter((s) => s.featured);
const REST = SERVICES.filter((s) => !s.featured);

const TRUST_STATS = [
  { value: "9", label: "grahas computed live" },
  { value: "36", label: "point Ashtakoot Milan" },
  { value: "5", label: "languages, script-native" },
  { value: "4", label: "astrology systems" },
];

const PROOF_POINTS = [
  "Positions from real ephemeris data, not lookup tables",
  "Verified against professional panchangam software",
  "Print-ready PDF, generated on demand",
];

export default function AstrologyLandingPage() {
  return (
    <>
      <Section className="celestial-hero pt-14 sm:pt-14">
        <div className="starfield-celestial" aria-hidden />
        <div className="celestial-halo" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-8 hidden h-[26rem] w-[26rem] opacity-[0.09] sm:block lg:-right-16 lg:top-0"
        >
          <AnimatedMandala className="h-full w-full" />
        </div>
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
            <Reveal delay={0.04}>
              <div className="celestial-divider mx-auto mt-5 w-16" />
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Understand your <span className="celestial-glow-text">stars</span>, computed precisely
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-4 text-lg text-muted text-pretty">
                A real Vedic astrology engine — horoscopes, marriage matching, baby naming, numerology, and muhurtham
                finding, all computed live from real ephemeris data in English, Tamil, Hindi, Telugu, or Malayalam.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
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

          <Reveal delay={0.26}>
            <div className="relative mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="celestial-glow-text text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
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

          <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
            {FEATURED.map((s) => (
              <RevealItem key={s.title} className="lg:col-span-6">
                <Link href={s.href} className="group block h-full">
                  <GlassCard className="celestial-card relative flex h-full flex-col overflow-hidden p-7 transition-transform duration-300 group-hover:-translate-y-1.5 sm:p-8">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-6 top-6 font-serif text-4xl italic text-amber-700/10 sm:text-5xl"
                    >
                      {s.index}
                    </span>
                    <span className="celestial-icon-badge h-14 w-14">
                      <s.icon className="h-8 w-8" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold sm:text-xl">{s.title}</h3>
                    <p className="mt-2.5 max-w-md flex-1 text-sm text-muted sm:text-[0.95rem]">{s.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
                      {s.cta}
                      <AnimatedArrow className="h-5 w-5" />
                    </span>
                  </GlassCard>
                </Link>
              </RevealItem>
            ))}

            {REST.map((s) => (
              <RevealItem key={s.title} className="lg:col-span-3">
                <Link href={s.href} className="group block h-full">
                  <GlassCard className="celestial-card relative flex h-full flex-col overflow-hidden p-6 transition-transform duration-300 group-hover:-translate-y-1.5">
                    <span className="celestial-icon-badge h-11 w-11">
                      <s.icon className="h-6 w-6" />
                    </span>
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
              <div className="celestial-halo opacity-70" aria-hidden />
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-15">
                <AnimatedMandala className="h-full w-full" />
              </div>
              <div className="relative">
                <h2 className="text-2xl font-semibold">Every report is computed, never templated</h2>
                <p className="mx-auto mt-3 max-w-md text-muted">
                  Planetary positions from real ephemeris data, verified against professional panchangam software.
                  View on screen or download a professional PDF.
                </p>
                <ul className="mx-auto mt-6 flex max-w-md flex-col items-start gap-2.5 text-left sm:items-center sm:text-center">
                  {PROOF_POINTS.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-muted">
                      <AnimatedStar className="h-4 w-4 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex justify-center">
                  <Button href="/astrology/new" size="lg">
                    Start now
                  </Button>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
