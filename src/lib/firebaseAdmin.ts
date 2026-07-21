import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
  );
}

function getFirebaseAdminApp() {
  if (getApps().length) return getApp();
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // .env files can't hold real newlines in a single-line value, so the
      // private key is stored with literal "\n" escapes and unescaped here.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

/** Verifies a Firebase Phone Auth ID token server-side and returns the verified E.164 phone number, or null if it's invalid or Firebase isn't configured. */
export async function verifyFirebasePhoneToken(idToken: string): Promise<string | null> {
  if (!isFirebaseAdminConfigured()) return null;
  try {
    const decoded = await getAuth(getFirebaseAdminApp()).verifyIdToken(idToken);
    return decoded.phone_number ?? null;
  } catch {
    return null;
  }
}
