"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { formatPhoneDisplay } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { OtpInput } from "@/components/ui/OtpInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthShell } from "@/components/auth/AuthShell";
import { FIREBASE_PHONE_AUTH_ENABLED } from "@/lib/firebaseConfig";
import { useFirebasePhoneOtp, FIREBASE_RECAPTCHA_CONTAINER_ID } from "@/lib/useFirebasePhoneOtp";
import { AnimatedLock } from "@/components/ui/icons/AnimatedLock";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedShield } from "@/components/ui/icons/AnimatedShield";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedRocket } from "@/components/ui/icons/AnimatedRocket";
import { AnimatedSuccess } from "@/components/ui/icons/AnimatedSuccess";

type Mode = "password" | "otp";
type Channel = "email" | "phone";
type OtpStep = "enter" | "verify";

const easeOut = [0.16, 1, 0.3, 1] as const;

const panelVariants = {
  enter: { opacity: 0, x: 24, filter: "blur(4px)" },
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -24, filter: "blur(4px)" },
};

const listVariants = {
  center: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemVariants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
  exit: { opacity: 0, y: -8 },
};

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

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [otpStep, setOtpStep] = useState<OtpStep>("enter");
  const [channel, setChannel] = useState<Channel>("phone");
  const [phone, setPhone] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  const firebasePhone = useFirebasePhoneOtp();
  const identifier = channel === "phone" ? phone : otpEmail.trim().toLowerCase();
  const usingFirebasePhone = channel === "phone" && FIREBASE_PHONE_AUTH_ENABLED;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function celebrateAndGo(role: string) {
    setSuccess(true);
    setTimeout(() => {
      router.push(role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    }, 1000);
  }

  async function onPasswordSubmit(data: LoginInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong");
        return;
      }
      celebrateAndGo(json.user.role);
    } finally {
      setSubmitting(false);
    }
  }

  async function requestLoginCode() {
    if (!identifier) {
      setOtpError(channel === "phone" ? "Enter your phone number" : "Enter your email address");
      return;
    }
    if (channel === "email" && !/^\S+@\S+\.\S+$/.test(identifier)) {
      setOtpError("Enter a valid email address");
      return;
    }
    setOtpError(null);
    setDevCode(null);
    setRequesting(true);
    try {
      if (usingFirebasePhone) {
        await firebasePhone.sendCode(identifier);
        setOtp("");
        setOtpStep("verify");
        setCooldown(30);
        return;
      }
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, purpose: "login", channel }),
      });
      const json = await res.json();
      if (!res.ok) {
        setOtpError(json.error ?? "Couldn't send code");
        setCooldown(json.retryAfterSeconds ?? 0);
        return;
      }
      setOtp("");
      setOtpStep("verify");
      setDevCode(json.devCode ?? null);
      setCooldown(30);
    } catch {
      setOtpError(usingFirebasePhone ? "Couldn't send verification SMS. Please try again." : "Something went wrong.");
    } finally {
      setRequesting(false);
    }
  }

  async function verifyLoginCode(code: string) {
    setOtpError(null);
    setVerifying(true);
    try {
      if (usingFirebasePhone) {
        const idToken = await firebasePhone.confirmCode(code);
        const res = await fetch("/api/auth/otp/phone-confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, purpose: "login" }),
        });
        const json = await res.json();
        if (!res.ok) {
          setOtpError(json.error ?? "Invalid code");
          return;
        }
        celebrateAndGo(json.user.role);
        return;
      }
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, purpose: "login", channel, code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setOtpError(json.error ?? "Invalid code");
        return;
      }
      celebrateAndGo(json.user.role);
    } catch {
      setOtpError("Incorrect or expired code. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setServerError(null);
    setOtpError(null);
    setOtpStep("enter");
    setOtp("");
  }

  return (
    <AuthShell
      badge="Secure sign in"
      heading={
        <>
          Welcome back to <span className="brand-gradient-text">MyLoginn</span>
        </>
      }
      subline="Pick up right where you left off — courses, live tutoring, internships and real projects, all in one place."
      features={[
        {
          icon: <AnimatedShield className="h-10 w-10" />,
          title: "OTP-protected sign in",
          desc: "One-time codes by email or SMS keep your account safe.",
        },
        {
          icon: <AnimatedGraduation className="h-10 w-10" />,
          title: "Continue learning",
          desc: "Your courses, streaks and progress are waiting for you.",
        },
        {
          icon: <AnimatedRocket className="h-10 w-10" />,
          title: "Grow your career",
          desc: "Apply to internships and showcase real project work.",
        },
      ]}
    >
      {FIREBASE_PHONE_AUTH_ENABLED && <div id={FIREBASE_RECAPTCHA_CONTAINER_ID} />}
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="flex flex-col items-center py-12 text-center"
          >
            <AnimatedSuccess once className="h-16 w-16" />
            <h1 className="mt-5 text-xl font-semibold">Welcome back!</h1>
            <p className="mt-2 text-sm text-muted">Taking you to your dashboard…</p>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            <div className="flex items-center gap-3">
              <AnimatedLock className="h-11 w-11 shrink-0" />
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Welcome back</h1>
                <p className="text-sm text-muted">Log in to continue your progress.</p>
              </div>
            </div>

            {/* Mode toggle */}
            <div className="mt-6 flex gap-1 rounded-full bg-surface-2 p-1">
              {(["password", "otp"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={cn(
                    "relative flex-1 cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200",
                    mode === m ? "text-white" : "text-muted hover:text-foreground"
                  )}
                >
                  {mode === m && (
                    <motion.span
                      layoutId="login-mode-pill"
                      className="brand-gradient-bg absolute inset-0 rounded-full shadow-[var(--shadow-lift)]"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{m === "password" ? "Password" : "OTP code"}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mode === "password" ? (
                <motion.form
                  key="password"
                  variants={{
                    ...panelVariants,
                    center: {
                      ...panelVariants.center,
                      transition: { duration: 0.3, ease: easeOut, ...listVariants.center.transition },
                    },
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onSubmit={handleSubmit(onPasswordSubmit)}
                  className="mt-6 flex flex-col gap-4"
                >
                  <motion.div variants={itemVariants}>
                    <Input
                      label="Email address"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <PasswordInput
                      label="Password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...register("password")}
                      error={errors.password?.message}
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
                      className="mt-1 w-full"
                      disabled={submitting}
                      icon={submitting ? <Spinner /> : <ArrowGlyph />}
                    >
                      {submitting ? "Logging in…" : "Log in"}
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex flex-col items-center gap-1.5 text-center text-xs text-muted">
                    <Link href="/forgot-password" className="font-medium text-brand-500 hover:underline">
                      Forgot your password?
                    </Link>
                    <p>
                      Or{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("otp")}
                        className="cursor-pointer font-medium text-brand-500 hover:underline"
                      >
                        log in with an OTP instead
                      </button>
                    </p>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.div
                  key="otp"
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="mt-6"
                >
                  <AnimatePresence mode="wait">
                    {otpStep === "enter" ? (
                      <motion.div
                        key="enter"
                        variants={panelVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-4"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {(["phone", "email"] as Channel[]).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setChannel(c);
                                setOtpError(null);
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
                        </div>

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
                                value={phone}
                                onChange={setPhone}
                                error={otpError && channel === "phone" ? otpError : undefined}
                              />
                            ) : (
                              <Input
                                label="Email address"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={otpEmail}
                                onChange={(e) => setOtpEmail(e.target.value)}
                                error={otpError && channel === "email" ? otpError : undefined}
                              />
                            )}
                          </motion.div>
                        </AnimatePresence>

                        <Button
                          size="lg"
                          className="w-full"
                          onClick={requestLoginCode}
                          disabled={requesting}
                          icon={requesting ? <Spinner /> : <ArrowGlyph />}
                        >
                          {requesting ? "Sending code…" : "Send code"}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="verify"
                        variants={panelVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-3">
                          {channel === "email" ? (
                            <AnimatedMail className="h-9 w-9 shrink-0" />
                          ) : (
                            <AnimatedPhone className="h-9 w-9 shrink-0" />
                          )}
                          <p className="text-sm text-muted">
                            Enter the 6-digit code we sent to{" "}
                            <strong className="text-foreground">
                              {channel === "phone" ? formatPhoneDisplay(phone) : otpEmail}
                            </strong>
                            .
                          </p>
                        </div>

                        {devCode && (
                          <motion.p
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning"
                          >
                            Dev mode — no {channel === "phone" ? "SMS" : "email"} provider configured yet, so nothing
                            was actually sent. Your code is <strong className="tracking-widest">{devCode}</strong>.
                          </motion.p>
                        )}

                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          onComplete={verifyLoginCode}
                          error={otpError ?? undefined}
                          disabled={verifying}
                        />
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={() => verifyLoginCode(otp)}
                          disabled={otp.length !== 6 || verifying}
                          icon={verifying ? <Spinner /> : undefined}
                        >
                          {verifying ? "Verifying…" : "Verify & log in"}
                        </Button>
                        <div className="flex items-center justify-between text-sm">
                          <button
                            type="button"
                            onClick={() => setOtpStep("enter")}
                            className="cursor-pointer font-medium text-brand-500 hover:underline"
                          >
                            Change contact
                          </button>
                          <button
                            type="button"
                            onClick={requestLoginCode}
                            disabled={cooldown > 0 || requesting}
                            className="cursor-pointer font-medium text-brand-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 border-t border-border-soft pt-5 text-center text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-brand-500 hover:underline">
                Create one
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
