"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BUS_CURVE, COLORS } from "./layout";

// The Kafka event bus: a glowing tube threading through every service
// node, with message "packets" streaming along it.
export default function EventBus({ count = 90 }: { count?: number }) {
  const instances = useRef<THREE.InstancedMesh>(null);

  const tube = useMemo(
    () => new THREE.TubeGeometry(BUS_CURVE, 200, 0.06, 8, false),
    []
  );

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: i / count + Math.random() * 0.008,
        speed: 0.012 + Math.random() * 0.02,
        wobble: Math.random() * Math.PI * 2,
      })),
    [count]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const mesh = instances.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const u = (p.offset + t * p.speed) % 1;
      const pos = BUS_CURVE.getPointAt(u);
      // slight orbit around the tube so packets shimmer
      const wob = 0.14;
      dummy.position.set(
        pos.x + Math.sin(t * 2 + p.wobble) * wob,
        pos.y + Math.cos(t * 2 + p.wobble) * wob,
        pos.z
      );
      const s = 0.75 + Math.sin(t * 3 + p.wobble) * 0.25;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* the bus tube */}
      <mesh geometry={tube}>
        <meshBasicMaterial
          color={COLORS.neon}
          transparent
          opacity={0.16}
          toneMapped={false}
        />
      </mesh>
      {/* message packets */}
      <instancedMesh key={count} ref={instances} args={[undefined, undefined, count]}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshBasicMaterial color={COLORS.neonSoft} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
