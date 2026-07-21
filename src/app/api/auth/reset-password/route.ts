import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie, verifyPasswordResetToken } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { resetToken, password } = parsed.data;
  const payload = verifyPasswordResetToken(resetToken);
  if (!payload) {
    return NextResponse.json(
      { error: "This reset session has expired. Please request a new code." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  await setSessionCookie({ userId: user.id, role: user.role });

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
