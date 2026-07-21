import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { MentoringHero } from "@/components/mentoring/MentoringHero";
import { MentorGrid, type MentorData } from "@/components/mentoring/MentorGrid";
import { Button } from "@/components/ui/Button";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";

export const metadata = { title: "Mentoring — MyLoginn" };
export const dynamic = "force-dynamic";

export default async function MentoringPage() {
  const mentors = await prisma.user.findMany({
    where: { role: "MENTOR" },
    orderBy: { name: "asc" },
    include: { mentoredProjects: { select: { id: true, title: true, status: true } } },
  });

  const mentorData: MentorData[] = mentors.map((m) => ({
    id: m.id,
    name: m.name,
    avatarColor: m.avatarColor,
    avatarUrl: m.avatarUrl,
    projects: m.mentoredProjects,
  }));

  const projectsMentored = mentorData.reduce((sum, m) => sum + m.projects.length, 0);
  const activeProjects = mentorData.reduce(
    (sum, m) => sum + m.projects.filter((p) => p.status !== "completed").length,
    0
  );

  return (
    <>
      <MentoringHero mentors={mentorData} projectsMentored={projectsMentored} activeProjects={activeProjects} />

      <Section className="overflow-hidden pt-10 sm:pt-14">
        <Container>
          <Breadcrumbs items={[{ label: "Mentoring" }]} className="mb-6" />

          <MentorGrid mentors={mentorData} />

          <Reveal className="mt-16 text-center sm:mt-20">
            <h2 className="text-xl font-semibold sm:text-2xl">Want a mentor for your next project?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              Start a capstone project on MyLoginn and get paired with a mentor from our network.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href="/projects" size="lg" icon={<AnimatedArrow className="h-5 w-5" />}>
                Explore project tracks
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
