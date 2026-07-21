import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadRecordingToDrive } from "@/lib/google";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "MENTOR" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const tutorClass = await prisma.tutorClass.findUnique({ where: { id }, include: { tutor: true } });
  if (!tutorClass) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role === "MENTOR" && tutorClass.tutor.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!tutorClass.tutor.userId) {
    return NextResponse.json({ error: "This class's mentor has no login account linked" }, { status: 409 });
  }

  if (!req.body) return NextResponse.json({ error: "Empty recording" }, { status: 400 });

  const filename = req.headers.get("x-filename") ?? `class-${id}-${Date.now()}.webm`;
  const nodeStream = Readable.fromWeb(req.body as unknown as import("node:stream/web").ReadableStream);

  try {
    const driveFile = await uploadRecordingToDrive(tutorClass.tutor.userId, filename, "video/webm", nodeStream);
    if (!driveFile.id) throw new Error("Drive upload returned no file id");

    const recording = await prisma.classRecording.create({
      data: {
        classId: id,
        driveFileId: driveFile.id,
        driveWebViewLink: driveFile.webViewLink ?? "",
      },
    });

    return NextResponse.json({ recording });
  } catch (err) {
    console.error("Recording upload failed", id, err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
