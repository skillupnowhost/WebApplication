import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";

/** Shown when a stateless report URL has invalid parameters or the place can't be geocoded. */
export function ReportParamsError({ message, backHref, backLabel }: { message: string; backHref: string; backLabel: string }) {
  return (
    <Section className="celestial-hero pt-14 sm:pt-14">
      <Container className="max-w-xl">
        <GlassCard className="celestial-card p-8 text-center">
          <p className="text-lg font-semibold">{message}</p>
          <div className="mt-6 flex justify-center">
            <Button href={backHref}>{backLabel}</Button>
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
}

/** Next.js searchParams values may be string[] — reports only ever use the first value. */
export function firstParams(raw: Record<string, string | string[] | undefined>): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}
