"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Mesh } from "three";
import { CinematicCanvas } from "@/components/cinematic/CinematicCanvas";
import { SceneLighting } from "@/components/cinematic/SceneLighting";
import { ParticleField } from "@/components/cinematic/ParticleField";
import { useDeviceTier } from "@/hooks/useDeviceTier";

function EnergyCore({
  full,
  coreColor,
  emissive,
  emissiveIntensity,
  metalness,
  roughness,
  shellColor,
  shellOpacity,
}: {
  full: boolean;
  coreColor: string;
  emissive: string;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
  shellColor: string;
  shellOpacity: number;
}) {
  const core = useRef<Mesh>(null);
  const shell = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (core.current) core.current.rotation.y += delta * 0.12;
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.06;
      shell.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <Icosahedron ref={core} args={[1.35, full ? 6 : 3]}>
        <MeshDistortMaterial
          color={coreColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          distort={0.42}
          speed={1.8}
          roughness={roughness}
          metalness={metalness}
        />
      </Icosahedron>
      <Icosahedron ref={shell} args={[1.95, 1]}>
        <meshBasicMaterial color={shellColor} wireframe transparent opacity={shellOpacity} />
      </Icosahedron>
    </Float>
  );
}

export default function HeroScene({
  fogColor = "#0a0a16",
  particleOpacity = 0.55,
  particleColors,
  bloom = true,
  coreColor = "#6c4dff",
  emissive = "#3f2bb8",
  emissiveIntensity = 0.6,
  metalness = 0.6,
  roughness = 0.15,
  shellColor = "#22d3ee",
  shellOpacity = 0.22,
}: {
  /** Fog tint distant geometry fades toward — match the page backdrop so the
      canvas's transparent-alpha clear blends in instead of muddying toward
      the (dark-tuned) default. */
  fogColor?: string;
  particleOpacity?: number;
  particleColors?: string[];
  /** Bloom postprocessing assumes a dark canvas to glow against — on a light
      backdrop it washes the whole scene out instead, so light-mode callers
      should pass `false`. */
  bloom?: boolean;
  coreColor?: string;
  emissive?: string;
  emissiveIntensity?: number;
  /** Metalness relies on environment reflections this scene doesn't provide
      (no envmap) — high values read as dim/underlit on a light backdrop with
      nothing bright nearby to reflect. Keep low for light-mode callers. */
  metalness?: number;
  roughness?: number;
  shellColor?: string;
  shellOpacity?: number;
}) {
  const tier = useDeviceTier();
  const full = tier === "full";

  return (
    <CinematicCanvas eager camera={{ position: [0, 0, 5.5], fov: 45 }}>
      <SceneLighting fogColor={fogColor} />
      <EnergyCore
        full={full}
        coreColor={coreColor}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        metalness={metalness}
        roughness={roughness}
        shellColor={shellColor}
        shellOpacity={shellOpacity}
      />
      <ParticleField tier={tier} radius={5.5} opacity={particleOpacity} colors={particleColors} />
      {full && bloom ? (
        <EffectComposer>
          <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={1.1} mipmapBlur />
        </EffectComposer>
      ) : null}
    </CinematicCanvas>
  );
}
