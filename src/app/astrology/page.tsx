import { Suspense } from "react";
import { AstroHubBody } from "@/components/astrology/AstroHubBody";

export const metadata = { title: "MyLoginn Astrology — Your Divine Self-Discovery" };

export default function AstrologyLandingPage() {
  return (
    <Suspense fallback={null}>
      <AstroHubBody />
    </Suspense>
  );
}
