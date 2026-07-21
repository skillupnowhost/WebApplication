"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation";
import { formatPhoneDisplay } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { OtpInput } from "@/components/ui/OtpInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { FIREBASE_PHONE_AUTH_ENABLED } from "@/lib/firebaseConfig";
import { useFirebasePhoneOtp, FIREBASE_RECAPTCHA_CONTAINER_ID } from "@/lib/useFirebasePhoneOtp";
import { AnimatedShield } from "@/components/ui/icons/AnimatedShield";
import { AnimatedLock } from "@/components/ui/icons/AnimatedLock";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedSuccess } from "@/components/ui/icons/AnimatedSuccess";

type Step = "identify" | "verify" | "newPassword" | "success";
type Channel = "email" | "phone";

const easeOut = [0.16, 1, 0.3, 1] as const;

const stepVariants = {
  enter: { opacity: 0, x: 24, filter: "blur(4px)" },
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -24, filter: "blur(4px)" },
};

const itemVariants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
  exit: { opacity: 0, y: -8 },
};

const steps: { key: Step; label: string }[] = [
  { key: "identify", label: "Your account" },
  { key: "verify", label: "Verify" },
  { key: "newPassword", label: "New password" },
];

function Spinner() {
  return (
    <motion.span
      className="inline-block h-4.5 w-4.5 rounded-full border-2 border-white/40 border-t-white"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path d="M4.5 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identify");
  const [channel, setChannel] = useState<Channel>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identifyError, setIdentifyError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const firebasePhone = useFirebasePhoneOtp();
  const identifier = channel === "phone" ? phone : email;
  const stepIndex = steps.findIndex((s) => s.key === step);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema), mode: "onTouched" });
  const passwordValue = watch("password") ?? "";

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const usingFirebasePhone = channel === "phone" && FIREBASE_PHONE_AUTH_ENABLED;

  async function requestCode() {
    if (!identifier) {
      setIdentifyError(channel === "phone" ? "Enter your phone number" : "Enter your email address");
      return;
    }
    if (channel === "email" && !/^\S+@\S+\.\S+$/.test(identifier)) {
      setIdentifyError("Enter a valid email address");
      return;
    }
    setIdentifyError(null);
    setOtpError(null);
    setDevCode(null);
    setRequesting(true);
    try {
      if (usingFirebasePhone) {
        await firebasePhone.sendCode(identifier);
        setOtp("");
        setStep("verify");
        setCooldown(30);
        return;
      }
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, purpose: "reset", channel }),
      });
      const json = await res.json();
      if (!res.ok) {
        setIdentifyError(json.error ?? "Couldn't send code");
        setCooldown(json.retryAfterSeconds ?? 0);
        return;
      }
      setOtp("");
      setStep("verify");
      setDevCode(json.devCode ?? null);
      setCooldown(30);
    } catch {
      setIdentifyError(
        usingFirebasePhone ? "Couldn't send verification SMS. Please try again." : "Something went wrong."
      );
    } finally {
      setRequesting(false);
    }
  }

  async function verifyCode(code: string) {
    setOtpError(null);
    setVerifying(true);
    try {
      let token: string | undefined;
      if (usingFirebasePhone) {
        const idToken = await firebasePhone.confirmCode(code);
        const res = await fetch("/api/auth/otp/phone-confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, purpose: "reset" }),
        });
        const json = await res.json();
        if (!res.ok) {
          setOtpError(json.error ?? "Invalid code");
          return;
        }
        token = json.resetToken;
      } else {
        const res = await fetch("/api/auth/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, purpose: "reset", channel, code }),
        });
        const json = await res.json();
        if (!res.ok) {
          setOtpError(json.error ?? "Invalid code");
          return;
        }
        token = json.resetToken;
      }

      if (!token) {
        setOtpError("Couldn't start a reset session. Please try again.");
        return;
      }
      setResetToken(token);
      setStep("newPassword");
    } catch {
      setOtpError("Incorrect or expired code. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  async function onNewPasswordSubmit(data: ResetPasswordInput) {
    if (!resetToken) return;
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password: data.password, confirmPassword: data.confirmPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong");
        return;
      }
      setStep("success");
      setTimeout(() => {
        router.push(json.user.role === "ADMIN" ? "/admin" : "/dashboard");
        router.refresh();
      }, 1300);
    } finally {
      setSubmitting(false);
    }
  }

  function switchChannel() {
    setChannel((c) => (c === "phone" ? "email" : "phone"));
    setIdentifyError(null);
    setOtpError(null);
    setOtp("");
    setDevCode(null);
    setStep("identify");
  }

  return (
    <AuthShell
      badge="Account recovery"
      heading={
        <>
          Reset your <span className="brand-gradient-text">MyLoginn</span> password
        </>
      }
      subline="Verify it's really you with a one-time code, then set a fresh password — no support tickets needed."
      features={[
        {
          icon: <AnimatedShield className="h-10 w-10" />,
          title: "OTP-verified reset",
          desc: "A one-time code by email or SMS confirms it's you before anything changes.",
        },
        {
          icon: <AnimatedLock className="h-10 w-10" />,
          title: "Your account, protected",
          desc: "The reset link expires in 10 minutes and can't be reused.",
        },
      ]}
    >
      {FIREBASE_PHONE_AUTH_ENABLED && <div id={FIREBASE_RECAPTCHA_CONTAINER_ID} />}

      {step !== "success" && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <span
                key={s.key}
                className={cn(
                  "text-xs font-semibold tracking-wide uppercase transition-colors duration-300",
                  i <= stepIndex ? "text-brand-500 dark:text-brand-300" : "text-muted"
                )}
              >
                {s.label}
              </span>
            ))}
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="brand-gradient-bg h-full rounded-full"
              initial={false}
              animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: easeOut }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "identify" && (
          <motion.div
            key="identify"
            variants={{
              ...stepVariants,
              center: {
                ...stepVariants.center,
                transition: { duration: 0.3, ease: easeOut, staggerChildren: 0.06, delayChildren: 0.05 },
              },
            }}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="flex items-center gap-3">
              <AnimatedShield className="h-11 w-11 shrink-0" />
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Forgot your password?</h1>
                <p className="text-sm text-muted">Tell us where to send your verification code.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
                {(["email", "phone"] as Channel[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setChannel(c);
                      setIdentifyError(null);
                    }}
                    className={cn(
                      "relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      channel === c
                        ? "border-brand-400 bg-brand-50 text-brand-600 shadow-[var(--shadow-soft)] dark:bg-brand-900/20 dark:text-brand-300"
                        : "border-border-soft text-muted hover:border-brand-300"
                    )}
                  >
                    {c === "email" ? (
                      <AnimatedMail className="h-5.5 w-5.5" />
                    ) : (
                      <AnimatedPhone className="h-5.5 w-5.5" />
                    )}
                    {c === "email" ? "Email" : "Phone"}
                  </button>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={channel}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {channel === "phone" ? (
                    <PhoneInput
                      label="Phone number"
                      hint={
                        FIREBASE_PHONE_AUTH_ENABLED
                          ? "We'll text a real verification code to this number."
                          : undefined
                      }
                      value={phone}
                      onChange={setPhone}
                      error={identifyError ?? undefined}
                    />
                  ) : (
                    <Input
                      label="Email address"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={identifyError ?? undefined}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <motion.div variants={itemVariants}>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={requestCode}
                  disabled={requesting}
                  icon={requesting ? <Spinner /> : <ArrowGlyph />}
                >
                  {requesting ? "Sending code…" : "Send code"}
                </Button>
              </motion.div>
            </div>

            <div className="mt-6 border-t border-border-soft pt-5 text-center text-sm text-muted">
              Remembered it after all?{" "}
              <Link href="/login" className="font-medium text-brand-500 hover:underline">
                Back to log in
              </Link>
            </div>
          </motion.div>
        )}

        {step === "verify" && (
          <motion.div key="verify" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: easeOut }}>
            <div className="flex items-center gap-3">
              {channel === "email" ? (
                <AnimatedMail className="h-11 w-11 shrink-0" />
              ) : (
                <AnimatedPhone className="h-11 w-11 shrink-0" />
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Enter your code</h1>
                <p className="text-sm text-muted">
                  Sent to{" "}
                  <strong className="text-foreground">
                    {channel === "phone" ? formatPhoneDisplay(phone) : email}
                  </strong>
                </p>
              </div>
            </div>

            {devCode && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning"
              >
                Dev mode — no {channel === "phone" ? "SMS" : "email"} provider configured yet, so nothing was
                actually sent. Your code is <strong className="tracking-widest">{devCode}</strong>.
              </motion.p>
            )}

            <div className="mt-6 flex flex-col gap-4">
              <OtpInput
                value={otp}
                onChange={setOtp}
                onComplete={verifyCode}
                error={otpError ?? undefined}
                disabled={verifying}
              />
              <Button
                size="lg"
                className="w-full"
                onClick={() => verifyCode(otp)}
                disabled={otp.length !== 6 || verifying}
                icon={verifying ? <Spinner /> : undefined}
              >
                {verifying ? "Verifying…" : "Verify code"}
              </Button>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setStep("identify")}
                  className="cursor-pointer font-medium text-brand-500 hover:underline"
                >
                  Change contact
                </button>
                <button
                  type="button"
                  onClick={requestCode}
                  disabled={cooldown > 0 || requesting}
                  className="cursor-pointer font-medium text-brand-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
              <button
                type="button"
                onClick={switchChannel}
                className="cursor-pointer text-center text-xs font-medium text-brand-500 hover:underline"
              >
                Verify by {channel === "phone" ? "email" : "phone"} instead
              </button>
            </div>
          </motion.div>
        )}

        {step === "newPassword" && (
          <motion.form
            key="newPassword"
            variants={{
              ...stepVariants,
              center: {
                ...stepVariants.center,
                transition: { duration: 0.3, ease: easeOut, staggerChildren: 0.06, delayChildren: 0.05 },
              },
            }}
            initial="enter"
            animate="center"
            exit="exit"
            onSubmit={handleSubmit(onNewPasswordSubmit)}
          >
            <div className="flex items-center gap-3">
              <AnimatedLock className="h-11 w-11 shrink-0" />
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Set a new password</h1>
                <p className="text-sm text-muted">Verified — now choose a fresh password.</p>
              </div>
            </div>

            <input type="hidden" value={resetToken ?? ""} {...register("resetToken")} />

            <div className="mt-6 flex flex-col gap-4">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <PasswordInput
                  label="New password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password?.message}
                />
                <PasswordStrength value={passwordValue} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PasswordInput
                  label="Confirm new password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
              </motion.div>

              <AnimatePresence>
                {serverError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto", x: [0, -8, 8, -5, 5, 0] }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger"
                  >
                    {serverError}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                  icon={submitting ? <Spinner /> : <ArrowGlyph />}
                >
                  {submitting ? "Saving…" : "Reset password"}
                </Button>
              </motion.div>
            </div>
          </motion.form>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="flex flex-col items-center py-12 text-center"
          >
            <AnimatedSuccess once className="h-16 w-16" />
            <h1 className="mt-5 text-xl font-semibold">Password reset!</h1>
            <p className="mt-2 text-sm text-muted">Taking you to your dashboard…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
