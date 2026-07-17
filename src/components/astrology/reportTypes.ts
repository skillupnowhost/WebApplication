import type { ChartResult } from "@/lib/astrology/chart";
import type { ReportNarrative } from "@/lib/astrology/narrative";

export type ReportViewProfile = {
  fullName: string;
  birthPlace: string;
  birthDate: string;
  occupation?: string | null;
  parentsNames?: string | null;
};

export type ReportViewData = {
  reportId: string;
  chartDataId: string;
  depth: "SUMMARY" | "FULL";
  voice: "STORYTELLING" | "PROFESSIONAL" | "ANIMATED";
  language: string;
  narrative: ReportNarrative;
  chart: ChartResult;
  profile: ReportViewProfile;
};
