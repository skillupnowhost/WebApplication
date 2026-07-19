"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useDeviceTier, type DeviceTier } from "@/hooks/useDeviceTier";
import { cn } from "@/lib/cn";

export type { DeviceTier };

/**
 * Shared shell for every WebGL scene: gates mount behind an IntersectionObserver
 * so off-screen scenes never spin up a GL context, caps DPR/AA by device tier,
 * and swallows context-loss instead of leaving a dead black canvas on screen.
 * Never render this directly from a Server Component — always reach it through
 * a `next/dynamic(..., { ssr: false })` scene wrapper (see `scenes/`).
 */
export function CinematicCanvas({
  children,
  className,
  fallback = null,
  eager = false,
  camera,
}: {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  eager?: boolean;
  camera?: { position?: [number, number, number]; fov?: number };
}) {
  const tier = useDeviceTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(eager);

  useEffect(() => {
    if (eager || inView) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [eager, inView]);

  if (tier === "off") {
    return (
      <div ref={containerRef} className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
        {fallback}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {inView ? (
        <Canvas
          dpr={tier === "lite" ? [1, 1.3] : [1, 2]}
          gl={{ antialias: tier === "full", alpha: true, powerPreference: "high-performance" }}
          camera={{ position: camera?.position ?? [0, 0, 6], fov: camera?.fov ?? 42 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
          }}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      ) : (
        fallback
      )}
    </div>
  );
}
