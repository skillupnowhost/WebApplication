import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LiveClassRoom } from "@/components/classes/LiveClassRoom";

export const metadata = { title: "Live class — MyLoginn" };

export default async function ClassRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tutorClass = await prisma.tutorClass.findUnique({
    where: { id },
    include: { tutor: true, bookings: { where: { userId: user.id } } },
  });
  if (!tutorClass) notFound();

  const isMentor = tutorClass.tutor.userId === user.id;
  const isAdmin = user.role === "ADMIN";
  const isEnrolled = tutorClass.bookings.some((b) => b.status !== "cancelled");

  if (!isMentor && !isAdmin && !isEnrolled) redirect("/tutoring");

  return (
    <LiveClassRoom
      classId={tutorClass.id}
      roomSlug={tutorClass.roomSlug}
      title={tutorClass.title}
      canRecord={isMentor || isAdmin}
      displayName={user.name}
    />
  );
}
