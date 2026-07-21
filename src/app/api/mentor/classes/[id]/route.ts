import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateClass, deleteClass } from "@/lib/classes";

async function ownsClass(userId: string, classId: string) {
  const tutorClass = await prisma.tutorClass.findUnique({ where: { id: classId }, include: { tutor: true } });
  if (!tutorClass || tutorClass.tutor.userId !== userId) return null;
  return tutorClass;
}

const classUpdate = z.object({
  subject: z.string().trim().min(2).optional(),
  title: z.string().trim().min(3).optional(),
  description: z.string().trim().optional().nullable(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"]).optional(),
  recordingAccessTier: z.enum(["FREE", "STANDARD", "PREMIUM"]).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  if (!(await ownsClass(user.id, id))) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = classUpdate.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const updated = await updateClass(id, parsed.data);
  return NextResponse.json({ row: { id: updated.id } });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  if (!(await ownsClass(user.id, id))) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteClass(id);
  return NextResponse.json({ ok: true });
}
