"use client";

import { useCallback, useRef, useState } from "react";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { FIREBASE_RECAPTCHA_CONTAINER_ID } from "./firebaseConfig";

export { FIREBASE_RECAPTCHA_CONTAINER_ID };

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
      confirmationRef.current = await signInWithPhoneNumber(auth, phoneE164, verifierRef.current);
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
