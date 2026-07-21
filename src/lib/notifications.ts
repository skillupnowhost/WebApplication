import { prisma } from "./prisma";

export async function notifyClassCreated(input: {
  mentorUserId: string | null;
  mentorName: string;
  title: string;
  subject: string;
  startsAt: Date;
}) {
  const recipients = await prisma.user.findMany({
    where: {
      role: { in: ["STUDENT", "ADMIN", "MENTOR"] },
      ...(input.mentorUserId ? { id: { not: input.mentorUserId } } : {}),
    },
    select: { id: true },
  });
  if (recipients.length === 0) return;

  const when = input.startsAt.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  await prisma.notification.createMany({
    data: recipients.map((r) => ({
      userId: r.id,
      title: `New class scheduled: ${input.title}`,
      body: `${input.mentorName} scheduled a ${input.subject} class on ${when}.`,
    })),
  });
}
