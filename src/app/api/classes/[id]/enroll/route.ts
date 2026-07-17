import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in to enroll" }, { status: 401 });

  const { id } = await params;
  const tutorClass = await prisma.tutorClass.findUnique({ where: { id } });
  if (!tutorClass || tutorClass.status === "CANCELLED") {
    return NextResponse.json({ error: "This class is no longer available" }, { status: 404 });
  }

  const existing = await prisma.classBooking.findUnique({
    where: { classId_userId: { classId: id, userId: user.id } },
  });
  if (existing) return NextResponse.json({ booking: existing });

  const booking = await prisma.classBooking.create({ data: { classId: id, userId: user.id } });
  return NextResponse.json({ booking });
}
