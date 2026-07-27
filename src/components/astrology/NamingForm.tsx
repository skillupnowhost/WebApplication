"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { astrologyNamingQuerySchema } from "@/lib/validation";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { AnimatedOm } from "@/components/ui/icons/AnimatedOm";
import { DateSelect, TimeSelect } from "./DateTimeFields";
import { LanguageChips } from "./LanguageChips";
import { t, type AstrologyLanguage } from "@/lib/astrology/i18n";

type FormInput = z.input<typeof astrologyNamingQuerySchema>;

type CountMode = "default" | "100" | "300" | "500" | "custom";

export function NamingForm({ language = "en" }: { language?: AstrologyLanguage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countMode, setCountMode] = useState<CountMode>("default");
  const [customCount, setCustomCount] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(astrologyNamingQuerySchema),
    defaultValues: { gender: "both", lang: language },
  });

  const lang = (watch("lang") ?? language) as AstrologyLanguage;

  function onSubmit(data: FormInput) {
    setLoading(true);
    const qs = new URLSearchParams({
      birthDate: data.birthDate,
      birthTime: data.birthTime,
      place: data.place,
      gender: data.gender ?? "both",
      lang: data.lang ?? "en",
    });
    if (data.letter) qs.set("letter", data.letter);

    const count =
      countMode === "custom"
        ? Math.min(5000, Math.max(1, parseInt(customCount, 10) || 0))
        : countMode !== "default"
          ? Number(countMode)
          : undefined;
    if (count) qs.set("count", String(count));

    router.push(`/astrology/naming/report?${qs.toString()}`);
  }

  return (
    <GlassCard className="celestial-card relative overflow-hidden p-7 sm:p-9">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 opacity-20">
        <AnimatedOm className="h-full w-full" />
      </div>

      <LanguageChips value={lang} onChange={(code) => setValue("lang", code)} />

      <form onSubmit={handleSubmit(onSubmit)} className="astro-form relative flex flex-col gap-4">
        <h3 className="text-lg font-semibold">{t(lang, "namingFormTitle")}</h3>
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
            value={watch("birthTime") ?? ""}
            error={errors.birthTime?.message}
            onChange={(v) => setValue("birthTime", v, { shouldValidate: !!errors.birthTime })}
          />
        </div>
        <Input label={t(lang, "birthPlace")} placeholder="e.g. Pollachi, Tamil Nadu, India" {...register("place")} error={errors.place?.message} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label={t(lang, "babyGender")} {...register("gender")}>
            <option value="both">{t(lang, "genderBoth")}</option>
            <option value="boy">{t(lang, "genderBoy")}</option>
            <option value="girl">{t(lang, "genderGirl")}</option>
          </Select>
          <Input label={t(lang, "preferredLetter")} maxLength={4} placeholder="e.g. K" {...register("letter")} error={errors.letter?.message} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label={t(lang, "namesCount")}
            value={countMode}
            onChange={(e) => setCountMode(e.target.value as CountMode)}
          >
            <option value="default">{t(lang, "namesCountDefault")}</option>
            <option value="100">100</option>
            <option value="300">300</option>
            <option value="500">500</option>
            <option value="custom">{t(lang, "namesCountCustom")}</option>
          </Select>
          {countMode === "custom" && (
            <Input
              type="number"
              min={1}
              max={5000}
              label={t(lang, "namesCountCustomLabel")}
              value={customCount}
              onChange={(e) => setCustomCount(e.target.value)}
            />
          )}
        </div>
        {countMode !== "default" && <p className="text-xs text-muted">{t(lang, "namesCountHint")}</p>}

        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? t(lang, "calculating") : t(lang, "namingSubmit")}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
