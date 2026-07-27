import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  requireEmailVerification: z.coerce.boolean().default(false),
  requirePhoneVerification: z.coerce.boolean().default(false),
  otpResendCooldownSeconds: z.coerce.number().int().min(10).max(300).default(30),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const settings = await prisma.authSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const data = schema.parse(await req.json());
    const settings = await prisma.authSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data },
      update: data,
    });
    return NextResponse.json({ settings });
  } catch (err) {
    if (err instanceof ZodError) {
      const issue = err.issues[0];
      return NextResponse.json({ error: issue?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("[auth-settings api]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
