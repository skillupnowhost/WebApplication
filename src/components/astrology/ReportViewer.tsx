"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { StorytellingReport } from "./reportStyles/StorytellingReport";
import { PrintReport } from "./reportStyles/PrintReport";
import { AnimatedReport } from "./reportStyles/AnimatedReport";
import type { ReportViewData } from "./reportTypes";

const VOICE_OPTIONS = [
  { label: "Storytelling", value: "STORYTELLING" },
  { label: "Professional print", value: "PROFESSIONAL" },
  { label: "Dynamic animated", value: "ANIMATED" },
];

const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Tamil", value: "ta" },
];

const PAGE_SIZE_OPTIONS = [
  { label: "A4", value: "A4" },
  { label: "A5", value: "A5" },
  { label: "A3", value: "A3" },
];

export function ReportViewer({ data }: { data: ReportViewData }) {
  const router = useRouter();
  const [switching, setSwitching] = useState(false);
  const [pageSize, setPageSize] = useState("A4");
  const [error, setError] = useState<string | null>(null);

  async function switchTo(next: { voice?: string; language?: string }) {
    setSwitching(true);
    setError(null);
    try {
      const res = await fetch("/api/astrology/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chartDataId: data.chartDataId,
          depth: data.depth,
          voice: next.voice ?? data.voice,
          language: next.language ?? data.language,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not switch report");
        return;
      }
      router.push(`/astrology/${json.reportId}`);
    } finally {
      setSwitching(false);
    }
  }

  const Style = data.voice === "STORYTELLING" ? StorytellingReport : data.voice === "ANIMATED" ? AnimatedReport : PrintReport;

  return (
    <div className="flex flex-col gap-8 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-border-soft bg-surface p-4 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-2">
          <Select
            className="w-auto"
            value={data.voice}
            onChange={(e) => switchTo({ voice: e.target.value })}
            options={VOICE_OPTIONS}
            disabled={switching}
          />
          <Select
            className="w-auto"
            value={data.language}
            onChange={(e) => switchTo({ language: e.target.value })}
            options={LANGUAGE_OPTIONS}
            disabled={switching}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select className="w-auto" value={pageSize} onChange={(e) => setPageSize(e.target.value)} options={PAGE_SIZE_OPTIONS} />
          <Button href={`/api/astrology/reports/${data.reportId}/pdf?size=${pageSize}`} variant="primary" size="sm">
            Download PDF
          </Button>
        </div>
      </div>

      {error && <p className="mx-auto text-sm text-danger">{error}</p>}
      {data.voice === "ANIMATED" && (
        <p className="mx-auto -mt-4 text-xs text-muted">PDF export uses the Professional layout for animated reports.</p>
      )}

      <Style data={data} />
    </div>
  );
}
