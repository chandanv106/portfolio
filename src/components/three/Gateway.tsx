"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./layout";

// The API Gateway: a large double ring with a spinning hex core.
// This is the "front door" of the system — the hero node.
export default function Gateway({
  position,
  active,
}: {
  position: THREE.Vector3;
  active: boolean;
}) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const hex = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (outer.current) outer.current.rotation.z = t * 0.12;
    if (inner.current) inner.current.rotation.z = -t * 0.3;
    if (hex.current) {
      hex.current.rotation.y = t * 0.5;
      hex.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={outer}>
        <torusGeometry args={[2.6, 0.035, 12, 96]} />
        <meshBasicMaterial color={COLORS.neon} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[2.1, 0.02, 12, 96]} />
        <meshBasicMaterial color={COLORS.violet} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh ref={hex}>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#0a1120"
          emissive={COLORS.neon}
          emissiveIntensity={active ? 1.4 : 0.7}
          metalness={0.9}
          roughness={0.25}
          wireframe
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
