import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notificationBroadcastCreate } from "@/lib/adminEntities";

/**
 * Compose & broadcast a notification: creates one Notification row per targeted user.
 * Distinct from the generic /api/admin/[entity] CRUD routes because a broadcast fans
 * out to many rows at once, not a single record.
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const data = notificationBroadcastCreate.parse(await req.json());

    let recipientIds: string[];
    if (data.audience === "USER") {
      if (!data.userId) {
        return NextResponse.json({ error: "Pick a user to notify" }, { status: 400 });
      }
      recipientIds = [data.userId];
    } else {
      const where = data.audience === "ALL" ? {} : { role: data.audience as "STUDENT" | "MENTOR" };
      const users = await prisma.user.findMany({ where, select: { id: true } });
      recipientIds = users.map((u) => u.id);
    }

    if (recipientIds.length === 0) {
      return NextResponse.json({ error: "No matching recipients found" }, { status: 400 });
    }

    const { count } = await prisma.notification.createMany({
      data: recipientIds.map((userId) => ({ userId, title: data.title, body: data.body })),
    });

    return NextResponse.json({ sent: count }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      const issue = err.issues[0];
      return NextResponse.json({ error: issue?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("[notifications broadcast api]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
