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

function EnergyCore({ full }: { full: boolean }) {
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
          color="#6c4dff"
          emissive="#3f2bb8"
          emissiveIntensity={0.6}
          distort={0.42}
          speed={1.8}
          roughness={0.15}
          metalness={0.6}
        />
      </Icosahedron>
      <Icosahedron ref={shell} args={[1.95, 1]}>
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.22} />
      </Icosahedron>
    </Float>
  );
}

export default function HeroScene() {
  const tier = useDeviceTier();
  const full = tier === "full";

  return (
    <CinematicCanvas eager camera={{ position: [0, 0, 5.5], fov: 45 }}>
      <SceneLighting />
      <EnergyCore full={full} />
      <ParticleField tier={tier} radius={5.5} />
      {full ? (
        <EffectComposer>
          <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={1.1} mipmapBlur />
        </EffectComposer>
      ) : null}
    </CinematicCanvas>
  );
}
