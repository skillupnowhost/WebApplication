"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { CinematicCanvas } from "@/components/cinematic/CinematicCanvas";
import { SceneLighting } from "@/components/cinematic/SceneLighting";
import { ParticleField } from "@/components/cinematic/ParticleField";
import { useDeviceTier } from "@/hooks/useDeviceTier";

function GlowPlane() {
  const mesh = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (mesh.current) mesh.current.position.y = -2.4 + Math.sin(clock.elapsedTime * 0.3) * 0.06;
  });
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -2.4, 0]}>
      <planeGeometry args={[24, 24, 40, 40]} />
      <meshBasicMaterial color="#6c4dff" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

/** Lighter ambient backdrop scene for secondary flagship moments — no bloom, fewer particles than HeroScene. */
export default function GlowGridScene({ eager = false }: { eager?: boolean }) {
  const tier = useDeviceTier();
  return (
    <CinematicCanvas eager={eager} camera={{ position: [0, 0.6, 6], fov: 50 }}>
      <SceneLighting fogFar={14} />
      <GlowPlane />
      <ParticleField tier={tier} count={tier === "full" ? 140 : 60} radius={6} />
    </CinematicCanvas>
  );
}
