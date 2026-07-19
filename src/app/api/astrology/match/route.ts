import { NextResponse } from "next/server";
import { astrologyMatchRequestSchema } from "@/lib/validation";
import { getOrCreateMatch } from "@/lib/astrology/match";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = astrologyMatchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  if (parsed.data.profileAId === parsed.data.profileBId) {
    return NextResponse.json({ error: "Choose two different birth profiles to compare" }, { status: 400 });
  }

  try {
    const { match } = await getOrCreateMatch(parsed.data);
    return NextResponse.json({ matchId: match.id });
  } catch (error) {
    console.error("Failed to compute astrology match:", error);
    return NextResponse.json({ error: "Couldn't compute the match. Please check both birth profiles and try again." }, { status: 500 });
  }
}
