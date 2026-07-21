"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import type { Group } from "three";
import type { DeviceTier } from "@/hooks/useDeviceTier";

/** Ambient floating particle field with slow independent drift, scaled by device tier. */
export function ParticleField({
  tier,
  count,
  radius = 7,
  colors = ["#6c4dff", "#22d3ee", "#a855f7"],
  opacity = 0.55,
}: {
  tier: DeviceTier;
  count?: number;
  radius?: number;
  colors?: string[];
  opacity?: number;
}) {
  const group = useRef<Group>(null);
  const n = count ?? (tier === "full" ? 260 : 110);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.015;
  });

  return (
    <group ref={group}>
      {colors.map((color, i) => (
        <Sparkles
          key={color}
          count={Math.round(n / colors.length)}
          scale={[radius * 2, radius * 1.4, radius * 2]}
          size={2.4 + i}
          speed={0.25}
          opacity={opacity}
          color={color}
          noise={1.2}
        />
      ))}
    </group>
  );
}
