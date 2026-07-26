import * as THREE from "three";

// World positions for each section's service node, going deeper into -Z.
// Index matches `sections` in src/data/resume.ts.
export const NODES: THREE.Vector3[] = [
  new THREE.Vector3(0, -1.2, -2), // gateway (hero) — sits low so text stays clear
  new THREE.Vector3(-6.5, 1, -16), // about
  new THREE.Vector3(6.5, -1, -32), // experience
  new THREE.Vector3(-7.5, 1.5, -48), // projects
  new THREE.Vector3(6.5, 0.5, -64), // skills
  new THREE.Vector3(-6, -1.5, -78), // certifications
  new THREE.Vector3(0, 0, -92), // contact
];

// Camera waypoint per section: offset back (+Z) and slightly to the side
// opposite the node so the DOM content card never covers the node.
export const CAMERA_POINTS: THREE.Vector3[] = NODES.map((n, i) => {
  if (i === 0) return new THREE.Vector3(0, 1.2, 10.5);
  const side = Math.sign(n.x) * -2.2; // drift toward the opposite side
  return new THREE.Vector3(n.x + side, n.y + 1.6, n.z + 8.5);
});

// Portrait phones can't use the side-offset framing: the node would sit
// off-screen behind the full-width content card. Instead the camera sits
// directly behind each node, further back, and aims below it — which lifts
// the pod into the upper third of the screen, above the content.
export const MOBILE_CAMERA_POINTS: THREE.Vector3[] = NODES.map((n, i) =>
  i === 0
    ? new THREE.Vector3(0, 0.4, 12)
    : new THREE.Vector3(n.x, n.y + 0.6, n.z + 11)
);

export const MOBILE_LOOK_OFFSET = new THREE.Vector3(0, -3.2, 0);

// The Kafka event bus curve threads through every node.
export const BUS_CURVE = new THREE.CatmullRomCurve3(
  NODES.map((n) => n.clone()),
  false,
  "catmullrom",
  0.5
);

export const COLORS = {
  bg: "#050510",
  neon: "#22d3ee",
  neonSoft: "#67e8f9",
  violet: "#a78bfa",
  ok: "#34d399",
  dim: "#0f2233",
};
