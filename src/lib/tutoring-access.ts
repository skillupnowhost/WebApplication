import type { FeeTier } from "@prisma/client";

const TIER_ORDER: FeeTier[] = ["FREE", "STANDARD", "PREMIUM"];

export function canAccessRecording(
  user: { id: string; role: string; tutoringTier: FeeTier },
  tutorClass: { mentorUserId?: string | null; recordingAccessTier: FeeTier }
): boolean {
  if (user.role === "ADMIN") return true;
  if (tutorClass.mentorUserId && user.id === tutorClass.mentorUserId) return true;
  return TIER_ORDER.indexOf(user.tutoringTier) >= TIER_ORDER.indexOf(tutorClass.recordingAccessTier);
}
