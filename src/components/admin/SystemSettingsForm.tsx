"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Modal";

type Settings = {
  maintenanceMode: boolean;
  allowNewSignups: boolean;
  supportEmail: string;
  announcementBanner: string | null;
};

const empty: Settings = { maintenanceMode: false, allowNewSignups: true, supportEmail: "", announcementBanner: "" };

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

export function SystemSettingsForm() {
  const toast = useToast();
  const [values, setValues] = useState<Settings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.settings) {
          const { maintenanceMode, allowNewSignups, supportEmail, announcementBanner } = json.settings;
          setValues({ maintenanceMode, allowNewSignups, supportEmail, announcementBanner: announcementBanner ?? "" });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        toast("error", json.error ?? "Couldn't save");
        return;
      }
      toast("success", "System settings updated");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ToggleField
          label="Maintenance mode"
          hint="Persisted here for a future pass — no page currently reads this flag to show a maintenance screen."
          checked={values.maintenanceMode}
          onChange={(v) => setValues((s) => ({ ...s, maintenanceMode: v }))}
        />
        <ToggleField
          label="Allow new signups"
          hint="Persisted here for a future pass — signup routes don't check this flag yet."
          checked={values.allowNewSignups}
          onChange={(v) => setValues((s) => ({ ...s, allowNewSignups: v }))}
        />
        <div className="sm:col-span-full">
          <Input
            label="Support email"
            type="email"
            required
            value={values.supportEmail}
            onChange={(e) => setValues((s) => ({ ...s, supportEmail: e.target.value }))}
            hint="Defaults to the general inbox from src/lib/contactInfo.ts."
          />
        </div>
        <div className="sm:col-span-full">
          <Textarea
            label="Announcement banner"
            rows={2}
            value={values.announcementBanner ?? ""}
            onChange={(e) => setValues((s) => ({ ...s, announcementBanner: e.target.value }))}
            hint="Optional site-wide message. Persisted here but not yet rendered anywhere public — wiring it into the navbar/footer is a follow-up."
            placeholder="Leave blank to show nothing"
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
