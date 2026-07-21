import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Section, Container, Eyebrow } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { ApplyForm } from "@/components/internships/ApplyForm";
import { AnimatedMapPin } from "@/components/ui/icons/AnimatedMapPin";
import { AnimatedClock } from "@/components/ui/icons/AnimatedClock";
import { AnimatedRupee } from "@/components/ui/icons/AnimatedRupee";
import { AnimatedCalendar } from "@/components/ui/icons/AnimatedCalendar";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";

export default async function InternshipDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const internship = await prisma.internship.findUnique({ where: { slug } });
  if (!internship) notFound();

  const user = await getCurrentUser();
  const existingApplication = user
    ? await prisma.internshipApplication.findUnique({
        where: { userId_internshipId: { userId: user.id, internshipId: internship.id } },
      })
    : null;

  const requirements = JSON.parse(internship.requirements) as string[];
  const responsibilities = JSON.parse(internship.responsibilities) as string[];
  const deadline = internship.applyDeadline;

  return (
    <Section className="relative overflow-hidden pt-14 sm:pt-14">
      <div className="aurora-blob -left-24 top-0 h-72 w-72 bg-accent-400/20" aria-hidden />
      <div className="aurora-blob aurora-blob-alt -right-20 top-32 h-64 w-64 bg-brand-400/15" aria-hidden />
      <Container className="relative">
        <Breadcrumbs
          items={[{ label: "Internships", href: "/internships" }, { label: internship.title }]}
          className="mb-6"
        />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <Reveal direction="up" className="lg:col-span-2">
            <Eyebrow>{internship.type} Internship</Eyebrow>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{internship.title}</h1>
            <p className="mt-2 text-muted">{internship.company}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
              <span className="group flex items-center gap-1.5">
                <AnimatedMapPin className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" /> {internship.location}
              </span>
              <span className="group flex items-center gap-1.5">
                <AnimatedClock className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" /> {internship.durationWeeks} weeks
              </span>
              <span className="group flex items-center gap-1.5">
                <AnimatedRupee className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
                {internship.paid ? `${internship.stipend?.toLocaleString()}/month` : "Unpaid"}
              </span>
              <span className="group flex items-center gap-1.5">
                <AnimatedCalendar className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" /> Apply by {deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            <p className="mt-8 leading-relaxed text-foreground/90">{internship.description}</p>

            <div className="mt-8">
              <h2 className="font-semibold">Responsibilities</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                {responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="font-semibold">Requirements</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-2xl border border-border-soft bg-surface-2/60 p-5">
              <h2 className="text-sm font-semibold">Mentor contact</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                {internship.mentorName} ·
                <a href={`mailto:${internship.mentorEmail}`} className="group flex items-center gap-1 text-brand-500">
                  <AnimatedMail className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-125" /> {internship.mentorEmail}
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <div className="lg:sticky lg:top-24">
              <ApplyForm
                internshipId={internship.id}
                isLoggedIn={!!user}
                alreadyApplied={!!existingApplication}
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
