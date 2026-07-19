"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { astrologyNumerologyQuerySchema } from "@/lib/validation";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { AnimatedSparkle } from "@/components/ui/icons/AnimatedSparkle";
import { DateSelect } from "./DateTimeFields";
import { LanguageChips } from "./LanguageChips";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";

type FormInput = z.input<typeof astrologyNumerologyQuerySchema>;

export function NumerologyForm({ language = "en" }: { language?: AstrologyLanguage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(astrologyNumerologyQuerySchema),
    defaultValues: { lang: language },
  });

  const lang = (watch("lang") ?? language) as AstrologyLanguage;

  function onSubmit(data: FormInput) {
    setLoading(true);
    const qs = new URLSearchParams({ name: data.name, birthDate: data.birthDate, lang: data.lang ?? "en" });
    if (data.compareNames?.trim()) qs.set("compareNames", data.compareNames.trim());
    router.push(`/astrology/numerology/report?${qs.toString()}`);
  }

  return (
    <GlassCard className="celestial-card relative overflow-hidden p-7 sm:p-9">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 opacity-20">
        <AnimatedSparkle className="h-full w-full" />
      </div>

      <LanguageChips value={lang} onChange={(code) => setValue("lang", code)} />

      <form onSubmit={handleSubmit(onSubmit)} className="astro-form relative flex flex-col gap-4">
        <h3 className="text-lg font-semibold">{t(lang, "numerologyFormTitle")}</h3>
        <Input label={t(lang, "fullName")} placeholder="e.g. Priya Sundaram" {...register("name")} error={errors.name?.message} />
        <DateSelect
          label={t(lang, "birthDate")}
          lang={lang}
          value={watch("birthDate") ?? ""}
          error={errors.birthDate?.message}
          onChange={(v) => setValue("birthDate", v, { shouldValidate: !!errors.birthDate })}
        />

        <Textarea label={t(lang, "namesCompare")} rows={3} placeholder={"Priya S\nPriyaa Sundaram\nPria Sundaram"} {...register("compareNames")} />

        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? t(lang, "calculating") : t(lang, "numerologySubmit")}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
