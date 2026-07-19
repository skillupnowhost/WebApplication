"use client";

/** Shared lights/fog rig — violet key + cyan rim, matching the site's brand/accent tokens. */
export function SceneLighting({ fogFar = 12 }: { fogFar?: number }) {
  return (
    <>
      <fog attach="fog" args={["#0a0a16", 4, fogFar]} />
      <ambientLight intensity={0.35} color="#8f8bff" />
      <pointLight position={[3, 2, 4]} intensity={45} color="#6c4dff" distance={14} decay={2} />
      <pointLight position={[-3.5, -1.5, 3]} intensity={30} color="#22d3ee" distance={14} decay={2} />
      <pointLight position={[0, -3, -2]} intensity={18} color="#a855f7" distance={16} decay={2} />
    </>
  );
}
