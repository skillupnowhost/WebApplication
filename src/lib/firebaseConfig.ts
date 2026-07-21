// Kept separate from firebaseClient.ts (which pulls in the full Firebase SDK)
// so pages can check whether real-time phone OTP is available without paying
// for that bundle weight when it isn't configured.
export const FIREBASE_PHONE_AUTH_ENABLED = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

export const FIREBASE_RECAPTCHA_CONTAINER_ID = "firebase-phone-recaptcha";
