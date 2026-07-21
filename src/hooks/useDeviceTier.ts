"use client";

import { useSyncExternalStore } from "react";

export type DeviceTier = "full" | "lite" | "off";

/**
 * "off" skips WebGL entirely (reduced motion, very low-end device); "lite"
 * renders the 3D scene at reduced particle count/DPR with no postprocessing
 * (coarse pointer + few cores, i.e. most phones); "full" is desktop-grade.
 */
function computeTier(): DeviceTier {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";

  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (cores <= 2) return "off";
  if (coarse || cores <= 4) return "lite";
  return "full";
}

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getServerSnapshot(): DeviceTier {
  return "lite";
}

export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribe, computeTier, getServerSnapshot);
}
