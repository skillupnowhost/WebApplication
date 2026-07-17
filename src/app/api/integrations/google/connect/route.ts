import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { buildOAuthClient, GOOGLE_SCOPES, isGoogleConfigured } from "@/lib/google";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "MENTOR" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  if (!isGoogleConfigured()) {
    return NextResponse.json({ error: "Google integration isn't configured yet." }, { status: 503 });
  }

  const returnTo = new URL(req.url).searchParams.get("returnTo") ?? "/dashboard";
  const oauth2Client = buildOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GOOGLE_SCOPES,
    state: JSON.stringify({ userId: user.id, returnTo }),
  });

  return NextResponse.redirect(url);
}
