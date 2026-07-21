import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { firebasePhoneConfirmSchema } from "@/lib/validation";
import { verifyFirebasePhoneToken } from "@/lib/firebaseAdmin";
import { setSessionCookie, signPasswordResetToken } from "@/lib/auth";
import { recordDailyActivity } from "@/lib/streak";

/** Counterpart to /api/auth/otp/verify for phone numbers verified client-side via Firebase Phone Auth (see useFirebasePhoneOtp) instead of a server-issued code. */
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = firebasePhoneConfirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { idToken, purpose } = parsed.data;
  const phone = await verifyFirebasePhoneToken(idToken);
  if (!phone) {
    return NextResponse.json({ error: "Couldn't verify that phone number. Please try again." }, { status: 400 });
  }

  if (purpose === "signup") {
    await prisma.user.updateMany({ where: { phone }, data: { phoneVerified: true } });
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.findFirst({ where: { phone } });
  if (!user) {
    return NextResponse.json({ error: "No account found for that phone number." }, { status: 404 });
  }

  if (purpose === "login") {
    await setSessionCookie({ userId: user.id, role: user.role });
    await recordDailyActivity(user.id);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  }

  return NextResponse.json({ ok: true, resetToken: signPasswordResetToken(user.id) });
}
