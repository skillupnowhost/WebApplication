import { NextResponse } from "next/server";
import { z } from "zod";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  heroTitle: z.string().trim().min(2),
  heroTagline: z.string().trim().optional().default(""),
  overview: z.string().trim().optional().default(""),
  mission: z.string().trim().optional().default(""),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const content = await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const data = schema.parse(await req.json());
    const content = await prisma.aboutContent.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data },
      update: data,
    });
    return NextResponse.json({ content });
  } catch (err) {
    if (err instanceof ZodError) {
      const issue = err.issues[0];
      return NextResponse.json({ error: issue?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("[about-content api]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
