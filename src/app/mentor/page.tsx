import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { IconBadge } from "@/components/ui/IconBadge";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedVideoCamera } from "@/components/ui/icons/AnimatedVideoCamera";
import { EntityManager } from "@/components/admin/EntityManager";
import { ToastProvider } from "@/components/admin/Modal";
import { mentorClassConfig } from "@/components/admin/entityConfigs";
import { MentorProfileForm } from "@/components/mentor/MentorProfileForm";
import { GoogleConnectCard } from "@/components/mentor/GoogleConnectCard";
import { MentorClassesCalendar } from "@/components/classes/MentorClassesCalendar";

export const metadata = { title: "Mentor dashboard — MyLoginn" };

function jsonListToText(raw: string): string {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.join(", ") : raw;
  } catch {
    return raw;
  }
}

export default async function MentorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null; // layout already redirects

  const [tutor, googleAccount] = await Promise.all([
    prisma.tutor.findUnique({
      where: { userId: user.id },
    }),
    prisma.googleAccount.findUnique({ where: { userId: user.id } }),
  ]);

  if (!tutor) {
    return (
      <Section className="pt-14 sm:pt-14">
        <Container>
          <Card className="p-8 text-center">
            <h1 className="text-lg font-semibold">Your mentor profile isn&apos;t linked yet</h1>
            <p className="mt-2 text-sm text-muted">
              An admin needs to link your account to a mentor profile before you can access your dashboard.
            </p>
          </Card>
        </Container>
      </Section>
    );
  }

  const [upcomingCount, studentsBooked] = await Promise.all([
    prisma.tutorClass.count({ where: { tutorId: tutor.id, status: "SCHEDULED", startsAt: { gte: new Date() } } }),
    prisma.classBooking.count({ where: { tutorClass: { tutorId: tutor.id } } }),
  ]);

  const stats = [
    { label: "Upcoming classes", value: upcomingCount },
    { label: "Students booked", value: studentsBooked },
    { label: "Rating", value: tutor.rating.toFixed(1) },
    { label: "Experience (yrs)", value: tutor.experienceYears },
  ];

  return (
    <Section className="pt-12 sm:pt-12">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} avatarColor={user.avatarColor} avatarUrl={user.avatarUrl} size={56} className="rounded-2xl text-lg" />
            <div>
              <h1 className="text-xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h1>
              <p className="text-sm text-muted">{tutor.subject} mentor · {user.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <GoogleConnectCard connected={Boolean(googleAccount)} returnTo="/mentor" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="flex items-center gap-3.5 p-5">
              <IconBadge size="md">
                <AnimatedStar className="h-7 w-7" />
              </IconBadge>
              <div>
                <p className="text-xl font-semibold">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-8 lg:col-span-2">
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-semibold">
                <AnimatedVideoCamera className="h-5.5 w-5.5" /> My classes
              </h2>
              <ToastProvider>
                <EntityManager config={mentorClassConfig} />
              </ToastProvider>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-semibold">
                <AnimatedGraduation className="h-5.5 w-5.5" /> Class calendar
              </h2>
              <Card className="p-5">
                <MentorClassesCalendar mentorName={user.name} />
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-semibold">My profile</h2>
          <Card className="p-6">
            <MentorProfileForm
              profile={{
                subject: tutor.subject,
                qualification: tutor.qualification,
                experienceYears: tutor.experienceYears,
                bio: tutor.bio,
                boards: jsonListToText(tutor.boards),
                grades: jsonListToText(tutor.grades),
              }}
            />
          </Card>
        </div>
      </Container>
    </Section>
  );
}
