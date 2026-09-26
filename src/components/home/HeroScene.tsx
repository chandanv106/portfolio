"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// 3D simplex noise, Ashima Arts / Stefan Gustavson (MIT).
const SNOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const BLOB = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uPull;
uniform vec3 uPointer;
${SNOISE}
vec3 orthogonalTo(vec3 v){
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}
// Two octaves of noise ripple the surface; the side facing the pointer
// swells toward it.
vec3 displace(vec3 p){
  vec3 dir = normalize(p);
  float t = uTime;
  float n = snoise(dir * uFreq + vec3(t * 0.21, t * 0.17, t * 0.13));
  n += 0.4 * snoise(dir * uFreq * 2.4 - vec3(t * 0.28, t * 0.2, t * 0.3));
  float toward = pow(max(dot(dir, uPointer), 0.0), 3.0);
  return dir * (1.0 + n * uAmp + toward * uPull);
}`;

// Liquid chrome: a physical metal material whose vertices are displaced in
// the vertex shader, with normals rebuilt from the displaced surface so the
// reflections follow every ripple.
function createBlobMaterial() {
  const uniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.2 },
    uFreq: { value: 1.1 },
    uPull: { value: 0.15 },
    uPointer: { value: new THREE.Vector3(0, 0, 1) },
  };
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#f4f4f7"),
    metalness: 1,
    roughness: 0.13,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    iridescence: 0.9,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [120, 440],
    envMapIntensity: 1.25,
  });
  material.userData.uniforms = uniforms;
  material.customProgramCacheKey = () => "liquid-chrome";
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${BLOB}`)
      .replace(
        "#include <beginnormal_vertex>",
        /* glsl */ `
        vec3 blobPos = displace(position);
        vec3 blobT = orthogonalTo(normal);
        vec3 blobB = normalize(cross(normal, blobT));
        vec3 blobP1 = displace(position + blobT * 0.01);
        vec3 blobP2 = displace(position + blobB * 0.01);
        vec3 objectNormal = normalize(cross(blobP1 - blobPos, blobP2 - blobPos));
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif`
      )
      .replace("#include <begin_vertex>", "vec3 transformed = blobPos;");
  };
  return material;
}

type BlobUniforms = ReturnType<typeof createBlobMaterial>["userData"]["uniforms"];

function Blob({ mobile }: { mobile: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  // Pointer state lives here: written by the listeners, read every frame.
  const pointer = useRef({ x: 0, y: 0, energy: 0, lastMove: 0 });
  const scratch = useRef({ dir: new THREE.Vector3(), inv: new THREE.Quaternion() });
  const { viewport } = useThree();
  const material = useMemo(() => createBlobMaterial(), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, mobile ? 110 : 180, mobile ? 110 : 180), [mobile]);

  // Mouse, finger and (on Android) phone tilt all steer the chrome.
  useEffect(() => {
    const p = pointer.current;
    const feed = (clientX: number, clientY: number) => {
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -((clientY / window.innerHeight) * 2 - 1);
      p.energy = Math.min(1, p.energy + Math.hypot(x - p.x, y - p.y) * 2.2);
      p.x = x;
      p.y = y;
      p.lastMove = performance.now();
    };
    const onPointer = (e: PointerEvent) => feed(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) feed(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      p.x = Math.max(-1, Math.min(1, e.gamma / 30));
      p.y = Math.max(-1, Math.min(1, (40 - e.beta) / 30));
      p.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    // iOS needs a permission prompt for motion; only listen where it's free.
    const tiltFree = "DeviceOrientationEvent" in window && !("requestPermission" in DeviceOrientationEvent);
    if (tiltFree) window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      if (tiltFree) window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  const size = Math.min(viewport.width, viewport.height) * (mobile ? 0.34 : 0.31);
  const baseX = mobile ? 0 : viewport.width * 0.17;
  const baseY = mobile ? viewport.height * 0.1 : 0.05;

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const p = pointer.current;
    const { dir, inv } = scratch.current;
    const u = (m.material as THREE.MeshPhysicalMaterial).userData.uniforms as BlobUniforms;
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;

    // No input for a while: drift on a slow figure-eight so it never sits still.
    if (performance.now() - p.lastMove > 2500) {
      p.x += (Math.sin(t * 0.45) * 0.55 - p.x) * 0.02;
      p.y += (Math.sin(t * 0.3) * Math.cos(t * 0.2) * 0.45 - p.y) * 0.02;
    }
    p.energy *= Math.exp(-dt * 2.2);

    u.uTime.value += dt * (1 + p.energy * 1.5);
    u.uAmp.value += (0.19 + p.energy * 0.28 - u.uAmp.value) * 0.08;
    u.uPull.value += (0.16 + p.energy * 0.3 - u.uPull.value) * 0.08;

    m.rotation.y += dt * 0.12;
    m.rotation.x += (-p.y * 0.35 - m.rotation.x) * 0.04;
    m.rotation.z += (-p.x * 0.2 - m.rotation.z) * 0.04;
    m.position.x += (baseX + p.x * 0.22 - m.position.x) * 0.05;
    m.position.y += (baseY + p.y * 0.18 - m.position.y) * 0.05;

    // The surface bulges toward the pointer: express that direction in the
    // blob's own (rotating) space.
    dir.set(p.x * 1.4, p.y * 1.4, 1).normalize();
    inv.copy(m.quaternion).invert();
    dir.applyQuaternion(inv);
    u.uPointer.value.lerp(dir, 0.12).normalize();

    // Swirl the studio lights with the pointer so reflections slide across the chrome.
    state.scene.environmentRotation.set(p.y * 0.35, p.x * 0.7 + t * 0.04, 0);
  });

  return <mesh ref={mesh} geometry={geometry} material={material} position={[baseX, baseY, 0]} scale={size} />;
}

// Studio lighting for the chrome: a soft white key plus coloured strips that
// show up as warm/cool reflections.
function Lights() {
  return (
    <>
      <Lightformer form="rect" intensity={3} position={[0, 5, -4]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" color="#ff6b2c" intensity={9} position={[-5, 0.5, -1]} scale={[3, 8, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" color="#4f7bff" intensity={7} position={[5, -0.5, -1]} scale={[3, 8, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="circle" color="#ff4d8d" intensity={5} position={[0, -4, 2]} scale={3} rotation-x={-Math.PI / 2} />
      <Lightformer form="ring" color="#ffffff" intensity={2.5} position={[0, 0, -6]} scale={6} />
      <Lightformer form="rect" color="#ffd27a" intensity={2} position={[2, 2, 5]} scale={[4, 1, 1]} />
    </>
  );
}

export default function HeroScene({ active, mobile }: { active: boolean; mobile: boolean }) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
    >
      <Blob mobile={mobile} />
      <Sparkles count={mobile ? 28 : 60} scale={[9, 5, 3]} size={mobile ? 2.5 : 3.2} speed={0.3} opacity={0.55} color="#ffc2a3" />
      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <Lights />
      </Environment>
    </Canvas>
  );
}
