"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { astrologyMuhurthamQuerySchema } from "@/lib/validation";
import { MUHURTHAM_EVENTS, type MuhurthamEventType } from "@/lib/astrology/constants";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { AnimatedCelestialWheel } from "@/components/ui/icons/AnimatedCelestialWheel";
import { DateSelect } from "./DateTimeFields";
import { LanguageChips } from "./LanguageChips";
import { TransliterateInput } from "./TransliterateInput";
import { t, type AstrologyLanguage, type AstrologyDictionaryKey } from "@/lib/astrology/i18n";

type FormInput = z.input<typeof astrologyMuhurthamQuerySchema>;

/* Muhurtham dates are always in the future — offer this year plus three. */
const CURRENT_YEAR = new Date().getFullYear();
const FUTURE_YEARS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR + i);

const EVENT_KEY: Record<MuhurthamEventType, AstrologyDictionaryKey> = {
  marriage: "eventMarriage",
  engagement: "eventEngagement",
  griha_pravesam: "eventGrihaPravesam",
  business_opening: "eventBusinessOpening",
  naming_ceremony: "eventNamingCeremony",
  education_start: "eventEducationStart",
  travel: "eventTravel",
  vehicle_purchase: "eventVehiclePurchase",
};

export function MuhurthamForm({ language = "en" }: { language?: AstrologyLanguage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(astrologyMuhurthamQuerySchema),
    defaultValues: { event: "marriage", lang: language },
  });

  const lang = (watch("lang") ?? language) as AstrologyLanguage;

  function onSubmit(data: FormInput) {
    setLoading(true);
    const qs = new URLSearchParams({
      name: data.name,
      event: data.event,
      from: data.from,
      to: data.to,
      place: data.place,
      lang: data.lang ?? "en",
    });
    router.push(`/astrology/muhurtham/report?${qs.toString()}`);
  }

  return (
    <GlassCard className="celestial-card relative overflow-hidden p-7 sm:p-9">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 opacity-20">
        <AnimatedCelestialWheel className="h-full w-full" />
      </div>

      <LanguageChips value={lang} onChange={(code) => setValue("lang", code)} />

      <form onSubmit={handleSubmit(onSubmit)} className="astro-form relative flex flex-col gap-4">
        <h3 className="text-lg font-semibold">{t(lang, "muhurthamFormTitle")}</h3>
        <TransliterateInput
          label={t(lang, "yourName")}
          placeholder="e.g. Arun Kumar"
          lang={lang}
          value={watch("name") ?? ""}
          onChange={(v) => setValue("name", v, { shouldValidate: !!errors.name })}
          error={errors.name?.message}
        />
        <Select label={t(lang, "eventType")} {...register("event")} error={errors.event?.message}>
          {MUHURTHAM_EVENTS.map((ev) => (
            <option key={ev} value={ev}>
              {t(lang, EVENT_KEY[ev])}
            </option>
          ))}
        </Select>
        <DateSelect
          label={t(lang, "dateFrom")}
          lang={lang}
          years={FUTURE_YEARS}
          value={watch("from") ?? ""}
          error={errors.from?.message}
          onChange={(v) => setValue("from", v, { shouldValidate: !!errors.from })}
        />
        <DateSelect
          label={t(lang, "dateTo")}
          lang={lang}
          years={FUTURE_YEARS}
          value={watch("to") ?? ""}
          error={errors.to?.message}
          onChange={(v) => setValue("to", v, { shouldValidate: !!errors.to })}
        />
        <Input label={t(lang, "location")} placeholder="e.g. Coimbatore, Tamil Nadu, India" {...register("place")} error={errors.place?.message} />

        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? t(lang, "calculating") : t(lang, "muhurthamSubmit")}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
