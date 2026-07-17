import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function jsonListToText(raw: string): string {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.join(", ") : raw;
  } catch {
    return raw;
  }
}

function textToJsonList(text: string) {
  return JSON.stringify(
    text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const tutor = await prisma.tutor.findUnique({ where: { userId: user.id } });
  if (!tutor) return NextResponse.json({ error: "No mentor profile linked to this account yet" }, { status: 404 });

  return NextResponse.json({
    profile: {
      name: tutor.name,
      subject: tutor.subject,
      qualification: tutor.qualification,
      experienceYears: tutor.experienceYears,
      rating: tutor.rating,
      bio: tutor.bio,
      boards: jsonListToText(tutor.boards),
      grades: jsonListToText(tutor.grades),
    },
  });
}

const profileUpdate = z.object({
  subject: z.string().trim().min(2).optional(),
  qualification: z.string().trim().min(2).optional(),
  experienceYears: z.coerce.number().int().min(0).max(60).optional(),
  bio: z.string().trim().min(10).optional(),
  boards: z.string().trim().optional(),
  grades: z.string().trim().optional(),
});

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const tutor = await prisma.tutor.findUnique({ where: { userId: user.id } });
  if (!tutor) return NextResponse.json({ error: "No mentor profile linked to this account yet" }, { status: 404 });

  const parsed = profileUpdate.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { boards, grades, ...rest } = parsed.data;

  await prisma.tutor.update({
    where: { id: tutor.id },
    data: {
      ...rest,
      ...(boards !== undefined && { boards: textToJsonList(boards) }),
      ...(grades !== undefined && { grades: textToJsonList(grades) }),
    },
  });

  return NextResponse.json({ ok: true });
}
