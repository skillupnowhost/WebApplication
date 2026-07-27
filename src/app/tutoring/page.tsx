import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion, type FaqAccordionItem } from "@/components/ui/FaqAccordion";
import { TutoringExplorer, type TutorData } from "@/components/tutoring/TutoringExplorer";
import { TutoringHero } from "@/components/tutoring/TutoringHero";
import { UpcomingClasses } from "@/components/tutoring/UpcomingClasses";
import { FeatureBentoGrid, type Feature } from "@/components/services/FeatureBentoGrid";
import { HowItWorksTimeline, type TimelineStep } from "@/components/services/HowItWorksTimeline";
import type { ClassCardData } from "@/components/classes/ClassCalendar";

export const metadata = { title: "Tutoring — MyLoginn" };

const whyFeatures: Feature[] = [
  {
    iconKey: "student",
    title: "1:1 personalized sessions",
    description: "Every session is matched to the student's board, grade and pace — not a generic batch class.",
    span: true,
  },
  {
    iconKey: "data",
    title: "Progress dashboards",
    description: "Parents and students track attendance, topics covered and mentor notes in real time.",
  },
  {
    iconKey: "comm",
    title: "Structured feedback",
    description: "Tutors share detailed notes after every session, not just a grade.",
  },
  {
    iconKey: "career",
    title: "Exam-ready practice",
    description: "Board-aligned practice questions and mock tests as exams approach.",
  },
];

const bookingSteps: TimelineStep[] = [
  { title: "Pick a tutor", description: "Browse by subject, board and grade to find the right fit." },
  { title: "Book your slot", description: "Choose a preferred time — the tutor confirms schedule and fee directly with you." },
  { title: "Attend live sessions", description: "Join over video with real-time whiteboarding and screen share." },
  { title: "Track progress", description: "Review session notes and progress on your dashboard after every class." },
];

/** Page-relevant FAQ categories for Tutoring — see FAQ_CATEGORIES for the full admin list. */
const FAQ_PAGE_CATEGORIES = ["Courses & Training", "Account & Login", "Payments & EMI"];

export default async function TutoringPage() {
  const [user, tutors, sessionsBooked, faqItems] = await Promise.all([
    getCurrentUser(),
    prisma.tutor.findMany({ orderBy: { name: "asc" } }),
    prisma.tutoringBooking.count(),
    prisma.faqItem.findMany({
      where: { category: { in: FAQ_PAGE_CATEGORIES } },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  const faqs: FaqAccordionItem[] = faqItems.map((f) => ({ question: f.question, answer: f.answer }));

  const tutorCards: TutorData[] = tutors.map((t) => ({
    id: t.id,
    name: t.name,
    subject: t.subject,
    bio: t.bio,
    qualification: t.qualification,
    experienceYears: t.experienceYears,
    rating: t.rating,
    avatarColor: t.avatarColor,
    boards: JSON.parse(t.boards) as string[],
    grades: JSON.parse(t.grades) as string[],
  }));

  const upcoming = await prisma.tutorClass.findMany({
    where: { status: "SCHEDULED", startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    include: { tutor: { select: { name: true } }, bookings: { where: { userId: user?.id ?? "" } } },
  });

  const upcomingClasses: ClassCardData[] = upcoming.map((c) => ({
    id: c.id,
    title: c.title,
    subject: c.subject,
    mentorName: c.tutor.name,
    startsAt: c.startsAt.toISOString(),
    endsAt: c.endsAt.toISOString(),
    status: c.status,
    joinUrl: c.joinUrl,
    googleEventLink: c.googleEventLink,
    recordingAccessTier: c.recordingAccessTier,
    hasRecording: false,
    canAccessRecording: false,
    isEnrolled: c.bookings.length > 0,
  }));

  return (
    <>
      <TutoringHero tutors={tutorCards} sessionsBooked={sessionsBooked} />

      <Section className="overflow-hidden pt-10 sm:pt-14">
        <Container>
          <Breadcrumbs items={[{ label: "Tutoring" }]} className="mb-6" />

          <Reveal className="mt-2 sm:mt-4">
            <h2 className="text-center text-xl font-semibold sm:text-2xl">Why learn with MyLoginn tutors</h2>
            <FeatureBentoGrid
              features={whyFeatures}
              highlight={{ value: sessionsBooked, suffix: "+", label: "sessions booked via MyLoginn" }}
            />
          </Reveal>

          <div id="tutors" className="mt-16 scroll-mt-24 sm:mt-20">
            <TutoringExplorer tutors={tutorCards} isLoggedIn={!!user} />
          </div>

          <div className="mt-14">
            <UpcomingClasses classes={upcomingClasses} isLoggedIn={!!user} />
          </div>

          <Reveal className="mt-16 sm:mt-20">
            <HowItWorksTimeline title="How tutoring works" steps={bookingSteps} className="mt-0" />
          </Reveal>

          <Reveal className="mt-16 sm:mt-20">
            <h2 className="text-xl font-semibold">Frequently asked questions</h2>
            <FaqAccordion items={faqs} className="mt-6" />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
