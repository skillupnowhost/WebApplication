import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Options for the "Specific user" picker in the notification compose form — mirrors the
 *  /api/admin/mentors/linkable-users pattern (a small optionsEndpoint lookup route). */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({
    options: users.map((u) => ({ label: `${u.name} (${u.email}) — ${u.role}`, value: u.id })),
  });
}
