"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  CAMERA_POINTS,
  MOBILE_CAMERA_POINTS,
  MOBILE_LOOK_OFFSET,
  NODES,
} from "./layout";

// smoothstep gives the camera a "dwell" at each node: it lingers on a
// section, then glides quickly to the next as you scroll between them.
function smoothstep(x: number) {
  return x * x * (3 - 2 * x);
}

type Props = {
  // 0..1 document scroll progress, written by the scroll listener
  progressRef: React.RefObject<number>;
  // -1..1 normalized mouse, for subtle parallax
  mouseRef: React.RefObject<{ x: number; y: number }>;
  // portrait phones use head-on framing with the pod lifted above the card
  mobile?: boolean;
};

export default function CameraRig({ progressRef, mouseRef, mobile = false }: Props) {
  const path = mobile ? MOBILE_CAMERA_POINTS : CAMERA_POINTS;
  const targetPos = useRef(new THREE.Vector3().copy(path[0]));
  const lookAt = useRef(new THREE.Vector3().copy(NODES[0]));
  const smoothedLook = useRef(new THREE.Vector3().copy(NODES[0]));

  useFrame(({ camera }, delta) => {
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const segCount = path.length - 1;
    const seg = p * segCount;
    const i = Math.min(Math.floor(seg), segCount - 1);
    const f = smoothstep(seg - i);

    targetPos.current.lerpVectors(path[i], path[i + 1], f);
    lookAt.current.lerpVectors(NODES[i], NODES[i + 1], f);
    if (mobile) lookAt.current.add(MOBILE_LOOK_OFFSET);

    // mouse parallax drift (pointer-driven, so it stays idle on touch)
    const m = mouseRef.current ?? { x: 0, y: 0 };
    targetPos.current.x += m.x * 0.6;
    targetPos.current.y += m.y * 0.35;

    const k = 1 - Math.exp(-delta * 4.5);
    camera.position.lerp(targetPos.current, k);
    smoothedLook.current.lerp(lookAt.current, k);
    camera.lookAt(smoothedLook.current);
  });

  return null;
}
