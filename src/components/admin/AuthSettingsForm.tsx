"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Modal";

type Settings = {
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  otpResendCooldownSeconds: number;
};

const empty: Settings = { requireEmailVerification: false, requirePhoneVerification: false, otpResendCooldownSeconds: 30 };

function ToggleField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border-soft bg-surface px-4 py-3 sm:col-span-full">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-300 ${
          checked ? "brand-gradient-bg" : "bg-surface-2 border border-border-soft"
        }`}
      >
        <span
          className={`absolute top-1/2 h-4.5 w-4.5 -translate-y-1/2 rounded-full bg-white shadow transition-all duration-300 ${
            checked ? "left-[calc(100%-1.375rem)]" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

export function AuthSettingsForm() {
  const toast = useToast();
  const [values, setValues] = useState<Settings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.settings) {
          const { requireEmailVerification, requirePhoneVerification, otpResendCooldownSeconds } = json.settings;
          setValues({ requireEmailVerification, requirePhoneVerification, otpResendCooldownSeconds });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/auth-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        toast("error", json.error ?? "Couldn't save");
        return;
      }
      toast("success", "Authentication settings updated");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <span key={i} className="block h-12 w-full animate-pulse rounded-xl bg-surface-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="rounded-2xl border border-border-soft bg-surface p-6 shadow-[var(--shadow-soft)] transition-all duration-300"
    >
      <p className="mb-5 text-xs text-muted">
        These reflect real auth behavior already hardcoded in <code className="rounded bg-surface-2 px-1 py-0.5">src/lib/otp.ts</code>{" "}
        and <code className="rounded bg-surface-2 px-1 py-0.5">src/lib/auth.ts</code>. Saving here persists the values for
        visibility and a future pass — those files still use their own hardcoded constants and don&apos;t read this table yet.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ToggleField
          label="Require email verification"
          hint="Not yet enforced by the login/signup flow — display-only for now."
          checked={values.requireEmailVerification}
          onChange={(v) => setValues((s) => ({ ...s, requireEmailVerification: v }))}
        />
        <ToggleField
          label="Require phone verification"
          hint="Not yet enforced by the login/signup flow — display-only for now."
          checked={values.requirePhoneVerification}
          onChange={(v) => setValues((s) => ({ ...s, requirePhoneVerification: v }))}
        />
        <div className="sm:col-span-full">
          <Input
            label="OTP resend cooldown (seconds)"
            type="number"
            min={10}
            max={300}
            required
            value={values.otpResendCooldownSeconds}
            onChange={(e) => setValues((s) => ({ ...s, otpResendCooldownSeconds: Number(e.target.value) }))}
            hint="Mirrors the 30s RESEND_COOLDOWN_SECONDS constant hardcoded in src/lib/otp.ts. Changing this value here does not change the live cooldown."
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
