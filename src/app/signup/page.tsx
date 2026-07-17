"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signupSchema, type SignupInput } from "@/lib/validation";
import { formatPhoneDisplay } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { OtpInput } from "@/components/ui/OtpInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { AnimatedBriefcase } from "@/components/ui/icons/AnimatedBriefcase";
import { AnimatedSuccess } from "@/components/ui/icons/AnimatedSuccess";

type Step = "details" | "verifyPrimary" | "verifySecondary" | "success";
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
  { key: "details", label: "Your details" },
  { key: "verifyPrimary", label: "Verify" },
  { key: "success", label: "Done" },
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

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { role: "STUDENT", phone: "" },
  });

  const passwordValue = watch("password") ?? "";
  const identifier = channel === "phone" ? phone : email;
  // Progress bar only ever shows "Your details" / "Verify" / "Done" — both the
  // required primary channel and the optional secondary one count as "Verify".
  const displayStep: Step = step === "details" || step === "success" ? step : "verifyPrimary";
  const stepIndex = steps.findIndex((s) => s.key === displayStep);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function requestCode(nextChannel: Channel, ident: string) {
    setOtpError(null);
    setDevCode(null);
    setRequesting(true);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: ident, purpose: "signup", channel: nextChannel }),
      });
      const json = await res.json();
      if (!res.ok) {
        setOtpError(json.error ?? "Couldn't send code");
        setCooldown(json.retryAfterSeconds ?? 0);
        return;
      }
      setDevCode(json.devCode ?? null);
      setCooldown(30);
    } finally {
      setRequesting(false);
    }
  }

  async function onDetailsSubmit(data: SignupInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong");
        return;
      }
      setEmail(data.email);
      setPhone(data.phone);
      // Phone is the default, required verification step — email is verified
      // afterward as an optional, skippable step.
      setChannel("phone");
      setOtp("");
      setStep("verifyPrimary");
      await requestCode("phone", data.phone);
    } finally {
      setSubmitting(false);
    }
  }

  function goToDashboard() {
    setStep("success");
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1300);
  }

  async function verifyCode(code: string) {
    setOtpError(null);
    setVerifying(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, purpose: "signup", channel, code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setOtpError(json.error ?? "Invalid code");
        return;
      }
      if (step === "verifyPrimary") {
        // Primary (required) channel is verified — move on to the optional
        // secondary channel instead of finishing signup immediately.
        const secondary: Channel = channel === "phone" ? "email" : "phone";
        setChannel(secondary);
        setOtp("");
        setStep("verifySecondary");
        await requestCode(secondary, secondary === "phone" ? phone : email);
        return;
      }
      goToDashboard();
    } finally {
      setVerifying(false);
    }
  }

  function skipSecondary() {
    setOtpError(null);
    goToDashboard();
  }

  function switchChannel() {
    const next: Channel = channel === "phone" ? "email" : "phone";
    setChannel(next);
    setOtp("");
    setOtpError(null);
    requestCode(next, next === "phone" ? phone : email);
  }

  return (
    <AuthShell
      badge="Join for free"
      heading={
        <>
          Start your journey with <span className="brand-gradient-text">MyLoginn</span>
        </>
      }
      subline="One account for AI-powered courses, live tutoring, internships and real project experience."
      features={[
        {
          icon: <AnimatedSparkle className="h-10 w-10" />,
          title: "AI-powered learning",
          desc: "Courses and an AI mentor that adapt to how you learn.",
        },
        {
          icon: <AnimatedUsers className="h-10 w-10" />,
          title: "Learn with mentors",
          desc: "Live tutoring for CBSE, State Board and beyond.",
        },
        {
          icon: <AnimatedBriefcase className="h-10 w-10" />,
          title: "Real-world experience",
          desc: "Internships and projects that build your portfolio.",
        },
      ]}
    >
      {/* Step progress */}
      {step !== "success" && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {steps.slice(0, 2).map((s, i) => (
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
              animate={{ width: displayStep === "details" ? "50%" : "100%" }}
              transition={{ duration: 0.5, ease: easeOut }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "details" && (
          <motion.div
            key="details"
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
              <AnimatedUser className="h-11 w-11 shrink-0" />
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Create your account</h1>
                <p className="text-sm text-muted">Learn, get mentored, land internships.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onDetailsSubmit)} className="mt-6 flex flex-col gap-4">
              <motion.div variants={itemVariants}>
                <Input
                  label="Full name"
                  autoComplete="name"
                  placeholder="Full name"
                  {...register("name")}
                  error={errors.name?.message}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  hint="Verified after your phone — optional, but unlocks certificates."
                  {...register("email")}
                  error={errors.email?.message}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <PhoneInput
                      label="Phone number"
                      hint="We'll text a verification code here first — it's required to finish signing up."
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      onCountryChange={(iso2) => setValue("country", iso2)}
                      error={errors.phone?.message}
                    />
                  )}
                />
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <PasswordInput
                  label="Password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password?.message}
                />
                <PasswordStrength value={passwordValue} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PasswordInput
                  label="Confirm password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Select
                  label="I am joining as"
                  options={[
                    { label: "Student / Learner", value: "STUDENT" },
                    { label: "Mentor", value: "MENTOR" },
                  ]}
                  {...register("role")}
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
                  {submitting ? "Creating account…" : "Create account"}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 border-t border-border-soft pt-5 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-500 hover:underline">
                Log in
              </Link>
            </div>
          </motion.div>
        )}

        {(step === "verifyPrimary" || step === "verifySecondary") && (
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <div className="flex items-center gap-3">
              {channel === "email" ? (
                <AnimatedMail className="h-11 w-11 shrink-0" />
              ) : (
                <AnimatedPhone className="h-11 w-11 shrink-0" />
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {channel === "email" ? "Verify your email" : "Verify your phone"}
                  {step === "verifySecondary" && <span className="text-muted"> (optional)</span>}
                </h1>
                <p className="text-sm text-muted">
                  Code sent to{" "}
                  <strong className="text-foreground">
                    {channel === "phone" ? formatPhoneDisplay(phone) : email}
                  </strong>
                </p>
              </div>
            </div>

            {step === "verifySecondary" && (
              <p className="mt-3 text-xs text-muted">
                Your account is already active. Verifying your {channel} unlocks certificates and account
                recovery — you can also do this later from your dashboard.
              </p>
            )}

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
                {verifying ? "Verifying…" : "Verify & continue"}
              </Button>

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                {step === "verifyPrimary" ? (
                  <button
                    type="button"
                    onClick={switchChannel}
                    disabled={requesting}
                    className="cursor-pointer font-medium text-brand-500 hover:underline disabled:opacity-50"
                  >
                    Verify by {channel === "phone" ? "email" : "phone"} instead
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={skipSecondary}
                    className="cursor-pointer font-medium text-muted hover:text-foreground hover:underline"
                  >
                    Skip for now
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => requestCode(channel, identifier)}
                  disabled={cooldown > 0 || requesting}
                  className="cursor-pointer font-medium text-brand-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </div>
          </motion.div>
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
            <h1 className="mt-5 text-xl font-semibold">You&apos;re all set!</h1>
            <p className="mt-2 text-sm text-muted">Taking you to your dashboard…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
