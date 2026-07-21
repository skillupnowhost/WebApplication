import { randomUUID } from "node:crypto";
import type { ClassStatus, FeeTier } from "@prisma/client";
import { prisma } from "./prisma";
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "./google";
import { notifyClassCreated } from "./notifications";

export type ClassInput = {
  tutorId: string;
  subject: string;
  title: string;
  description?: string | null;
  startsAt: Date;
  endsAt: Date;
  recordingAccessTier?: FeeTier;
};

/** Best-effort Calendar sync — a mentor without a connected Google account still gets a working class. */
async function syncCreate(tutorClassId: string, tutorUserId: string | null, input: ClassInput, joinUrl: string) {
  if (!tutorUserId) return;
  try {
    const event = await createCalendarEvent(tutorUserId, {
      summary: input.title,
      description: `${input.description ?? ""}\n\nJoin: ${joinUrl}`.trim(),
      start: { dateTime: input.startsAt.toISOString() },
      end: { dateTime: input.endsAt.toISOString() },
    });
    if (event?.id) {
      await prisma.tutorClass.update({
        where: { id: tutorClassId },
        data: { googleEventId: event.id, googleEventLink: event.htmlLink ?? null },
      });
    }
  } catch (err) {
    console.error("Calendar sync failed for new class", tutorClassId, err);
  }
}

export async function createClass(input: ClassInput) {
  const roomSlug = `myloginn-${randomUUID().replace(/-/g, "")}`;
  const joinUrl = `https://meet.jit.si/${roomSlug}`;

  const tutor = await prisma.tutor.findUniqueOrThrow({
    where: { id: input.tutorId },
    select: { name: true, userId: true },
  });

  const tutorClass = await prisma.tutorClass.create({
    data: {
      tutorId: input.tutorId,
      subject: input.subject,
      title: input.title,
      description: input.description ?? null,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      recordingAccessTier: input.recordingAccessTier ?? "FREE",
      roomSlug,
      joinUrl,
    },
  });

  await Promise.all([
    syncCreate(tutorClass.id, tutor.userId, input, joinUrl),
    notifyClassCreated({
      mentorUserId: tutor.userId,
      mentorName: tutor.name,
      title: input.title,
      subject: input.subject,
      startsAt: input.startsAt,
    }),
  ]);

  return prisma.tutorClass.findUniqueOrThrow({ where: { id: tutorClass.id } });
}

export async function updateClass(
  id: string,
  input: Partial<Omit<ClassInput, "tutorId">> & { status?: ClassStatus }
) {
  const existing = await prisma.tutorClass.findUnique({ where: { id }, include: { tutor: true } });
  if (!existing) throw new Error("Class not found");

  const updated = await prisma.tutorClass.update({
    where: { id },
    data: {
      ...(input.subject !== undefined && { subject: input.subject }),
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.startsAt !== undefined && { startsAt: input.startsAt }),
      ...(input.endsAt !== undefined && { endsAt: input.endsAt }),
      ...(input.recordingAccessTier !== undefined && { recordingAccessTier: input.recordingAccessTier }),
      ...(input.status !== undefined && { status: input.status }),
    },
  });

  if (existing.tutor.userId && existing.googleEventId) {
    try {
      await updateCalendarEvent(existing.tutor.userId, existing.googleEventId, {
        summary: updated.title,
        description: `${updated.description ?? ""}\n\nJoin: ${updated.joinUrl}`.trim(),
        start: { dateTime: updated.startsAt.toISOString() },
        end: { dateTime: updated.endsAt.toISOString() },
      });
    } catch (err) {
      console.error("Calendar sync failed for class update", id, err);
    }
  }

  return updated;
}

export async function deleteClass(id: string) {
  const existing = await prisma.tutorClass.findUnique({ where: { id }, include: { tutor: true } });
  if (!existing) throw new Error("Class not found");

  if (existing.tutor.userId && existing.googleEventId) {
    try {
      await deleteCalendarEvent(existing.tutor.userId, existing.googleEventId);
    } catch (err) {
      console.error("Calendar event deletion failed", id, err);
    }
  }

  await prisma.$transaction([
    prisma.classBooking.deleteMany({ where: { classId: id } }),
    prisma.classRecording.deleteMany({ where: { classId: id } }),
    prisma.tutorClass.delete({ where: { id } }),
  ]);
}
