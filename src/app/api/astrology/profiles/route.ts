import { NextResponse } from "next/server";
import tzLookup from "tz-lookup";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { astrologyProfileSchema } from "@/lib/validation";
import { geocodePlace } from "@/lib/astrology/geocode";
import { localBirthInstant } from "@/lib/astrology/chart";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = astrologyProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const user = await getCurrentUser();

  let latitude = data.latitude;
  let longitude = data.longitude;
  let timezone: string | undefined;

  if (latitude === undefined || longitude === undefined) {
    const geocoded = await geocodePlace(data.birthPlace);
    if (!geocoded) {
      return NextResponse.json(
        { error: "We couldn't find that place. Try a nearby major city, or enter latitude/longitude manually." },
        { status: 422 }
      );
    }
    latitude = geocoded.latitude;
    longitude = geocoded.longitude;
    timezone = geocoded.timezone;
  } else {
    timezone = tzLookup(latitude, longitude);
  }

  const birthDate = localBirthInstant(data.birthDate, data.birthTimeKnown ? data.birthTime : "12:00", timezone);

  const profile = await prisma.astrologyProfile.create({
    data: {
      userId: user?.id,
      fullName: data.fullName,
      gender: data.gender || undefined,
      birthDate,
      birthTimeKnown: data.birthTimeKnown,
      birthPlace: data.birthPlace,
      latitude,
      longitude,
      timezone,
      system: data.system,
      fatherName: data.fatherName || undefined,
      motherName: data.motherName || undefined,
      maritalStatus: data.maritalStatus || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      parentsNames: data.parentsNames || undefined,
      occupation: data.occupation || undefined,
      businessType: data.businessType || undefined,
      salary: data.salary || undefined,
      community: data.community || undefined,
      caste: data.caste || undefined,
      gothram: data.gothram || undefined,
      customNotes: data.customNotes || undefined,
    },
  });

  return NextResponse.json({ profile });
}
