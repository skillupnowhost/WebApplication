"use client";

import { useCallback, useRef, useState } from "react";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { FIREBASE_RECAPTCHA_CONTAINER_ID } from "./firebaseConfig";

export { FIREBASE_RECAPTCHA_CONTAINER_ID };

const FIREBASE_PHONE_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-phone-number": "That phone number doesn't look valid. Check the country code and digits.",
  "auth/missing-phone-number": "Enter your phone number first.",
  "auth/too-many-requests": "Too many attempts from this device. Please wait a while and try again.",
  "auth/quota-exceeded": "SMS quota reached for now. Please try again later or verify by email instead.",
  "auth/captcha-check-failed": "Verification challenge failed. Please try again.",
  "auth/invalid-app-credential": "Phone verification isn't configured correctly for this site yet.",
  "auth/argument-error": "Verification challenge failed. Please refresh the page and try again.",
  "auth/network-request-failed": "Network error while sending the code. Check your connection and try again.",
  "auth/billing-not-enabled": "Phone verification isn't set up yet. Please verify by email instead.",
  "auth/operation-not-allowed": "Phone verification isn't enabled yet. Please verify by email instead.",
  "auth/configuration-not-found": "Phone verification isn't enabled for this project yet. Please verify by email instead.",
  "auth/unauthorized-domain": "This site isn't authorized for phone verification yet. Please verify by email instead.",
};

/** Turns a raw Firebase Auth error into a message worth showing a user, falling back to the SDK's own text. */
export function firebasePhoneErrorMessage(err: unknown): string {
  const code = (err as { code?: string } | null)?.code;
  if (code && FIREBASE_PHONE_ERROR_MESSAGES[code]) return FIREBASE_PHONE_ERROR_MESSAGES[code];
  return "Couldn't send verification SMS. Please try again.";
}

/**
 * Drives Firebase Phone Auth entirely in the browser: the real SMS is sent
 * and the code is confirmed by Firebase directly (free, no server-side SMS
 * cost). The caller only ever sees a Firebase ID token, which the server
 * verifies via firebase-admin to prove the phone number was actually owned
 * by whoever completed the flow.
 */
export function useFirebasePhoneOtp() {
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const sendCode = useCallback(async (phoneE164: string) => {
    setSending(true);
    try {
      const [{ getFirebaseAuth }, { RecaptchaVerifier: RecaptchaVerifierCtor, signInWithPhoneNumber }] =
        await Promise.all([import("./firebaseClient"), import("firebase/auth")]);
      const auth = getFirebaseAuth();
      if (!verifierRef.current) {
        verifierRef.current = new RecaptchaVerifierCtor(auth, FIREBASE_RECAPTCHA_CONTAINER_ID, {
          size: "invisible",
        });
      }
      try {
        confirmationRef.current = await signInWithPhoneNumber(auth, phoneE164, verifierRef.current);
      } catch (err) {
        // A used/expired reCAPTCHA widget stays broken forever if we keep
        // reusing it — clear it so the next attempt (e.g. after "Resend")
        // gets a fresh challenge instead of failing silently every time.
        verifierRef.current?.clear();
        verifierRef.current = null;
        console.error("Firebase phone OTP send failed:", err);
        throw err;
      }
    } finally {
      setSending(false);
    }
  }, []);

  const confirmCode = useCallback(async (code: string) => {
    if (!confirmationRef.current) throw new Error("Request a code first.");
    setConfirming(true);
    try {
      const credential = await confirmationRef.current.confirm(code);
      return await credential.user.getIdToken();
    } finally {
      setConfirming(false);
    }
  }, []);

  return { sendCode, confirmCode, sending, confirming };
}
