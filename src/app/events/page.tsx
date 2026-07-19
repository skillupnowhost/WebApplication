import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EventsHero } from "@/components/events/EventsHero";
import { EventsExplorer, type EventData } from "@/components/events/EventsExplorer";

export const metadata = { title: "Events — MyLoginn" };

export default async function EventsPage() {
  const rows = await prisma.event.findMany({ orderBy: { startsAt: "asc" } });

  const events: EventData[] = rows.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.description,
    category: e.category ?? "",
    mode: e.mode,
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt ? e.endsAt.toISOString() : null,
    location: e.location ?? "",
    coverImageUrl: e.coverImageUrl ?? "",
    registerUrl: e.registerUrl ?? "",
  }));

  const upcomingCount = events.filter((e) => new Date(e.startsAt).getTime() >= new Date().getTime()).length;
  const categories = [...new Set(events.map((e) => e.category).filter(Boolean))];

  return (
    <Section className="overflow-hidden pt-14 sm:pt-16">
      <Container>
        <Breadcrumbs items={[{ label: "Events" }]} className="mb-6" />
        <EventsHero
          upcomingCount={upcomingCount}
          totalCount={events.length}
          categories={categories}
          categoryCount={categories.length}
        />

        <div className="mt-14 sm:mt-16">
          <EventsExplorer events={events} />
        </div>
      </Container>
    </Section>
  );
}
