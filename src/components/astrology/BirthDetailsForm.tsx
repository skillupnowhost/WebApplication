"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { birthDetailsSchema, type BirthDetailsInput } from "@/lib/validation";
import { cn } from "@/lib/cn";

function ChoiceCards({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; desc: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "cursor-pointer rounded-xl border p-3 text-left transition-all duration-200",
              active
                ? "border-brand-400 bg-brand-50 shadow-[0_2px_8px_rgba(108,77,255,0.2)] dark:bg-brand-900/20"
                : "border-border-soft bg-surface hover:border-brand-300"
            )}
          >
            <p className={cn("text-sm font-semibold", active && "text-brand-500")}>{opt.label}</p>
            <p className="mt-0.5 text-xs text-muted">{opt.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

const STEPS = ["Birth details", "Optional details", "Style & language"] as const;

const VOICE_CHOICES = [
  { value: "STORYTELLING", label: "Storytelling", desc: "Warm, human-narrative voice" },
  { value: "PROFESSIONAL", label: "Professional print", desc: "Structured, report-style" },
  { value: "ANIMATED", label: "Dynamic animated", desc: "On-screen reveal experience" },
];

const DEPTH_CHOICES = [
  { value: "SUMMARY", label: "Single-page summary", desc: "A concise, at-a-glance reading" },
  { value: "FULL", label: "Full horoscope", desc: "Every placement, age-band predictions, numerology" },
];

export function BirthDetailsForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BirthDetailsInput>({
    resolver: zodResolver(birthDetailsSchema),
    defaultValues: {
      birthTimeKnown: true,
      depth: "SUMMARY",
      voice: "PROFESSIONAL",
      language: "en",
    },
  });

  const values = watch();

  const stepFields: (keyof BirthDetailsInput)[][] = [
    ["fullName", "birthDate", "birthTime", "birthPlace"],
    [],
    ["depth", "voice", "language"],
  ];

  async function goNext() {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data: BirthDetailsInput) {
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/astrology/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push(`/astrology/${json.reportId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="relative mx-auto max-w-xl overflow-hidden p-7 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,var(--brand-300),transparent_70%)] opacity-25 blur-2xl" />

      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300",
                i <= step ? "brand-gradient-bg text-white" : "bg-surface-2 text-muted"
              )}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-0.5 flex-1 rounded-full transition-colors duration-300", i < step ? "brand-gradient-bg" : "bg-surface-2")} />
            )}
          </div>
        ))}
      </div>
      <p className="mb-5 text-sm font-medium text-muted">{STEPS[step]}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex flex-col gap-4">
              <Input label="Full name" placeholder="Your name" {...register("fullName")} error={errors.fullName?.message} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Date of birth" type="date" {...register("birthDate")} error={errors.birthDate?.message} />
                <Input
                  label="Time of birth"
                  type="time"
                  disabled={values.birthTimeKnown === false}
                  {...register("birthTime")}
                  error={errors.birthTime?.message}
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border-soft accent-[var(--brand-500)]"
                  checked={values.birthTimeKnown === false}
                  onChange={(e) => setValue("birthTimeKnown", !e.target.checked)}
                />
                I don&apos;t know my exact birth time (we&apos;ll use noon and flag time-sensitive predictions as approximate)
              </label>
              <Input
                label="Place of birth"
                placeholder="City, State, Country — e.g. Madurai, Tamil Nadu, India"
                {...register("birthPlace")}
                error={errors.birthPlace?.message}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex flex-col gap-4">
              <p className="text-xs text-muted">
                Everything below is optional — leave it blank and we&apos;ll skip it entirely in your report.
              </p>
              <Input label="Gender (optional)" placeholder="e.g. Female" {...register("gender")} />
              <Input label="Parents' names (optional)" placeholder="e.g. Ramesh & Lakshmi" {...register("parentsNames")} />
              <Input label="Occupation (optional)" placeholder="e.g. Software engineer" {...register("occupation")} />
              <Textarea label="Anything else you'd like reflected (optional)" rows={3} {...register("customNotes")} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex flex-col gap-5">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Report depth</p>
                <ChoiceCards
                  options={DEPTH_CHOICES}
                  value={values.depth}
                  onChange={(v) => setValue("depth", v as BirthDetailsInput["depth"])}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Voice / style</p>
                <ChoiceCards
                  options={VOICE_CHOICES}
                  value={values.voice}
                  onChange={(v) => setValue("voice", v as BirthDetailsInput["voice"])}
                />
              </div>
              <Select
                label="Language"
                value={values.language}
                onChange={(e) => setValue("language", e.target.value as BirthDetailsInput["language"])}
                options={[
                  { label: "English", value: "en" },
                  { label: "Tamil", value: "ta" },
                ]}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {serverError && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{serverError}</p>}

        <div className="mt-2 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={goBack} disabled={loading}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? "Reading the stars…" : "Reveal my horoscope"}
            </Button>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
