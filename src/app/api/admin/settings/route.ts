import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CONTACT_EMAILS } from "@/lib/contactInfo";

const DEFAULT_SUPPORT_EMAIL = CONTACT_EMAILS.find((e) => e.key === "general")?.email ?? "myloginntech@gmail.com";

const schema = z.object({
  maintenanceMode: z.coerce.boolean().default(false),
  allowNewSignups: z.coerce.boolean().default(true),
  supportEmail: z.string().trim().email(),
  announcementBanner: z.string().trim().optional().nullable(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const settings = await prisma.systemSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", supportEmail: DEFAULT_SUPPORT_EMAIL },
    update: {},
  });
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const data = schema.parse(await req.json());
    const settings = await prisma.systemSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data, announcementBanner: data.announcementBanner || null },
      update: { ...data, announcementBanner: data.announcementBanner || null },
    });
    return NextResponse.json({ settings });
  } catch (err) {
    if (err instanceof ZodError) {
      const issue = err.issues[0];
      return NextResponse.json({ error: issue?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("[settings api]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
