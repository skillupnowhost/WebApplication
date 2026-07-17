import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildOAuthClient } from "@/lib/google";
import { encryptToken } from "@/lib/crypto";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateRaw = url.searchParams.get("state");

  let userId: string | null = null;
  let returnTo = "/dashboard";
  try {
    const state = stateRaw ? JSON.parse(stateRaw) : null;
    userId = state?.userId ?? null;
    returnTo = state?.returnTo ?? returnTo;
  } catch {
    // malformed state — fall through to the error redirect below
  }

  if (!code || !userId) {
    return NextResponse.redirect(new URL(`${returnTo}?google=error`, req.url));
  }

  try {
    const oauth2Client = buildOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token || !tokens.access_token) {
      return NextResponse.redirect(new URL(`${returnTo}?google=no_refresh_token`, req.url));
    }

    await prisma.googleAccount.upsert({
      where: { userId },
      create: {
        userId,
        accessToken: encryptToken(tokens.access_token),
        refreshToken: encryptToken(tokens.refresh_token),
        scope: tokens.scope ?? "",
        expiryDate: new Date(tokens.expiry_date ?? Date.now()),
      },
      update: {
        accessToken: encryptToken(tokens.access_token),
        refreshToken: encryptToken(tokens.refresh_token),
        scope: tokens.scope ?? "",
        expiryDate: new Date(tokens.expiry_date ?? Date.now()),
      },
    });

    return NextResponse.redirect(new URL(`${returnTo}?google=connected`, req.url));
  } catch (err) {
    console.error("Google OAuth callback failed", err);
    return NextResponse.redirect(new URL(`${returnTo}?google=error`, req.url));
  }
}
