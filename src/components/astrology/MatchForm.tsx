"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import type { PlacePick } from "./PlaceAutocomplete";
import { GlobalPlacePicker } from "./GlobalPlacePicker";
import { DateSelect, TimeSelect } from "./DateTimeFields";
import { LanguageChips } from "./LanguageChips";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { cn } from "@/lib/cn";

const personSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the full name"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid time"),
  birthPlace: z.string().trim().min(2, "Enter the place of birth"),
});

const matchFormSchema = z.object({
  partnerA: personSchema,
  partnerB: personSchema,
  language: z.enum(["en", "ta", "hi", "te", "ml", "kn", "bn", "mr", "gu", "pa", "ur"]),
});

type MatchFormInput = z.infer<typeof matchFormSchema>;
type Prefix = "partnerA" | "partnerB";

const PERSONS: { prefix: Prefix; titleKey: "bride" | "groom"; tone: "bride" | "groom" }[] = [
  { prefix: "partnerA", titleKey: "bride", tone: "bride" },
  { prefix: "partnerB", titleKey: "groom", tone: "groom" },
];

async function createProfile(person: z.infer<typeof personSchema>, pick: PlacePick | null) {
  const res = await fetch("/api/astrology/profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...person,
      birthTimeKnown: true,
      latitude: pick?.latitude,
      longitude: pick?.longitude,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Couldn't save birth details");
  return json.profile.id as string;
}

export function MatchForm({ language = "en" }: { language?: AstrologyLanguage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [picks, setPicks] = useState<Record<Prefix, PlacePick | null>>({ partnerA: null, partnerB: null });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MatchFormInput>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      language,
      partnerA: { fullName: "", birthDate: "", birthTime: "", birthPlace: "" },
      partnerB: { fullName: "", birthDate: "", birthTime: "", birthPlace: "" },
    },
  });

  const lang = (watch("language") ?? language) as AstrologyLanguage;

  async function onSubmit(data: MatchFormInput) {
    setLoading(true);
    setServerError(null);
    try {
      const [profileAId, profileBId] = await Promise.all([
        createProfile(data.partnerA, picks.partnerA),
        createProfile(data.partnerB, picks.partnerB),
      ]);

      const res = await fetch("/api/astrology/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileAId, profileBId, language: data.language }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Couldn't compute the match");
        return;
      }
      router.push(`/astrology/match/${json.matchId}`);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="celestial-card relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 opacity-20">
        <AnimatedUsers className="h-full w-full" />
      </div>

      <LanguageChips value={lang} onChange={(code) => setValue("language", code)} />

      <form onSubmit={handleSubmit(onSubmit)} className="astro-form relative flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PERSONS.map((p) => (
            <section
              key={p.prefix}
              className={cn(
                "rounded-2xl border p-5 sm:p-6",
                p.tone === "bride" ? "border-rose-200 bg-rose-50/50" : "border-brand-200 bg-brand-50/40"
              )}
            >
              <div className="mb-4 flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border bg-surface",
                    p.tone === "bride" ? "border-rose-300/60" : "border-brand-300/60"
                  )}
                >
                  <AnimatedUser className="h-5 w-5" />
                </span>
                <h3
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    p.tone === "bride" ? "text-rose-600" : "text-brand-600"
                  )}
                >
                  {t(lang, p.titleKey)}
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                <Input
                  label={t(lang, "fullName")}
                  placeholder={t(lang, "fullName")}
                  {...register(`${p.prefix}.fullName`)}
                  error={errors[p.prefix]?.fullName?.message}
                />
                <DateSelect
                  label={t(lang, "birthDate")}
                  lang={lang}
                  value={watch(`${p.prefix}.birthDate`) ?? ""}
                  error={errors[p.prefix]?.birthDate?.message}
                  onChange={(v) =>
                    setValue(`${p.prefix}.birthDate`, v, { shouldValidate: !!errors[p.prefix]?.birthDate })
                  }
                />
                <TimeSelect
                  label={t(lang, "birthTime")}
                  lang={lang}
                  value={watch(`${p.prefix}.birthTime`) ?? ""}
                  error={errors[p.prefix]?.birthTime?.message}
                  onChange={(v) =>
                    setValue(`${p.prefix}.birthTime`, v, { shouldValidate: !!errors[p.prefix]?.birthTime })
                  }
                />
                <div>
                  <p className="mb-1.5 text-sm font-medium text-foreground">{t(lang, "birthPlace")}</p>
                  <GlobalPlacePicker
                    lang={lang}
                    value={watch(`${p.prefix}.birthPlace`) ?? ""}
                    error={errors[p.prefix]?.birthPlace?.message}
                    onChange={(text) =>
                      setValue(`${p.prefix}.birthPlace`, text, { shouldValidate: !!errors[p.prefix]?.birthPlace })
                    }
                    onPick={(pick) => setPicks((prev) => ({ ...prev, [p.prefix]: pick }))}
                  />
                </div>
              </div>
            </section>
          ))}
        </div>

        {serverError && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{serverError}</p>}

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? t(lang, "calculating") : t(lang, "matchTitle")}
        </Button>
      </form>
    </GlassCard>
  );
}
