import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const users = await prisma.user.findMany({
    where: { role: "MENTOR" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({
    options: users.map((u) => ({ label: `${u.name} (${u.email})`, value: u.id })),
  });
}
