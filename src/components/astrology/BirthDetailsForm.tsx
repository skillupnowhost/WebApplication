"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { astrologyProfileSchema } from "@/lib/validation";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { AnimatedCelestialWheel } from "@/components/ui/icons/AnimatedCelestialWheel";
import { AnimatedChevron } from "@/components/ui/icons/AnimatedChevron";
import { PlaceAutocomplete, type PlacePick } from "./PlaceAutocomplete";
import { DateSelect, TimeSelect } from "./DateTimeFields";
import { LanguageChips } from "./LanguageChips";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";
import { cn } from "@/lib/cn";

const formSchema = astrologyProfileSchema
  .omit({ birthTimeKnown: true, latitude: true, longitude: true })
  .extend({
    birthTimeUnknown: z.boolean().default(false),
    depth: z.enum(["SUMMARY", "FULL"]),
    chartStyle: z.enum(["NORTH_INDIAN", "SOUTH_INDIAN", "EAST_INDIAN"]),
    language: z.enum(["en", "ta", "hi", "te", "ml"]),
    reportStyle: z.enum(["PROFESSIONAL", "TRADITIONAL", "MODERN"]),
  });

type FormInput = z.input<typeof formSchema>;

function SectionCard({
  title,
  badge,
  badgeTone = "gold",
  children,
}: {
  title: string;
  badge?: string;
  badgeTone?: "gold" | "muted";
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border-soft bg-surface/40 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {badge && (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              badgeTone === "gold" ? "celestial-glow-text ring-1 ring-amber-400/40" : "bg-surface-2 text-muted"
            )}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

export function BirthDetailsForm({
  language = "en",
  defaultDepth = "SUMMARY",
}: {
  language?: AstrologyLanguage;
  defaultDepth?: "SUMMARY" | "FULL";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [placePick, setPlacePick] = useState<PlacePick | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthTimeUnknown: false,
      depth: defaultDepth,
      chartStyle: "SOUTH_INDIAN",
      language,
      reportStyle: "PROFESSIONAL",
      system: "THIRUKKANITHAM",
      birthPlace: "",
    },
  });

  const birthTimeUnknown = watch("birthTimeUnknown");
  const lang = (watch("language") ?? language) as AstrologyLanguage;
  const birthPlace = watch("birthPlace") ?? "";
  const depth = watch("depth");
  const reportStyle = watch("reportStyle");

  useEffect(() => {
    if (birthTimeUnknown) setValue("birthTime", "12:00", { shouldValidate: true });
  }, [birthTimeUnknown, setValue]);

  async function onSubmit(data: FormInput) {
    setLoading(true);
    setServerError(null);
    try {
      const profileRes = await fetch("/api/astrology/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          gender: data.gender,
          birthDate: data.birthDate,
          birthTime: data.birthTime,
          birthTimeKnown: !data.birthTimeUnknown,
          birthPlace: data.birthPlace,
          latitude: placePick?.latitude,
          longitude: placePick?.longitude,
          system: data.system,
          fatherName: data.fatherName,
          motherName: data.motherName,
          maritalStatus: data.maritalStatus,
          phone: data.phone,
          email: data.email,
          occupation: data.occupation,
          businessType: data.businessType,
          salary: data.salary,
          community: data.community,
          caste: data.caste,
          gothram: data.gothram,
          customNotes: data.customNotes,
        }),
      });
      const profileJson = await profileRes.json();
      if (!profileRes.ok) {
        setServerError(profileJson.error ?? "Something went wrong");
        return;
      }

      const reportRes = await fetch("/api/astrology/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profileJson.profile.id,
          depth: data.depth,
          chartStyle: data.chartStyle,
          language: data.language,
          reportStyle: data.reportStyle,
        }),
      });
      const reportJson = await reportRes.json();
      if (!reportRes.ok) {
        setServerError(reportJson.error ?? "Couldn't generate the report");
        return;
      }

      router.push(`/astrology/${reportJson.reportId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="celestial-card relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 opacity-20">
        <AnimatedCelestialWheel className="h-full w-full" />
      </div>

      {/* Language switch — controls every label live */}
      <LanguageChips value={lang} onChange={(code) => setValue("language", code)} />

      <form onSubmit={handleSubmit(onSubmit)} className="astro-form relative flex flex-col gap-5">
        {/* ---- Birth details (mandatory) ---- */}
        <SectionCard title={t(lang, "formTitleBirth")} badge={t(lang, "requiredNote")}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label={t(lang, "fullName")} placeholder="e.g. Priya Sundaram" {...register("fullName")} error={errors.fullName?.message} />
              <Select label={t(lang, "gender")} {...register("gender")}>
                <option value="">—</option>
                <option value="male">{t(lang, "genderMale")}</option>
                <option value="female">{t(lang, "genderFemale")}</option>
                <option value="other">{t(lang, "genderOther")}</option>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DateSelect
                label={t(lang, "birthDate")}
                lang={lang}
                value={watch("birthDate") ?? ""}
                error={errors.birthDate?.message}
                onChange={(v) => setValue("birthDate", v, { shouldValidate: !!errors.birthDate })}
              />
              <TimeSelect
                label={t(lang, "birthTime")}
                lang={lang}
                disabled={birthTimeUnknown}
                value={watch("birthTime") ?? ""}
                error={errors.birthTime?.message}
                onChange={(v) => setValue("birthTime", v, { shouldValidate: !!errors.birthTime })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" className="h-4 w-4 rounded border-border-soft accent-amber-500" {...register("birthTimeUnknown")} />
              {t(lang, "birthTimeUnknown")}
            </label>
            <PlaceAutocomplete
              label={t(lang, "birthPlace")}
              value={birthPlace}
              placeholder="e.g. Madurai, Tamil Nadu, India"
              error={errors.birthPlace?.message}
              searchingText={t(lang, "placeSearching")}
              noResultsText={t(lang, "placeNoResults")}
              onChange={(text) => setValue("birthPlace", text, { shouldValidate: !!errors.birthPlace })}
              onPick={setPlacePick}
            />
          </div>
        </SectionCard>

        {/* ---- Additional information (optional, expandable) ---- */}
        <section className="rounded-2xl border border-border-soft bg-surface/40">
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className="flex w-full cursor-pointer items-center justify-between gap-3 p-5 text-left sm:p-6"
          >
            <div>
              <h3 className="text-base font-semibold">{t(lang, "optionalDetails")}</h3>
              <p className="mt-0.5 text-xs text-muted">{t(lang, "optionalHint")}</p>
            </div>
            <AnimatedChevron direction={moreOpen ? "up" : "down"} className="h-5 w-5 shrink-0" />
          </button>
          <AnimatePresence initial={false}>
            {moreOpen && (
              <motion.div
                key="more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2 sm:px-6 sm:pb-6">
                  <Input label={t(lang, "fatherName")} {...register("fatherName")} />
                  <Input label={t(lang, "motherName")} {...register("motherName")} />
                  <Select label={t(lang, "maritalStatus")} {...register("maritalStatus")}>
                    <option value="">—</option>
                    <option value="single">{t(lang, "maritalSingle")}</option>
                    <option value="married">{t(lang, "maritalMarried")}</option>
                    <option value="divorced">{t(lang, "maritalDivorced")}</option>
                    <option value="widowed">{t(lang, "maritalWidowed")}</option>
                  </Select>
                  <Input label={t(lang, "phone")} type="tel" placeholder="+91 98765 43210" {...register("phone")} error={errors.phone?.message} />
                  <Input label={t(lang, "email")} type="email" {...register("email")} error={errors.email?.message} />
                  <Input label={t(lang, "occupation")} {...register("occupation")} />
                  <Input label={t(lang, "businessType")} {...register("businessType")} />
                  <Input label={t(lang, "salary")} {...register("salary")} />
                  <Input label={t(lang, "community")} {...register("community")} />
                  <Input label={t(lang, "caste")} {...register("caste")} />
                  <Input label={t(lang, "gothram")} {...register("gothram")} />
                  <div className="sm:col-span-2">
                    <Textarea label={t(lang, "customNotes")} rows={3} {...register("customNotes")} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ---- Report options ---- */}
        <SectionCard title={t(lang, "reportOptions")}>
          <div className="flex flex-col gap-4">
            {/* Horoscope type — radio cards */}
            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">{t(lang, "chooseDepth")}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(
                  [
                    { value: "SUMMARY", label: t(lang, "depthSummary") },
                    { value: "FULL", label: t(lang, "depthFull") },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("depth", opt.value)}
                    className={cn(
                      "cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                      depth === opt.value
                        ? "border-amber-400/60 bg-[color-mix(in_oklab,var(--color-amber-500)_12%,transparent)]"
                        : "border-border-soft bg-surface hover:border-amber-400/30"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label={t(lang, "chooseSystem")} {...register("system")}>
                <option value="THIRUKKANITHAM">{t(lang, "systemThirukkanitham")}</option>
                <option value="VAKYA">{t(lang, "systemVakya")}</option>
                <option value="KP">{t(lang, "systemKP")}</option>
                <option value="RAMAN">{t(lang, "systemRaman")}</option>
              </Select>
              <Select label={t(lang, "chooseStyle")} {...register("chartStyle")}>
                <option value="SOUTH_INDIAN">{t(lang, "styleSouth")}</option>
                <option value="NORTH_INDIAN">{t(lang, "styleNorth")}</option>
                <option value="EAST_INDIAN">{t(lang, "styleEast")}</option>
              </Select>
            </div>

            {/* Output style — radio cards */}
            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">{t(lang, "chooseOutputStyle")}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(
                  [
                    { value: "PROFESSIONAL", label: t(lang, "outputProfessional") },
                    { value: "TRADITIONAL", label: t(lang, "outputTraditional") },
                    { value: "MODERN", label: t(lang, "outputModern") },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("reportStyle", opt.value)}
                    className={cn(
                      "cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                      reportStyle === opt.value
                        ? "border-amber-400/60 bg-[color-mix(in_oklab,var(--color-amber-500)_12%,transparent)]"
                        : "border-border-soft bg-surface hover:border-amber-400/30"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {serverError && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{serverError}</p>}

        <Button type="submit" disabled={loading} className="w-full sm:w-auto sm:self-end">
          {loading ? t(lang, "calculating") : t(lang, "submit")}
        </Button>
      </form>
    </GlassCard>
  );
}
