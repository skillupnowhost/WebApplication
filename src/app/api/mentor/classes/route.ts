import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClass } from "@/lib/classes";

const iso = (d: Date) => d.toISOString();

async function getOwnTutor(userId: string) {
  return prisma.tutor.findUnique({ where: { userId } });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const tutor = await getOwnTutor(user.id);
  if (!tutor) return NextResponse.json({ error: "No mentor profile linked to this account yet" }, { status: 404 });

  const classes = await prisma.tutorClass.findMany({
    where: { tutorId: tutor.id },
    orderBy: { startsAt: "desc" },
    include: { _count: { select: { bookings: true, recordings: true } } },
  });

  return NextResponse.json({
    rows: classes.map((c) => ({
      id: c.id,
      subject: c.subject,
      title: c.title,
      description: c.description,
      startsAt: iso(c.startsAt),
      endsAt: iso(c.endsAt),
      status: c.status,
      joinUrl: c.joinUrl,
      recordingAccessTier: c.recordingAccessTier,
      googleEventLink: c.googleEventLink,
      bookings: c._count.bookings,
      recordings: c._count.recordings,
    })),
  });
}

const classCreate = z.object({
  subject: z.string().trim().min(2),
  title: z.string().trim().min(3),
  description: z.string().trim().optional().nullable(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  recordingAccessTier: z.enum(["FREE", "STANDARD", "PREMIUM"]).default("FREE"),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const tutor = await getOwnTutor(user.id);
  if (!tutor) return NextResponse.json({ error: "No mentor profile linked to this account yet" }, { status: 404 });

  const parsed = classCreate.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  if (parsed.data.endsAt <= parsed.data.startsAt) {
    return NextResponse.json({ error: "End time must be after the start time" }, { status: 400 });
  }

  const created = await createClass({ tutorId: tutor.id, ...parsed.data });
  return NextResponse.json({ row: { id: created.id } });
}
