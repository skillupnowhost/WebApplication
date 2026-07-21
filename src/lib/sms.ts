import { createOtp, verifyOtp } from "./otp";
import type { RequestOtpResult } from "./verification";

// Real-time phone OTP delivery is free via Firebase Phone Auth, driven
// entirely client-side (see useFirebasePhoneOtp) once NEXT_PUBLIC_FIREBASE_*
// is configured — that path never touches these functions. Without it, this
// is the zero-setup fallback: a real code is generated and stored, "sent" via
// the server console, and handed back to the caller so the UI can show it
// directly instead of dead-ending the flow.
export async function sendOtpSms(phone: string, purpose: string): Promise<RequestOtpResult> {
  const result = await createOtp(phone, purpose);
  if (result.throttled) return result;
  console.log(`[dev-otp] ${purpose} SMS code for ${phone}: ${result.code}`);
  return { throttled: false, devCode: result.code };
}

export async function checkOtpSms(phone: string, purpose: string, code: string) {
  return verifyOtp(phone, purpose, code);
}
