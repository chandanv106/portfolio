"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./layout";

// A database: the classic stacked-cylinder symbol, floating in space.
export default function DataStore({
  position,
  seed = 0,
}: {
  position: [number, number, number];
  seed?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + seed * 5.1;
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(t * 0.6) * 0.25;
      group.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group ref={group} position={position}>
      {[0, 0.5, 1].map((y, i) => (
        <group key={i} position={[0, y - 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.55, 0.32, 24]} />
            <meshStandardMaterial
              color="#0a1120"
              metalness={0.8}
              roughness={0.35}
              emissive={COLORS.violet}
              emissiveIntensity={0.12}
            />
          </mesh>
          <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.015, 8, 32]} />
            <meshBasicMaterial
              color={COLORS.violet}
              transparent
              opacity={0.55}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
