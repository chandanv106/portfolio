"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { COLORS } from "./layout";

type Props = {
  position: THREE.Vector3;
  label: string;
  active: boolean;
  showLabel: boolean;
  seed?: number;
};

// A hexagonal "microservice pod": dark hex prism with neon edges,
// an orbiting ring, and a floating service-name label.
export default function ServicePod({ position, label, active, showLabel, seed = 0 }: Props) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  const edges = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1.15, 1.15, 1.3, 6);
    return new THREE.EdgesGeometry(geo);
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime + seed * 7.3;
    if (group.current) {
      // gentle float
      group.current.position.y = position.y + Math.sin(t * 0.8) * 0.18;
      const targetScale = active ? 1.18 : 1;
      group.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        1 - Math.exp(-delta * 6)
      );
    }
    if (ring.current) {
      ring.current.rotation.z = t * (active ? 0.9 : 0.25);
      ring.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.15;
    }
    if (core.current) {
      const mat = core.current.material as THREE.MeshStandardMaterial;
      const target = active ? 2.2 : 0.55;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        target + Math.sin(t * 2.2) * 0.15,
        1 - Math.exp(-delta * 5)
      );
    }
  });

  return (
    <group ref={group} position={position}>
      {/* dark body */}
      <mesh>
        <cylinderGeometry args={[1.15, 1.15, 1.3, 6]} />
        <meshStandardMaterial
          color="#0a1120"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>
      {/* neon edge wireframe */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={COLORS.neon} transparent opacity={active ? 0.95 : 0.45} />
      </lineSegments>
      {/* glowing core */}
      <mesh ref={core}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color={COLORS.neon}
          emissive={COLORS.neon}
          emissiveIntensity={0.55}
          toneMapped={false}
        />
      </mesh>
      {/* orbit ring */}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.02, 8, 64]} />
        <meshBasicMaterial
          color={active ? COLORS.neonSoft : COLORS.violet}
          transparent
          opacity={active ? 0.9 : 0.35}
          toneMapped={false}
        />
      </mesh>
      {/* service label — only near the active section, to avoid clutter */}
      {showLabel && (
        <Html center position={[0, -1.6, 0]} zIndexRange={[10, 0]}>
          <div className={`pod-label ${active ? "" : "dim"}`}>
            <span className="dot" />
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
