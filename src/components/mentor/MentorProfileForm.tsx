"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ToggleChipGroup } from "@/components/ui/ToggleChipGroup";
import { SUBJECT_OPTIONS, BOARD_OPTIONS, GRADE_OPTIONS } from "@/lib/tutoringOptions";

export type MentorProfile = {
  subject: string;
  qualification: string;
  experienceYears: number;
  bio: string;
  boards: string;
  grades: string;
};

export function MentorProfileForm({ profile }: { profile: MentorProfile }) {
  const [values, setValues] = useState(profile);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function set<K extends keyof MentorProfile>(key: K, v: MentorProfile[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/mentor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Subject"
          options={SUBJECT_OPTIONS}
          value={values.subject}
          onChange={(e) => set("subject", e.target.value)}
        />
        <Input
          label="Qualification"
          value={values.qualification}
          onChange={(e) => set("qualification", e.target.value)}
        />
        <Input
          label="Experience (years)"
          type="number"
          min={0}
          max={60}
          value={values.experienceYears}
          onChange={(e) => set("experienceYears", Number(e.target.value))}
        />
      </div>

      <ToggleChipGroup label="Boards taught" options={BOARD_OPTIONS} value={values.boards} onChange={(v) => set("boards", v)} />
      <ToggleChipGroup label="Grades taught" options={GRADE_OPTIONS} value={values.grades} onChange={(v) => set("grades", v)} />

      <Textarea label="Bio" rows={4} value={values.bio} onChange={(e) => set("bio", e.target.value)} />

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save profile"}
        </Button>
        {status === "saved" && <span className="text-sm text-success">Saved</span>}
        {status === "error" && <span className="text-sm text-danger">Couldn&apos;t save — try again</span>}
      </div>
    </form>
  );
}
