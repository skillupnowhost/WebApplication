import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessRecording } from "@/lib/tutoring-access";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  const { id } = await params;
  const tutorClass = await prisma.tutorClass.findUnique({
    where: { id },
    include: { tutor: { select: { userId: true } }, recordings: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!tutorClass) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const recording = tutorClass.recordings[0];
  if (!recording) return NextResponse.json({ error: "No recording available yet" }, { status: 404 });

  const allowed = canAccessRecording(
    { id: user.id, role: user.role, tutoringTier: user.tutoringTier },
    { mentorUserId: tutorClass.tutor.userId, recordingAccessTier: tutorClass.recordingAccessTier }
  );
  if (!allowed) {
    return NextResponse.json({ error: "This recording requires a higher tutoring tier" }, { status: 403 });
  }

  return NextResponse.json({ webViewLink: recording.driveWebViewLink });
}
