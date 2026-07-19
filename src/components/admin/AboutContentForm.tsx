"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/admin/Modal";

type AboutContent = {
  heroTitle: string;
  heroTagline: string;
  overview: string;
  mission: string;
};

const empty: AboutContent = { heroTitle: "", heroTagline: "", overview: "", mission: "" };

export function AboutContentForm() {
  const toast = useToast();
  const [values, setValues] = useState<AboutContent>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/about-content")
      .then((res) => res.json())
      .then((json) => {
        if (json.content) {
          const { heroTitle, heroTagline, overview, mission } = json.content;
          setValues({ heroTitle, heroTagline, overview, mission });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        toast("error", json.error ?? "Couldn't save");
        return;
      }
      toast("success", "About page content updated");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse rounded-2xl border border-border-soft bg-surface p-6 text-sm text-muted">Loading…</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="rounded-2xl border border-border-soft bg-surface p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Hero title"
          required
          value={values.heroTitle}
          onChange={(e) => setValues((v) => ({ ...v, heroTitle: e.target.value }))}
        />
        <Input
          label="Hero tagline"
          value={values.heroTagline}
          onChange={(e) => setValues((v) => ({ ...v, heroTagline: e.target.value }))}
        />
        <div className="sm:col-span-full">
          <Textarea
            label="Company overview"
            rows={4}
            hint="A brief overview of what the company does — shown at the top of the About Us page."
            value={values.overview}
            onChange={(e) => setValues((v) => ({ ...v, overview: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-full">
          <Textarea
            label="Mission"
            rows={3}
            value={values.mission}
            onChange={(e) => setValues((v) => ({ ...v, mission: e.target.value }))}
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
