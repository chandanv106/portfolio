"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, Grid } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { sections } from "@/data/resume";
import { NODES, COLORS } from "./layout";
import ServicePod from "./ServicePod";
import Gateway from "./Gateway";
import EventBus from "./EventBus";
import DataStore from "./DataStore";
import CameraRig from "./CameraRig";

type Props = {
  progressRef: React.RefObject<number>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  activeIndex: number;
  // "low" trims particle counts, resolution, and effects for tablets/weaker GPUs
  quality?: "high" | "low";
};

// The full "living distributed system" — rendered fixed behind the page.
export default function SystemScene({
  progressRef,
  mouseRef,
  activeIndex,
  quality = "high",
}: Props) {
  const low = quality === "low";
  return (
    <Canvas
      dpr={low ? 1 : [1, 1.5]}
      camera={{ fov: 55, near: 0.1, far: 160, position: [0, 1.2, 10.5] }}
      gl={{ antialias: !low, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    >
      <color attach="background" args={[COLORS.bg]} />
      <fog attach="fog" args={[COLORS.bg, 16, 52]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[6, 10, 6]} intensity={120} color="#7dd3fc" />
      <pointLight position={[-8, -6, -30]} intensity={90} color="#a78bfa" />

      <Stars
        radius={130}
        depth={90}
        count={low ? 1400 : 2800}
        factor={3.2}
        saturation={0}
        fade
        speed={0.5}
      />
      <Grid
        position={[0, -7, -46]}
        args={[240, 240]}
        cellSize={2.2}
        sectionSize={11}
        cellColor="#0e2233"
        sectionColor="#12455c"
        fadeDistance={90}
        fadeStrength={2.5}
        infiniteGrid
      />

      <Gateway position={NODES[0]} active={activeIndex === 0} />
      {sections.slice(1).map((s, i) => (
        <ServicePod
          key={s.id}
          position={NODES[i + 1]}
          label={s.service}
          active={activeIndex === i + 1}
          showLabel={activeIndex === i + 1}
          seed={i + 1}
        />
      ))}

      <EventBus count={low ? 45 : 90} />

      {/* databases hang off the project and contact services */}
      <DataStore position={[-11.5, -1, -52]} seed={1} />
      <DataStore position={[10.5, 3, -66]} seed={2} />
      <DataStore position={[3.5, -2.5, -90]} seed={3} />

      <CameraRig progressRef={progressRef} mouseRef={mouseRef} />

      {low ? (
        <EffectComposer>
          <Bloom luminanceThreshold={0.25} mipmapBlur intensity={1.0} radius={0.6} />
        </EffectComposer>
      ) : (
        <EffectComposer>
          <Bloom luminanceThreshold={0.25} mipmapBlur intensity={1.15} radius={0.7} />
          <Vignette eskil={false} offset={0.18} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
